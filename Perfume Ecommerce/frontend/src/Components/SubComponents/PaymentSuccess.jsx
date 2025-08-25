import React, { useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');

  // Ref to guard useEffect's async call so it only runs once
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (!sessionId) return;

    if (hasRunRef.current) {
      console.log('PaymentSuccess: clearCartAndConfirm already ran, skipping duplicate.');
      return;
    }
    hasRunRef.current = true;

    console.log('PaymentSuccess useEffect triggered, sessionId:', sessionId);

    const clearCartAndConfirm = async () => {
      try {
        const usernameRes = await axios.get('http://localhost:4444/signup/details', { withCredentials: true });
        const username = usernameRes.data.username;

        // Get session details from Stripe
        const sessionRes = await axios.get(`http://localhost:4444/stripe/session-details/${sessionId}`);
        const sessionData = sessionRes.data;

        // Parse cart items
        const cartItems = JSON.parse(sessionData.metadata.items);

       const titles = cartItems.map(item => item.productName);
const sizes = cartItems.map(item => item.size);
const quantities = cartItems.map(item => item.quantity);

await axios.post('http://localhost:4444/checkoutTotal/save', {
  username,
  title: titles,
  size: sizes,
  quantity: quantities,
  totalPrice: sessionData.metadata.totalPrice,
  address: sessionData.metadata.address,
});


        // Save payment details (to your own PaymentDetails model)
        await axios.post('http://localhost:4444/payment/record-payment', {
          orderId: sessionData.id, // Stripe session ID
          amount: sessionData.amount_total / 100, // Convert from paisa to INR
          username,
          phone: sessionData.customer_details?.phone || 'N/A', // Optional
          date: new Date(), // Or use sessionData.created * 1000 for Stripe timestamp
        });

        // Clear cart
        await axios.post('http://localhost:4444/checkoutTotal/emptycart', { username });

        Swal.fire({
          icon: 'success',
          title: 'Payment Successful!',
          text: 'Your cart has been cleared and your order is being processed.',
          timer: 3000,
          showConfirmButton: false,
        });

        // Redirect to home or order page
        setTimeout(() => {
          navigate('/');
        }, 3000);

      } catch (error) {
        console.log('Error after payment:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Something went wrong saving your order.',
        });
      }
    };

    clearCartAndConfirm();
  }, [sessionId, navigate]);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Processing your payment...</h2>
    </div>
  );
}

export default PaymentSuccess;
