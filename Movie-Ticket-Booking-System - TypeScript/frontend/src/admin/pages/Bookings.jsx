// admin/pages/Bookings.jsx - BookingsLayout without border for cleaner look
import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const BookingsLayout = () => {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Bookings</h2>
        <nav className="space-x-3 text-sm">
          <Link to="cancellations" className="text-green-600 hover:underline">Cancellations</Link>
          <Link to="history" className="text-green-600 hover:underline">History</Link>
          <Link to="revenue" className="text-green-600 hover:underline">Revenue</Link>
        </nav>
      </div>
      <div className="rounded p-4 bg-white"> {/* Removed border class */}
        {/* Nested routes will render here */}
        <Outlet />
      </div>
    </div>
  );
};

export default BookingsLayout;