import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center flex-col">
      <h1 className="text-4xl font-bold text-red-400 mb-4">Payment Failed</h1>
      <p>Something went wrong with your payment.</p>
      <button
        onClick={() => navigate(-2)}
        className="mt-6 bg-green-600 px-8 py-3 rounded-full"
      >
        Try Again
      </button>
    </div>
  );
};

export default PaymentFailed;