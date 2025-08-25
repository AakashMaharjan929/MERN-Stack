import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';

const Product = () => {
  const { productId } = useParams();
  const location = useLocation();

  const [product, setProduct] = useState(location.state?.product || null);
  const [mainImage, setMainImage] = useState('');
  const [thumbnailImages, setThumbnailImages] = useState([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  useEffect(() => {
    if (!product) {
      axios.get(`http://localhost:4444/products/${productId}`)
        .then(res => {
          const prod = res.data;
          setProduct(prod);
          setMainImage(`http://localhost:4444/public/AllProducts/${prod.imageSrc || ''}`);
          setThumbnailImages([
            `http://localhost:4444/public/AllProducts/${prod.imageSrc2 || prod.imageSrc || ''}`,
            `http://localhost:4444/public/AllProducts/${prod.imageSrc3 || prod.imageSrc || ''}`
          ].filter(Boolean));
        })
        .catch(err => {
          console.error('Failed to fetch product:', err);
          swal("Error!", "Could not load product details.", "error");
        });
    } else {
      setMainImage(`http://localhost:4444/public/AllProducts/${product.imageSrc || ''}`);
      setThumbnailImages([
        `http://localhost:4444/public/AllProducts/${product.imageSrc2 || product.imageSrc || ''}`,
        `http://localhost:4444/public/AllProducts/${product.imageSrc3 || product.imageSrc || ''}`
      ].filter(Boolean));
    }
  }, [productId, product]);

  const handleThumbnailClick = (image) => {
    setMainImage(image);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setSelectedQuantity(isNaN(value) ? 1 : Math.min(value, product?.quantity || 1));
  };

  const addToCart = async () => {
    if (!selectedSize || !selectedQuantity) {
      swal("Error!", "Please select both size and quantity.", "error");
      return;
    }
    try {
      await axios.post(`http://localhost:4444/signup/cart/userName`, {
        productName: product.title,
        size: selectedSize,
        quantity: selectedQuantity,
      });
      swal("Success!", "Item added to cart successfully", "success");
    } catch (error) {
      console.error(error);
      swal("Error!", "Failed to add item to cart", "error");
    }
  };

  if (!product) return <p>Loading product details...</p>;

  return (
    <div className="product-page">
      <style>{`
        .product-page {
          display: flex;
          padding: 40px;
          margin: 0 auto;
          font-family: 'Georgia', serif;
          background-color: #f9f9f9;
        }

        .product-images {
          flex: 1;
          margin-right: 40px;
        }

        .product-images img {
          width: 100%;
          max-height: 500px;
          object-fit: contain;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .thumbnail-container {
          display: flex;
          gap: 15px;
          margin-top: 20px;
        }

        .thumbnail-container img {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 10px;
          border: 2px solid transparent;
          cursor: pointer;
          transition: border-color 0.3s ease;
        }

        .thumbnail-container img:hover {
          border-color: #d3a4b0;
        }

        .product-details {
          display: flex;
          flex-direction: column;
          padding: 20px;
          background-color: #fff;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .product-details h1 {
          font-size: 2.5rem;
          font-weight: bold;
          color: #333;
          margin-bottom: 10px;
        }

        .rating {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 15px;
        }

        .rating span:first-child {
          color: #d3a4b0;
          font-size: 1.2rem;
        }

        .price {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 15px;
        }

        .price span {
          font-size: 1.5rem;
          font-weight: bold;
        }

        .price .original-price {
          text-decoration: line-through;
          color: #888;
          font-size: 1.2rem;
        }

        .price .discount {
          color: #d3a4b0;
          font-size: 1.2rem;
        }

        .description {
          color: #666;
          line-height: 1.6;
          margin-bottom: 20px;
          font-size: 1rem;
        }

        .size-selector,
        .quantity-selector {
          margin-bottom: 20px;
        }

        .size-selector label,
        .quantity-selector label {
          font-weight: bold;
          color: #333;
          margin-bottom: 10px;
          display: block;
        }

        .size-options {
          display: flex;
          gap: 10px;
        }

        .size-options button {
          padding: 10px 20px;
          border: 1px solid #ccc;
          background-color: #fff;
          color: #333;
          cursor: pointer;
          border-radius: 5px;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .size-options button.selected {
          background-color: #d3a4b0;
          color: #fff;
          border-color: #d3a4b0;
        }

        .size-options button:hover {
          background-color: #f0e6e9;
        }

        .quantity-selector input {
          padding: 8px;
          width: 60px;
          border: 1px solid #ccc;
          border-radius: 5px;
          font-size: 1rem;
        }

        .add-to-cart {
          padding: 15px 30px;
          background-color: #d3a4b0;
          color: #fff;
          border: none;
          border-radius: 5px;
          font-weight: bold;
          font-size: 1.1rem;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .add-to-cart:hover {
          background-color: #b5838d;
        }

        @media (max-width: 768px) {
          .product-page {
            flex-direction: column;
            padding: 20px;
          }

          .product-images {
            margin-right: 0;
            margin-bottom: 20px;
          }

          .product-details {
            padding: 15px;
          }
        }
      `}</style>

      <div className="product-images">
        <img src={mainImage} alt={product.title} />
        <div className="thumbnail-container">
          {thumbnailImages.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`${product.title} thumbnail ${idx + 1}`}
              onClick={() => handleThumbnailClick(img)}
            />
          ))}
        </div>
      </div>

      <div className="product-details">
        <h1>{product.title}</h1>
        <div className="rating">
          <span>{product.rating}</span>
        </div>
        <div className="price">
          <span>${product.priceNew || 'N/A'}</span>
          <span className="original-price">${product.priceOld || 'N/A'}</span>
          {product.priceOld && product.priceNew && (
            <span className="discount">
              -{Math.round(((product.priceOld - product.priceNew) / product.priceOld) * 100)}%
            </span>
          )}
        </div>
        <p className="description">{product.description || "No description available."}</p>

        <div className="size-selector">
          <label>Choose Size (ml)</label>
          <div className="size-options">
            {(product.size && product.size.length > 0
              ? product.size
              : ['30ml', '50ml', '100ml']
            ).map((size) => (
              <button
                key={size}
                className={selectedSize === size ? 'selected' : ''}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="quantity-selector">
          <label>Quantity</label>
          <input
            type="number"
            value={selectedQuantity}
            onChange={handleQuantityChange}
            min={1}
            max={product.quantity || 1}
          />
        </div>

        <button className="add-to-cart" onClick={addToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default Product;
