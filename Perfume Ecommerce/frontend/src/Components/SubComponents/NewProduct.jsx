// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Slider from 'react-slick';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';
// import axios from 'axios';
// import swal from 'sweetalert';

// const BASE_URL = 'http://localhost:4444';
// const Image_Path_URL = 'http://localhost:4444/public/AllProducts/';

// const NewProduct = () => {
//   const navigate = useNavigate();
//   const [products, setProducts] = useState([]);
//   const [error, setError] = useState('');
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [mainImage, setMainImage] = useState('');
//   const [thumbnailImages, setThumbnailImages] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState('men');
//   const [selectedSize, setSelectedSize] = useState('');
//   const [selectedQuantity, setSelectedQuantity] = useState('');
//   const [showImages, setShowImages] = useState([]);
//   const [isExpanded, setIsExpanded] = useState(true);
//   const [name, setName] = useState('');
//   const sliderRef = useRef(null);

//   useEffect(() => {
//     fetch(`${BASE_URL}/allproducts/`)
//       .then(response => {
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         return response.json();
//       })
//       .then(data => {
//         setProducts(data);
//         if (data.length > 0) {
//           setSelectedProduct(data[0]);
//           setMainImage(`${Image_Path_URL}/${data[0].imageSrc}`);
//           setThumbnailImages([`${Image_Path_URL}/${data[0].imageSrc2}`, `${Image_Path_URL}/${data[0].imageSrc3}`]);
//           setShowImages(Array(data.length).fill(false)); // Changed to false for first image
//         }
//       })
//       .catch(error => {
//         console.error('Error:', error);
//         setError(error.toString());
//       });
//   }, []);

//   useEffect(() => {
//     axios.get('http://localhost:4444/check')
//       .then(response => {
//         if (response.data.valid) {
//           axios.get('http://localhost:4444/signup/details')
//             .then(response => {
//               setName(response.data.username);
//               console.log(response.data.username);
//             });
//         }
//       })
//       .catch(error => {
//         console.log(error);
//       });
//   }, []);

//   const handleThumbnailClick = (image) => {
//     setMainImage(image);
//   };

//   const displayBlock = (product, index) => {
//     document.getElementById("overlay").style.display = "block";
//   };

//   const closeoverlay = () => {
//     document.getElementById("overlay").style.display = "none";
//   };

//   const handleCategoryChange = (category) => {
//     setSelectedCategory(category);
//   };

//   const handleProductClick = (product, index) => {
//     setSelectedProduct(product);
//     setMainImage(`${Image_Path_URL}/${product.imageSrc}`);
//     setThumbnailImages([`${Image_Path_URL}/${product.imageSrc2}`, `${Image_Path_URL}/${product.imageSrc3}`]);
//     displayBlock(product, index);
//   };

//   const addToFavourite = async (title, priceOld, priceNew, description, imageSrc, imageSrc2, imageSrc3) => {
//     try {
//       const response = await axios.post(`http://localhost:4444/signup/favorite/${name}`, {
//         title,
//         priceOld,
//         priceNew,
//         description,
//         imageSrc,
//         imageSrc2,
//         imageSrc3
//       });
//       console.log(response.data);
//       swal("Success!", "Item added to favourites successfully", "success");
//       window.location.reload();
//     } catch (error) {
//       console.error('Error:', error);
//       swal("Error!", "Failed to add item to favourites", "error");
//     }
//   };

  

//   const handleSizeChange = (event) => {
//     setSelectedSize(event.target.value);
//     console.log(event.target.value);
//   };

//   const handleQuantityChange = (event) => {
//     const value = parseInt(event.target.value);
//     setSelectedQuantity(isNaN(value) ? '' : value);
//   };

//   const addToCart = async (productName, size, quantity) => {
//     if (!size || !quantity) {
//       swal("Error!", "Please select both size and quantity.", "error");
//       return;
//     }
//     try {
//       const response = await axios.post(`http://localhost:4444/signup/cart/${name}`, {
//         productName,
//         size,
//         quantity
//       });
//       console.log(response.data);
//       swal("Success!", "Item added to cart successfully", "success");
//     } catch (error) {
//       console.error(error);
//       swal("Error!", "Failed to add item to cart", "error");
//     }
//   };

