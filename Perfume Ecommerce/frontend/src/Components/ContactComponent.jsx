import React from 'react'
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import Header from './SubComponents/Header';
import '../css/style.css'
import Iframe from 'react-iframe';
import Footer from './SubComponents/Footer';
import Swal from 'sweetalert2';

const GlobalStyle = createGlobalStyle`
body{
  width: 100%;
  background-color: rgb(242, 242, 242);
  
.contactus{
  background-color: white;
  height: 35rem;
  width: 60%;
  margin: auto;
  margin-top: 5rem;  
  display: flex;
  border-radius: 4rem;
  margin-bottom: 3rem;

  
}

.leftcontact{
  flex: 0 0 75%;
  background-color: white;
  border-radius: 1rem;
  border-radius: 4rem;
}

.rightcontact{
  flex: 0 0 25%;
  background: linear-gradient(to top right, #1325e8 -5%, #8f10b7 100%);
}
.contactuscontainer{
  background-color: white;
}



`;

const ContactContainer = styled.div`
body{
  width: 100%;
  background-color: rgb(242, 242, 242);

}


.contactus{
  background-color: white;
  height: 35rem;
  width: 60%;
  margin: auto;
  margin-top: 5rem;  
  display: flex;
  border-radius: 4rem;
  margin-bottom: 3rem;

  
}

.leftcontact{
  flex: 0 0 75%;
  background-color: white;
  border-radius: 1rem;
  border-radius: 4rem;
}

.rightcontact{
  flex: 0 0 25%;
  background: linear-gradient(to top right, #1325e8 -5%, #8f10b7 100%);
}
.contactuscontainer{
  background-color: white;
}
form{
  width: 30rem;
  height: 30rem;
  background-color: white;
  margin: auto;
  margin-top: 2rem;
}
form h1{
  margin-top: 5rem;
}

form p{
  width: 90%;
  margin-top: 1rem;
}

form input{
  width: 90%;
  border-radius: 1rem;
  height: 2rem;
  margin-top: 2rem;
  border-top: 0;
  border-left: 0;
  border-right: 0;
  outline: none;
  padding-left: 1rem;
}

form input:focus{
  border-color: #1325e8;
}

form button{
  color: white;
  width: 90%;
  height: 3rem;
  border-radius: 1rem;
  margin-top: 2rem;
  border: none;
  background: linear-gradient(to top right, #1325e8 -5%, #8f10b7 100%);
}

.contactfeatures{
  color: rgba(0, 0, 0, 0);
  background-color: rgba(0, 0, 0, 0);
  font-size: 1.5rem;
  margin-top: 10px;
  margin-left: 10px;
}
.contactfeatures i{
  color: white;
  margin-left: 4px;
}

.contactus .contact_details{
  width: 30rem;
  height: 25rem;
  background-color: rgba(0, 0, 0, 1);
  backdrop-filter: blur(2px); /* Add background blur effect */
  position: absolute;
  right: 10rem;
  top: 9rem;
  color: white;
}

.contact_details h2{
  margin-left: 2rem;
  margin-top: 3rem;
}

.contact_details .contactdetailfeatures{
  margin-left: 2rem;
  margin-top: 3rem;
  font-size: 1.2rem;
  width: 90%;
  line-height: 2rem;
}
.contact_details .contactdetailfeatures p i{
  margin-right: 2rem;
}
.contact_details .contactdetailfeatures address i{
  margin-right: 2rem;
}

.containerofmap{
  width: 100%;
  background-color: white;
}

.mapfeature{
  width: 80%;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.mapfeature h3{
  margin-top: 2rem;
  margin-bottom: 1rem;
}
.mapfeature iframe{
  margin-top: 2rem;
  margin-bottom: 2rem;
  width: 70%;
  height: 30rem;
  border-radius: 20px;
}

.setting-products .login{
  width: 90%;
  height: 4rem;
  border: 2px solid black;
  margin: auto;
  margin-top: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.setting-products .login:hover{
  background-color: rgba(0, 0, 0, .2);
  
}
.setting-products .login:hover p{
  scale: 1.1;
}

.setting-products .login p a{
  color: black;
  background-color: none;
}
.setting-products .login p a:hover{
  color: black;
  background-color: rgba(0, 0, 0, 0);
}

.setting-products .login h3 a{
  color: black;
  background-color: none;
}
.setting-products .login h3 :hover{
  color: black;
  background-color: rgba(0, 0, 0, 0);
}
@media only screen and (max-width: 1025px) and (min-width: 769px){

  .contactus{
    width: 77%;
  }
  .contactus .contact_details{
    width: 22rem;
    right: 2rem;
  }

    
}
@media only screen and (max-width: 769px) and (min-width: 426px){
  .contactus{
    width: 90%;
    border-radius: 0px;
  }

  .leftcontact form h1{
    width: 25rem;
    margin-left: 1rem;
  }
  .leftcontact form p{
    width: 25rem;
    margin-left: 1rem;
  }
  .leftcontact form input{
    width: 25rem;
    margin-left: 1rem;
  }
  .leftcontact form button{
    width: 25rem;
    margin-left: 1rem;
  }
  .leftcontact{
    flex: 0 0 50%;
  }
  .rightcontact{
    flex: 0 0 31%;
  }
  .contactus .contact_details{
    width: 19rem;
    right: 2%;
  }
  .setting-products .login h3 a{
    color: black;
    background-color: none;
    margin-left: 23rem;
  }
}
@media only screen and (max-width: 426px) and (min-width: 322px){
  .contactus{
    background-color: rgb(242, 242, 242);
    display: block;
    border-radius: 0px;
    height: auto;
  }
  .leftcontact{
    width: 100%;
    flex: none;
    border-radius: 0px;
    margin-left: -2rem;
  }

  .rightcontact{
    height: 3rem;
    width: 22rem;
    margin-left: -3rem;
    background-color: black;
  }

  .leftcontact form{
    width: 22rem;
    margin-left: -1rem;
  }
  .leftcontact form h1{
    width: 20rem;
    margin-left: 1rem;
  }
  .leftcontact form p{
    width: 20rem;
    margin-left: 1rem;
  }
  .leftcontact form input{
    width: 20rem;
    margin-left: 1rem;
  }
  .leftcontact form button{
    width: 20rem;
    margin-left: 1rem;
  }
  .leftcontact{
    flex: 0 0 50%;
  }
  .contactus .contact_details{
    position: relative;
    height: 20rem;
    width: 22rem;
    right: 3rem;
    top: -2.98rem;
  }
  .contactus .contact_details h2{
   margin-top: 3rem;
  }
  .contactus .contact_details .contactdetailfeatures{
    line-height: 40px;
  }
  
  .setting-products .login h3 a{
    color: black;
    background-color: none;
    margin-left: 23rem;
  }
  .contactfeatures{
    margin-top: 0;
    display: flex;
    justify-content: center;
  }
  .contactfeatures i{
    padding: 1rem;
  }
  .mapfeature iframe{
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: 100%;
    height: 26rem;
    border-radius: 20px;
  }
}
@media only screen and (max-width: 376px) and (min-width: 322px){
  .contactus{
    background-color: rgb(242, 242, 242);
    display: block;
    border-radius: 0px;
    height: auto;
  }
  .leftcontact{
    width: 100%;
    flex: none;
    border-radius: 0px;
    margin-left: -2rem;
    width: 20rem;
  }

  .rightcontact{
    height: 3rem;
    width: 21rem;
    margin-left: -3rem;
    background-color: black;
  }

  .contactus .leftcontact form{
    width: 16rem;
    margin-left: -1rem;
  }
  .leftcontact form h1{
    width: 20rem;
  }
  .leftcontact form p{
    width: 20rem;
  }
  .leftcontact form input{
    width: 20rem;
  }
  .leftcontact form button{
    width: 20rem;
   
  }
  .leftcontact{
    flex: 0 0 50%;
  }
  .contactus .contact_details{
    position: relative;
    height: 20rem;
    width: 21rem;
    right: 3rem;
    top: -2.98rem;
  }
  .contactus .contact_details h2{
   margin-top: 3rem;
  }
  .contactus .contact_details .contactdetailfeatures{
    line-height: 40px;
  }
}
@media only screen and (max-width: 322px) and (min-width: 200px){
  .contactus{
    background-color: rgb(0, 0, 0);
    display: block;
    border-radius: 0px;
    height: auto;
  }
  .leftcontact{
    width: 100%;
    flex: none;
    border-radius: 0px;
    margin-left: -2rem;
  }

  .rightcontact{
    height: 3rem;
    width: 22rem;
    margin-left: -3rem;
    background-color: black;
  }

  .leftcontact form{
    width: 22rem;
    margin-left: -1rem;
  }
  .leftcontact form h1{
    width: 20rem;
    margin-left: 1rem;
  }
  .leftcontact form p{
    width: 20rem;
    margin-left: 1rem;
  }
  .leftcontact form input{
    width: 20rem;
    margin-left: 1rem;
  }
  .leftcontact form button{
    width: 20rem;
    margin-left: 1rem;
  }
  .leftcontact{
    flex: 0 0 50%;
  }
  .contactus .contact_details{
    position: relative;
    height: 20rem;
    width: 22rem;
    right: 3rem;
    top: -2.98rem;
  }
  .contactus .contact_details h2{
   margin-top: 3rem;
  }
  .contactus .contact_details .contactdetailfeatures{
    line-height: 40px;
  }
}
@media only screen and (max-width: 322px) and (min-width: 200px){
  .contactus{
    background-color: rgb(242, 242, 242);
    display: block;
    border-radius: 0px;
    height: auto;
  }
  .leftcontact{
    width: 100%;
    flex: none;
    border-radius: 0px;
    margin-left: -2rem;
    width: 17rem;
  }

  .rightcontact{
    height: 3rem;
    width: 18rem;
    margin-left: -3rem;
    background-color: black;
  }

  .contactus .leftcontact form{
    width: 16rem;
    margin-left: -1rem;
  }
  .leftcontact form h1{
    width: 16rem;
  }
  .leftcontact form p{
    width: 16rem;
  }
  .leftcontact form input{
    width: 16rem;
  }
  .leftcontact form button{
    width: 16rem;
   
  }
  .leftcontact{
    flex: 0 0 50%;
  }
  .contactus .contact_details{
    position: relative;
    height: 20rem;
    width: 18rem;
    right: 3rem;
    top: -2.98rem;
  }
  .contactus .contact_details h2{
   margin-top: 3rem;
  }
  .contactus .contact_details .contactdetailfeatures{
    line-height: 40px;
  }
  .setting-products .login h3 a{
    color: black;
    background-color: none;
    margin-left: 17rem;
  }
  .contactfeatures{
    margin-top: 0;
    display: flex;
    justify-content: center;
  }
  .contactfeatures i{
    padding: 1rem;
  }
  .mapfeature iframe{
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: 100%;
    height: 20rem;
    border-radius: 20px;
  }
}


* {
    margin: 0;
    padding: 0;
}

html,body{
    box-sizing: border-box;
    font-style: normal;
    scroll-behavior: smooth;
    
}


.header{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background-color: rgba(0, 0, 0, .1);
    z-index: 2;

   
}

/* Add a black background color to the top navigation */
.topnav {
  background-color: rgba(0, 0, 0, .3);
  overflow: hidden;
  display: flex;
  align-items: center;



}


.topnav a img{
  height: 2rem;
  object-fit: cover;
}



/* Style the links inside the navigation bar */
.topnav a {
  float: left;
  display: block;
  color: white;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
  font-size: 17px;
}

.menu{
  margin-left: 16rem;
  display: flex;
  flex-direction: row;
}

.menu .menu-search{
  margin-left: 19rem;
  display: flex;
  flex-direction: row;
  align-items: center;
}


.menu .menu-search input {
  max-width: 0;
  border-radius: 5px 5px 5px 5px;
  height: 2.8rem;
  border: none;
  position: absolute;
  top: 3.5rem;
  right: 19rem;
  background-color: rgba(255, 255, 255, 0.7);
  transition: max-width 0.9s ease;
  width: 0;
}

.search_box {
  opacity: 0;
  visibility: hidden;
  max-width: 0;
  border-radius: 5px;
  height: 10rem;
  border: none;
  position: absolute;
  top: 6.5rem;
  right: 19rem;
  background-color: rgba(255, 255, 255, 0.7);
  transition: max-width 0.5s ease, opacity 0.9s ease;
  width: 0;
}


.menu .menu-search .searchshow:hover input,
.menu .menu-search input:focus {
  width: 24rem;
  max-width: 24rem;
  border: 1px solid black;


}
.menu .menu-search .searchshow:hover .search_box{
  opacity: 1;
  visibility: visible;
  width: 24rem;
  max-width: 24rem;
  border: 1px solid black;

}


.heart-products{  
  max-width: 0;
  border-radius: 5px 5px 5px 5px;
  height: 10rem;
  border: none;
  position: absolute;
  top: 3.5rem;
  right: 16rem;
  background-color: rgba(255, 255, 255, 0.7);
  transition: max-width 0.9s ease;
  width: 0;
}
.cart-products{  
  max-width: 0;
  border-radius: 5px 5px 5px 5px;
  height: 10rem;
  border: none;
  position: absolute;
  top: 3.5rem;
  right: 12rem;
  background-color: rgba(255, 255, 255, 0.7);
  transition: max-width 0.9s ease;
  width: 0;
}

.setting-products{  
  opacity: 0;
  visibility: hidden;
  max-height: 0;
  border-radius: 5px;
  height: 10rem;
  border: none;
  position: absolute;
  top: 3.5rem;
  right: 12rem;
  background-color: rgba(255, 255, 255, 0.7);
  transition: max-height 0.5s ease, opacity 0.9s ease;
  height: 0;
}


.menu .menu-search .heartshow:hover .heart-products{
  opacity: 1;
  visibility: visible;
  width: 24rem;
  max-width: 24rem;
  border: 1px solid black;
}
.menu .menu-search .cartshow:hover .cart-products{
  opacity: 1;
  visibility: visible;
  width: 24rem;
  max-width: 24rem;
  border: 1px solid black;
}
.menu .menu-search .settingshow:hover .setting-products{
  opacity: 1;
  visibility: visible;
  width: 16rem;
  height: 24rem;
  max-height: 24rem;
  border: 1px solid black;
}

.menu .menu-search a{
  
  color: orange;
}



/* Add an active class to highlight the current page */


/* Hide the link that should open and close the topnav on small screens */
.topnav .icon {
  display: none;
}

/* Dropdown container - needed to position the dropdown content */
.dropdown {
  float: left;
  overflow: hidden;
}

/* Style the dropdown button to fit inside the topnav */
.dropdown .dropbtn {
  font-size: 17px;
  border: none;
  outline: none;
  color: white;
  padding: 14px 16px;
  background-color: inherit;
  font-family: inherit;
  margin: 0;
}

/* Style the dropdown content (hidden by default) */
.dropdown-content {
  max-height: 0;
  opacity: 0;
  visibility: hidden;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 0px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  display: flex;
  transition: max-height 0.3s ease-in, opacity 0.5s ease-in, visibility 0.3s ease-in;
  gap: 3rem;
 
}


.dropdown-content ul{
  list-style: none;
  line-height: 20px;
  margin-top: 1rem;
  margin-left: 1rem;
  cursor: pointer;
}

/* Style the links inside the dropdown */
.dropdown-content a {
  float: none;
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  text-align: left;
}

/* Add a dark background on topnav links and the dropdown button on hover */
.topnav a:hover, .dropdown:hover .dropbtn {
  background-color: #555;
  color: white;
}

/* Add a grey background to dropdown links on hover */
.dropdown-content a:hover {
  background-color: #ddd;
  color: black;
}

/* Show the dropdown menu when the user moves the mouse over the dropdown button */
.dropdown:hover .dropdown-content {
  max-height: 20em;
  opacity: 1;
  visibility: visible;
  display: flex;
  gap: 3rem;
}
/* When the screen is less than 600 pixels wide, hide all links, except for the first one ("Home"). Show the link that contains should open and close the topnav (.icon) */
@media screen and (max-width: 321px) and (min-width: 200px){
  .topnav a:not(:first-child), .dropdown .dropbtn {
    display: none;
  }
  .topnav .menu{
    background-color: black;
  }

  .topnav .menu .active{
    display: none;
  }


  .topnav.responsive .logo-img{
    width: 24rem;
  }
  .topnav a.icon {
    float: right;
    display: block;
  }
 

  .topnav .menu .menu-search{
    display: none;
  }
  .topnav.responsive .menu .menu-search{
    display: block;
  }

  .menu{
    margin-left: 0;
    display: block;
    width: 20rem;
  }
  .topnav.responsive .menu .menu-search{
    margin-left: 0;

  }

  .menu .menu-search input{
    left: .7rem;
    top: 0;
  }
  .menu .menu-search .search_box{
    left: .7rem;
    top: 0;
  }
  .menu .heartshow .heart-products{
    left: .7rem;
    top: 0;
  }
  .menu .cartshow .cart-products{
    left: .7rem;
    top: 0;
  }
  .menu .settingshow .setting-products{
    left: .7rem;
    top: 0;
  }
  .menu .menu-search .searchshow:hover input,
.menu .menu-search input:focus {
  position: relative;
  width: 24rem;
  max-width: 24rem;
  border: 1px solid black;  
}
  .menu .menu-search .searchshow:hover .search_box {
  position: relative;
  width: 24rem;
  max-width: 24rem;
  border: 1px solid black;  
}
  .menu .heartshow:hover .heart-products {
  position: relative;
  width: 24rem;
  max-width: 24rem;
  border: 1px solid black;  
}
 .menu .cartshow:hover .cart-products {
  position: relative;
  width: 24rem;
  max-width: 24rem;
  border: 1px solid black;  
}
.settingshow:hover ~ .cartshow{
  display: none; 
}
  .menu .settingshow:hover .setting-products {
  position: relative;
  width: 24rem;
  max-width: 24rem;
  border: 1px solid black;  
}
}

/* The "responsive" class is added to the topnav with JavaScript when the user clicks on the icon. This class makes the topnav look good on small screens (display the links vertically instead of horizontally) */
@media screen and (max-width: 321px) and (min-width: 200px){
  .topnav{
    display: flex;
    justify-content: space-between;
    background-color: black;
    overflow-y: auto;
    max-height: 40rem;
  }
  .topnav.responsive {position: relative; flex-direction: column; background-color: black;}
  .topnav.responsive a.icon {
    position: absolute;
    left: 86%;
    top: .3rem;
  }
  .topnav.responsive a {
    float: none;
    display: block;
    text-align: left;
    width: 20rem;

  }

  .dropdown-content {
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
    overflow-y: auto;
    max-height: 12rem;
  }

  .topnav.responsive .dropdown:hover .dropdown-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .topnav.responsive .dropdown .dropdown-content ul li{
    display: none;
  }
  .topnav.responsive .dropdown .dropdown-content ul:hover li{
    display: block;
  }
  .topnav.responsive .dropdown .dropdown-content ul{
    line-height: 10px;
  }
  
    
  }
  .topnav.responsive .dropdown {float: none;}
  .topnav.responsive .dropdown-content {position: relative; width: 20rem;}
  .topnav.responsive .dropdown .dropbtn {
    display: block;
    width: 100%;
    text-align: left;
   
}
@media screen and (max-width: 376px) and (min-width: 321px){
  .topnav a:not(:first-child), .dropdown .dropbtn {
    display: none;
  }
  .topnav .menu{
    background-color: black;
  }

  .topnav .menu .active{
    display: none;
  }
  .topnav a.icon {
    float: right;
    display: block;
  }

  .topnav .menu .menu-search{
    display: none;
  }
  .topnav.responsive .menu .menu-search{
    display: block;
  }

  .menu{
    margin-left: 0;
    display: block;
    width: 24rem;
  }
  .topnav.responsive .menu .menu-search{
    margin-left: 0;

  }

  .menu .menu-search input{
    left: .7rem;
    top: 0;
  }
  .menu .menu-search .search_box{
    left: .7rem;
    top: 0;
  }
  .menu .heartshow .heart-products{
    left: .7rem;
    top: 0;
  }
  .menu .cartshow .cart-products{
    left: .7rem;
    top: 0;
  }
  .menu .settingshow .setting-products{
    left: .7rem;
    top: 0;
  }
  .menu .menu-search .searchshow:hover input,
.menu .menu-search input:focus {
  position: relative;
  width: 24rem;
  max-width: 24rem;
  border: 1px solid black;  
}
  .menu .menu-search .searchshow:hover .search_box {
  position: relative;
  width: 24rem;
  max-width: 24rem;
  border: 1px solid black;  
}
  .menu .heartshow:hover .heart-products {
  position: relative;
  width: 24rem;
  max-width: 24rem;
  border: 1px solid black;  
}
 .menu .cartshow:hover .cart-products {
  position: relative;
  width: 24rem;
  max-width: 24rem;
  border: 1px solid black;  
}
.settingshow:hover ~ .cartshow{
  display: none; 
}
  .menu .settingshow:hover .setting-products {
  position: relative;
  width: 24rem;
  max-width: 24rem;
  border: 1px solid black;  
}
}

/* The "responsive" class is added to the topnav with JavaScript when the user clicks on the icon. This class makes the topnav look good on small screens (display the links vertically instead of horizontally) */
@media screen and (max-width: 376px) and (min-width: 321px){
  .topnav{
    display: flex;
    justify-content: space-between;
    background-color: black;
    overflow-y: auto;
    max-height: 30rem;
  }
  .topnav.responsive {position: relative; flex-direction: column; background-color: black;}
  .topnav.responsive a.icon {
    position: absolute;
    left: 89%;
    top: .9rem;
  }
  .topnav.responsive a {
    float: none;
    display: block;
    text-align: left;
    width: 26rem;

  }

  .dropdown-content {
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
    overflow-y: auto;
    max-height: 12rem;
  }

  .topnav.responsive .dropdown:hover .dropdown-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .topnav.responsive .dropdown .dropdown-content ul li{
    display: none;
  }
  .topnav.responsive .dropdown .dropdown-content ul:hover li{
    display: block;
  }
  .topnav.responsive .dropdown .dropdown-content ul{
    line-height: 10px;
  }
  
    
  }
  .topnav.responsive .dropdown {float: none;}
  .topnav.responsive .dropdown-content {position: relative; width: 26rem;}
  .topnav.responsive .dropdown .dropbtn {
    display: block;
    width: 100%;
    text-align: left;
   
}
@media screen and (max-width: 600px) and (min-width: 376px){
  .topnav a:not(:first-child), .dropdown .dropbtn {
    display: none;
  }
  .topnav .menu{
    background-color: black;
  }

  .topnav .menu .active{
    display: none;
  }
  .topnav a.icon {
    float: right;
    display: block;
  }

  .topnav .menu .menu-search{
    display: none;
  }
  .topnav.responsive .menu .menu-search{
    display: block;
  }

  .menu{
    margin-left: 0;
    display: block;
    width: 24rem;
  }
  .topnav.responsive .menu .menu-search{
    margin-left: 0;

  }

  .menu .menu-search input{
    left: .7rem;
    top: 0;
  }
  .menu .menu-search .search_box{
    left: .7rem;
    top: 0;
  }
  .menu .heartshow .heart-products{
    left: .7rem;
    top: 0;
  }
  .menu .cartshow .cart-products{
    left: .7rem;
    top: 0;
  }
  .menu .settingshow .setting-products{
    left: .7rem;
    top: 0;
  }
  .menu .menu-search .searchshow:hover input,
.menu .menu-search input:focus {
  position: relative;
  width: 24rem;
  max-width: 24rem;
  border: 1px solid black;  
}
  .menu .menu-search .searchshow:hover .search_box {
  position: relative;
  width: 24rem;
  max-width: 24rem;
  border: 1px solid black;  
}
  .menu .heartshow:hover .heart-products {
  position: relative;
  width: 24rem;
  max-width: 24rem;
  border: 1px solid black;  
}
 .menu .cartshow:hover .cart-products {
  position: relative;
  width: 24rem;
  max-width: 24rem;
  border: 1px solid black;  
}
.settingshow:hover ~ .cartshow{
  display: none; 
}
  .menu .settingshow:hover .setting-products {
  position: relative;
  width: 24rem;
  max-width: 24rem;
  border: 1px solid black;  
}
}

/* The "responsive" class is added to the topnav with JavaScript when the user clicks on the icon. This class makes the topnav look good on small screens (display the links vertically instead of horizontally) */
@media screen and (max-width: 600px) and (min-width: 376px){
  .topnav{
    display: flex;
    justify-content: space-between;
    background-color: black;
    overflow-y: auto;
    max-height: 40rem;
  }
  .topnav.responsive {position: relative; flex-direction: column; background-color: black;}
  .topnav.responsive a.icon {
    position: absolute;
    left: 89%;
    top: .9rem;
  }
  .topnav.responsive a {
    float: none;
    display: block;
    text-align: left;
    width: 26rem;

  }

  .dropdown-content {
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
    overflow-y: auto;
    max-height: 12rem;
  }

  .topnav.responsive .dropdown:hover .dropdown-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .topnav.responsive .dropdown .dropdown-content ul li{
    display: none;
  }
  .topnav.responsive .dropdown .dropdown-content ul:hover li{
    display: block;
  }
  .topnav.responsive .dropdown .dropdown-content ul{
    line-height: 10px;
  }
  
    
  }
  .topnav.responsive .dropdown {float: none;}
  .topnav.responsive .dropdown-content {position: relative; width: 26rem;}
  .topnav.responsive .dropdown .dropbtn {
    display: block;
    width: 100%;
    text-align: left;
   
}
@media screen and (max-width: 800px) and (min-width: 601px){
  .topnav a:not(:first-child), .dropdown .dropbtn {
    display: none;
  }
  .topnav .menu{
    background-color: black;
  }

  .topnav.responsive .logo-img{
   width: 45rem;
  }

  .topnav .menu .active{
    display: none;
  }
  .topnav a.icon {
    float: right;
    display: block;
  }

  .topnav .menu .menu-search{
    display: none;
  }
  .topnav.responsive .menu .menu-search{
    display: block;
  }

  .menu{
    margin-left: 0;
    display: block;
    width: 40rem;
  }
  .topnav.responsive .menu .menu-search{
    margin-left: 0;

  }

  .menu .menu-search input{
    left: .7rem;
    top: 0;
  }
  .menu .menu-search .search_box{
    left: .7rem;
    top: 0;
  }
  .menu .heartshow .heart-products{
    left: .7rem;
    top: 0;
  }
  .menu .cartshow .cart-products{
    left: .7rem;
    top: 0;
  }
  .menu .settingshow .setting-products{
    left: .7rem;
    top: 0;
  }
  .menu .menu-search .searchshow:hover input,
.menu .menu-search input:focus {
  position: relative;
  width: 24rem;
  max-width: 24rem;
  border: 1px solid black;  
}
  .menu .menu-search .searchshow:hover .search_box {
  position: relative;
  width: 24rem;
  max-width: 24rem;
  border: 1px solid black;  
}
  .menu .heartshow:hover .heart-products {
  position: relative;
  width: 24rem;
  max-width: 24rem;
  border: 1px solid black;  
}
 .menu .cartshow:hover .cart-products {
  position: relative;
  width: 24rem;
  max-width: 24rem;
  border: 1px solid black;  
}

  .menu .settingshow:hover .setting-products {
  position: relative;
  width: 24rem;
  max-width: 24rem;
  border: 1px solid black;  
}
}

/* The "responsive" class is added to the topnav with JavaScript when the user clicks on the icon. This class makes the topnav look good on small screens (display the links vertically instead of horizontally) */
@media screen and (max-width: 800px) and (min-width: 601px){
  .topnav{
    display: flex;
    justify-content: space-between;
    background-color: black;
    overflow-y: auto;
    max-height: 50rem;
  }
  .topnav.responsive{
    display: flex;
    justify-content: space-between;
    background-color: black;
    overflow-y: auto;
    max-height: 40rem;
  }
  .topnav.responsive {position: relative; flex-direction: column; background-color: black;}
  .topnav.responsive a.icon {
    position: absolute;
    left: 89%;
    top: .9rem;
  }
  .topnav.responsive a {
    float: none;
    display: block;
    text-align: left;
    width: 26rem;

  }

  .dropdown-content {
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
    overflow-y: auto;
    max-height: 12rem;
  }

  .topnav.responsive .dropdown:hover .dropdown-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .topnav.responsive .dropdown .dropdown-content ul li{
    display: none;
  }
  .topnav.responsive .dropdown .dropdown-content ul:hover li{
    display: block;
  }
  .topnav.responsive .dropdown .dropdown-content ul{
    line-height: 10px;
  }
  
    
  }
  .topnav.responsive .dropdown {float: none;}
  .topnav.responsive .dropdown-content {position: relative; width: 40rem;}
  .topnav.responsive .dropdown .dropbtn {
    display: block;
    width: 100%;
    text-align: left;
   
}









  @media only screen and (min-width: 200px) and (max-width:321px){
 







    .slide_featuress i{
     font-size: 70%;
    }
    .slide_featuress{
      margin-top: -1rem;
    }





 
    







  


    .product-card .product-image{
      height: 4rem;
    }
    .product-slider .product-card{
      width: 200px;
    }
    .product-card .product-title{
      font-size: 0.8em;
    }
    .product-card .product-price{
      font-size: 0.8em;
    }




    footer .row{
      flex-direction: column;
      align-items: center;
    }
  
    footer .column{
     width: 14rem;
     text-align: center;
    }
  
    footer .sliderfeatureproducts .product-image{
      height: 5rem;
   
    }
    footer .sliderfeatureproducts .product-card{
      width: 200px;
      padding: 0px;
      margin: auto;
    }
    footer .slidermostviewproducts .product-card{
      width: 200px;
      padding: 0px;
      margin: auto;
    }
    
    footer .row2 h3{
      font-size: 1rem;
      text-align: center;
      border-left: 1px solid grey;
    }
    footer .row2{
      flex-direction: column;
      align-items: center;
    }

    .overlay .overlay_container{
      flex-direction: column;
    }

    .overlay .overlay_container{
      overflow-y: auto;
     }
  
     .overlay .overlay_container .right{
      flex: 0 0 50%;
     }
     .overlay .overlay_container .left{
      flex: 0 0 10%;
     }

     .overlay .overlay_container .left .overlay_img{
      height: 15rem;
      width: 10rem;
      margin-bottom: 2rem;
     }
     .overlay .overlay_container .left .overlay_img2{
      height: 5rem;
      width: 15rem;
      margin: auto;
      margin-bottom: 2rem;
     }
     .overlay .overlay_container .left .overlay_img img{
      height: 15rem;
     }
     .overlay .overlay_container .left .overlay_img2 img{
      height: 5rem;
     }

     .add-to-cart{
      margin: auto;
     }

}

  @media only screen and (min-width: 321px) and (max-width:424px){

    .slide_featuress i{
      font-size: 70%;
     }
     .slide_featuress{
      margin-top: -1.2rem;
     }



    

    




 

   

  

    .product-card .product-image{
      height: 4rem;
    }
    .product-slider .product-card{
      width: 300px;
    }
    .product-card .product-title{
      font-size: 0.8em;
    }
    .product-card .product-price{
      font-size: 0.8em;
    }


   



  

    footer .row{
      flex-direction: column;
      align-items: center;
    }
  
    footer .column{
     width: 14rem;
     text-align: center;
    }
  
    footer .sliderfeatureproducts .product-image{
      height: 5rem;
   
    }
    footer .sliderfeatureproducts .product-card{
      width: 200px;
      padding: 0px;
      margin: auto;
    }
    footer .slidermostviewproducts .product-card{
      width: 200px;
      padding: 0px;
      margin: auto;
    }
    
    footer .row2 h3{
      font-size: 1rem;
      text-align: center;
      border-left: 1px solid grey;
    }
    footer .row2{
      flex-direction: column;
      align-items: center;
    }

    .overlay .overlay_container{
      flex-direction: column;
    }

    .overlay .overlay_container{
      overflow-y: auto;
     }
  
     .overlay .overlay_container .right{
      flex: 0 0 50%;
     }
     .overlay .overlay_container .left{
      flex: 0 0 10%;
     }

     .overlay .overlay_container .left .overlay_img{
      height: 15rem;
      width: 10rem;
      margin-bottom: 2rem;
     }
     .overlay .overlay_container .left .overlay_img2{
      height: 5rem;
      width: 15rem;
      margin: auto;
      margin-bottom: 2rem;
     }
     .overlay .overlay_container .left .overlay_img img{
      height: 15rem;
     }
     .overlay .overlay_container .left .overlay_img2 img{
      height: 5rem;
     }

     .add-to-cart{
      margin: auto;
     }

}

@media only screen and (min-width: 424px) and (max-width: 500px){
  

    .slide_featuress i{
      font-size: 90%;
     }

     .slide_featuress{
      margin-top: -1.2rem;
     }




    




   


    .product-card .product-image{
      height: 4rem;
    }
    .product-slider .product-card{
      width: 350px;
    }
    .product-card .product-title{
      font-size: 0.8em;
    }
    .product-card .product-price{
      font-size: 0.8em;
    }


  


    footer .row{
      flex-direction: column;
      align-items: center;
    }
  
    footer .column{
     width: 15rem;
     text-align: center;
    }
  
    footer .sliderfeatureproducts .product-image{
      height: 5rem;
   
    }
    footer .sliderfeatureproducts .product-card{
      width: 200px;
      padding: 0px;
      margin: auto;
    }
    footer .slidermostviewproducts .product-card{
      width: 200px;
      padding: 0px;
      margin: auto;
    }
    
    footer .row2 h3{
      font-size: 1rem;
      text-align: center;
      border-left: 1px solid grey;
    }
    footer .row2{
      flex-direction: column;
      align-items: center;
    }

    .overlay .overlay_container{
      flex-direction: column;
    }

    .overlay .overlay_container{
      overflow-y: auto;
     }
  
     .overlay .overlay_container .right{
      flex: 0 0 50%;
     }
     .overlay .overlay_container .left{
      flex: 0 0 10%;
     }

     .overlay .overlay_container .left .overlay_img{
      height: 15rem;
      width: 10rem;
      margin-bottom: 2rem;
     }
     .overlay .overlay_container .left .overlay_img2{
      height: 5rem;
      width: 15rem;
      margin: auto;
      margin-bottom: 2rem;
     }
     .overlay .overlay_container .left .overlay_img img{
      height: 15rem;
     }
     .overlay .overlay_container .left .overlay_img2 img{
      height: 5rem;
     }

     .add-to-cart{
      margin: auto;
     }

  
}



@media only screen and (min-width: 760px) and (max-width: 800px){
    

    .slide_featuress i{
      font-size: 90%;
     }

     .slide_featuress{
      margin-top: -1.2rem;
     }


   


 

    .product-card .product-image{
      height: 4rem;
    }
    .product-slider .product-card{
      width: 152px;
    }
    .product-card .product-title{
      font-size: 0.8em;
    }
    .product-card .product-price{
      font-size: 0.8em;
    }
  

    
  
  footer .row{
    flex-direction: column;
    align-items: center;
  }

  footer .column{
   width: 30rem;
   text-align: center;
  }

  footer .sliderfeatureproducts .product-image{
    height: 5rem;
 
  }
  footer .sliderfeatureproducts .product-card{
    width: 250px;
    padding: 0px;
    margin: auto;
  }
  footer .slidermostviewproducts .product-card{
    width: 15.625rem;
    padding: 0px;
    margin: auto;
  }
  
  footer .row2 h3{
    font-size: .7rem;
    width: 2rem;
  }
  .overlay .overlay_container{
    overflow-y: auto;
   }

   .overlay .overlay_container .right{
    flex: 0 0 50%;
   }
   .overlay .overlay_container .left{
    flex: 0 0 10%;
   }

   .left .overlay_img2{
    width: 20rem;
    margin-top: 4rem;
   }

   .left .overlay_img{
    width: 10rem;
   }

   .left .overlay_img img{
    height: 24rem;
   }


  

   

 
}

@media only screen and (min-width: 1020px) and (max-width: 1030px){
    

    .product-card .product-image{
      height: 5rem;
    }
    .product-slider .product-card{
      width: 171px;
    }
    .product-card .product-title{
      font-size: 0.8em;
    }
    .product-card .product-price{
      font-size: 0.8em;
    }

    footer .sliderfeatureproducts .product-card{
      width: 158px;
      padding: 0px;
    }
    footer .slidermostviewproducts .product-card{
      width: 158px;
      padding: 0px;
    }
    footer .sliderfeatureproducts .product-card .product-title{
      font-size: .7rem;
    }
    footer .slidermostviewproducts .product-card .product-title{
      font-size: .7rem;

    
    }
     .menu{
      margin-left: 4rem;
     }
     .menu .menu-search{
      margin-left: 6rem;
     }

     .menu a{
      font-size: 1rem;
     }

     .menu .menu-search .heartshow .heart-products{
      right: 2rem;
     }
     .menu .menu-search .cartshow .cart-products{
      right: 2rem;
     }
     .menu .menu-search .settingshow .setting-products{
      right: 2rem;
     }

     .overlay .overlay_container{
      overflow-y: auto;
     }

     .overlay .overlay_container .right{
      flex: 0 0 50%;
     }

     .left .overlay_img2{
      width: 20rem;
      margin-top: 4rem;
     }

    
  

}
/* header here */



  .product-info {
    text-align: center;
  }
  
  .product-title {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  .product-subtitle {
    font-size: 16px;
    margin-bottom: 5px;
  }
  
  .product-price-old {
    font-size: 14px;
    text-decoration: line-through;
    margin-right: 10px;
  }
  
  .product-price-new {
    font-size: 16px;
    font-weight: bold;
    margin-right: 10px;
  }
  
  .product-rating {
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }
  
  .star {
    font-size: 18px;
    color: #f5a623;
    margin-right: 2px;
  }



 


  .slide_featuress{
    position: fixed;
    color: #f5a623;
    font-size: 1.5rem;
    line-height: 3.5rem;
    display: none;
    z-index: 99;
    animation: feature 0.3s ease-in-out forwards;
    transform: translateX(50%);
  }

  .slide_featuress i{
    height: 1.5rem;
    width: 1.5rem;
    border:1px solid orange;
    margin-left: .5rem;
  }

  .slide:hover .slide_featuress{
    display: block;
  }
  
  .slide_featuress i:hover{
    background-color: rgb(54, 50, 50);
  }


  


@keyframes feature {
  0% {
    transform: translateX(50%);
  }
  100% {
    transform: translateX(0);
  }
}

.overlay {
  display: none;
  position: fixed; /* Position relative to the viewport */
  top: 10%; /* Adjust top position as needed */
  left: 15%; /* Adjust left position as needed */
  width: 70vw; /* Cover 50% of the viewport width */
  height: 89vh; /* Cover 70% of the viewport height */
  background-color: black; /* Semi-transparent black */
  z-index: 9999; /* Ensure it's above other content */

 
}

.overlay::-webkit-scrollbar {
  display: none; /* Hide scrollbar for WebKit-based browsers */
}


.website-content {
  margin-top: 50px; /* Adjust according to your design */
}










.text {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: transparent;
  color: white;
  text-align: center;
  z-index: 99;




}







.text {
  position: relative; /* Change from absolute to relative */
  z-index: 2; /* Ensure text remains above the background */
}


.overlay_container {
 width: 100%;
 height: 100%;
  padding: 14px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: white;
  display: flex;
  flex-direction: row;
  width: 100%;  
}

.left {
  flex: 0 0 30%; /* flex-grow, flex-shrink, flex-basis */
  background-color: #ffffff;
}

.right {
  flex: 0 0 70%; /* flex-grow, flex-shrink, flex-basis */
  background-color: #ffffff;
}

#closeOverlayBtn{
  float: right;
  background: none;
  border: none;
  font-size: 1.5rem;

}



.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
  margin-left: 10px;
}

.price {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #d30027;
  margin-left: 10px;

}

.description {
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  margin-bottom: 24px;
  margin-left: 10px;

}

.details-group {
  margin-bottom: 16px;
  margin-left: 10px;

}

.details-group label {
  font-size: 14px;
  font-weight: bold;
  display: block;
  margin-bottom: 8px;
}

.details-group span {
  font-size: 14px;
  color: #333;
}

.share-buttons {
  text-align: center;
  margin-bottom: 16px;
}

.share-button {
  display: inline-block;
  margin-right: 16px;
  font-size: 14px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-decoration: none;
  margin-top: 2rem;
}

.add-to-cart {
  width: 10rem;
  display: block;
  text-align: center;
  padding: 12px 24px;
  background-color: #d30027;
  color: white;
  font-size: 16px;
  font-weight: bold;
  text-decoration: none;
  border-radius: 4px;
  margin-top: 2rem;
}

#group-size{
  width: 100%;
  height: 2rem;
}





/* Hide the images by default */



.product-listing {
  font-family: Arial, sans-serif;
  width: 100%;
}

.product-card {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 250px;
  margin-bottom: 20px;
  text-align: center;
  margin-top: -1rem;
  padding: 15px;
}

.productinfohere{
  height: 100%;
  width: 100%;
  line-height: 30px;
}

.product-image {
  width: 5rem;
  height: 7rem;
  object-fit: cover;
}

.product-title {
  font-size: .8em;
  margin-bottom: 5px;
}

.product-price{
  font-size: .9em;
}





footer {
  width: 100%;
  background-color: #232222;
  padding: 20px;
  box-sizing: border-box;
}

.row {
  display: flex;
  justify-content: space-between;
  margin-right: 10%;
  margin-left: 10%;
}
.row2 {
  display: flex;
  justify-content: flex-start;
  gap: 3rem;
  margin-right: 10%;
  margin-left: 10%;
}

.column {
  width: 20%;
  line-height: 35px;
  margin-top: 5rem;
}

.sliderfeatureproducts .product-image{
  height: 4rem;
}
.sliderfeatureproducts .product-card{
  width: 224px;
  padding: 0px;
}
.slidermostviewproducts .product-card{
  width: 224px;
  padding: 0px;
}

.slidermostviewproducts .product-image{
  height: 4rem;
}

.row2{
  margin-top: 4rem;
}

footer .row2 h3{
  width: 8rem;
  border-right: 1px solid gray;
}

.row3{
  margin-top: 2rem;
}

.row , .row2, .row3{
  color: white;
}

.slide{
  box-shadow: none;
}


.slick-prev9, .slick-next9 {
  z-index: 2;

}

.slick-prev9 {
  left: 0!important;
 
}

.slick-next9 {
  right: 0!important;
}

.overlay_img {
  text-align: center;
  width: 19rem;
  height: 70%;
  margin: 1rem auto;
  z-index: 2;

}
.overlay_img2 {
  width: 20rem;
  height: 30%;
  z-index: 1;

}

.overlay_img img{
  width: 100%;
  height: 100%;
}
.overlay_img2 img{
  height: 9rem;
}

.quantity #group-size{
  width: 12.5rem;
}

.share_product{
  width: 50%;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 3rem auto;
}

.share_product a{
  text-decoration: none;
  color: blue;
  font-size: 1.5rem;
}

.menu a:hover{
background-color: rgba(255, 255, 255, .1);
}
 
`;

