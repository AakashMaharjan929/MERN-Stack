// List.jsx - Component for listing all shows (create in /admin/components/Shows)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { getAllShows, deleteShow } from '../../api/showAPI'; // Assuming deleteShow is available

const ListShows = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [shows, setShows] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch all shows on mount
  useEffect(() => {
    const fetchShows = async () => {
      setLoading(true);
      try {
        const response = await getAllShows(); // Supports params if needed, e.g., { sort: 'startTime', limit: 50 }
        setShows(response.shows || response || []); // Adjust based on API response structure
      } catch (err) {
        toast.error('Failed to load shows');
      } finally {
        setLoading(false);
      }
    };
    fetchShows();
  }, []);

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedId) return;
    setDeleting(true);
    try {
      await deleteShow(selectedId);
      setShows(prev => prev.filter(show => show._id !== selectedId));
      toast.success('Show deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete show');
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

  if (loading) return <div className="text-[#6B7280]">Loading shows...</div>;

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
      <div className="flex justify-center items-start min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-[#F5F6FA]">
        <div className="max-w-6xl w-full space-y-8">
          <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8 border border-[#E5E7EB]/50">
            <div className="text-center mb-6 md:mb-8">
              <div className="mx-auto h-16 w-16 bg-gradient-to-r from-[#16A34A] to-[#22C55E] rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-list text-white text-2xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-[#2E2E2E] mb-2">
                List of Shows
              </h2>
              <p className="text-[#6B7280] text-sm">View and manage scheduled shows</p>
            </div>
            {shows.length === 0 ? (
              <div className="text-center text-[#6B7280] py-8">
                <i className="fas fa-calendar-times text-4xl mb-4 text-gray-300"></i>
                <p>No shows scheduled yet. <button onClick={() => navigate('/admin/shows/schedule')} className="text-[#16A34A] hover:underline font-medium">Schedule one now?</button></p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Movie</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Screen</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {shows.map((show) => (
                      <tr key={show._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {show.movieId?.title || 'Unknown Movie'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {show.screenId?.name || 'Unknown Screen'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(show.startTime).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(show.endTime).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            show.showType === 'Special' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {show.showType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <button
                            onClick={() => navigate(`/admin/shows/schedule/${show._id}`)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(show._id)}
                            className="text-red-600 hover:text-red-900"
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
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => navigate('/admin/shows/schedule')}
                className="bg-gradient-to-r from-[#16A34A] to-[#22C55E] text-white px-6 py-2 rounded-xl font-semibold hover:shadow-xl transition-all duration-200 mr-4"
              >
                <i className="fas fa-plus mr-2"></i>
                Schedule New Show
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/shows')}
                className="text-[#6B7280] hover:text-[#16A34A] text-sm font-medium transition-colors duration-200"
              >
                ← Back to Shows
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Styled Confirmation Modal - Subtle gray overlay */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-6">
              <div className="mx-auto h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-exclamation-triangle text-red-500 text-xl"></i>
              </div>
              <h3 className="text-lg font-bold text-[#2E2E2E] mb-2">Confirm Deletion</h3>
              <p className="text-[#6B7280] text-sm">Are you sure you want to delete this show? This action cannot be undone.</p>
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

export default ListShows;