//   const toggleImages = (index) => {
//     const newShowImages = [...showImages];
//     newShowImages[index] = !newShowImages[index];
//     setShowImages(newShowImages);
//   };

//   const toggleDescription = () => {
//     setIsExpanded(!isExpanded);
//   };

//   const sliderSettings = {
//     arrows: false,
//     dots: false,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 4,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 4000,
//     responsive: [
//       {
//         breakpoint: 1030,
//         settings: {
//           slidesToShow: 3,
//           slidesToScroll: 3,
//         },
//       },
//       {
//         breakpoint: 800,
//         settings: {
//           slidesToShow: 2,
//           slidesToScroll: 2,
//         },
//       },
//       {
//         breakpoint: 600,
//         settings: {
//           slidesToShow: 2,
//           slidesToScroll: 2,
//         },
//       },
//       {
//         breakpoint: 480,
//         settings: {
//           slidesToShow: 1,
//           slidesToScroll: 1,
//         },
//       },
//     ],
//   };

//   const settings2 = {
//     arrows: false,
//     dots: false,
//     infinite: true,
//     speed: 200,
//     slidesToShow: 2,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 4000,
//     focusOnSelect: true,
//     responsive: [
//       {
//         breakpoint: 1024,
//         settings: {
//           slidesToShow: 3,
//           slidesToScroll: 3,
//         },
//       },
//       {
//         breakpoint: 600,
//         settings: {
//           slidesToShow: 2,
//           slidesToScroll: 2,
//         },
//       },
//       {
//         breakpoint: 480,
//         settings: {
//           slidesToShow: 1,
//           slidesToScroll: 1,
//         },
//       },
//     ],
//   };

//   return (
//     <>
//       <div className="new-product">
//         <h1>
//           <i className="bi bi-dash-lg"></i> New Product{' '}
//           <i className="bi bi-dash-lg"></i>
//         </h1>
//         <div className="categories">
//           <button
//             className={`rv_button ${selectedCategory === 'men' ? 'rv_button_opened' : 'rv_button_closed'}`}
//             onClick={() => handleCategoryChange('men')}
//           >
//             Men
//           </button>
//           <button
//             className={`rv_button ${selectedCategory === 'women' ? 'rv_button_opened' : 'rv_button_closed'}`}
//             onClick={() => handleCategoryChange('women')}
//           >
//             Women
//           </button>
//           <button
//             className={`rv_button ${selectedCategory === 'unisex' ? 'rv_button_opened' : 'rv_button_closed'}`}
//             onClick={() => handleCategoryChange('unisex')}
//           >
//             Unisex
//           </button>
//         </div>
//         <div className="slider_buttons">
//           <button onClick={() => sliderRef.current?.slickPrev()}>
//             <i className='bi bi-arrow-left'></i>
//           </button>
//           <button onClick={() => sliderRef.current?.slickNext()}>
//             <i className='bi bi-arrow-right'></i>
//           </button>
//         </div>
//         <div className={`products rv_element rv_element_${selectedCategory}`}>
//           {selectedCategory === 'men' && (
//             <Slider ref={sliderRef} {...sliderSettings}>
//               {products && products.map((product, index) => {
//                 if (product.role === "NewProducts Men") {
//                   return (
//                     <div key={index} className="slide">
//                       <div className="slide_featuress" id="futuristics">
//                         <i
//                           className="bi bi-heart"
//                           onClick={() => addToFavourite(
//                             product.title,
//                             product.priceOld,
//                             product.priceNew,
//                             product.description,
//                             product.imageSrc,
//                             product.imageSrc2,
//                             product.imageSrc3
//                           )}
//                           id='heart'
//                         ></i>
//                         <br />
//                         <i className="bi bi-shuffle" onClick={() => toggleImages(index)}></i>
//                         <br />
//                         <i className="bi bi-eye-fill" onClick={() => handleProductClick(product, index)}></i>
//                       </div>
//                       <img
//                         src={`${Image_Path_URL}${showImages[index] ? product.imageSrc2 : product.imageSrc}`}
//                         alt="Product image"
//                       />
//                       <div className="product-info">
//                       <h2
//   className="product-title"
//   style={{ cursor: 'pointer' }}
//   onClick={() => {
//     console.log('Clicked:', product._id);
//     navigate(`/product/${product._id}`, { state: { product } });
//   }}
// >
//   {product.title}
// </h2>

