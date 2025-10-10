// // TrailersPostersUpload.jsx - Component for uploading movie posters and trailers (in /admin/components)
// import React, { useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useForm } from 'react-hook-form';
// import toast, { Toaster } from 'react-hot-toast';
// import { uploadPosters, updateTrailer } from '../../api/movieAPI'; // Adjust path - assume API for uploads

// const TrailersPostersUpload = () => {
//   const { id } = useParams(); // Movie ID for update
//   const navigate = useNavigate();
//   const isEdit = !!id;
//   const [uploading, setUploading] = useState(false);
//   const [previewProfile, setPreviewProfile] = useState(null);
//   const [previewBanner, setPreviewBanner] = useState(null);

//   const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = useForm({
//     defaultValues: {
//       trailerUrl: '',
//     },
//     mode: 'onChange',
//   });

//   const watchedTrailerUrl = watch('trailerUrl');

//   const onSubmit = async (data) => {
//     setUploading(true);
//     const formData = new FormData();
//     formData.append('trailerUrl', data.trailerUrl);

//     // Append files if selected
//     const profileFile = document.getElementById('profilePoster')?.files[0];
//     const bannerFile = document.getElementById('bannerPoster')?.files[0];
//     if (profileFile) formData.append('profilePoster', profileFile);
//     if (bannerFile) formData.append('bannerPoster', bannerFile);

//     try {
//       if (isEdit) {
//         await updateTrailer(id, formData);
//         toast.success('Trailers and posters updated successfully!');
//       } else {
//         // For new uploads, perhaps create a temp entry or redirect
//         const newUpload = await uploadPosters(formData);
//         toast.success('Trailers and posters uploaded successfully!');
//         console.log('New upload ID:', newUpload.id); // Handle as needed
//       }
//       setTimeout(() => navigate('/admin/movies/catalog'), 1500);
//     } catch (err) {
//       toast.error(err.error || 'Failed to upload');
//     } finally {
//       setUploading(false);
//     }
//   };

//   // File upload handlers
//   const handleProfileUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => setPreviewProfile(e.target.result);
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleBannerUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => setPreviewBanner(e.target.result);
//       reader.readAsDataURL(file);
//     }
//   };

//   // Embed trailer preview (YouTube example)
//   const embedTrailer = (url) => {
//     if (!url) return null;
//     const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
//     return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
//   };

//   return (
//     <>
//       <Toaster 
//         position="top-right"
//         toastOptions={{
//           duration: 4000,
//           style: { background: '#fff', color: '#2E2E2E', border: '1px solid #E5E7EB' },
//           success: { style: { background: '#F0FDF4', color: '#065F46' } },
//           error: { style: { background: '#FEF2F2', color: '#991B1B' } },
//         }}
//       />
//       <div className="flex justify-center items-start min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-[#F5F6FA]">
//         <div className="max-w-2xl w-full space-y-8">
//           <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8 border border-[#E5E7EB]/50">
//             <div className="text-center mb-6 md:mb-8">
//               <div className="mx-auto h-16 w-16 bg-gradient-to-r from-[#16A34A] to-[#22C55E] rounded-full flex items-center justify-center mb-4">
//                 <i className="fas fa-upload text-white text-2xl"></i>
//               </div>
//               <h2 className="text-2xl font-bold text-[#2E2E2E] mb-2">
//                 {isEdit ? 'Update Trailers & Posters' : 'Upload Trailers & Posters'}
//               </h2>
//               <p className="text-[#6B7280] text-sm">Add media for your movie</p>
//             </div>
//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" encType="multipart/form-data">
//               {/* Trailer URL */}
//               <div className="relative">
//                 <label className="block text-[#6B7280] text-sm font-medium mb-2">Trailer URL (YouTube)</label>
//                 <input
//                   {...register('trailerUrl', { required: !isEdit ? 'Trailer URL is required' : false })}
//                   className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A34A] ${
//                     errors.trailerUrl ? 'border-red-500 focus:ring-red-500' : 'border-[#E5E7EB]'
//                   }`}
//                   placeholder="e.g., https://www.youtube.com/watch?v=..."
//                 />
//                 {errors.trailerUrl && <p className="mt-1 text-red-600 text-xs">{errors.trailerUrl.message}</p>}
//                 {embedTrailer(watchedTrailerUrl) && (
//                   <iframe
//                     className="mt-4 w-full h-48 rounded-lg"
//                     src={embedTrailer(watchedTrailerUrl)}
//                     title="Trailer Preview"
//                     frameBorder="0"
//                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                     allowFullScreen
//                   />
//                 )}
//               </div>

//               {/* Poster Uploads */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-[#6B7280] text-sm font-medium mb-2">Profile Poster</label>
//                   <input
//                     id="profilePoster"
//                     type="file"
//                     accept="image/*"
//                     onChange={handleProfileUpload}
//                     className="w-full p-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
//                     required={!isEdit}
//                   />
//                   {previewProfile && (
//                     <img src={previewProfile} alt="Profile Preview" className="mt-2 w-32 h-48 object-cover rounded-lg" />
//                   )}
//                 </div>
//                 <div>
//                   <label className="block text-[#6B7280] text-sm font-medium mb-2">Banner Poster</label>
//                   <input
//                     id="bannerPoster"
//                     type="file"
//                     accept="image/*"
//                     onChange={handleBannerUpload}
//                     className="w-full p-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
//                     required={!isEdit}
//                   />
//                   {previewBanner && (
//                     <img src={previewBanner} alt="Banner Preview" className="mt-2 w-64 h-24 object-cover rounded-lg" />
//                   )}
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 disabled={isSubmitting || uploading}
//                 className="w-full bg-gradient-to-r from-[#16A34A] to-[#22C55E] text-white py-3 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl hover:from-[#065F46] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
//               >
//                 {isSubmitting || uploading ? (
//                   <>
//                     <i className="fas fa-spinner fa-spin mr-2"></i>
//                     Uploading...
//                   </>
//                 ) : (
//                   <>
//                     <i className="fas fa-upload mr-2"></i>
//                     {isEdit ? 'Update Media' : 'Upload Media'}
//                   </>
//                 )}
//               </button>
//             </form>
//             <div className="mt-6 text-center">
//               <button
//                 type="button"
//                 onClick={() => navigate('/admin/movies/catalog')}
//                 className="text-[#6B7280] hover:text-[#16A34A] text-sm font-medium transition-colors duration-200"
//               >
//                 ← Back to Catalog
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default TrailersPostersUpload;