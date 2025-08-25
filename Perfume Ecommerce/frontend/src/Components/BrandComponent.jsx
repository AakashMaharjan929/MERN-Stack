import { useState, useEffect, useRef } from "react";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import Header from './SubComponents/Header';
import '../css/style.css'
import Iframe from 'react-iframe';
import Footer from './SubComponents/Footer';
import axios from "axios";

const BASE_URL = 'http://localhost:4444';
const Image_Path_URL = 'http://localhost:4444/public/AllProducts/';

const BrandContainer = styled.div`
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
.header .dropdown .dropbtn{
  color: orange;
}
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




    main .product-title{
      font-size: 1rem;
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

     .titleinfo{
      width: 100%;
      overflow: hidden;
     }
     
    #productall{
      width: 90%;
      display: grid;
      grid-template-columns: 100%;
      grid-template-rows: auto;
      margin: auto;
      margin-top: 2rem;
      row-gap: 2rem;
      margin-bottom: 2rem;
    }

    .productall .slide{
      margin: auto;
    }

    .setting-products .login h3 a{
      color: black;
      background-color: none;
      margin-left: 17rem;
    }

}

  @media only screen and (min-width: 321px) and (max-width:424px){

    .slide_featuress i{
      font-size: 70%;
     }
     .slide_featuress{
      margin-top: -1.2rem;
     }



    main .product-title{
      font-size: 1rem;
    }

 

    main .product-title{
      font-size: 1rem;
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

     .titleinfo{
      width: 100%;
      overflow: hidden;
     }
     
    #productall{
      width: 90%;
      display: grid;
      grid-template-columns: 100%;
      grid-template-rows: auto;
      margin: auto;
      margin-top: 2rem;
      row-gap: 2rem;
      margin-bottom: 2rem;
    }

    .productall .slide{
      margin: auto;
    }

    .setting-products .login h3 a{
      color: black;
      background-color: none;
      margin-left: 23rem;
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

     .titleinfo{
      width: 100%;
      overflow: hidden;
     }
     
    #productall{
      width: 90%;
      display: grid;
      grid-template-columns: 100%;
      grid-template-rows: auto;
      margin: auto;
      margin-top: 2rem;
      row-gap: 2rem;
      margin-bottom: 2rem;
    }

    .productall .slide{
      margin: auto;
    }

    .setting-products .login h3 a{
      color: black;
      background-color: none;
      margin-left: 23rem;
    }

  
}



@media only screen and (min-width: 760px) and (max-width: 800px){
    

    .slide_featuress i{
      font-size: 90%;
     }

     .slide_featuress{
      margin-top: -1.2rem;
     }


    main .product-title{
      font-size: 1rem;
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

   .titleinfo{
    width: 100%;
    overflow: hidden;
   }
   
  #productall{
    width: 90%;
    display: grid;
    grid-template-columns: 50% 50%;
    grid-template-rows: auto;
    margin: auto;
    margin-top: 2rem;
    row-gap: 2rem;
    margin-bottom: 2rem;
  }

  .setting-products .login h3 a{
    color: black;
    background-color: none;
    margin-left: 23rem;
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

     .titleinfo{
      width: 100%;
      overflow: hidden;
     }
     
    #productall{
      width: 90%;
      display: grid;
      grid-template-columns: 33% 33% 33%;
      grid-template-rows: auto;
      margin: auto;
      margin-top: 2rem;
      row-gap: 2rem;
      margin-bottom: 2rem;
    }

    .setting-products .login h3 a{
      color: black;
      background-color: none;
      margin-left: 23rem;
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



 


  /* .slide_featuress{
    position: fixed;
    color: #f5a623;
    font-size: 1.5rem;
    line-height: 3.5rem;
    display: none;
    z-index: 99;
    animation: feature 0.3s ease-in-out forwards;
    transform: translateX(50%);
    display: none;
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
  } */


  


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
  color: black;
  margin-bottom: 0px;
  margin-left: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  font-family: Montserrat, Arial, sans-serif;

}

.description.expanded {
  -webkit-line-clamp: unset;
  display: block;
}

.show-more {
  background-color: white;
  border: none;
  float: right;
  font-family: Lato;
}

.details-group {
  margin-bottom: 16px;
  margin-left: 10px;
  margin-top: 22px;

}

.details-group label {
  font-size: 14px;
  font-weight: bold;
  display: block;
  margin-bottom: 8px;
  font-family: Montserrat, Arial, sans-serif;
}

.details-group span {
  font-size: 14px;
  color: #333;
  font-family: Lato;
}

.details-group select {
  border: 1px solid #ccc; /* Light border */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Light box shadow */
  padding: 5px; /* Add some padding for better appearance */
  border-radius: 4px; /* Add rounded corners */
  background-color: #fff; /* Background color */
  color: #333; /* Text color */
  font-size: 14px; /* Font size */
  -webkit-appearance: none; /* Remove default styling in WebKit browsers */
  -moz-appearance: none; /* Remove default styling in Firefox */
  appearance: none; /* Remove default styling in other browsers */
  font-family: Montserrat, Arial, sans-serif;
}

.details-group select:focus {
  border-color: #6faff3; /* Border color on focus */
  box-shadow: 0 0 5px rgba(125, 222, 101, 0.5); /* Box shadow on focus */
  outline: none; /* Remove outline on focus */
}

.details-group select option {
  padding: 5px; /* Add padding to options */
  background-color: #fff; /* Background color of options */
  color: #333; /* Text color of options */
  display: flex;
}
.details-group select option:hover {
  background-color: #6faff3;
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
color: black;
  border-radius: 4px;
  text-decoration: none;
  margin-top: 2rem;
}

.add-to-cart {
  width: 10rem;
  display: block;
  text-align: center;
  padding: 12px 24px;
  background-color: black;
  color: white;
  font-size: 14px;
  font-weight: bold;
  text-decoration: none;
  border-radius: 10px;
  margin-top: 2rem;
  cursor: pointer;
  font-family: Lato;
}


#group-size{
  width: 100%;
  height: 3rem;
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

main{
    height: auto;
}

.titleinfo{
  background-image: url('../../public/bannerimg2.png');
    
  background-size: cover;
  
  background-position: center;
  
  background-repeat: no-repeat;
  height: 20rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.titleinfo h1{
  font-size: 4rem;
}

.productall{
  width: 90%;
  display: grid;
  grid-template-columns: 25% 25% 25% 25%;
  grid-template-rows: auto;
  margin: auto;
  margin-top: 2rem;
  row-gap: 2rem;
  margin-bottom: 2rem;
}

.slide {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
  margin-right: 30px;
  background-color: #fff;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  line-height: 2rem;
  justify-content: center;
}

.slide img {
  width: 100%;
  height: 16rem;
  object-fit: contain;
  margin-bottom: 15px;

}


.slide_featuress{
  color: orange;
  position: fixed;
  z-index: 2;
  margin-top: -35%;
  margin-right: 10%;
  display: none;
  animation: feature 0.3s ease-in-out forwards;
  line-height: 50px;
  transform: translateX(50%);
}
.slide:hover  .slide_featuress {
  display: block;

}
.slide .slide_featuress i:hover{
  border: 1px solid orange;
  background-color: rgba(0, 0, 0, .7);

}
.slide_featuress i{
  font-size: 1.5rem;
  
 
}

.filter{
  width: 83%;
  background-color: white;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 2rem;
}

.sortfeature label{
  font-size: 1rem;
}

.sortfeature{
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
}
.sorttitle{
  opacity: .7;
}

.sortfeature button{
  width: 10rem;
  height: 4rem;
  border: none;
  background-color: rgba(0, 0, 0, .1);
  opacity: .7;
}
.sortfeature button:hover{
  border: 2px solid green;
  opacity: 1;
}

.view button{
  width: 6rem;
  height: 2rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
  background-color: rgb(255, 92, 119);
  border: none;
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

.menu a:hover{
  background-color: rgba(255, 255, 255, .1);
  }

`;

