import React, { useState, useEffect } from 'react';
import { getTheaterDetails, updateTheaterDetails } from '../api/theaterManagerAPI';

const TheaterDetails = () => {
  const [theater, setTheater] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: {
      street: '',
      locality: '',
      city: '',
      state: '',
      country: 'Nepal'
    }
  });

  useEffect(() => {
    fetchTheaterDetails();
  }, []);

  const fetchTheaterDetails = async () => {
    try {
      setLoading(true);
      const response = await getTheaterDetails();
      setTheater(response.data);
      setFormData(response.data);
    } catch (err) {
      setError('Failed to load theater details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('location.')) {
      const key = name.replace('location.', '');
      setFormData(prev => ({
        ...prev,
        location: { ...prev.location, [key]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateTheaterDetails(formData);
      setTheater(formData);
      setIsEditing(false);
      alert('Theater updated successfully');
    } catch (err) {
      setError('Failed to update theater');
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!theater) return <div className="text-gray-500">Theater not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Theater Details</h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Theater Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
              <input
                type="text"
                name="location.street"
                value={formData.location.street}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Locality</label>
              <input
                type="text"
                name="location.locality"
                value={formData.location.locality}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                name="location.city"
                value={formData.location.city}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <input
                type="text"
                name="location.state"
                value={formData.location.state}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-medium"
          >
            Save Changes
          </button>
        </form>
      ) : (
        <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
          <div>
            <p className="text-gray-600 text-sm font-medium">Theater Name</p>
            <p className="text-lg font-semibold">{theater.name}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium">Address</p>
            <p className="text-lg">
              {theater.location.street}, {theater.location.locality && `${theater.location.locality}, `}
              {theater.location.city}, {theater.location.state}, {theater.location.country}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium">Number of Screens</p>
            <p className="text-lg font-semibold">{theater.screens?.length || 0}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TheaterDetails;
