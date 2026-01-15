// Shows.jsx - Theater Manager - List and manage shows
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { getMyShows, deleteShow } from '../api/theaterManagerAPI';

const Shows = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [shows, setShows] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchShows();
  }, []);

  const fetchShows = async () => {
    setLoading(true);
    try {
      const response = await getMyShows();
      console.log('Shows data:', response);
      const showsData = response.data?.shows || response.shows || response.data || response || [];
      setShows(Array.isArray(showsData) ? showsData : []);
    } catch (err) {
      console.error('Fetch shows error:', err);
      toast.error('Failed to load shows');
      setShows([]);
    } finally {
      setLoading(false);
    }
  };

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
      toast.error(err.response?.data?.message || 'Failed to delete show');
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">
          <i className="fas fa-spinner fa-spin text-2xl mb-2"></i>
          <p>Loading shows...</p>
        </div>
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

      <div className="bg-white shadow-lg rounded-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Shows Management</h2>
            <p className="text-gray-600 text-sm mt-1">View and manage your scheduled shows</p>
          </div>
          <button
            onClick={() => navigate('/theater-manager/shows/schedule')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-all duration-200 flex items-center"
          >
            <i className="fas fa-plus mr-2"></i>
            Schedule New Show
          </button>
        </div>

        {/* Shows List */}
        {shows.length === 0 ? (
          <div className="text-center py-12">
            <i className="fas fa-calendar-times text-6xl text-gray-300 mb-4"></i>
            <p className="text-gray-600 mb-4">No shows scheduled yet.</p>
            <button 
              onClick={() => navigate('/theater-manager/shows/schedule')} 
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Schedule your first show →
            </button>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {shows.map((show) => {
                  const startTime = show.startTime ? new Date(show.startTime) : null;
                  const endTime = show.endTime ? new Date(show.endTime) : null;
                  
                  return (
                    <tr key={show._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {show.movieId?.title || show.movieId?.name || 'Unknown Movie'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {show.screenId?.name || 'Unknown Screen'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {startTime ? startTime.toLocaleDateString() : 'No date'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {startTime ? startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {endTime ? endTime.toLocaleDateString() : 'No date'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {endTime ? endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          show.showType === 'Special' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {show.showType || 'Regular'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          show.status === 'Completed' ? 'bg-gray-100 text-gray-800' :
                          show.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' :
                          show.status === 'Active' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {show.status || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          Rs. {show.pricingRules?.standardBasePrice || show.pricingRules?.basePrice || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => navigate(`/theater-manager/shows/schedule/${show._id}`)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit Show"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(show._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Show"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 md:p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="mx-auto h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-exclamation-triangle text-red-500 text-xl"></i>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Confirm Deletion</h3>
              <p className="text-gray-600 text-sm">Are you sure you want to delete this show? This action cannot be undone.</p>
            </div>
            <div className="flex space-x-3 justify-center">
              <button
                onClick={handleCancelDelete}
                disabled={deleting}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition-all duration-200 flex items-center justify-center"
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

export default Shows;
