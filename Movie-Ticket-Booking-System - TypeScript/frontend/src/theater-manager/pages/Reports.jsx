import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { getRevenueReport } from '../api/theaterManagerAPI';

const Reports = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    
    // Validate dates
    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates');
      return;
    }
    
    if (new Date(startDate) > new Date(endDate)) {
      toast.error('Start date cannot be after end date');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await getRevenueReport(startDate, endDate);
      console.log('Report response:', response);
      
      const reportData = response.data || response;
      setReport(reportData);
      toast.success('Report generated successfully!');
    } catch (err) {
      console.error('Report error:', err.response?.data || err.message);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to generate report';
      setError(errorMsg);
      toast.error(errorMsg);
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Revenue Reports</h1>
          <p className="text-gray-600 text-sm mt-1">Generate revenue reports for a date range</p>
        </div>

      {/* Filter Form */}
      <form onSubmit={handleGenerateReport} className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400 font-medium transition-all"
            >
              <i className="fas fa-chart-line mr-2"></i>
              {loading ? 'Generating...' : 'Generate Report'}
            </button>
          </div>
        </div>
      </form>

      {error && <div className="text-red-500 bg-red-50 p-4 rounded">{error}</div>}

      {report && (
        <div className="space-y-6">
          {/* Theater Info */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Theater: {report.theater?.name || report.theaterName || 'N/A'}</h2>
            {report.period?.startDate && (
              <p className="text-gray-600">
                Period: {new Date(report.period.startDate).toLocaleDateString()} - {new Date(report.period.endDate).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <p className="text-green-600 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold text-green-900">Rs. {(report.summary?.totalRevenue || 0).toLocaleString()}</p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <p className="text-blue-600 text-sm font-medium">Total Bookings</p>
              <p className="text-3xl font-bold text-blue-900">{report.summary?.totalBookings || 0}</p>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
              <p className="text-purple-600 text-sm font-medium">Total Seats Booked</p>
              <p className="text-3xl font-bold text-purple-900">{report.summary?.totalSeatsBooked || 0}</p>
            </div>
          </div>
        </div>
      )}

      {!report && !error && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Select dates and generate a report to view revenue information</p>
        </div>
      )}
      </div>
    </>
  );
};

export default Reports;
