// AddEditMovie.jsx - Form for adding/editing movies (create in /admin/components/Movie)
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { addMovie, updateMovie, getMovieById } from '../../api/movieAPI'; // Adjust path

const AddEditMovie = () => {
  const { id } = useParams(); // For edit mode if id present
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [previewProfile, setPreviewProfile] = useState(null);
  const [previewBanner, setPreviewBanner] = useState(null);
  const [profilePoster, setProfilePoster] = useState(null);
  const [bannerPoster, setBannerPoster] = useState(null);
  const backendUrl = import.meta.env.VITE_API_URL_Backend;

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue } = useForm({
    defaultValues: {
      title: '',
      description: '',
      genre: '',
      language: '',
      duration: '',
      releaseDate: '',
      director: '',
      cast: '',
      certification: 'U',
      trailerUrl: '',
      status: 'Upcoming',
      rating: 0,
    },
    mode: 'onChange',
  });

  // Fetch movie for edit
  useEffect(() => {
    if (isEdit) {
      const fetchMovie = async () => {
        try {
          const movie = await getMovieById(id);
          setValue('title', movie.title);
          setValue('description', movie.description);
          setValue('genre', movie.genre);
          setValue('language', movie.language);
          setValue('duration', movie.duration);
          setValue('releaseDate', movie.releaseDate ? new Date(movie.releaseDate).toISOString().split('T')[0] : '');
          setValue('director', movie.director.join(', '));
          setValue('cast', movie.cast.join(', '));
          setValue('certification', movie.certification);
          setValue('trailerUrl', movie.trailerUrl || '');
          setValue('status', movie.status);
          setValue('rating', movie.rating);
          if (movie.profilePoster) {
            setPreviewProfile(`${backendUrl}/posters/${movie.profilePoster}`);
          }
          if (movie.bannerPoster) {
            setPreviewBanner(`${backendUrl}/posters/${movie.bannerPoster}`);
          }
        } catch (err) {
          toast.error('Failed to load movie');
        } finally {
          setLoading(false);
        }
      };
      fetchMovie();
    } else {
      setLoading(false);
    }
  }, [id, isEdit, setValue, backendUrl]);

  const onSubmit = async (data) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('genre', data.genre);
    formData.append('language', data.language);
    formData.append('duration', data.duration);
    formData.append('releaseDate', data.releaseDate);
    formData.append('director', data.director);
    formData.append('cast', data.cast);
    formData.append('certification', data.certification);
    formData.append('trailerUrl', data.trailerUrl);
    formData.append('status', data.status);
    formData.append('rating', data.rating);

    // Append files if selected
    if (profilePoster) formData.append('profilePoster', profilePoster);
    if (bannerPoster) formData.append('bannerPoster', bannerPoster);

    try {
      if (isEdit) {
        await updateMovie(id, formData);
        toast.success('Movie updated successfully!');
      } else {
        await addMovie(formData);
        toast.success('Movie added successfully!');
      }
      setTimeout(() => navigate('/admin/movies/catalog'), 1500); // Redirect to catalog
    } catch (err) {
      toast.error(err.error || 'Failed to save movie');
    } finally {
      setUploading(false);
    }
  };

  // File upload handlers
  const handleProfileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePoster(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreviewProfile(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleBannerUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerPoster(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreviewBanner(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  if (loading) return <div className="text-[#6B7280]">Loading movie...</div>;

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
      <div className="flex justify-center items-start min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-[#F5F6FA]">
        <div className="max-w-4xl w-full space-y-8">
          <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8 border border-[#E5E7EB]/50">
            <div className="text-center mb-6 md:mb-8">
              <div className="mx-auto h-16 w-16 bg-gradient-to-r from-[#16A34A] to-[#22C55E] rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-film text-white text-2xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-[#2E2E2E] mb-2">
                {isEdit ? 'Edit Movie' : 'Add New Movie'}
              </h2>
              <p className="text-[#6B7280] text-sm">Fill in the details below</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" encType="multipart/form-data">
              {/* Title */}
              <div className="relative">
                <label className="block text-[#6B7280] text-sm font-medium mb-2">Title</label>
                <div className="relative">
                  <i className="fas fa-film absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] text-sm"></i>
                  <input
                    {...register('title', { required: 'Title is required' })}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                      errors.title ? 'border-red-500 focus:ring-red-500' : 'border-[#E5E7EB] focus:ring-[#16A34A]'
                    }`}
                    placeholder="e.g., Inception"
                  />
                  {errors.title && <p className="mt-1 text-red-600 text-xs">{errors.title.message}</p>}
                </div>
              </div>

              {/* Description */}
              <div className="relative">
                <label className="block text-[#6B7280] text-sm font-medium mb-2">Description</label>
                <textarea
                  {...register('description', { required: 'Description is required', maxLength: 1000 })}
                  rows={4}
                  className={`w-full pl-3 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                    errors.description ? 'border-red-500 focus:ring-red-500' : 'border-[#E5E7EB] focus:ring-[#16A34A]'
                  }`}
                  placeholder="Movie synopsis..."
                />
                {errors.description && <p className="mt-1 text-red-600 text-xs">{errors.description.message}</p>}
              </div>

              {/* Genre & Language */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-[#6B7280] text-sm font-medium mb-2">Genre</label>
                  <select
                    {...register('genre', { required: 'Genre is required' })}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                      errors.genre ? 'border-red-500 focus:ring-red-500' : 'border-[#E5E7EB] focus:ring-[#16A34A]'
                    }`}
                  >
                    <option value="">Select Genre</option>
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
                  {errors.genre && <p className="mt-1 text-red-600 text-xs">{errors.genre.message}</p>}
                </div>
                <div className="relative">
                  <label className="block text-[#6B7280] text-sm font-medium mb-2">Language</label>
                  <div className="relative">
                    <i className="fas fa-globe absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] text-sm"></i>
                    <input
                      {...register('language', { required: 'Language is required' })}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                        errors.language ? 'border-red-500 focus:ring-red-500' : 'border-[#E5E7EB] focus:ring-[#16A34A]'
                      }`}
                      placeholder="e.g., English"
                    />
                    {errors.language && <p className="mt-1 text-red-600 text-xs">{errors.language.message}</p>}
                  </div>
                </div>
              </div>

              {/* Duration & Release Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-[#6B7280] text-sm font-medium mb-2">Duration (minutes)</label>
                  <input
                    type="number"
                    {...register('duration', { required: 'Duration is required', min: 1 })}
                    className={`w-full p-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A34A] ${
                      errors.duration ? 'border-red-500 focus:ring-red-500' : ''
                    }`}
                    placeholder="e.g., 120"
                  />
                  {errors.duration && <p className="mt-1 text-red-600 text-xs">{errors.duration.message}</p>}
                </div>
                <div className="relative">
                  <label className="block text-[#6B7280] text-sm font-medium mb-2">Release Date</label>
                  <input
                    type="date"
                    {...register('releaseDate', { required: 'Release date is required' })}
                    className={`w-full p-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A34A] ${
                      errors.releaseDate ? 'border-red-500 focus:ring-red-500' : ''
                    }`}
                  />
                  {errors.releaseDate && <p className="mt-1 text-red-600 text-xs">{errors.releaseDate.message}</p>}
                </div>
              </div>

              {/* Director & Cast */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-[#6B7280] text-sm font-medium mb-2">Director(s)</label>
                  <input
                    {...register('director', { required: 'Director is required' })}
                    className={`w-full p-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A34A] ${
                      errors.director ? 'border-red-500 focus:ring-red-500' : ''
                    }`}
                    placeholder="e.g., Christopher Nolan"
                  />
                  {errors.director && <p className="mt-1 text-red-600 text-xs">{errors.director.message}</p>}
                  <p className="text-xs text-[#6B7280] mt-1">Comma-separated for multiple</p>
                </div>
                <div className="relative">
                  <label className="block text-[#6B7280] text-sm font-medium mb-2">Cast</label>
                  <input
                    {...register('cast', { required: 'Cast is required' })}
                    className={`w-full p-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A34A] ${
                      errors.cast ? 'border-red-500 focus:ring-red-500' : ''
                    }`}
                    placeholder="e.g., Leonardo DiCaprio, Tom Hardy"
                  />
                  {errors.cast && <p className="mt-1 text-red-600 text-xs">{errors.cast.message}</p>}
                  <p className="text-xs text-[#6B7280] mt-1">Comma-separated</p>
                </div>
              </div>

              {/* Certification & Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-[#6B7280] text-sm font-medium mb-2">Certification</label>
                  <select
                    {...register('certification', { required: 'Certification is required' })}
                    className="w-full p-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                  >
                    <option value="U">U</option>
                    <option value="U/A">U/A</option>
                    <option value="A">A</option>
                    <option value="S">S</option>
                  </select>
                  {errors.certification && <p className="mt-1 text-red-600 text-xs">{errors.certification.message}</p>}
                </div>
                <div className="relative">
                  <label className="block text-[#6B7280] text-sm font-medium mb-2">Status</label>
                  <select
                    {...register('status', { required: 'Status is required' })}
                    className="w-full p-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Now Showing">Now Showing</option>
                    <option value="Completed">Completed</option>
                  </select>
                  {errors.status && <p className="mt-1 text-red-600 text-xs">{errors.status.message}</p>}
                </div>
              </div>

              {/* Rating & Trailer URL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-[#6B7280] text-sm font-medium mb-2">Rating (0-10)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    {...register('rating', { required: 'Rating is required', min: 0, max: 10 })}
                    className={`w-full p-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A34A] ${
                      errors.rating ? 'border-red-500 focus:ring-red-500' : ''
                    }`}
                    placeholder="e.g., 8.5"
                  />
                  {errors.rating && <p className="mt-1 text-red-600 text-xs">{errors.rating.message}</p>}
                </div>
                <div className="relative">
                  <label className="block text-[#6B7280] text-sm font-medium mb-2">Trailer URL</label>
                  <input
                    {...register('trailerUrl')}
                    className="w-full p-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                    placeholder="e.g., https://youtube.com/watch?v=..."
                  />
                </div>
              </div>

              {/* Poster Uploads */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[#6B7280] text-sm font-medium mb-2">Profile Poster</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileUpload}
                    className="w-full p-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                  />
                  {previewProfile && (
                    <img src={previewProfile} alt="Preview" className="mt-2 w-32 h-48 object-cover rounded-lg" />
                  )}
                </div>
                <div>
                  <label className="block text-[#6B7280] text-sm font-medium mb-2">Banner Poster</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBannerUpload}
                    className="w-full p-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                  />
                  {previewBanner && (
                    <img src={previewBanner} alt="Preview" className="mt-2 w-64 h-24 object-cover rounded-lg" />
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || uploading}
                className="w-full bg-gradient-to-r from-[#16A34A] to-[#22C55E] text-white py-3 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl hover:from-[#065F46] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
              >
                {isSubmitting || uploading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save mr-2"></i>
                    {isEdit ? 'Update Movie' : 'Add Movie'}
                  </>
                )}
              </button>
            </form>
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => navigate('/admin/movies/catalog')}
                className="text-[#6B7280] hover:text-[#16A34A] text-sm font-medium transition-colors duration-200"
              >
                ← Back to Catalog
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddEditMovie;