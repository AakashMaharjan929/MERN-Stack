import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const CreateTheaterManager = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    theaterId: ''
  });
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTheaters();
  }, []);

  const fetchTheaters = async () => {
    try {
      const token = localStorage.getItem('token');
      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const url = `${baseURL}/theater`;
      
      console.log('Fetching theaters from:', url);
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Theater response:', response.data);
      
      // Handle different response formats
      let theatersData = [];
      
      if (Array.isArray(response.data)) {
        theatersData = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        theatersData = response.data.data;
      } else if (response.data?.theaters && Array.isArray(response.data.theaters)) {
        theatersData = response.data.theaters;
      }
      
      console.log('Parsed theaters:', theatersData);
      setTheaters(theatersData);
    } catch (err) {
      console.error('Failed to load theaters:', err.message);
      console.error('Error response:', err.response?.data);
      toast.error('Failed to load theaters: ' + (err.response?.data?.message || err.message));
      setTheaters([]);
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
      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const url = `${baseURL}/theater-manager/create`;
      
      console.log('Creating theater manager at:', url);
      console.log('Payload:', formData);
      
      const response = await axios.post(url, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Create response:', response.data);
      toast.success('Theater manager created successfully!');
      setFormData({ name: '', email: '', phone: '', password: '', theaterId: '' });
      setTimeout(() => navigate('/admin/theater-managers/list'), 1500);
    } catch (err) {
      console.error('Failed to create manager:', err.message);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      toast.error(err.response?.data?.message || 'Failed to create theater manager');
    } finally {
      setLoading(false);
    }
  };

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
            <h1 className="text-3xl font-bold text-gray-900">Create Theater Manager</h1>
            <p className="text-gray-600 text-sm mt-1">Add a new theater manager to the system</p>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="John Doe"
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
              placeholder="9841234567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="At least 6 characters"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assign Theater *</label>
            <select
              name="theaterId"
              value={formData.theaterId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select a theater...</option>
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
              {theaters.length === 0 ? 'No theaters available. Create a theater first.' : `${theaters.length} theater(s) available`}
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors font-medium"
            >
              {loading ? 'Creating...' : 'Create Manager'}
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

export default CreateTheaterManager;
