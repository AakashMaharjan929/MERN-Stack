import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { loginUser } from "../api/authAPI.js"; // Assuming this exists similar to registerUser
import { ToastContainer, toast } from 'react-toastify';

const LoginPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [inputError, setInputError] = useState({ email: false, password: false });
  const [showPassword, setShowPassword] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fullText = "Welcome back. Log in to continue your cinematic adventure!";

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      try {
        const userData = JSON.parse(user);
        let redirectPath = '/';
        if (userData.role === 'admin') {
          redirectPath = '/admin/dashboard';
        } else if (userData.role === 'theater_manager') {
          redirectPath = '/theater-manager/dashboard';
        }
        navigate(redirectPath, { replace: true });
      } catch {
        // If parsing fails, clear invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, [navigate]);

  useEffect(() => {
    // Fade-in on load
    const fadeTimer = setTimeout(() => {
      const page = document.querySelector('.fade-in');
      if (page) page.classList.remove('opacity-0');
    }, 100);

    // Typewriter effect (runs once)
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.substring(0, index));
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);

    return () => {
      clearTimeout(fadeTimer);
      clearInterval(typingInterval);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const formData = new FormData(e.target);
    const userData = {
      email: formData.get('email'),
      password: formData.get('password'),
    };

    if (!userData.email || !userData.password) {
      setError('Email and password are required');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(userData.email)) {
      setError('Please enter a valid email');
      return;
    }

    if (userData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      const response = await loginUser({
        email: userData.email,
        password: userData.password,
      });

      if (response.status === 200) {
        // Store JWT token and user data in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        toast.success("🎉 Login successful! ", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        setError("");

        // Conditional redirect based on user role
        const userRole = response.data.user.role;
        let redirectPath = '/';
        if (userRole === 'admin') {
          redirectPath = '/admin/dashboard';
        } else if (userRole === 'theater_manager') {
          redirectPath = '/theater-manager/dashboard';
        }
        localStorage.setItem('userRole', userRole);
        setTimeout(() => navigate(redirectPath), 4000); // Redirect after success
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    if (emailValue && !/^\S+@\S+\.\S+$/.test(emailValue)) {
      setInputError((prev) => ({ ...prev, email: true }));
    } else {
      setInputError((prev) => ({ ...prev, email: false }));
    }
  };

  const handlePasswordChange = (e) => {
    const passwordValue = e.target.value;
    if (passwordValue.length < 6) {
      setInputError((prev) => ({ ...prev, password: true }));
    } else {
      setInputError((prev) => ({ ...prev, password: false }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Don't render if user is already logged in
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  if (token && user) {
    return (
      <div className="min-h-screen w-screen overflow-hidden relative flex items-center justify-center bg-[url('/bgsignup.png')] bg-cover bg-center bg-no-repeat">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="flex flex-col items-center gap-4 text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-500 border-solid"></div>
          <div className="text-lg">Redirecting…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen overflow-hidden relative">
      {/* Toast container */}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Full Animated Background */}
      <div className="area w-full h-screen absolute top-0 left-0 fade-in opacity-0 transition-opacity duration-1000" style={{ background: '#00A170', background: '-webkit-linear-gradient(to left, #B2F5EA, #00A170)' }}>
        <ul className="circles w-full h-full">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>

      {/* Logo Overlay */}
      <div className="absolute top-12 left-12 z-50 pointer-events-auto">
        <button
          type="button"
          aria-label="Go to Home"
          onClick={() => {
            console.log('Logo clicked → navigating to /');
            navigate('/');
          }}
          className="focus:outline-none"
        >
          <img src="/images/logoGreen.png" alt="Cinemas Logo" className="h-11 mb-4 cursor-pointer hover:opacity-80 transition-opacity" />
        </button>
      </div>

      {/* Typed Text Overlay */}
      <div className="absolute bottom-12 left-12 z-10">
        <h1 className="text-4xl font-bold text-white">
          <span className="block">
            {typedText.split(' ').map((word, index) => {
              const gradientWords = ["back", "cinematic", "adventure"];
              return (
                <span key={index} className={gradientWords.includes(word) ? 'text-transparent bg-clip-text bg-gradient-to-tr from-lime-600 to-teal-500' : 'text-white'}>
                  {word}{' '}
                </span>
              );
            })}
          </span>
        </h1>
      </div>

      {/* Centered White Form Card */}
      <div className="relative z-20 flex items-center justify-center w-full h-screen p-8">
        <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 text-center">Welcome back</h2>
          {error && <p className="text-red-600 mb-4 text-left">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-left">
                Email
              </label>
              <div className="relative flex items-center mt-1">
                <i className="fas fa-envelope absolute left-3 text-gray-400"></i>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="your.email@example.com"
                  className={"pl-10 pr-2 w-full h-10 border rounded-md focus:ring focus:ring-green-500 focus:outline-none border-gray-300"}
                  onChange={handleEmailChange}
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 text-left">
                Password
              </label>
              <div className="relative flex items-center mt-1">
                <i className="fas fa-lock absolute left-3 text-gray-400"></i>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  id="password"
                  placeholder="Enter your password"
                  className={"pl-10 pr-10 w-full h-10 border rounded-md focus:ring focus:ring-green-500 focus:outline-none border-gray-300"}
                  onChange={handlePasswordChange}
                  disabled={isLoading}
                />
                <i
                  className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} absolute right-3 text-gray-400 cursor-pointer ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
                  onClick={togglePasswordVisibility}
                ></i>
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>
          </form>
          <p className="mt-4 text-center text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-green-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;