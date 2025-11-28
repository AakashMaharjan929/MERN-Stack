// pages/HomePage.jsx - Updated: Integrated Trie for prefix-based autocomplete and search
// No backend needed; client-side only. Filters on prefix match for efficiency.
// Cards grid unchanged (lg:grid-cols-5 gap-4); assumes Card component width is original w-64
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Banner from '../components/Banner';
import Card from '../components/Card';
import Footer from '../components/Footer';

// Simple Trie implementation for prefix search (inspired by Fredkin 1960)
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
    node.movies.push(movie); // Store full movie object
  }

  searchPrefix(prefix) {
    let node = this.root;
    for (let char of prefix.toLowerCase()) {
      if (!node.children[char]) return [];
      node = node.children[char];
    }
    // Collect all movies under this prefix (DFS traversal for suggestions)
    const collectMovies = (currentNode, results) => {
      if (currentNode.isEnd) results.push(...currentNode.movies);
      for (let char in currentNode.children) {
        collectMovies(currentNode.children[char], results);
      }
    };
    const results = [];
    collectMovies(node, results);
    return [...new Set(results.map(m => m.id))].map(id => results.find(m => m.id === id)); // Dedupe by ID
  }
}

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('now-showing');
  const [searchParams, setSearchParams] = useSearchParams();
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([]);
  const navigate = useNavigate();

  const query = searchParams.get('q') || '';
  const isSearching = !!query;

  // Temporary data constants for Now Showing and Upcoming movies (expanded to 5 each for ~10 total)
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

  // Memoize Trie once on mount
  const trie = useMemo(() => {
    const newTrie = new Trie();
    const allMovies = [...NOW_SHOWING_MOVIES, ...UPCOMING_MOVIES];
    allMovies.forEach(movie => newTrie.insert(movie.title, movie));
    return newTrie;
  }, []);

  // Update suggestions on query change (for autocomplete)
  useEffect(() => {
    if (query) {
      const suggestions = trie.searchPrefix(query);
      setAutocompleteSuggestions(suggestions.slice(0, 5)); // Limit to top 5
    } else {
      setAutocompleteSuggestions([]);
    }
  }, [query, trie]);

  useEffect(() => {
    // Load user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error parsing user data:', err);
        localStorage.removeItem('user');
      }
    } else {
      // If no user, redirect to login
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);

    toast.info('Logged out successfully!', {
      position: "top-right",
      autoClose: 3000,
    });

    // Redirect to login
    navigate('/login');
  };

  const handleClearSearch = () => {
    navigate('/', { replace: true });
  };

  // For search: Use trie for prefix-filtered movies
  const allMovies = [...NOW_SHOWING_MOVIES, ...UPCOMING_MOVIES];
  const filteredMovies = useMemo(() => {
    if (!query) return [];
    return trie.searchPrefix(query);
  }, [query, trie]);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url('/bgsignup.png')] bg-cover bg-center bg-no-repeat">
      {/* Navbar */}
      <Navbar 
        onSearch={(q) => setSearchParams({ q }, { replace: true })}
        suggestions={autocompleteSuggestions}
      />
      
      {/* Full-width Banner Container - Only show if not searching */}
      {!isSearching && (
        <div className="pt-16 w-full h-[calc(100vh)]">
          <Banner className="w-full h-full" />
        </div>
      )}
      
      {/* Main Content - Offset for fixed navbar, with padding for other elements */}
      <main className={`relative z-0 ${isSearching ? 'pt-24 p-8' : 'pt-16 p-8'}`}>
        {/* Search Results Section */}
        {isSearching && (
          <div className="max-w-6xl mx-auto mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
              <h2 className="text-2xl font-bold text-white drop-shadow-lg">
                Search Results for "{query}" ({filteredMovies.length} found)
              </h2>
              <button
                onClick={handleClearSearch}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors"
              >
                Clear Search
              </button>
            </div>
            {filteredMovies.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {filteredMovies.map((movie) => (
                  <Card key={movie.id} movie={movie} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-white text-lg drop-shadow-lg">No movies found matching "{query}".</p>
                <button
                  onClick={handleClearSearch}
                  className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md text-sm font-semibold transition-colors"
                >
                  Back to Home
                </button>
              </div>
            )}
          </div>
        )}

        {/* Normal Tabs and Content - Only show if not searching */}
        {!isSearching && (
          <>
            {/* Tabs for Now Showing and Upcoming - Removed border line */}
            <div className="flex mb-8">
              <button
                onClick={() => setActiveTab('now-showing')}
                className={`py-4 px-6 text-xl font-semibold transition-colors duration-200 ${
                  activeTab === 'now-showing'
                    ? 'border-b-2 border-green-600 text-green-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Now Showing
              </button>
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`py-4 px-6 text-xl font-semibold transition-colors duration-200 ${
                  activeTab === 'upcoming'
                    ? 'border-b-2 border-green-600 text-green-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Upcoming
              </button>
            </div>

            {/* Conditional rendering of cards based on active tab */}
            {activeTab === 'now-showing' && (
              <div>
                {/* <h2 className="text-2xl font-bold text-white mb-6 drop-shadow-lg">Now Showing in Cinemas</h2> */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {NOW_SHOWING_MOVIES.map((movie) => (
                    <Card key={movie.id} movie={movie} />
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'upcoming' && (
              <div>
                {/* <h2 className="text-2xl font-bold text-white mb-6 drop-shadow-lg">Upcoming Releases</h2> */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {UPCOMING_MOVIES.map((movie) => (
                    <Card key={movie.id} movie={movie} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;