import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Footer from '../components/Footer';

// Duplicate the NOW_SHOWING_MOVIES data here for client-side access (in a real app, fetch from API or use context)
const NOW_SHOWING_MOVIES = [
  {
    id: 1,
    title: "जारि२",
    tag: "Now Showing",
    date: "Kartik 29 | 7 NOV",
    image: "https://picsum.photos/300/400?random=1",
    language: "Nepali",
    genre: "Thriller",
    synopsis: "A thrilling sequel to the blockbuster Jaari."
  },
  {
    id: 2,
    title: "Wicked 2: For Good",
    tag: "Now Showing",
    date: "November 21",
    image: "https://picsum.photos/300/400?random=2",
    language: "English",
    genre: "Fantasy Musical",
    synopsis: "The magical journey continues in this epic tale."
  },
  {
    id: 3,
    title: "माया",
    tag: "Now Showing",
    date: "Kartik 15 | 31 OCT",
    image: "https://picsum.photos/300/400?random=5",
    language: "Nepali",
    genre: "Romance",
    synopsis: "A heartfelt story of love and loss in the Himalayas."
  },
  {
    id: 4,
    title: "Deadpool & Wolverine",
    tag: "Now Showing",
    date: "October 10",
    image: "https://picsum.photos/300/400?random=6",
    language: "English",
    genre: "Action Comedy",
    synopsis: "The Merc with a Mouth teams up with the Clawed Mutant."
  },
  {
    id: 5,
    title: "काला",
    tag: "Now Showing",
    date: "November 5",
    image: "https://picsum.photos/300/400?random=7",
    language: "Nepali",
    genre: "Action",
    synopsis: "A tale of revenge and redemption in rural Nepal."
  },
  {
    id: 11,
    title: "The Enchanted Forest",
    tag: "Now Showing",
    date: "November 12",
    image: "https://picsum.photos/300/400?random=11",
    language: "English",
    genre: "Fantasy",
    synopsis: "A magical journey through an enchanted forest."
  },
  {
    id: 12,
    title: "दिलको कुरा",
    tag: "Now Showing",
    date: "Mangsir 1 | 17 NOV",
    image: "https://picsum.photos/300/400?random=12",
    language: "Nepali",
    genre: "Drama",
    synopsis: "A touching story about family and relationships."
  },
  {
    id: 13,
    title: "Space Odyssey",
    tag: "Now Showing",
    date: "December 1",
    image: "https://picsum.photos/300/400?random=13",
    language: "English",
    genre: "Sci-Fi",
    synopsis: "An epic adventure through space and time."
  },
  {
    id: 14,
    title: "सपनाको शहर",
    tag: "Now Showing",
    date: "Poush 5 | 20 DEC",
    image: "https://picsum.photos/300/400?random=14",
    language: "Nepali",
    genre: "Romance",
    synopsis: "A romantic tale set in the bustling city of Kathmandu."
  },
  {
    id: 15,
    title: "The Last Samurai",
    tag: "Now Showing",
    date: "November 25",
    image: "https://picsum.photos/300/400?random=15",
    language: "English",
    genre: "Action Drama",
    synopsis: "A warrior's journey in feudal Japan."
  }
];

const NowShowingAll = () => {
  const [searchParams] = useSearchParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const movieId = searchParams.get('movieId');
  const isDetailView = !!movieId;

  // Add console logs for debugging
  useEffect(() => {
    console.log('NowShowing mounted, movieId:', movieId);
    console.log('Available movies:', NOW_SHOWING_MOVIES.map(m => m.id));

    if (movieId) {
      const parsedId = parseInt(movieId);
      console.log('Parsed ID:', parsedId);
      const foundMovie = NOW_SHOWING_MOVIES.find(m => m.id === parsedId);
      console.log('Found movie:', foundMovie ? foundMovie.title : 'Not found');
      if (foundMovie) {
        setMovie(foundMovie);
      } else {
        console.log('Movie not found, showing toast and navigating');
        toast.error('Movie not found!');
        navigate('/movies/now-showing');
      }
    } else {
      console.log('No movieId, showing list view');
      // No redirect for list view
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
      <div className="flex justify-center items-center min-h-screen bg-[url('/bgsignup.png')] bg-cover bg-center bg-no-repeat">
        <div className="text-white text-xl drop-shadow-lg">Loading movie details...</div>
      </div>
    );
  }

  if (isDetailView && !movie) {
    console.log('Rendering no movie message');
    return (
      <div className="flex justify-center items-center min-h-screen bg-[url('/bgsignup.png')] bg-cover bg-center bg-no-repeat">
        <div className="text-white text-xl drop-shadow-lg">No movie selected. <button onClick={() => navigate('/movies/now-showing')} className="text-green-400 underline">Go to Now Showing</button></div>
      </div>
    );
  }

  console.log('Rendering', isDetailView ? `detail for ${movie?.title}` : 'list view');

  return (
    <div className="min-h-screen bg-[url('/bgsignup.png')] bg-cover bg-center bg-no-repeat">
      {/* Navbar */}
      <Navbar />

      {/* Movie Content */}
      <main className="pt-16 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button - Only for detail view */}
          {isDetailView && (
            <button
              onClick={() => navigate('/movies/now-showing')}
              className="mb-6 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors"
            >
              ← Back to Now Showing
            </button>
          )}

          {/* Detail View */}
          {isDetailView && movie && (
            <>
              {/* Movie Hero Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="relative">
                  <img
                    src={movie.image}
                    alt={movie.title}
                    className="w-full h-96 object-cover rounded-lg shadow-lg"
                    onError={(e) => {
                      e.target.src = 'https://picsum.photos/400/600?random=0';
                      console.log('Image load error, fallback used');
                    }}
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
                    <li>10:00 AM - Kathmandu Cineplex</li>
                    <li>1:00 PM - Big Cinema</li>
                    <li>4:00 PM - Roxy Theatre</li>
                    <li>7:00 PM - Kathmandu Cineplex</li>
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
            </>
          )}

          {/* List View */}
          {!isDetailView && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 drop-shadow-lg">Now Showing in Cinemas</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {NOW_SHOWING_MOVIES.map((movieItem) => (
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

export default NowShowingAll;