// const [slideshowData, setSlideshowData] = useState([]);

// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       const response = await fetch('http://localhost:4444/slideshowdata/');
//       const data = await response.json();
//       setSlideshowData(data);
//       // Other actions you want to perform after setting slideshowData
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   fetchData();
//   }, []);
// console.log(slideshowData);

import React, { useState, useEffect, useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import slider1 from "../../images/slider/slider1.jpg"
import slider2 from "../../images/slider/slider2.jpg"
import axios from 'axios';




function Slideshow() {

  const [slideshowData, setSlideshowData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:4444/slideshowdata/');
        const data = await response.json();
        setSlideshowData(data);
        setSelectedProduct(data[0]);
        // Other actions you want to perform after setting slideshowData
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchData();
    }, []);
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

  const [selectedProduct, setSelectedProduct] = useState(slideshowData[0]);
const [selectedIndex, setSelectedIndex] = useState(0);


const handleAddToCart = (productName, productPrice) => {
  console.log("Product added to cart:", productName);
  console.log("Product price:", productPrice);
};

const [mainImage, setMainImage] = useState(slideshowData.length > 0 ? `http://localhost:4444/${slideshowData[0].imageSrc.replace('public\\', '')}` : '');

const [thumbnailImages, setThumbnailImages] = useState(slideshowData.length > 0 ? [
  `http://localhost:4444/${slideshowData[0].imageSrc2.replace('public\\', '')}`,
  `http://localhost:4444/${slideshowData[0].imageSrc3.replace('public\\', '')}`
] : []);


  const handleThumbnailClick = (image) => {
    setMainImage(image);
  };

  function displayBlock(slide,index){
    document.getElementById("overlay1").style.display = "block";
  };

  function closeoverlay(){
    document.getElementById("overlay1").style.display = "none";
  }

  const handleProductClick = (slide, index) => {
    setMainImage(`http://localhost:4444/${slide.imageSrc.replace('public\\', '')}`);
    setThumbnailImages([
      `http://localhost:4444/${slide.imageSrc2.replace('public\\', '')}`,
      `http://localhost:4444/${slide.imageSrc3.replace('public\\', '')}`
    ]);
    displayBlock(slide, index); // Assuming displayBlock function is defined elsewhere
  };
  useEffect(() => {
    let slideIndex = 0;
    const showSlides = () => {
      let slides = document.getElementsByClassName("mySlides");
      if (slides && slides.length > 0) {
        for (let i = 0; i < slides.length; i++) {
          slides[i].style.display = "none";
        }
        slideIndex++;
        if (slideIndex > slides.length) {
          slideIndex = 1;
        }
        slides[slideIndex - 1].style.display = "block";
      } else {
        console.error("No slides found with the class name 'mySlides'");
      }
    };
    showSlides();

    // Cleanup function
    return () => clearTimeout();
  }, []);



  const nextSlide = () => {
    const newIndex = (selectedIndex + 1) % slideshowData.length;
    setSelectedIndex(newIndex);
    setSelectedProduct(slideshowData[newIndex]);
  };

  // Function to handle previous slide
  const prevSlide = () => {
    const newIndex = selectedIndex === 0 ? slideshowData.length - 1 : selectedIndex - 1;
    setSelectedIndex(newIndex);
    setSelectedProduct(slideshowData[newIndex]);
  };  



  const [selectedSize, setSelectedSize] = useState('');
const [selectedFragrance, setSelectedFragrance] = useState('');
const [selectedQuantity, setSelectedQuantity] = useState('');

// Function to handle size selection
const handleSizeChange = (event) => {
  setSelectedSize(event.target.value);
};

// Function to handle fragrance selection
const handleFragranceChange = (event) => {
  setSelectedFragrance(event.target.value);
};

// Function to handle quantity selection
const handleQuantityChange = (event) => {
  setSelectedQuantity(event.target.value);
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
    try {
        console.log(productName, size, fragrance, quantity); // Corrected logs
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

const [isExpanded, setIsExpanded] = useState(false);

const toggleDescription = () => {
  setIsExpanded(!isExpanded);
};




  return (
    <>
      <div className="slideshow-container">
        {slideshowData.map((slide, index) => (
          <div key={index} className={slide.classname} style={{ display: index === selectedIndex ? 'block' : 'none' }}>
            <img src={`http://localhost:4444/${slide.imageSrc.replace('public\\', '')}`} alt={`Slider ${slide.id}`} />
            <h1>{slide.title}</h1>
            <h2>{slide.subtitle}</h2>
            <p>{slide.description}</p>
            <button onClick={() => handleProductClick(slide,index)} className="ShopButton">Shop Now <i className='bi bi-arrow-right'></i></button>
            <button className="PreviousSlide" onClick={prevSlide}><i className='bi bi-arrow-left'></i></button>
        <button className="NextSlide" onClick={nextSlide}><i className='bi bi-arrow-right'></i></button>
          </div>
        ))}
        <hr />
      </div>
         <div className="overlay" id="overlay1">
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
      <div className="price" style={{ display: 'flex', gap: "1rem" }}>
  {selectedProduct.priceNew && (
    <p style={{ color: '#FF7A11' }}>Rs.{selectedProduct.priceNew}</p>
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
    <select name="" id="group-size" onChange={handleSizeChange}>
      <option value="">Select Size</option>
      <option value="10ml">10ml</option>
    </select>
  </div>
  <div className="details-group">
    <label htmlFor="fragrance">FRAGRANCE</label>
    <select name="" id="group-size" onChange={handleFragranceChange}>
      <option value="">Select fragnance</option>
      <option value="Rose">Rose</option>
    </select>
  </div>
  <div className="details-group quantity">
  <div>
    <label htmlFor="fragrance">Quantity</label>
    <select name="" id="group-size" onChange={handleQuantityChange}>
      <option value="">Select Quantity</option>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
    </select>
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
    </>
  );
}

export default Slideshow;