function ContactComponent() {

  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    formData.append("access_key", "e39b9776-7884-491a-af0c-eb9899377b21");

    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: json
    }).then((res) => res.json());

    if (res.success) {
      console.log("Success", res);
      Swal.fire({
        title: "Thank you for contacting us",
        icon: "success"
      });
      //reset form
      event.target.reset();
      
    }
  };

  return (
    <>
      <Header/>
      <GlobalStyle /> 
      <ContactContainer>
      <main>
        <div className='containerofcontactus'>
           <div className='contactus'>
            <div className='leftcontact'>
            <form onSubmit={onSubmit}>
                      <h1>Contact Us</h1>
                      <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Delectus deserunt eveniet at rerum incidunt provident sint sequi eligendi nam facilis.
                      </p>
                      <input type="text" placeholder="name" name='name'/><br />
                      <input type="email" placeholder="email" name='email'/><br />
                      <input
  type="textarea"
  placeholder="message"
  style={{ height: '50px' }}
  name='message' /><br />

                      <button type="Submit">Send</button>
                    </form>
            </div>
            <div className='rightcontact'>
              <div className='contactfeatures'>
              <a href="#"><i class="bi bi-facebook"></i></a>
              <a href="#"><i class="bi bi-instagram"></i></a>
              <a href="#"><i class="bi bi-twitter"></i></a>
              </div>
            </div>

            <div className='contact_details'>
            <h2>Contact details</h2>
            <div className='contactdetailfeatures'>
            <p><i class="bi bi-phone"></i>9847558367</p>
                  <p><i class="bi bi-envelope-fill  "></i> example@email.com</p>
                  <address><i class="bi bi-map"></i>Tejas Street - 06, Ruthamepur, Pairja, Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem, libero.</address>
            </div>
            </div>
           </div>

           <div className='containerofmap'>
            <div className='mapfeature'>
            <h3>Find Us On Google Map's</h3>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium facilis id accusamus expedita quo explicabo vel ipsum. Libero dolores maiores deserunt, dicta doloremque autem veniam odio omnis. Optio, consectetur at!</p>
        <Iframe
      url="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d48407.545888562105!2d-74.03353433598666!3d40.68560974555932!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2snp!4v1708657533683!5m2!1sen!2snp"
      width="600"
      height="450"
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
            </div>
           </div>
        </div>
      </main>
      </ContactContainer>

      <Footer/>


    </>
  )
}

export default ContactComponent