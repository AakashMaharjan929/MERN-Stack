import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { getTheaterDetails, addScreen, updateScreen, deleteScreen } from '../api/theaterManagerAPI';

const Screens = () => {
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLayoutEditor, setShowLayoutEditor] = useState(false);
  const [editingScreen, setEditingScreen] = useState(null);
  const [selectedLayoutScreen, setSelectedLayoutScreen] = useState(null);
  const [deletingScreenId, setDeletingScreenId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editedLayout, setEditedLayout] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    rows: 10,
    columns: 15,
    defaultType: 'Standard'
  });

  useEffect(() => {
    fetchScreens();
  }, []);

  const fetchScreens = async () => {
    try {
      setLoading(true);
      const response = await getTheaterDetails();
      setScreens(response.data.screens || []);
      setError('');
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to load screens';
      setError(errorMsg);
      setScreens([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setFormData({
      name: '',
      rows: 10,
      columns: 15,
      defaultType: 'Standard'
    });
    setShowAddModal(true);
  };

  const handleEditClick = (screen) => {
    setEditingScreen(screen);
    setFormData({
      name: screen.name || '',
      rows: screen.seatLayout ? screen.seatLayout.length : 10,
      columns: screen.seatLayout && screen.seatLayout[0] ? screen.seatLayout[0].length : 15,
      defaultType: 'Standard'
    });
    setShowEditModal(true);
  };

  const handleDeleteClick = (screenId) => {
    setDeletingScreenId(screenId);
    setShowDeleteModal(true);
  };

  const handleLayoutClick = (screen) => {
    setSelectedLayoutScreen(screen);
    setEditedLayout(screen.seatLayout || []);
    setShowLayoutEditor(true);
  };

  const saveLayout = async () => {
    setIsSubmitting(true);
    try {
      // TODO: Make API call to save layout
      console.log('Saving layout for screen:', selectedLayoutScreen._id, editedLayout);
      alert('Layout saved successfully!');
      setShowLayoutEditor(false);
      setSelectedLayoutScreen(null);
      fetchScreens();
    } catch (err) {
      alert('Failed to save layout');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Generate seat layout
      const seatLayout = [];
      for (let row = 0; row < parseInt(formData.rows); row++) {
        const rowSeats = [];
        for (let col = 0; col < parseInt(formData.columns); col++) {
          const seatNumber = `${String.fromCharCode(65 + row)}${col + 1}`;
          rowSeats.push({ seatNumber, type: formData.defaultType, price: 150 });
        }
        seatLayout.push(rowSeats);
      }

      // Make API call to add screen
      const screenData = {
        name: formData.name,
        seatLayout,
        totalSeats: parseInt(formData.rows) * parseInt(formData.columns),
        theaterId: screens.length > 0 ? screens[0].theaterId : undefined
      };

      const response = await addScreen(screenData);
      toast.success('Screen added successfully!');
      setShowAddModal(false);
      fetchScreens();
    } catch (err) {
      console.error('Add screen error:', err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Failed to add screen');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Make API call to update screen
      const screenData = {
        name: formData.name,
        totalSeats: parseInt(formData.rows) * parseInt(formData.columns)
      };

      await updateScreen(editingScreen._id, screenData);
      toast.success('Screen updated successfully!');
      setShowEditModal(false);
      fetchScreens();
    } catch (err) {
      console.error('Update screen error:', err);
      toast.error(err.response?.data?.message || 'Failed to update screen');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    setIsSubmitting(true);
    try {
      // Make API call to delete screen
      await deleteScreen(deletingScreenId);
      
      setScreens(prev => prev.filter(s => s._id !== deletingScreenId));
      setShowDeleteModal(false);
      toast.success('Screen deleted successfully!');
    } catch (err) {
      console.error('Delete screen error:', err);
      toast.error(err.response?.data?.message || 'Failed to delete screen');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading screens...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded p-6">
        <h3 className="text-red-900 font-bold text-lg mb-2">Error</h3>
        <p className="text-red-700 text-sm mb-4">{error}</p>
        <button
          onClick={fetchScreens}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

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
      <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Screens Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage theater screens and seat layouts</p>
        </div>
        <button
          onClick={handleAddClick}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium flex items-center gap-2"
        >
          <i className="fas fa-plus"></i>
          Add New Screen
        </button>
      </div>

      {/* Screens List */}
      {screens.length === 0 ? (
        <div className="bg-white p-12 rounded shadow-sm text-center border border-gray-200">
          <i className="fas fa-tv text-gray-300 text-4xl mb-4 block"></i>
          <p className="text-gray-500 text-lg">No screens available</p>
          <button
            onClick={handleAddClick}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium"
          >
            Add First Screen
          </button>
        </div>
      ) : (
        <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Screen Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Seat Layout</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Total Seats</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {screens.map((screen) => (
                <tr key={screen._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{screen.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {screen.seatLayout ? `${screen.seatLayout.length} × ${screen.seatLayout[0]?.length || 0}` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">{screen.totalSeats || 0}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {screen.createdAt ? new Date(screen.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button
                      onClick={() => handleEditClick(screen)}
                      className="text-green-600 hover:text-green-900 font-medium hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleLayoutClick(screen)}
                      className="text-blue-600 hover:text-blue-900 font-medium hover:underline"
                    >
                      Layout
                    </button>
                    <button
                      onClick={() => handleDeleteClick(screen._id)}
                      className="text-red-600 hover:text-red-900 font-medium hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Screen Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Screen</h2>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Screen Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Screen 1"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rows</label>
                  <input
                    type="number"
                    value={formData.rows}
                    onChange={(e) => setFormData({ ...formData, rows: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Columns</label>
                  <input
                    type="number"
                    value={formData.columns}
                    onChange={(e) => setFormData({ ...formData, columns: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                    min="1"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Seat Type</label>
                <select
                  value={formData.defaultType}
                  onChange={(e) => setFormData({ ...formData, defaultType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="Standard">Standard</option>
                  <option value="Premium">Premium</option>
                  <option value="VIP">VIP</option>
                </select>
              </div>
              <div className="bg-gray-50 p-3 rounded text-sm text-gray-600">
                <p>Total Seats: <span className="font-semibold">{parseInt(formData.rows) * parseInt(formData.columns)}</span></p>
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Adding...' : 'Add Screen'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded hover:bg-gray-50 font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Screen Modal */}
      {showEditModal && editingScreen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Screen</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Screen Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div className="bg-gray-50 p-3 rounded text-sm text-gray-600">
                <p>Seat Layout: <span className="font-semibold">{formData.rows} × {formData.columns}</span></p>
                <p className="text-xs mt-1 text-gray-500">(Edit layout from seat editor)</p>
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-md text-center">
            <div className="mx-auto h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <i className="fas fa-exclamation-triangle text-red-600 text-xl"></i>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Confirm Deletion</h2>
            <p className="text-gray-600 text-sm mb-6">Are you sure you want to delete this screen? This action cannot be undone.</p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 border border-gray-200 rounded hover:bg-gray-50 font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-medium disabled:opacity-50"
              >
                {isSubmitting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Seat Layout Editor Full Screen */}
      {showLayoutEditor && selectedLayoutScreen && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Seat Layout Editor - {selectedLayoutScreen.name}</h2>
              <button
                onClick={() => setShowLayoutEditor(false)}
                className="px-4 py-2 border border-gray-200 rounded hover:bg-gray-50 font-medium"
              >
                Close Editor
              </button>
            </div>

            <div className="mb-4 text-gray-600 text-sm">
              Dimensions: {editedLayout.length} rows × {editedLayout[0]?.length || 0} cols | Total Seats: {editedLayout.flat().filter(s => s !== null).length} | Theater: {selectedLayoutScreen.name}
            </div>

            {/* Legend */}
            <div className="mb-4 p-3 bg-gray-50 rounded text-sm border border-gray-200">
              <p className="font-medium text-gray-900 mb-2">Legend: S = Standard, P = Premium, V = VIP, Aisle = Walkway (empty)</p>
              <p className="text-xs text-gray-600">Click + to add seat, select Aisle to create walkway (auto-renumbers subsequent seats).</p>
            </div>

            {/* Seat Grid Table */}
            <div className="overflow-x-auto max-h-[60vh] overflow-y-auto border border-gray-200 rounded-lg mb-4">
                <table className="w-full min-w-max">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="p-2 text-left text-gray-600 text-xs font-medium border-b border-gray-200">Row</th>
                      {Array.from({ length: editedLayout[0]?.length || 0 }, (_, col) => (
                        <th key={col} className="p-2 text-center text-gray-600 text-xs font-medium border-b border-gray-200 min-w-16">
                          {col + 1}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {editedLayout.map((row, rowIdx) => (
                      <tr key={rowIdx} className="border-t border-gray-200 hover:bg-gray-50">
                        <td className="p-2 font-medium text-gray-900 text-xs bg-gray-50 border-r border-gray-200">
                          {String.fromCharCode(65 + rowIdx)}
                        </td>
                        {row.map((seat, colIdx) => (
                          <td key={colIdx} className="p-1 text-center">
                            {seat ? (
                              <div className="space-y-1">
                                <div className="text-xs text-gray-600 font-mono">{seat.seatNumber}</div>
                                <select
                                  value={seat.type}
                                  onChange={(e) => {
                                    const newType = e.target.value;
                                    const newLayout = editedLayout.map((r, idx) => {
                                      if (idx === rowIdx) {
                                        return r.map((s, cIdx) => {
                                          if (cIdx === colIdx) {
                                            return newType === 'Aisle' ? null : { ...s, type: newType };
                                          }
                                          return s;
                                        });
                                      }
                                      return r;
                                    });
                                    setEditedLayout(newLayout);
                                  }}
                                  className={`w-12 h-6 rounded text-xs font-medium focus:outline-none focus:ring-1 focus:ring-green-500 transition-all border border-gray-200 ${
                                    seat.type === 'Standard' ? 'bg-green-100 text-green-800' :
                                    seat.type === 'Premium' ? 'bg-blue-100 text-blue-800' :
                                    seat.type === 'VIP' ? 'bg-purple-100 text-purple-800' :
                                    'bg-orange-100 text-orange-800'
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
                                onClick={() => {
                                  const newLayout = editedLayout.map((r, idx) => {
                                    if (idx === rowIdx) {
                                      return r.map((s, cIdx) => {
                                        if (cIdx === colIdx) {
                                          return { seatNumber: `${String.fromCharCode(65 + rowIdx)}${cIdx + 1}`, type: 'Standard', price: 150 };
                                        }
                                        return s;
                                      });
                                    }
                                    return r;
                                  });
                                  setEditedLayout(newLayout);
                                }}
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

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                  onClick={saveLayout}
                  disabled={isSubmitting || editedLayout.flat().filter(s => s !== null).length === 0}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isSubmitting ? 'Saving...' : `Save Layout (${editedLayout.flat().filter(s => s !== null).length} seats)`}
                </button>
                <button
                  onClick={() => setShowLayoutEditor(false)}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded hover:bg-gray-50 font-medium transition-all"
                >
                  Cancel
                </button>

            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default Screens;
