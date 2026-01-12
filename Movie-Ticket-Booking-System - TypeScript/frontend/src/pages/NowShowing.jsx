// src/pages/NowShowing.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getMovieById } from '../api/movieAPI';
import { getAllShows } from '../api/showAPI';
import { getAllTheaters } from '../api/theaterAPI';
import { loadStripe } from '@stripe/stripe-js';

// At top of file (after imports)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY); // Add to .env

const NowShowing = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const movieId = searchParams.get('movieId');

  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI States
  const [selectedCity, setSelectedCity] = useState("Kathmandu");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [selectedTheater, setSelectedTheater] = useState("all");
  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState(null);
  
  // Modal states for seat count input
  const [showSeatCountModal, setShowSeatCountModal] = useState(false);
  const [seatCountInput, setSeatCountInput] = useState("2");

  const seatSectionRef = useRef(null);
  const showsSectionRef = useRef(null);

  // Treat upcoming and live shows as selectable on this page
  const allowedStatuses = ['Upcoming', 'Live'];

  // Helper: Extract string ID
  const getIdString = (id) => {
    if (!id) return null;
    if (typeof id === 'string') return id;
    if (id.$oid) return id.$oid;
    if (id._id) return id._id.toString();
    return id.toString();
  };

  // Build date options from actual shows; fallback to next 10 days
  const defaultDateRange = () => {
    const out = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const today = new Date();
    for (let i = 0; i < 10; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const label = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
      out.push({ date: date.toISOString().split('T')[0], label, fullDate: date });
    }
    return out;
  };

  const dates = React.useMemo(() => {
    const validShows = shows.filter(show => allowedStatuses.includes(show.status));
    if (validShows.length === 0) return defaultDateRange();

    const today = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const uniqueDates = Array.from(new Set(validShows.map(show => new Date(show.startTime).toISOString().split('T')[0])));
    uniqueDates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    return uniqueDates.map((dateStr, idx) => {
      const dateObj = new Date(dateStr);
      const diffDays = Math.floor((dateObj.setHours(0, 0, 0, 0) - new Date(today).setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24));
      const label = diffDays === 0
        ? 'Today'
        : diffDays === 1
          ? 'Tomorrow'
          : `${days[dateObj.getDay()]} ${dateObj.getDate()} ${months[dateObj.getMonth()]}`;
      return { date: dateStr, label, fullDate: new Date(dateStr) };
    });
  }, [shows]);

  useEffect(() => {
    if (!selectedDate || !dates.some(d => d.date === selectedDate.date)) {
      setSelectedDate(dates[0]);
    }
  }, [dates, selectedDate]);

  // Auto-select first date with shows if current date has no shows
  useEffect(() => {
    if (shows.length === 0 || !selectedDate) return;

    // Check if there are shows for the currently selected date
    const hasShowsForSelectedDate = shows.some(show => {
      if (!allowedStatuses.includes(show.status)) return false;
      const showDateStr = new Date(show.startTime).toISOString().split('T')[0];
      return showDateStr === selectedDate.date;
    });

    // If no shows for selected date, find the first date with shows
    if (!hasShowsForSelectedDate) {
      for (const date of dates) {
        const hasShows = shows.some(show => {
          if (!allowedStatuses.includes(show.status)) return false;
          const showDateStr = new Date(show.startTime).toISOString().split('T')[0];
          return showDateStr === date.date;
        });
        if (hasShows) {
          setSelectedDate(date);
          break;
        }
      }
    }
  }, [shows, dates]);
  useEffect(() => {
    if (selectedShow && seatSectionRef.current) {
      seatSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedShow]);

  // Fetch movie
  useEffect(() => {
    if (!movieId) {
      navigate('/');
      return;
    }

    const fetchMovie = async () => {
      try {
        const data = await getMovieById(movieId);
        setMovie(data);
      } catch (err) {
        toast.error('Movie not found');
        navigate('/');
      }
    };

    fetchMovie();
  }, [movieId, navigate]);

  // Fetch theaters and shows
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [theatersData, showsData] = await Promise.all([
          getAllTheaters(),
          getAllShows({ movieId })
        ]);

        const movieShows = showsData.filter(show =>
          getIdString(show.movieId) === movieId
        );

        setTheaters(theatersData);
        setShows(movieShows);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Failed to load showtimes');
        toast.error('Could not load showtimes');
      } finally {
        setLoading(false);
      }
    };

    if (movieId) fetchData();
  }, [movieId]);

  // Extract unique cities
  const cities = ['all', ...new Set(theaters.map(t => t.location.city))].sort();

  // Extract unique theaters for selected city
  const theatersInCity = selectedCity === 'all' 
    ? theaters 
    : theaters.filter(t => t.location.city === selectedCity);
  const theaterNames = ['all', ...new Set(theatersInCity.map(t => t.name))].sort();

  // Filter shows
  const filteredShows = shows.filter(show => {
    if (!allowedStatuses.includes(show.status)) return false;

    const showDateStr = new Date(show.startTime).toISOString().split('T')[0];
    if (!selectedDate || showDateStr !== selectedDate.date) return false;

    const theater = theaters.find(t =>
      t.screens.some(screen => getIdString(screen) === getIdString(show.screenId))
    );
    if (!theater) return false;

    const showCity = theater.location?.city || 'Unknown';
    if (selectedCity !== "all" && showCity !== selectedCity) return false;

    if (selectedTheater !== "all" && theater.name !== selectedTheater) return false;

    if (selectedLanguage !== "all" && show.showType !== selectedLanguage) return false;

    return true;
  });

  // Group shows by theater
  const groupedShows = {};
  filteredShows.forEach(show => {
    const theater = theaters.find(t =>
      t.screens.some(screen => getIdString(screen) === getIdString(show.screenId))
    );
    if (!theater) return;

    const theaterName = theater.name;
    if (!groupedShows[theaterName]) groupedShows[theaterName] = {};

    const timeStr = new Date(show.startTime).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).toUpperCase();

    const validSeats = show.availableSeats.filter(s => s !== null);
    const availableCount = validSeats.filter(s => !s.isBooked).length;

    const lang = show.showType || 'Regular';

    if (!groupedShows[theaterName][lang]) {
      groupedShows[theaterName][lang] = [];
    }

    groupedShows[theaterName][lang].push({
      showId: show._id,
      time: timeStr,
      availableSeats: availableCount,
      fullShow: show,
      cinema: theaterName
    });
  });

  const cinemas = Object.keys(groupedShows);

  // Group all shows by date (for "All Available Shows" section)
  const allShowsByDate = {};
  shows.forEach(show => {
    if (!allowedStatuses.includes(show.status)) return;
    
    const theater = theaters.find(t =>
      t.screens.some(screen => getIdString(screen) === getIdString(show.screenId))
    );
    if (!theater) return;

    const showCity = theater.location?.city || 'Unknown';
    if (selectedCity !== "all" && showCity !== selectedCity) return;

    if (selectedTheater !== "all" && theater.name !== selectedTheater) return;

    const showDateStr = new Date(show.startTime).toISOString().split('T')[0];
    const showDate = new Date(show.startTime);
    const dateLabel = dates.find(d => d.date === showDateStr)?.label || showDateStr;

    if (!allShowsByDate[showDateStr]) {
      allShowsByDate[showDateStr] = { label: dateLabel, shows: [] };
    }

    const timeStr = showDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).toUpperCase();

    const validSeats = show.availableSeats.filter(s => s !== null);
    const availableCount = validSeats.filter(s => !s.isBooked).length;

    allShowsByDate[showDateStr].shows.push({
      showId: show._id,
      time: timeStr,
      availableSeats: availableCount,
      theater: theater.name,
      language: show.showType || 'Regular',
      fullShow: show,
      cinema: theater.name
    });
  });

  const getAvailabilityColor = (seats) => seats <= 5 ? 'bg-red-600' : seats <= 20 ? 'bg-orange-500' : 'bg-green-600';
  const getAvailabilityText = (seats) => seats <= 5 ? 'Filling Fast' : seats <= 20 ? 'Limited' : 'Available';

  // Check if a date has any shows
  const hasShowsOnDate = (dateStr) => {
    return shows.some(show => {
      if (!allowedStatuses.includes(show.status)) return false;
      const showDateStr = new Date(show.startTime).toISOString().split('T')[0];
      return showDateStr === dateStr;
    });
  };

  /**
   * Greedy Allocation Algorithm for Cinema Seat Selection
   * 
   * This implements a classic greedy algorithm similar to LeetCode's Cinema Seat Allocation problem.
   * 
   * Algorithm Strategy:
   * 1. Takes user input for number of seats needed (1-10)
   * 2. Prioritizes rows from center outward (best viewing experience)
   * 3. For each row, scans left-to-right for contiguous available seats
   * 4. Finds blocks of k contiguous seats where k = requested seats
   * 5. Prefers center seats within each row (better viewing angle)
   * 6. Returns the first valid block found (greedy approach - takes first best match)
   * 
   * Time Complexity: O(R × C × k) where:
   * - R = number of rows
   * - C = average seats per row
   * - k = number of seats requested
   * 
   * Space Complexity: O(R × C) for seat availability map
   * 
   * Features:
   * - Ensures contiguous seat allocation (groups stay together)
   * - Prioritizes center rows and center seats (optimal viewing)
   * - Avoids already booked or selected seats
   * - Handles aisles (null seats) in layout
   * - Provides clear feedback on selection
   */
  // Greedy Allocation Algorithm for Best Seat Selection
  const pickBestSeats = (requestedSeats = null) => {
    if (!selectedShow?.fullShow) return;

    // Get the number of seats to allocate
    let numSeatsToAllocate = requestedSeats;
    
    // If not provided, show modal to ask the user
    if (numSeatsToAllocate === null) {
      setShowSeatCountModal(true);
      return;
    }
    
    // Validate the number
    if (isNaN(numSeatsToAllocate) || numSeatsToAllocate < 1 || numSeatsToAllocate > 30) {
      toast.error("Please enter a valid number between 1 and 30");
      return;
    }

    const screenLayout = getScreenLayout();
    if (!screenLayout) {
      toast.error("Screen layout not available");
      return;
    }

    // Build a map of seat availability
    const seatMap = new Map();
    selectedShow.fullShow.availableSeats.forEach(seat => {
      if (seat) {
        seatMap.set(seat.seatNumber, seat);
      }
    });

    // Greedy Algorithm: Find contiguous available seats
    // Priority: Center rows first, then prefer center columns
    const bestSeats = [];
    
    // Calculate center row for prioritization
    const centerRowIndex = Math.floor(screenLayout.length / 2);
    
    // Create row priority order (center outward)
    const rowPriority = [];
    for (let offset = 0; offset < screenLayout.length; offset++) {
      const upperRow = centerRowIndex - offset;
      const lowerRow = centerRowIndex + offset;
      
      if (upperRow >= 0 && !rowPriority.includes(upperRow)) {
        rowPriority.push(upperRow);
      }
      if (lowerRow < screenLayout.length && !rowPriority.includes(lowerRow)) {
        rowPriority.push(lowerRow);
      }
    }

    // Try to find contiguous seats row by row
    for (const rowIndex of rowPriority) {
      const row = screenLayout[rowIndex];
      if (!row) continue;

      // Build array of valid seats in this row (non-null)
      const rowSeats = row
        .map((seatDef, colIndex) => ({ seatDef, colIndex }))
        .filter(({ seatDef }) => seatDef !== null);

      // Find contiguous blocks of available seats
      for (let startIdx = 0; startIdx <= rowSeats.length - numSeatsToAllocate; startIdx++) {
        const candidateSeats = [];
        let allAvailable = true;

        // Check if we can get numSeatsToAllocate contiguous seats starting here
        for (let i = 0; i < numSeatsToAllocate; i++) {
          const { seatDef, colIndex } = rowSeats[startIdx + i];
          const seat = seatMap.get(seatDef.seatNumber);
          
          if (!seat || seat.isBooked || selectedSeats.includes(seatDef.seatNumber)) {
            allAvailable = false;
            break;
          }
          
          candidateSeats.push({
            seatNumber: seatDef.seatNumber,
            colIndex: colIndex,
            isPremium: seatDef.type === 'Premium'
          });
        }

        // If we found a valid contiguous block
        if (allAvailable && candidateSeats.length === numSeatsToAllocate) {
          // Calculate how centered this block is (prefer center seats)
          const rowLength = row.filter(s => s !== null).length;
          const blockCenter = (candidateSeats[0].colIndex + candidateSeats[candidateSeats.length - 1].colIndex) / 2;
          const rowCenter = rowLength / 2;
          const centerDistance = Math.abs(blockCenter - rowCenter);
          
          bestSeats.push({
            seats: candidateSeats,
            rowIndex: rowIndex,
            centerDistance: centerDistance,
            rowPriority: rowPriority.indexOf(rowIndex),
            isPremium: candidateSeats.some(s => s.isPremium)
          });
        }
      }

      // If we found valid blocks in this row, we can stop (greedy approach)
      if (bestSeats.length > 0) {
        break;
      }
    }

    if (bestSeats.length === 0) {
      toast.error(`Could not find ${numSeatsToAllocate} contiguous available seats. Try selecting manually or reduce the number.`);
      return;
    }

    // Sort by: row priority first, then by center distance (prefer center seats)
    bestSeats.sort((a, b) => {
      if (a.rowPriority !== b.rowPriority) return a.rowPriority - b.rowPriority;
      return a.centerDistance - b.centerDistance;
    });

    // Select the best block
    const selectedBlock = bestSeats[0];
    const newSeats = selectedBlock.seats.map(s => s.seatNumber);

    setSelectedSeats(newSeats);
    
    const rowLetter = String.fromCharCode(65 + selectedBlock.rowIndex);
    const seatRange = `${newSeats[0]} to ${newSeats[newSeats.length - 1]}`;
    toast.success(`${numSeatsToAllocate} best seat(s) selected in Row ${rowLetter}: ${seatRange}`);
  };

  // Handle seat count modal submission
  const handleSeatCountSubmit = () => {
    const count = parseInt(seatCountInput, 10);
    if (isNaN(count) || count < 1 || count > 30) {
      toast.error("Please enter a valid number between 1 and 30");
      return;
    }
    setShowSeatCountModal(false);
    pickBestSeats(count);
  };

  const getScreenLayout = () => {
    if (!selectedShow?.fullShow?.screenId) return null;

    const theater = theaters.find(t =>
      t.screens.some(screen => getIdString(screen) === getIdString(selectedShow.fullShow.screenId))
    );

    if (!theater) return null;

    const screen = theater.screens.find(s => getIdString(s) === getIdString(selectedShow.fullShow.screenId));
    return screen?.seatLayout || null;
  };

  const calculateTotal = () => {
    if (selectedSeats.length === 0 || !selectedShow?.fullShow) return 0;

    const show = selectedShow.fullShow;

    const standardPrice = show.currentStandardPrice;
    const premiumPrice = show.currentPremiumPrice;

    const standardSelected = selectedSeats.filter(seatNum => {
      const def = getScreenLayout()?.flat().find(sd => sd && sd.seatNumber === seatNum);
      return def && def.type !== 'Premium';
    }).length;

    const premiumSelected = selectedSeats.length - standardSelected;

    return (standardSelected * standardPrice) + (premiumSelected * premiumPrice);
  };

  const totalAmount = calculateTotal();

