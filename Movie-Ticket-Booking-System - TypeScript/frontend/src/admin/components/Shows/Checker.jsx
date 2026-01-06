// Checker.jsx - Updated to match backend response structure ({ movie, time })
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { checkConflicts } from '../../api/showAPI';
import { getAllScreens } from '../../api/screenAPI';

// Helper to append seconds if missing
const appendSecondsIfNeeded = (dtStr) => {
  if (dtStr.endsWith(':')) {  // e.g., '19:35' ends with ':'
    return dtStr + '00';
  }
  return dtStr;  // Already has :ss (e.g., '20:06:00')
};

// Helper to split and format time string from backend (e.g., "6:00:00 PM - 8:00:00 PM")
const parseTimeString = (timeStr) => {
  if (!timeStr) return { start: 'Invalid Time', end: 'Invalid Time' };
  const [startTime, endTime] = timeStr.split(' - ').map(t => t.trim());
  return { start: startTime || 'Invalid Time', end: endTime || 'Invalid Time' };
};

const Checker = () => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(false);
  const [conflicts, setConflicts] = useState([]);
  const [screens, setScreens] = useState([]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      screenId: '',
      startTime: '',
      endTime: '',
    },
    mode: 'onChange',
  });

  // Fetch screens on mount
  React.useEffect(() => {
    const fetchScreens = async () => {
      try {
        const screensRes = await getAllScreens();
        setScreens(Array.isArray(screensRes) ? screensRes : []);
      } catch (err) {
        toast.error('Failed to load screens');
      }
    };
    fetchScreens();
  }, []);

  const onSubmit = async (data) => {
    setChecking(true);
    setConflicts([]); // Clear previous
    try {
      const startTimeStr = appendSecondsIfNeeded(data.startTime);
      const endTimeStr = appendSecondsIfNeeded(data.endTime);

      const response = await checkConflicts(data.screenId, startTimeStr, endTimeStr);
      console.log('Full conflicts response:', response); // Debug log

      const rawConflicts = response.conflicts || [];
      // No need for extra fetching; backend already populates movie title as 'movie'
      // Map to include parsed times for table
      const parsedConflicts = rawConflicts.map(conflict => ({
        ...conflict,
        ...parseTimeString(conflict.time),
      }));
      setConflicts(parsedConflicts);

      if (parsedConflicts.length > 0) {
        toast.error(`Found ${parsedConflicts.length} conflicting show(s)`);
      } else {
        toast.success('No conflicts found!');
      }
    } catch (err) {
      console.error('Conflict check error:', err.response?.data);
      setConflicts([]);
      toast.error(err.response?.data?.message || 'Failed to check conflicts');
    } finally {
      setChecking(false);
    }
  };

  const clearResults = () => {
    setConflicts([]);
    reset();
  };

  if (screens.length === 0) {
    return <div className="text-[#6B7280]">Loading screens...</div>;
  }

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
                <i className="fas fa-exclamation-triangle text-white text-2xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-[#2E2E2E] mb-2">
                Check Show Conflicts
              </h2>
              <p className="text-[#6B7280] text-sm">Verify if your proposed show overlaps with existing schedules</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Screen Selection */}
              <div className="relative">
                <label className="block text-[#6B7280] text-sm font-medium mb-2">Screen</label>
                <select
                  {...register('screenId', { required: 'Screen is required' })}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                    errors.screenId ? 'border-red-500 focus:ring-red-500' : 'border-[#E5E7EB] focus:ring-[#16A34A]'
                  }`}
                >
                  <option value="">Select Screen</option>
                  {screens.map((screen) => (
                    <option key={screen._id} value={screen._id}>
                      {screen.name} ({screen.theaterId?.name || 'Unknown Theater'}) - {screen.totalSeats || 0} seats
                    </option>
                  ))}
                </select>
                {errors.screenId && <p className="mt-1 text-red-600 text-xs">{errors.screenId.message}</p>}
              </div>

              {/* Start Time & End Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-[#6B7280] text-sm font-medium mb-2">Proposed Start Time</label>
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
                  <label className="block text-[#6B7280] text-sm font-medium mb-2">Proposed End Time</label>
                  <input
                    type="datetime-local"
                    {...register('endTime', { 
                      required: 'End time is required',
                      validate: (value, formValues) => value > formValues.startTime || 'End time must be after start time'
                    })}
                    className={`w-full p-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A34A] ${
                      errors.endTime ? 'border-red-500 focus:ring-red-500' : ''
                    }`}
                  />
                  {errors.endTime && <p className="mt-1 text-red-600 text-xs">{errors.endTime.message}</p>}
                </div>
              </div>

              <button
                type="submit"
                disabled={checking}
                className="w-full bg-gradient-to-r from-[#16A34A] to-[#22C55E] text-white py-3 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
              >
                {checking ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Checking...
                  </>
                ) : (
                  <>
                    <i className="fas fa-search mr-2"></i>
                    Check for Conflicts
                  </>
                )}
              </button>
            </form>

            {/* Results Display */}
            {conflicts.length > 0 && (
              <div className="mt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-red-600">Conflicting Shows ({conflicts.length})</h3>
                  <button
                    type="button"
                    onClick={clearResults}
                    className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
                  >
                    Clear
                  </button>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 overflow-x-auto">
                  <table className="min-w-full divide-y divide-red-200">
                    <thead className="bg-red-100">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-red-900 uppercase tracking-wider">Movie</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-red-900 uppercase tracking-wider">Start Time</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-red-900 uppercase tracking-wider">End Time</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-red-200">
                      {conflicts.map((conflict, index) => (
                        <tr key={index} className="hover:bg-red-50">
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-red-900">
                            {conflict.movie || 'Unknown Movie'}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-red-900">
                            {conflict.start || 'Invalid Time'}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-red-900">
                            {conflict.end || 'Invalid Time'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

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

export default Checker;