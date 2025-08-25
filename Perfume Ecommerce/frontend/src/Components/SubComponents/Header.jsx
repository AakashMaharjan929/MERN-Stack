import React, { useState, useEffect, useRef } from 'react';
import logo from '../../images/logo.png'
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import swal from 'sweetalert';


const BASE_URL = 'http://localhost:4444';
const Image_URL = 'http://localhost:4444/public/AllProducts/';

function myFunction() {
    var x = document.getElementById("myTopnav");
    x.classList.toggle("responsive");
  }


function Header() {
 
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



  const handleGoToDeliveryStatus = () => {
    navigate('/delivery-status');
  };


  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [withCredentials, setWithCredentials] = useState(true);
  const navigate = useNavigate();
  axios.defaults.withCredentials = withCredentials;
  useEffect(() => {
  axios.get('http://localhost:4444/check')
    .then(response => {
      if(response.data.valid) {
        axios.get('http://localhost:4444/signup/details')
        .then(response => {
          if(response.data.username != "Admin"){
          setName(response.data.username);
          setEmail(response.data.email);
          setPhone(response.data.phone);
    
          setAuthenticated(true);
          }
        })
       
      } 
      // else {
      //   navigate('/');
      // }
    })
    .catch(error => {
      console.log(error);
    });
}, [withCredentials, navigate]);



const [isExpanded, setIsExpanded] = useState(true);

const toggleDescription = () => {
  setIsExpanded(!isExpanded);
};


const [cartItems, setCartItems] = useState([]);

useEffect(() => {
  const fetchData = () => {
    if (name) {
      fetch(`http://localhost:4444/signup/getcart/${name}`, {
        method: 'GET',
        credentials: 'include',
      })
      .then(response => response.json())
      .then(data => {
        if (data.cart) {
          const updatedCartItems = [...data.cart];
          const fetchPromises = data.cart.map(item => {
            return fetch(`http://localhost:4444/allproducts/search?title=${encodeURIComponent(item.productName)}`, {
              method: 'GET'
            })
            .then(response => response.json())
            .then(productData => {
              if (productData.length > 0) {
                item.imageSrc = productData[0].imageSrc;
              }
            })
            .catch(error => {
              console.log('Error fetching product details:', error);
            });
          });

          Promise.all(fetchPromises)
            .then(() => {
              setCartItems(updatedCartItems);
            })
            .catch(error => {
              console.log('Error updating cart items:', error);
            });
        }
      })
      .catch(error => {
        console.log('Error fetching cart items:', error);
      });
    }
  };

  fetchData();

  const intervalId = setInterval(fetchData, 2000);

  return () => clearInterval(intervalId);
}, [name]);







const [favoriteItems, setFavoriteItems] = useState([]);

useEffect(() => {
  const fetchDatafavourite = () => {
    // Fetch cart items from backend API
    if (name) { // Check if name is truthy
      fetch(`http://localhost:4444/signup/getfavorite/${name}`, {
        method: 'GET',
        credentials: 'include', // Include credentials for session handling
      })
      .then(response => response.json())
      .then(data => {
        if (data.favorite) {
          setFavoriteItems(data.favorite);
          console.log(data.favorite);
          
          // Fetch individual product details including image
        }
      })
      .catch(error => {
        console.log('Error fetching cart items:', error);
      });
    }
  };

  // Fetch data initially
  fetchDatafavourite();

  // Fetch data every 5 seconds
  const intervalId = setInterval(fetchDatafavourite, 5000);

  // Clean up interval on component unmount
  return () => clearInterval(intervalId);
}, [name]);

 // overlay
 const [selectedProduct, setSelectedProduct] = useState(favoriteItems[0]);
 const [selectedIndex, setSelectedIndex] = useState(0);
 
 const [mainImage, setMainImage] = useState(favoriteItems.length > 0 ? favoriteItems[0].imageSrc : ''); 
 const [thumbnailImages, setThumbnailImages] = useState(favoriteItems.length > 0 ? [favoriteItems[0].imageSrc2, favoriteItems[0].imageSrc3] : []);

 const handleThumbnailClick = (image) => {
   setMainImage(image);
 };

 function displayBlock(product,index){
   document.getElementById("overlay3").style.display = "block";
 };

 function closeoverlay(){
   document.getElementById("overlay3").style.display = "none";
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

 const handleQuantityChange = (event) => {
  setSelectedQuantity(event.target.value);
  console.log(event.target.value);
};




const handleProductClick = (product, index) => {
 setSelectedProduct(product);
 setSelectedIndex(index);
 setMainImage(`${Image_URL}/${product.imageSrc}`); // Update mainImage with the clicked product's imageSrc
 setThumbnailImages([`${Image_URL}/${product.imageSrc2}`, `${Image_URL}/${product.imageSrc3}`]); // Update thumbnailImages with the clicked product's imageSrc2 and imageSrc3
 displayBlock(product, index);
};
const handleAddToCart = (productName, productPrice) => {
 console.log("Product added to cart:", productName);
 console.log("Product price:", productPrice);
 fetchData();
};



 // overlay



  const handleLogout = () => {
    // Perform any additional logout logic here, such as clearing user-related data
    setWithCredentials(false); // Disable sending cookies with subsequent requests
    setAuthenticated(false); // Reset the authentication state
    setName(''); // Clear the user name
    setEmail(''); // Clear the user email
    setPhone(''); // Clear the user email
    axios.post('http://localhost:4444/check/logout')
    .then(response => {
      // Assuming your server responds with success
      console.log('Logout successful');
      window.location.reload();
    })
    .catch(error => {
      console.error('Error logging out:', error);
    });

  navigate('/'); // Redirect the user to the home page or login page

  };

  
  const searchInputRef = useRef(null);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const handleInputChange = function(event) {
      const searchInput = event.target.value;
      if (!searchInput) {
        // Clear search results when search input is empty
        setSearchResults([]);
        return;
      }

      // Fetch products based on search input
      fetch(`http://localhost:4444/allproducts/search?title=${searchInput}`)
        .then(response => response.json())
        .then(data => {
          setSearchResults(data);
        })
        .catch(error => console.error('Error:', error));
    };

    const searchInput = searchInputRef.current;
    if (searchInput) {
      searchInput.addEventListener('input', handleInputChange); // Add input event listener
    }
  

    // Cleanup function to remove the event listener
    return () => {
      if (searchInput) {
        searchInput.removeEventListener('input', handleInputChange); // Remove input event listener
      }
    };
  }, []);

  const handleFormSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    // You can add additional logic here if needed
  };


  const deleteProduct = (title) => {
    axios.post(`${BASE_URL}/signup/deletefavorite`,{ title: title, username: name }, {
    }).then(response => {
swal({
  title: "Deleted!",
  text: "Product deleted successfully",
  icon: "success",
  buttons: false,
  timer: 1500,
  dangerMode: true,  // makes the button red if you use buttons, but here no buttons shown
});
    }).catch(error => {
        console.log(error);
    });
  }
  const deleteProductCart = (productName) => {
    axios.post(`${BASE_URL}/signup/deletecart`,{ productName: productName, username: name }, {
    }).then(response => {
swal({
  title: "Deleted!",
  text: "Product deleted successfully",
  icon: "success",
  buttons: false,
  timer: 1500,
  dangerMode: true,  // makes the button red if you use buttons, but here no buttons shown
});
    }).catch(error => {
        console.log(error);
    });
  }

  
  return (
    <header className="header">
  <div className="topnav" id="myTopnav">
    <div className="logo-img">
      <a href="#"><img src={logo} alt="" /></a>
    </div>
    <div className="menu">
      <div className="menulink">
      <a href="/" className="active">Home</a>
      <div className="dropdown">
        <button className="dropbtn">Brands
          <i className="bi bi-cheveron-down"></i>
        </button>
        <div className="dropdown-content">
          <ul>Men
            <li><a href="/brand/Versace">Versace</a></li>
            <li><a href="/brand/Chanel">Chanel</a></li>
            <li><a href="product.html?brand=Jaguar">Jaguar</a></li>
            <li><a href="product.html?brand=Armani">Armani</a></li>
            <li><a href="#">Paco Rabbane</a></li>
            <li><a href="#">Ralph Lauren</a></li>
          </ul>
          <ul>Women
            <li><a href="#">Bvlgari</a></li>
            <li><a href="#">Coach</a></li>
            <li><a href="#">Kenzo</a></li>
            <li><a href="#">D&G</a></li>
            <li><a href="#">Jean Paul Gaultier</a></li>
          </ul>
          <ul>Unisex
            <li><a href="#">Ajmal</a></li>
            <li><a href="#">Calvin Klein</a></li>
            <li><a href="#">The Body Shop</a></li>
            <li><a href="#">Lattafa</a></li>
          </ul>
        </div>
      </div>
      {/* <a href="blog.html">Blog</a> */}
      <a href="/aboutus">About Us</a>
      <a href='/contact'>Contact Us</a>
      </div>
      <div className="menu-search">
        <div className="searchshow">
          <a><i className="bi bi-search"></i></a>
          <form id="searchForm" onSubmit={handleFormSubmit}>
          <input type="text" placeholder="Your favourite Perfume" ref={searchInputRef} id="searchInput" />

          </form>
          <div className="search_box" id='products1'>
            <p>Your search results</p>
            
            {searchResults.map(product => (
              <div className="heartshowproducts">
                <img src={`${Image_URL}${product.imageSrc}`} alt={product.title} width={100}/>
              <div key={product.id}>
                <div className="searchshowproductstitle">
            <h3>{product.title}</h3>
            <div className="heartshowproductsprices">
            <p>{product.brandName}</p>
            <p>{product.priceNew}</p>
            </div>
            </div>

      </div>
      <div className="searchshowproductsbutton">
      <button onClick={() => handleProductClick(product,product.id)}><i className='bi bi-eye-fill'></i></button>
      </div>

  </div>
))}

          </div>
        </div>
        <div className="heartshow">
          <a href="#"><i className="bi bi-heart-fill"></i></a>
          <div className="heart-products" style={{ height: favoriteItems.length === 0 ? '4rem' : 'auto' }}>
             {favoriteItems.length === 0 ? (
      <p>No items in favorites</p>
    ) : (
          favoriteItems.map((item, index) => (
    <div key={index} className='heartshowproducts'>
      <img src={`${Image_URL}/${item.imageSrc}`} alt="image" width={100}/>
      <div className='heartshowproductstitle'>
      <h3>{item.title}</h3>
      <div className='heartshowproductsprices'><p><s>Rs.{item.priceOld}</s></p>
      <p style={{color:'green'}}>Rs.{item.priceNew}</p></div>
      
      </div>
      <div className='heartshowproductsbuttons'>
      <button  onClick={() => handleProductClick(item,index)}><i className='bi bi-eye-fill'></i></button>
      <br />
      <button  onClick={() => deleteProduct(item.title)}><i className='bi bi-trash-fill'></i></button>
      </div>

    </div>
  )))}
          </div>
        </div>
        <div className="cartshow">
          <a href="#"><i className="bi bi-cart-fill"></i></a>
          <div className="cart-products" style={{ height: cartItems.length === 0 ? '4rem' : 'auto' }}>
 {cartItems.length === 0 ? (
      <p>No items in Cart</p>
    ) : (
   cartItems.map((item, index) => (
    <div key={index} className='cartshowproducts'>
     {item.imageSrc && (
  <img src={`${Image_URL}${item.imageSrc}`} alt={item.productName} width={100}/>
)}
  <div className='cartshowproductstitle'>
      <h3>{item.productName}</h3>
      <p>Fragnance: {item.fragrance}</p>
      <div className="heartshowproductsprices">
      <p>Size: {item.size}ml</p>
      <p>Quantity: {item.quantity}</p>
      </div>
      </div>
      <div className="cartshowproductsbutton">
      <button onClick={() => deleteProductCart(item.productName)}><i className='bi bi-trash-fill'></i></button>
      </div>
      
    </div>

    
)))}

{authenticated && cartItems.length > 0 && (
  <div className="checkout" style={{ marginBottom: '1rem' }}> 
    <h3><Link to="/checkout">Checkout</Link></h3>
  </div>
)}

</div>


        </div>
        <div className="settingshow">
          <a href="#"><i className="bi bi-gear-fill"></i></a>
          <div className="setting-products">
            <div className="userIcon">
            <i className='bi bi-person-circle'></i>
            </div>
            <div className="welcomeUser">
            <h2>Welcome  </h2>
            {authenticated ? (
              <>
              <h3>{name}</h3>
              <h4>email: {email} </h4>
              <h4>phone: {phone} </h4>
              </>
           
          ):( 
            <h3>User</h3>
          )}
            </div>
            {authenticated ? (
              <>
              <div style={{display: 'flex', justifyContent: 'space-between', gap: '10px'}}>
            <div  className="logout">
           <h3><button onClick={handleGoToDeliveryStatus}><i className='bi bi-truck'></i>Delivery Status</button></h3></div>
            <div className="logout"><h3><button onClick={handleLogout}><i className='bi bi-box-arrow-right'></i><br />Logout</button></h3></div>
           </div>
            </> 
          ) : (
            <div className="login"><h3><a><Link to="/login">Log in</Link></a></h3></div>
          )}
          </div>
        </div>
      </div>
    </div>
    <a href="javascript:void(0);" className="icon" onClick={myFunction}>&#9776;</a>
  </div>
  <div className="overlay" id="overlay3">
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
    <select name="" id="group-size">
      <option value="">Select fragnance</option>
      <option value="">Rose</option>
    </select>
  </div> */}
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
</header>

  )
}

export default Header

