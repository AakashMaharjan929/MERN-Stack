import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../api/theaterManagerAPI';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await getDashboardStats();
      setStats(response.data);
      setError('');
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to load dashboard';
      setError(errorMsg);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600 bg-red-50 p-4 rounded">{error}</div>;
  }

  if (!stats || !stats.theater) {
    return <div className="text-gray-500">No theater assigned</div>;
  }

  const { theater, stats: kpis } = stats;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{theater.name}</h1>
          <p className="text-gray-500 text-sm">Theater Manager</p>
        </div>
        <button
          onClick={fetchStats}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium"
        >
          Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded shadow-sm">
          <div className="text-sm text-gray-500">Total Bookings</div>
          <div className="text-2xl font-bold mt-1">{kpis?.totalBookings || 0}</div>
        </div>

        <div className="bg-white p-4 rounded shadow-sm">
          <div className="text-sm text-gray-500">Confirmed</div>
          <div className="text-2xl font-bold mt-1 text-green-600">{kpis?.confirmedBookings || 0}</div>
        </div>

        <div className="bg-white p-4 rounded shadow-sm">
          <div className="text-sm text-gray-500">Cancelled</div>
          <div className="text-2xl font-bold mt-1 text-red-600">{kpis?.cancelledBookings || 0}</div>
        </div>

        <div className="bg-white p-4 rounded shadow-sm">
          <div className="text-sm text-gray-500">Total Revenue</div>
          <div className="text-2xl font-bold mt-1">रु. {(kpis?.totalRevenue || 0).toLocaleString()}</div>
        </div>

        <div className="bg-white p-4 rounded shadow-sm">
          <div className="text-sm text-gray-500">Upcoming Shows</div>
          <div className="text-2xl font-bold mt-1">{kpis?.upcomingShows || 0}</div>
        </div>
      </div>

      {/* Theater Info */}
      <div className="bg-white p-4 rounded shadow-sm">
        <h3 className="text-lg font-medium mb-3">Theater Info</h3>
        <div className="flex gap-6">
          <div>
            <div className="text-sm text-gray-500">Theater Name</div>
            <div className="font-semibold">{theater?.name}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Screens</div>
            <div className="font-semibold">{theater?.screenCount || 0}</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-4 rounded shadow-sm">
        <h3 className="text-lg font-medium mb-3">Quick Actions</h3>
        <div className="flex gap-2 flex-wrap">
          <a href="/theater-manager/theater" className="px-3 py-1 border border-gray-200 rounded hover:bg-green-500 hover:text-white transition-colors text-sm">
            Theater Details
          </a>
          <a href="/theater-manager/shows" className="px-3 py-1 border border-gray-200 rounded hover:bg-green-500 hover:text-white transition-colors text-sm">
            Shows
          </a>
          <a href="/theater-manager/bookings" className="px-3 py-1 border border-gray-200 rounded hover:bg-green-500 hover:text-white transition-colors text-sm">
            Bookings
          </a>
          <a href="/theater-manager/reports" className="px-3 py-1 border border-gray-200 rounded hover:bg-green-500 hover:text-white transition-colors text-sm">
            Reports
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
