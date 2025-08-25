import { useState,useEffect } from 'react'
import axios from 'axios'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Swal from 'sweetalert2';

const addProductSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  priceOld: yup.string()
    .required('Original Price is required'),
    // .test('valid-prices', 'Original Prices must be valid numbers separated by spaces or commas', function(value) {
    //   if (!value) return false;
    //   const prices = value.split(/[\s,]+/);
    //   return prices.every(p => /^[0-9,]+$/.test(p));
    // }),

 priceNew: yup.string()
    .required('Discounted Price is required'),
    // .test('valid-prices', 'Discounted Prices must be valid numbers separated by spaces or commas', function(value) {
    //   if (!value) return false;
    //   const prices = value.split(/[\s,]+/);
    //   return prices.every(p => /^[0-9,]+$/.test(p)); 
    // })
    // .test('prices-length-match', 'Original and Discounted prices count must match', function(value) {
    //   const { priceOld } = this.parent;
    //   if (!priceOld || !value) return false;
    //   const oldPrices = priceOld.split(/[\s,]+/);
    //   const newPrices = value.split(/[\s,]+/);
    //   return oldPrices.length === newPrices.length;
    // })
    // .test('is-less-than', 'Each discounted price must be less than the original price', function(value) {
    //   const { priceOld } = this.parent;
    //   if (!priceOld || !value) return false;

    //   const oldPrices = priceOld.split(/[\s,]+/).map(p => parseFloat(p.replace(/,/g, '')));
    //   const newPrices = value.split(/[\s,]+/).map(p => parseFloat(p.replace(/,/g, '')));
      
    //   return newPrices.every((newP, idx) => newP < oldPrices[idx]);
    // }),


  rating: yup.number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required('Rating is required')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5')
    .integer('Rating must be an integer'),
  description: yup.string().required('Description is required'),
  brandName: yup.string().required('Brand Name is required'),
  duration: yup.mixed()
    .required('Duration is required')
    .test('is-less-than', 'Discounted Price must be less than Original Price', function (value) {
      const { priceOld } = this.parent;
      const cleanOld = parseFloat(priceOld.replace(/,/g, ''));
      const cleanNew = parseFloat(value.replace(/,/g, ''));
      return cleanNew < cleanOld;
    })
      
    .typeError("Must be a number or a string"),
  role: yup.string().required('Role is required'),
  Size: yup.string().required('Size is required'),
  quantity: yup.number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required('Quantity is required')
    .positive('Quantity must be positive')
    .integer('Quantity must be an integer'),

});

