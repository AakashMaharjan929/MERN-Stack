import express from 'express';
import PaymentController from '../controller/PaymentController.js';

const paymentRoute = express.Router();

const paymentInstance = new PaymentController();


paymentRoute.post('/record-payment', paymentInstance.storePayment);

export default paymentRoute;
