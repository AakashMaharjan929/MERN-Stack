// AddEditScreen.jsx - Form for adding/editing screens (create in /admin/pages/screens)
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { addScreen, updateScreen, getScreenById } from '../../api/screenAPI'; // Adjust path
import { getAllTheaters } from '../../api/theaterAPI'; // Adjust path

const AddEdit = () => {
  const { id } = useParams(); // For edit mode if id present
  const navigate = useNavigate();
  const isEdit = !!id;
  const [theaters, setTheaters] = useState([]);
  const [loadingTheaters, setLoadingTheaters] = useState(true);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue } = useForm({
    defaultValues: {
      name: '',
      theaterId: '',
      rows: 10, // Default for new layout
      columns: 15,
      defaultType: 'Standard',
    },
    mode: 'onChange',
  });

  // Fetch theaters for dropdown
  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        const data = await getAllTheaters();
        setTheaters(data);
      } catch (err) {
        toast.error('Failed to load theaters');
      } finally {
        setLoadingTheaters(false);
      }
    };
    fetchTheaters();
  }, []);

  // Fetch screen for edit
  useEffect(() => {
    if (isEdit) {
      const fetchScreen = async () => {
        try {
          const screen = await getScreenById(id);
          setValue('name', screen.name);
          setValue('theaterId', screen.theaterId._id);
          // For layout, redirect to editor or simplify; here, show totals
          toast.info('Edit layout in Seat Layout Editor');
        } catch (err) {
          toast.error('Failed to load screen');
        }
      };
      fetchScreen();
    }
  }, [id, isEdit, setValue]);

  const onSubmit = async (data) => {
    // Generate basic seat layout (e.g., all Standard)
    console.log(data);
    const seatLayout = [];
    for (let row = 0; row < parseInt(data.rows); row++) {
      const rowSeats = [];
      for (let col = 0; col < parseInt(data.columns); col++) {
        const seatNumber = `${String.fromCharCode(65 + row)}${col + 1}`; // e.g., A1, B2
        rowSeats.push({ seatNumber, type: data.defaultType });
      }
      seatLayout.push(rowSeats);
    }

    const submitData = {
      name: data.name,
      theaterId: data.theaterId,
      seatLayout,
    };

    try {
      if (isEdit) {
        await updateScreen(id, submitData);
        toast.success('Screen updated successfully!');
      } else {
        await addScreen(submitData);
        toast.success('Screen added successfully!');
      }
      setTimeout(() => navigate('/admin/screens/list'), 1500); // Delay for toast
    } catch (err) {
      toast.error(err.error || 'Failed to save screen');
    }
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
      <div className="flex justify-center items-start min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-[#F5F6FA]">
        <div className="max-w-2xl w-full space-y-8">
          <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8 border border-[#E5E7EB]/50">
            <div className="text-center mb-6 md:mb-8">
              <div className="mx-auto h-16 w-16 bg-gradient-to-r from-[#16A34A] to-[#22C55E] rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-tv text-white text-2xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-[#2E2E2E] mb-2">
                {isEdit ? 'Edit Screen' : 'Add New Screen'}
              </h2>
              <p className="text-[#6B7280] text-sm">Fill in the details below</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <div className="relative">
                <label className="block text-[#6B7280] text-sm font-medium mb-2">Screen Name</label>
                <div className="relative">
                  <i className="fas fa-tv absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] text-sm"></i>
                  <input
                    {...register('name', { required: 'Screen name is required' })}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                      errors.name ? 'border-red-500 focus:ring-red-500' : 'border-[#E5E7EB] focus:ring-[#16A34A]'
                    }`}
                    placeholder="e.g., Auditorium A"
                  />
                  {errors.name && <p className="mt-1 text-red-600 text-xs">{errors.name.message}</p>}
                </div>
              </div>
              {/* Theater Select */}
              <div className="relative">
                <label className="block text-[#6B7280] text-sm font-medium mb-2">Theater</label>
                <div className="relative">
                  <i className="fas fa-building absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] text-sm"></i>
                  <select
                    {...register('theaterId', { required: 'Theater is required' })}
                    disabled={loadingTheaters}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 appearance-none bg-white ${
                      errors.theaterId ? 'border-red-500 focus:ring-red-500' : 'border-[#E5E7EB] focus:ring-[#16A34A]'
                    }`}
                  >
                    <option value="">Select Theater</option>
                    {theaters.map((theater) => (
                      <option key={theater._id} value={theater._id}>
                        {theater.name} - {theater.fullAddress}
                      </option>
                    ))}
                  </select>
                  {errors.theaterId && <p className="mt-1 text-red-600 text-xs">{errors.theaterId.message}</p>}
                </div>
              </div>
              {/* Basic Layout Setup (for new; edit redirects to editor) */}
              {!isEdit && (
                <div>
                  <label className="block text-[#6B7280] text-sm font-medium mb-2">Initial Seat Layout</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                      <label className="block text-[#6B7280] text-xs mb-1">Rows</label>
                      <input
                        type="number"
                        {...register('rows', { required: 'Rows required', min: 1, max: 50 })}
                        className={`w-full p-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A34A] ${
                          errors.rows ? 'border-red-500 focus:ring-red-500' : ''
                        }`}
                        placeholder="e.g., 10"
                      />
                      {errors.rows && <p className="mt-1 text-red-600 text-xs">{errors.rows.message}</p>}
                    </div>
                    <div className="relative">
                      <label className="block text-[#6B7280] text-xs mb-1">Columns</label>
                      <input
                        type="number"
                        {...register('columns', { required: 'Columns required', min: 1, max: 30 })}
                        className={`w-full p-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A34A] ${
                          errors.columns ? 'border-red-500 focus:ring-red-500' : ''
                        }`}
                        placeholder="e.g., 15"
                      />
                      {errors.columns && <p className="mt-1 text-red-600 text-xs">{errors.columns.message}</p>}
                    </div>
                    <div className="relative">
                      <label className="block text-[#6B7280] text-xs mb-1">Default Type</label>
                      <select
                        {...register('defaultType', { required: 'Type required' })}
                        className={`w-full p-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A34A] ${
                          errors.defaultType ? 'border-red-500 focus:ring-red-500' : ''
                        }`}
                      >
                        <option value="Standard">Standard</option>
                        <option value="Premium">Premium</option>
                      </select>
                      {errors.defaultType && <p className="mt-1 text-red-600 text-xs">{errors.defaultType.message}</p>}
                    </div>
                  </div>
                  <p className="text-[#6B7280] text-xs mt-2">Layout can be edited later in Seat Layout Editor</p>
                </div>
              )}
              <button
                type="submit"
                disabled={isSubmitting || loadingTheaters}
                className="w-full bg-gradient-to-r from-[#16A34A] to-[#22C55E] text-white py-3 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl hover:from-[#065F46] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save mr-2"></i>
                    {isEdit ? 'Update Screen' : 'Add Screen'}
                  </>
                )}
              </button>
            </form>
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => navigate('/admin/screens')}
                className="text-[#6B7280] hover:text-[#16A34A] text-sm font-medium transition-colors duration-200"
              >
                ← Back to Screens
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddEdit;