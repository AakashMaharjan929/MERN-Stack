// ScheduleShow.jsx - Form for scheduling/editing a show (create in /admin/components/Shows)
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { addShow, updateShow, getShowById, suggestFactors } from '../../api/showAPI'; // Adjust path
import { getAllMovies } from '../../api/movieAPI'; // For fetching movies
import { getAllScreens } from '../../api/screenAPI'; // For fetching screens

// Helper to validate ObjectId (24 hex chars)
const isValidObjectId = (str) => /^[0-9a-fA-F]{24}$/.test(str);

// Helper to format Date to local 'YYYY-MM-DDTHH:mm:ss' string (added seconds for consistency)
const formatToLocalDateTime = (date) => {
  if (!date || isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0'); // Added seconds
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

const ScheduleShow = () => {
  const { id } = useParams(); // For edit mode if id present
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [movies, setMovies] = useState([]);
  const [screens, setScreens] = useState([]);
  const [rationale, setRationale] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, control } = useForm({
    defaultValues: {
      movieId: '',
      screenId: '',
      startTime: '',
      endTime: '',
      showType: 'Regular',
      standardBasePrice: '',
      premiumBasePrice: '',
      demandFactor: 0.1,
      timeFactor: 0.05,
    },
    mode: 'onChange',
  });

  // Watch fields for auto-calc
  const selectedMovieId = useWatch({ control, name: 'movieId' });
  const startTime = useWatch({ control, name: 'startTime' });

  // Fetch all data (movies, screens, and show if editing)
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [moviesRes, screensRes] = await Promise.all([
          getAllMovies(),
          getAllScreens(),
        ]);
        setMovies(moviesRes.movies || []);
        setScreens(Array.isArray(screensRes) ? screensRes : []);

        if (isEdit) {
          // Validate ID before fetching
          if (!isValidObjectId(id)) {
            toast.error('Invalid show ID format');
            navigate('/admin/shows');
            return;
          }

          const show = await getShowById(id);
          setValue('movieId', show.movieId._id);
          setValue('screenId', show.screenId._id);
          setValue('startTime', formatToLocalDateTime(new Date(show.startTime))); // Now includes seconds
          setValue('endTime', formatToLocalDateTime(new Date(show.endTime)));
          setValue('showType', show.showType);
          setValue('standardBasePrice', show.pricingRules.standardBasePrice);
          setValue('premiumBasePrice', show.pricingRules.premiumBasePrice);
          setValue('demandFactor', show.pricingRules.alpha);
          setValue('timeFactor', show.pricingRules.beta);
        }
      } catch (err) {
        if (isEdit) {
          toast.error('Failed to load show');
        } else {
          toast.error('Failed to load movies or screens');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id, isEdit, setValue, navigate]);

  // Optional: Auto-calculate endTime based on movie duration + startTime
  useEffect(() => {
    if (selectedMovieId && startTime && !isEdit) { // Skip auto-calc in edit mode to avoid overriding
      const selectedMovie = movies.find(m => m._id === selectedMovieId);
      if (selectedMovie && selectedMovie.duration) {
        const start = new Date(startTime + ':00'); // Ensure seconds (existing)
        const durationMs = parseInt(selectedMovie.duration) * 60 * 1000; // minutes to ms
        const end = new Date(start.getTime() + durationMs);
        setValue('endTime', formatToLocalDateTime(end)); // Now includes seconds
      }
    }
  }, [selectedMovieId, startTime, movies, setValue, isEdit]);

  // Auto-suggest factors based on movie and start time (skip in edit mode)
  useEffect(() => {
    if (selectedMovieId && startTime && !isEdit) {
      // Validate movieId before suggesting
      if (!isValidObjectId(selectedMovieId)) {
        return;
      }

      const fetchSuggestions = async () => {
        try {
          // Append :00 to ensure full datetime for API (fixes 400 error)
          const fullStartTime = startTime + ':00';
          const { suggestedAlpha, suggestedBeta, rationale } = await suggestFactors(selectedMovieId, fullStartTime);
          setValue('demandFactor', suggestedAlpha);
          setValue('timeFactor', suggestedBeta);
          setRationale(rationale);
          toast.success('Suggested factors applied!');
        } catch (err) {
          setRationale('');
          toast.error('Failed to suggest factors');
        }
      };
      fetchSuggestions();
    }
  }, [selectedMovieId, startTime, isEdit, setValue]);

 const onSubmit = async (data) => {
  setSubmitting(true);
  try {
    // Helper to append seconds if missing
    const appendSecondsIfNeeded = (dtStr) => {
      if (dtStr.endsWith(':')) {  // e.g., '19:35' ends with ':'
        return dtStr + '00';
      }
      return dtStr;  // Already has :ss (e.g., '20:06:00')
    };

    const showData = {
      movieId: data.movieId,
      screenId: data.screenId,
      startTime: new Date(appendSecondsIfNeeded(data.startTime)),
      endTime: new Date(appendSecondsIfNeeded(data.endTime)),
      showType: data.showType,
      standardBasePrice: parseFloat(data.standardBasePrice),
      premiumBasePrice: parseFloat(data.premiumBasePrice),
      demandFactor: parseFloat(data.demandFactor),
      timeFactor: parseFloat(data.timeFactor),
    };

    console.log('API Payload:', showData);  // ADD: Log transformed data for debug

    if (isEdit) {
      await updateShow(id, showData);
      toast.success('Show updated successfully!');
      setTimeout(() => navigate('/admin/shows'), 1500);
    } else {
      await addShow(showData);
      toast.success('Show scheduled successfully!');
      setTimeout(() => navigate('/admin/shows/list'), 1500);
    }
  } catch (err) {
    console.error('Submit error details:', err.response?.data);  // ADD: Log exact backend message
    toast.error(err.response?.data?.message || err.error || 'Failed to save show');
  } finally {
    setSubmitting(false);
  }
};

  if (loading) return <div className="text-[#6B7280]">Loading show...</div>;

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
                <i className="fas fa-calendar-alt text-white text-2xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-[#2E2E2E] mb-2">
                {isEdit ? 'Edit Show Schedule' : 'Schedule New Show'}
              </h2>
              <p className="text-[#6B7280] text-sm">Fill in the details below</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Movie & Screen Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-[#6B7280] text-sm font-medium mb-2">Movie</label>
                  <select
                    {...register('movieId', { required: 'Movie is required' })}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                      errors.movieId ? 'border-red-500 focus:ring-red-500' : 'border-[#E5E7EB] focus:ring-[#16A34A]'
                    }`}
                  >
                    <option value="">Select Movie</option>
                    {movies.map((movie) => (
                      <option key={movie._id} value={movie._id}>
                        {movie.title} ({movie.duration} min)
                      </option>
                    ))}
                  </select>
                  {errors.movieId && <p className="mt-1 text-red-600 text-xs">{errors.movieId.message}</p>}
                </div>
                <div className="relative">
                  <label className="block text-[#6B7280] text-sm font-medium mb-2">Screen</label>
                  <select
                    {...register('screenId', { required: 'Screen is required' })}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                      errors.screenId ? 'border-red-500 focus:ring-red-500' : 'border-[#E5E7EB] focus:ring-[#16A34A]'
                    }`}
                  >
                    <option value="">Select Movie</option>
                    {screens.map((screen) => (
                      <option key={screen._id} value={screen._id}>
                        {screen.name} ({screen.theaterId?.name || 'Unknown Theater'}) - {screen.totalSeats || 0} seats
                      </option>
                    ))}
                  </select>
                  {errors.screenId && <p className="mt-1 text-red-600 text-xs">{errors.screenId.message}</p>}
                </div>
              </div>

              {/* Start Time & End Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-[#6B7280] text-sm font-medium mb-2">Start Time</label>
                  <input
                    type="datetime-local"
                    {...register('startTime', { required: 'Start time is required' })}
                    className={`w-full p-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A34A] ${
                      errors.startTime ? 'border-red-500 focus:ring-red-500' : ''
                    }`}
                  />
                  {errors.startTime && <p className="mt-1 text-red-600 text-xs">{errors.startTime.message}</p>}
                </div>
                <div className="relative">
                  <label className="block text-[#6B7280] text-sm font-medium mb-2">End Time</label>
                  <input
                    type="datetime-local"
                    {...register('endTime', { required: 'End time is required', validate: (value, formValues) => value > formValues.startTime || 'End time must be after start time' })}
                    className={`w-full p-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A34A] ${
                      errors.endTime ? 'border-red-500 focus:ring-red-500' : ''
                    }`}
                  />
                  {errors.endTime && <p className="mt-1 text-red-600 text-xs">{errors.endTime.message}</p>}
                  <p className="text-xs text-[#6B7280] mt-1">{isEdit ? '' : 'Auto-calculated based on movie duration'}</p>
                </div>
              </div>

              {/* Show Type & Standard Base Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-[#6B7280] text-sm font-medium mb-2">Show Type</label>
                  <select
                    {...register('showType', { required: 'Show type is required' })}
                    className="w-full p-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                  >
                    <option value="Regular">Regular</option>
                    <option value="Special">Special</option>
                  </select>
                  {errors.showType && <p className="mt-1 text-red-600 text-xs">{errors.showType.message}</p>}
                </div>
                <div className="relative">
                  <label className="block text-[#6B7280] text-sm font-medium mb-2">Standard Base Price</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    {...register('standardBasePrice', { required: 'Standard base price is required', min: 0 })}
                    className={`w-full p-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A34A] ${
                      errors.standardBasePrice ? 'border-red-500 focus:ring-red-500' : ''
                    }`}
                    placeholder="e.g., 200"
                  />
                  {errors.standardBasePrice && <p className="mt-1 text-red-600 text-xs">{errors.standardBasePrice.message}</p>}
                </div>
              </div>

              {/* Premium Base Price & Demand Factor */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-[#6B7280] text-sm font-medium mb-2">Premium Base Price</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    {...register('premiumBasePrice', { required: 'Premium base price is required', min: 0 })}
                    className={`w-full p-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A34A] ${
                      errors.premiumBasePrice ? 'border-red-500 focus:ring-red-500' : ''
                    }`}
                    placeholder="e.g., 300"
                  />
                  {errors.premiumBasePrice && <p className="mt-1 text-red-600 text-xs">{errors.premiumBasePrice.message}</p>}
                </div>
                <div className="relative">
                  <label className="block text-[#6B7280] text-sm font-medium mb-2">Demand Factor (alpha)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    {...register('demandFactor', { required: 'Demand factor is required', min: 0, max: 1 })}
                    className={`w-full p-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A34A] ${
                      errors.demandFactor ? 'border-red-500 focus:ring-red-500' : ''
                    }`}
                    placeholder="e.g., 0.1"
                  />
                  {errors.demandFactor && <p className="mt-1 text-red-600 text-xs">{errors.demandFactor.message}</p>}
                  <p className="text-xs text-[#6B7280] mt-1">0-1 scale for dynamic pricing</p>
                </div>
              </div>

              {/* Time Factor */}
              <div className="relative">
                <label className="block text-[#6B7280] text-sm font-medium mb-2">Time Factor (beta)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  {...register('timeFactor', { required: 'Time factor is required', min: 0, max: 1 })}
                  className={`w-full p-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A34A] ${
                    errors.timeFactor ? 'border-red-500 focus:ring-red-500' : ''
                  }`}
                  placeholder="e.g., 0.05"
                />
                {errors.timeFactor && <p className="mt-1 text-red-600 text-xs">{errors.timeFactor.message}</p>}
                <p className="text-xs text-[#6B7280] mt-1">0-1 scale for dynamic pricing</p>
                {rationale && <p className="text-xs text-[#6B7280] mt-1 italic">{rationale}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || submitting}
                className="w-full bg-gradient-to-r from-[#16A34A] to-[#22C55E] text-white py-3 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl hover:from-[#065F46] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
              >
                {isSubmitting || submitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save mr-2"></i>
                    {isEdit ? 'Update Schedule' : 'Schedule Show'}
                  </>
                )}
              </button>
            </form>
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => navigate('/admin/shows')}
                className="text-[#6B7280] hover:text-[#16A34A] text-sm font-medium transition-colors duration-200"
              >
                ← Back to Shows
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ScheduleShow;