import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const checkoutSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  title: {
    type: [String],     // List of product titles
    required: true
  },
  size: {
    type: [String],     // List of sizes like "10ml", "20ml"
    required: true
  },
  quantity: {
    type: [Number],     // List of quantities
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  dateOfPurchase: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: "Order Placed"
  }
});

export default mongoose.model("Checkout", checkoutSchema);
