// src/pages/UpcomingAll.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Footer from '../components/Footer';
import { getAllMovies, getMovieById } from '../api/movieAPI';

const UpcomingAll = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);              // All Upcoming movies
  const [selectedMovie, setSelectedMovie] = useState(null); // Detail view
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const movieId = searchParams.get('movieId');
  const isDetailView = !!movieId;

  // Image URL helper (same as NowShowingAll)
  const getImageUrl = (filename) => {
    const localUrl = filename 
      ? `${import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:5000'}/posters/${filename}`
      : null;

    // Beautiful fallback for upcoming movies (e.g., cinematic teaser style)
    return localUrl || 'https://image.tmdb.org/t/p/original/8yT4lKZAih3MWLyYGCb8laS4ayt.jpg'; // Example: Deadpool & Wolverine teaser style
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

  // Extract movie ID
  const getMovieIdString = (movie) => {
    if (!movie || !movie._id) return null;
    return typeof movie._id === 'string' ? movie._id : movie._id.$oid || movie._id;
  };

  useEffect(() => {
    const fetchUpcomingMovies = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getAllMovies({ limit: 100 });
        let allMovies = [];
        if (Array.isArray(response)) allMovies = response;
        else if (response && response.data) allMovies = response.data;
        else if (response && response.movies) allMovies = response.movies;

        console.log('Fetched upcoming movies:', allMovies.map(m => ({ title: m.title, status: m.status })));

        const upcomingMovies = allMovies.filter(movie => 
          movie.status && movie.status.trim() === 'Upcoming'
        );

        setMovies(upcomingMovies);

        // Detail view
        if (isDetailView && movieId) {
          let foundMovie = upcomingMovies.find(m => getMovieIdString(m) === movieId);

          if (!foundMovie) {
            try {
              const singleResponse = await getMovieById(movieId);
              const singleMovie = singleResponse.data || singleResponse;
              if (singleMovie && singleMovie.status === 'Upcoming') {
                foundMovie = singleMovie;
              }
            } catch (err) {
              console.error('Failed to fetch single movie:', err);
            }
          }

          if (foundMovie) {
            setSelectedMovie(foundMovie);
          } else {
            toast.error('Upcoming movie not found.');
            navigate('/movies/coming-soon');
          }
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load upcoming movies.');
        toast.error('Could not load upcoming movies.');
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingMovies();
  }, [movieId, isDetailView, navigate]);

  const handlePreBook = () => {
    toast.info('Advance booking will open soon! Stay tuned.');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[url('/bgsignup.png')] bg-cover bg-center bg-no-repeat">
        <div className="text-white text-2xl drop-shadow-lg">Loading upcoming movies...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[url('/bgsignup.png')] bg-cover bg-center bg-no-repeat">
        <div className="text-red-400 text-xl drop-shadow-lg text-center max-w-md">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url('/bgsignup.png')] bg-cover bg-center bg-no-repeat">
      <Navbar />

      <main className="pt-16 p-8">
        <div className="max-w-7xl mx-auto">

          {/* Back Button */}
          {isDetailView && (
            <button
              onClick={() => navigate('/movies/coming-soon')}
              className="mb-8 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-semibold transition-colors flex items-center gap-2"
            >
              ← Back to Upcoming
            </button>
          )}

          {/* Detail View */}
          {isDetailView && selectedMovie && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
                <div>
                  <img
                    src={getImageUrl(selectedMovie.bannerPoster || selectedMovie.profilePoster)}
                    alt={selectedMovie.title}
                    className="w-full rounded-xl shadow-2xl object-cover"
                    onError={(e) => e.target.src = 'https://via.placeholder.com/600x900?text=Coming+Soon'}
                  />
                </div>

                <div className="text-white space-y-6">
                  <h1 className="text-5xl font-bold drop-shadow-lg">{selectedMovie.title}</h1>
                  <span className="inline-block bg-cyan-600 text-white px-6 py-2 rounded-full text-lg font-bold animate-pulse">
                    Coming Soon
                  </span>

                  <div className="space-y-4 text-lg">
                    <p><span className="font-bold text-green-400">Language:</span> {selectedMovie.language}</p>
                    <p><span className="font-bold text-green-400">Genre:</span> {selectedMovie.genre}</p>
                    <p><span className="font-bold text-green-400">Duration:</span> {selectedMovie.duration || 'N/A'} minutes</p>
                    {selectedMovie.director && Array.isArray(selectedMovie.director) && (
                      <p><span className="font-bold text-green-400">Director:</span> {selectedMovie.director.join(', ')}</p>
                    )}
                  </div>

                  <p className="text-lg leading-relaxed text-gray-200">
                    {selectedMovie.description || 'Details coming soon...'}
                  </p>

                  <button
                    onClick={handlePreBook}
                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-4 px-8 rounded-lg text-xl font-bold transition-all shadow-lg"
                  >
                    Notify Me When Booking Opens
                  </button>
                </div>
              </div>

              {/* Trailer */}
              {selectedMovie.trailerUrl && getTrailerEmbedUrl(selectedMovie.trailerUrl) && (
                <div className="mt-16 bg-black/60 rounded-xl p-8">
                  <h3 className="text-3xl font-bold text-white mb-6 text-center">Official Trailer</h3>
                  <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
                    <iframe
                      src={getTrailerEmbedUrl(selectedMovie.trailerUrl)}
                      title={`Trailer - ${selectedMovie.title}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  </div>
                </div>
              )}
            </>
          )}

          {/* List View */}
          {!isDetailView && (
            <div>
              <h2 className="text-4xl font-bold text-white mb-10 drop-shadow-lg text-center">
                Coming Soon to Cinemas ({movies.length} Movie{movies.length !== 1 ? 's' : ''})
              </h2>

              {movies.length === 0 ? (
                <div className="text-center text-white text-2xl py-20 opacity-80">
                  No upcoming movies announced yet.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
                  {movies.map((movie) => (
                    <Card
                      key={getMovieIdString(movie)}
                      movie={{
                        id: getMovieIdString(movie),
                        title: movie.title,
                        image: getImageUrl(movie.profilePoster || movie.bannerPoster),
                        language: movie.language,
                        genre: movie.genre,
                        rating: movie.rating,
                        duration: movie.duration,
                        tag: 'Upcoming'  // ← Critical for Card navigation!
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UpcomingAll;