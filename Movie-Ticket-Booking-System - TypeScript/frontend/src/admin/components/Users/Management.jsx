// Management.jsx - Fixed search focus loss with separate fetching state
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { getAllUsers, deleteUser, updateUserRole, blacklistUser } from '../../api/userAPI'; // Adjust path

// Custom hook for debouncing
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const Management = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // Initial load only
  const [isFetching, setIsFetching] = useState(false); // NEW: For subsequent fetches (filters/pagination)
  const [error, setError] = useState(''); // For displaying errors
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // Fixed limit for pagination

  // Debounce search with 300ms delay
  const debouncedSearch = useDebounce(search, 300);

  // Fetch users with filters/pagination
  useEffect(() => {
    const fetchUsers = async () => {
      if (loading) {
        setIsFetching(true); // For initial load too
      } else {
        setIsFetching(true);
      }
      setError(''); // Clear previous error
      try {
        const params = {
          page: currentPage,
          limit,
          search: debouncedSearch, // Use debounced value
          role: roleFilter,
          status: statusFilter
        };
        console.log('Fetching users with params:', params); // Debug log
        const response = await getAllUsers(params);
        console.log('Full API response:', response); // Debug log for structure
        const apiData = response.data; // Extract nested data from Axios response
        setUsers(apiData.users || []);
        setTotalPages(apiData.pagination?.pages || 1);
        if ((apiData.users || []).length === 0) {
          console.warn('No users returned from API'); // Warn if empty
        }
      } catch (err) {
        console.error('Fetch users error:', err); // Log full error
        // Better error message extraction
        const errorMsg = err.response?.data?.message || err.message || 'Unknown error occurred';
        setError('Failed to load users: ' + errorMsg);
        toast.error('Failed to load users');
      } finally {
        setIsFetching(false);
        setLoading(false); // Only after initial load
      }
    };
    fetchUsers();
  }, [currentPage, debouncedSearch, roleFilter, statusFilter]); // Use debouncedSearch in deps

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedId) return;
    setDeleting(true);
    try {
      await deleteUser(selectedId);
      setUsers(prev => prev.filter(user => user._id !== selectedId));
      toast.success('User deleted successfully!');
    } catch (err) {
      console.error('Delete error:', err); // Log
      toast.error('Failed to delete user');
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

  const handleUpdateRole = async (id, newRole) => {
    if (!['customer', 'admin'].includes(newRole)) {
      toast.error('Invalid role');
      return;
    }
    try {
      await updateUserRole(id, { role: newRole });
      setUsers(prev => prev.map(user => 
        user._id === id ? { ...user, role: newRole } : user
      ));
      toast.success('Role updated successfully!');
    } catch (err) {
      console.error('Update role error:', err); // Log
      toast.error('Failed to update role');
    }
  };

  const handleBlacklist = async (id) => {
    try {
      const currentStatus = users.find(u => u._id === id)?.status;
      const blacklist = currentStatus !== 'blacklisted';
      await blacklistUser(id, { blacklist });
      setUsers(prev => prev.map(user => 
        user._id === id ? { ...user, status: blacklist ? 'blacklisted' : 'active' } : user
      ));
      toast.success(`User ${blacklist ? 'blacklisted' : 'whitelisted'} successfully!`);
    } catch (err) {
      console.error('Blacklist error:', err); // Log
      toast.error('Failed to update blacklist status');
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setRoleFilter('');
    setStatusFilter('');
    setCurrentPage(1);
  };

  // NEW: Render loading skeleton only for initial load
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-[#6B7280]">Loading users...</div>
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
          error: { style: { background: '#FEF2F2', color: '#991B9B' } },
        }}
      />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#2E2E2E]">Customer Management</h2>
          <button
            onClick={() => navigate('/admin/users')}
            className="text-[#6B7280] hover:text-[#16A34A] text-sm font-medium transition-colors duration-200"
          >
            ← Back to Users
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-600 text-sm">{error}</p>
            <button onClick={() => setError('')} className="text-red-600 hover:underline text-xs mt-1">Dismiss</button>
          </div>
        )}

        {/* Filters - Always visible */}
        <div className="bg-gray-50 p-4 rounded-xl space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 p-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
              />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="p-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
              >
                <option value="">All Roles</option>
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="p-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="blacklisted">Blacklisted</option>
              </select>
            </div>
            <button
              onClick={clearFilters}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-300 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Users Table - Always visible, with conditional content */}
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-[#E5E7EB]">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isFetching ? (
                // NEW: Show loading rows during fetch
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={`skeleton-${index}`}>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex space-x-2">
                        <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-6 w-12 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                // NEW: Empty state only when not fetching
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-[#6B7280]">
                    <i className="fas fa-users text-4xl mb-4 text-gray-300"></i>
                    <p>No users found. Try adjusting your search or filters.</p>
                    <button onClick={clearFilters} className="text-[#16A34A] hover:underline mt-2">Reset Filters</button>
                  </td>
                </tr>
              ) : (
                // Render users
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.status === 'blacklisted' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <select
                        value={user.role}
                        onChange={(e) => handleUpdateRole(user._id, e.target.value)}
                        className="text-indigo-600 hover:text-indigo-900 text-xs border rounded px-2 py-1"
                      >
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button
                        onClick={() => handleBlacklist(user._id)}
                        className={`px-2 py-1 text-xs rounded ${
                          user.status === 'blacklisted' 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {user.status === 'blacklisted' ? 'Whitelist' : 'Blacklist'}
                      </button>
                      <button
                        onClick={() => handleDeleteClick(user._id)}
                        className="text-red-600 hover:text-red-900 text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination - Always visible */}
        {totalPages > 1 && (
          <div className="flex justify-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isFetching}
              className="px-3 py-2 border border-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-3 py-2 text-gray-700">{currentPage} of {totalPages}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isFetching}
              className="px-3 py-2 border border-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {/* Styled Confirmation Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-30 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="text-center mb-6">
                <div className="mx-auto h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-exclamation-triangle text-red-500 text-xl"></i>
                </div>
                <h3 className="text-lg font-bold text-[#2E2E2E] mb-2">Confirm Deletion</h3>
                <p className="text-[#6B7280] text-sm">Are you sure you want to delete this user? This action cannot be undone.</p>
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
      </div>
    </>
  );
};

export default Management;