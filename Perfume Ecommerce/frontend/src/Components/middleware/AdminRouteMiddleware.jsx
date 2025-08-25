import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Container } from 'react-bootstrap';



export default function AdminRouteMiddleware() {

  const navigate = useNavigate();
  const handleLogout = () => {

    axios.post('http://localhost:4444/check/logout')
    .then(response => {
      // Assuming your server responds with success
      console.log('Logout successful');
    })
    .catch(error => {
      console.error('Error logging out:', error);
    });

  navigate('/'); // Redirect the user to the home page or login page

  };
 


  return (
    <>
    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css" />

  <div className="w3-bar w3-black">
    <button onClick={handleLogout} className="w3-bar-item w3-button">Log out</button>
  </div>

  <div className="w3-row">
    <div className="w3-col l2 w3-black" style={{height: '500vh'}}>
      <div>
        <div>
        <Link to="/admin" className="w3-bar-item w3-button" style={{width:'100%', padding:'1rem'}}>Dashboard</Link>
        </div>
        <div>
        <Link to="/admin/addproduct" className="w3-bar-item w3-button" style={{width:'100%', padding:'1rem'}}>Add Product</Link>
        </div>
        <div>
        <Link to="/admin/manageproduct" className="w3-bar-item w3-button" style={{width:'100%', padding:'1rem'}}>Manage Product</Link>
        </div>
        <div>
        <Link to="/admin/managecheckout" className="w3-bar-item w3-button" style={{width:'100%', padding:'1rem'}}>Manage Checkout</Link>
        </div>
        {/* Additional sidebar items */}
      </div>
    </div>

    <div className="w3-col l9 w3-container">
 
        <Outlet />

    </div>
  </div>
</>
   
  )

}