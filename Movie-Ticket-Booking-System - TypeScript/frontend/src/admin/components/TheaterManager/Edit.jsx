import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const EditTheaterManager = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    theaterId: ''
  });
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setFetchingData(true);
      const token = localStorage.getItem('token');
      
      // Fetch manager details and theaters
      const [managerResponse, theatersResponse] = await Promise.all([
        axios.get(`${API_BASE}/user/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_BASE}/theater`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      const manager = managerResponse.data?.user || managerResponse.data;
      const theaterList = theatersResponse.data?.theaters || theatersResponse.data || [];
      
      setFormData({
        name: manager.name || '',
        email: manager.email || '',
        phone: manager.phone || '',
        theaterId: manager.theaterId?._id || manager.theaterId || ''
      });
      
      setTheaters(theaterList);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to load manager details';
      toast.error(errorMsg);
      console.error('Error fetching manager:', err);
    } finally {
      setFetchingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE}/user/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Manager updated successfully!');
      setTimeout(() => navigate('/admin/theater-managers/list'), 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update manager';
      toast.error(errorMsg);
      console.error('Error updating manager:', err);
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading manager details...</div>
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Theater Manager</h1>
            <p className="text-gray-600 text-sm mt-1">Update manager information and theater assignment</p>
          </div>
          <button
            onClick={() => navigate('/admin/theater-managers/list')}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Back to List
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border border-gray-200 space-y-4 max-w-2xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter manager name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="manager@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assign Theater</label>
            <select
              name="theaterId"
              value={formData.theaterId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Theater (Optional)</option>
              {theaters.map(theater => {
                const location = typeof theater.location === 'object' 
                  ? `${theater.location?.city || ''}, ${theater.location?.state || ''}`.trim().replace(/^,\s*|,\s*$/g, '')
                  : theater.location || '';
                return (
                  <option key={theater._id} value={theater._id}>
                    {theater.name}{location ? ` - ${location}` : ''}
                  </option>
                );
              })}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {theaters.length === 0 ? 'No theaters available' : `${theaters.length} theater(s) available`}
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors font-medium"
            >
              {loading ? 'Updating...' : 'Update Manager'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/theater-managers/list')}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditTheaterManager;
