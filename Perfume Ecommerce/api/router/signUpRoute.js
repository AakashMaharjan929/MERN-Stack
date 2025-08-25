import express from 'express';
import SignUpController from '../controller/SignUpController.js';

const signUpRoute = express.Router();
const signUpInstance = new SignUpController();

signUpRoute.post('/', signUpInstance.store);
signUpRoute.get('/find', signUpInstance.index);
signUpRoute.get('/details', signUpInstance.getUserDetails);
signUpRoute.post('/cart/:username', signUpInstance.cart);
signUpRoute.get('/getcart/:username', signUpInstance.getCartItems);
signUpRoute.post('/favorite/:username', signUpInstance.favourite);  
signUpRoute.get('/getfavorite/:username', signUpInstance.getFavoriteItems);
signUpRoute.post('/deletefavorite', signUpInstance.deleteFavorite);
signUpRoute.post('/deletecart', signUpInstance.deleteCart);





export default signUpRoute;