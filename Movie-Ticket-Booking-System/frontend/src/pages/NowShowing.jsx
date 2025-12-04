import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// UPDATED: Now with separate poster & banner
const NOW_SHOWING_MOVIES = [
  { 
    id: 1, 
    title: "जारि२", 
    language: "Nepali", 
    genre: "Thriller", 
    poster: "https://picsum.photos/400/600?random=1",   // ← Vertical Poster
    banner: "https://picsum.photos/1600/900?random=1",  // ← Wide Banner
    synopsis: "The thrilling sequel to the blockbuster Jaari returns with higher stakes, deeper emotions, and intense action in the hills of Nepal.",
    cast: [
      { name: "Dayahang Rai", role: "Lead Actor" },
      { name: "Miruna Magar", role: "Lead Actress" },
      { name: "Bipin Karki", role: "Supporting" }
    ],
    director: "Upendra Subba"
  },
  { 
    id: 2, 
    title: "Wicked 2: For Good", 
    language: "English", 
    genre: "Fantasy Musical", 
    poster: "https://picsum.photos/400/600?random=2",
    banner: "https://picsum.photos/1600/900?random=2",
    synopsis: "Elphaba and Glinda's story continues in this breathtaking musical spectacle about friendship, destiny, and defying gravity.",
    cast: [
      { name: "Cynthia Erivo", role: "Elphaba" },
      { name: "Ariana Grande", role: "Glinda" },
      { name: "Jonathan Bailey", role: "Fiyero" }
    ],
    director: "Jon M. Chu"
  },
  { 
    id: 3, 
    title: "माया", 
    language: "Nepali", 
    genre: "Romance", 
    poster: "https://picsum.photos/400/600?random=5",
    banner: "https://picsum.photos/1600/900?random=5",
    synopsis: "A heartfelt journey of love, loss, and second chances set against the breathtaking Himalayan backdrop.",
    cast: [
      { name: "Anmol K.C.", role: "Lead Actor" },
      { name: "Aditi Budhathoki", role: "Lead Actress" }
    ],
    director: "Ramesh K.C."
  },
  { 
    id: 4, 
    title: "Deadpool & Wolverine", 
    language: "English", 
    genre: "Action Comedy", 
    poster: "https://picsum.photos/400/600?random=6",
    banner: "https://picsum.photos/1600/900?random=6",
    synopsis: "The Merc with a Mouth teams up with the clawed mutant in the most chaotic, fourth-wall-breaking adventure yet.",
    cast: [
      { name: "Ryan Reynolds", role: "Deadpool" },
      { name: "Hugh Jackman", role: "Wolverine" },
      { name: "Emma Corrin", role: "Villain" }
    ],
    director: "Shawn Levy"
  },
  { 
    id: 5, 
    title: "काला", 
    language: "Nepali", 
    genre: "Action", 
    poster: "https://picsum.photos/400/600?random=7",
    banner: "https://picsum.photos/1600/900?random=7",
    synopsis: "A tale of revenge, redemption, and raw power in the gritty underbelly of rural Nepal.",
    cast: [
      { name: "Nischal Basnet", role: "Lead Actor" },
      { name: "Saubin Shah", role: "Supporting" }
    ],
    director: "Nischal Basnet"
  }
];

// ... rest of your MOCK_SHOWTIMES, CITIES, LANGUAGES, getDates() remain unchanged
const MOCK_SHOWTIMES = {
  "Kathmandu": {
    "जारि२": {
      "Kathmandu Cineplex": { "Nepali": ["10:00 AM", "1:15 PM", "4:30 PM", "7:45 PM"], seatsLeft: [120, 45, 12, 8] },
      "Big Cinema": { "Nepali": ["11:30 AM", "2:45 PM", "6:00 PM"], seatsLeft: [90, 30, 5] },
      "QFX Kumari": { "Nepali": ["9:45 AM", "3:00 PM", "8:15 PM"], seatsLeft: [110, 60, 15] }
    },
    "Wicked 2: For Good": {
      "Kathmandu Cineplex": { "English": ["12:00 PM", "3:30 PM", "9:00 PM"], "English 3D": ["6:00 PM"], seatsLeft: [80, 40, 20, 3] },
      "Big Cinema": { "English": ["1:00 PM", "5:30 PM"], seatsLeft: [70, 25] }
    }
  }
};

const CITIES = ["Kathmandu", "Pokhara", "Lalitpur", "Biratnagar", "Chitwan"];
const LANGUAGES = ["Nepali", "English", "Hindi", "English 3D", "IMAX"];

const getDates = () => {
  const dates = [];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const today = new Date();
  for (let i = 0; i < 10; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const label = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
    dates.push({ date: date.toISOString().split('T')[0], label });
  }
  return dates;
};

