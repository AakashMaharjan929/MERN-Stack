// New: ShowsLayout.jsx - Wrapper for shows sub-routes with shared UI and Outlet (create in /admin/pages or /components)
import React from 'react';
import { Outlet } from 'react-router-dom';

const ShowsLayout = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-[#E5E7EB]">
      <h1 className="text-2xl font-bold text-[#2E2E2E] mb-4">Shows Management</h1>
      <Outlet /> {/* Renders child routes: add or list */}
    </div>
  );
};

export default ShowsLayout;