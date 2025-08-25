import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const slideShowDataSchema = new mongoose.Schema({ 
    // Define your schema fields here
    id: {
        type: Number,
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
    },
    priceNew: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
        required: true
    },
    classname: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
    // Add more fields as needed
});


export default mongoose.model("SlideShowData", slideShowDataSchema);