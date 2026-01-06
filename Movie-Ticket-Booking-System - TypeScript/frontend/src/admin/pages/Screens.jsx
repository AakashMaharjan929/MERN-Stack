// New: Screens.jsx - Wrapper layout for screens sub-routes with shared UI and Outlet (create in /admin/pages)
import React from 'react';
import { Outlet, useParams } from 'react-router-dom';

const Screens = () => {
  const { id } = useParams(); // Optional: For screen-specific context if needed

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-[#E5E7EB]">
      <h1 className="text-2xl font-bold text-[#2E2E2E] mb-4">Screens Management</h1>
      {id && <p className="text-[#6B7280] text-sm mb-4">Managing Screen ID: {id}</p>}
      <Outlet /> {/* Renders child routes: add/edit, layout editor, capacity */}
    </div>
  );
};

export default Screens;