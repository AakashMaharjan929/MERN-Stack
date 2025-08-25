import express from 'express';
import StripeController from '../controller/StripeController.js';

const stripeRoute = express.Router();
const stripeInstance = new StripeController();

stripeRoute.post('/create-payment-intent', stripeInstance.createCheckoutSession);
stripeRoute.get('/session-details/:sessionId', stripeInstance.getSessionDetails);


export default stripeRoute;