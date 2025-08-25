import express from 'express';
import CheckController from '../controller/CheckController.js';

const checkRoute = express.Router();
const checkInstance = new CheckController();

checkRoute.get("/", checkInstance.check);
checkRoute.post("/logout", checkInstance.logout);


export default checkRoute;