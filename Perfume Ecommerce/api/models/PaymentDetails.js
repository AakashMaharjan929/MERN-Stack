import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const paymentDetailsSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const PaymentDetails = mongoose.model('PaymentDetails', paymentDetailsSchema);

export default PaymentDetails;
