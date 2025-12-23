// pages/Upcoming.jsx - Fetch real upcoming movies data from API (no booking)
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getMovieById } from '../api/movieAPI';
import { getAllShows } from '../api/showAPI';
import { getAllTheaters } from '../api/theaterAPI';

const Upcoming = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const movieId = searchParams.get('movieId');

  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper: Extract string ID
  const getIdString = (id) => {
    if (!id) return null;
    if (typeof id === 'string') return id;
    if (id.$oid) return id.$oid;
    if (id._id) return id._id.toString();
    return id.toString();
  };

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
          getIdString(show.movieId) === movieId && show.status === 'Upcoming'
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

  // Group shows by theater
  const groupedShows = {};
  shows.forEach(show => {
    const theater = theaters.find(t =>
      t.screens.some(screen => getIdString(screen) === getIdString(show.screenId))
    );
    if (!theater) return;

    const theaterName = theater.name;
    if (!groupedShows[theaterName]) {
      groupedShows[theaterName] = [];
    }

    const showDate = new Date(show.startTime).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    const showTime = new Date(show.startTime).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    groupedShows[theaterName].push({
      id: show._id,
      date: showDate,
      time: showTime,
      screenName: show.screenId?.name || 'Screen'
    });
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-white">Loading movie details...</div>
      </div>
    );
  }

  if (!movie) {
    return null; // Handled in useEffect
  }

  const getImageUrl = (filename) => {
    if (!filename) return 'https://picsum.photos/400/600?random=0';
    return `${import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:5000'}/posters/${filename}`;
  };

  const posterUrl = getImageUrl(movie?.profilePoster);
  const bannerUrl = getImageUrl(movie?.bannerPoster || movie?.profilePoster);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      {/* Navbar */}
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
                <p className="text-blue-400 font-semibold text-lg">Coming Soon</p>
                <p className="text-sm opacity-75 mt-2">Tickets will be available on release date</p>
                {movie?.releaseDate && (
                  <p className="text-sm text-gray-400 mt-1">
                    Release: {new Date(movie.releaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-10">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
              <h2 className="text-4xl font-bold mb-6 text-blue-400">Synopsis</h2>
              <p className="text-lg leading-relaxed text-gray-100">
                {movie.description || movie.synopsis || 'No synopsis available.'}
              </p>
            </div>

            {/* Trailer */}
            {movie.trailerUrl && getTrailerEmbedUrl(movie.trailerUrl) && (
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold mb-4 text-blue-400">Official Trailer</h3>
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
                <h3 className="text-2xl font-bold mb-4 text-blue-400">Director</h3>
                <div className="flex flex-wrap gap-3">
                  {movie.director && movie.director.length > 0 ? (
                    movie.director.map((dir, idx) => (
                      <span key={idx} className="bg-blue-600/20 border border-blue-500 px-4 py-2 rounded-full text-sm font-medium text-blue-300">
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
                <h3 className="text-2xl font-bold mb-4 text-blue-400">Cast</h3>
                <div className="flex flex-wrap gap-3">
                  {movie.cast && movie.cast.length > 0 ? (
                    movie.cast.map((actor, idx) => (
                      <span key={idx} className="bg-purple-600/20 border border-purple-500 px-4 py-2 rounded-full text-sm font-medium text-purple-300">
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

      {/* Movie Details Content */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        {/* Showtimes Section */}
        {shows.length > 0 ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 shadow-2xl">
            <h3 className="text-3xl font-bold mb-6 text-blue-400">Upcoming Showtimes</h3>
            <div className="space-y-6">
              {Object.entries(groupedShows).map(([theaterName, theaterShows]) => (
                <div key={theaterName} className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h4 className="font-bold text-xl mb-4 text-green-400">{theaterName}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {theaterShows.map((show, idx) => (
                      <div
                        key={idx}
                        className="bg-white/10 rounded-lg px-4 py-3 text-center hover:bg-white/20 transition-all border border-white/20"
                      >
                        <div className="font-bold text-lg">{show.time}</div>
                        <div className="text-xs opacity-75 mt-1">{show.date}</div>
                        <div className="text-xs opacity-75">{show.screenName}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center shadow-2xl">
            <p className="text-xl opacity-70">No showtimes scheduled yet. Check back soon!</p>
          </div>
        )}

        {/* Additional Info Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold mb-4 text-blue-400">Production Details</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span className="opacity-75">Director:</span>
                <span className="font-semibold">{movie.director?.join(', ') || 'N/A'}</span>
              </li>
              <li className="flex justify-between">
                <span className="opacity-75">Producer:</span>
                <span className="font-semibold">{movie.producer || 'N/A'}</span>
              </li>
              <li className="flex justify-between">
                <span className="opacity-75">Studio:</span>
                <span className="font-semibold">{movie.studio || 'N/A'}</span>
              </li>
            </ul>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold mb-4 text-blue-400">Movie Details</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span className="opacity-75">Release Date:</span>
                <span className="font-semibold">{formatReleaseDate(movie.releaseDate) || 'TBA'}</span>
              </li>
              <li className="flex justify-between">
                <span className="opacity-75">Runtime:</span>
                <span className="font-semibold">{movie.duration || 'N/A'} min</span>
              </li>
              <li className="flex justify-between">
                <span className="opacity-75">Language:</span>
                <span className="font-semibold">{movie.language || 'N/A'}</span>
              </li>
              <li className="flex justify-between">
                <span className="opacity-75">Genre:</span>
                <span className="font-semibold">{movie.genre || 'N/A'}</span>
              </li>
            </ul>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold mb-4 text-blue-400">Release Status</h3>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-300 mb-2">Coming Soon</p>
              <p className="text-sm opacity-75">Advance booking will open closer to release date</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Upcoming;