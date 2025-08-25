import { useState, useEffect, useRef } from "react";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import bannerlong from '../../../public/banner-long.jpg';
import banner4 from '../../../public/banner4.png';
import banner5 from '../../../public/banner5.jpg';

const BASE_URL = 'http://localhost:4444';
const Image_Path_URL = 'http://localhost:4444/public/AllProducts/';
import axios from "axios";
import Swal from 'sweetalert2';
import swal from 'sweetalert';

const HotDealsAndNewProducts = () => {

  const testimonialData = [
    {
      name: "Asaroth",
      imageSrc: "../../public/testimonial1.jpg"
    },
    {
      name: "Shakira",
      imageSrc: "../../public/testimonial2.jpg"
    },
    {
      name: "Haryy",
      imageSrc: "../../public/testimonial3.jpg"
    }
  ];

    const [products, setProducts] = useState('');
    const [error, setError] = useState('');
  
    
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

    const [mainImage, setMainImage] = useState(products.length > 0 ? products[0].imageSrc : ''); 
    const [thumbnailImages, setThumbnailImages] = useState(products.length > 0 ? [products[0].imageSrc2, products[0].imageSrc3] : []);
  
    const handleThumbnailClick = (image) => {
      setMainImage(image);
    };
  
    function displayBlock(product,index){
      document.getElementById("overlay7").style.display = "block";
    };

    function closeoverlay(){
      document.getElementById("overlay7").style.display = "none";
    }
    function displayBlock(product,index){
      document.getElementById("overlay8").style.display = "block";
    };

    function closeoverlay(){
      document.getElementById("overlay8").style.display = "none";
    }
    function displayBlock(product,index){
      document.getElementById("overlay9").style.display = "block";
    };

    function closeoverlay(){
      document.getElementById("overlay9").style.display = "none";
    }

    const [selectedProduct, setSelectedProduct] = useState(products[0]);
const [selectedIndex, setSelectedIndex] = useState(0);

const handleProductClick = (product, index) => {
  setSelectedProduct(product);
  setSelectedIndex(index);
  setMainImage(`${Image_Path_URL}/${product.imageSrc}`); // Update mainImage with the clicked product's imageSrc
  setThumbnailImages([`${Image_Path_URL}/${product.imageSrc2}`, `${Image_Path_URL}/${product.imageSrc3}`]); // Update thumbnailImages with the clicked product's imageSrc2 and imageSrc3
  displayBlock(product, index);
};


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
        breakpoint: 1030,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2 ,
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
    
    const sliderSettings2 = {
        arrows:false,
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true, // Enable autoplay
        autoplaySpeed: 4000, // Set autoplay speed in milliseconds (e.g., 2000 ms = 2 seconds)
        // variableWidth: true,
    
        responsive: [
          {
            breakpoint: 1030,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
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
    
    
    const sliderSettings3 = {
        arrows:false,
        dots: false,
        infinite: true,
        speed: 500,
        rows: 2,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true, // Enable autoplay
        autoplaySpeed: 4000, // Set autoplay speed in milliseconds (e.g., 2000 ms = 2 seconds)
        // variableWidth: true,
    
        responsive: [
          {
            breakpoint: 1030,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
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
    

      const sliderRef1 = useRef(null);
      const sliderRef2 = useRef(null);
      const sliderRef3 = useRef(null);
      const sliderRef4 = useRef(null);
      const sliderRef5 = useRef(null);
      const sliderRef = useRef(null);

      // bannerstart
      const [slideIndex, setSlideIndex] = useState(0);

      // Array of image sources
      const images = [
        '../../../public/banner-long.jpg',
        '../../../public/banner4.png',
        '../../../public/banner5.jpg'
      ];
    
      useEffect(() => {
        const interval = setInterval(() => {
          setSlideIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 2000);
    
        return () => clearInterval(interval);
      }, [images.length]);
      // bannerclose

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
      swal("Success", "Item added to cart successfully", "success");

          
        } catch (error) {
            console.error(error);
            alert('Failed to add item to cart');
        }
      };

      const addToFavourite = async (title, priceOld, priceNew, description, imageSrc, imageSrc2, imageSrc3) => {
        try {
            console.log(title, priceOld, priceNew, description, imageSrc, imageSrc2, imageSrc3); 
            const response = await axios.post(`http://localhost:4444/signup/favorite/${name}`, {
              title: title,
              priceOld: priceOld,
              priceNew: priceNew,
              description: description,
              imageSrc: imageSrc,
              imageSrc2: imageSrc2,
              imageSrc3: imageSrc3
          });
          console.log(response.data); // Logging response for debugging
          alert('Item added to cart successfully');
        } catch (error) {
            console.error(error);
            alert('Failed to add item to cart');
        }
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

const [showImages, setShowImages] = useState(Array(products.length).fill(true));

const toggleImages = (index) => {
    const newShowImages = [...showImages];
    newShowImages[index] = !newShowImages[index];
    setShowImages(newShowImages);
};

const [isExpanded, setIsExpanded] = useState(true);

const toggleDescription = () => {
  setIsExpanded(!isExpanded);
};




    return(
        <>
         <div className="hotdealsandnewproducts">
            <div className="left2">
            <h1>Hot Deals   <div className="slider_buttons1">
          <button onClick={() => sliderRef1.current.slickPrev()}> <i className='bi bi-arrow-left'></i> </button>
          <button onClick={() => sliderRef1.current.slickNext()}> <i className='bi bi-arrow-right'></i> </button>
        </div> </h1>
          
            
          <Slider ref={sliderRef1} {...sliderSettings} >
           {products && products.map((product, index) => {
  if (product.role === "HotDeals") {
    return (
      <div key={index} className="slide">
        <div className="slide_featuress" id="futuristics">
          {/* <i className="bi bi-cart-fill"onClick={() => handleProductClick(product,index)}></i><br/> */}
          <i className="bi bi-heart" onClick={() => addToFavourite(product.title, product.priceOld, product.priceNew, product.description, product.imageSrc, product.imageSrc2, product.imageSrc3)} id='heart'></i> <br/>
          <i className="bi bi-shuffle" onClick={() => toggleImages(index)}></i><br />
          <i className="bi bi-eye-fill" onClick={() => handleProductClick(product,index)}></i>
        </div>
        <img src={`${Image_Path_URL}${showImages[index] ? product.imageSrc2 : product.imageSrc}`} alt="Product image" />
        <div className="product-info">
          <h2 className="product-title">{product.title}</h2>
          <div className="product-brand">
          <h3>{product.brandName}</h3>
          <h3>Duration: {product.duration}hrs</h3>
          </div>
          <div id="product-ratings">
          <p className="product-details">
            <span className="product-price-old">Rs.{product.priceOld}</span>
            <span className="product-price-new">Rs.{product.priceNew}</span>
          </p>
          <div className="product-rating">
            {[...Array(product.rating)].map((_, i) => (
              <span key={i} className="star">★</span>
            ))}
          </div>
          </div>
        </div>
      </div>
    );
  } 
})}

          </Slider>

          <div className="containerofbestseller">
          <h1 className="bestsellertitle1">Best Sellers <div className="slider_buttons1">
          <button onClick={() => sliderRef2.current.slickPrev()}> <i className='bi bi-arrow-left'></i> </button>
          <button onClick={() => sliderRef2.current.slickNext()}> <i className='bi bi-arrow-right'></i> </button>
        </div> </h1>
             <Slider ref={sliderRef2} {...sliderSettings4} className="bestSeller">
           {products && products.map((product, index) => {
  if (product.role === "BestSellers") {
    return (
       <div className="product-listing">

        <div className="product-card" style={{ marginTop: '.6rem' }}>
          <img src={`${Image_Path_URL}${product.imageSrc}`} alt={product.title} className="product-image" onClick={() => handleProductClick(product,index)}/>
          <div className="productinfohere">
            <div className="product-title" onClick={() => handleProductClick(product,index)}>{product.title}</div>
            <div className="product-rating">
              {'★'.repeat(product.rating)}
            </div>
            <div className="product-price">
               <span className="product-price-old1" style={{textDecoration: 'line-through', color:'grey'}}>Rs. {product.priceOld}</span> Rs. {product.priceNew}
            </div>
          </div>
        </div>

    </div>
    );
  } 
})}

          </Slider>
          </div>

          {/* <div className="containeroftestimonials">
            <h1>Testimonials <div className="slider_buttons1">
          <button onClick={() => sliderRef3.current.slickPrev()}> <i className='bi bi-arrow-left'></i> </button>
          <button onClick={() => sliderRef3.current.slickNext()}> <i className='bi bi-arrow-right'></i> </button>
        </div> </h1>
            <Slider ref={sliderRef3} {...sliderSettings} >
           {testimonialData && testimonialData.map((product, index) => {

    return (
      <div className="slidetestimonials" id={`product_${index}`}>
      <img src={product.imageSrc} alt="Product image" />
      <div className="product-info">
        <h2 className="product-title">{product.name}</h2>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laborum quisquam doloribus deleniti esse. Quod
          dignissimos, tenetur nam ab eveniet asperiores.
        </p>
      </div>
    </div>
    );
})}

          </Slider>
          </div> */}
            </div>
            <div className="right2">
              <h1>New Products <div className="slider_buttons2">
          <button onClick={() => sliderRef4.current.slickPrev()}> <i className='bi bi-arrow-left'></i> </button>
          <button onClick={() => sliderRef4.current.slickNext()}> <i className='bi bi-arrow-right'></i> </button>
        </div> </h1>
              <Slider ref={sliderRef4} {...sliderSettings2} >
           {products && products.map((product, index) => {
  if (product.role === "NewProducts") {
    return (
      <div key={index} className="slide">
        <div className="slide_featuress" id="futuristics">
          {/* <i className="bi bi-cart-fill" onClick={() => handleProductClick(product,index)}></i><br/> */}
          <i className="bi bi-heart" onClick={() => addToFavourite(product.title, product.priceOld, product.priceNew, product.description, product.imageSrc, product.imageSrc2, product.imageSrc3)} id='heart'></i> <br/>
          <i className="bi bi-shuffle" onClick={() => toggleImages(index)}></i><br />
          <i className="bi bi-eye-fill" onClick={() => handleProductClick(product,index)}></i>
        </div>
        <img src={`${Image_Path_URL}${showImages[index] ? product.imageSrc2 : product.imageSrc}`} alt="Product image" />
        <div className="product-info">
          <h2 className="product-title">{product.title}</h2>
          <div className="product-brand">
          <h3>{product.brandName}</h3>
          <h3>Duration: {product.duration}hrs</h3>
          </div>
          <div id="product-ratings">
          <p className="product-details">
            <span className="product-price-old">Rs.{product.priceOld}</span>
            <span className="product-price-new">Rs.{product.priceNew}</span>
          </p>
          <div className="product-rating">
            {[...Array(product.rating)].map((_, i) => (
              <span key={i} className="star">★</span>
            ))}
          </div>
          </div>
        </div>
      </div>
    );
  } 
})}

          </Slider>

          <div className="overlay" id="overlay8">
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
          <div className="price">
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
          {selectedProduct.description && ( // Check if description exists
            <div className="description">{selectedProduct.description}</div>
          )}
            {selectedProduct.title && ( // Check if title exists
            <h2 className="quantityLeft">Quantity left: {selectedProduct.quantity}pcs</h2>
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
<a
  className={`add-to-cart ${selectedProduct?.quantity <= 0 ? 'disabled' : ''}`}
  onClick={() => {
    if (selectedProduct?.quantity <= 0) return; // Prevent click if sold out
    if (!selectedSize || !selectedQuantity) {
      swal("Error!", "Please select both size and quantity.", "error");
      return;
    }
    addToCart(selectedProduct.title, selectedSize, selectedFragrance, selectedQuantity);
  }}
  style={{
    backgroundColor: selectedProduct?.quantity <= 0 ? 'gray' : '',
    pointerEvents: selectedProduct?.quantity <= 0 ? 'none' : 'auto',
    cursor: selectedProduct?.quantity <= 0 ? 'not-allowed' : 'pointer'
  }}
>
  {selectedProduct?.quantity <= 0 ? 'SOLD OUT' : 'ADD TO CART'}
</a>


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

          <div className="bannerhere">
      {images.map((image, index) => (
        <div key={index} className="mySlides2" style={{ display: index === slideIndex ? 'block' : 'none' }}>
          <img src={image} alt="" />
        </div>
      ))}
          </div>

          <h1>On Sale <div className="slider_buttons2">
          <button onClick={() => sliderRef5.current.slickPrev()}> <i className='bi bi-arrow-left'></i> </button>
          <button onClick={() => sliderRef5.current.slickNext()}> <i className='bi bi-arrow-right'></i> </button>
        </div> </h1>
          <Slider ref={sliderRef5} {...sliderSettings3} >
           {products && products.map((product, index) => {
  if (product.role === "OnSale") {
    return (
      <div key={index} className="slide">
        <div className="slide_featuress" id="futuristics">
          {/* <i className="bi bi-cart-fill" onClick={() => handleProductClick(product,index)}></i><br/> */}
          <i className="bi bi-heart" onClick={() => addToFavourite(product.title, product.priceOld, product.priceNew, product.description, product.imageSrc, product.imageSrc2, product.imageSrc3)} id='heart'></i> <br/>
          <i className="bi bi-shuffle" onClick={() => toggleImages(index)}></i><br />
          <i className="bi bi-eye-fill" onClick={() => handleProductClick(product,index)}></i>
        </div>
        <img src={`${Image_Path_URL}${showImages[index] ? product.imageSrc2 : product.imageSrc}`} alt="Product image" />
        <div className="product-info">
          <h2 className="product-title">{product.title}</h2>
          <div className="product-brand">
          <h3>{product.brandName}</h3>
          <h3>Duration: {product.duration}hrs</h3>
          </div>
          <div id="product-ratings">
          <p className="product-details">
            <span className="product-price-old">Rs.{product.priceOld}</span>
            <span className="product-price-new">Rs.{product.priceNew}</span>
          </p>
          <div className="product-rating">
            {[...Array(product.rating)].map((_, i) => (
              <span key={i} className="star">★</span>
            ))}
          </div>
          </div>
        </div>
      </div>
    );
  } 
})}

          </Slider>

          <div className="overlay" id="overlay9">
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
        {selectedProduct.title && ( // Check if title exists
            <h2 className="quantityLeft">Quantity left: {selectedProduct.quantity}pcs</h2>
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
<a
  className={`add-to-cart ${selectedProduct?.quantity <= 0 ? 'disabled' : ''}`}
  onClick={() => {
    if (selectedProduct?.quantity <= 0) return; // Prevent click if sold out
    if (!selectedSize || !selectedQuantity) {
      swal("Error!", "Please select both size and quantity.", "error");
      return;
    }
    addToCart(selectedProduct.title, selectedSize, selectedFragrance, selectedQuantity);
  }}
  style={{
    backgroundColor: selectedProduct?.quantity <= 0 ? 'gray' : '',
    pointerEvents: selectedProduct?.quantity <= 0 ? 'none' : 'auto',
    cursor: selectedProduct?.quantity <= 0 ? 'not-allowed' : 'pointer'
  }}
>
  {selectedProduct?.quantity <= 0 ? 'SOLD OUT' : 'ADD TO CART'}
</a>

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
            </div>
         </div>
         <div className="overlay" id="overlay7">
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
          <div className="price">
            {selectedProduct.priceNew && ( // Check if priceNew exists
              <>
                {selectedProduct.priceNew}{' '}
                {selectedProduct.priceOld && ( // Check if priceOld exists
                  <strike>{selectedProduct.priceOld}</strike>
                )}
              </>
            )}
          </div>
          {selectedProduct.description && ( // Check if description exists
            <div className="description">{selectedProduct.description}</div>
          )}
            {selectedProduct.title && ( // Check if title exists
            <h2 className="quantityLeft">Quantity left: {selectedProduct.quantity}pcs</h2>
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
<a
  className={`add-to-cart ${selectedProduct?.quantity <= 0 ? 'disabled' : ''}`}
  onClick={() => {
    if (selectedProduct?.quantity <= 0) return; // Prevent click if sold out
    if (!selectedSize || !selectedQuantity) {
      swal("Error!", "Please select both size and quantity.", "error");
      return;
    }
    addToCart(selectedProduct.title, selectedSize, selectedFragrance, selectedQuantity);
  }}
  style={{
    backgroundColor: selectedProduct?.quantity <= 0 ? 'gray' : '',
    pointerEvents: selectedProduct?.quantity <= 0 ? 'none' : 'auto',
    cursor: selectedProduct?.quantity <= 0 ? 'not-allowed' : 'pointer'
  }}
>
  {selectedProduct?.quantity <= 0 ? 'SOLD OUT' : 'ADD TO CART'}
</a>


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
    )
}

export default HotDealsAndNewProducts;