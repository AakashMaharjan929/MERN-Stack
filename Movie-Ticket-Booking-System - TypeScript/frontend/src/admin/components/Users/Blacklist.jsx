// Blacklist.jsx - Enhanced with bulk delete and bulk whitelist
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { getAllUsers, deleteUser, updateUserRole, blacklistUser, bulkDeleteUsers } from '../../api/userAPI'; // Removed bulkUpdateRoles, as we're using single for whitelist

const Blacklist = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false); // For bulk delete confirmation
  const [showBulkWhitelistModal, setShowBulkWhitelistModal] = useState(false); // NEW: For bulk whitelist confirmation
  const [bulkDeleting, setBulkDeleting] = useState(false); // Bulk delete loading state
  const [bulkWhitelisting, setBulkWhitelisting] = useState(false); // NEW: Bulk whitelist loading state
  const [selectedUsers, setSelectedUsers] = useState(new Set()); // Track selected user IDs
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // Fixed limit for pagination

  // Fetch blacklisted users with filters/pagination
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError('');
      try {
        const params = {
          page: currentPage,
          limit,
          search,
          role: roleFilter,
          status: 'blacklisted' // Always filter to blacklisted
        };
        console.log('Fetching blacklisted users with params:', params);
        const response = await getAllUsers(params);
        console.log('Full API response:', response);
        const apiData = response.data;
        setUsers(apiData.users || []);
        setTotalPages(apiData.pagination?.pages || 1);
        if ((apiData.users || []).length === 0) {
          console.warn('No blacklisted users returned from API');
        }
      } catch (err) {
        console.error('Fetch blacklisted users error:', err);
        const errorMsg = err.response?.data?.message || err.message || 'Unknown error occurred';
        setError('Failed to load blacklisted users: ' + errorMsg);
        toast.error('Failed to load blacklisted users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [currentPage, search, roleFilter]);

  // Handle single user selection
  const handleUserSelect = (id) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedUsers(newSelected);
  };

  // Handle select all/none
  const handleSelectAll = () => {
    if (selectedUsers.size === users.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(users.map(user => user._id)));
    }
  };

  // Handle bulk delete confirmation
  const handleBulkDelete = async () => {
    if (selectedUsers.size === 0) return;
    setBulkDeleting(true);
    try {
      await bulkDeleteUsers(Array.from(selectedUsers));
      setUsers(prev => prev.filter(user => !selectedUsers.has(user._id)));
      setSelectedUsers(new Set()); // Clear selection
      toast.success(`${selectedUsers.size} users deleted successfully!`);
    } catch (err) {
      console.error('Bulk delete error:', err);
      toast.error('Failed to delete selected users');
    } finally {
      setBulkDeleting(false);
      setShowBulkModal(false);
    }
  };

  // NEW: Handle bulk whitelist confirmation (loop single API calls for simplicity)
  const handleBulkWhitelist = async () => {
    if (selectedUsers.size === 0) return;
    setBulkWhitelisting(true);
    const errors = [];
    const successfulIds = [];
    for (const id of selectedUsers) {
      try {
        await blacklistUser(id, { blacklist: false });
        successfulIds.push(id);
      } catch (err) {
        console.error(`Failed to whitelist user ${id}:`, err);
        errors.push(id);
      }
    }
    // Update state: remove successful ones
    setUsers(prev => prev.filter(user => !successfulIds.includes(user._id)));
    setSelectedUsers(new Set()); // Clear selection
    if (successfulIds.length > 0) {
      toast.success(`${successfulIds.length} users whitelisted successfully!`);
    }
    if (errors.length > 0) {
      toast.error(`${errors.length} users failed to whitelist.`);
    }
    setBulkWhitelisting(false);
    setShowBulkWhitelistModal(false);
  };

  // Check if all users on current page are selected
  const isAllSelected = selectedUsers.size === users.length && users.length > 0;

  // Check if any users are selected
  const hasSelections = selectedUsers.size > 0;

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
      setSelectedUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(selectedId);
        return newSet;
      });
      toast.success('User deleted successfully!');
    } catch (err) {
      console.error('Delete error:', err);
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
      console.error('Update role error:', err);
      toast.error('Failed to update role');
    }
  };

  const handleWhitelist = async (id) => {
    try {
      await blacklistUser(id, { blacklist: false });
      setUsers(prev => prev.filter(user => user._id !== id)); // Remove from list after whitelisting
      setSelectedUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      toast.success('User whitelisted successfully!');
    } catch (err) {
      console.error('Whitelist error:', err);
      toast.error('Failed to whitelist user');
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setSelectedUsers(new Set()); // Clear selection on page change
    }
  };

  const clearFilters = () => {
    setSearch('');
    setRoleFilter('');
    setCurrentPage(1);
    setSelectedUsers(new Set());
  };

  if (loading) return <div className="text-[#6B7280]">Loading blacklisted users...</div>;

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
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#2E2E2E]">Blacklist Management</h2>
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

        {/* Filters */}
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
            </div>
            <div className="flex items-center space-x-2">
              {/* Bulk Actions Dropdown/Button */}
              {hasSelections && (
                <select
                  onChange={(e) => {
                    const action = e.target.value;
                    if (action === 'delete') {
                      setShowBulkModal(true);
                    } else if (action === 'whitelist') {
                      setShowBulkWhitelistModal(true);
                    }
                    e.target.value = ''; // Reset after action
                  }}
                  className="p-2 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                >
                  <option value="">Actions ({selectedUsers.size})</option>
                  <option value="delete">Delete Selected</option>
                  <option value="whitelist">Whitelist Selected</option>
                </select>
              )}
              <button
                onClick={clearFilters}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-300 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        {users.length === 0 ? (
          <div className="text-center text-[#6B7280] py-8">
            <i className="fas fa-users-slash text-4xl mb-4 text-gray-300"></i>
            <p>No blacklisted users found. Try adjusting your search or filters.</p>
            <button onClick={clearFilters} className="text-[#16A34A] hover:underline mt-2">Reset Filters</button>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-[#E5E7EB]">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {/* Checkbox column */}
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-[#16A34A] focus:ring-[#16A34A]"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    {/* Row checkbox */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedUsers.has(user._id)}
                        onChange={() => handleUserSelect(user._id)}
                        className="rounded border-gray-300 text-[#16A34A] focus:ring-[#16A34A]"
                      />
                    </td>
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
                        onClick={() => handleWhitelist(user._id)}
                        className="bg-green-100 text-green-800 hover:bg-green-200 px-2 py-1 text-xs rounded"
                      >
                        Whitelist
                      </button>
                      <button
                        onClick={() => handleDeleteClick(user._id)}
                        className="text-red-600 hover:text-red-900 text-xs"
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-3 py-2 text-gray-700">{currentPage} of {totalPages}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {/* NEW: Bulk Whitelist Confirmation Modal */}
        {showBulkWhitelistModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-30 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="text-center mb-6">
                <div className="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-user-check text-green-500 text-xl"></i>
                </div>
                <h3 className="text-lg font-bold text-[#2E2E2E] mb-2">Confirm Bulk Whitelist</h3>
                <p className="text-[#6B7280] text-sm">
                  Are you sure you want to whitelist {selectedUsers.size} selected user(s)? They will be moved to active status.
                </p>
              </div>
              <div className="flex space-x-3 justify-center">
                <button
                  onClick={() => setShowBulkWhitelistModal(false)}
                  disabled={bulkWhitelisting}
                  className="flex-1 bg-gray-100 text-[#6B7280] py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkWhitelist}
                  disabled={bulkWhitelisting}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-xl font-medium hover:from-green-600 hover:to-green-700 disabled:opacity-50 transition-all duration-200 flex items-center justify-center"
                >
                  {bulkWhitelisting ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Whitelisting...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check mr-2"></i>
                      Whitelist
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Delete Confirmation Modal */}
        {showBulkModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-30 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="text-center mb-6">
                <div className="mx-auto h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-exclamation-triangle text-red-500 text-xl"></i>
                </div>
                <h3 className="text-lg font-bold text-[#2E2E2E] mb-2">Confirm Bulk Deletion</h3>
                <p className="text-[#6B7280] text-sm">
                  Are you sure you want to delete {selectedUsers.size} selected user(s)? This action cannot be undone.
                </p>
              </div>
              <div className="flex space-x-3 justify-center">
                <button
                  onClick={() => setShowBulkModal(false)}
                  disabled={bulkDeleting}
                  className="flex-1 bg-gray-100 text-[#6B7280] py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkDelete}
                  disabled={bulkDeleting}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-xl font-medium hover:from-red-600 hover:to-red-700 disabled:opacity-50 transition-all duration-200 flex items-center justify-center"
                >
                  {bulkDeleting ? (
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

        {/* Single Delete Modal */}
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

export default Blacklist;