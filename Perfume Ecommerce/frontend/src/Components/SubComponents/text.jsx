import React, { useState, useEffect } from 'react';

// Define the base URL
const BASE_URL = 'http://localhost:4444';

function ProductsDisplay() {
  // State to store the fetched data
  const [products, setProducts] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${BASE_URL}/newproductsmen/`)
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

  // Function to create the image path

return (
    <div>
        {products && products.map((product, index) => (
            <div key={index}>
                <h2>{product.title}</h2>
                <p>{product.priceOld}</p>
                <img src={`${BASE_URL}/${product.imageSrc3}`} alt={product.name} />
            </div>
        ))}
    </div>
);
}

export default ProductsDisplay;
