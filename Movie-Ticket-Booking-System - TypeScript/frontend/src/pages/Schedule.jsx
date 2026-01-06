// pages/Schedule.jsx - FIXED & CLEAN VERSION
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getAllMovies } from '../api/movieAPI';
import { getAllShows } from '../api/showAPI';
import { getAllTheaters } from '../api/theaterAPI';

const normalizeId = (id) => {
  if (!id) return null;
  if (typeof id === 'string') return id;
  if (typeof id === 'object') {
    if (id.$oid) return id.$oid;
    if (id._id) return normalizeId(id._id);
    if (id.toString && typeof id.toString === 'function' && id.toString() !== '[object Object]') {
      return id.toString();
    }
  }
  return String(id);
};

const Schedule = () => {
  const [movies, setMovies] = useState([]);
  const [shows, setShows] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [period, setPeriod] = useState('thisWeek');
  const [selectedLanguage, setSelectedLanguage] = useState('All Language');
  const [selectedCinema, setSelectedCinema] = useState('All Cinemas');

  const generateDates = (offset = 0) => {
    const dates = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = offset; i < offset + 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);

      const isToday = i === 0 && offset === 0;
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

      dates.push({
        dateObj: date,
        dayName: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][date.getDay()],
        dayNum: date.getDate(),
        month: date.toLocaleString('default', { month: 'short' }).toUpperCase(),
        fullDate: dateStr,
        label: isToday ? 'TODAY' : `${date.getDate()} ${date.toLocaleString('default', { month: 'short' }).toUpperCase()}`,
        isToday,
      });
    }
    return dates;
  };

  const thisWeekDates = generateDates(0);
  const nextWeekDates = generateDates(7);
  const weekDates = period === 'thisWeek' ? thisWeekDates : nextWeekDates;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [moviesRes, showsRes, theatersRes] = await Promise.all([
          getAllMovies(),
          getAllShows(),
          getAllTheaters(),
        ]);

        const movieList = Array.isArray(moviesRes) ? moviesRes : moviesRes.data || [];
        const showList = Array.isArray(showsRes) ? showsRes : showsRes.data || [];
        const theaterList = Array.isArray(theatersRes) ? theatersRes : theatersRes.data || [];

        setMovies(movieList);
        setShows(showList);
        setTheaters(theaterList);

        // Auto-switch to next week if shows exist there
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const hasNextWeekShows = showList.some(show => {
          const showDate = new Date(show.startTime);
          showDate.setHours(0, 0, 0, 0);
          const diffDays = Math.floor((showDate - today) / 86400000);
          return diffDays >= 7 && diffDays < 14;
        });

        setPeriod(hasNextWeekShows ? 'nextWeek' : 'thisWeek');
      } catch (err) {
        toast.error('Failed to load schedule');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Group shows by movie and date
  const groupedData = {};

  shows.forEach(show => {
    // Handle populated movieId (could be an object or just an ID)
    let movie = null;
    let showMovieId = null;

    if (typeof show.movieId === 'object' && show.movieId !== null) {
      // movieId is populated with the full movie object
      movie = show.movieId;
      showMovieId = normalizeId(movie._id);
    } else {
      // movieId is just a string/ID reference
      showMovieId = normalizeId(show.movieId);
      if (!showMovieId) {
        skippedReasons.noMovieId++;
        return;
      }
      movie = movies.find(m => normalizeId(m._id) === showMovieId);
    }

    if (!movie) return;

    const showScreenId = normalizeId(show.screenId);
    const theater = theaters.find(t =>
      t.screens?.some(s => normalizeId(s._id) === showScreenId)
    );
    if (!theater) return;

    // Convert show startTime to local date string (YYYY-MM-DD)
    const showDate = new Date(show.startTime);
    const dateStr = `${showDate.getFullYear()}-${String(showDate.getMonth() + 1).padStart(2, '0')}-${String(showDate.getDate()).padStart(2, '0')}`;
    
    if (!weekDates.some(d => d.fullDate === dateStr)) return;

    const time12 = new Date(show.startTime).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).toUpperCase();

    const format = show.showType || '2D';
    const availableSeats = Array.isArray(show.availableSeats)
      ? show.availableSeats.filter(s => s && !s.isBooked).length
      : 0;

    const movieKey = showMovieId;

    if (!groupedData[movieKey]) {
      groupedData[movieKey] = { movie, dates: {} };
    }
    if (!groupedData[movieKey].dates[dateStr]) {
      groupedData[movieKey].dates[dateStr] = [];
    }

    groupedData[movieKey].dates[dateStr].push({
      showId: normalizeId(show._id),
      time: time12,
      format,
      theater: theater.name,
      availableSeats,
    });
  });

  // Sort show times within each day
  Object.values(groupedData).forEach(entry => {
    Object.values(entry.dates).forEach(dayShows => {
      dayShows.sort((a, b) => {
        const [timeA, periodA = 'AM'] = a.time.split(' ');
        const [timeB, periodB = 'AM'] = b.time.split(' ');
        const [hA, mA] = timeA.split(':').map(Number);
        const [hB, mB] = timeB.split(':').map(Number);

        let hourA = hA % 12 + (periodA === 'PM' ? 12 : 0);
        let hourB = hB % 12 + (periodB === 'PM' ? 12 : 0);

        return hourA - hourB || mA - mB;
      });
    });
  });

  const languages = ['All Language', ...new Set(movies.map(m => m.language).filter(Boolean))];
  const cinemas = ['All Cinemas', ...new Set(theaters.map(t => t.name))];

  const getImageUrl = (filename) =>
    filename
      ? `${import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:5000'}/posters/${filename}`
      : 'https://picsum.photos/600/900?random=1';

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white text-2xl">
        Loading schedule...
      </div>
    );
  }

  const filteredMovies = Object.values(groupedData).filter(({ movie, dates }) => {
    if (selectedLanguage !== 'All Language' && movie.language !== selectedLanguage) return false;

    if (selectedCinema !== 'All Cinemas') {
      const hasShowInCinema = Object.values(dates).flat().some(s => s.theater === selectedCinema);
      if (!hasShowInCinema) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <Navbar />

      {/* Filters */}
      <div className="bg-gray-800/90 backdrop-blur-sm border-b border-green-500/30 py-4 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center gap-8 text-sm">
          <div className="flex items-center gap-4">
            <span className="text-gray-400">Period</span>
            <div className="flex rounded-full bg-gray-700 p-1">
              <button
                onClick={() => setPeriod('thisWeek')}
                className={`px-6 py-2 rounded-full transition ${period === 'thisWeek' ? 'bg-green-500 text-black font-bold' : 'text-gray-300'}`}
              >
                This Week
              </button>
              <button
                onClick={() => setPeriod('nextWeek')}
                className={`px-6 py-2 rounded-full transition ${period === 'nextWeek' ? 'bg-green-500 text-black font-bold' : 'text-gray-300'}`}
              >
                Next Week
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-gray-400">Language</span>
            <select
              value={selectedLanguage}
              onChange={e => setSelectedLanguage(e.target.value)}
              className="bg-gray-700 rounded-full px-6 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {languages.map(l => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-gray-400">Cinemas</span>
            <select
              value={selectedCinema}
              onChange={e => setSelectedCinema(e.target.value)}
              className="bg-gray-700 rounded-full px-6 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {cinemas.map(c => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <main className="pt-10 pb-20">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          {filteredMovies.length === 0 ? (
            <div className="text-center py-32 text-gray-400 text-3xl font-light">
              No showtimes available for selected filters
            </div>
          ) : (
            filteredMovies.map(({ movie, dates }) => (
              <div key={movie._id} className="bg-gray-800/60 backdrop-blur-lg rounded-3xl overflow-hidden shadow-2xl border border-gray-700">
                <div className="flex flex-col lg:flex-row">
                  {/* Poster */}
                  <div className="lg:w-96 relative">
                    <img
                      src={getImageUrl(movie.bannerPoster || movie.profilePoster)}
                      alt={movie.title}
                      className="w-full h-96 lg:h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <h2 className="text-4xl font-bold mb-3 drop-shadow-2xl">{movie.title}</h2>
                      <div className="flex items-center gap-4 mb-4">
                        <span className="bg-green-500 text-black px-4 py-1.5 rounded-full font-bold text-sm">
                          {movie.certification || 'U'}
                        </span>
                        <span className="bg-green-600 px-5 py-1.5 rounded-full text-sm font-medium">
                          {movie.duration} min
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="bg-gray-700 px-5 py-2 rounded-full text-green-300 text-sm">
                          {movie.language}
                        </span>
                        <button 
                          onClick={() => navigate(`/movies/now-showing?movieId=${normalizeId(movie._id)}`)}
                          className="bg-green-600 hover:bg-green-500 px-8 py-3 rounded-full font-bold transition shadow-lg"
                        >
                          Info
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Time Grid */}
                  <div className="flex-1 p-10">
                    <div className="grid grid-cols-7 gap-6 mb-8 text-center">
                      {weekDates.map(date => (
                        <div key={date.fullDate} className={`pb-4 border-b-2 ${date.isToday ? 'border-green-500' : 'border-gray-600'}`}>
                          <div className="font-bold text-xl text-white mb-1">
                            {date.label.split(' ')[0]}
                          </div>
                          <div className="text-sm text-gray-400">
                            {date.label.includes(' ') ? date.label.split(' ')[1] : `${date.dayNum} ${date.month}`}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="text-center mb-8">
                      <span className="bg-green-500 text-black text-xl font-bold px-10 py-3 rounded-full inline-block shadow-lg">
                        {movie.language.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-7 gap-6">
                      {weekDates.map(date => {
                        const dayShows = dates[date.fullDate] || [];
                        return (
                          <div key={date.fullDate} className="space-y-4">
                            {dayShows.length === 0 ? (
                              <div className="text-center text-gray-600 text-lg">—</div>
                            ) : (
                              dayShows.map(show => (
                                <button
                                  key={show.showId}
                                  onClick={() => navigate(`/movies/now-showing?movieId=${normalizeId(movie._id)}&showId=${show.showId}`)}
                                  className="w-full bg-gradient-to-b from-gray-700 to-gray-800 hover:from-green-600 hover:to-green-700 transition-all duration-300 rounded-xl p-5 text-center shadow-xl border border-gray-600 hover:border-green-500 transform hover:scale-105"
                                >
                                  <div className="text-2xl font-bold text-white mb-1">{show.time}</div>
                                  <div className="text-sm text-green-300">{show.format}</div>
                                  <div className="text-xs text-gray-400 mt-2">{show.theater}</div>
                                  {show.availableSeats <= 20 && (
                                    <div className="text-xs text-orange-400 mt-2 font-bold">
                                      {show.availableSeats <= 5 ? 'FILLING FAST' : 'LIMITED SEATS'}
                                    </div>
                                  )}
                                </button>
                              ))
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Schedule;