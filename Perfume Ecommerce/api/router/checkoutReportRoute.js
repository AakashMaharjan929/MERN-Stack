import express from 'express';
import CheckoutReportController from '../controller/CheckoutReportController.js';

const checkoutReportRoute = express.Router();
const checkoutReportInstance = new CheckoutReportController();


checkoutReportRoute.post("/", checkoutReportInstance.checkoutReport);
//display checkout report
checkoutReportRoute.get("/checkoutReportAll", checkoutReportInstance.displayCheckoutReport);

export default checkoutReportRoute;