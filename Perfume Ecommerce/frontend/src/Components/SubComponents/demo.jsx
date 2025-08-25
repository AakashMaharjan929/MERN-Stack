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
        setTimeout(showSlides, 12000); // Change image every 2 seconds
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



  return (
    <>
      <div className="slideshow-container">
        {slideshowData.map((slide, index) => (
          <div key={index} className={slide.classname} style={{ display: index === selectedIndex ? 'block' : 'none' }}>
            <img src={`http://localhost:4444/${slide.imageSrc.replace('public\\', '')}`} alt={`Slider ${slide.id}`} />
            <h1>{slide.title}</h1>
            <h2>{slide.subtitle}</h2>
            <p>{slide.description}</p>
            <button onClick={() => handleProductClick(slide,index)} className="ShopButton">Shop <i className='bi bi-arrow-right'></i></button>
            <button className="PreviousSlide" onClick={prevSlide}>Prev</button>
        <button className="NextSlide" onClick={nextSlide}>Next</button>
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
 <h2 className="title">{selectedProduct ? selectedProduct.title : 'Loading...'}</h2>
<div className="price">
  {selectedProduct ? selectedProduct.priceNew : 'Loading...'} 
  <strike>{selectedProduct ? selectedProduct.priceOld : ''}</strike>
</div>
<div className="description">
  {selectedProduct ? selectedProduct.description : 'Loading description...'}
</div>


 
  <div className="details-group">
    <label htmlFor="size">SIZE</label>
    <select name="" id="group-size">
      <option value="">Select Size</option>
      <option value="">10ml</option>
    </select>
  </div>
  <div className="details-group">
    <label htmlFor="fragrance">FRAGRANCE</label>
    <select name="" id="group-size">
      <option value="">Select fragnance</option>
      <option value="">Rose</option>
    </select>
  </div>
  <div className="details-group quantity">
    <label htmlFor="fragrance">Quantity</label>
    <select name="" id="group-size">
      <option value="">Select Quantity</option>
      <option value="">1</option>
      <option value="">2</option>
      <option value="">3</option>
      <option value="">4</option>
    </select>
  </div>
<a className="add-to-cart"  onClick={() => handleAddToCart(selectedProduct.title, selectedProduct.priceNew)}>ADD TO CART</a>

  <div className="share-buttons">
    <a className="share-button" href="#">SHARE THIS PRODUCT</a>
  </div>
  <div className="share_product">
    <a href="#"><i className="bi bi-facebook"></i></a>
    <a href="#"><i className="bi bi-messenger"></i></a>
    <a href="#"><i className="bi bi-instagram"></i></a>
    <a href="#"><i className="bi bi-meta"></i></a>
    <a href="#"><i className="bi bi-whatsapp"></i></a>
  </div>
</div>
  </div>
    </div>
    </>
  );
}

export default Slideshow;


import React, { useState, useEffect, useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import product1 from '../../images/products/Men/1-1.png';
import product2 from '../../images/products/Men/2-1.png';
import { ThumbnailSlider, ThumbnailSlider2 } from './ThumnailSlider.jsx';
import mainImg from '../../images/products/Men/2-1.png';
import thumbnail1 from '../../images/products/Men/3-1.png';
import thumbnail2 from '../../images/products/Men/4-1.png';
import thumbnail3 from '../../images/products/Men/1-1.png';



const products = [
  { 
    title: "JAGUAR CLASSIC BLACK1", 
    priceOld: "Rs. 3300", 
    priceNew: "Rs. 2046", 
    rating: 5,
    description: " Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate, sunt perspiciatis assumenda architecto cumque non, quia quisquam quae ut obcaecati cum excepturi accusamus sapiente numquam quibusdam eum sequi? Veniam esse, minus asperiores sed maxime placeat. Dicta, culpa blanditiis! Doloribus, totam.",
    imageSrc: product1,
    imageSrc2: product2,
    imageSrc3: product1,
  
  },
  { 
    title: "JAGUAR CLASSIC BLACK2", 
    priceOld: "Rs. 3300", 
    priceNew: "Rs. 2046", 
    rating: 5,
    description:" Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate, sunt perspiciatis assumenda architecto cumque non, quia quisquam quae ut obcaecati cum excepturi accusamus sapiente numquam quibusdam eum sequi? Veniam esse, minus asperiores sed maxime placeat. Dicta, culpa blanditiis! Doloribus, totam.",
    imageSrc: product1,
    imageSrc2: product1,
    imageSrc3: product1,
  
  },
  { 
    title: "JAGUAR CLASSIC BLACK3", 
    priceOld: "Rs. 3300", 
    priceNew: "Rs. 2046", 
    rating: 5,
    description:" Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate, sunt perspiciatis assumenda architecto cumque non, quia quisquam quae ut obcaecati cum excepturi accusamus sapiente numquam quibusdam eum sequi? Veniam esse, minus asperiores sed maxime placeat. Dicta, culpa blanditiis! Doloribus, totam.",
    imageSrc: product1,
    imageSrc2: product1,
    imageSrc3: product1,
  
  },
  { 
    title: "JAGUAR CLASSIC BLACK4", 
    priceOld: "Rs. 3300", 
    priceNew: "Rs. 2046", 
    rating: 5,
    description:" Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate, sunt perspiciatis assumenda architecto cumque non, quia quisquam quae ut obcaecati cum excepturi accusamus sapiente numquam quibusdam eum sequi? Veniam esse, minus asperiores sed maxime placeat. Dicta, culpa blanditiis! Doloribus, totam.",
    imageSrc: product1,
    imageSrc2: product1,
    imageSrc3: product1,
  
  },
  // Add more products with similar structure as needed
];



  


const NewProduct = () => {
  const [mainImage, setMainImage] = useState(products[0].imageSrc); // Use imageSrc from the first product 
  const [thumbnailImages, setThumbnailImages] = useState([products[0].imageSrc2, products[0].imageSrc3]); // Use imageSrc2 and imageSrc3 from the first product in the array
  const handleThumbnailClick = (image) => {
    setMainImage(image);
  };
  const sliderRef = useRef(null);

  function displayBlock(product,index){
    document.getElementById("overlay").style.display = "block";
  };

  function closeoverlay(){
    document.getElementById("overlay").style.display = "none";
  }






  const [selectedCategory, setSelectedCategory] = useState('men');





  useEffect(() => {
    // Your code here to run after the initial render
  }, []); // Empty dependency array ensures this effect runs only once after initial render

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const sliderSettings = {
    arrows:false,
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
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

const handleProductClick = (product, index) => {
  setSelectedProduct(product);
  setSelectedIndex(index);
  setMainImage(product.imageSrc); // Update mainImage with the clicked product's imageSrc
  setThumbnailImages([product.imageSrc2, product.imageSrc3]); // Update thumbnailImages with the clicked product's imageSrc2 and imageSrc3
  displayBlock(product, index);
};
const handleAddToCart = (productName, productPrice) => {
  console.log("Product added to cart:", productName);
  console.log("Product price:", productPrice);
};


  return (
    <>
    <div className="new-product">
      <h1>
        <i className="bi bi-dash-lg"></i> New Product{' '}
        <i className="bi bi-dash-lg"></i>
      </h1>
      <div className="categories">
        <button
          className={`rv_button ${
            selectedCategory === 'men' ? 'rv_button_opened' : 'rv_button_closed'
          }`}
          onClick={() => handleCategoryChange('men')}
        >
          Men
        </button>
        <button
          className={`rv_button ${
            selectedCategory === 'women' ? 'rv_button_opened' : 'rv_button_closed'
          }`}
          onClick={() => handleCategoryChange('women')}
        >
          Women
        </button>
        <button
          className={`rv_button ${
            selectedCategory === 'unisex' ? 'rv_button_opened' : 'rv_button_closed'
          }`}
          onClick={() => handleCategoryChange('unisex')}
        >
          Unisex
        </button>
      </div>
      <div className="slider_buttons">
          <button onClick={() => sliderRef.current.slickPrev()}>Previous Slide</button>
          <button onClick={() => sliderRef.current.slickNext()}>Next Slide</button>
        </div>
      <div className={`products rv_element rv_element_${selectedCategory}`}>
        {selectedCategory === 'men' && (

          <Slider ref={sliderRef} {...sliderSettings} >
           {products.map((product, index) => (
        <div key={index} className="slide">
          <div className="slide_featuress" id="futuristics">
            <i className="bi bi-cart-fill"></i><br/>
            <i className="bi bi-heart"></i> <br/>
            <i className="bi bi-shuffle"></i><br/>
            <i className="bi bi-eye-fill" onClick={() => handleProductClick(product,index)}></i>
          </div>
          <img src={product1} alt="Product image" />
          <div className="product-info">
            <h2 className="product-title">{product.title}</h2>
            <p className="product-details">
              <span className="product-price-old">{product.priceOld}</span>
              <span className="product-price-new">{product.priceNew}</span>
            </p>
            <div className="product-rating">
              {[...Array(product.rating)].map((_, i) => (
                <span key={i} className="star">★</span>
              ))}
            </div>
          </div>
        </div>
      ))}
          </Slider>

        )}
        {selectedCategory === 'women' && (
            <Slider {...sliderSettings}>
            <div className="slide">
              <img src={product1} alt="Product image" />
              <div className="product-info">
                <h2 className="product-title">JAGUAR CLASSIC BLACK1</h2>
                <p className="product-details">
                  <span className="product-price-old">Rs. 3300</span>
                  <span className="product-price-new">Rs. 2046</span>
                </p>
                <div className="product-rating">
                  <span className="star">★</span>
                  <span className="star">★</span>
                  <span className="star">★</span>
                  <span className="star">★</span>
                  <span className="star">★</span>
                </div>
              </div>
            </div>
            {/* Add more slides here */}
            <div className="slide">
              <img src={product1} alt="Product image" />
              <div className="product-info">
                <h2 className="product-title">JAGUAR CLASSIC BLACK2</h2>
                <p className="product-details">
                  <span className="product-price-old">Rs. 3300</span>
                  <span className="product-price-new">Rs. 2046</span>
                </p>
                <div className="product-rating">
                  <span className="star">★</span>
                  <span className="star">★</span>
                  <span className="star">★</span>
                  <span className="star">★</span>
                  <span className="star">★</span>
                </div>
              </div>
            </div>
            {/* Add more slides here */}
            <div className="slide">
              <img src={product1} alt="Product image" />
              <div className="product-info">
                <h2 className="product-title">JAGUAR CLASSIC BLACK3</h2>
                <p className="product-details">
                  <span className="product-price-old">Rs. 3300</span>
                  <span className="product-price-new">Rs. 2046</span>
                </p>
                <div className="product-rating">
                  <span className="star">★</span>
                  <span className="star">★</span>
                  <span className="star">★</span>
                  <span className="star">★</span>
                  <span className="star">★</span>
                </div>
              </div>
            </div>
            {/* Add more slides here */}
            <div className="slide">
              <img src={product1} alt="Product image" />
              <div className="product-info">
                <h2 className="product-title">JAGUAR CLASSIC BLACK4</h2>
                <p className="product-details">
                  <span className="product-price-old">Rs. 3300</span>
                  <span className="product-price-new">Rs. 2046</span>
                </p>
                <div className="product-rating">
                  <span className="star">★</span>
                  <span className="star">★</span>
                  <span className="star">★</span>
                  <span className="star">★</span>
                  <span className="star">★</span>
                </div>
              </div>
            </div>
          </Slider>
        )}
        {selectedCategory === 'unisex' && (
            <Slider {...sliderSettings}>
            <div className="slide">
              <img src={product1} alt="Product image" />
              <div className="product-info">
                <h2 className="product-title">JAGUAR CLASSIC BLACK1</h2>
                <p className="product-details">
                  <span className="product-price-old">Rs. 3300</span>
                  <span className="product-price-new">Rs. 2046</span>
                </p>
                <div className="product-rating">
                  <span className="star">★</span>
                  <span className="star">★</span>
                  <span className="star">★</span>
                  <span className="star">★</span>
                  <span className="star">★</span>
                </div>
              </div>
            </div>
            {/* Add more slides here */}
            <div className="slide">
              <img src={product1} alt="Product image" />
              <div className="product-info">
                <h2 className="product-title">JAGUAR CLASSIC BLACK2</h2>
                <p className="product-details">
                  <span className="product-price-old">Rs. 3300</span>
                  <span className="product-price-new">Rs. 2046</span>
                </p>
                <div className="product-rating">
                  <span className="star">★</span>
                  <span className="star">★</span>
                  <span className="star">★</span>
                  <span className="star">★</span>
                  <span className="star">★</span>
                </div>
              </div>
            </div>
            {/* Add more slides here */}
            <div className="slide">
              <img src={product1} alt="Product image" />
              <div className="product-info">
                <h2 className="product-title">JAGUAR CLASSIC BLACK3</h2>
                <p className="product-details">
                  <span className="product-price-old">Rs. 3300</span>
                  <span className="product-price-new">Rs. 2046</span>
                </p>
                <div className="product-rating">
                  <span className="star">★</span>
                  <span className="star">★</span>
                  <span className="star">★</span>
                  <span className="star">★</span>
                  <span className="star">★</span>
                </div>
              </div>
            </div>
            {/* Add more slides here */}
            <div className="slide">
              <img src={product1} alt="Product image" />
              <div className="product-info">
                <h2 className="product-title">JAGUAR CLASSIC BLACK4</h2>
                <p className="product-details">
                  <span className="product-price-old">Rs. 3300</span>
                  <span className="product-price-new">Rs. 2046</span>
                </p>
                <div className="product-rating">
                  <span className="star">★</span>
                  <span className="star">★</span>
                  <span className="star">★</span>
                  <span className="star">★</span>
                  <span className="star">★</span>
                </div>
              </div>
            </div>
          </Slider>
          
        )}
      </div>
      
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
  <h2 className="title">{selectedProduct.title}</h2> {/* Display title */}
      <div className="price">{selectedProduct.priceNew} <strike>{selectedProduct.priceOld}</strike></div> {/* Display price */}
      <div className="description">
        {selectedProduct.description}
      </div> {/* Display description */}
  <div className="details-group">
    <label htmlFor="size">SIZE</label>
    <select name="" id="group-size">
      <option value="">Select Size</option>
      <option value="">10ml</option>
    </select>
  </div>
  <div className="details-group">
    <label htmlFor="fragrance">FRAGRANCE</label>
    <select name="" id="group-size">
      <option value="">Select fragnance</option>
      <option value="">Rose</option>
    </select>
  </div>
  <div className="details-group quantity">
    <label htmlFor="fragrance">Quantity</label>
    <select name="" id="group-size">
      <option value="">Select Quantity</option>
      <option value="">1</option>
      <option value="">2</option>
      <option value="">3</option>
      <option value="">4</option>
    </select>
  </div>
<a className="add-to-cart"  onClick={() => handleAddToCart(selectedProduct.title, selectedProduct.priceNew)}>ADD TO CART</a>

  <div className="share-buttons">
    <a className="share-button" href="#">SHARE THIS PRODUCT</a>
  </div>
  <div className="share_product">
    <a href="#"><i className="bi bi-facebook"></i></a>
    <a href="#"><i className="bi bi-messenger"></i></a>
    <a href="#"><i className="bi bi-instagram"></i></a>
    <a href="#"><i className="bi bi-meta"></i></a>
    <a href="#"><i className="bi bi-whatsapp"></i></a>
  </div>
</div>
  </div>
    </div>
   </>
  );
};

export default NewProduct;






