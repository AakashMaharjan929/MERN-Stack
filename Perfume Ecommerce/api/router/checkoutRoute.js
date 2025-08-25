import express from 'express';
import CheckoutController from '../controller/CheckoutController.js';

const checkoutRoute = express.Router();
const checkoutInstance = new CheckoutController();

checkoutRoute.post("/", checkoutInstance.checkout);
//empty cart
checkoutRoute.post("/emptyCart", checkoutInstance.emptyCart);
//display checkout
checkoutRoute.get("/checkoutAll", checkoutInstance.displayCheckout);

//delete checkout
checkoutRoute.delete("/deleteCheckout/:id", checkoutInstance.deleteCheckout);

// Update status of a checkout entry
checkoutRoute.put("/updateStatus/:id", checkoutInstance.updateStatus);

// In checkoutRoute.js
checkoutRoute.get("/userCheckout/:username", checkoutInstance.getCheckoutByUsername);
checkoutRoute.post("/save", checkoutInstance.saveCheckout);




export default checkoutRoute;