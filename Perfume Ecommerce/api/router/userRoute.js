import express from 'express';
import UserController from "../controller/UserController.js";
import UploadMiddleware from '../middleware/UploaderMiddleware.js';

const userRoute = express.Router();
const userInstance = new UserController();
const uploadInstance = new UploadMiddleware();
const upi = uploadInstance.upload("users");

userRoute.get('/', userInstance.index);
userRoute.get('/:id', userInstance.show);
userRoute.post('/',upi.single("image"), userInstance.store); 
userRoute.put('/', userInstance.update); 
userRoute.delete('/', userInstance.destroy); 

export default userRoute;