// Updated AddEditTheater.jsx - Delayed navigation to allow toast visibility
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form'; // Install: npm i react-hook-form
import toast, { Toaster } from 'react-hot-toast'; // Already installed
import { addTheater, updateTheater, getTheaterById } from '../../api/theaterAPI'; // Adjust path

const AddEditTheater = () => {
  const { id } = useParams(); // For edit mode if id present
  const navigate = useNavigate();
  const isEdit = !!id;

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue } = useForm({
    defaultValues: {
      name: '',
      'location.street': '',
      'location.locality': '',
      'location.city': '',
      'location.state': '',
      'location.country': 'Nepal',
    },
    mode: 'onChange', // Validate on change for real-time feedback
  });

  // Fetch theater for edit
  useEffect(() => {
    if (isEdit) {
      const fetchTheater = async () => {
        try {
          const theater = await getTheaterById(id);
          setValue('name', theater.name);
          setValue('location.street', theater.location.street);
          setValue('location.locality', theater.location.locality || '');
          setValue('location.city', theater.location.city);
          setValue('location.state', theater.location.state);
          setValue('location.country', theater.location.country);
        } catch (err) {
          toast.error('Failed to load theater');
        }
      };
      fetchTheater();
    }
  }, [id, isEdit, setValue]);

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await updateTheater(id, { name: data.name, location: data.location });
        toast.success('Theater updated successfully!');
      } else {
        await addTheater({ name: data.name, location: data.location });
        toast.success('Theater added successfully!');
      }
      // Delay navigation to show toast
      setTimeout(() => {
        navigate('/admin/theaters/list');
      }, 1500); // 1.5s delay for toast visibility
    } catch (err) {
      toast.error(err.error || 'Failed to save theater');
    }
  };

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#2E2E2E',
            border: '1px solid #E5E7EB',
          },
          success: { style: { background: '#F0FDF4', color: '#065F46' } },
          error: { style: { background: '#FEF2F2', color: '#991B1B' } },
        }}
      />
      <div className="flex justify-center items-start min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-[#F5F6FA]">
        <div className="max-w-2xl w-full space-y-8"> {/* Widened for grid */}
          <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8 border border-[#E5E7EB]/50">
            <div className="text-center mb-6 md:mb-8">
              <div className="mx-auto h-16 w-16 bg-gradient-to-r from-[#16A34A] to-[#22C55E] rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-building text-white text-2xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-[#2E2E2E] mb-2">
                {isEdit ? 'Edit Theater' : 'Add New Theater'}
              </h2>
              <p className="text-[#6B7280] text-sm">Fill in the details below</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name - Full width */}
              <div className="relative">
                <label className="block text-[#6B7280] text-sm font-medium mb-2">Theater Name</label>
                <div className="relative">
                  <i className="fas fa-theater-masks absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] text-sm"></i>
                  <input
                    {...register('name', { required: 'Theater name is required' })}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                      errors.name ? 'border-red-500 focus:ring-red-500' : 'border-[#E5E7EB] focus:ring-[#16A34A]'
                    }`}
                    placeholder="e.g., PVR Nexus"
                  />
                  {errors.name && <p className="mt-1 text-red-600 text-xs">{errors.name.message}</p>}
                </div>
              </div>
              {/* Location fields - Grid for pairing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 space-y-6 md:space-y-0">
                {/* Street/Location */}
                <div className="relative">
                  <label className="block text-[#6B7280] text-sm font-medium mb-2">Street/Location</label>
                  <div className="relative">
                    <i className="fas fa-map-marker-alt absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] text-sm"></i>
                    <input
                      {...register('location.street', { required: 'Street is required' })}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                        errors['location.street'] ? 'border-red-500 focus:ring-red-500' : 'border-[#E5E7EB] focus:ring-[#16A34A]'
                      }`}
                      placeholder="e.g., New Road"
                    />
                    {errors['location.street'] && <p className="mt-1 text-red-600 text-xs">{errors['location.street'].message}</p>}
                  </div>
                </div>
                {/* Locality */}
                <div className="relative">
                  <label className="block text-[#6B7280] text-sm font-medium mb-2">Locality (Optional)</label>
                  <div className="relative">
                    <i className="fas fa-home absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] text-sm"></i>
                    <input
                      {...register('location.locality')}
                      className="w-full pl-10 pr-4 py-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent transition-all duration-200"
                      placeholder="e.g., Thamel"
                    />
                  </div>
                </div>
                {/* City */}
                <div className="relative">
                  <label className="block text-[#6B7280] text-sm font-medium mb-2">City</label>
                  <div className="relative">
                    <i className="fas fa-city absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] text-sm"></i>
                    <input
                      {...register('location.city', { required: 'City is required' })}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                        errors['location.city'] ? 'border-red-500 focus:ring-red-500' : 'border-[#E5E7EB] focus:ring-[#16A34A]'
                      }`}
                      placeholder="e.g., Kathmandu"
                    />
                    {errors['location.city'] && <p className="mt-1 text-red-600 text-xs">{errors['location.city'].message}</p>}
                  </div>
                </div>
                {/* State */}
                <div className="relative">
                  <label className="block text-[#6B7280] text-sm font-medium mb-2">State/Province</label>
                  <div className="relative">
                    <i className="fas fa-map absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] text-sm"></i>
                    <input
                      {...register('location.state', { required: 'State is required' })}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                        errors['location.state'] ? 'border-red-500 focus:ring-red-500' : 'border-[#E5E7EB] focus:ring-[#16A34A]'
                      }`}
                      placeholder="e.g., Bagmati"
                    />
                    {errors['location.state'] && <p className="mt-1 text-red-600 text-xs">{errors['location.state'].message}</p>}
                  </div>
                </div>
              </div>
              {/* Country - Full width */}
              <div className="relative">
                <label className="block text-[#6B7280] text-sm font-medium mb-2">Country</label>
                <div className="relative">
                  <i className="fas fa-globe absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] text-sm"></i>
                  <input
                    {...register('location.country', { required: 'Country is required' })}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                      errors['location.country'] ? 'border-red-500 focus:ring-red-500' : 'border-[#E5E7EB] focus:ring-[#16A34A]'
                    }`}
                    placeholder="e.g., Nepal"
                  />
                  {errors['location.country'] && <p className="mt-1 text-red-600 text-xs">{errors['location.country'].message}</p>}
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
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
                    {isEdit ? 'Update Theater' : 'Add Theater'}
                  </>
                )}
              </button>
            </form>
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => navigate('/admin/theaters/list')}
                className="text-[#6B7280] hover:text-[#16A34A] text-sm font-medium transition-colors duration-200"
              >
                ← Back to List
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddEditTheater;