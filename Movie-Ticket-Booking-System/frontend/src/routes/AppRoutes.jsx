// Updated AppRoutes.jsx - Added BookingsLayout with nested routes for cancellations/refunds, ticket history, and revenue breakdown
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import RegisterPage from '../pages/RegisterPage';
import LoginPage from '../pages/LoginPage';
import AdminLayout from '../admin/components/AdminLayout'; // Adjust path to your AdminLayout
import Dashboard from '../admin/pages/Dashboard';
import TheatersLayout from '../admin/pages/Theaters'; // New import for theaters wrapper
// import other pages as needed
import AddEditTheater from '../admin/components/Theater/AddEdit'; // Adjust path
import ListTheaters from '../admin/components/Theater/List'; // Adjust path 
import Screens from '../admin/pages/Screens'; // New import for screens wrapper
import AddEditScreen from '../admin/components/Screen/AddEdit';
import SeatLayoutEditor from '../admin/components/Screen/SeatLayoutEditor';
import CapacityManagement from '../admin/components/Screen/CapacityManagement';
import ListViewScreens from '../admin/components/Screen/ListViewScreens';
import MoviesLayout from '../admin/pages/Movies'; // New import for movies wrapper
import AddEditMovie from '../admin/components/Movie/AddEdit'; // TBD: Create this component
import CatalogManagement from '../admin/components/Movie/CatalogManagement'; // TBD: List/View movies
// import TrailersPostersUpload from '../admin/components/Movie/TrailersPostersUpload'; 
import ShowsLayout from '../admin/pages/Shows'; // New import for shows wrapper
import ScheduleShow from '../admin/components/Shows/Schedule'; // TBD: Create this component
import BulkScheduling from '../admin/components/Shows/Bulk'; // TBD: Create this component
import ConflictChecker from '../admin/components/Shows/Checker'; // TBD: Create this component
import ListShows from '../admin/components/Shows/List'; // New import for list shows
import UsersLayout from '../admin/pages/Users'; // New import for users wrapper
import UsersManagement from '../admin/components/Users/Management'; // TBD: Create this component
import Blacklist from '../admin/components/Users/Blacklist'; // TBD: Create this component
import BookingsLayout from '../admin/pages/Bookings'; // New import for bookings wrapper
import ViewCancellationsRefunds from '../admin/components/Bookings/Cancellations'; // TBD: Create this component
import TicketHistory from '../admin/components/Bookings/History'; // TBD: Create this component
import RevenueBreakdown from '../admin/components/Bookings/Revenue'; // TBD: Create this component

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Nested admin routes - Sidebar persists via AdminLayout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} /> {/* /admin → /admin/dashboard */}
          <Route path="dashboard" element={<Dashboard />} />
          {/* Theaters nested routes - Now with layout for proper Outlet rendering */}
         <Route path="theaters" element={<TheatersLayout />}>
  <Route index element={<div className="text-[#6B7280]">Select an action: <Link to="add">Add</Link> or <Link to="list">View</Link> Theaters</div>} />
  <Route path="add/:id?" element={<AddEditTheater />} /> {/* :id? for edit/add */}
  <Route path="list" element={<ListTheaters />} />
</Route>
          <Route path="screens" element={<Screens />}>
  <Route path="add/:id?" element={<AddEditScreen />} />
  <Route path="list" element={<ListViewScreens />} />
  <Route path="layout/:id" element={<SeatLayoutEditor />} />
  <Route path="capacity/:id" element={<CapacityManagement />} />
</Route>
          {/* Movies nested routes - New layout with sub-routes */}
          <Route path="movies" element={<MoviesLayout />}>
            <Route index element={<div className="text-[#6B7280]">Select an action: <Link to="add">Add Movie</Link>, <Link to="catalog">Catalog</Link>, or <Link to="media">Upload Media</Link></div>} />
            <Route path="add/:id?" element={<AddEditMovie />} /> {/* :id? for edit/add */}
            <Route path="catalog" element={<CatalogManagement />} /> {/* List/View */}
            {/* <Route path="media" element={<TrailersPostersUpload />} /> Trailers/Posters */}
          </Route>
          {/* Shows nested routes - New layout with sub-routes */}
          <Route path="shows" element={<ShowsLayout />}>
            <Route index element={<div className="text-[#6B7280]">Select an action: <Link to="schedule">Schedule Show</Link>, <Link to="bulk">Bulk Scheduling</Link>, <Link to="checker">Conflict Checker</Link>, or <Link to="list">List Shows</Link></div>} />
            <Route path="schedule/:id?" element={<ScheduleShow />} /> {/* :id? for edit/add */}
            <Route path="bulk" element={<BulkScheduling />} />
            <Route path="checker" element={<ConflictChecker />} />
            <Route path="list" element={<ListShows />} />
          </Route>
          {/* Users nested routes - New layout with sub-routes */}
          <Route path="users" element={<UsersLayout />}>
            <Route index element={<div className="text-[#6B7280]">Select an action: <Link to="management">Customer Management</Link> or <Link to="blacklist">Blacklist</Link></div>} />
            <Route path="management" element={<UsersManagement />} />
            <Route path="blacklist" element={<Blacklist />} />
          </Route>
          {/* Bookings nested routes - New layout with sub-routes */}
          <Route path="bookings" element={<BookingsLayout />}>
            <Route index element={<div className="text-[#6B7280]">Select an action: <Link to="cancellations">View Cancellations/Refunds</Link>, <Link to="history">Ticket History</Link>, or <Link to="revenue">Revenue Breakdown</Link></div>} />
            <Route path="cancellations" element={<ViewCancellationsRefunds />} />
            <Route path="history" element={<TicketHistory />} />
            <Route path="revenue" element={<RevenueBreakdown />} />
          </Route>
          <Route path="reports" element={<div className="text-gray-800">Reports Page (TBD)</div>} />
          <Route path="settings" element={<div className="text-gray-800">Settings Page (TBD)</div>} />
          {/* Catch-all within /admin/* */}
          <Route path="*" element={<div className="text-gray-800">404 - Page Not Found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;