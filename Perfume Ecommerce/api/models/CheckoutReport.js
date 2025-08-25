import mongoose from 'mongoose';
import dotenv from 'dotenv';

const checkoutReportSchema= new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    //these fields are received in array each title[], size[], fragrance[], quantity[] put these fields
    title: {
        type: Array,
        required: true
    },
    size: {
        type: Array,
        required: true
    },
    quantity: {
        type: Array,
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
    dateOfPurchase:{
        type: Date,
        required: true
    },
    dateOfDelivery:{
        type: Date,
        default: Date.now
    },
    status:{
        type: String,
        default: "Pending"
    }
    // Add more fields as needed
});

export default mongoose.model("CheckoutReport", checkoutReportSchema);