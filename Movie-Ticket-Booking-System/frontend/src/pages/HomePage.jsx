import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Assuming react-toastify is used for toasts

const HomePage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);

    toast.info('Logged out successfully!', {
      position: "top-right",
      autoClose: 3000,
    });

    // Redirect to login
    navigate('/login');
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome Home!</h1>
      <div className="bg-white rounded-lg shadow-md p-6 max-w-md">
        <h2 className="text-xl font-semibold mb-2">User Profile</h2>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        {user.role && <p><strong>Role:</strong> {user.role}</p>}
        <button
          onClick={handleLogout}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default HomePage;