const handleProceedToPayment = async () => {
  const secretKey = '8gBm/:&EnhH.1/q';  // Test secret key
  if (selectedSeats.length === 0) {
    toast.error("Please select at least one seat");
    return;
  }

  if (!paymentMethod) {
    toast.error("Please select a payment method");
    return;
  }

console.log("Booking Data:", {
    showId: selectedShow.showId
});
  const bookingData = {
    showId: selectedShow.showId,
    movieTitle: movie.title,
    cinemaName: selectedShow.cinema,
    showDate: selectedDate.date,
    showTime: selectedShow.time,
    seats: selectedSeats,
    amount: totalAmount,
  };

 if (paymentMethod === 'stripe') {
  let toastId = toast.loading("Redirecting to secure payment...");

  const token = localStorage.getItem('token');
  if (!token) {
    toast.update(toastId, { render: "Please log in first", type: "error", isLoading: false });
    navigate('/login');
    return;
  }

  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:5000'}/stripe/create-checkout-session`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      toast.update(toastId, {
        render: data.message || "Failed to start payment",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
      return;
    }

    // Save paymentId for success page
    localStorage.setItem('currentStripePaymentId', data.paymentId);

    // REDIRECT TO STRIPE CHECKOUT PAGE
    window.location.href = data.url;

  } catch (err) {
    console.error(err);
    toast.update(toastId, {
      render: "Network error",
      type: "error",
      isLoading: false,
      autoClose: 5000,
    });
  }
}

  // eSewa payment flow
 else if (paymentMethod === 'esewa') {
  if (selectedSeats.length === 0) {
    toast.error("Please select at least one seat");
    return;
  }

  const isTestMode = import.meta.env.VITE_ESEWA_TEST_MODE === 'true';
  const merchantId = import.meta.env.VITE_ESEWA_MERCHANT_ID;

  if (!merchantId) {
    toast.error("eSewa configuration missing");
    return;
  }

  const toastId = toast.loading("Initializing eSewa payment...");

  try {
    // Step 1: Create pending payment record in backend
    const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/esewa/initialize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      credentials: 'include',
      body: JSON.stringify({
        showId: selectedShow.showId,
        movieTitle: movie.title,
        cinemaName: selectedShow.cinema,
        showDate: selectedDate.date,
        showTime: selectedShow.time,
        seats: selectedSeats,
        amount: totalAmount
      })
    });

    const data = await response.json();

    if (!data.success) {
      toast.update(toastId, {
        render: data.message || "Failed to initialize payment",
        type: "error",
        isLoading: false,
        autoClose: 5000
      });
      return;
    }

    // Step 2: Save transaction details for verification
    localStorage.setItem('pendingEsewaBooking', JSON.stringify({
      transactionUUID: data.transactionUUID,
      paymentId: data.paymentId,
      amount: data.amount,
      showId: selectedShow._id,
      seats: selectedSeats
    }));

    const successUrl = import.meta.env.VITE_ESEWA_SUCCESS_URL || 'http://localhost:5173/payment-success';
    const failureUrl = import.meta.env.VITE_ESEWA_FAILURE_URL || 'http://localhost:5173/payment-failed';

    // Step 3: Build eSewa GET parameters
    const params = new URLSearchParams({
      amt: data.amount,
      psc: 0,
      pdc: 0,
      txAmt: 0,
      tAmt: data.amount,
      pid: data.transactionUUID,
      scd: merchantId,
      su: successUrl,
      fu: failureUrl
    });

    const esewaUrl = isTestMode
      ? `https://rc-epay.esewa.com.np/epay/main?${params.toString()}`
      : `https://esewa.com.np/epay/main?${params.toString()}`;

    // Add test mode - redirect directly to success for testing
    if (isTestMode && import.meta.env.VITE_ESEWA_USE_MOCK === 'true') {
      // Mock eSewa response for testing
      const mockSuccessUrl = `${successUrl}?oid=${data.transactionUUID}&refId=mock-${Date.now()}&amt=${data.amount}`;
      toast.update(toastId, {
        render: "Mock eSewa payment (dev mode)",
        type: "info",
        isLoading: false,
        autoClose: 2000
      });
      setTimeout(() => {
        window.location.href = mockSuccessUrl;
      }, 1500);
      return;
    }

    toast.update(toastId, {
      render: "Redirecting to eSewa...",
      type: "success",
      isLoading: false,
      autoClose: 2000
    });
    
    window.location.href = esewaUrl;

  } catch (err) {
    console.error(err);
    toast.update(toastId, {
      render: "Network error. Please try again.",
      type: "error",
      isLoading: false,
      autoClose: 5000
    });
  }
}
};

  const getImageUrl = (filename) => {
    if (!filename) return 'https://picsum.photos/400/600?random=0';
    return `${import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:5000'}/posters/${filename}`;
  };

  // YouTube embed helper
  const getTrailerEmbedUrl = (url) => {
    if (!url) return '';
    let videoId = '';
    if (url.includes('youtu.be')) videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
    else if (url.includes('watch?v=')) videoId = url.split('v=')[1]?.split('&')[0] || '';
    else if (url.includes('embed/')) videoId = url.split('embed/')[1]?.split('?')[0] || '';
    return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
  };

  // Date formatter
  const formatReleaseDate = (d) => {
    if (!d) return null;
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return null;
    return dt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const posterUrl = getImageUrl(movie?.profilePoster);
  const bannerUrl = getImageUrl(movie?.bannerPoster || movie?.profilePoster);

  if (loading) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center text-2xl">Loading showtimes...</div>;
  if (error || !movie) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center text-2xl">{error || 'Movie not found'}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <Navbar />

      {/* Hero Banner */}
      <div className="relative h-96 md:h-screen max-h-96 lg:max-h-screen overflow-hidden">
        <img src={bannerUrl} alt={movie.title} className="w-full h-full object-cover brightness-75" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-left">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-2xl leading-tight">{movie.title}</h1>
          <div className="flex flex-wrap gap-4 text-lg md:text-2xl">
            <span className="bg-white/20 backdrop-blur px-6 py-2 rounded-full">{movie.language || 'English'}</span>
            <span className="bg-white/20 backdrop-blur px-6 py-2 rounded-full">{movie.genre || 'Drama'}</span>
          </div>
        </div>
        <button onClick={() => navigate(-1)} className="absolute top-8 left-8 bg-white/20 backdrop-blur hover:bg-white/30 px-6 py-3 rounded-full font-medium z-10 transition">
          ← Back
        </button>
      </div>

      {/* Poster + Info */}
      <div className="max-w-7xl mx-auto px-4 -mt-32 md:-mt-1 relative z-10 mb-16">
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-white">
                <img src={posterUrl} alt={movie.title} className="w-full h-auto object-cover" />
              </div>
              <div className="text-center mt-6">
                <p className="text-green-400 font-semibold text-lg">Now Showing</p>
                {movie?.releaseDate && (
                  <p className="text-sm text-gray-500 mt-1">
                    Release: {new Date(movie.releaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-10">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
              <h2 className="text-4xl font-bold mb-6 text-green-400">Synopsis</h2>
              <p className="text-lg leading-relaxed text-gray-100">
                {movie.description || movie.synopsis || 'No synopsis available.'}
              </p>
            </div>

            {/* Trailer */}
            {movie.trailerUrl && getTrailerEmbedUrl(movie.trailerUrl) && (
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold mb-4 text-green-400">Official Trailer</h3>
                <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
                  <iframe
                    src={getTrailerEmbedUrl(movie.trailerUrl)}
                    title={`Trailer - ${movie.title}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
              </div>
            )}

            {/* Director & Cast */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Director */}
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold mb-4 text-green-400">Director</h3>
                <div className="flex flex-wrap gap-3">
                  {movie.director && movie.director.length > 0 ? (
                    movie.director.map((dir, idx) => (
                      <span key={idx} className="bg-green-600/20 border border-green-500 px-4 py-2 rounded-full text-sm font-medium text-green-300">
                        {dir}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400">Unknown</span>
                  )}
                </div>
              </div>

              {/* Cast */}
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold mb-4 text-green-400">Cast</h3>
                <div className="flex flex-wrap gap-3">
                  {movie.cast && movie.cast.length > 0 ? (
                    movie.cast.map((actor, idx) => (
                      <span key={idx} className="bg-blue-600/20 border border-blue-500 px-4 py-2 rounded-full text-sm font-medium text-blue-300">
                        {actor}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400">Unknown</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Flow */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        {/* City Selector */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 shadow-2xl">
          <label className="text-sm opacity-75">Select City</label>
          <div className="flex flex-wrap gap-3 mt-3">
            {cities.map(city => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  selectedCity === city ? 'bg-green-600 text-white' : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                {city === 'all' ? 'All Cities' : city}
              </button>
            ))}
          </div>
        </div>

        {/* Theater Filter */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 shadow-2xl">
          <label className="text-sm opacity-75">Select Cinema/Theater</label>
          <div className="flex flex-wrap gap-3 mt-3">
            {theaterNames.map(theater => (
              <button
                key={theater}
                onClick={() => setSelectedTheater(theater)}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  selectedTheater === theater ? 'bg-green-600 text-white' : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                {theater === 'all' ? 'All Cinemas' : theater}
              </button>
            ))}
          </div>
        </div>

        {/* Date Carousel */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 shadow-2xl overflow-x-auto">
          <div className="flex gap-4 min-w-max">
            {dates.map((d, i) => {
              const dateHasShows = hasShowsOnDate(d.date);
              return (
                <button
                  key={i}
                  onClick={() => dateHasShows && setSelectedDate(d)}
                  disabled={!dateHasShows}
                  className={`px-6 py-4 rounded-xl text-center transition-all min-w-24 ${
                    !dateHasShows
                      ? 'bg-gray-700/50 text-gray-500 opacity-40 cursor-not-allowed'
                      : selectedDate?.date === d.date
                      ? 'bg-green-600 text-white shadow-lg scale-105'
                      : 'bg-white/20 hover:bg-white/30'
                  }`}
                >
                  <div className="text-xs opacity-75">{d.label.split(' ')[0]}</div>
                  <div className="font-bold">
                    {d.label.includes('Today') ? 'Today' : d.label.includes('Tomorrow') ? 'Tomorrow' : d.label.split(' ').slice(1).join(' ')}
                  </div>
                  {!dateHasShows && <div className="text-xs mt-1">No shows</div>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Language Filter */}
        <div className="flex flex-wrap gap-3 mb-6 justify-center">
          <button onClick={() => setSelectedLanguage("all")} className={`px-5 py-2 rounded-full ${selectedLanguage === "all" ? 'bg-green-600' : 'bg-white/20'} hover:bg-green-600 transition`}>All</button>
          {["Regular", "3D", "IMAX"].map(lang => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              className={`px-5 py-2 rounded-full ${selectedLanguage === lang ? 'bg-green-600' : 'bg-white/20'} hover:bg-green-600 transition`}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* Showtimes */}
        <div ref={showsSectionRef} className="space-y-8 mb-12">
          {cinemas.length === 0 ? (
            <div className="text-center py-20 text-xl opacity-70">No shows available for selected filters</div>
          ) : (
            cinemas.map(cinema => {
              const formats = groupedShows[cinema];
              return (
                <div key={cinema} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
                  <h3 className="text-2xl font-bold mb-4">{cinema}</h3>
                  <div className="space-y-6">
                    {Object.entries(formats).map(([lang, times]) => (
                      (selectedLanguage === "all" || selectedLanguage === lang) && (
                        <div key={lang}>
                          <span className="text-sm opacity-75 bg-white/20 px-4 py-1 rounded-full">{lang}</span>
                          <div className="flex flex-wrap gap-3 mt-3">
                            {times.map(({ showId, time, availableSeats, fullShow, cinema: showCinema }) => (
                              <button
                                key={showId}
                                onClick={() => {
                                  setSelectedShow({ showId, cinema: showCinema, time, language: lang, fullShow });
                                  setSelectedSeats([]);
                                  setPaymentMethod(null);
                                }}
                                className={`px-5 py-3 rounded-lg border-2 transition-all ${
                                  selectedShow?.showId === showId
                                    ? 'bg-green-600 border-green-600 text-white'
                                    : 'border-white/30 hover:border-green-400'
                                }`}
                              >
                                <div className="font-medium">{time}</div>
                                <div className={`text-xs mt-1 ${getAvailabilityColor(availableSeats)} text-white px-2 py-0.5 rounded`}>
                                  {getAvailabilityText(availableSeats)} • {availableSeats} left
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* All Available Shows by Date */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">All Available Shows</h2>
          <div className="grid gap-6">
            {Object.entries(allShowsByDate).length === 0 ? (
              <div className="text-center py-10 text-xl opacity-70">No shows available</div>
            ) : (
              Object.entries(allShowsByDate)
                .sort((a, b) => a[0].localeCompare(b[0]))
                .map(([dateStr, { label, shows: dateShows }]) => (
                  <div key={dateStr} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
                    <h3 className="text-xl font-bold mb-4 text-green-400">{label} ({dateStr})</h3>
                    <div className="space-y-4">
                      {dateShows.map(showItem => (
                        <div key={showItem.showId} className="bg-white/5 rounded-lg p-4 border border-white/20">
                          <div className="flex items-center justify-between gap-4 flex-wrap">
                            <div className="flex-1 min-w-[200px]">
                              <div className="text-lg font-bold mb-1">{showItem.theater}</div>
                              <div className="text-sm opacity-75">
                                <span className="bg-white/20 px-3 py-1 rounded-full mr-2">{showItem.language}</span>
                                <span className="font-semibold">{showItem.time}</span>
                              </div>
                            </div>
                            <div className={`${getAvailabilityColor(showItem.availableSeats)} text-white px-4 py-2 rounded-lg font-semibold`}>
                              {getAvailabilityText(showItem.availableSeats)}<br/>{showItem.availableSeats} seats
                            </div>
                            <button
                              onClick={() => {
                                setSelectedDate(dates.find(d => d.date === dateStr));
                                setSelectedShow({ 
                                  showId: showItem.showId, 
                                  cinema: showItem.cinema, 
                                  time: showItem.time, 
                                  language: showItem.language, 
                                  fullShow: showItem.fullShow 
                                });
                                setSelectedSeats([]);
                                setPaymentMethod(null);
                              }}
                              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-all"
                            >
                              Book Now
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Seat Selection Section - Inline Below */}
        {selectedShow && selectedShow.fullShow && (
          <div ref={seatSectionRef} className="bg-gray-900/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/10">
            <h2 className="text-3xl font-bold mb-8 text-center text-green-400">
              Select Seats • {selectedShow.time} • {selectedShow.cinema}
            </h2>

            {/* Cinematic Screen */}
            <div className="my-10 relative">
              <div className="mx-auto w-full max-w-4xl h-16 bg-gradient-to-b from-gray-500 via-gray-300 to-gray-600 rounded-t-3xl shadow-2xl border-t-6 border-gray-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                <div className="absolute inset-x-0 top-4 text-center">
                  <span className="text-xl font-bold text-white drop-shadow-2xl tracking-widest">
                    SCREEN THIS WAY ↑
                  </span>
                </div>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-gray-900 rounded-b-full shadow-inner"></div>
              </div>
            </div>

            {/* Seat Layout - Clean & Simple */}
            <div className="w-full overflow-x-auto">
              {getScreenLayout() ? (
                <div className="space-y-5 pb-6">
                  {getScreenLayout().map((row, rowIndex) => (
                    <div key={rowIndex} className="flex justify-center gap-4 items-center">
                      {/* Left Row Label */}
                      <div className="w-12 text-right text-gray-300 font-bold text-lg">
                        {String.fromCharCode(65 + rowIndex)}
                      </div>

                      <div className="flex gap-3">
                        {row.map((seatDef, colIndex) => {
                          if (seatDef === null) {
                            return <div key={`aisle-${rowIndex}-${colIndex}`} className="w-12 h-14" />;
                          }

                          const showSeat = selectedShow.fullShow.availableSeats.find(
                            s => s && s.seatNumber === seatDef.seatNumber
                          );

                          const isBooked = showSeat?.isBooked || false;
                          const isSelected = selectedSeats.includes(seatDef.seatNumber);
                          const isPremium = seatDef.type === 'Premium';

                          // Extract number part for display inside seat
                          const seatNumberDisplay = seatDef.seatNumber.replace(/^[A-Za-z]+/, '');

                          return (
                            <button
                              key={seatDef.seatNumber}
                              disabled={isBooked}
                              onClick={() => {
                                if (isSelected) {
                                  setSelectedSeats(prev => prev.filter(s => s !== seatDef.seatNumber));
                                } else {
                                  setSelectedSeats(prev => [...prev, seatDef.seatNumber]);
                                }
                              }}
                              className={`
                                relative w-12 h-14 rounded-t-lg transition-all duration-200
                                flex items-end justify-center pb-1 text-sm font-bold text-white
                                ${isBooked
                                  ? 'bg-gray-800 cursor-not-allowed'
                                  : isSelected
                                  ? 'bg-green-500 shadow-lg scale-110'
                                  : isPremium
                                  ? 'bg-gradient-to-b from-purple-700 to-purple-900 shadow-md hover:shadow-lg hover:scale-105'
                                  : 'bg-gradient-to-b from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 hover:scale-105'
                                }
                              `}
                              title={seatDef.seatNumber}
                            >
                              <span className="drop-shadow-md">{seatNumberDisplay || '?'}</span>

                              <div className="absolute inset-x-0 top-0 h-4 bg-black/30 rounded-t-lg"></div>

                              {isSelected && (
                                <div className="absolute -top-2 -right-2 bg-green-600 rounded-full w-6 h-6 flex items-center justify-center">
                                  <svg className="w-4 h-4" fill="white" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg>
                                </div>
                              )}

                              {isBooked && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <svg className="w-8 h-8 text-red-500 opacity-80" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M4 4l12 12m0-12L4 16"/>
                                  </svg>
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Right Row Label */}
                      <div className="w-12 text-left text-gray-300 font-bold text-lg">
                        {String.fromCharCode(65 + rowIndex)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-400 py-10">Seat layout not available</p>
              )}
            </div>

            {/* Seat Legend */}
            <div className="flex flex-wrap justify-center gap-10 my-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-14 bg-gradient-to-b from-gray-600 to-gray-700 rounded-t-lg"></div>
                <span>Standard</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-14 bg-gradient-to-b from-purple-700 to-purple-900 rounded-t-lg"></div>
                <span>Premium</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-14 bg-green-500 rounded-t-lg"></div>
                <span>Selected</span>
              </div>
              <div className="flex items-center gap-4 relative">
                <div className="w-12 h-14 bg-gray-800 rounded-t-lg"></div>
                <svg className="absolute w-8 h-8 text-red-500 opacity-80" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4l12 12m0-12L4 16"/>
                </svg>
                <span className="ml-2">Booked</span>
              </div>
            </div>

            {/* Pick Best Seats */}
            <div className="flex justify-center my-6">
              <button 
                onClick={() => pickBestSeats()} 
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition transform hover:scale-105"
              >
                Pick Best Seats For Me
              </button>
            </div>

            {/* Selected Seats Summary + Price Breakdown */}
            {selectedSeats.length > 0 && (
              <div className="bg-white/10 rounded-xl p-6 mb-8 border border-white/20">
                <h3 className="text-xl font-bold mb-4 text-green-400">Your Selected Seats</h3>
                <div className="flex flex-wrap gap-3 mb-6">
                  {selectedSeats.sort().map(seat => (
                    <span key={seat} className="bg-green-600 px-5 py-3 rounded-xl font-bold text-lg shadow">
                      {seat}
                    </span>
                  ))}
                </div>

                {(() => {
                  const show = selectedShow.fullShow;
                  const standardPrice = show.currentStandardPrice;
                  const premiumPrice = show.currentPremiumPrice;

                  const standardSelected = selectedSeats.filter(seatNum => {
                    const def = getScreenLayout()?.flat().find(sd => sd && sd.seatNumber === seatNum);
                    return def && def.type !== 'Premium';
                  }).length;

                  const premiumSelected = selectedSeats.length - standardSelected;

                  return (
                    <div className="space-y-3 text-lg">
                      {standardSelected > 0 && (
                        <div className="flex justify-between">
                          <span>Standard ({standardSelected} × रु. {standardPrice})</span>
                          <span>रु. {standardSelected * standardPrice}</span>
                        </div>
                      )}
                      {premiumSelected > 0 && (
                        <div className="flex justify-between">
                          <span>Premium ({premiumSelected} × रु. {premiumPrice})</span>
                          <span>रु. {premiumSelected * premiumPrice}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-2xl pt-4 border-t border-white/30">
                        <span>Total</span>
                        <span>रु. {totalAmount}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Payment Method */}
            {selectedSeats.length > 0 && (
              <div className="bg-white/10 rounded-xl p-6 border border-white/20 mb-8">
                <h3 className="text-xl font-bold mb-6 text-center">Choose Payment Method</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button
                    onClick={() => setPaymentMethod('stripe')}
                    className={`p-8 rounded-2xl border-4 transition-all flex flex-col items-center ${
                      paymentMethod === 'stripe'
                        ? 'bg-blue-600/30 border-blue-500 shadow-xl scale-105'
                        : 'border-white/30 hover:border-blue-400 bg-white/5'
                    }`}
                  >
                    <div className="text-4xl font-bold mb-3">Stripe</div>
                    <p className="text-sm opacity-80 text-center">Credit/Debit Card<br />(International)</p>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('esewa')}
                    className={`p-8 rounded-2xl border-4 transition-all flex flex-col items-center ${
                      paymentMethod === 'esewa'
                        ? 'bg-green-600/30 border-green-500 shadow-xl scale-105'
                        : 'border-white/30 hover:border-green-400 bg-white/5'
                    }`}
                  >
                    <div className="text-4xl font-bold mb-3 text-green-400">eSewa</div>
                    <p className="text-sm opacity-80 text-center">eSewa Wallet<br />(Nepal)</p>
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-10">
              <button
                onClick={() => {
                  setSelectedShow(null);
                  setSelectedSeats([]);
                  setPaymentMethod(null);
                }}
                className="text-red-400 underline hover:text-red-300 text-lg"
              >
                ← Change Showtime
              </button>
              <button
                onClick={handleProceedToPayment}
                disabled={selectedSeats.length === 0 || !paymentMethod}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed px-12 py-5 rounded-full font-bold text-xl shadow-lg disabled:shadow-none transition-all"
              >
                Pay रु. {totalAmount} →
              </button>
            </div>
          </div>
        )}

      </div>

      <Footer />

      {/* Custom Seat Count Modal */}
      {showSeatCountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 max-w-md w-full mx-4 border-2 border-green-500/50 shadow-2xl transform animate-scaleIn">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">🎯</div>
              <h2 className="text-3xl font-bold text-green-400 mb-2">
                Smart Seat Selection
              </h2>
              <p className="text-gray-300 text-sm">
                How many seats do you want to book?
              </p>
            </div>

            <div className="mb-6">
              <input
                type="number"
                min="1"
                max="30"
                value={seatCountInput}
                onChange={(e) => setSeatCountInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSeatCountSubmit();
                  if (e.key === 'Escape') setShowSeatCountModal(false);
                }}
                autoFocus
                className="w-full px-6 py-4 text-2xl text-center bg-gray-800/50 border-2 border-green-500/30 rounded-xl text-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/50 transition"
                placeholder="Enter number (1-30)"
              />
              <p className="text-xs text-gray-400 mt-2 text-center">
                We'll find the best contiguous seats near the center
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowSeatCountModal(false);
                  setSeatCountInput("2");
                }}
                className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSeatCountSubmit}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Find Seats
              </button>
            </div>

            <div className="mt-4 text-center text-xs text-gray-500">
              Press <kbd className="px-2 py-1 bg-gray-700 rounded">Enter</kbd> to confirm or <kbd className="px-2 py-1 bg-gray-700 rounded">Esc</kbd> to cancel
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NowShowing;