// Updated Sidebar.jsx - Added Bookings submenu with View Cancellations/Refunds, Ticket History, and Revenue Breakdown
// Added logout button at the bottom with red hover to match theme
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenu, setExpandedMenu] = useState('theaters'); // Track single expanded key (default theaters)

  const menuItems = [
    { path: 'dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
    {
      path: 'theaters',
      label: 'Theaters',
      icon: 'fas fa-building',
      subItems: [
        { path: 'theaters/add', label: 'Add/Edit Theater', icon: 'fas fa-plus-circle' },
        { path: 'theaters/list', label: 'List/View Theaters', icon: 'fas fa-list' },
      ],
    },
    {
      path: 'screens',
      label: 'Screens',
      icon: 'fas fa-tv',
      subItems: [
        { path: 'screens/add', label: 'Add/Edit Screen', icon: 'fas fa-plus-circle' },
        { path: 'screens/list', label: 'List/View Screens', icon: 'fas fa-list' },
        // { path: 'screens/layout', label: 'Seat Layout Editor', icon: 'fas fa-th-large' },
        // { path: 'screens/capacity', label: 'Capacity Management', icon: 'fas fa-chart-bar' },
      ],
    },
    {
      path: 'movies',
      label: 'Movies',
      icon: 'fas fa-film',
      subItems: [
        { path: 'movies/add', label: 'Add/Edit Movie', icon: 'fas fa-plus-circle' },
        { path: 'movies/catalog', label: 'Catalog Management', icon: 'fas fa-list' },
        // { path: 'movies/media', label: 'Trailers/Posters Upload', icon: 'fas fa-upload' },
      ],
    },
    {
      path: 'shows',
      label: 'Shows',
      icon: 'fas fa-calendar-alt',
      subItems: [
        { path: 'shows/schedule', label: 'Schedule Show', icon: 'fas fa-plus-circle' },
        { path: 'shows/list', label: 'List Shows', icon: 'fas fa-list' },
        { path: 'shows/bulk', label: 'Bulk Scheduling', icon: 'fas fa-clone' },
        { path: 'shows/checker', label: 'Conflict Checker', icon: 'fas fa-exclamation-triangle' },
      ],
    },
    {
      path: 'users',
      label: 'Users',
      icon: 'fas fa-users',
      subItems: [
        { path: 'users/management', label: 'Customer Management', icon: 'fas fa-user-edit' },
        { path: 'users/blacklist', label: 'Blacklist', icon: 'fas fa-ban' },
      ],
    },
    {
      path: 'bookings',
      label: 'Bookings',
      icon: 'fas fa-ticket-alt',
      subItems: [
        { path: 'bookings/cancellations', label: 'View Cancellations/Refunds', icon: 'fas fa-undo-alt' },
        { path: 'bookings/history', label: 'Ticket History', icon: 'fas fa-history' },
        { path: 'bookings/revenue', label: 'Revenue Breakdown', icon: 'fas fa-chart-line' },
      ],
    },
    { path: 'reports', label: 'Reports', icon: 'fas fa-chart-pie' },
    { path: 'settings', label: 'Settings', icon: 'fas fa-cog' },
  ];

  const handleNavigation = (path) => {
    navigate(path); // Relative path - no leading '/'
  };

  const isActive = (path) => location.pathname.endsWith(path);

  const handleToggleSubmenu = (menuKey, e) => {
    e.stopPropagation(); // Prevent parent navigation
    setExpandedMenu(prev => prev === menuKey ? null : menuKey); // Toggle: close if open, open if closed; null collapses all
  };

  const handleLogout = () => {
    // TODO: Implement full logout logic (e.g., clear auth token, localStorage, etc.)
    localStorage.removeItem('token'); // Example: clear token
    navigate('/login');
  };

  return (
    <div className={`sidebar fixed left-0 top-0 h-screen bg-white text-[#2E2E2E] overflow-hidden z-50 shadow-lg border-r border-[#E5E7EB] transition-all duration-300 flex flex-col ${
      isOpen ? 'w-64 p-5' : 'w-16 p-3' // Restored p-5 for lean feel
    }`}>
      {/* Header with Toggle + Title */}
      <div className={`mb-8 border-b border-[#E5E7EB] pb-4 transition-all duration-300 ${
        isOpen ? 'flex items-center justify-between' : 'flex justify-center'
      }`}>
        {/* Title - Hidden when closed */}
        {isOpen && <h2 className="text-lg font-bold text-[#2E2E2E] flex-1"><img src="/images/logoBlack.png" alt="Admin Panel" /></h2>}
        
        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg hover:bg-[#A7F3D0] transition-colors duration-200 flex justify-center items-center"
        >
          <i className={`fas ${isOpen ? 'fa-chevron-left' : 'fa-chevron-right'} text-[#6B7280] text-base`}></i>
        </button>
      </div>

      {/* Menu Items - Scrollable */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <ul className="list-none p-0 space-y-1"> {/* Removed max-h-full from ul, now on parent */}
          {menuItems.map((item) => {
            const active = isActive(item.path);
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isParentActive = hasSubItems && item.subItems.some(sub => isActive(sub.path));
            const expanded = expandedMenu === item.path; // Single expanded
            
            if (hasSubItems) {
              // Parent item with submenu
              return (
                <li key={item.path}>
                  <button
                    onClick={(e) => {
                      if (!isOpen) handleNavigation(item.path); // Fallback nav when closed
                      else handleToggleSubmenu(item.path, e);
                    }}
                    className={`w-full rounded-lg text-left cursor-pointer text-sm flex items-center justify-between transition-all duration-200 ${
                      isOpen ? 'p-3 hover:bg-[#A7F3D0]' : 'p-3 justify-center hover:bg-[#A7F3D0]' // Restored p-3
                    } ${
                      active || isParentActive 
                        ? 'bg-gradient-to-r from-[#16A34A] to-[#22C55E] text-white shadow-md' 
                        : ''
                    }`}
                  >
                    <div className="flex items-center flex-1">
                      <i className={`${item.icon} text-base flex-shrink-0 ${
                        isOpen 
                          ? `mr-2.5 ${active || isParentActive ? 'text-white' : 'text-[#6B7280]'}` // mr-2.5 (10px) for balance
                          : (active || isParentActive) ? 'text-white' : 'text-[#6B7280]'
                      }`}></i>
                      {isOpen && (
                        <span className={`text-[#6B7280] ${(active || isParentActive) ? 'text-white' : ''} flex-1 min-w-0 truncate`}>
                          {item.label}
                        </span>
                      )}
                    </div>
                    {isOpen && (
                      <i 
                        className={`fas fa-chevron-down text-base transition-transform duration-200 flex-shrink-0 ${
                          expanded ? 'rotate-0' : 'rotate-180'
                        } ${active || isParentActive ? 'text-white' : 'text-[#6B7280]'}`}
                      ></i>
                    )}
                  </button>
                  
                  {/* Submenu - Balanced indent and spacing */}
                  {isOpen && expanded && (
                    <ul className="list-none p-0 ml-5 space-y-0.5 mt-1 bg-[#F5F6FA]/50 rounded-lg py-1 border-l border-[#A7F3D0]/30 overflow-hidden"> {/* ml-5 (20px) */}
                      {item.subItems.map((subItem) => {
                        const subActive = isActive(subItem.path);
                        return (
                          <li key={subItem.path} className="overflow-hidden">
                            <button
                              onClick={() => handleNavigation(subItem.path)}
                              className={`w-full rounded-md text-left cursor-pointer text-xs font-medium flex items-center pl-2.5 py-1.5 hover:bg-[#A7F3D0]/80 transition-all duration-200 group ${
                                subActive 
                                  ? 'bg-gradient-to-r from-[#16A34A] to-[#22C55E] text-white shadow-inner' 
                                  : 'text-[#6B7280]'
                              }`}
                            >
                              <i className={`${subItem.icon} mr-1.5 text-sm flex-shrink-0 ${subActive ? 'text-white' : 'text-[#6B7280]'} group-hover:text-[#16A34A]`}></i>
                              <span className="whitespace-nowrap overflow-hidden text-ellipsis flex-1">{subItem.label}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            } else {
              // Regular item
              return (
                <li key={item.path}>
                  <button
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full rounded-lg text-left cursor-pointer text-sm flex transition-all duration-200 ${
                      isOpen 
                        ? 'p-3 items-center hover:bg-[#A7F3D0]' // Restored p-3
                        : 'p-3 justify-center hover:bg-[#A7F3D0]'
                    } ${
                      active 
                        ? 'bg-gradient-to-r from-[#16A34A] to-[#22C55E] text-white shadow-md' 
                        : ''
                    }`}
                  >
                    <i className={`${item.icon} text-base ${
                      isOpen 
                        ? `mr-2.5 ${active ? 'text-white' : 'text-[#6B7280]'}` // mr-2.5 for consistency
                        : active ? 'text-white' : 'text-[#6B7280]'
                    }`}></i>
                    {isOpen && (
                      <span className={`text-[#6B7280] ${active ? 'text-white' : ''} flex-1 min-w-0 truncate`}>
                        {item.label}
                      </span>
                    )}
                  </button>
                </li>
              );
            }
          })}
        </ul>
      </div>

      {/* Logout Button - Pushed to bottom */}
      <div className={`mt-4 pt-4 border-t border-[#E5E7EB] transition-all duration-300 ${
        isOpen ? 'flex items-center' : 'flex justify-center'
      }`}>
        <button
          onClick={handleLogout}
          className={`w-full rounded-lg text-left cursor-pointer transition-all duration-200 ${
            isOpen 
              ? 'p-3 hover:bg-red-50 hover:text-red-600 flex items-center text-[#6B7280]' 
              : 'p-3 justify-center hover:bg-red-50 hover:text-red-600 text-[#6B7280]'
          }`}
        >
          <i className={`fas fa-sign-out-alt text-base flex-shrink-0 ${
            isOpen ? 'mr-2.5' : ''
          }`}></i>
          {isOpen && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;