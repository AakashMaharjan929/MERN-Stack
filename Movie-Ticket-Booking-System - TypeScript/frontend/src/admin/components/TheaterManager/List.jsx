import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ManagerList = () => {
  const navigate = useNavigate();
  const [managers, setManagers] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch both users and theaters
      const [usersResponse, theatersResponse] = await Promise.all([
        axios.get(`${API_BASE}/user`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_BASE}/theater`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      // Filter only theater managers
      const managerList = usersResponse.data?.users?.filter(user => user.role === 'theater_manager') || [];
      const theaterList = theatersResponse.data?.theaters || theatersResponse.data || [];
      
      // Map theater names to managers
      const managersWithTheaters = managerList.map(manager => {
        const theater = theaterList.find(t => 
          t.managerId === manager._id || 
          t.managerId?._id === manager._id ||
          manager.theaterId === t._id ||
          manager.theaterId?._id === t._id
        );
        return {
          ...manager,
          theaterName: theater?.name || 'Not Assigned'
        };
      });
      
      setManagers(managersWithTheaters);
      setTheaters(theaterList);
      setError('');
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to load managers';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const fetchManagers = fetchData; // Alias for refresh button

  const handleDelete = async (managerId) => {
    if (!confirm('Are you sure you want to delete this theater manager?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE}/user/${managerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Manager deleted successfully');
      fetchManagers(); // Refresh list
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to delete manager';
      toast.error(errorMsg);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading managers...</div>
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
            <h1 className="text-3xl font-bold text-gray-900">Theater Managers</h1>
            <p className="text-gray-600 text-sm mt-1">Manage theater manager accounts</p>
          </div>
          <button
            onClick={fetchManagers}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <i className="fas fa-sync-alt mr-2"></i>
            Refresh
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Managers Table */}
        {managers.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <i className="fas fa-user-tie text-6xl text-gray-300 mb-4"></i>
            <p className="text-gray-500 text-lg">No theater managers found</p>
            <p className="text-gray-400 text-sm mt-2">Create a new manager to get started</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Theater
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {managers.map((manager) => (
                  <tr key={manager._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 bg-green-100 rounded-full flex items-center justify-center">
                          <i className="fas fa-user text-green-600"></i>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{manager.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{manager.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{manager.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {manager.theaterName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        manager.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {manager.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                      <button
                        onClick={() => navigate(`/admin/theater-managers/edit/${manager._id}`)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="Edit Manager"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(manager._id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Delete Manager"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Stats Footer */}
        {managers.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Total Managers: <span className="font-semibold text-gray-900">{managers.length}</span>
              </div>
              <div className="text-sm text-gray-600">
                Active: <span className="font-semibold text-green-600">
                  {managers.filter(m => m.status === 'active').length}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ManagerList;
