// Updated ListTheaters.jsx - Grouped by city with subtle gray modal overlay
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast'; // Ensure installed
import { getAllTheaters, deleteTheater } from '../../api/theaterAPI'; // Adjust path

const ListTheaters = () => {
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        const data = await getAllTheaters();
        setTheaters(data);
      } catch (err) {
        setError('Failed to load theaters');
        toast.error('Failed to load theaters');
      } finally {
        setLoading(false);
      }
    };
    fetchTheaters();
  }, []);

  // Group theaters by city
  const groupedTheaters = theaters.reduce((acc, theater) => {
    const city = theater.location?.city || 'Unknown';
    if (!acc[city]) acc[city] = [];
    acc[city].push(theater);
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
      await deleteTheater(selectedId);
      setTheaters(prev => prev.filter(t => t._id !== selectedId));
      toast.success('Theater deleted successfully!');
    } catch (err) {
      setError('Failed to delete theater');
      toast.error('Failed to delete theater');
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

  if (loading) return <div className="text-[#6B7280]">Loading theaters...</div>;
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
          <h2 className="text-xl font-bold text-[#2E2E2E]">Theater List</h2>
          <Link
            to="/admin/theaters/add"
            className="bg-gradient-to-r from-[#16A34A] to-[#22C55E] text-white px-4 py-2 rounded-lg font-medium hover:from-[#065F46] transition-all duration-200"
          >
            Add New Theater
          </Link>
        </div>
        {Object.keys(groupedTheaters).length === 0 ? (
          <div className="text-[#6B7280]">No theaters found. <Link to="/admin/theaters/add" className="text-[#16A34A] hover:underline">Add one</Link></div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#F5F6FA]">
                <tr>
                  <th className="p-3 text-left text-[#6B7280] text-sm font-medium">Name</th>
                  <th className="p-3 text-left text-[#6B7280] text-sm font-medium">Address</th>
                  <th className="p-3 text-right text-[#6B7280] text-sm font-medium">Screens</th>
                  <th className="p-3 text-left text-[#6B7280] text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(groupedTheaters).map(([city, group]) => (
                  <>
                    <tr className="bg-[#F5F6FA]">
                      <td colSpan={4} className="p-3 font-semibold text-[#2E2E2E]">
                        {city} ({group.length} theaters)
                      </td>
                    </tr>
                    {group.map((theater) => (
                      <tr key={theater._id} className="border-t border-[#E5E7EB] hover:bg-[#F5F6FA]/50 transition-colors">
                        <td className="p-3 font-medium text-[#2E2E2E]">{theater.name}</td>
                        <td className="p-3 text-[#6B7280] text-sm">{theater.fullAddress || `${theater.location.street}, ${theater.location.city}`}</td>
                        <td className="p-3 text-[#6B7280] text-sm text-right">{theater.screens?.length || 0}</td>
                        <td className="p-3">
                          <Link
                            to={`/admin/theaters/add/${theater._id}`}
                            className="text-[#16A34A] hover:underline text-sm mr-4"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(theater._id)}
                            className="text-red-500 hover:underline text-sm"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
              <p className="text-[#6B7280] text-sm">Are you sure you want to delete this theater? This action cannot be undone.</p>
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

export default ListTheaters;