function AddProductComponent() {
  const { register, formState: { errors }, handleSubmit, reset } = useForm({
    resolver: yupResolver(addProductSchema)
});

const addProduct = (data) => {

   const sizeArray = data.Size.split(/[\s,]+/).map(s => s.trim());

// split only on spaces, keep commas inside numbers
const priceOldArray = data.priceOld
  .split(/\s+/)
  .map(p => {
    const num = parseFloat(p.replace(/,/g, '').trim());
    return num.toLocaleString(); // will give "2,000" not "2000"
  });

const priceNewArray = data.priceNew
  .split(/\s+/)
  .map(p => {
    const num = parseFloat(p.replace(/,/g, '').trim());
    return num.toLocaleString(); // will give "1,500" not "1500"
  });





  let formData = new FormData();
  formData.append('title', data.title);
  formData.append('priceOld', JSON.stringify(priceOldArray));
formData.append('priceNew', JSON.stringify(priceNewArray));
  formData.append('rating', data.rating);
  formData.append('description', data.description);
  formData.append('brandName', data.brandName);
  formData.append('duration', data.duration);
  formData.append('role', data.role);
  formData.append('imageSrc', data.imageSrc[0]);
  formData.append('imageSrc2', data.imageSrc2[0]);
  formData.append('imageSrc3', data.imageSrc3[0]);
formData.append('size', JSON.stringify(sizeArray));
    formData.append('quantity', data.quantity);


  axios.post('http://localhost:4444/allproducts/store', formData, {
     
  }).then((response) => {
      if(response.data.status){
          Swal.fire({
              icon: "success",
              title: "Your work has been saved",
              showConfirmButton: false,
              timer: 1500
            });
            reset();
      }
  }).catch((error) => {
      console.log("Product not added", error);
  });
}
  

  return (
    <>
    <div>AddProductComponent</div>
    <form className="w3-container" onSubmit={handleSubmit(addProduct)}>
      <div className="w3-row-padding">
      <div className="w3-half">
          <label htmlFor="title">Title:
          <a className='text-danger'>
                            {errors.title?.message && <span>{errors.title?.message}</span>}
                        </a></label>
          <input type="text" id="title" name="title" {...register("title")} className="w3-input" />
        </div>
        <div className="w3-half">
          <label htmlFor="priceOld">Original Price:
          <a className='text-danger'>
                            {errors.priceOld?.message && <span>{errors.priceOld?.message}</span>}
                        </a>
                        </label>
     <input
  type="text"
  id="priceOld"
  name="priceOld"
  placeholder="e.g. 1,000 2,000 3,500"
  {...register("priceOld")}
  className="w3-input"
/>

        </div>

         <div className="w3-half">
          <label htmlFor="Size">Size ( ml ):
          <a className='text-danger'>
                            {errors.Size?.message && <span>{errors.Size?.message}</span>}
                        </a></label>
          <input type="text" id="Size" name="Size" {...register("Size")} className="w3-input" />
        </div>
         <div className="w3-half">
          <label htmlFor="quantity">Quantity:
           <a className='text-danger'>
                            {errors.quantity?.message && <span>{errors.quantity?.message}</span>}
                        </a></label>
          <input type="number" id="quantity" name="quantity" {...register("quantity")} className="w3-input" />
        </div>
      
      </div>
      <div className="w3-row-padding">
        <div className="w3-half">
          <label htmlFor="priceNew">Discounted Price:
          <a className='text-danger'>
          {errors.priceNew?.message && <span>{errors.priceNew?.message}</span>}
          </a></label>
          <input
  type="text"
  id="priceNew"
  name="priceNew"
  placeholder="e.g. 900 1,800 3,000"
  {...register("priceNew")}
  className="w3-input"
/>  
        </div>
        <div className="w3-half">
          <label htmlFor="rating">Rating:</label>
          <select id="rating" name="rating" {...register("rating")} className="w3-select" >
            <option value="5">5</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>
      </div>
      <div className="w3-row-padding">
        <div className="w3-half">
          <label htmlFor="description">Description:</label>
          <textarea id="description" name="description" {...register("description")} className="w3-input" ></textarea>
        </div>
        <div className="w3-half">
          <label htmlFor="brandName">Brand Name:
          <a className='text-danger'>
          {errors.brandName?.message && <span>{errors.brandName?.message}</span>}
          </a></label>
          <input type="text" id="brandName" name="brandName" {...register("brandName")} className="w3-input" />
        </div>
      </div>
      <div className="w3-row-padding">
        <div className="w3-half">
          <label htmlFor="duration">Duration:
          <a className='text-danger'>
          {errors.duration?.message && <span>{errors.duration?.message}</span>}
          </a></label>
          <input type="text" id="duration" name="duration" {...register("duration")} className="w3-input" />
        </div>
        <div className="w3-half">
          <label htmlFor="role">Role:</label>
          <select id="role" name="role" className="w3-select" {...register("role")}>
            <option value="OnSale">OnSale</option>
            <option value="NewProducts Unisex">NewProducts Unisex</option>
            <option value="NewProducts Men">NewProducts Men</option>
            <option value="NewProducts Women">NewProducts Women</option>
            <option value="HotDeals">HotDeals</option>
            <option value="NewProducts">NewProducts</option>
            <option value="BestSellers">BestSellers</option>
          </select>
        </div>
      </div>
      <div className="w3-row-padding">
        <div className="w3-third">
          <label htmlFor="imageSrc">Image 1:</label>
          <input type="file" id="imageSrc" name="imageSrc" {...register("imageSrc")}  className="w3-input" />
        </div>
        <div className="w3-third">
          <label htmlFor="imageSrc2">Image 2:</label>
          <input type="file" id="imageSrc2" name="imageSrc2" {...register("imageSrc2")}  className="w3-input" />
        </div>
        <div className="w3-third">
          <label htmlFor="imageSrc3">Image 3:</label>
          <input type="file" id="imageSrc3" name="imageSrc3" {...register("imageSrc3")}  className="w3-input" />
        </div>
  
        <div className="w3-row-padding">
          <br />
          <br />
        <div className="w3-half">
          <button type="submit" className="w3-button w3-black">Submit</button>
        </div>
      </div>
      </div>
    </form>
    </>
  )
}

export default AddProductComponent