//                         <div className="product-brand">
//                           <h3>{product.brandName}</h3>
//                           <h3>Duration: {product.duration}hrs</h3>
//                         </div>
//                         <div id="product-ratings">
//                           <p className="product-details">
//                             <span className="product-price-old">Rs.{product.priceOld}</span>
//                             <span className="product-price-new">Rs.{product.priceNew}</span>
//                           </p>
//                           <div className="product-rating">
//                             {[...Array(product.rating)].map((_, i) => (
//                               <span key={i} className="star">★</span>
//                             ))}
//                           </div>
//                         </div>
//                         {product.quantity === 0 && (
//                           <p className="sold-out" style={{ color: 'red', fontWeight: 'bold' }}>
//                             Sold Out
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   );
//                 }
//                 return null;
//               })}
//             </Slider>
//           )}
//           {selectedCategory === 'women' && (
//             <Slider ref={sliderRef} {...sliderSettings}>
//               {products && products.map((product, index) => {
//                 if (product.role === "NewProducts Women") {
//                   return (
//                     <div key={index} className="slide">
//                       <div className="slide_featuress" id="futuristics">
//                         <i
//                           className="bi bi-heart"
//                           onClick={() => addToFavourite(
//                             product.title,
//                             product.priceOld,
//                             product.priceNew,
//                             product.description,
//                             product.imageSrc,
//                             product.imageSrc2,
//                             product.imageSrc3
//                           )}
//                           id='heart'
//                         ></i>
//                         <br />
//                         <i className="bi bi-shuffle" onClick={() => toggleImages(index)}></i>
//                         <br />
//                         <i className="bi bi-eye-fill" onClick={() => handleProductClick(product, index)}></i>
//                       </div>
//                       <img
//                         src={`${Image_Path_URL}${showImages[index] ? product.imageSrc2 : product.imageSrc}`}
//                         alt="Product image"
//                       />
//                       <div className="product-info">
//                         <h2 className="product-title">{product.title}</h2>
//                         <div className="product-brand">
//                           <h3>{product.brandName}</h3>
//                           <h3>Duration: {product.duration}hrs</h3>
//                         </div>
//                         <div id="product-ratings">
//                           <p className="product-details">
//                             <span className="product-price-old">Rs.{product.priceOld}</span>
//                             <span className="product-price-new">Rs.{product.priceNew}</span>
//                           </p>
//                           <div className="product-rating">
//                             {[...Array(product.rating)].map((_, i) => (
//                               <span key={i} className="star">★</span>
//                             ))}
//                           </div>
//                         </div>
//                         {product.quantity === 0 && (
//                           <p className="sold-out" style={{ color: 'red', fontWeight: 'bold' }}>
//                             Sold Out
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   );
//                 }
//                 return null;
//               })}
//             </Slider>
//           )}
//           {selectedCategory === 'unisex' && (
//             <Slider ref={sliderRef} {...sliderSettings}>
//               {products && products.map((product, index) => {
//                 if (product.role === "NewProducts Unisex") {
//                   return (
//                     <div key={index} className="slide">
//                       <div className="slide_featuress" id="futuristics">
//                         <i
//                           className="bi bi-heart"
//                           onClick={() => addToFavourite(
//                             product.title,
//                             product.priceOld,
//                             product.priceNew,
//                             product.description,
//                             product.imageSrc,
//                             product.imageSrc2,
//                             product.imageSrc3
//                           )}
//                           id='heart'
//                         ></i>
//                         <br />
//                         <i className="bi bi-shuffle" onClick={() => toggleImages(index)}></i>
//                         <br />
//                         <i className="bi bi-eye-fill" onClick={() => handleProductClick(product, index)}></i>
//                       </div>
//                       <img
//                         src={`${Image_Path_URL}${showImages[index] ? product.imageSrc2 : product.imageSrc}`}
//                         alt="Product image"
//                       />
//                       <div className="product-info">
//                         <h2 className="product-title">{product.title}</h2>
//                         <div className="product-brand">
//                           <h3>{product.brandName}</h3>
//                           <h3>Duration: {product.duration}hrs</h3>
//                         </div>
//                         <div id="product-ratings">
//                           <p className="product-details">
//                             <span className="product-price-old">Rs.{product.priceOld}</span>
//                             <span className="product-price-new">Rs.{product.priceNew}</span>
//                           </p>
//                           <div className="product-rating">
//                             {[...Array(product.rating)].map((_, i) => (
//                               <span key={i} className="star">★</span>
//                             ))}
//                           </div>
//                         </div>
//                         {product.quantity === 0 && (
//                           <p className="sold-out" style={{ color: 'red', fontWeight: 'bold' }}>
//                             Sold Out
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   );
//                 }
//                 return null;
//               })}
//             </Slider>
//           )}
//         </div>
//       </div>
//       <div className="overlay" id="overlay">
//         <div className="overlay_container">
//           <div className="left">
//             <div className="overlay_img" id="overlay-img">
//               <img src={mainImage} alt="Main Slide" />
//             </div>
//             <div className="overlay_img2" id="overlay-img2">
//               <Slider {...settings2}>
//                 {thumbnailImages.map((image, index) => (
//                   <img
//                     key={index}
//                     src={image}
//                     alt={`Thumbnail Slide ${index}`}
//                     onClick={() => handleThumbnailClick(image)}
//                   />
//                 ))}
//               </Slider>
//             </div>
//           </div>
//           <div className="right">
//             <button id="closeOverlayBtn" onClick={closeoverlay}>
//               <i className="bi bi-x"></i>
//             </button>
//             <div>
//               {selectedProduct && (
//                 <div>
//                   {selectedProduct.title && (
//                     <h2 className="title">{selectedProduct.title}</h2>
//                   )}
//                   <div className="price" style={{ display: 'flex', gap: '1rem' }}>
//                     {selectedProduct.priceNew && (
//                       <>
//                         {selectedProduct.priceOld && (
//                           <>
//                             <p style={{ color: '#FF7A11' }}>Rs.{selectedProduct.priceNew}</p>
//                             <strike style={{ color: 'grey' }}>Rs.{selectedProduct.priceOld}</strike>
//                           </>
//                         )}
//                       </>
//                     )}
//                   </div>
//                   {selectedProduct.description && (
//                     <div>
//                       <div className={`description ${isExpanded ? 'expanded' : ''}`}>
//                         {selectedProduct.description}
//                       </div>
//                       <button onClick={toggleDescription} className="show-more">
//                         {isExpanded ? 'Show less' : 'Show more'}
//                       </button>
//                     </div>
//                   )}
//                   {selectedProduct.title && (
//                     <h2 className="quantityLeft">
//                       {selectedProduct.quantity === 0
//                         ? 'Sold Out'
//                         : `Quantity left: ${selectedProduct.quantity}pcs`}
//                     </h2>
//                   )}
//                 </div>
//               )}
//             </div>
//             {selectedProduct && selectedProduct.quantity > 0 ? (
//               <>
//                 <div className="details-group">
//                   <label htmlFor="size">SIZE</label>
//                   <select id="group-size" value={selectedSize} onChange={handleSizeChange}>
//                     <option value="">Select Size</option>
//                     {selectedProduct?.size?.length > 0 ? (
//                       selectedProduct.size.map((size, index) => (
//                         <option key={index} value={size}>
//                           {size}ml
//                         </option>
//                       ))
//                     ) : (
//                       <option value="10">10ml</option>
//                     )}
//                   </select>
//                 </div>
//                 <div className="details-group quantity">
//                   <div>
//                     <label htmlFor="group-quantity">Quantity</label>
//                     <input
//                       type="number"
//                       id="group-quantity"
//                       value={selectedQuantity}
//                       onChange={(e) => {
//                         const value = parseInt(e.target.value);
//                         const availableQty = selectedProduct?.quantity || 0;
//                         if (value > availableQty) {
//                           swal("Error!", `Only ${availableQty} item(s) left in stock.`, "error");
//                           setSelectedQuantity(availableQty);
//                         } else {
//                           setSelectedQuantity(isNaN(value) ? '' : value);
//                         }
//                       }}
//                       min={1}
//                       max={selectedProduct?.quantity || 1}
//                     />
//                   </div>
//                   <div>
//                     <button
//                       className="add-to-cart"
//                       onClick={() => addToCart(selectedProduct.title, selectedSize, selectedQuantity)}
//                     >
//                       ADD TO CART
//                     </button>
//                   </div>
//                 </div>
//               </>
//             ) : (
//               selectedProduct && (
//                 <div className="sold-out-message" style={{ color: 'red', fontWeight: 'bold', marginTop: '1rem' }}>
//                   This product is sold out
//                 </div>
//               )
//             )}
//             <div className="share-buttons">
//               <a className="share-button" href="#">SHARE THIS PRODUCT</a>
//             </div>
//             <div className="share_product">
//               <a href="#">
//                 <i className="bi bi-facebook" style={{ color: '#3b5998' }}></i>
//               </a>
//               <a href="#">
//                 <i className="bi bi-messenger" style={{ color: '#0078FF' }}></i>
//               </a>
//               <a href="#">
//                 <i className="bi bi-instagram" style={{ color: '#E4405F' }}></i>
//               </a>
//               <a href="#">
//                 <i className="bi bi-meta" style={{ color: '#00A6FB' }}></i>
//               </a>
//               <a href="#">
//                 <i className="bi bi-whatsapp" style={{ color: '#25D366' }}></i>
//               </a>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default NewProduct;

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import axios from 'axios';
import swal from 'sweetalert';

const BASE_URL = 'http://localhost:4444';
const Image_Path_URL = 'http://localhost:4444/public/AllProducts/';

const NewProduct = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [thumbnailImages, setThumbnailImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('men');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState('');
  const [showImages, setShowImages] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [name, setName] = useState('');
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
        if (data.length > 0) {
          const firstProduct = data[0];
          setSelectedProduct(firstProduct);
          setMainImage(`${Image_Path_URL}/${firstProduct.imageSrc}`);
          setThumbnailImages([`${Image_Path_URL}/${firstProduct.imageSrc2}`, `${Image_Path_URL}/${firstProduct.imageSrc3}`]);
          setShowImages(Array(data.length).fill(false));
          // Initialize selected size as first available size (if array)
          if (firstProduct.size && firstProduct.size.length > 0) {
            setSelectedSize(firstProduct.size[0]);
          } else {
            setSelectedSize('');
          }
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setError(error.toString());
      });
  }, []);

  useEffect(() => {
    axios.get('http://localhost:4444/check')
      .then(response => {
        if (response.data.valid) {
          axios.get('http://localhost:4444/signup/details')
            .then(response => {
              setName(response.data.username);
              console.log(response.data.username);
            });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const handleThumbnailClick = (image) => {
    setMainImage(image);
  };

  const displayBlock = (product, index) => {
    document.getElementById("overlay").style.display = "block";
  };

  const closeoverlay = () => {
    document.getElementById("overlay").style.display = "none";
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleProductClick = (product, index) => {
    setSelectedProduct(product);
    setMainImage(`${Image_Path_URL}/${product.imageSrc}`);
    setThumbnailImages([`${Image_Path_URL}/${product.imageSrc2}`, `${Image_Path_URL}/${product.imageSrc3}`]);
    displayBlock(product, index);

    // Set selectedSize to first size available on new product
    if (product.size && product.size.length > 0) {
      setSelectedSize(product.size[0]);
    } else {
      setSelectedSize('');
    }

    setSelectedQuantity(''); // Reset quantity on new product open
  };

  const addToFavourite = async (title, priceOld, priceNew, description, imageSrc, imageSrc2, imageSrc3) => {
    try {
      const response = await axios.post(`http://localhost:4444/signup/favorite/${name}`, {
        title,
        priceOld,
        priceNew,
        description,
        imageSrc,
        imageSrc2,
        imageSrc3
      });
      console.log(response.data);
      swal("Success!", "Item added to favourites successfully", "success");
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
      swal("Error!", "Failed to add item to favourites", "error");
    }
  };

  const handleSizeChange = (event) => {
    setSelectedSize(event.target.value);
    setSelectedQuantity(''); // Reset quantity on size change
  };

  const addToCart = async (productName, size, quantity) => {
    if (!size || !quantity) {
      swal("Error!", "Please select both size and quantity.", "error");
      return;
    }
    try {
      const response = await axios.post(`http://localhost:4444/signup/cart/${name}`, {
        productName,
        size,
        quantity
      });
      console.log(response.data);
      swal("Success!", "Item added to cart successfully", "success");
    } catch (error) {
      console.error(error);
      swal("Error!", "Failed to add item to cart", "error");
    }
  };

  const toggleImages = (index) => {
    const newShowImages = [...showImages];
    newShowImages[index] = !newShowImages[index];
    setShowImages(newShowImages);
  };

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  // Helper: get index of selected size
  const selectedSizeIndex = selectedProduct?.size?.indexOf(selectedSize);

  // Helper: get priceOld and priceNew for selected size, fallback to first index or empty string
  const displayPriceOld = selectedProduct?.priceOld
    ? Array.isArray(selectedProduct.priceOld)
      ? (selectedSizeIndex !== -1 ? selectedProduct.priceOld[selectedSizeIndex] : selectedProduct.priceOld[0])
      : selectedProduct.priceOld
    : '';

  const displayPriceNew = selectedProduct?.priceNew
    ? Array.isArray(selectedProduct.priceNew)
      ? (selectedSizeIndex !== -1 ? selectedProduct.priceNew[selectedSizeIndex] : selectedProduct.priceNew[0])
      : selectedProduct.priceNew
    : '';

  // Validate max quantity for selected size if you have separate quantities per size (not shown here)
  // Otherwise use general quantity

  const sliderSettings = {
    arrows: false,
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    responsive: [
      {
        breakpoint: 1030,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 800,
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

  const settings2 = {
    arrows: false,
    dots: false,
    infinite: true,
    speed: 200,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
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

  return (
    <>
      <div className="new-product">
        <h1>
          <i className="bi bi-dash-lg"></i> New Product{' '}
          <i className="bi bi-dash-lg"></i>
        </h1>
        <div className="categories">
          <button
            className={`rv_button ${selectedCategory === 'men' ? 'rv_button_opened' : 'rv_button_closed'}`}
            onClick={() => handleCategoryChange('men')}
          >
            Men
          </button>
          <button
            className={`rv_button ${selectedCategory === 'women' ? 'rv_button_opened' : 'rv_button_closed'}`}
            onClick={() => handleCategoryChange('women')}
          >
            Women
          </button>
          <button
            className={`rv_button ${selectedCategory === 'unisex' ? 'rv_button_opened' : 'rv_button_closed'}`}
            onClick={() => handleCategoryChange('unisex')}
          >
            Unisex
          </button>
        </div>
        <div className="slider_buttons">
          <button onClick={() => sliderRef.current?.slickPrev()}>
            <i className='bi bi-arrow-left'></i>
          </button>
          <button onClick={() => sliderRef.current?.slickNext()}>
            <i className='bi bi-arrow-right'></i>
          </button>
        </div>
        <div className={`products rv_element rv_element_${selectedCategory}`}>
          {selectedCategory === 'men' && (
            <Slider ref={sliderRef} {...sliderSettings}>
              {products && products.map((product, index) => {
                if (product.role === "NewProducts Men") {
                  // Determine price for first size (index 0)
                  const priceOldDisplay = Array.isArray(product.priceOld)
                    ? product.priceOld[0]
                    : product.priceOld;
                  const priceNewDisplay = Array.isArray(product.priceNew)
                    ? product.priceNew[0]
                    : product.priceNew;

                  return (
                    <div key={index} className="slide">
                      <div className="slide_featuress" id="futuristics">
                        <i
                          className="bi bi-heart"
                          onClick={() => addToFavourite(
                            product.title,
                            product.priceOld,
                            product.priceNew,
                            product.description,
                            product.imageSrc,
                            product.imageSrc2,
                            product.imageSrc3
                          )}
                          id='heart'
                        ></i>
                        <br />
                        <i className="bi bi-shuffle" onClick={() => toggleImages(index)}></i>
                        <br />
                        <i className="bi bi-eye-fill" onClick={() => handleProductClick(product, index)}></i>
                      </div>
                      <img
                        src={`${Image_Path_URL}${showImages[index] ? product.imageSrc2 : product.imageSrc}`}
                        alt="Product image"
                      />
                      <div className="product-info">
                        <h2
                          className="product-title"
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            console.log('Clicked:', product._id);
                            navigate(`/product/${product.title}`, { state: { product } });
                          }}
                        >
                          {product.title}
                        </h2>

                        <div className="product-brand">
                          <h3>{product.brandName}</h3>
                          <h3>Duration: {product.duration}hrs</h3>
                        </div>
                        <div id="product-ratings">
                          <p className="product-details">
                            <span className="product-price-old">Rs.{priceOldDisplay}</span>
                            <span className="product-price-new">Rs.{priceNewDisplay}</span>
                          </p>
                          <div className="product-rating">
                            {[...Array(product.rating)].map((_, i) => (
                              <span key={i} className="star">★</span>
                            ))}
                          </div>
                        </div>
                        {product.quantity === 0 && (
                          <p className="sold-out" style={{ color: 'red', fontWeight: 'bold' }}>
                            Sold Out
                          </p>
                        )}
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </Slider>
          )}
          {selectedCategory === 'women' && (
            <Slider ref={sliderRef} {...sliderSettings}>
              {products && products.map((product, index) => {
                if (product.role === "NewProducts Women") {
                  const priceOldDisplay = Array.isArray(product.priceOld)
                    ? product.priceOld[0]
                    : product.priceOld;
                  const priceNewDisplay = Array.isArray(product.priceNew)
                    ? product.priceNew[0]
                    : product.priceNew;

                  return (
                    <div key={index} className="slide">
                      <div className="slide_featuress" id="futuristics">
                        <i
                          className="bi bi-heart"
                          onClick={() => addToFavourite(
                            product.title,
                            product.priceOld,
                            product.priceNew,
                            product.description,
                            product.imageSrc,
                            product.imageSrc2,
                            product.imageSrc3
                          )}
                          id='heart'
                        ></i>
                        <br />
                        <i className="bi bi-shuffle" onClick={() => toggleImages(index)}></i>
                        <br />
                        <i className="bi bi-eye-fill" onClick={() => handleProductClick(product, index)}></i>
                      </div>
                      <img
                        src={`${Image_Path_URL}${showImages[index] ? product.imageSrc2 : product.imageSrc}`}
                        alt="Product image"
                      />
                      <div className="product-info">
                        <h2 className="product-title">{product.title}</h2>
                        <div className="product-brand">
                          <h3>{product.brandName}</h3>
                          <h3>Duration: {product.duration}hrs</h3>
                        </div>
                        <div id="product-ratings">
                          <p className="product-details">
                            <span className="product-price-old">Rs.{priceOldDisplay}</span>
                            <span className="product-price-new">Rs.{priceNewDisplay}</span>
                          </p>
                          <div className="product-rating">
                            {[...Array(product.rating)].map((_, i) => (
                              <span key={i} className="star">★</span>
                            ))}
                          </div>
                        </div>
                        {product.quantity === 0 && (
                          <p className="sold-out" style={{ color: 'red', fontWeight: 'bold' }}>
                            Sold Out
                          </p>
                        )}
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </Slider>
          )}
          {selectedCategory === 'unisex' && (
            <Slider ref={sliderRef} {...sliderSettings}>
              {products && products.map((product, index) => {
                if (product.role === "NewProducts Unisex") {
                  const priceOldDisplay = Array.isArray(product.priceOld)
                    ? product.priceOld[0]
                    : product.priceOld;
                  const priceNewDisplay = Array.isArray(product.priceNew)
                    ? product.priceNew[0]
                    : product.priceNew;

                  return (
                    <div key={index} className="slide">
                      <div className="slide_featuress" id="futuristics">
                        <i
                          className="bi bi-heart"
                          onClick={() => addToFavourite(
                            product.title,
                            product.priceOld,
                            product.priceNew,
                            product.description,
                            product.imageSrc,
                            product.imageSrc2,
                            product.imageSrc3
                          )}
                          id='heart'
                        ></i>
                        <br />
                        <i className="bi bi-shuffle" onClick={() => toggleImages(index)}></i>
                        <br />
                        <i className="bi bi-eye-fill" onClick={() => handleProductClick(product, index)}></i>
                      </div>
                      <img
                        src={`${Image_Path_URL}${showImages[index] ? product.imageSrc2 : product.imageSrc}`}
                        alt="Product image"
                      />
                      <div className="product-info">
                        <h2 className="product-title">{product.title}</h2>
                        <div className="product-brand">
                          <h3>{product.brandName}</h3>
                          <h3>Duration: {product.duration}hrs</h3>
                        </div>
                        <div id="product-ratings">
                          <p className="product-details">
                            <span className="product-price-old">Rs.{priceOldDisplay}</span>
                            <span className="product-price-new">Rs.{priceNewDisplay}</span>
                          </p>
                          <div className="product-rating">
                            {[...Array(product.rating)].map((_, i) => (
                              <span key={i} className="star">★</span>
                            ))}
                          </div>
                        </div>
                        {product.quantity === 0 && (
                          <p className="sold-out" style={{ color: 'red', fontWeight: 'bold' }}>
                            Sold Out
                          </p>
                        )}
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </Slider>
          )}
        </div>
      </div>

      <div className="overlay" id="overlay" style={{ display: 'none' }}>
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
            <button id="closeOverlayBtn" onClick={closeoverlay}>
              <i className="bi bi-x"></i>
            </button>
            <div>
              {selectedProduct && (
                <div>
                  {selectedProduct.title && (
                    <h2 className="title">{selectedProduct.title}</h2>
                  )}
                  <div className="price" style={{ display: 'flex', gap: '1rem' }}>
                    {displayPriceNew && (
                      <>
                        {displayPriceOld && (
                          <>
                            <p style={{ color: '#FF7A11' }}>Rs.{displayPriceNew}</p>
                            <strike style={{ color: 'grey' }}>Rs.{displayPriceOld}</strike>
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
                      <button onClick={toggleDescription} className="show-more">
                        {isExpanded ? 'Show less' : 'Show more'}
                      </button>
                    </div>
                  )}
                  {selectedProduct.title && (
                    <h2 className="quantityLeft">
                      {selectedProduct.quantity === 0
                        ? 'Sold Out'
                        : `Quantity left: ${selectedProduct.quantity}pcs`}
                    </h2>
                  )}
                </div>
              )}
            </div>
            {selectedProduct && selectedProduct.quantity > 0 ? (
              <>
                <div className="details-group">
                  <label htmlFor="size">SIZE</label>
                  <select id="group-size" value={selectedSize} onChange={handleSizeChange}>
                    <option value="">Select Size</option>
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
                <div className="details-group quantity">
                  <div>
                    <label htmlFor="group-quantity">Quantity</label>
                    <input
                      type="number"
                      id="group-quantity"
                      value={selectedQuantity}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        const availableQty = selectedProduct?.quantity || 0;
                        if (value > availableQty) {
                          swal("Error!", `Only ${availableQty} item(s) left in stock.`, "error");
                          setSelectedQuantity(availableQty);
                        } else {
                          setSelectedQuantity(isNaN(value) ? '' : value);
                        }
                      }}
                      min={1}
                      max={selectedProduct?.quantity || 1}
                    />
                  </div>
                  <div>
                    <button
                      className="add-to-cart"
                      onClick={() => addToCart(selectedProduct.title, selectedSize, selectedQuantity)}
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>
              </>
            ) : (
              selectedProduct && (
                <div className="sold-out-message" style={{ color: 'red', fontWeight: 'bold', marginTop: '1rem' }}>
                  This product is sold out
                </div>
              )
            )}
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
};

export default NewProduct;
