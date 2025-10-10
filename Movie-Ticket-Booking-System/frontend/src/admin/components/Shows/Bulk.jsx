// Bulk.jsx - Form for bulk scheduling shows (create in /admin/components/Shows)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { bulkCreateShows } from '../../api/showAPI';
import { getAllMovies } from '../../api/movieAPI';
import { getAllScreens } from '../../api/screenAPI';

// Helper to append seconds if missing
const appendSecondsIfNeeded = (dtStr) => {
  if (dtStr.endsWith(':')) {  // e.g., '19:35' ends with ':'
    return dtStr + '00';
  }
  return dtStr;  // Already has :ss (e.g., '20:06:00')
};

const BulkSchedule = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [movies, setMovies] = useState([]);
  const [screens, setScreens] = useState([]);

  const { register, handleSubmit, control, formState: { errors }, getValues } = useForm({
    defaultValues: {
      shows: [{
        movieId: '',
        screenId: '',
        startTime: '',
        endTime: '',
        showType: 'Regular',
        standardBasePrice: '',
        premiumBasePrice: '',
        demandFactor: 0.1,
        timeFactor: 0.05,
      }]
    },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'shows',
  });

  // Fetch all data (movies, screens)
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
      } catch (err) {
        toast.error('Failed to load movies or screens');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const showDataArray = data.shows.map((show, index) => {
        const startTimeStr = appendSecondsIfNeeded(show.startTime);
        const endTimeStr = appendSecondsIfNeeded(show.endTime);
        return {
          movieId: show.movieId,
          screenId: show.screenId,
          startTime: new Date(startTimeStr),
          endTime: new Date(endTimeStr),
          showType: show.showType,
          standardBasePrice: parseFloat(show.standardBasePrice),
          premiumBasePrice: parseFloat(show.premiumBasePrice),
          demandFactor: parseFloat(show.demandFactor),
          timeFactor: parseFloat(show.timeFactor),
        };
      });

      console.log('Bulk API Payload:', showDataArray);  // Debug log

      await bulkCreateShows(showDataArray);
      toast.success('Shows scheduled successfully!');
      navigate('/admin/shows');
    } catch (err) {
      console.error('Bulk submit error details:', err.response?.data);  // Debug log
      toast.error(err.response?.data?.message || err.error || 'Failed to bulk schedule shows');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-[#6B7280]">Loading data...</div>;

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
        <div className="max-w-6xl w-full space-y-8">
          <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8 border border-[#E5E7EB]/50">
            <div className="text-center mb-6 md:mb-8">
              <div className="mx-auto h-16 w-16 bg-gradient-to-r from-[#16A34A] to-[#22C55E] rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-calendar-plus text-white text-2xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-[#2E2E2E] mb-2">
                Bulk Schedule Shows
              </h2>
              <p className="text-[#6B7280] text-sm">Add multiple shows below</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {fields.map((field, index) => (
                <div key={field.id} className="border border-[#E5E7EB]/50 rounded-xl p-6 space-y-4 bg-gray-50/50">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-[#2E2E2E]">Show {index + 1}</h3>
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  {/* Movie & Screen Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <label className="block text-[#6B7280] text-sm font-medium mb-2">Movie</label>
                      <select
                        {...register(`shows.${index}.movieId`, { required: 'Movie is required' })}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                          errors.shows?.[index]?.movieId ? 'border-red-500 focus:ring-red-500' : 'border-[#E5E7EB] focus:ring-[#16A34A]'
                        }`}
                      >
                        <option value="">Select Movie</option>
                        {movies.map((movie) => (
                          <option key={movie._id} value={movie._id}>
                            {movie.title} ({movie.duration} min)
                          </option>
                        ))}
                      </select>
                      {errors.shows?.[index]?.movieId && <p className="mt-1 text-red-600 text-xs">{errors.shows[index].movieId.message}</p>}
                    </div>
                    <div className="relative">
                      <label className="block text-[#6B7280] text-sm font-medium mb-2">Screen</label>
                      <select
                        {...register(`shows.${index}.screenId`, { required: 'Screen is required' })}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                          errors.shows?.[index]?.screenId ? 'border-red-500 focus:ring-red-500' : 'border-[#E5E7EB] focus:ring-[#16A34A]'
                        }`}
                      >
                        <option value="">Select Screen</option>
                        {screens.map((screen) => (
                          <option key={screen._id} value={screen._id}>
                            {screen.name} ({screen.theaterId?.name || 'Unknown Theater'}) - {screen.totalSeats || 0} seats
                          </option>
                        ))}
                      </select>
                      {errors.shows?.[index]?.screenId && <p className="mt-1 text-red-600 text-xs">{errors.shows[index].screenId.message}</p>}
                    </div>
                  </div>

                  {/* Start Time & End Time */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <label className="block text-[#6B7280] text-sm font-medium mb-2">Start Time</label>
                      <input
                        type="datetime-local"
                        {...register(`shows.${index}.startTime`, { 
                          required: 'Start time is required' 
                        })}
                        className={`w-full p-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A34A] ${
                          errors.shows?.[index]?.startTime ? 'border-red-500 focus:ring-red-500' : ''
                        }`}
                      />
                      {errors.shows?.[index]?.startTime && <p className="mt-1 text-red-600 text-xs">{errors.shows[index].startTime.message}</p>}
                    </div>
                    <div className="relative">
                      <label className="block text-[#6B7280] text-sm font-medium mb-2">End Time</label>
                      <input
                        type="datetime-local"
                        {...register(`shows.${index}.endTime`, { 
                          required: 'End time is required',
                          validate: (value) => {
                            const formValues = getValues();
                            const startTime = formValues.shows[index].startTime;
                            return new Date(value) > new Date(startTime) || 'End time must be after start time';
                          }
                        })}
                        className={`w-full p-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A34A] ${
                          errors.shows?.[index]?.endTime ? 'border-red-500 focus:ring-red-500' : ''
                        }`}
                      />
                      {errors.shows?.[index]?.endTime && <p className="mt-1 text-red-600 text-xs">{errors.shows[index].endTime.message}</p>}
                    </div>
                  </div>

                  {/* Show Type & Standard Base Price */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <label className="block text-[#6B7280] text-sm font-medium mb-2">Show Type</label>
                      <select
                        {...register(`shows.${index}.showType`, { required: 'Show type is required' })}
                        className={`w-full p-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A34A] ${
                          errors.shows?.[index]?.showType ? 'border-red-500 focus:ring-red-500' : ''
                        }`}
                      >
                        <option value="Regular">Regular</option>
                        <option value="Special">Special</option>
                      </select>
                      {errors.shows?.[index]?.showType && <p className="mt-1 text-red-600 text-xs">{errors.shows[index].showType.message}</p>}
                    </div>
                    <div className="relative">
                      <label className="block text-[#6B7280] text-sm font-medium mb-2">Standard Base Price</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        {...register(`shows.${index}.standardBasePrice`, { 
                          required: 'Standard base price is required', 
                          min: { value: 0, message: 'Must be positive' }
                        })}
                        className={`w-full p-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A34A] ${
                          errors.shows?.[index]?.standardBasePrice ? 'border-red-500 focus:ring-red-500' : ''
                        }`}
                        placeholder="e.g., 200"
                      />
                      {errors.shows?.[index]?.standardBasePrice && <p className="mt-1 text-red-600 text-xs">{errors.shows[index].standardBasePrice.message}</p>}
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
                        {...register(`shows.${index}.premiumBasePrice`, { 
                          required: 'Premium base price is required', 
                          min: { value: 0, message: 'Must be positive' }
                        })}
                        className={`w-full p-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A34A] ${
                          errors.shows?.[index]?.premiumBasePrice ? 'border-red-500 focus:ring-red-500' : ''
                        }`}
                        placeholder="e.g., 300"
                      />
                      {errors.shows?.[index]?.premiumBasePrice && <p className="mt-1 text-red-600 text-xs">{errors.shows[index].premiumBasePrice.message}</p>}
                    </div>
                    <div className="relative">
                      <label className="block text-[#6B7280] text-sm font-medium mb-2">Demand Factor (alpha)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="1"
                        {...register(`shows.${index}.demandFactor`, { 
                          required: 'Demand factor is required', 
                          min: { value: 0, message: 'Must be 0 or more' },
                          max: { value: 1, message: 'Must be 1 or less' }
                        })}
                        className={`w-full p-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A34A] ${
                          errors.shows?.[index]?.demandFactor ? 'border-red-500 focus:ring-red-500' : ''
                        }`}
                        placeholder="e.g., 0.1"
                      />
                      {errors.shows?.[index]?.demandFactor && <p className="mt-1 text-red-600 text-xs">{errors.shows[index].demandFactor.message}</p>}
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
                      {...register(`shows.${index}.timeFactor`, { 
                        required: 'Time factor is required', 
                        min: { value: 0, message: 'Must be 0 or more' },
                        max: { value: 1, message: 'Must be 1 or less' }
                      })}
                      className={`w-full p-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A34A] ${
                        errors.shows?.[index]?.timeFactor ? 'border-red-500 focus:ring-red-500' : ''
                      }`}
                      placeholder="e.g., 0.05"
                    />
                    {errors.shows?.[index]?.timeFactor && <p className="mt-1 text-red-600 text-xs">{errors.shows[index].timeFactor.message}</p>}
                    <p className="text-xs text-[#6B7280] mt-1">0-1 scale for dynamic pricing</p>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => append({
                  movieId: '',
                  screenId: '',
                  startTime: '',
                  endTime: '',
                  showType: 'Regular',
                  standardBasePrice: '',
                  premiumBasePrice: '',
                  demandFactor: 0.1,
                  timeFactor: 0.05,
                })}
                className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold text-base hover:bg-blue-600 transition-all duration-200 flex items-center justify-center"
              >
                <i className="fas fa-plus mr-2"></i>
                Add Another Show
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-[#16A34A] to-[#22C55E] text-white py-3 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
              >
                {submitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Scheduling...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save mr-2"></i>
                    Bulk Schedule Shows
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

export default BulkSchedule;