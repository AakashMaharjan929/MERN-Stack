// src/pages/NowShowingAll.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Footer from '../components/Footer';
import { getAllMovies, getMovieById } from '../api/movieAPI';

const NowShowingAll = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const movieId = searchParams.get('movieId');
  const isDetailView = !!movieId;

const getImageUrl = (filename) => {
  const localUrl = filename 
    ? `${import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:5000'}/posters/${filename}`
    : null;

  // Fallback to official Demon Slayer posters
  return localUrl || 'https://a.storyblok.com/f/178900/1920x1080/70f47c0f6d/demon-slayer-kimetsu-no-yaiba-infinity-castle-imax-wide.png';
};

  // Helper: Extract YouTube embed URL
  const getTrailerEmbedUrl = (url) => {
    if (!url) return '';
    let videoId = '';

    if (url.includes('youtu.be')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
    } else if (url.includes('watch?v=')) {
      videoId = url.split('v=')[1]?.split('&')[0] || '';
    } else if (url.includes('embed/')) {
      videoId = url.split('embed/')[1]?.split('?')[0] || '';
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
  };

  // Helper: Extract movie ID string from _id object or string
  const getMovieIdString = (movie) => {
    if (!movie || !movie._id) return null;
    return typeof movie._id === 'string' ? movie._id : movie._id.$oid || movie._id;
  };

  useEffect(() => {
    const fetchNowShowingMovies = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getAllMovies({ limit: 100 });

        // Handle different possible response shapes
        let allMovies = [];
        if (response && Array.isArray(response)) {
          allMovies = response;
        } else if (response && response.data && Array.isArray(response.data)) {
          allMovies = response.data;
        } else if (response && Array.isArray(response.movies)) {
          allMovies = response.movies;
        } else {
          console.warn('Unexpected response format:', response);
        }

        console.log('Fetched movies:', allMovies.map(m => ({
          title: m.title,
          status: m.status,
          id: getMovieIdString(m)
        })));

        // Filter movies with status "Now Showing" (case-sensitive match)
        const nowShowingMovies = allMovies.filter(movie => 
          movie.status && movie.status.trim() === 'Now Showing'
        );

        setMovies(nowShowingMovies);

        // Detail view logic
        if (isDetailView && movieId) {
          let foundMovie = nowShowingMovies.find(m => 
            getMovieIdString(m) === movieId
          );

          if (!foundMovie) {
            try {
              const singleResponse = await getMovieById(movieId);
              const singleMovie = singleResponse.data || singleResponse;
              if (singleMovie && singleMovie.status === 'Now Showing') {
                foundMovie = singleMovie;
              }
            } catch (err) {
              console.error('Failed to fetch single movie:', err);
            }
          }

          if (foundMovie) {
            setSelectedMovie(foundMovie);
          } else {
            toast.error('Movie not found or not currently showing.');
            navigate('/movies/now-showing');
          }
        }
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError('Failed to load movies. Please check your connection or try again later.');
        toast.error('Failed to load now showing movies.');
      } finally {
        setLoading(false);
      }
    };

    fetchNowShowingMovies();
  }, [movieId, isDetailView, navigate]);

  const handleBuyTickets = () => {
    if (!selectedMovie) return;
    toast.info('Redirecting to booking...');
    // navigate(`/booking?movieId=${getMovieIdString(selectedMovie)}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[url('/bgsignup.png')] bg-cover bg-center bg-no-repeat">
        <div className="text-white text-2xl drop-shadow-lg">Loading now showing movies...</div>
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
              onClick={() => navigate('/movies/now-showing')}
              className="mb-8 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-semibold transition-colors flex items-center gap-2"
            >
              ← Back to Now Showing
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
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/600x900?text=Movie+Poster';
                    }}
                  />
                </div>

                <div className="text-white space-y-6">
                  <h1 className="text-5xl font-bold drop-shadow-lg">{selectedMovie.title}</h1>

                  <div className="space-y-4 text-lg">
                    <p><span className="font-bold text-green-400">Language:</span> {selectedMovie.language}</p>
                    <p><span className="font-bold text-green-400">Genre:</span> {selectedMovie.genre}</p>
                    <p><span className="font-bold text-green-400">Duration:</span> {selectedMovie.duration} minutes</p>
                    <p><span className="font-bold text-green-400">Rating:</span> ⭐ {selectedMovie.rating || 'N/A'} ({selectedMovie.totalVotes || 0} votes)</p>
                    {selectedMovie.director && Array.isArray(selectedMovie.director) && selectedMovie.director.length > 0 && (
                      <p><span className="font-bold text-green-400">Director:</span> {selectedMovie.director.join(', ')}</p>
                    )}
                    {selectedMovie.cast && Array.isArray(selectedMovie.cast) && selectedMovie.cast.length > 0 && (
                      <p><span className="font-bold text-green-400">Cast:</span> {selectedMovie.cast.join(', ')}</p>
                    )}
                  </div>

                  <p className="text-lg leading-relaxed text-gray-200">
                    {selectedMovie.description || 'No description available.'}
                  </p>

                  <button
                    onClick={handleBuyTickets}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-8 rounded-lg text-xl font-bold transition-all transform hover:scale-105 shadow-lg"
                  >
                    Buy Tickets
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
                Now Showing in Cinemas ({movies.length} Movie{movies.length !== 1 ? 's' : ''})
              </h2>

              {movies.length === 0 ? (
                <div className="text-center text-white text-2xl py-20 opacity-80">
                  No movies are currently showing.
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
    tag: 'Now Showing'   // ← ADD THIS LINE
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

export default NowShowingAll;