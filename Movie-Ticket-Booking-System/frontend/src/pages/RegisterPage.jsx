import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { sendOTP, verifyOTP } from "../api/authAPI.js"; // Updated imports for sendOTP and verifyOTP
import { registerUser } from '../api/userAPI.js'; // Assuming this exists similar to registerUser
import { ToastContainer, toast } from 'react-toastify';

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [typedText, setTypedText] = useState('');
  const [inputError, setInputError] = useState({ name: false, email: false, phone: false, password: false, confirmPassword: false });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [tempUserData, setTempUserData] = useState(null); // Store form data temporarily
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);

  const fullText = "Welcome. Begin your cinematic adventure now with our ticketing platform!";

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
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    };

    if (!userData.name || !userData.email || !userData.phone || !userData.password || !userData.confirmPassword) {
      setError('All fields are required');
      const form = document.querySelector('form');
      if (form) form.classList.add('animate-shake');
      setTimeout(() => form?.classList.remove('animate-shake'), 500);
      return;
    }
    if (userData.password !== userData.confirmPassword) {
      setError('Passwords do not match');
      const form = document.querySelector('form');
      if (form) form.classList.add('animate-shake');
      setTimeout(() => form?.classList.remove('animate-shake'), 500);
      return;
    }
    if (!/^\d{10}$/.test(userData.phone)) {
      setError('Phone must be exactly 10 digits');
      const form = document.querySelector('form');
      if (form) form.classList.add('animate-shake');
      setTimeout(() => form?.classList.remove('animate-shake'), 500);
      return;
    }
   if (!/^[a-zA-Z][a-zA-Z ]*$/.test(userData.name)) {
  setError('Name must start with a letter and contain only letters and spaces');
  const form = document.querySelector('form');
  if (form) form.classList.add('animate-shake');
  setTimeout(() => form?.classList.remove('animate-shake'), 500);
  return;
}

    if (passwordStrength === 'Weak') {
      setError('Password is too weak. Use at least 8 characters.');
      const form = document.querySelector('form');
      if (form) form.classList.add('animate-shake');
      setTimeout(() => form?.classList.remove('animate-shake'), 500);
      return;
    }

    // Store temp user data
    setTempUserData(userData);

    // Send OTP to email
    setIsSendingOTP(true);
    try {
      const otpResponse = await sendOTP({ email: userData.email });
      if (otpResponse.status === 200) {
        toast.info("OTP sent to your email! Please check and enter the 6-digit code.", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        setShowOTP(true);
      } else {
        setError('Failed to send OTP. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      setOtpError('OTP must be exactly 6 digits');
      const form = document.querySelector('#otp-form');
      if (form) form.classList.add('animate-shake');
      setTimeout(() => form?.classList.remove('animate-shake'), 500);
      return;
    }

    setIsVerifying(true);
    try {
      const verifyResponse = await verifyOTP({ email: tempUserData.email, otp });
      if (verifyResponse.status === 200) {
        // Now register the user
        const response = await registerUser({
          name: tempUserData.name,
          email: tempUserData.email,
          phone: tempUserData.phone,
          password: tempUserData.password,
        });

        if (response.status === 201) {
          toast.success("🎉 Registration successful! ", {
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
          setTimeout(() => navigate("/login"), 4000); 
        }
      } else {
        setOtpError('Invalid OTP. Please try again.');
      }
    } catch (err) {
      setOtpError(err.response?.data?.message || "OTP verification failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const resendOTP = async () => {
    if (!tempUserData?.email) return;
    setIsSendingOTP(true);
    try {
      const otpResponse = await sendOTP({ email: tempUserData.email });
      if (otpResponse.status === 200) {
        toast.info("OTP resent to your email!", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
      }
    } catch (err) {
      setOtpError('Failed to resend OTP. Please try again.');
    } finally {
      setIsSendingOTP(false);
    }
  };

  // Existing handlers remain the same
  const handlePhoneChange = (e) => {
    const phoneValue = e.target.value;
    setPhoneError('');
    setInputError((prev) => ({ ...prev, phone: false }));

    if (phoneValue && !/^\d*$/.test(phoneValue)) {
      setPhoneError('Phone must contain only digits');
      setInputError((prev) => ({ ...prev, phone: true }));
      const input = e.target;
      input.classList.add('border-red-500', 'animate-shake-small');
      setTimeout(() => input.classList.remove('border-red-500', 'animate-shake-small'), 500);
    } else if (phoneValue.length > 10) {
      setPhoneError('Phone must be exactly 10 digits');
      setInputError((prev) => ({ ...prev, phone: true }));
      const input = e.target;
      input.classList.add('border-red-500', 'animate-shake-small');
      setTimeout(() => input.classList.remove('border-red-500', 'animate-shake-small'), 500);
    } else if (phoneValue.length > 0 && phoneValue.length < 10) {
      setPhoneError('Phone must be exactly 10 digits');
      setInputError((prev) => ({ ...prev, phone: true }));
      const input = e.target;
      input.classList.add('border-red-500');
      setTimeout(() => input.classList.remove('border-red-500'), 500);
    }
  };

  const handleNameChange = (e) => {
    const nameValue = e.target.value;
    if (nameValue && !/^[a-zA-Z][a-zA-Z ]*$/.test(nameValue)) {
      setInputError((prev) => ({ ...prev, name: true }));
      const input = e.target;
      input.classList.add('border-red-500', 'animate-shake-small');
      setTimeout(() => input.classList.remove('border-red-500', 'animate-shake-small'), 500);
    } else {
      setInputError((prev) => ({ ...prev, name: false }));
    }
  };

  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    if (emailValue && !/^\S+@\S+\.\S+$/.test(emailValue)) {
      setInputError((prev) => ({ ...prev, email: true }));
      const input = e.target;
      input.classList.add('border-red-500', 'animate-shake-small');
      setTimeout(() => input.classList.remove('border-red-500', 'animate-shake-small'), 500);
    } else {
      setInputError((prev) => ({ ...prev, email: false }));
    }
  };

  const handlePasswordChange = (e) => {
    const passwordValue = e.target.value;
    let strength = '';
    if (passwordValue.length < 8) {
      strength = 'Weak';
      setInputError((prev) => ({ ...prev, password: true }));
      const input = e.target;
      input.classList.add('border-red-500', 'animate-shake-small');
      setTimeout(() => input.classList.remove('border-red-500', 'animate-shake-small'), 500);
    } else if (passwordValue.length <= 12 && /[a-zA-Z]/.test(passwordValue) && /\d/.test(passwordValue)) {
      strength = 'Medium';
    } else if (passwordValue.length > 12 || /[!@#$%^&*(),.?":{}|<>]/.test(passwordValue)) {
      strength = 'Strong';
    } else {
      strength = 'Medium';
    }
    setPasswordStrength(strength);
    setInputError((prev) => ({ ...prev, password: false }));
  };

  const handleConfirmPasswordChange = (e) => {
    const confirmValue = e.target.value;
    const passwordValue = document.getElementById('password').value;
    if (confirmValue && confirmValue !== passwordValue) {
      setInputError((prev) => ({ ...prev, confirmPassword: true }));
      const input = e.target;
      input.classList.add('border-red-500', 'animate-shake-small');
      setTimeout(() => input.classList.remove('border-red-500', 'animate-shake-small'), 500);
    } else {
      setInputError((prev) => ({ ...prev, confirmPassword: false }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleOtpChange = (e) => {
    const otpValue = e.target.value;
    setOtp(otpValue);
    setOtpError('');
    if (otpValue.length > 6) {
      e.target.value = otpValue.slice(0, 6);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-screen overflow-hidden">
      {/* Toast container */}
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex flex-col md:flex-row w-full h-screen fade-in opacity-0 transition-opacity duration-1000">
        {/* Left Section - Animated Background */}
        <div className="w-full md:w-1/2 h-full flex flex-col justify-between p-12 relative overflow-hidden">
          <div className="text-left z-10">
            <img src="./images/logoGreen.png" alt="Cinemas Logo" className="h-11 mb-4" />
          </div>
          <div className="area w-full h-full absolute top-0 left-0" style={{ background: '#00A170', background: '-webkit-linear-gradient(to left, #B2F5EA, #00A170)' }}>
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
          <div className="text-left z-10">
            <h1 className="text-4xl font-bold text-white">
              <span className="block">
                {typedText.split(' ').map((word, index) => {
                  const gradientWords = ["your", "cinematic", "adventure", "now"];
                  return (
                    <span key={index} className={gradientWords.includes(word) ? 'text-transparent bg-clip-text bg-gradient-to-tr from-lime-600 to-teal-500' : 'text-white'}>
                      {word}{' '}
                    </span>
                  );
                })}
              </span>
            </h1>
          </div>
        </div>

        {/* Right Section - Form */}
        <div className="w-full md:w-1/2 h-full bg-white flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {!showOTP ? (
              <>
                <h2 className="text-2xl font-semibold mb-6 text-gray-900 text-center">Create an account</h2>
                {error && <p className="text-red-600 mb-4 text-left">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 text-left">
                      Full Name
                    </label>
                    <div className="relative flex items-center mt-1">
                      <i className="fas fa-user absolute left-3 text-gray-400"></i>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Full Name"
                        className={`pl-10 pr-2 w-full h-10 border rounded-md focus:ring focus:ring-green-500 focus:outline-none ${inputError.name ? 'border-red-500' : 'border-gray-300'}`}
                        onChange={handleNameChange}
                      />
                    </div>
                  </div>
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
                        className={`pl-10 pr-2 w-full h-10 border rounded-md focus:ring focus:ring-green-500 focus:outline-none ${inputError.email ? 'border-red-500' : 'border-gray-300'}`}
                        onChange={handleEmailChange}
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 text-left">
                      Phone
                    </label>
                    <div className="relative flex items-center mt-1">
                      <i className="fas fa-phone absolute left-3 text-gray-400"></i>
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        placeholder="1234567890"
                        className={`pl-10 pr-2 w-full h-10 border rounded-md focus:ring focus:ring-green-500 focus:outline-none ${inputError.phone ? 'border-red-500' : 'border-gray-300'}`}
                        onChange={handlePhoneChange}
                      />
                    </div>
                    {phoneError && <p className="text-red-600 text-sm mt-1 text-left">{phoneError}</p>}
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
                        className={`pl-10 pr-10 w-full h-10 border rounded-md focus:ring focus:ring-green-500 focus:outline-none ${inputError.password ? 'border-red-500' : 'border-gray-300'}`}
                        onChange={handlePasswordChange}
                      />
                      <i
                        className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} absolute right-3 text-gray-400 cursor-pointer`}
                        onClick={togglePasswordVisibility}
                      ></i>
                    </div>
                    {passwordStrength && <p className="text-sm mt-1 text-left" style={{ color: passwordStrength === 'Weak' ? 'red' : passwordStrength === 'Medium' ? 'orange' : 'green' }}>{`Password Strength: ${passwordStrength}`}</p>}
                  </div>
                  <div className="relative">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 text-left">
                      Confirm Password
                    </label>
                    <div className="relative flex items-center mt-1">
                      <i className="fas fa-lock absolute left-3 text-gray-400"></i>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        id="confirmPassword"
                        placeholder="Confirm your password"
                        className={`pl-10 pr-10 w-full h-10 border rounded-md focus:ring focus:ring-green-500 focus:outline-none ${inputError.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                        onChange={handleConfirmPasswordChange}
                      />
                      <i
                        className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'} absolute right-3 text-gray-400 cursor-pointer`}
                        onClick={toggleConfirmPasswordVisibility}
                      ></i>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isSendingOTP}
                    className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600 disabled:opacity-50"
                  >
                    {isSendingOTP ? 'Sending OTP...' : 'Create account'}
                  </button>
                </form>
                <p className="mt-4 text-center text-gray-600">
                  Already Have An Account?{' '}
                  <Link to="/login" className="text-green-600 hover:underline">
                    Log In
                  </Link>
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-semibold mb-6 text-gray-900 text-center">Verify OTP</h2>
                <p className="text-gray-600 text-center mb-4">Enter the 6-digit code sent to {tempUserData?.email}</p>
                {otpError && <p className="text-red-600 mb-4 text-left">{otpError}</p>}
                <form id="otp-form" onSubmit={handleOTPSubmit} className="space-y-4">
                  <div className="relative">
                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700 text-left">
                      OTP Code
                    </label>
                    <div className="relative flex items-center mt-1">
                      <i className="fas fa-lock absolute left-3 text-gray-400"></i>
                      <input
                        type="text"
                        id="otp"
                        placeholder="123456"
                        maxLength="6"
                        className="pl-10 pr-2 w-full h-10 border border-gray-300 rounded-md focus:ring focus:ring-green-500 focus:outline-none"
                        value={otp}
                        onChange={handleOtpChange}
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isVerifying || otp.length !== 6}
                    className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600 disabled:opacity-50"
                  >
                    {isVerifying ? 'Verifying...' : 'Verify OTP'}
                  </button>
                </form>
                <p className="mt-4 text-center text-gray-600">
                  Didn't receive the code?{' '}
                  <button
                    onClick={resendOTP}
                    disabled={isSendingOTP}
                    className="text-green-600 hover:underline disabled:opacity-50"
                  >
                    {isSendingOTP ? 'Resending...' : 'Resend OTP'}
                  </button>
                </p>
                <p className="mt-2 text-center text-gray-600">
                  <button
                    onClick={() => { setShowOTP(false); setOtp(''); setOtpError(''); setTempUserData(null); }}
                    className="text-gray-600 hover:underline"
                  >
                    Back to form
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;