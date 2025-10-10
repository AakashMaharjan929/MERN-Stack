// Updated ListViewScreens.jsx - Grouped by city then theater, with full address
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast'; // Ensure installed
import { getAllScreens, deleteScreen } from '../../api/screenAPI'; // Adjust path

const ListViewScreens = () => {
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [filter, setFilter] = useState(''); // For theater search

  useEffect(() => {
    const fetchScreens = async () => {
      try {
        const data = await getAllScreens();
        setScreens(data);
      } catch (err) {
        setError('Failed to load screens');
        toast.error('Failed to load screens');
      } finally {
        setLoading(false);
      }
    };
    fetchScreens();
  }, []);

  // Filter screens by theater name
  const filteredScreens = screens.filter(screen =>
    screen.theaterId?.name.toLowerCase().includes(filter.toLowerCase())
  );

  // Group filtered screens by city then by theater name
  const cityGroups = filteredScreens.reduce((acc, screen) => {
    const city = screen.theaterId?.location?.city || 'Unknown';
    const theaterName = screen.theaterId?.name || 'Unknown';
    const fullAddress = screen.theaterId?.fullAddress || '';
    if (!acc[city]) acc[city] = {};
    if (!acc[city][theaterName]) {
      acc[city][theaterName] = { screens: [], address: fullAddress };
    }
    acc[city][theaterName].screens.push(screen);
    return acc;
  }, {});

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedId) return;
    setDeleting(true);
    try {
      await deleteScreen(selectedId);
      setScreens(prev => prev.filter(s => s._id !== selectedId));
      toast.success('Screen deleted successfully!');
    } catch (err) {
      setError('Failed to delete screen');
      toast.error('Failed to delete screen');
    } finally {
      setDeleting(false);
      setShowModal(false);
      setSelectedId(null);
    }
  };

  const handleCancelDelete = () => {
    setShowModal(false);
    setSelectedId(null);
  };

  if (loading) return <div className="text-[#6B7280]">Loading screens...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#2E2E2E',
            border: '1px solid #E5E7EB',
          },
          success: { style: { background: '#F0FDF4', color: '#065F46' } },
          error: { style: { background: '#FEF2F2', color: '#991B1B' } },
        }}
      />
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-[#2E2E2E]">Screens List</h2>
          <Link
            to="/admin/screens/add"
            className="bg-gradient-to-r from-[#16A34A] to-[#22C55E] text-white px-4 py-2 rounded-lg font-medium hover:from-[#065F46] transition-all duration-200"
          >
            Add New Screen
          </Link>
        </div>

        {/* Search Filter */}
        <div className="mb-6">
          <div className="relative">
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] text-sm"></i>
            <input
              type="text"
              placeholder="Search by theater name..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full max-w-md pl-10 pr-4 py-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A34A] transition-all"
            />
          </div>
        </div>

        {Object.keys(cityGroups).length === 0 ? (
          <div className="text-[#6B7280]">
            {filter ? `No screens found for theater "${filter}".` : 'No screens found.'}
            {!filter && <Link to="/admin/screens/add" className="text-[#16A34A] hover:underline">Add one</Link>}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#F5F6FA]">
                <tr>
                  <th className="p-3 text-left text-[#6B7280] text-sm font-medium">Name</th>
                  <th className="p-3 text-right text-[#6B7280] text-sm font-medium">Total Seats</th>
                  <th className="p-3 text-left text-[#6B7280] text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(cityGroups).map(([city, theaters]) => (
                  <>
                    <tr className="bg-gray-100">
                      <td colSpan={3} className="p-3 font-semibold text-[#2E2E2E]">
                        {city} ({Object.keys(theaters).length} theaters)
                      </td>
                    </tr>
                    {Object.entries(theaters).map(([theaterName, { screens, address }]) => (
                      <>
                        <tr className="bg-[#F5F6FA]">
                          <td colSpan={3} className="p-3 font-medium text-[#2E2E2E]">
                            {theaterName} - {address} ({screens.length} screens)
                          </td>
                        </tr>
                        {screens.map((screen) => (
                          <tr key={screen._id} className="border-t border-[#E5E7EB] hover:bg-[#F5F6FA]/50 transition-colors">
                            <td className="p-3 font-medium text-[#2E2E2E]">{screen.name}</td>
                            <td className="p-3 text-[#6B7280] text-sm text-right">{screen.totalSeats}</td>
                            <td className="p-3 space-x-2">
                              <Link
                                to={`/admin/screens/add/${screen._id}`}
                                className="text-[#16A34A] hover:underline text-sm mr-2"
                              >
                                Edit
                              </Link>
                              <Link
                                to={`/admin/screens/layout/${screen._id}`}
                                className="text-blue-600 hover:underline text-sm mr-2"
                              >
                                Layout
                              </Link>
                              <Link
                                to={`/admin/screens/capacity/${screen._id}`}
                                className="text-purple-600 hover:underline text-sm mr-2"
                              >
                                Capacity
                              </Link>
                              <button
                                onClick={() => handleDeleteClick(screen._id)}
                                className="text-red-500 hover:underline text-sm"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Styled Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-6">
              <div className="mx-auto h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-exclamation-triangle text-red-500 text-xl"></i>
              </div>
              <h3 className="text-lg font-bold text-[#2E2E2E] mb-2">Confirm Deletion</h3>
              <p className="text-[#6B7280] text-sm">Are you sure you want to delete this screen? This action cannot be undone.</p>
            </div>
            <div className="flex space-x-3 justify-center">
              <button
                onClick={handleCancelDelete}
                disabled={deleting}
                className="flex-1 bg-gray-100 text-[#6B7280] py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-xl font-medium hover:from-red-600 hover:to-red-700 disabled:opacity-50 transition-all duration-200 flex items-center justify-center"
              >
                {deleting ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Deleting...
                  </>
                ) : (
                  <>
                    <i className="fas fa-trash mr-2"></i>
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ListViewScreens;