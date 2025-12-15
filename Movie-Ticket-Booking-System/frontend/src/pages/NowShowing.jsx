// pages/NowShowing.jsx
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
    const showDate = new Date(show.startTime).toISOString().split('T')[0];
    const theater = theaters.find(t =>
      t.screens.some(screen => getIdString(screen) === getIdString(show.screenId))
    );
    const showCity = theater?.location.city;

    const matchesCity = selectedCity === "all" || showCity === selectedCity;
    const matchesDate = selectedDate && showDate === selectedDate.date;
    const matchesLang = selectedLanguage === "all" || show.showType === selectedLanguage;

    return matchesCity && matchesDate && matchesLang;
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

  const proceedToPayment = () => {
    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat");
      return;
    }

    const total = selectedSeats.length * 450;

    localStorage.setItem('latestBooking', JSON.stringify({
      movie: movie.title,
      cinema: selectedShow.cinema,
      date: selectedDate.label,
      time: selectedShow.time,
      seats: selectedSeats.join(', '),
      total
    }));

    toast.success(`Proceeding to payment: NPR ${total}`);
    navigate('/payment');
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
            <div className="bg-gray-900 rounded-2xl max-w-4xl w-full p-8 shadow-2xl overflow-y-auto max-h-screen">
              <h2 className="text-2xl font-bold mb-4">
                Select Seats • {selectedShow.time} • {selectedShow.cinema}
              </h2>
              <div className="text-center mb-6">
                <div className="inline-block bg-gray-800 rounded-t-2xl px-20 py-4 text-lg font-bold">SCREEN</div>
              </div>

              <div className="grid grid-cols-14 gap-2 max-w-4xl mx-auto mb-8">
                {selectedShow.fullShow.availableSeats.map((seat, index) => {
                  if (!seat) return <div key={index} className="w-10 h-10" />; // Aisle gap

                  const isSelected = selectedSeats.includes(seat.seatNumber);
                  const isBooked = seat.isBooked;
                  const isPremium = seat.seatType === 'Premium';

                  return (
                    <button
                      key={seat.seatNumber}
                      disabled={isBooked}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedSeats(prev => prev.filter(s => s !== seat.seatNumber));
                        } else if (selectedSeats.length < 8) {
                          setSelectedSeats(prev => [...prev, seat.seatNumber]);
                        } else {
                          toast.warn("Maximum 8 seats allowed");
                        }
                      }}
                      className={`w-10 h-10 rounded text-xs font-bold transition-all ${
                        isBooked
                          ? 'bg-gray-700 cursor-not-allowed text-gray-500'
                          : isSelected
                          ? 'bg-green-600 text-white'
                          : isPremium
                          ? 'bg-purple-600 hover:bg-purple-500 text-white'
                          : 'bg-gray-600 hover:bg-gray-500 text-white'
                      }`}
                    >
                      {seat.seatNumber}
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-center gap-4 mb-6">
                <button onClick={pickBestSeats} className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3 rounded-full font-bold">
                  Pick Best Seats For Me
                </button>
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={() => {
                    setSelectedShow(null);
                    setSelectedSeats([]);
                  }}
                  className="text-red-400 underline"
                >
                  Cancel
                </button>
                <button
                  onClick={proceedToPayment}
                  disabled={selectedSeats.length === 0}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-10 py-4 rounded-full font-bold text-lg"
                >
                  Pay NPR {selectedSeats.length * 450} →
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