// pages/Upcoming.jsx - Similar to NowShowing, but for upcoming movies
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Duplicate the UPCOMING_MOVIES data here for client-side access (in a real app, fetch from API or use context)
const UPCOMING_MOVIES = [
  {
    id: 6,
    title: "Avatar 3: Fire and Ash",
    tag: "Upcoming",
    date: "December 19, 2025",
    image: "https://picsum.photos/300/400?random=3",
    language: "English",
    genre: "Sci-Fi Adventure",
    synopsis: "Pandora's next chapter unfolds."
  },
  {
    id: 7,
    title: "Dune: Part Three",
    tag: "Upcoming",
    date: "March 15, 2026",
    image: "https://picsum.photos/300/400?random=4",
    language: "English",
    genre: "Sci-Fi Epic",
    synopsis: "The saga of the Fremen reaches its climax."
  },
  {
    id: 8,
    title: "सपना",
    tag: "Upcoming",
    date: "Mangsir 10 | 26 DEC",
    image: "https://picsum.photos/300/400?random=8",
    language: "Nepali",
    genre: "Drama",
    synopsis: "Dreams and aspirations of a young artist in Kathmandu."
  },
  {
    id: 9,
    title: "Superman",
    tag: "Upcoming",
    date: "July 11, 2025",
    image: "https://picsum.photos/300/400?random=9",
    language: "English",
    genre: "Superhero",
    synopsis: "The Man of Steel returns in a bold new vision."
  },
  {
    id: 10,
    title: "फूल",
    tag: "Upcoming",
    date: "January 20, 2026",
    image: "https://picsum.photos/300/400?random=10",
    language: "Nepali",
    genre: "Family",
    synopsis: "A touching family drama set against the backdrop of festivals."
  }
];

const Upcoming = () => {
  const [searchParams] = useSearchParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const movieId = searchParams.get('movieId');

  useEffect(() => {
    if (movieId) {
      const foundMovie = UPCOMING_MOVIES.find(m => m.id === parseInt(movieId));
      if (foundMovie) {
        setMovie(foundMovie);
      } else {
        toast.error('Movie not found!');
        navigate('/');
      }
    } else {
      // If no movieId, redirect to home
      navigate('/');
    }
    setLoading(false);
  }, [movieId, navigate]);

  const handleBuyTickets = () => {
    // Placeholder for buy tickets logic (e.g., open modal, redirect to booking, etc.)
    // In a real app, this could integrate with a booking system
    toast.info('Redirecting to booking... (Client-side demo)');
    // Example: navigate('/booking?movieId=' + movie.id);
  };

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

  return (
    <div className="min-h-screen bg-[url('/bgsignup.png')] bg-cover bg-center bg-no-repeat">
      {/* Navbar */}
      <Navbar />

      {/* Movie Details Content */}
      <main className="pt-16 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            className="mb-6 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors"
          >
            ← Back to Home
          </button>

          {/* Movie Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="relative">
              <img
                src={movie.image}
                alt={movie.title}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
            <div className="text-white space-y-4">
              <h1 className="text-4xl font-bold drop-shadow-lg">{movie.title}</h1>
              <div className="space-y-2">
                <p className="text-lg"><span className="font-semibold">Release Date:</span> {movie.date}</p>
                <p className="text-lg"><span className="font-semibold">Language:</span> {movie.language}</p>
                <p className="text-lg"><span className="font-semibold">Genre:</span> {movie.genre}</p>
              </div>
              <p className="text-lg drop-shadow-lg">{movie.synopsis}</p>
              <button
                onClick={handleBuyTickets}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-md text-lg font-semibold transition-colors"
              >
                Buy Tickets
              </button>
            </div>
          </div>

          {/* Additional Sections (e.g., Showtimes, Cast - placeholders) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-4">Showtimes</h3>
              <ul className="space-y-2">
                <li>Coming Soon - Pre-book at Kathmandu Cineplex</li>
                <li>Coming Soon - Big Cinema</li>
                <li>Coming Soon - Roxy Theatre</li>
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-4">Cast & Crew</h3>
              <ul className="space-y-1 text-sm">
                <li>Director: John Doe</li>
                <li>Lead Actor: Jane Smith</li>
                <li>Supporting: Bob Johnson</li>
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-4">Ratings</h3>
              <p className="text-2xl font-bold">★★★★☆ (4.2/5)</p>
              <p className="text-sm opacity-75">Based on 1,234 reviews</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Upcoming;