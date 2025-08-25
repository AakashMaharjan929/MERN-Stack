import express from "express";
import userRoute from "./userRoute.js";

import allProductRoute from "./allProductRoute.js";
import slideShowDataRoute from "./slideShowDataRoute.js";
import signUpRoute from "./signUpRoute.js";
import loginMainRoute from "./loginmainRoute.js";
import checkRoute from "./checkRoute.js";
import newProductsMenRoute from "./newProductsMen.js";
import checkoutRoute from "./checkoutRoute.js";
import checkoutReportRoute from "./checkoutReportRoute.js";
import StripeRoute from "./stripeRoute.js";
import paymentRoute from "./paymentRoute.js";

const webRouter = express.Router();
//all routers file register here
webRouter.get('/', (req,res)=>{
    res.send('Welcome to the home page');
});

webRouter.use('/check', checkRoute);
webRouter.use('/user', userRoute);
webRouter.use('/allproducts', allProductRoute);
webRouter.use('/slideshowdata', slideShowDataRoute);
webRouter.use('/signup', signUpRoute);
webRouter.use('/login', loginMainRoute);
webRouter.use('/newproductsmen', newProductsMenRoute);
webRouter.use('/checkoutTotal', checkoutRoute);
webRouter.use('/checkoutReport', checkoutReportRoute);
webRouter.use('/stripe', StripeRoute);
webRouter.use('/payment', paymentRoute);

export default webRouter;