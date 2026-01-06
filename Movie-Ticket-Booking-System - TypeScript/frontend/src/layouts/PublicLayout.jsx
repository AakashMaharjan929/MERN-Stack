// src/layouts/PublicLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer'; // if you have one

const PublicLayout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />  {/* This renders the matched child route (HomePage, NowShowing, etc.) */}
      </main>
      {/* <Footer /> if you have one */}
    </>
  );
};

export default PublicLayout;