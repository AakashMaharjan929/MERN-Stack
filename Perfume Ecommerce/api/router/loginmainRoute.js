import express from 'express';
import LoginController from '../controller/LoginController.js';

const loginMainRoute = express.Router();
const loginInstance = new LoginController();

loginMainRoute.post("/", loginInstance.login);


export default loginMainRoute;