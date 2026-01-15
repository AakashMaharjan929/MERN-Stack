import React, { useState, useEffect } from 'react';
import { getMyBookings } from '../api/theaterManagerAPI';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await getMyBookings();
      setBookings(response.data);
    } catch (err) {
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    // Filter by status
    const statusMatch = filterStatus === 'all' || booking.status === filterStatus;
    
    // Filter by search query (booking ID or customer name)
    const searchLower = searchQuery.toLowerCase();
    const bookingIdMatch = booking._id.toLowerCase().includes(searchLower);
    const customerNameMatch = booking.userId?.name?.toLowerCase().includes(searchLower) || false;
    const searchMatch = searchQuery === '' || bookingIdMatch || customerNameMatch;
    
    return statusMatch && searchMatch;
  });

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Bookings Management</h1>
        <p className="text-gray-600 text-sm mt-1">View and manage all customer bookings</p>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search Input */}
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-2">
              Search by Booking ID or Customer Name
            </label>
            <input
              type="text"
              placeholder="Enter booking ID or customer name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-2 text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Clear search
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-2">
              Filter by Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Bookings</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="text-sm text-gray-600">
          Showing <span className="font-semibold">{filteredBookings.length}</span> of <span className="font-semibold">{bookings.length}</span> bookings
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <i className="fas fa-search text-4xl text-gray-300 mb-4"></i>
          <p className="text-gray-600 mb-2">
            {searchQuery || filterStatus !== 'all' 
              ? 'No bookings match your search or filter criteria' 
              : 'No bookings found'}
          </p>
          {(searchQuery || filterStatus !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterStatus('all');
              }}
              className="mt-4 text-green-600 hover:text-green-700 font-medium text-sm underline"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map(booking => (
            <div key={booking._id} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {booking.showId?.movieId?.name}
                  </h3>
                  <p className="text-gray-600 text-sm">Booking ID: {booking._id}</p>
                </div>
                <span className={`text-sm font-medium px-3 py-1 rounded ${
                  booking.status === 'Confirmed' 
                    ? 'bg-green-100 text-green-800' 
                    : booking.status === 'Cancelled'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {booking.status}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-gray-600 text-xs">Customer</p>
                  <p className="font-semibold">{booking.userId?.name}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs">Seats</p>
                  <p className="font-semibold">
                    {(() => {
                      // Try different possible field names for seats
                      const seats = booking.seatNumbers 
                        || booking.seats 
                        || booking.bookedSeats
                        || booking.seatIds;
                      
                      if (Array.isArray(seats)) {
                        // If it's array of objects with seatNumber property
                        if (seats.length > 0 && typeof seats[0] === 'object' && seats[0].seatNumber) {
                          return seats.map(s => s.seatNumber).join(', ');
                        }
                        // If it's array of strings/numbers
                        return seats.join(', ');
                      }
                      return 'N/A';
                    })()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs">Total Price</p>
                  <p className="font-semibold">Rs. {booking.totalPrice?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs">Booking Date</p>
                  <p className="font-semibold">{new Date(booking.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;
