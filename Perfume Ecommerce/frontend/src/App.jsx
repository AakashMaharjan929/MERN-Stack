import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';


import React from 'react'
import RouterComponent from "./RouterComponent";

const stripePromise = loadStripe('pk_test_51RXMqLR3o3geCE7w3WOg9wt41bALMC923mpa9IDCpLXYw3GDmHHuMxsNYajVrUabLw5ipPAyZnqzAXbZ9W5cCBwM00WYEn75Xp'); // Your Stripe publishable key

function App() {
  return (
    <>
      <Elements stripe={stripePromise}>
        <RouterComponent />
      </Elements>
        </>
  );
}

export default App
