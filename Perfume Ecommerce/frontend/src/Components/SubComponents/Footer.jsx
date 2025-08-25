import { useState, useEffect, useRef } from "react";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import logo from '../../images/logo.png'

const BASE_URL = 'http://localhost:4444';
const Image_Path_URL = 'http://localhost:4444/public/AllProducts/';

function Footer() {

    const [products, setProducts] = useState('');
    const [error, setError] = useState('');

    
    const sliderRef = useRef(null);
  
    
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
        })
        .catch(error => {
          console.error('Error:', error);
          setError(error.toString());
        });
    }, []); // Empty dependency array means this effect runs once after the initial render

    const sliderSettings4 = {
        arrows:false,
        dots: false,
        infinite: true,
        speed: 500,
        rows: 3,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true, // Enable autoplay
        autoplaySpeed: 4000, // Set autoplay speed in milliseconds (e.g., 2000 ms = 2 seconds)
        // variableWidth: true,
    
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 800,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
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

  return (
    <footer style={{marginTop:'6rem'}}>
        <div className='row'>
        <div className="column">
      <div className="logo"><img src={logo} alt="" /></div>
      <p>Get all types of perfume from us within 2 day delivery. We can even order the perfumes which are not in our database. To do that kindly send a E-mail to the company's mail id.</p>
      <address>
        International Buiness Center,<br />
        Vesu, Surat, Gujarat<br />
        email: <a href="mailto:deo@gmail.com">deo@gmail.com</a><br />
        Phone: <a href="tel:9856447394">918444495</a>
      </address>
    </div>
    <div className="column">
      <h3>INFORMATION</h3>
      <p>About Us</p>
      <p>Prices drop</p>
      <p>New products</p>
      <p>Best sales</p>
      <p>Terms & Conditions</p>
      <p>Gift Certificates</p>
      <p>My Account</p>
      <p>Order History</p>
      <p>Wish List</p>
      <p>Specials</p>
    </div>

    <div className="column">
    <h3>FEATURED PRODUCSTS</h3>
        <div className="sliderfeatureproducts">
    <Slider ref={sliderRef} {...sliderSettings4} >
           {products && products.map((product, index) => {
  if (product.role === "NewProducts Men") {
    return (
       <div className="product-listing">

        <div className="product-card" style={{ marginTop: '.6rem' }}>
          <img src={`${Image_Path_URL}${product.imageSrc}`} alt={product.title} className="product-image" />
          <div className="productinfohere">
            <div className="product-title">{product.title}</div>
            <div className="product-rating">
              {'★'.repeat(product.rating)}
            </div>
            <div className="product-price">
               <span className="product-price-old1" style={{textDecoration: 'line-through', color:'grey'}}>Rs. {product.priceNew}</span> Rs. {product.priceOld}
            </div>
          </div>
        </div>

    </div>
    );
  } 
})}

          </Slider>
          </div>
    </div>

    <div className="column">
        <h3>MOST VIEW PRODUCTS</h3>
        <div className="sliderfeatureproducts">
    <Slider ref={sliderRef} {...sliderSettings4} >
           {products && products.map((product, index) => {
  if (product.role === "NewProducts Women") {
    return (
       <div className="product-listing">

        <div className="product-card" style={{ marginTop: '.6rem' }}>
          <img src={`${Image_Path_URL}${product.imageSrc}`} alt={product.title} className="product-image" />
          <div className="productinfohere">
            <div className="product-title">{product.title}</div>
            <div className="product-rating">
              {'★'.repeat(product.rating)}
            </div>
            <div className="product-price">
               <span className="product-price-old1" style={{textDecoration: 'line-through', color:'grey'}}>Rs. {product.priceNew}</span> Rs. {product.priceOld}
            </div>
          </div>
        </div>

    </div>
    );
  } 
})}

          </Slider>
          </div>

    </div>
        </div>
        <div className='row2'>
        <h3>Order History</h3>
    


    <h3>Wish List</h3>



    <h3>Site Map</h3>



    <h3>Affiliate</h3>



    <h3>News Letter</h3>
        </div>
        <div className='row3'>
        <p>&copy; 2023 Your Company Name. All rights reserved.</p>
        </div>
    </footer>
  )
}

export default Footer