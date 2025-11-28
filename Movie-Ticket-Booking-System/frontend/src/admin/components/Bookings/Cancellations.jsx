// admin/components/Bookings/Cancellations.jsx - Functional View Cancellations/Refunds page
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCancellations } from '../../api/bookingsAPI'; // Adjust path to your bookingAPI

const ViewCancellationsRefunds = () => {
  const [cancellations, setCancellations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10 });

  const fetchCancellations = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const params = { ...filters, page };
      const { bookings: data, total } = await getCancellations(params);
      setCancellations(data);
      setPagination({ total, page, limit: filters.limit });
    } catch (err) {
      setError(err.message || 'Failed to fetch cancellations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCancellations();
  }, [filters.dateFrom, filters.dateTo]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    fetchCancellations(newPage);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading cancellations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 bg-red-50 rounded-lg">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Cancellations & Refunds</h3>
        <div className="text-sm text-gray-500">
          Showing {cancellations.length} of {pagination.total} cancellations
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={() => fetchCancellations(filters.page)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Cancellations Table */}
      {cancellations.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No cancellations available for the selected filters.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Show</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seats</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Refund Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Refund Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cancellations.map((cancellation) => (
                  <tr key={cancellation._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {cancellation._id.slice(-6)} {/* Shortened ID */}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cancellation.userId?.name || 'N/A'}<br />
                      <span className="text-gray-500">{cancellation.userId?.email}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {cancellation.showId?.title}<br />
                      <span className="text-gray-500">
                        {cancellation.showId?.theater} - {cancellation.showId?.screen}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {cancellation.seatIds.join(', ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(cancellation.bookingDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${cancellation.totalPrice}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      ${cancellation.refundAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        cancellation.refundStatus === 'Processed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {cancellation.refundStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        to={`/admin/bookings/${cancellation._id}`} // Assuming detail route
                        className="text-green-600 hover:text-green-900 mr-2"
                      >
                        View
                      </Link>
                      {cancellation.refundStatus !== 'Processed' && (
                        <button
                          onClick={() => {/* Implement processRefund function */ console.log('Process refund for', cancellation._id);}}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Process Refund
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.total > filters.limit && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-700">
                Showing page {pagination.page} of {Math.ceil(pagination.total / filters.limit)}
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page * filters.limit >= pagination.total}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ViewCancellationsRefunds;