// pages/HomePage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Banner from '../components/Banner';
import Card from '../components/Card';
import Footer from '../components/Footer';
import { getAllMovies } from '../api/movieAPI'; // Your real API
import { getAllShows } from '../api/showAPI';

// Trie for fast prefix-based autocomplete (client-side)
class Trie {
  constructor() {
    this.root = { children: {}, isEnd: false, movies: [] };
  }

  insert(word, movie) {
    let node = this.root;
    for (let char of word.toLowerCase()) {
      if (!node.children[char]) node.children[char] = { children: {}, isEnd: false, movies: [] };
      node = node.children[char];
    }
    node.isEnd = true;
    node.movies.push(movie);
  }

  searchPrefix(prefix) {
    let node = this.root;
    for (let char of prefix.toLowerCase()) {
      if (!node.children[char]) return [];
      node = node.children[char];
    }
    const collectMovies = (currentNode, results) => {
      if (currentNode.isEnd) results.push(...currentNode.movies);
      for (let child in currentNode.children) {
        collectMovies(currentNode.children[child], results);
      }
    };
    const results = [];
    collectMovies(node, results);
    // Dedupe by _id
    return [...new Set(results.map(m => m._id))].map(id => results.find(m => m._id === id));
  }
}

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('now-showing');
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || 'All');
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([]);
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const cityParam = searchParams.get('city');
  const isSearching = !!query;

  // Keep local city in sync with URL changes (e.g., navbar navigate)
  useEffect(() => {
    const nextCity = cityParam || 'All';
    if (nextCity !== selectedCity) {
      setSelectedCity(nextCity);
    }
  }, [cityParam, selectedCity]);

   // Fetch all movies from backend
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = await getAllMovies(); // This is likely { data: [...] } or { movies: [...] }
        const showsResponse = await getAllShows(); // Fetch shows if needed

        // Log it once to see the real structure (remove later)
        console.log('API Response:', response);
        console.log('Shows API Response:', showsResponse);

        let movieArray = [];
        let showArray = [];

        // Handle common response patterns
        if (Array.isArray(response)) {
          movieArray = response;
        } else if (response && Array.isArray(response.data)) {
          movieArray = response.data;
        } else if (response && Array.isArray(response.movies)) {
          movieArray = response.movies;
        } else if (response && Array.isArray(response.results)) {
          movieArray = response.results;
        } else {
          console.error('Unexpected movie data structure:', response);
          toast.error('Invalid data received from server');
          movieArray = [];
        }

        setMovies(movieArray);

        if (Array.isArray(showsResponse)) {
          showArray = showsResponse;
        } else if (showsResponse && Array.isArray(showsResponse.data)) {
          showArray = showsResponse.data;
        } else {
          console.error('Unexpected shows data structure:', showsResponse);
          toast.error('Invalid shows data received from server');
          showArray = [];
        }
        setShows(showArray);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch movies:', err);
        setError('Unable to load movies. Please try again later.');
        toast.error('Failed to load movies');
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Build Trie once movies are loaded
  const trie = useMemo(() => {
    const newTrie = new Trie();
    movies.forEach(movie => newTrie.insert(movie.title, movie));
    return newTrie;
  }, [movies]);

  // Update autocomplete suggestions
  useEffect(() => {
    if (query && movies.length > 0) {
      const suggestions = trie.searchPrefix(query).slice(0, 5);
      setAutocompleteSuggestions(suggestions);
    } else {
      setAutocompleteSuggestions([]);
    }
  }, [query, trie]);

  // Auth check
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('user');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    toast.info('Logged out successfully!');
    navigate('/login');
  };

  const handleSearchChange = (value, cityFromNavbar) => {
    const nextCity = cityFromNavbar || selectedCity || 'All';
    if (nextCity !== selectedCity) {
      setSelectedCity(nextCity);
    }

    const params = {};
    if (value) params.q = value;
    if (nextCity) params.city = nextCity;
    setSearchParams(params, { replace: true });
  };

  const handleClearSearch = () => {
    if (selectedCity && selectedCity !== 'All') {
      setSearchParams({ city: selectedCity }, { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  };

  const handleCityChange = (city) => {
    const nextCity = city || 'All';
    setSelectedCity(nextCity);

    const params = {};
    if (query) params.q = query;
    if (nextCity) params.city = nextCity;

    setSearchParams(params, { replace: false });
  };

  // DEBUG VERSION - Add this to see what's going wrong
useEffect(() => {
  if (movies.length === 0 || shows.length === 0) return;

  console.log('=== SUPER DETAILED ID DEBUG ===');
  console.log('Total movies:', movies.length);
  console.log('Total shows:', shows.length);

  const nowShowingMovie = movies.find(m => m.status === 'Now Showing');
  if (!nowShowingMovie) {
    console.log('No movie with "Now Showing" status found.');
    return;
  }

  // Print movie _id in full detail
  console.log('Movie title:', nowShowingMovie.title);
  console.log('Movie _id raw:', nowShowingMovie._id);
  console.log('Movie _id type:', typeof nowShowingMovie._id);
  console.log('Movie _id (JSON stringified):', JSON.stringify(nowShowingMovie._id));

  // Print ALL shows' movieId details
  shows.forEach((show, index) => {
    console.log(`Show ${index + 1}:`);
    console.log('   show.movieId raw:', show.movieId);
    console.log('   show.movieId type:', typeof show.movieId);
    console.log('   show.movieId (JSON):', JSON.stringify(show.movieId));
    console.log('   show.status:', show.status);
  });

  // Test different extraction methods
  const movieIdCandidates = [
    nowShowingMovie._id,
    nowShowingMovie._id?.$oid,
    JSON.stringify(nowShowingMovie._id)
  ];

  console.log('Trying to match movie ID with these candidates:', movieIdCandidates);

  shows.forEach(show => {
    const showIdCandidates = [
      show.movieId,
      show.movieId?.$oid,
      JSON.stringify(show.movieId)
    ];
    console.log('Show movieId candidates:', showIdCandidates);
  });

  console.log('=== END SUPER DEBUG ===');
}, [movies, shows]);
const normalizedSelectedCity = (selectedCity || 'All').toLowerCase();

const nowShowingMovies = movies.filter(movie => {
  if (movie.status !== 'Now Showing') return false;

  const movieId = movie._id; // it's already a string

  return shows.some(show => {
    const showMovieId = show.movieId?._id;
    if (showMovieId !== movieId) return false;

    if (!(show.status === 'Upcoming' || show.status === 'Live')) return false;

    if (normalizedSelectedCity === 'all') return true;

    const showCity = show.screenId?.theaterId?.location?.city;
    return showCity && showCity.toLowerCase() === normalizedSelectedCity;
  });
});

const upcomingMovies = movies.filter(movie => movie.status === 'Upcoming');

  // Search results
  const searchResults = useMemo(() => {
    if (!query || movies.length === 0) return [];
    return trie.searchPrefix(query);
  }, [query, trie]);

    // Build full image URL
  const getImageUrl = (filename) => {
    if (!filename) return 'https://picsum.photos/400/600?random=0';

    // Option A: If using app.use(express.static('public')) — no /public in URL
    return `${import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:5000'}/posters/${filename}`;

    // Option B: If you want to keep /uploads or match old path, just adjust accordingly
    // return `${base}/posters/${filename}`;
  };

  // Transform movie for Card component - PRIORITIZE profilePoster
  const transformMovieForCard = (movie) => ({
    id: movie._id,
    title: movie.title,
    language: movie.language || 'English',
    genre: movie.genre || 'N/A',
      image: getImageUrl(movie.profilePoster), // profilePoster first!
    tag: movie.status === 'Now Showing' ? 'Now Showing' : 'Upcoming',
  });

  if (!user) return <div className="flex justify-center items-center min-h-screen text-white">Redirecting...</div>;

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-white">
        <div className="text-2xl mb-4">Loading movies...</div>
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-400 text-xl px-4 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url('/bgsignup.png')] bg-cover bg-center bg-no-repeat">
      <Navbar
        onSearch={handleSearchChange}
        suggestions={autocompleteSuggestions.map(transformMovieForCard)}
        selectedCity={selectedCity}
        onCityChange={handleCityChange}
      />

      {/* Banner only when not searching */}
{!isSearching && (
  <div className="pt-16 w-full h-[calc(100vh-4rem)]">
    <Banner movies={nowShowingMovies} />  {/* ← Pass real data */}
  </div>
)}

      <main className={`relative z-10 ${isSearching ? 'pt-24 px-8' : 'pt-16 px-8'} pb-12`}>
        {/* Search Results View */}
        {isSearching && (
          <section className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <h2 className="text-3xl font-bold text-white drop-shadow-lg">
                Results for "{query}" ({searchResults.length})
              </h2>
              <button
                onClick={handleClearSearch}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                Clear Search
              </button>
            </div>

            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {searchResults.map(movie => (
                  <Card key={movie._id} movie={transformMovieForCard(movie)} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-white text-xl mb-6">No movies found for "{query}"</p>
                <button
                  onClick={handleClearSearch}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition"
                >
                  Back to Home
                </button>
              </div>
            )}
          </section>
        )}

        {/* Normal Tabs View */}
        {!isSearching && (
          <>
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-start mb-10 border-b border-gray-700">
                <button
                  onClick={() => setActiveTab('now-showing')}
                  className={`py-4 px-8 text-2xl font-bold transition-colors ${
                    activeTab === 'now-showing'
                      ? 'text-green-500 border-b-4 border-green-500'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Now Showing ({nowShowingMovies.length})
                </button>
                <button
                  onClick={() => setActiveTab('upcoming')}
                  className={`py-4 px-8 text-2xl font-bold transition-colors ${
                    activeTab === 'upcoming'
                      ? 'text-green-500 border-b-4 border-green-500'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Upcoming ({upcomingMovies.length})
                </button>
              </div>

              {activeTab === 'now-showing' && nowShowingMovies.length === 0 && (
                <p className="text-white text-center text-xl py-20">No movies currently showing.</p>
              )}

              {activeTab === 'upcoming' && upcomingMovies.length === 0 && (
                <p className="text-white text-center text-xl py-20">No upcoming movies announced yet.</p>
              )}

              {(activeTab === 'now-showing' ? nowShowingMovies : upcomingMovies).length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {(activeTab === 'now-showing' ? nowShowingMovies : upcomingMovies).map(movie => (
                    <Card key={movie._id} movie={transformMovieForCard(movie)} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;