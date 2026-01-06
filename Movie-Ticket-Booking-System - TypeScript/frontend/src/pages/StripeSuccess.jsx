// src/pages/StripeSuccess.jsx
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios'; // ← Critical import!

const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:5000';

const StripeSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const paymentId = localStorage.getItem('currentStripePaymentId');

    if (!sessionId || !paymentId) {
      toast.error('Invalid payment session');
      // navigate('/');
      return;
    }

    // Show loading toast with minimum display time
    const toastId = toast.loading('Confirming your payment and tickets...');

    const confirmPaymentAndBooking = async () => {
      try {
        // Step 1: Confirm Stripe session with backend
        const confirmRes = await axios.post(
          `${baseUrl}/stripe/confirm-checkout`,
          { sessionId, paymentId },
          { headers: { 'Content-Type': 'application/json' } }
        );

        if (!confirmRes.data.success) {
          throw new Error(confirmRes.data.message || 'Payment confirmation failed');
        }

        // Step 2: If backend returns bookingId, confirm the booking
        const bookingId = confirmRes.data.bookingId;
        if (bookingId) {
          const token = localStorage.getItem('token');
          await axios.post(
            `${baseUrl}/booking/${bookingId}/confirm`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }

        // Success!
        toast.update(toastId, {
          render: 'Payment successful! Your tickets are confirmed 🎉',
          type: 'success',
          isLoading: false,
          autoClose: 4000,
        });

        localStorage.removeItem('currentStripePaymentId');
        setTimeout(() => navigate('/my-tickets'), 2000);

      } catch (err) {
        console.error('Stripe success error:', err);
        toast.update(toastId, {
          render: err.response?.data?.message || 'Failed to confirm tickets',
          type: 'error',
          isLoading: false,
          autoClose: 6000,
        });
        // setTimeout(() => navigate('/'), 3000);
      }
    };

    confirmPaymentAndBooking();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white flex items-center justify-center flex-col">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500 mx-auto mb-6"></div>
        <h1 className="text-4xl font-bold mb-4">Processing Your Payment...</h1>
        <p className="text-lg opacity-80">Please do not refresh or close this page</p>
      </div>
    </div>
  );
};

export default StripeSuccess;