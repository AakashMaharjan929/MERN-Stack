import express from 'express';
import AllProductsController from "../controller/AllProductsController.js";
import UploadMiddleware from '../middleware/UploaderMiddleware.js';

const allProductRoute = express.Router();
const allProductInstance = new AllProductsController();

const uploadInstance = new UploadMiddleware();

// Configure multer to accept multiple files with different field names
const upi = uploadInstance.upload("AllProducts").fields([
    { name: 'imageSrc', maxCount: 1 },
    { name: 'imageSrc2', maxCount: 1 }, 
    { name: 'imageSrc3', maxCount: 1 }
]);

allProductRoute.get("/", allProductInstance.index);
allProductRoute.get("/search", allProductInstance.show);
allProductRoute.post("/store", upi, allProductInstance.store);
allProductRoute.put("/:id", allProductInstance.update);
allProductRoute.get("/:id", allProductInstance.showById);
allProductRoute.delete("/:id", allProductInstance.destroy);

export default allProductRoute;