const NowShowing = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const movieId = searchParams.get('movieId');
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedCity, setSelectedCity] = useState("Kathmandu");
  const [selectedDate, setSelectedDate] = useState(getDates()[0]);
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const dates = getDates();

  useEffect(() => {
    const found = NOW_SHOWING_MOVIES.find(m => m.id === parseInt(movieId));
    if (found) setMovie(found);
    else navigate('/');
    setLoading(false);
  }, [movieId, navigate]);

  if (loading || !movie) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center text-2xl">Loading...</div>;

  const showtimes = MOCK_SHOWTIMES[selectedCity]?.[movie.title] || {};
  const cinemas = Object.keys(showtimes);

  const getAvailabilityColor = (seats) => seats <= 5 ? 'bg-red-600' : seats <= 20 ? 'bg-orange-500' : 'bg-green-600';
  const getAvailabilityText = (seats) => seats <= 5 ? 'Filling Fast' : seats <= 20 ? 'Limited' : 'Available';

  const pickBestSeats = () => {
    const best = ['D5', 'D6', 'E5', 'E6'].slice(0, 8 - selectedSeats.length);
    setSelectedSeats(prev => [...prev, ...best.filter(s => !prev.includes(s))]);
    toast.success("Best seats selected for you!");
  };

  const proceedToPayment = () => {
    if (selectedSeats.length === 0) return toast.error("Please select at least one seat");
    const total = selectedSeats.length * 450;
    localStorage.setItem('latestBooking', JSON.stringify({
      movie: movie.title, cinema: selectedShow.cinema, date: selectedDate.label,
      time: selectedShow.time, seats: selectedSeats.join(', '), total
    }));
    toast.success(`Booking Confirmed! NPR ${total}`);
    navigate('/my-tickets');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <Navbar />

  {/* Cinematic Hero Banner */}
<div className="relative h-96 md:h-screen max-h-96 lg:max-h-screen overflow-hidden">
  <img 
    src={movie.banner} 
    alt={`${movie.title} banner`} 
    className="w-full h-full object-cover brightness-75"
  />
  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
  
  {/* Title Overlay */}
  <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-left">
    <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-2xl leading-tight">
      {movie.title}
    </h1>
    <div className="flex flex-wrap gap-4 text-lg md:text-2xl">
      <span className="bg-white/20 backdrop-blur px-6 py-2 rounded-full">{movie.language}</span>
      <span className="bg-white/20 backdrop-blur px-6 py-2 rounded-full">{movie.genre}</span>
    </div>
  </div>

  <button 
    onClick={() => navigate(-1)} 
    className="absolute top-8 left-8 bg-white/20 backdrop-blur hover:bg-white/30 px-6 py-3 rounded-full font-medium z-10 transition"
  >
    ← Back
  </button>
</div>

    {/* Movie Poster + Info Section */}
<div className="max-w-7xl mx-auto px-4 -mt-32 md:-mt-1 relative z-10 mb-16">
  <div className="grid lg:grid-cols-3 gap-10">
    
    {/* Movie Poster (Sticky on scroll) */}
    <div className="lg:col-span-1">
      <div className="sticky top-24">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-white">
          <img 
            src={movie.poster} 
            alt={movie.title} 
            className="w-full h-auto object-cover"
          />
        </div>
        <div className="text-center mt-6">
          <p className="text-green-400 font-semibold text-lg">Now Showing</p>
        </div>
      </div>
    </div>

    {/* Synopsis + Cast */}
    <div className="lg:col-span-2 space-y-10">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
        <h2 className="text-4xl font-bold mb-6 text-green-400">Synopsis</h2>
        <p className="text-lg leading-relaxed text-gray-100">
          {movie.synopsis}
        </p>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
        <h2 className="text-4xl font-bold mb-8 text-green-400">Cast & Crew</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <p className="text-sm text-gray-400 mb-2">Director</p>
            <p className="text-2xl font-bold text-white">{movie.director}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-4">Starring</p>
            <div className="space-y-3">
              {movie.cast.map((actor, i) => (
                <div key={i} className="flex justify-between items-center py-3 border-b border-white/10 last:border-0">
                  <span className="text-lg font-medium text-white">{actor.name}</span>
                  <span className="text-sm bg-green-600/30 px-4 py-1 rounded-full text-green-300">
                    {actor.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

      {/* Rest of your booking flow - City, Date, Language, Showtimes, Seat Modal */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        {/* City Selector */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 shadow-2xl">
          <label className="text-sm opacity-75">Select City</label>
          <div className="flex flex-wrap gap-3 mt-3">
            {CITIES.map(city => (
              <button key={city} onClick={() => setSelectedCity(city)}
                className={`px-6 py-3 rounded-full font-medium transition-all ${selectedCity === city ? 'bg-green-600 text-white' : 'bg-white/20 hover:bg-white/30'}`}>
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Date Carousel */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 shadow-2xl overflow-x-auto">
          <div className="flex gap-4 min-w-max">
            {dates.map((d, i) => (
              <button key={i} onClick={() => setSelectedDate(d)}
                className={`px-6 py-4 rounded-xl text-center transition-all min-w-24 ${selectedDate.date === d.date ? 'bg-green-600 text-white shadow-lg scale-105' : 'bg-white/20 hover:bg-white/30'}`}>
                <div className="text-xs opacity-75">{d.label.split(' ')[0]}</div>
                <div className="font-bold">{d.label.includes('Today') ? 'Today' : d.label.includes('Tomorrow') ? 'Tomorrow' : d.label.split(' ').slice(1).join(' ')}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Language Chips */}
        <div className="flex flex-wrap gap-3 mb-6 justify-center">
          <button onClick={() => setSelectedLanguage("all")} className={`px-5 py-2 rounded-full ${selectedLanguage === "all" ? 'bg-green-600' : 'bg-white/20'} hover:bg-green-600 transition`}>All Languages</button>
          {LANGUAGES.map(lang => (
            <button key={lang} onClick={() => setSelectedLanguage(lang)} className={`px-5 py-2 rounded-full ${selectedLanguage === lang ? 'bg-green-600' : 'bg-white/20'} hover:bg-green-600 transition`}>{lang}</button>
          ))}
        </div>

        {/* Showtimes Grid */}
        <div className="space-y-8 mb-12">
          {cinemas.length === 0 ? (
            <div className="text-center py-20 text-xl opacity-70">No shows available for selected filters</div>
          ) : (
            cinemas.map(cinema => {
              const formats = showtimes[cinema];
              return (
                <div key={cinema} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
                  <h3 className="text-2xl font-bold mb-4">{cinema}</h3>
                  <div className="space-y-6">
                    {Object.entries(formats).map(([lang, times]) => (
                      (selectedLanguage === "all" || selectedLanguage === lang) && (
                        <div key={lang}>
                          <span className="text-sm opacity-75 bg-white/20 px-4 py-1 rounded-full">{lang}</span>
                          <div className="flex flex-wrap gap-3 mt-3">
                            {times.map((time, idx) => {
                              const seats = formats.seatsLeft?.[idx] || 50;
                              return (
                                <button key={time} onClick={() => setSelectedShow({ cinema, time, language: lang, price: 450 })}
                                  className={`px-5 py-3 rounded-lg border-2 transition-all ${selectedShow?.cinema === cinema && selectedShow?.time === time ? 'bg-green-600 border-green-600 text-white' : 'border-white/30 hover:border-green-400'}`}>
                                  <div className="font-medium">{time}</div>
                                  <div className={`text-xs mt-1 ${getAvailabilityColor(seats)} text-white px-2 py-0.5 rounded`}>
                                    {getAvailabilityText(seats)} {seats <= 20 && `• ${seats} left`}
                                  </div>
                                </button>
                              );
                            })}
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
        {selectedShow && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-2xl max-w-2xl w-full p-8 shadow-2xl">
              <h2 className="text-2xl font-bold mb-4">Select Seats • {selectedShow.time}</h2>
              <div className="text-center mb-6">
                <div className="inline-block bg-gray-800 rounded-t-2xl px-20 py-4 text-lg font-bold">SCREEN</div>
              </div>

              <div className="grid grid-cols-10 gap-2 max-w-lg mx-auto mb-8">
                {Array.from({ length: 60 }, (_, i) => {
                  const row = String.fromCharCode(65 + Math.floor(i / 10));
                  const col = (i % 10) + 1;
                  const seatId = `${row}${col}`;
                  const isSelected = selectedSeats.includes(seatId);
                  const isBooked = Math.random() > 0.7;
                  const isPrime = ['C4','C5','C6','C7','D4','D5','D6','D7'].includes(seatId);

                  return (
                    <button key={seatId} disabled={isBooked} onClick={() => {
                      if (isSelected) setSelectedSeats(prev => prev.filter(s => s !== seatId));
                      else if (selectedSeats.length < 8) setSelectedSeats(prev => [...prev, seatId]);
                      else toast.warn("Max 8 seats");
                    }}
                      className={`w-10 h-10 rounded text-xs font-bold transition-all ${isBooked ? 'bg-gray-700 cursor-not-allowed' : isSelected ? 'bg-green-600 text-white' : isPrime ? 'bg-purple-600 hover:bg-purple-500' : 'bg-gray-600 hover:bg-gray-500'}`}>
                      {row}{col}
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
                <button onClick={() => { setSelectedShow(null); setSelectedSeats([]); }} className="text-red-400 underline">Cancel</button>
                <button onClick={proceedToPayment} disabled={selectedSeats.length === 0}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-10 py-4 rounded-full font-bold text-lg">
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