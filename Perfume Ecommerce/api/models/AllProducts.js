import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const allProductsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  priceOld: {
    type: [String],   // or [Number] if you prefer numeric storage
    required: true
  },
  priceNew: {
    type: [String],   // or [Number]
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  brandName: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  imageSrc: {
    type: String,
  },
  imageSrc2: {
    type: String,
  },
  imageSrc3: {
    type: String,
  },
  size: {
    type: [String],   // your existing array of strings is fine
    required: true
  },
  quantity: {
    type: Number,
    default: 20
  }
});


export default mongoose.model('AllProduct', allProductsSchema);
