import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const newProductsMenSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    priceOld: {
        type: Number,
        required: true
    },
    priceNew: {
        type: Number,
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
        type: Number,
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
        type: Array,
        required: true
    }
});

export default mongoose.model("NewProductsMen", newProductsMenSchema);