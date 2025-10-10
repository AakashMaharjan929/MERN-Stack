// Enhanced SeatLayoutEditor.jsx - With sequential seat numbering skipping aisles (removed row/column remove buttons)
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { getScreenById, updateScreen } from '../../api/screenAPI'; // Adjust path

const SeatLayoutEditor = () => {
  const { id } = useParams(); // Screen ID from route /screens/layout/:id
  const navigate = useNavigate();
  const [screen, setScreen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editedLayout, setEditedLayout] = useState([]); // 2D array for layout

  // Helper to renumber a single row (sequential, skipping nulls)
  const renumberRow = (row, rowIndex) => {
    let seatCount = 0;
    return row.map(seat => {
      if (seat === null) return null;
      seatCount++;
      return { ...seat, seatNumber: `${String.fromCharCode(65 + rowIndex)}${seatCount}` };
    });
  };

  // Helper to renumber entire layout
  const renumberLayout = (layout) => {
    return layout.map((row, rowIndex) => renumberRow(row, rowIndex));
  };

  // Fetch screen on mount
  useEffect(() => {
    if (!id) {
      toast.error('Screen ID required');
      navigate('/admin/screens/list');
      return;
    }
    const fetchScreen = async () => {
      try {
        const data = await getScreenById(id);
        setScreen(data);
        // Ensure layout is rectangular; pad with nulls if needed for irregular shapes
        const maxCols = Math.max(...data.seatLayout.map(row => row.length));
        const paddedLayout = data.seatLayout.map(row => {
          while (row.length < maxCols) row.push(null);
          return [...row];
        });
        // Renumber to sequential, skipping nulls
        const numberedLayout = renumberLayout(paddedLayout);
        setEditedLayout(numberedLayout);
      } catch (err) {
        toast.error('Failed to load screen layout');
        navigate('/admin/screens/list');
      } finally {
        setLoading(false);
      }
    };
    fetchScreen();
  }, [id, navigate]);

  // Helper to add a new row
  const addRow = (index = editedLayout.length) => {
    const newRow = Array(editedLayout[0]?.length || 15).fill(null); // Default to current max cols, all empty (for aisles/seats)
    const newLayout = [...editedLayout];
    newLayout.splice(index, 0, newRow);
    // Renumber entire layout (row indices may shift)
    const numberedLayout = renumberLayout(newLayout);
    setEditedLayout(numberedLayout);
  };

  // Helper to remove a row
  const removeRow = (index) => {
    if (editedLayout.length <= 1) {
      toast.error('At least one row required');
      return;
    }
    const newLayout = editedLayout.filter((_, i) => i !== index);
    // Renumber entire layout (row indices may shift)
    const numberedLayout = renumberLayout(newLayout);
    setEditedLayout(numberedLayout);
  };

  // Helper to add a column
  const addColumn = (index = editedLayout[0]?.length || 0) => {
    const newLayout = editedLayout.map(row => {
      const newRow = [...row];
      newRow.splice(index, 0, null); // Insert empty cell
      return newRow;
    });
    // Renumber all rows (insert null doesn't change numbers, but ensure)
    const numberedLayout = renumberLayout(newLayout);
    setEditedLayout(numberedLayout);
  };

  // Helper to remove a column
  const removeColumn = (index) => {
    if ((editedLayout[0]?.length || 0) <= 1) {
      toast.error('At least one column required');
      return;
    }
    const newLayout = editedLayout.map(row => {
      const newRow = [...row];
      newRow.splice(index, 1);
      return newRow;
    });
    // Renumber all rows (removal may shift, but numbers stay sequential)
    const numberedLayout = renumberLayout(newLayout);
    setEditedLayout(numberedLayout);
  };

  const handleSeatTypeChange = (rowIndex, colIndex, newType) => {
    setEditedLayout(prevLayout => {
      const newLayout = prevLayout.map(r => [...r]);
      if (newType === 'Aisle') {
        newLayout[rowIndex][colIndex] = null;
      } else {
        // Temp set without number; renumber will assign correct sequential
        newLayout[rowIndex][colIndex] = { seatNumber: '', type: newType };
      }
      // Renumber only this row (since change affects only this row's sequence)
      newLayout[rowIndex] = renumberRow(newLayout[rowIndex], rowIndex);
      return newLayout;
    });
  };

  // Calculate totals
  const totalSeats = editedLayout.flat().filter(seat => seat !== null).length;
  const totalRows = editedLayout.length;
  const totalCols = editedLayout[0]?.length || 0;

  const onSave = async () => {
    // Layout is already numbered; no extra cleanup needed
    setSaving(true);
    try {
      await updateScreen(id, { seatLayout: editedLayout });
      toast.success(`Seat layout updated! Total seats: ${totalSeats}`);
      setTimeout(() => navigate('/admin/screens/list'), 1500);
    } catch (err) {
      toast.error(err.error || 'Failed to save layout');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-[#6B7280]">Loading layout...</div>;
  if (!screen) return <div className="text-red-500">Screen not found</div>;

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { background: '#fff', color: '#2E2E2E', border: '1px solid #E5E7EB' },
          success: { style: { background: '#F0FDF4', color: '#065F46' } },
          error: { style: { background: '#FEF2F2', color: '#991B1B' } },
        }}
      />
      <div className="p-6 bg-white rounded-lg shadow-sm border border-[#E5E7EB]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-[#2E2E2E]">Seat Layout Editor - {screen.name}</h2>
          <div className="space-x-2">
            <button
              onClick={() => navigate('/admin/screens/list')}
              className="text-[#6B7280] hover:text-[#16A34A] text-sm font-medium transition-colors"
            >
              ← Back to List
            </button>
            <button
              onClick={onSave}
              disabled={saving || totalSeats === 0}
              className="bg-gradient-to-r from-[#16A34A] to-[#22C55E] text-white px-4 py-2 rounded-lg font-medium hover:from-[#065F46] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {saving ? 'Saving...' : `Save Layout (${totalSeats} seats)`}
            </button>
          </div>
        </div>
        <div className="mb-4 text-[#6B7280] text-sm">
          Dimensions: {totalRows} rows × {totalCols} cols | Total Seats: {totalSeats} | Theater: {screen.theaterId?.name}
        </div>

        {/* Layout Controls */}
        <div className="mb-4 flex flex-wrap gap-2 items-center text-sm text-[#6B7280]">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => addRow()}
              className="px-2 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
            >
              + Add Row (End)
            </button>
            <button
              onClick={() => addRow(0)}
              className="px-2 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
            >
              + Add Row (Start)
            </button>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => addColumn()}
              className="px-2 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
            >
              + Add Col (End)
            </button>
            <button
              onClick={() => addColumn(0)}
              className="px-2 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
            >
              + Add Col (Start)
            </button>
          </div>
          <span>|</span>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => removeRow(editedLayout.length - 1)}
              className="px-2 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
              title="Remove last row"
            >
              - Remove Last Row
            </button>
            <button
              onClick={() => removeColumn(editedLayout[0]?.length - 1)}
              className="px-2 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
              title="Remove last column"
            >
              - Remove Last Col
            </button>
          </div>
          <p className="text-xs">Aisles are empty cells (not counted as seats). Seat numbers are sequential per row, skipping aisles. Layout stays rectangular for simplicity.</p>
        </div>

        {/* Seat Grid */}
        <div className="overflow-x-auto max-h-[60vh] overflow-y-auto border border-[#E5E7EB] rounded-lg">
          <table className="w-full min-w-max">
            <thead className="bg-[#F5F6FA] sticky top-0">
              <tr>
                <th className="p-2 text-left text-[#6B7280] text-xs font-medium border-b border-[#E5E7EB]">Row</th>
                {Array.from({ length: totalCols }, (_, col) => (
                  <th key={col} className="p-2 text-center text-[#6B7280] text-xs font-medium border-b border-[#E5E7EB]">
                    {col + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {editedLayout.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-t border-[#E5E7EB] hover:bg-gray-50">
                  <td className="p-2 font-medium text-[#2E2E2E] text-xs bg-gray-50">
                    {String.fromCharCode(65 + rowIndex)}
                  </td>
                  {row.map((seat, colIndex) => (
                    <td key={colIndex} className="p-1 text-center">
                      {seat ? (
                        <div className="space-y-1">
                          <div className="text-xs text-gray-600 font-mono">{seat.seatNumber}</div>
                          <select
                            value={seat.type}
                            onChange={(e) => handleSeatTypeChange(rowIndex, colIndex, e.target.value)}
                            className={`w-12 h-6 rounded text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#16A34A] transition-all border border-gray-200 ${
                              seat.type === 'Standard' ? 'bg-green-100 text-green-800' :
                              seat.type === 'Premium' ? 'bg-blue-100 text-blue-800' :
                              seat.type === 'VIP' ? 'bg-purple-100 text-purple-800' :
                              'bg-orange-100 text-orange-800' // Fallback
                            }`}
                          >
                            <option value="Standard">S</option>
                            <option value="Premium">P</option>
                            <option value="VIP">V</option>
                            <option value="Aisle">Aisle</option>
                          </select>
                        </div>
                      ) : (
                        <div
                          className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors border border-gray-300"
                          onClick={() => handleSeatTypeChange(rowIndex, colIndex, 'Standard')}
                          title="Click to add seat"
                        >
                          <i className="fas fa-plus text-gray-500 text-xs"></i>
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-xs text-[#6B7280]">
          Legend: S = Standard, P = Premium, V = VIP, Aisle = Walkway (empty). Click + to add seat, select Aisle to create walkway (auto-renumbers subsequent seats). Use controls to resize grid.
        </div>
      </div>
    </>
  );
};

export default SeatLayoutEditor;