import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Swal from 'sweetalert2';

const addProductSchema = yup.object().shape({
  title: yup.string().required(),
  priceOld: yup.string().required(),
  priceNew: yup.string().required(),
  rating: yup.number().required(),
  brandName: yup.string().required(),
  duration: yup.string().required(),
  role: yup.string().required(),
  quantity: yup.number().required(),
});

const BASE_URL = 'http://localhost:4444';
const Image_Path_URL = 'http://localhost:4444/public/AllProducts/';

function ManageProductComponent() {
  const editFormRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editedProduct, setEditedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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
      });
  }, []);

  // Filter products by search term (case-insensitive)
  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Scroll first matched product into view when searchTerm changes
  const firstProductRef = useRef(null);
  // useEffect(() => {
  //   if (firstProductRef.current) {
  //     // Instantly jump to product's offsetTop (no smooth scroll)
  //     window.scrollTo(0, firstProductRef.current.offsetTop);
  //   }
  // }, [searchTerm]);

  const handleEdit = (product) => {
    setEditedProduct(product);
    setEditMode(true);

    // Scroll to edit form after a small delay to ensure it is rendered
    setTimeout(() => {
      if (editFormRef.current) {
        editFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const { register, formState: { errors }, handleSubmit, reset } = useForm({
    resolver: yupResolver(addProductSchema),
    defaultValues: editedProduct || {}
  });

useEffect(() => {
  if (editedProduct) {
    reset({
      ...editedProduct,
      size: Array.isArray(editedProduct.size) ? editedProduct.size.join(' ') : editedProduct.size || '',
      priceOld: Array.isArray(editedProduct.priceOld) ? editedProduct.priceOld.join(' ') : editedProduct.priceOld || '',
      priceNew: Array.isArray(editedProduct.priceNew) ? editedProduct.priceNew.join(' ') : editedProduct.priceNew || '',
    });
  }
}, [editedProduct, reset]);



const updateProduct = (data, id) => {
  const sizeArray = data.size ? data.size.trim().split(/[\s,]+/) : [];

  const priceOldArray = data.priceOld
  .split(/\s+/) // only split on spaces
  .map(p => {
    const num = parseFloat(p.replace(/,/g, '').trim());
    return isNaN(num) ? p : num.toLocaleString(); // "1000" -> "1,000"
  });

const priceNewArray = data.priceNew
  .split(/\s+/) // only split on spaces
  .map(p => {
    const num = parseFloat(p.replace(/,/g, '').trim());
    return isNaN(num) ? p : num.toLocaleString(); // "2700" -> "2,700"
  });


  const formData = {
    title: data.title,
    priceOld: priceOldArray,
    priceNew: priceNewArray,
    rating: data.rating,
    brandName: data.brandName,
    duration: data.duration,
    role: data.role,
    size: sizeArray,
    quantity: data.quantity
  };

  axios.put(`${BASE_URL}/allproducts/${id}`, formData)
    .then((response) => {
      if (response.data.status) {
        Swal.fire({
          icon: "success",
          title: "Your work has been saved",
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          reset();
          setEditMode(false);
          window.location.reload();
        });
      }
    }).catch((error) => {
      console.log("Product not updated", error);
    });
};


  const deleteProduct = (id) => {
    axios.delete(`${BASE_URL}/allproducts/${id}`)
      .then((response) => {
        if (response.data.status) {
          Swal.fire({
            icon: "success",
            title: "Product deleted successfully",
            showConfirmButton: false,
            timer: 1500
          });
          // Refresh product list after deletion
          setProducts(products.filter(p => p._id !== id));
        }
      }).catch((error) => {
        console.log("Product not deleted", error);
      });
  };

  return (
    <>
      <div>ManageProductComponent</div>

      {/* Search bar */}
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search product by name..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            borderRadius: '5px',
            border: '1px solid #ccc'
          }}
        />
      </div>

      <div className="w3-responsive">
        <div
          className="product-card-container"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.5rem',
            justifyContent: 'flex-start'
          }}
        >
          {filteredProducts.map((product, index) => (
            <div
              key={product._id || index}
              ref={index === 0 ? firstProductRef : null}
              className="product-card"
              style={{
                width: 'calc(50% - 1.5rem)', // Two cards per row with gap
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid #ddd',
                borderRadius: '10px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
                backgroundColor: '#fff',
                padding: '1rem',
                boxSizing: 'border-box',
                minHeight: '250px',
              }}
            >
              {/* Image and Details Container */}
              <div
                style={{
                  display: 'flex',
                  gap: '1rem',
                  flexGrow: 1,
                }}
              >
                <img
                  src={`${Image_Path_URL}${product.imageSrc}`}
                  alt={product.title}
                  style={{
                    width: '160px',
                    height: '160px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    flexShrink: 0,
                  }}
                />
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    flex: 1,
                    fontSize: '0.9rem',
                    overflowWrap: 'break-word',
                  }}
                >
                  <h4 style={{ margin: '0 0 0.5rem 0' }}>{product.title}</h4>
                  <p><strong>Old Price:</strong> Rs. {product.priceOld}</p>
                  <p><strong>New Price:</strong> Rs. {product.priceNew}</p>
                  <p><strong>Brand:</strong> {product.brandName}</p>
                  <p><strong>Duration:</strong> {product.duration} hrs</p>
                  <p><strong>Size:</strong> {product.size?.length ? product.size.join(', ') + 'ml' : '10ml'}</p>
                  <p><strong>Quantity:</strong> {product.quantity}</p>
                  <p><strong>Rating:</strong> {'★'.repeat(product.rating)}</p>
                  <p><strong>Role:</strong> {product.role}</p>
                </div>
              </div>

              {/* Buttons */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '0.8rem',
                  borderTop: '1px solid #eee',
                  backgroundColor: '#f9f9f9',
                }}
              >
                <button
                  onClick={() => handleEdit(product)}
                  style={{
                    backgroundColor: '#007BFF',
                    border: 'none',
                    color: 'white',
                    padding: '0.5rem 1.2rem',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteProduct(product._id)}
                  style={{
                    backgroundColor: '#dc3545',
                    border: 'none',
                    color: 'white',
                    padding: '0.5rem 1.2rem',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit form modal */}
      {editMode && editedProduct && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999
        }}>
          <div ref={editFormRef} style={{
            background: '#fff',
            padding: '2rem',
            borderRadius: '10px',
            width: '80%',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative',
          }}>
            {/* Close Button */}
            <button
              onClick={() => setEditMode(false)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'transparent',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
              }}
            >
              &times;
            </button>

            {/* Your Form */}
            <form onSubmit={handleSubmit(data => updateProduct(data, editedProduct._id))}>
              <div className="w3-row-padding">
                <div className="w3-half">
                  <label>Title:</label>
                  <input type="text" {...register("title")} className="w3-input" />
                  <span className="text-danger">{errors.title?.message}</span>
                </div>
                <div className="w3-half">
                  <label>Old Price:</label>
                  <input type="text" {...register("priceOld")} className="w3-input" />
                  <span className="text-danger">{errors.priceOld?.message}</span>
                </div>
              </div>

              <div className="w3-row-padding">
                <div className="w3-half">
                  <label>New Price:</label>
                  <input type="text" {...register("priceNew")} className="w3-input" />
                  <span className="text-danger">{errors.priceNew?.message}</span>
                </div>
                <div className="w3-half">
                  <label>Quantity:</label>
                  <input type="number" {...register("quantity")} className="w3-input" />
                  <span className="text-danger">{errors.quantity?.message}</span>
                </div>
              </div>

              <div className="w3-row-padding">
                <div className="w3-half">
                  <label>Brand Name:</label>
                  <input type="text" {...register("brandName")} className="w3-input" />
                  <span className="text-danger">{errors.brandName?.message}</span>
                </div>
                <div className="w3-half">
                  <label>Duration:</label>
                  <input type="text" {...register("duration")} className="w3-input" />
                  <span className="text-danger">{errors.duration?.message}</span>
                </div>
              </div>

              <div className="w3-row-padding">
                <div className="w3-half">
  <label>Size (space/comma separated, ml):</label>
  <input type="text" {...register("size")} className="w3-input" />
  <span className="text-danger">{errors.size?.message}</span>
</div>
                <div className="w3-half">
                  <label>Rating:</label>
                  <select {...register("rating")} className="w3-select">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <span className="text-danger">{errors.rating?.message}</span>
                </div>
              </div>

              <div className="w3-row-padding">
                <div className="w3-half">
                  <label>Role:</label>
                  <select {...register("role")} className="w3-select">
                    <option value="NewProducts Unisex">NewProducts Unisex</option>
                    <option value="NewProducts Men">NewProducts Men</option>
                    <option value="NewProducts Women">NewProducts Women</option>
                    <option value="OnSale">OnSale</option>
                  </select>
                  <span className="text-danger">{errors.role?.message}</span>
                </div>
              </div>

              <div className="w3-row-padding" style={{ marginTop: '1rem' }}>
                <button type="submit" className="w3-button w3-black">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default ManageProductComponent;
