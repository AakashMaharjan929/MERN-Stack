// components/Navbar.jsx - Updated city modal with stylish box-like city options
// Updated: Changed search navigation to home page with query params (?q=...&city=...) instead of /search
// Added: Autocomplete dropdown for Trie suggestions (passed as props from HomePage)
// Updated: Added user dropdown menu when logged in with My Tickets and Logout
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ onSearch, suggestions = [] }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Kathmandu'); // Default to Kathmandu
  const [showCityModal, setShowCityModal] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Check if user is logged in
  const isLoggedIn = !!localStorage.getItem('token');

  const navItems = [
    { path: '/', label: 'Home' },
    {
      path: '/movies',
      label: 'Movies',
      subItems: [
        { path: '/movies/now-showing/all', label: 'Now Showing' },
        { path: '/movies/coming-soon/all', label: 'Coming Soon' },
      ],
    },
    { path: '/schedule', label: 'Schedule' },
    { path: '/contact', label: 'Contact' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}&city=${encodeURIComponent(selectedCity)}`);
      setSearchQuery('');
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.title);
    // Trigger search with full title
    navigate(`/?q=${encodeURIComponent(suggestion.title)}&city=${encodeURIComponent(selectedCity)}`);
    setShowSuggestions(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearch) onSearch(value); // Notify parent for Trie update
    setShowSuggestions(value.length > 0);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const cities = [
    { value: 'Kathmandu', label: 'Kathmandu' },
    { value: 'Pokhara', label: 'Pokhara' },
    { value: 'Biratnagar', label: 'Biratnagar' },
    { value: 'Lalitpur', label: 'Lalitpur' },
    { value: 'Bharatpur', label: 'Bharatpur' },
  ];

  const CitySelector = ({ selectedCity, setShowCityModal, isMobile = false }) => {
    return (
      <div className="relative">
        <div
          className={`bg-gradient-to-r from-[#0f5132] to-[#0d6b20] border border-[#0d6b20]/50 rounded-md px-3 py-1 pr-8 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#d1f2eb]/50 cursor-pointer shadow-md flex items-center transition-colors hover:bg-[#0d6b20]/80 ${
            isMobile ? 'w-full' : 'min-w-[140px]'
          }`}
          onClick={() => setShowCityModal(true)}
        >
          <span className="truncate flex-1">{selectedCity}</span>
          <i className="fas fa-map-marker-alt absolute right-3 top-1/2 transform -translate-y-1/2 text-[#d1f2eb] text-sm"></i>
          <i className="fas fa-chevron-down absolute right-8 top-1/2 transform -translate-y-1/2 text-[#d1f2eb] text-sm pointer-events-none"></i>
        </div>
      </div>
    );
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#0f5132] via-[#0d6b20] to-[#1a7372] text-white shadow-lg border-b border-[#0d6b20]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Stylish City Select */}
            <div className="flex items-center space-x-3">
              <Link to="/" className="flex items-center">
                <img src="/images/logoGreen.png" alt="Movie Ticket Booking" className="h-8 w-auto" />
              </Link>
              {/* Stylish City Select (dark green bg, white text, pin icon) */}
              <CitySelector selectedCity={selectedCity} setShowCityModal={setShowCityModal} />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-6">
                {navItems.map((item) => {
                  if (item.subItems) {
                    return (
                      <div key={item.path} className="relative group">
                        <button
                          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                            isActive(item.path) ? 'text-[#d1f2eb]' : 'text-white hover:text-[#d1f2eb]'
                          }`}
                        >
                          {item.label}
                        </button>
                        <div className="absolute top-full left-0 mt-1 bg-gradient-to-r from-[#0f5132] to-[#0d6b20] text-white rounded-lg shadow-lg py-1 z-10 min-w-[150px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-[#0d6b20]/50">
                          {item.subItems.map((subItem) => (
                            <Link
                              key={subItem.path}
                              to={subItem.path}
                              className="block px-4 py-2 text-sm hover:bg-[#0d6b20]/50 hover:text-[#d1f2eb] transition-colors"
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive(item.path) ? 'text-[#d1f2eb]' : 'text-white hover:text-[#d1f2eb]'
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Desktop User Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Attractive Search Bar with Autocomplete */}
              <div className="relative">
                <form onSubmit={handleSearchSubmit} className="relative w-80">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleInputChange}
                    placeholder="Search movies..."
                    className="w-full p-3 pl-10 pr-10 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#d1f2eb]/50 focus:border-transparent transition-all shadow-md bg-white/90 border border-[#0d6b20]/50"
                  />
                  <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#0d6b20]"></i>
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#0d6b20] hover:text-[#16A34A] transition-colors"
                  >
                    <i className="fas fa-search text-lg"></i>
                  </button>
                </form>
                {/* Autocomplete Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <ul className="absolute top-full left-0 right-0 bg-white rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto z-20 border border-gray-200">
                    {suggestions.map((movie, idx) => (
                      <li key={idx}>
                        <button
                          onClick={() => handleSuggestionClick(movie)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-800 truncate"
                        >
                          {movie.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {/* Auth/Logout or User Menu */}
              {!isLoggedIn ? (
                <>
                  <Link
                    to="/login"
                    className="text-sm font-medium text-white hover:text-[#d1f2eb] transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-[#d1f2eb] text-[#0f5132] px-4 py-2 rounded-full text-sm font-semibold hover:bg-white hover:text-[#0d6b20] transition-all shadow-md"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <div className="relative group">
                  <button
                    className="px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center text-white hover:text-[#d1f2eb]"
                  >
                    <i className="fas fa-user mr-2"></i>
                    Account
                  </button>
                  <div className="absolute top-full right-0 mt-1 bg-gradient-to-r from-[#0f5132] to-[#0d6b20] text-white rounded-lg shadow-lg py-1 z-10 min-w-[150px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-[#0d6b20]/50">
                    <Link
                      to="/my-tickets"
                      className="block px-4 py-2 text-sm hover:bg-[#0d6b20]/50 hover:text-[#d1f2eb] transition-colors"
                    >
                      My Tickets
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-[#0d6b20]/50 hover:text-[#d1f2eb] transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-white hover:text-[#d1f2eb] hover:bg-[#0d6b20]/50 transition-colors"
              >
                <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-lg`}></i>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-gradient-to-b from-[#0f5132] to-[#0d6b20] border-t border-[#0d6b20]/50">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <div key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors text-white hover:bg-[#0d6b20]/50 hover:text-[#d1f2eb] ${
                      isActive(item.path) ? 'text-[#d1f2eb]' : ''
                    }`}
                  >
                    {item.label}
                  </Link>
                  {item.subItems && (
                    <div className="pl-4 space-y-1 bg-[#0d6b20]/50 rounded-md mt-1 border border-[#0d6b20]/50">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.path}
                          to={subItem.path}
                          onClick={() => setIsMenuOpen(false)}
                          className={`block px-3 py-2 rounded-md text-base font-medium transition-colors text-white hover:bg-[#0d6b20]/70 hover:text-[#d1f2eb] ${
                            isActive(subItem.path) ? 'text-[#d1f2eb]' : ''
                          }`}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {/* Mobile Search with Separate City Dropdown and Autocomplete */}
              <div className="pt-2 px-3 space-y-2">
                <CitySelector selectedCity={selectedCity} setShowCityModal={setShowCityModal} isMobile={true} />
                <div className="relative">
                  <form onSubmit={handleSearchSubmit} className="flex">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleInputChange}
                      placeholder="Search movies..."
                      className="flex-1 px-3 py-2 border border-[#0d6b20]/50 rounded-l-full focus:outline-none focus:ring-2 focus:ring-[#d1f2eb] bg-white/90 text-gray-800 placeholder-gray-500 text-sm"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#d1f2eb] text-[#0f5132] rounded-r-full hover:bg-white transition-colors text-sm"
                    >
                      <i className="fas fa-search"></i>
                    </button>
                  </form>
                  {/* Mobile Autocomplete Dropdown */}
                  {showSuggestions && suggestions.length > 0 && (
                    <ul className="absolute top-full left-0 right-0 bg-white rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto z-20 border border-gray-200">
                      {suggestions.map((movie, idx) => (
                        <li key={idx}>
                          <button
                            onClick={() => handleSuggestionClick(movie)}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-800 truncate"
                          >
                            {movie.title}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              {/* Mobile Auth/Logout or User Menu */}
              <div className="pt-4 pb-3 border-t border-[#0d6b20]/50">
                <div className="px-3 space-y-2">
                  {!isLoggedIn ? (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setIsMenuOpen(false)}
                        className="block text-base font-medium text-white hover:text-[#d1f2eb] transition-colors"
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setIsMenuOpen(false)}
                        className="block bg-[#d1f2eb] text-[#0f5132] px-4 py-2 rounded-full text-base font-semibold hover:bg-white hover:text-[#0d6b20] transition-all text-center shadow-md"
                      >
                        Sign Up
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/my-tickets"
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-3 py-2 text-base font-medium text-white hover:bg-[#0d6b20]/50 hover:text-[#d1f2eb] transition-colors flex items-center"
                      >
                        <i className="fas fa-ticket-alt mr-2"></i>
                        My Tickets
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 text-base font-medium text-white hover:bg-[#0d6b20]/50 hover:text-[#d1f2eb] transition-colors"
                      >
                        Logout
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Centered City Modal Popup with Blur Background */}
      {showCityModal && (
        <div
          className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowCityModal(false)}
        >
          <div
            className="bg-gradient-to-r from-[#0f5132] to-[#0d6b20] text-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <i className="fas fa-map-marker-alt mr-2 text-[#d1f2eb]"></i>
              Select City
            </h3>
            <div className="space-y-3">
              {cities.map((city) => (
                <button
                  key={city.value}
                  onClick={() => {
                    setSelectedCity(city.value);
                    setShowCityModal(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg border border-[#0d6b20]/50 bg-[#0f5132]/30 hover:bg-[#0d6b20]/50 hover:text-[#d1f2eb] hover:border-[#d1f2eb]/50 transition-all duration-200 flex items-center shadow-md ${
                    selectedCity === city.value ? 'bg-[#0d6b20]/70 border-[#d1f2eb]/50 ring-1 ring-[#d1f2eb]/30' : ''
                  }`}
                >
                  <i className="fas fa-map-marker-alt mr-3 text-[#d1f2eb] text-sm"></i>
                  <span className="flex-1 font-medium">{city.label}</span>
                  {selectedCity === city.value && (
                    <i className="fas fa-check text-[#d1f2eb] text-sm ml-2"></i>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;