function BrandComponent() {

    const pathname = window.location.pathname;
    // Split the path by '/'
    const pathParts = pathname.split('/');
    // Extract the brand name from the URL
    const brandNameMain = pathParts[pathParts.length - 1];

    const sliderRef = useRef(null);

    const sliderSettings = {
        arrows:false,
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true, // Enable autoplay
        autoplaySpeed: 4000, // Set autoplay speed in milliseconds (e.g., 2000 ms = 2 seconds)
        // variableWidth: true,
    
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
            },
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
            },
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
            },
          },
        ],
      };

      const [products, setProducts] = useState('');
      const [error, setError] = useState('');
      const [filteredProducts, setFilteredProducts] = useState([]);
      const [selectedFilter, setSelectedFilter] = useState('All');

      


      useEffect(() => {
        fetch(`${BASE_URL}/allproducts/`)
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            setProducts(data);
            setFilteredProducts(data);
          })
          .catch(error => {
            console.error('Error:', error);
            setError(error.toString());
          });
      }, []); // Empty dependency array means this effect runs once after the initial render

      
  const [mainImage, setMainImage] = useState(products.length > 0 ? products[0].imageSrc : ''); 
  const [thumbnailImages, setThumbnailImages] = useState(products.length > 0 ? [products[0].imageSrc2, products[0].imageSrc3] : []);

  const handleThumbnailClick = (image) => {
    setMainImage(image);
  };


  function displayBlock(product,index){
    document.getElementById("overlay").style.display = "block";
  };

  function closeoverlay(){
    document.getElementById("overlay").style.display = "none";
  }

  const settings2 = {
    arrows: false,
    dots: false,
    infinite: true,
    speed: 200,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true, // Enable autoplay
    autoplaySpeed: 4000, // Set autoplay speed in milliseconds (e.g., 2000 ms = 2 seconds)
    focusOnSelect: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const [selectedProduct, setSelectedProduct] = useState(products[0]);
const [selectedIndex, setSelectedIndex] = useState(0);

const [selectedSize, setSelectedSize] = useState('');
const [selectedFragrance, setSelectedFragrance] = useState('');
const [selectedQuantity, setSelectedQuantity] = useState('');

const handleSizeChange = (event) => {
  setSelectedSize(event.target.value);
  console.log(event.target.value);
};

const handleFragranceChange = (event) => {
  setSelectedFragrance(event.target.value);
  console.log(event.target.value);
};

// Function to handle quantity selection
const handleQuantityChange = (event) => {
  setSelectedQuantity(event.target.value);
  console.log(event.target.value);
};



const handleProductClick = (product, index) => {
  setSelectedProduct(product);
  setSelectedIndex(index);
  setMainImage(`${Image_Path_URL}/${product.imageSrc}`); // Update mainImage with the clicked product's imageSrc
  setThumbnailImages([`${Image_Path_URL}/${product.imageSrc2}`, `${Image_Path_URL}/${product.imageSrc3}`]); // Update thumbnailImages with the clicked product's imageSrc2 and imageSrc3
  displayBlock(product, index);
};

const [name, setName] = useState('');

useEffect(() => {
  axios.get('http://localhost:4444/check')
    .then(response => {
      if(response.data.valid) {
        axios.get('http://localhost:4444/signup/details')
        .then(response => {
          setName(response.data.username);
          console.log(response.data.username)

        })
       
      } 
    })
    .catch(error => {
      console.log(error);
    });
}, []);



const addToCart = async (productName, size, fragrance, quantity) => {
    if (!size || !quantity) {
      swal("Error!", "Please select both size and quantity.", "error");
      return;
    }
  try {
      // console.log(productName, size, fragrance, quantity);
      const response = await axios.post(`http://localhost:4444/signup/cart/${name}`, {
          productName: productName,
          size: size,
          fragrance: fragrance,
          quantity: quantity
      });
      console.log(response.data); // Logging response for debugging
      alert('Item added to cart successfully');
  } catch (error) {
      console.error(error);
      alert('Failed to add item to cart');
  }
};

const applyFilter = (filter) => {
  setSelectedFilter(filter);
  if (filter === 'All') {
    setFilteredProducts(products);
  } else {
    const filtered = products.filter((product) => product.role === filter);
    setFilteredProducts(filtered);
  }
};


const [isExpanded, setIsExpanded] = useState(true);

const toggleDescription = () => {
  setIsExpanded(!isExpanded);
};



  return (
    <>
    <Header />
    <BrandContainer>
    
    <div class="titleinfo" id="title_banner">
          <h1>{brandNameMain}</h1>
          </div>

          <div className="filter">
          <div className="sorttitle">
            <h2>Filter</h2>
          </div>
        <div className="sortfeature">
    {/* <button onClick={() => applyFilter('NewProducts Unisex')}>
      <p>Unisex</p>
    </button> */}
    <button onClick={() => applyFilter('NewProducts Men')}>
      <p>Men</p>
    </button>
    <button onClick={() => applyFilter('NewProducts Women')}>
      <p>Women</p>
    </button>
    <button onClick={() => applyFilter('All')}>
      <p>All</p>
    </button>
  </div>
        </div>

      <div class="productall" id="productall">
   
           {filteredProducts && filteredProducts.map((product, index) => {
  if (product.brandName.trim() === brandNameMain.trim()) {
    return (
      <div key={index} className="slide">
  
  /
        <img src={`${Image_Path_URL}${product.imageSrc}`} alt="Product image" />
        <div className="product-info">
          <h2 className="product-title">{product.title}</h2>
       
          <p className="product-details">
            <span className="product-price-old">Rs.{product.priceOld}</span>
            <span className="product-price-new">Rs.{product.priceNew}</span>
          </p>
          <div id="product-ratings">
          <div className="product-rating">
            {[...Array(product.rating)].map((_, i) => (
              <span key={i} className="star">★</span>
            ))}
          </div>
          </div>
          <div className="view">
                      <button  onClick={() => handleProductClick(product,index)}>View</button>
                  </div>
        </div>
      </div>
    );
  } 
})}

    
</div>

<div className="overlay" id="overlay">
  <div className="overlay_container">
    <div className="left">
      <div className="overlay_img" id="overlay-img">
      
      <img src={mainImage} alt="Main Slide" />
      </div>
      <div className="overlay_img2" id="overlay-img2">
        <Slider {...settings2}>
      {thumbnailImages.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Thumbnail Slide ${index}`}
            onClick={() => handleThumbnailClick(image)}
          />
        
        ))}
          </Slider>
        </div>
   
    </div>
    <div className="right">
  <button id="closeOverlayBtn" onClick={closeoverlay}><i className="bi bi-x"></i></button>
<div>
      {selectedProduct && ( // Check if selectedProduct exists
        <div>
          {selectedProduct.title && ( // Check if title exists
            <h2 className="title">{selectedProduct.title}</h2>
          )}
          <div className="price" style={{display: 'flex', gap:"1rem"}}>
          {selectedProduct.priceNew && ( // Check if priceNew exists
              <>
              {selectedProduct.priceOld && ( // Check if priceOld exists
              <>
                  <p style={{color:'#FF7A11'}}>Rs.{selectedProduct.priceNew}</p>
                  <strike style={{color:'grey'}}>Rs.{selectedProduct.priceOld}</strike>
                  </> 
                )}
       
                
              </>
            )}
          </div>
          {selectedProduct.description && (
        <div>
          <div className={`description ${isExpanded ? 'expanded' : ''}`}>
            {selectedProduct.description}
          </div>
          <button onClick={toggleDescription} className='show-more'>
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        </div>
      )}
        </div>
      )}
    </div>
  <div className="details-group">
    <label htmlFor="size">SIZE</label>
     <select id="group-size" value={selectedSize} onChange={handleSizeChange}>
    <option value="">Select Quantity</option>
    {selectedProduct?.size?.length > 0 ? (
      selectedProduct.size.map((size, index) => (
        <option key={index} value={size}>
          {size}ml
        </option>
      ))
    ) : (
      <option value="10">10ml</option>
    )}
  </select>
  </div>
{/*   <div className="details-group">
    <label htmlFor="fragrance">FRAGRANCE</label>
    <select name="" id="group-size" onChange={handleFragranceChange}>
      <option value="">Select fragnance</option>
      <option value="Rose">Rose</option>
    </select>
  </div> */}
  <div className="details-group quantity">
  <div>
    <label htmlFor="fragrance">Quantity</label>
<input
      type="number"
      id="group-quantity"
      value={selectedQuantity}
      onChange={(e) => {
        const value = parseInt(e.target.value);
        const availableQty = selectedProduct?.quantity || 0;

        if (value > availableQty) {
          swal("Error!", `Only ${availableQty} item(s) left in stock.`, "error");
          setSelectedQuantity(availableQty); // optionally auto-correct it
        } else {
          setSelectedQuantity(isNaN(value) ? '' : value);
        }
      }}
      min={1}
      max={selectedProduct?.quantity || 1}
    />
</div>
<div>
<a className="add-to-cart"  onClick={() => addToCart(selectedProduct.title, selectedSize, selectedFragrance, selectedQuantity)}>ADD TO CART</a>
</div>
  </div>


  <div className="share-buttons">
    <a className="share-button" href="#">SHARE THIS PRODUCT</a>
  </div>
  <div className="share_product">
    <a href="#">
  <i className="bi bi-facebook" style={{ color: '#3b5998' }}></i>
</a>
<a href="#">
  <i className="bi bi-messenger" style={{ color: '#0078FF' }}></i>
</a>
<a href="#">
  <i className="bi bi-instagram" style={{ color: '#E4405F' }}></i>
</a>
<a href="#">
  <i className="bi bi-meta" style={{ color: '#00A6FB' }}></i>
</a>
<a href="#">
  <i className="bi bi-whatsapp" style={{ color: '#25D366' }}></i>
</a>
  </div>
</div>
  </div>
    </div>
      </BrandContainer>
    <Footer/>
    </>
  )
}

export default BrandComponent