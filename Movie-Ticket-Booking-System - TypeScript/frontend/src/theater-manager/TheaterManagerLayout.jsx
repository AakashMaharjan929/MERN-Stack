import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthGuard } from './hooks/useAuthGuard.js';

const TheaterManagerLayout = () => {
  useAuthGuard('theater_manager');
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <div className="admin-layout flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${isOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col shadow-sm`}>
        {/* Logo/Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {isOpen && <img src="/images/logoBlack.png" alt="Logo" className="h-8" />}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-gray-100 rounded text-gray-600"
          >
            <i className={`fas fa-chevron-${isOpen ? 'left' : 'right'}`}></i>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          <a
            href="/theater-manager/dashboard"
            className="flex items-center space-x-3 p-3 hover:bg-green-50 rounded transition text-gray-700 hover:text-green-600"
          >
            <i className="fas fa-chart-line w-5 text-center"></i>
            {isOpen && <span className="text-sm font-medium">Dashboard</span>}
          </a>
          <a
            href="/theater-manager/theater"
            className="flex items-center space-x-3 p-3 hover:bg-green-50 rounded transition text-gray-700 hover:text-green-600"
          >
            <i className="fas fa-building w-5 text-center"></i>
            {isOpen && <span className="text-sm font-medium">Theater Details</span>}
          </a>
          <a
            href="/theater-manager/screens"
            className="flex items-center space-x-3 p-3 hover:bg-green-50 rounded transition text-gray-700 hover:text-green-600"
          >
            <i className="fas fa-tv w-5 text-center"></i>
            {isOpen && <span className="text-sm font-medium">Screens</span>}
          </a>
          <a
            href="/theater-manager/shows"
            className="flex items-center space-x-3 p-3 hover:bg-green-50 rounded transition text-gray-700 hover:text-green-600"
          >
            <i className="fas fa-film w-5 text-center"></i>
            {isOpen && <span className="text-sm font-medium">Shows</span>}
          </a>
          <a
            href="/theater-manager/bookings"
            className="flex items-center space-x-3 p-3 hover:bg-green-50 rounded transition text-gray-700 hover:text-green-600"
          >
            <i className="fas fa-ticket-alt w-5 text-center"></i>
            {isOpen && <span className="text-sm font-medium">Bookings</span>}
          </a>
          <a
            href="/theater-manager/reports"
            className="flex items-center space-x-3 p-3 hover:bg-green-50 rounded transition text-gray-700 hover:text-green-600"
          >
            <i className="fas fa-chart-bar w-5 text-center"></i>
            {isOpen && <span className="text-sm font-medium">Reports</span>}
          </a>
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 p-3 hover:bg-red-50 rounded transition text-gray-700 hover:text-red-600"
          >
            <i className="fas fa-sign-out-alt w-5 text-center"></i>
            {isOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 p-6 overflow-y-auto transition-all duration-300 bg-gray-50`}>
        <Outlet />
      </div>
    </div>
  );
};

export default TheaterManagerLayout;
