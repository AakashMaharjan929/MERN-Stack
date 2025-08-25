import express from 'express';
import NewProductsMenController from '../controller/NewProductsMenController.js';
import UploadMiddleware from '../middleware/UploaderMiddleware.js';

const uploadInstance = new UploadMiddleware();
const upi = uploadInstance.upload("NewProductsMen");

const newProductsMenRoute = express.Router();
const newProductsMenInstance = new NewProductsMenController();

newProductsMenRoute.get("/", newProductsMenInstance.index);
newProductsMenRoute.post("/store",upi.fields([{ name: 'imageSrc', maxCount: 1 }, { name: 'imageSrc2', maxCount: 1 }, { name: 'imageSrc3', maxCount: 1 }]),  newProductsMenInstance.store);



export default newProductsMenRoute;