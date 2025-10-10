// Fixed AdminRouter.jsx - Use relative paths for nested router behavior
import { Routes, Route } from 'react-router-dom';
import { useAuthGuard } from '../hooks/useAuthGuard'; // Redirect if not admin
import Dashboard from '../pages/Dashboard';
import Sidebar from '../components/Sidebar'; // Assuming Sidebar is in components folder

const AdminRouter = () => {
  useAuthGuard('admin'); // Hook checks role from token

  return (
    <div className="admin-layout flex h-screen bg-gray-50">
      <Sidebar /> {/* Fixed sidebar stays put */}
      <div className="main-content flex-1 ml-64 p-6 overflow-y-auto">
        {/* <Header /> - Add if needed; it would go here and span the full width */}
        <Routes>
          <Route index element={<Dashboard />} /> {/* Default route for /admin */}
          <Route path="dashboard" element={<Dashboard />} />
          {/* Placeholder routes - replace with actual pages as you build them */}
          <Route path="theaters" element={<div className="text-gray-800">Theaters Page (TBD)</div>} />
          <Route path="screens" element={<div className="text-gray-800">Screens Page (TBD)</div>} />
          <Route path="movies" element={<div className="text-gray-800">Movies Page (TBD)</div>} />
          <Route path="shows" element={<div className="text-gray-800">Shows Page (TBD)</div>} />
          <Route path="users" element={<div className="text-gray-800">Users Page (TBD)</div>} />
          <Route path="bookings" element={<div className="text-gray-800">Bookings Page (TBD)</div>} />
          <Route path="reports" element={<div className="text-gray-800">Reports Page (TBD)</div>} />
          <Route path="settings" element={<div className="text-gray-800">Settings Page (TBD)</div>} />
          {/* Catch-all for unmatched routes */}
          <Route path="*" element={<div className="text-gray-800">404 - Page Not Found</div>} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminRouter;