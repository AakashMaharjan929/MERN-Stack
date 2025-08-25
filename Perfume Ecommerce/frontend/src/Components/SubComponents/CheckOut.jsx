import {useState, useEffect,useRef} from 'react'
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import Header from './Header';
import '../../css/style.css'
import Footer from './Footer';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import 'sweetalert2/src/sweetalert2.scss'; // for scss
// or use this for default css:
import 'sweetalert2/dist/sweetalert2.min.css';


const BASE_URL = 'http://localhost:4444';
const Image_URL = 'http://localhost:4444/public/AllProducts/';

const stripePromise = loadStripe('pk_test_51RXMqLR3o3geCE7w3WOg9wt41bALMC923mpa9IDCpLXYw3GDmHHuMxsNYajVrUabLw5ipPAyZnqzAXbZ9W5cCBwM00WYEn75Xp'); 


  const GlobalStyle = createGlobalStyle`
  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background-color: #f7f7f7;
    
}
  `;

    const CheckoutStyle = styled.div`

    .CheckoutBox{
      margin: auto;
      width: 40vw;
      height: 87vh;
      background-color: #fff;
      margin-top: 4rem;
    }
    

    .titleBox h1{
      background-color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      
    }

    .itemlist{
      background-color: white;
      width: 100%;
      height: 18rem;
    }


   
    .itemName{
      display:flex;
      justify-content: space-between;
      background-color: white;

    }

    .itemName p{
      padding: 1rem;
      background-color: white;
    }

    .itemname{
      margin-left: 7rem;
    }

    .singleitemtotalprice{
      margin-right: 4rem;
    }
    
    .itemlist .allitems{
      width: 100%;
      height: 15rem;
      background-color: white;
      overflow-y: auto;
    }

    .checkoutproducttitle{
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-left: 1rem;
      background-color: white;
    
    }

    .checkoutproducttitle h3{
      background-color: white;
    }

    checkoutproducttitle p{
      background-color: white;
    }



    .checkoutproductbutton{
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 1rem;
      margin-left: 4rem;
    }
    
    .checkoutproductbutton button{
      width: 2rem;
      height: 2rem;
      border: none;
      padding: 1rem;
    }

    .checkoutproductprices{
      display: flex;
      justify-content: space-between;
      gap: 1rem;
    }

    .totalprice{
      margin-left: 7rem;
      margin-top: 2rem;
    }

    
    .total{
      width: 100%;
      height: 4rem;
      background-color: white;
      margin-top: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .total p{
      padding: 1rem;
      background-color: white;
    }

    .order-details{
      width: 100%;
      height: 10rem;
      background-color: white;
      display: flex;
      flex-direction: column;
    }

    .order-details form{
      display: flex;
      flex-direction: column;
      gap: 1rem;
      background-color: white;
    }

    .order-details form input{
      height: 2rem;
      width: 34rem;
      background-color: white;
      padding: 0.5rem;
    }

    .order-details form button{
      background-color: white;
    }

    .order-details form label{
      background-color: white;
    }


   


 
    `;
function CheckOut() {
  
    const stripe = useStripe();
  const elements = useElements();

  const [name, setName] = useState('');
  const [withCredentials, setWithCredentials] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
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
      
            setAuthenticated(true);
            }
          })
         
        } else {
          console.log('User not logged in');
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, [withCredentials, navigate]);

    const [cartItems, setCartItems] = useState([]);

    // useEffect(() => {
    //   // Load cart items from localStorage on component mount
    //   const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    //   setCartItems(storedCartItems);
    // }, []);
    

    // useEffect(() => {
    //   // Save cart items to localStorage whenever it changes
    //   localStorage.setItem('cartItems', JSON.stringify(cartItems));
    // }, [cartItems]);
    
    
useEffect(() => {
  const fetchData = () => {
    // Fetch cart items from backend API
    if (name) { // Check if name is truthy
      fetch(`http://localhost:4444/signup/getcart/${name}`, {
        method: 'GET',
        credentials: 'include', // Include credentials for session handling
      })
      .then(response => response.json())
      .then(data => {
        if (data.cart) {
          setCartItems(data.cart);
          
          // Fetch individual product details including images
          data.cart.forEach(item => {
            console.log(item.productName);
            fetch(`http://localhost:4444/allproducts/search?title=${encodeURIComponent(item.productName)}`, {
              method: 'GET'
            })
            .then(response => response.json())
            .then(productData => {
              // Assuming productData is an array of products, take the first one for simplicity
              if (productData.length > 0) {
                item.imageSrc = productData[0].imageSrc;
                setCartItems(prevCartItems => [...prevCartItems]); // Update state
              }
            })
            .catch(error => {
              console.log('Error fetching product details:', error);
            });
          });
        }
      })
      .catch(error => {
        console.log('Error fetching cart items:', error);
      });
    }
  };

  // Fetch data initially
  fetchData();

  
  
}, [name]);

const fetchData = () => {
  // Fetch cart items from backend API
  if (name) { // Check if name is truthy
    fetch(`http://localhost:4444/signup/getcart/${name}`, {
      method: 'GET',
      credentials: 'include', // Include credentials for session handling
    })
    .then(response => response.json())
    .then(data => {
      if (data.cart) {
        setCartItems(data.cart);
        
        // Fetch individual product details including images
        data.cart.forEach(item => {
          console.log(item.productName);
          fetch(`http://localhost:4444/allproducts/search?title=${encodeURIComponent(item.productName)}`, {
            method: 'GET'
          })
          .then(response => response.json())
          .then(productData => {
            // Assuming productData is an array of products, take the first one for simplicity
            if (productData.length > 0) {
              item.imageSrc = productData[0].imageSrc;
              setCartItems(prevCartItems => [...prevCartItems]); // Update state
            }
          })
          .catch(error => {
            console.log('Error fetching product details:', error);
          });
        });
      }
    })
    .catch(error => {
      console.log('Error fetching cart items:', error);
    });
  }
};



const deleteProductCart = (productName) => {
  axios.post(`${BASE_URL}/signup/deletecart`,{ productName: productName, username: name }, {
  }).then(response => {
    alert('Product deleted successfully');
  }).catch(error => {
      console.log(error);
  });

  fetchData();
}
//useEffect to get allproducts from database

const [allProducts, setAllProducts] = useState([]);
useEffect(() => {
  axios.get('http://localhost:4444/allproducts')
  .then(response => {
    setAllProducts(response.data);
  })
  .catch(error => {
    console.log('Error fetching products:', error);
  }
  );
}, []);


const [totalPrice, setTotalPrice] = useState(0);

//get the total price of all the products
useEffect(() => {
  let total = 0;
  cartItems.forEach(item => {
    const unitPrice = getProductPrice(item.productName, item.size);
    total += unitPrice * item.quantity;
  });
  setTotalPrice(total);
}, [cartItems, allProducts]);



const [address, setAddress] = useState('');
const [addressError, setAddressError] = useState('');
//get username, title, size, fragnance, quantity, totalPrice, address and send it to backend

const getProductPrice = (productName, selectedSize) => {
  const product = allProducts.find(p => p.title === productName);
  if (!product) return 0;

  // find the index of selectedSize in product.size array
  const sizeIndex = product.size.findIndex(s => s === String(selectedSize));
  if (sizeIndex === -1) {
    // size not found, fallback to first price or 0
    return product.priceNew.length > 0 ? parseInt(product.priceNew[0].replace(/,/g, '')) : 0;
  }

  // get the price string at that index
  const priceStr = product.priceNew[sizeIndex];
  if (!priceStr) return 0;

  // convert price string to number and return
  return parseInt(priceStr.replace(/,/g, ''));
};


// const placeOrder = async (e) => {
//   e.preventDefault();

//   try {
//     const enrichedCartItems = cartItems.map(item => {
//       const product = allProducts.find(p => p.title === item.productName);
//       const unitPrice = getProductPrice(item.productName, item.size); // get price for selected size
      
//       return {
//         productName: item.productName,
//         quantity: item.quantity,
//         size: item.size,
//         fragrance: item.fragrance || '',
//         unitPrice: unitPrice,  // unit price as number (in Rs)
//       };
//     });

//     // Convert totalPrice to paisa (Stripe expects the smallest currency unit)
//     // Assuming Rs to paisa: multiply by 100
//     const totalPriceInPaisa = totalPrice;

//     // Create Stripe checkout session
//     const response = await axios.post('http://localhost:4444/stripe/create-payment-intent', {
//       cartItems: enrichedCartItems,
//       name,
//       address,
//       totalPrice: totalPriceInPaisa,  // send totalPrice in paisa
//     });

//     if (response.data.url) {
//       window.location.href = response.data.url;
//     } else {
//       throw new Error('No redirect URL received');
//     }
//   } catch (error) {
//     console.error('Error:', error);
//     Swal.fire({
//       icon: 'error',
//       title: 'Error redirecting to Stripe',
//       text: error.response?.data?.error || error.message || 'Something went wrong.',
//     });
//   }
// };

const placeOrder = async (e) => {
  e.preventDefault();

  const addressRegex = /^.+,\s*[A-Za-z\s]+,\s*[A-Za-z\s]+,\s*[A-Za-z0-9\s]+,\s*[A-Za-z\s]+$/;

  if (!addressRegex.test(address)) {
    setAddressError("Please enter address in format: Street, City, State, Landmark, Country");
    return;
  }

  setAddressError(""); // Clear error if valid

  try {
    const enrichedCartItems = cartItems.map(item => {
      const unitPrice = getProductPrice(item.productName, item.size);
      return {
        productName: item.productName,
        quantity: item.quantity,
        size: item.size,
        fragrance: item.fragrance || '',
        unitPrice,
      };
    });

    const totalPriceInPaisa = totalPrice;

    const response = await axios.post('http://localhost:4444/stripe/create-payment-intent', {
      cartItems: enrichedCartItems,
      name,
      address,
      totalPrice: totalPriceInPaisa,
    });

    if (response.data.url) {
      window.location.href = response.data.url;
    } else {
      throw new Error('No redirect URL received');
    }
  } catch (error) {
    console.error('Error:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error redirecting to Stripe',
      text: error.response?.data?.error || error.message || 'Something went wrong.',
    });
  }
};




  return (

    <>
    <GlobalStyle/>
    <CheckoutStyle>
    <div className='CheckoutBox'>
      <div className='titleBox'>
      <h1>Checkout</h1>
      </div>
      <div className="itemlist">
        <div className="itemName">
          <p className='itemname'>Item Name</p>
          <p className='singleitemtotalprice'>Price</p>
        </div>
        <div className="allitems">
       {cartItems.map((item, index) => {
  const unitPrice = getProductPrice(item.productName, item.size);
  const totalPriceForItem = unitPrice * item.quantity;

  return (
    <div key={index} className='cartshowproducts' style={{backgroundColor: 'white'}}>
      {item.imageSrc && (
        <img src={`${Image_URL}${item.imageSrc}`} alt={item.productName} width={100} />
      )}
      <div className='checkoutproducttitle'>
        <h3>{item.productName}</h3>
        <div className="checkoutproductprices" style={{ backgroundColor: 'white' }}>
          <p style={{ backgroundColor: 'white' }}>Size: {item.size}ml</p>
          <p style={{ backgroundColor: 'white' }}>Quantity: {item.quantity}</p>
        </div>
      </div>
      <div className="checkoutproductbutton" style={{ backgroundColor: 'white' }}>
        <button onClick={() => deleteProductCart(item.productName)} style={{ backgroundColor: 'white' }}>
          <i className='bi bi-trash-fill' style={{ backgroundColor: 'white' }}></i>
        </button>
      </div>
      <div className="totalprice" style={{ backgroundColor: 'white' }}>
        <p style={{ backgroundColor: 'white' }}>Rs. {totalPriceForItem}</p>
      </div>
    </div>
  );
})}

  
        </div>
        
      </div>
      <br /><br />
      <div className="total">
        <p>Total</p>
        {/* add all of the price and show it */}
        <p>Rs. {totalPrice}</p>
       
       
      </div>
      <div className="order-details">
        <form onSubmit={placeOrder}>
  <label>Address</label>
  <input
    type='text'
    placeholder='Panipokhari street, Kathmandu, Bagmati, Near President Office, Nepal'
    value={address}
    onChange={(e) => setAddress(e.target.value)}
    required
  />
  {addressError && <span style={{ color: 'red' }}>{addressError}</span>}

  <button type="submit" disabled={!stripe}>Place Order</button>
</form>

      </div>
    </div>
    </CheckoutStyle>
    </>
  );
}

export default CheckOut

