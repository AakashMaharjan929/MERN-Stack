import React from 'react'
import Header from './SubComponents/Header'
import '../css/style.css'
import 'bootstrap-icons/font/bootstrap-icons.css';
import Main from './SubComponents/Main';
import NewProduct from './SubComponents/NewProduct';
import ProductsDisplay from './SubComponents/text';
import Peaksale from './SubComponents/peaksale';
import HotDealsAndNewProducts from './SubComponents/hotdealsandnewproducts';
import BlogHomeContent from './SubComponents/blogHomeContent';
import Footer from './SubComponents/Footer';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';


const stripePromise = loadStripe('pk_test_51RXMqLR3o3geCE7w3WOg9wt41bALMC923mpa9IDCpLXYw3GDmHHuMxsNYajVrUabLw5ipPAyZnqzAXbZ9W5cCBwM00WYEn75Xp'); 

function HomeComponent() {
  return (
    <>
        <Elements stripe={stripePromise}>
    <Header />
    <Main />
    <NewProduct />
    <Peaksale />
    <HotDealsAndNewProducts/>
    {/* <BlogHomeContent/> */}
    <Footer/>
        </Elements>

    </>
  )
}

export default HomeComponent