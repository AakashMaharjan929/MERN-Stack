// pages/UpComing.jsx (or Upcoming.jsx)
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Footer from '../components/Footer';

// Use the UPCOMING_MOVIES data (copy from HomePage or make it shared via context)
const UPCOMING_MOVIES = [
  // ... (paste the array from HomePage)
];

const UpcomingAll = () => {
  const [searchParams] = useSearchParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const movieId = searchParams.get('movieId');
  const isDetailView = !!movieId;

  useEffect(() => {
    console.log('Upcoming mounted, movieId:', movieId);
    if (movieId) {
      const parsedId = parseInt(movieId);
      const foundMovie = UPCOMING_MOVIES.find(m => m.id === parsedId);
      if (foundMovie) {
        setMovie(foundMovie);
      } else {
        toast.error('Movie not found!');
        navigate('/movies/coming-soon');
      }
    }
    setLoading(false);
  }, [movieId, navigate]);

  const handleBuyTickets = () => {
    toast.info('Advance booking not available yet...');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[url('/bgsignup.png')] bg-cover bg-center bg-no-repeat">
        <div className="text-white text-xl drop-shadow-lg">Loading...</div>
      </div>
    );
  }

  if (isDetailView && !movie) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[url('/bgsignup.png')] bg-cover bg-center bg-no-repeat">
        <div className="text-white text-xl drop-shadow-lg">No movie selected. <button onClick={() => navigate('/movies/coming-soon')} className="text-green-400 underline">Go to Upcoming</button></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url('/bgsignup.png')] bg-cover bg-center bg-no-repeat">
      <Navbar />
      <main className="pt-16 p-8">
        <div className="max-w-6xl mx-auto">
          {isDetailView && (
            <button
              onClick={() => navigate('/movies/coming-soon')}
              className="mb-6 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors"
            >
              ← Back to Upcoming
            </button>
          )}

          {isDetailView && movie && (
            // Similar detail view JSX as NowShowing, but with "Coming Soon" label
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* ... (copy hero section from NowShowing, adjust button to "Pre-Book" or similar) */}
            </div>
          )}

          {!isDetailView && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 drop-shadow-lg">Upcoming Releases</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {UPCOMING_MOVIES.map((movieItem) => (
                  <Card key={movieItem.id} movie={movieItem} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UpcomingAll;