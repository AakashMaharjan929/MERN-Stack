// src/pages/NowShowing.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getMovieById } from '../api/movieAPI';
import { getAllShows } from '../api/showAPI';
import { getAllTheaters } from '../api/theaterAPI';

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
  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);

  // NEW: Payment method state
  const [paymentMethod, setPaymentMethod] = useState(null); // 'stripe' | 'esewa' | null

  // Helper: Extract string ID from various MongoDB formats
  const getIdString = (id) => {
    if (!id) return null;
    if (typeof id === 'string') return id;
    if (id.$oid) return id.$oid;
    if (id._id) return id._id.toString();
    return id.toString();
  };

  // Generate 10 days including Today/Tomorrow
  const getDates = () => {
    const dates = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const today = new Date();
    for (let i = 0; i < 10; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const label = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
      dates.push({
        date: date.toISOString().split('T')[0],
        label,
        fullDate: date
      });
    }
    return dates;
  };

  const dates = getDates();

useEffect(() => {

    setSelectedDate(dates[0]); // Today
  
}, []);
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

  // Filter shows
const filteredShows = shows.filter(show => {
  if (!['Upcoming'].includes(show.status)) return false;

  const showDateStr = new Date(show.startTime).toISOString().split('T')[0];
  if (!selectedDate) return false;

  if (showDateStr !== selectedDate.date) return false;

  const theater = theaters.find(t =>
    t.screens.some(screen => getIdString(screen) === getIdString(show.screenId))
  );
  if (!theater) return false;

  const showCity = theater.location?.city || 'Unknown';
  if (selectedCity !== "all" && showCity !== selectedCity) return false;

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
    }).toUpperCase(); // e.g., 12:00 PM

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
      fullShow: show
    });
  });

  const cinemas = Object.keys(groupedShows);

  const getAvailabilityColor = (seats) => seats <= 5 ? 'bg-red-600' : seats <= 20 ? 'bg-orange-500' : 'bg-green-600';
  const getAvailabilityText = (seats) => seats <= 5 ? 'Filling Fast' : seats <= 20 ? 'Limited' : 'Available';

  const pickBestSeats = () => {
    if (!selectedShow?.fullShow) return;

    const validSeats = selectedShow.fullShow.availableSeats.filter(s => s !== null);
    const available = validSeats.filter(s => !s.isBooked);

    // Prefer Premium seats first
    const premium = available.filter(s => s.seatType === 'Premium');
    const standard = available.filter(s => s.seatType === 'Standard');

    const best = [...premium.slice(0, 4), ...standard].slice(0, 8 - selectedSeats.length);

    setSelectedSeats(prev => [
      ...prev,
      ...best.map(s => s.seatNumber)
    ].slice(0, 8));

    toast.success("Best available seats picked!");
  };

   // Get actual seatLayout from the screen
  const getScreenLayout = () => {
    if (!selectedShow?.fullShow?.screenId) return null;

    const theater = theaters.find(t =>
      t.screens.some(screen => getIdString(screen) === getIdString(selectedShow.fullShow.screenId))
    );

    if (!theater) return null;

    const screen = theater.screens.find(s => getIdString(s) === getIdString(selectedShow.fullShow.screenId));
    return screen?.seatLayout || null;
  };

  // Calculate total amount dynamically
  const calculateTotal = () => {
    if (selectedSeats.length === 0 || !selectedShow?.fullShow?.pricingRules) return 0;

    const rules = selectedShow.fullShow.pricingRules;
    const totalSeats = selectedShow.fullShow.totalSeatCount || 154;
    const bookedCount = selectedShow.fullShow.availableSeats.filter(s => s && s.isBooked).length;
    const bookedRatio = bookedCount / totalSeats;

    const multiplier = 1 + rules.alpha + (rules.beta * bookedRatio);

    const standardPrice = Math.round(rules.standardBasePrice * multiplier);
    const premiumPrice = Math.round(rules.premiumBasePrice * multiplier);

    const standardSelected = selectedSeats.filter(seatNum => {
      const def = getScreenLayout()?.flat().find(sd => sd && sd.seatNumber === seatNum);
      return def && def.type !== 'Premium';
    }).length;

    const premiumSelected = selectedSeats.length - standardSelected;

    return (standardSelected * standardPrice) + (premiumSelected * premiumPrice);
  };

  const totalAmount = calculateTotal();

  // Handle payment gateway redirection
  const handleProceedToPayment = () => {
    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat");
      return;
    }

    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    const bookingData = {
      movie: movie.title,
      cinema: selectedShow.cinema,
      date: selectedDate.label,
      time: selectedShow.time,
      seats: selectedSeats.join(', '),
      total: totalAmount,
      showId: selectedShow.showId,
      selectedSeatsNumbers: selectedSeats,
      language: selectedShow.language
    };

    if (paymentMethod === 'stripe') {
      // Save pending booking and redirect to Stripe checkout page
      localStorage.setItem('pendingBooking', JSON.stringify(bookingData));
      navigate('/payment/stripe');
    } else if (paymentMethod === 'esewa') {
      // Generate unique IDs for eSewa
      const transactionUUID = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const pid = `BOOK-${selectedShow.showId}-${transactionUUID}`;

      // Save for later verification
      localStorage.setItem('pendingBooking', JSON.stringify({
        ...bookingData,
        pid,
        transactionUUID,
        paymentMethod: 'esewa'
      }));

      // Create and submit eSewa form
      const form = document.createElement('form');
      form.method = 'POST';
      // Use UAT for testing; change to https://epay.esewa.com.np/epay/main for production
      form.action = 'https://uat.esewa.com.np/epay/main';

      const params = {
        amt: totalAmount,
        psc: 0,
        pdc: 0,
        txAmt: 0,
        tAmt: totalAmount,
        pid: pid,
        scd: 'EPAYTEST', // Replace with your actual merchant code in production
        su: `${window.location.origin}/payment/esewa-success`,
        fu: `${window.location.origin}/payment/esewa-failure`
      };

      Object.keys(params).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = params[key];
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    }
  };

  // Image URL helper
  const getImageUrl = (filename) => {
    if (!filename) return 'https://picsum.photos/400/600?random=0';
    return `${import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:5000'}/posters/${filename}`;
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

        {/* Date Carousel */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 shadow-2xl overflow-x-auto">
          <div className="flex gap-4 min-w-max">
            {dates.map((d, i) => (
              <button
                key={i}
                onClick={() => setSelectedDate(d)}
                className={`px-6 py-4 rounded-xl text-center transition-all min-w-24 ${
                  selectedDate?.date === d.date ? 'bg-green-600 text-white shadow-lg scale-105' : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                <div className="text-xs opacity-75">{d.label.split(' ')[0]}</div>
                <div className="font-bold">
                  {d.label.includes('Today') ? 'Today' : d.label.includes('Tomorrow') ? 'Tomorrow' : d.label.split(' ').slice(1).join(' ')}
                </div>
              </button>
            ))}
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
        <div className="space-y-8 mb-12">
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
                            {times.map(({ showId, time, availableSeats, fullShow }) => (
                              <button
                                key={showId}
                                onClick={() => setSelectedShow({ showId, cinema, time, language: lang, fullShow })}
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

        {/* Seat Selection Modal */}
        {selectedShow && selectedShow.fullShow && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-2xl max-w-5xl w-full p-8 shadow-2xl overflow-y-auto max-h-screen">
              <h2 className="text-2xl font-bold mb-4">
                Select Seats • {selectedShow.time} • {selectedShow.cinema}
              </h2>
              <div className="text-center mb-6">
                <div className="inline-block bg-gray-800 rounded-t-2xl px-20 py-4 text-lg font-bold">SCREEN</div>
              </div>

              {/* Dynamic Seat Layout */}
              <div className="w-full overflow-x-auto">
                {getScreenLayout() ? (
                  <div className="space-y-3">
                    {getScreenLayout().map((row, rowIndex) => (
                      <div key={rowIndex} className="flex justify-center gap-3">
                        {row.map((seatDef, colIndex) => {
                          if (seatDef === null) {
                            return <div key={`aisle-${rowIndex}-${colIndex}`} className="w-20 h-10" />;
                          }

                          const showSeat = selectedShow.fullShow.availableSeats.find(
                            s => s && s.seatNumber === seatDef.seatNumber
                          );

                          const isBooked = showSeat?.isBooked || false;
                          const isSelected = selectedSeats.includes(seatDef.seatNumber);
                          const isPremium = seatDef.type === 'Premium';

                          return (
                            <button
                              key={seatDef.seatNumber}
                              disabled={isBooked}
                              onClick={() => {
                                if (isSelected) {
                                  setSelectedSeats(prev => prev.filter(s => s !== seatDef.seatNumber));
                                } else if (selectedSeats.length < 8) {
                                  setSelectedSeats(prev => [...prev, seatDef.seatNumber]);
                                } else {
                                  toast.warn("Maximum 8 seats allowed");
                                }
                              }}
                              className={`w-10 h-10 rounded text-xs font-bold transition-all flex items-center justify-center ${
                                isBooked
                                  ? 'bg-gray-700 cursor-not-allowed text-gray-500'
                                  : isSelected
                                  ? 'bg-green-600 text-white'
                                  : isPremium
                                  ? 'bg-purple-600 hover:bg-purple-500 text-white'
                                  : 'bg-gray-600 hover:bg-gray-500 text-white'
                              }`}
                            >
                              {seatDef.seatNumber}
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-400">Seat layout not available</p>
                )}
              </div>

              <div className="flex justify-center gap-4 mb-6 mt-8">
                <button onClick={pickBestSeats} className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3 rounded-full font-bold">
                  Pick Best Seats For Me
                </button>
              </div>

              {/* Dynamic Price Breakdown */}
              {selectedSeats.length > 0 && selectedShow.fullShow.pricingRules && (
                (() => {
                  const rules = selectedShow.fullShow.pricingRules;
                  const totalSeats = selectedShow.fullShow.totalSeatCount || 154;
                  const bookedCount = selectedShow.fullShow.availableSeats.filter(s => s && s.isBooked).length;
                  const bookedRatio = bookedCount / totalSeats;

                  const multiplier = 1 + rules.alpha + (rules.beta * bookedRatio);

                  const standardPrice = Math.round(rules.standardBasePrice * multiplier);
                  const premiumPrice = Math.round(rules.premiumBasePrice * multiplier);

                  const standardSelected = selectedSeats.filter(seatNum => {
                    const def = getScreenLayout()?.flat().find(sd => sd && sd.seatNumber === seatNum);
                    return def && def.type !== 'Premium';
                  }).length;

                  const premiumSelected = selectedSeats.length - standardSelected;

                  const total = (standardSelected * standardPrice) + (premiumSelected * premiumPrice);

                  return (
                    <div className="bg-white/10 rounded-xl p-6 mb-6 text-lg border border-white/20">
                      <div className="space-y-3">
                        {standardSelected > 0 && (
                          <div className="flex justify-between">
                            <span>Standard Seats ({standardSelected}) × NPR {standardPrice}</span>
                            <span>NPR {standardSelected * standardPrice}</span>
                          </div>
                        )}
                        {premiumSelected > 0 && (
                          <div className="flex justify-between">
                            <span>Premium Seats ({premiumSelected}) × NPR {premiumPrice}</span>
                            <span>NPR {premiumSelected * premiumPrice}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-bold text-xl mt-4 pt-4 border-t border-white/30">
                          <span>Total Amount</span>
                          <span>NPR {total}</span>
                        </div>
                        {bookedRatio > 0.5 && (
                          <p className="text-orange-400 text-sm text-center mt-3">
                            ⚡ High demand! Prices increased by {Math.round((multiplier - 1) * 100)}%
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })()
              )}

              {/* Payment Method Selection */}
              {selectedSeats.length > 0 && (
                <div className="mt-8 bg-white/10 rounded-xl p-6 border border-white/20">
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
                      <p className="text-sm opacity-80 text-center">Pay securely with Credit/Debit Card<br />(Visa, MasterCard, International)</p>
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
                      <p className="text-sm opacity-80 text-center">Pay instantly with eSewa Wallet<br />(Popular in Nepal)</p>
                    </button>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center mt-10">
                <button
                  onClick={() => {
                    setSelectedShow(null);
                    setSelectedSeats([]);
                    setPaymentMethod(null);
                  }}
                  className="text-red-400 underline hover:text-red-300"
                >
                  Cancel Selection
                </button>
                <button
                  onClick={handleProceedToPayment}
                  disabled={selectedSeats.length === 0 || !paymentMethod}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed px-12 py-5 rounded-full font-bold text-xl shadow-lg disabled:shadow-none transition-all"
                >
                  Pay NPR {totalAmount} →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default NowShowing;