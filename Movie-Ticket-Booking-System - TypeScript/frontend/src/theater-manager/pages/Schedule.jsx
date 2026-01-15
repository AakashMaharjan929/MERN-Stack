// Schedule.jsx - Theater Manager - Schedule/Edit Show Form
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { 
  addShow, 
  updateShow, 
  getShowById, 
  getAllMovies, 
  getMyScreens,
  suggestFactors 
} from '../api/theaterManagerAPI';

// Helper to validate ObjectId
const isValidObjectId = (str) => /^[0-9a-fA-F]{24}$/.test(str);

// Format Date to local 'YYYY-MM-DDTHH:mm:ss'
const formatToLocalDateTime = (date) => {
  if (!date || isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

const Schedule = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [movies, setMovies] = useState([]);
  const [screens, setScreens] = useState([]);
  const [showStatus, setShowStatus] = useState('');
  const [rationale, setRationale] = useState('');

  const { register, handleSubmit, formState: { errors }, setValue, control } = useForm({
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

  const selectedMovieId = useWatch({ control, name: 'movieId' });
  const startTime = useWatch({ control, name: 'startTime' });

  // Determine if form is editable
  const isEditable = !isEdit || showStatus === 'Upcoming';

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [moviesRes, screensRes] = await Promise.all([
          getAllMovies(),
          getMyScreens(),
        ]);
        
        // Handle different response structures
        setMovies(moviesRes.movies || moviesRes.data?.movies || moviesRes.data || moviesRes || []);
        setScreens(screensRes.screens || screensRes.data?.screens || screensRes.data || screensRes || []);

        if (isEdit) {
          if (!isValidObjectId(id)) {
            toast.error('Invalid show ID format');
            navigate('/theater-manager/shows');
            return;
          }

          const showRes = await getShowById(id);
          const show = showRes.data || showRes;
          setShowStatus(show.status);

          setValue('movieId', show.movieId?._id || show.movieId);
          setValue('screenId', show.screenId?._id || show.screenId);
          setValue('startTime', formatToLocalDateTime(new Date(show.startTime)));
          setValue('endTime', formatToLocalDateTime(new Date(show.endTime)));
          setValue('showType', show.showType);
          setValue('standardBasePrice', show.pricingRules?.standardBasePrice || show.pricingRules?.basePrice || '');
          setValue('premiumBasePrice', show.pricingRules?.premiumBasePrice || '');
          setValue('demandFactor', show.pricingRules?.alpha || 0.1);
          setValue('timeFactor', show.pricingRules?.beta || 0.05);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        toast.error(isEdit ? 'Failed to load show' : 'Failed to load movies or screens');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id, isEdit, setValue, navigate]);

  // Auto-calculate endTime from movie duration
  useEffect(() => {
    if (selectedMovieId && startTime && !isEdit) {
      const selectedMovie = movies.find(m => m._id === selectedMovieId);
      if (selectedMovie && selectedMovie.duration) {
        const start = new Date(startTime);
        const durationMs = parseInt(selectedMovie.duration) * 60 * 1000;
        const end = new Date(start.getTime() + durationMs);
        setValue('endTime', formatToLocalDateTime(end));
      }
    }
  }, [selectedMovieId, startTime, movies, setValue, isEdit]);

  // Auto-suggest factors
  useEffect(() => {
    if (selectedMovieId && startTime && !isEdit) {
      if (!isValidObjectId(selectedMovieId)) return;

      const fetchSuggestions = async () => {
        try {
          const fullStartTime = startTime.endsWith(':') ? startTime + '00' : startTime;
          const response = await suggestFactors(selectedMovieId, fullStartTime);
          const { suggestedAlpha, suggestedBeta, rationale } = response.data;
          setValue('demandFactor', suggestedAlpha);
          setValue('timeFactor', suggestedBeta);
          setRationale(rationale);
          toast.success('Suggested factors applied!');
        } catch (err) {
          setRationale('');
          // Don't show error toast for suggest factors, it's optional
        }
      };
      fetchSuggestions();
    }
  }, [selectedMovieId, startTime, isEdit, setValue]);

  const onSubmit = async (data) => {
    // Block edit if show is not Upcoming
    if (isEdit && showStatus !== 'Upcoming') {
      toast.error('Cannot modify a Live or Completed show');
      return;
    }

    setSubmitting(true);
    try {
      const appendSecondsIfNeeded = (dtStr) => {
        return dtStr.length === 16 ? dtStr + ':00' : dtStr;
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

      if (isEdit) {
        await updateShow(id, showData);
        toast.success('Show updated successfully!');
      } else {
        await addShow(showData);
        toast.success('Show scheduled successfully!');
      }
      setTimeout(() => navigate('/theater-manager/shows'), 1500);
    } catch (err) {
      console.error('Submit error:', err.response?.data);
      toast.error(err.response?.data?.message || 'Failed to save show');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-gray-600 text-center py-10">Loading...</div>;

  return (
    <>
      <Toaster position="top-right" toastOptions={{
        duration: 4000,
        style: { background: '#fff', color: '#2E2E2E', border: '1px solid #E5E7EB' },
        success: { style: { background: '#F0FDF4', color: '#065F46' } },
        error: { style: { background: '#FEF2F2', color: '#991B1B' } },
      }} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-6 md:p-8">
          <div className="text-center mb-6 md:mb-8">
            <div className="mx-auto h-16 w-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
              <i className="fas fa-calendar-alt text-white text-2xl"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {isEdit ? 'Edit Show Schedule' : 'Schedule New Show'}
            </h2>
            <p className="text-gray-600 text-sm">Fill in the details below</p>
          </div>

          {/* Current Status Badge - Edit Mode Only */}
          {isEdit && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Current Status:</span>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  showStatus === 'Upcoming' ? 'bg-blue-100 text-blue-800' :
                  showStatus === 'Active' ? 'bg-green-100 text-green-800' :
                  showStatus === 'Completed' ? 'bg-gray-100 text-gray-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {showStatus || 'Unknown'}
                </span>
              </div>
              {!isEditable && (
                <p className="text-xs text-amber-700 mt-2">
                  This show is {showStatus.toLowerCase()} and cannot be modified.
                </p>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Movie & Screen */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Movie</label>
                <select
                  {...register('movieId', { required: 'Movie is required' })}
                  disabled={!isEditable}
                  className={`w-full px-4 py-3 border rounded-lg transition-all ${
                    !isEditable
                      ? 'bg-gray-100 border-gray-300 cursor-not-allowed'
                      : errors.movieId
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500'
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

              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Screen</label>
                <select
                  {...register('screenId', { required: 'Screen is required' })}
                  disabled={!isEditable}
                  className={`w-full px-4 py-3 border rounded-lg transition-all ${
                    !isEditable
                      ? 'bg-gray-100 border-gray-300 cursor-not-allowed'
                      : errors.screenId
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500'
                  }`}
                >
                  <option value="">Select Screen</option>
                  {screens.map((screen) => (
                    <option key={screen._id} value={screen._id}>
                      {screen.name} - {screen.totalSeats || screen.seats?.length || 0} seats
                    </option>
                  ))}
                </select>
                {errors.screenId && <p className="mt-1 text-red-600 text-xs">{errors.screenId.message}</p>}
              </div>
            </div>

            {/* Start & End Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Start Time</label>
                <input
                  type="datetime-local"
                  {...register('startTime', { required: 'Start time is required' })}
                  disabled={!isEditable}
                  className={`w-full p-3 border rounded-lg ${
                    !isEditable
                      ? 'bg-gray-100 border-gray-300 cursor-not-allowed'
                      : errors.startTime
                      ? 'border-red-500'
                      : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500'
                  }`}
                />
                {errors.startTime && <p className="mt-1 text-red-600 text-xs">{errors.startTime.message}</p>}
              </div>

              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">End Time</label>
                <input
                  type="datetime-local"
                  {...register('endTime', {
                    required: 'End time is required',
                    validate: (value, formValues) => value > formValues.startTime || 'End time must be after start time'
                  })}
                  disabled={!isEditable}
                  className={`w-full p-3 border rounded-lg ${
                    !isEditable
                      ? 'bg-gray-100 border-gray-300 cursor-not-allowed'
                      : errors.endTime
                      ? 'border-red-500'
                      : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500'
                  }`}
                />
                {errors.endTime && <p className="mt-1 text-red-600 text-xs">{errors.endTime.message}</p>}
                {!isEdit && <p className="text-xs text-gray-500 mt-1">Auto-calculated from movie duration</p>}
              </div>
            </div>

            {/* Show Type & Standard Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Show Type</label>
                <select
                  {...register('showType')}
                  disabled={!isEditable}
                  className={`w-full p-3 border rounded-lg ${
                    !isEditable ? 'bg-gray-100 border-gray-300 cursor-not-allowed' : 'border-gray-300 focus:ring-green-500'
                  }`}
                >
                  <option value="Regular">Regular</option>
                  <option value="Special">Special</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Standard Base Price</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('standardBasePrice', { required: 'Required', min: 0 })}
                  disabled={!isEditable}
                  placeholder="e.g., 200"
                  className={`w-full p-3 border rounded-lg ${
                    !isEditable
                      ? 'bg-gray-100 border-gray-300 cursor-not-allowed'
                      : errors.standardBasePrice
                      ? 'border-red-500'
                      : 'border-gray-300 focus:ring-green-500'
                  }`}
                />
                {errors.standardBasePrice && <p className="mt-1 text-red-600 text-xs">{errors.standardBasePrice.message}</p>}
              </div>
            </div>

            {/* Premium Price & Demand Factor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Premium Base Price</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('premiumBasePrice', { required: 'Required', min: 0 })}
                  disabled={!isEditable}
                  placeholder="e.g., 300"
                  className={`w-full p-3 border rounded-lg ${
                    !isEditable
                      ? 'bg-gray-100 border-gray-300 cursor-not-allowed'
                      : errors.premiumBasePrice
                      ? 'border-red-500'
                      : 'border-gray-300 focus:ring-green-500'
                  }`}
                />
                {errors.premiumBasePrice && <p className="mt-1 text-red-600 text-xs">{errors.premiumBasePrice.message}</p>}
              </div>

              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Demand Factor (α)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  {...register('demandFactor', { required: 'Required', min: 0, max: 1 })}
                  disabled={!isEditable}
                  placeholder="e.g., 0.1"
                  className={`w-full p-3 border rounded-lg ${
                    !isEditable
                      ? 'bg-gray-100 border-gray-300 cursor-not-allowed'
                      : errors.demandFactor
                      ? 'border-red-500'
                      : 'border-gray-300 focus:ring-green-500'
                  }`}
                />
                {errors.demandFactor && <p className="mt-1 text-red-600 text-xs">{errors.demandFactor.message}</p>}

              {rationale && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-medium text-blue-800 mb-1">AI Pricing Suggestion</p>
                  <p className="text-xs text-blue-700 italic">{rationale}</p>
                </div>
              )}
              </div>
            </div>

            {/* Time Factor */}
            <div>
              <label className="block text-gray-600 text-sm font-medium mb-2">Time Factor (β)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                {...register('timeFactor', { required: 'Required', min: 0, max: 1 })}
                disabled={!isEditable}
                placeholder="e.g., 0.05"
                className={`w-full p-3 border rounded-lg ${
                  !isEditable
                    ? 'bg-gray-100 border-gray-300 cursor-not-allowed'
                    : errors.timeFactor
                    ? 'border-red-500'
                    : 'border-gray-300 focus:ring-green-500'
                }`}
              />
              {errors.timeFactor && <p className="mt-1 text-red-600 text-xs">{errors.timeFactor.message}</p>}
            </div>

            <button
              type="submit"
              disabled={submitting || !isEditable}
              className={`w-full py-3 rounded-lg font-semibold text-base shadow-md transition-all duration-200 flex items-center justify-center ${
                !isEditable
                  ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                  : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg'
              }`}
            >
              {submitting ? (
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
              onClick={() => navigate('/theater-manager/shows')}
              className="text-gray-600 hover:text-green-600 text-sm font-medium transition-colors"
            >
              ← Back to Shows
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Schedule;
