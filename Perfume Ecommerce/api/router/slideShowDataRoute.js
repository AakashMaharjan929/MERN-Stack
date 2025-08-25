import express from 'express';
import SlideShowDataController from '../controller/SlideShowDataController.js';

const slideShowDataRoute = express.Router();
const slideShowDataInstance = new SlideShowDataController();

slideShowDataRoute.get("/", slideShowDataInstance.index);

export default slideShowDataRoute;