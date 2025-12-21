import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

useEffect(() => {
  const verifyAndConfirm = async () => {
    // eSewa returns: oid (product id), refId (transaction ref), amt (amount)
    const oid = searchParams.get('oid');
    const refId = searchParams.get('refId');
    const amt = searchParams.get('amt');

    // Check if this is an eSewa payment
    if (!oid || !refId || !amt) {
      toast.error("Invalid payment response");
      navigate('/payment-failed');
      return;
    }

    const loadingToast = toast.loading("Verifying payment with eSewa...");

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/esewa/verify?oid=${oid}&refId=${refId}&amt=${amt}`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        toast.update(loadingToast, {
          render: "Payment verified! Booking confirmed.",
          type: "success",
          isLoading: false,
          autoClose: 3000
        });
        localStorage.removeItem('pendingEsewaBooking');
        
        // Redirect to tickets page or show success
        setTimeout(() => {
          navigate('/my-tickets');
        }, 2000);
      } else {
        toast.update(loadingToast, {
          render: data.message || "Payment verification failed",
          type: "error",
          isLoading: false,
          autoClose: 5000
        });
        navigate('/payment-failed');
      }
    } catch (err) {
      console.error('Verification error:', err);
      toast.update(loadingToast, {
        render: "Network error during verification",
        type: "error",
        isLoading: false,
        autoClose: 5000
      });
      navigate('/payment-failed');
    }
  };

  verifyAndConfirm();
}, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center flex-col">
      <h1 className="text-4xl font-bold text-green-400 mb-4">Payment Successful! 🎉</h1>
      <p>Your tickets have been booked.</p>
      <p>Redirecting to your bookings...</p>
    </div>
  );
};

export default PaymentSuccess;