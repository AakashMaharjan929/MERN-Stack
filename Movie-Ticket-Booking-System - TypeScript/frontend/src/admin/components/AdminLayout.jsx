// Updated AdminLayout.jsx - Add state for sidebar toggle and pass to Sidebar
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuthGuard } from '../hooks/useAuthGuard'; // Redirect if not admin
import Sidebar from './Sidebar'; // Adjust path as needed

const AdminLayout = () => {
  useAuthGuard('admin'); // Hook checks role from token
  const [isOpen, setIsOpen] = useState(true); // State for sidebar open/close

  return (
    <div className="admin-layout flex h-screen bg-white"> {/* Main bg white per color scheme */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} /> {/* Pass state to Sidebar */}
      <div className={`main-content flex-1 p-6 overflow-y-auto transition-all duration-300 ${
        isOpen ? 'ml-64' : 'ml-16'
      }`}>
        {/* <Header /> - Add here if needed; spans full width */}
        <Outlet /> {/* Renders the nested route content dynamically */}
      </div>
    </div>
  );
};

export default AdminLayout;