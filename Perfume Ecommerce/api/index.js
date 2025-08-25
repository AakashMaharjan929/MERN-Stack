import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import webRouter from './router/web.js';
import connection from './database/connection.js'; 
// import UserTableSeeder from './database/seeder/UserTableSeeder.js';
import User from './models/User.js';

import AllProduct from './models/AllProducts.js';
import SlideShowData from './models/SlideShowData.js';
import UploadMiddleware from './middleware/UploaderMiddleware.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import SignUp from './models/SignUp.js';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import NewProductsMen from './models/NewProductsMen.js';
import UserTableSeeder from './database/seeder/UserTableSeeder.js';
import Stripe from 'stripe';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const app =express();
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Include PUT and DELETE methods here
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({
    secret : 'secret',
    resave : false,
    saveUninitialized : false,
    cookie : {
        secure : false,
        maxAge : 1000 * 60 * 60 * 24
    }
}));

connection();

app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// app.post('/login', async (req, res) => {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email, password });
//     if (user) {
//         return res.status(200).send('Login successful');
//     } else{
//     return res.status(401).send('Invalid credentials');
//     }

//   });




app.use('/', webRouter);
UserTableSeeder.run();

app.get('/', async (req, res) => {  // => arrow function
    let data =await AllProduct.find({})
        res.status(200).json(data);
});


app.get('/insert', async (req, res) => {  // => arrow function
    let data = {
       name: "jaquar",
       price: 2000,
       image: null
    }
        let student = new AllProduct(data);
        await student.save();
        res.status(200).json({message: "Data inserted"});
});

const uploadInstance = new UploadMiddleware();
const upi = uploadInstance.upload("AllProducts");


// app.post('/', upi.single('image'), async(req, res) => {
//     req.body.image = req.file.path;
//     const sR = new AllProduct(req.body);
//     await sR.save();
//     return res.status(201).send(sR);
// });
// app.post('/', async(req, res) => {
//     const sR = new SignUp(req.body);
//     await sR.save();
//     return res.status(201).send(sR);
// });


app.post('/', upi.fields([{ name: 'imageSrc', maxCount: 1 }, { name: 'imageSrc2', maxCount: 1 }, { name: 'imageSrc3', maxCount: 1 }]), async (req, res) => {
    // Assuming each image is optional, check if they were uploaded and set their paths accordingly
    const images = {
        imageSrc: req.files['imageSrc'] ? req.files['imageSrc'][0].path : undefined,
        imageSrc2: req.files['imageSrc2'] ? req.files['imageSrc2'][0].path : undefined,
        imageSrc3: req.files['imageSrc3'] ? req.files['imageSrc3'][0].path : undefined,
    };

    // Construct the new product object with both the text fields and image paths
    const productData = {
        ...req.body,
        ...images // This will add image paths to the product data, setting them to undefined if no image was uploaded for a field
    };

    try {
        const newProduct = new NewProductsMen(productData);
        await newProduct.save(); // Save the new product to the database
        return res.status(201).send(newProduct); // Send back the newly created product
    } catch (error) {
        return res.status(500).send(error); // Handle errors
    }
});


// const upi1 = uploadInstance.upload("SlideShowData");
// app.post('/', upi1.fields([{ name: 'imageSrc', maxCount: 1 }, { name: 'imageSrc2', maxCount: 1 }, { name: 'imageSrc3', maxCount: 1 }]), async(req, res) => {
//     try {
//         const { id, priceNew, title, subtitle, classname, description } = req.body;
//         const imageSrc = req.files['imageSrc'] ? req.files['imageSrc'][0].path : undefined;
//         const imageSrc2 = req.files['imageSrc2'] ? req.files['imageSrc2'][0].path : undefined;
//         const imageSrc3 = req.files['imageSrc3'] ? req.files['imageSrc3'][0].path : undefined;

//         if (!imageSrc || !imageSrc2 || !imageSrc3) {
//             return res.status(400).send('All images are required');
//         }

//         const slideShowData = new SlideShowData({
//             id,
//             imageSrc,
//             imageSrc2,
//             imageSrc3,
//             priceNew,
//             title,
//             subtitle,
//             classname,
//             description
//         });

//         await slideShowData.save();
//         return res.status(201).send(slideShowData);
//     } catch (error) {
//         return res.status(500).send(error.message);
//     }
// });
// UserTableSeeder.run();

app.get('/', (req,res)=>{

    res.send("Hello World");
});

const port = process.env.PORT || 3000;
app.listen(port , ()=>{
    console.log(`Server is running on port ${port}`);
})