// CatalogManagement.jsx - Fixed ID references (_id instead of id) and search pagination
// Additional fixes: 
// - Switched search input to controlled with local inputValue state for smooth typing (like ListViewScreens example).
// - Debounced API search to prevent lag on every keystroke while allowing immediate visual updates.
// - Moved fetchTopRated to a separate useEffect to avoid unnecessary re-fetches on search/filter changes.
// - Render full UI always; show inline loading in table to prevent input focus loss during searches.

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { getAllMovies, deleteMovie, searchMovies, getTopRatedMovies } from '../../api/movieAPI'; // Adjust path

const CatalogManagement = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Filters & Search
  const [inputValue, setInputValue] = useState(''); // Local state for smooth typing
  const [searchQuery, setSearchQuery] = useState('');

  const [filterGenre, setFilterGenre] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Top-rated preview
  const [topRated, setTopRated] = useState([]);
  const backendUrl = import.meta.env.VITE_API_URL_Backend;
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    fetchMovies();
  }, [page, searchQuery, filterGenre, filterLanguage, filterStatus]); // Removed fetchTopRated from here

  // Separate effect for top-rated (runs only once on mount)
  useEffect(() => {
    fetchTopRated();
  }, []);

  // Debounce searchQuery update from inputValue
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setSearchQuery(inputValue);
      setPage(1); // Reset to first page when searching
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [inputValue]);

  // Sync inputValue when searchQuery is cleared externally (e.g., via filters reset)
  useEffect(() => {
    if (searchQuery === '' && inputValue !== '') {
      setInputValue('');
    }
  }, [searchQuery]);

  // Immediate input handler for controlled input (smooth typing)
  const handleSearchChange = (e) => {
    setInputValue(e.target.value);
  };

  const fetchMovies = async () => {
    setLoading(true);
    try {
      let params = { page, limit };
      if (searchQuery) {
        // Use search endpoint if query present (no native pagination, so limit results)
        const results = await searchMovies(searchQuery, { limit });
        setMovies(results || []);
        setTotal(results?.length || 0); // For search, total is approximate
        setPages(1); // Single page for search
      } else {
        // Use paginated getAll with filters
        if (filterGenre) params.genre = filterGenre;
        if (filterLanguage) params.language = filterLanguage;
        if (filterStatus) params.status = filterStatus;
        const { movies: results, total: count, pages: totalPages } = await getAllMovies(params);
        setMovies(results || []);
        setTotal(count || 0);
        setPages(totalPages || 1);
      }
    } catch (err) {
      toast.error('Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  const fetchTopRated = async () => {
    try {
      const results = await getTopRatedMovies({ limit: 5 });
      setTopRated(results || []);
    } catch (err) {
      console.error('Failed to load top-rated:', err);
    }
  };

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedId) return;
    setDeleting(true);
    try {
      await deleteMovie(selectedId);
      setMovies(prev => prev.filter(m => m._id !== selectedId)); // Fixed: Use _id
      toast.success('Movie deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete movie');
    } finally {
      setDeleting(false);
      setShowModal(false);
      setSelectedId(null);
    }
  };

  const handleCancelDelete = () => {
    setShowModal(false);
    setSelectedId(null);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pages) setPage(newPage);
  };

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { background: '#fff', color: '#2E2E2E', border: '1px solid #E5E7EB' },
          success: { style: { background: '#F0FDF4', color: '#065F46' } },
          error: { style: { background: '#FEF2F2', color: '#991B1B' } },
        }}
      />
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-[#F5F6FA]">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 bg-gradient-to-r from-[#16A34A] to-[#22C55E] rounded-full flex items-center justify-center mb-4">
              <i className="fas fa-list text-white text-2xl"></i>
            </div>
            <h1 className="text-3xl font-bold text-[#2E2E2E] mb-2">Movie Catalog</h1>
            <p className="text-[#6B7280] text-sm">Manage your movie library</p>
          </div>

          {/* Controls: Search & Filters */}
          <div className="bg-white shadow-sm rounded-xl p-4 mb-6 border border-[#E5E7EB]/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="relative">
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] text-sm"></i>
                <input
                  type="text"
                  placeholder="Search by title or description..."
                  value={inputValue}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                />
              </div>
              <select
                value={filterGenre}
                onChange={(e) => setFilterGenre(e.target.value)}
                className="p-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
              >
                <option value="">All Genres</option>
                <option value="Action">Action</option>
                <option value="Adventure">Adventure</option>
                <option value="Animation">Animation</option>
                <option value="Comedy">Comedy</option>
                <option value="Crime">Crime</option>
                <option value="Documentary">Documentary</option>
                <option value="Drama">Drama</option>
                <option value="Family">Family</option>
                <option value="Fantasy">Fantasy</option>
                <option value="History">History</option>
                <option value="Horror">Horror</option>
                <option value="Music">Music</option>
                <option value="Mystery">Mystery</option>
                <option value="Romance">Romance</option>
                <option value="Science Fiction">Science Fiction</option>
                <option value="Thriller">Thriller</option>
                <option value="War">War</option>
                <option value="Western">Western</option>
              </select>
              <select
                value={filterLanguage}
                onChange={(e) => setFilterLanguage(e.target.value)}
                className="p-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
              >
                <option value="">All Languages</option>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Tamil">Tamil</option>
                <option value="Telugu">Telugu</option>
                <option value="Kannada">Kannada</option>
                <option value="Malayalam">Malayalam</option>
                <option value="Bengali">Bengali</option>
                <option value="Marathi">Marathi</option>
                <option value="Punjabi">Punjabi</option>
                <option value="Gujarati">Gujarati</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Italian">Italian</option>
                <option value="Chinese">Chinese</option>
                <option value="Japanese">Japanese</option>
                <option value="Korean">Korean</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="p-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
              >
                <option value="">All Status</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Now Showing">Now Showing</option>
                <option value="Completed">Completed</option>
              </select>
              <Link
                to="/admin/movies/add"
                className="bg-gradient-to-r from-[#16A34A] to-[#22C55E] text-white px-4 py-2 rounded-lg font-medium hover:from-[#065F46] transition-all duration-200 text-center md:text-left"
              >
                Add New Movie
              </Link>
            </div>
          </div>

          {/* Top-Rated Teaser */}
          {topRated.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#2E2E2E] mb-3">Top Rated Movies</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {topRated.slice(0, 5).map((movie) => (
                  <div key={movie._id} className="bg-white p-3 rounded-lg shadow-sm border border-[#E5E7EB]/50 text-center">
                    <img src={`${backendUrl}/posters/${movie.profilePoster}`} alt={movie.title} className="w-full h-32 object-cover rounded mb-2" />
                    <p className="font-medium text-sm">{movie.title}</p>
                    <p className="text-xs text-[#6B7280]">{movie.rating} ★</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Movies Table */}
          <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8 border border-[#E5E7EB]/50 overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-[#6B7280]">Loading movies...</div>
              </div>
            ) : movies.length === 0 ? (
              <div className="text-center py-12 text-[#6B7280]">
                <i className="fas fa-inbox text-4xl mb-4 opacity-50"></i>
                <p>No movies found. {searchQuery ? `Try adjusting your search for "${searchQuery}".` : `Get started by adding one.`}</p>
                {!searchQuery && <Link to="/admin/movies/add" className="text-[#16A34A] hover:underline">Add Movie</Link>}
              </div>
            ) : (
              <>
                <div className="mb-4 text-right">
                  <p className="text-[#6B7280] text-sm">Showing {movies.length} of {total} movies</p>
                </div>
                <table className="w-full table-auto">
                  <thead className="bg-[#F5F6FA]">
                    <tr>
                      <th className="px-4 py-3 text-left text-[#6B7280] text-sm font-medium">Title</th>
                      <th className="px-4 py-3 text-left text-[#6B7280] text-sm font-medium">Genre</th>
                      <th className="px-4 py-3 text-left text-[#6B7280] text-sm font-medium">Language</th>
                      <th className="px-4 py-3 text-right text-[#6B7280] text-sm font-medium">Duration</th>
                      <th className="px-4 py-3 text-left text-[#6B7280] text-sm font-medium">Release Date</th>
                      <th className="px-4 py-3 text-left text-[#6B7280] text-sm font-medium">Status</th>
                      <th className="px-4 py-3 text-right text-[#6B7280] text-sm font-medium">Rating</th>
                      <th className="px-4 py-3 text-center text-[#6B7280] text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    {movies.map((movie) => (
                      <tr key={movie._id} className="hover:bg-gray-50"> {/* Fixed: key={movie._id} */}
                        <td className="px-4 py-4 text-[#2E2E2E] text-sm font-medium">
                          <div>{movie.title}</div>
                          <div className="text-xs text-[#6B7280]">{movie.description?.substring(0, 50)}...</div>
                        </td>
                        <td className="px-4 py-4 text-[#2E2E2E] text-sm">{movie.genre}</td>
                        <td className="px-4 py-4 text-[#2E2E2E] text-sm">{movie.language}</td>
                        <td className="px-4 py-4 text-right text-[#2E2E2E] text-sm">{movie.duration} min</td>
                        <td className="px-4 py-4 text-[#2E2E2E] text-sm">
                          {new Date(movie.releaseDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            movie.status === 'Now Showing' ? 'bg-green-100 text-green-800' :
                            movie.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {movie.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right text-[#2E2E2E] text-sm font-medium">{movie.rating} ★</td>
                        <td className="px-4 py-4 text-center space-x-2">
                          <Link
                            to={`/admin/movies/add/${movie._id}`} // Fixed: movie._id
                            className="text-[#16A34A] hover:underline text-sm"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(movie._id)} // Fixed: movie._id
                            className="text-red-500 hover:underline text-sm"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                {pages > 1 && (
                  <div className="mt-6 flex justify-between items-center">
                    <div className="text-[#6B7280] text-sm">
                      Page {page} of {pages}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        className="px-3 py-2 border border-[#E5E7EB] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === pages}
                        className="px-3 py-2 border border-[#E5E7EB] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="mx-auto h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-exclamation-triangle text-red-500 text-xl"></i>
              </div>
              <h3 className="text-lg font-bold text-[#2E2E2E] mb-2">Confirm Deletion</h3>
              <p className="text-[#6B7280] text-sm">Are you sure you want to delete this movie? This action cannot be undone.</p>
            </div>
            <div className="flex space-x-3 justify-center">
              <button
                onClick={handleCancelDelete}
                disabled={deleting}
                className="flex-1 bg-gray-100 text-[#6B7280] py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-xl font-medium hover:from-red-600 hover:to-red-700 disabled:opacity-50 transition-all flex items-center justify-center"
              >
                {deleting ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Deleting...
                  </>
                ) : (
                  <>
                    <i className="fas fa-trash mr-2"></i>
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CatalogManagement;