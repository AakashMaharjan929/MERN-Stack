import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const signUpSchema = new mongoose.Schema({ 
    // Define your schema fields here
    // Add more fields as needed
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    role:{
        type: String,
        enum:["user", "admin"],
        default:"user",
    },
    cart: [{
        productName: {
            type: String,
            required: true
        },
        size: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],

    favorite: [{
        title: {
            type: String,
            required: true
        },
        priceOld: [{
            type: String,
            required: true
        }],
        priceNew: [{
            type: String,
            required: true
        }],
        rating: {
            type: Number,
            required: false
        },
        description: {
            type: String,
            required: true
        },
        imageSrc: {
            type: String,
            required: true
        },
        imageSrc2: {
            type: String,
            required: true
        },
        imageSrc3: {
            type: String,
            required: true
        }
    }]
    // Add more fields as needed
});


export default mongoose.model("SignUp", signUpSchema);