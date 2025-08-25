import mongoose from 'mongoose';

const connection = async() => {
    try {
        await mongoose.connect('mongodb://127.0.0.1/PerfumeProject');
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('MongoDB Connection Error:', error);
    }
};

export default connection;