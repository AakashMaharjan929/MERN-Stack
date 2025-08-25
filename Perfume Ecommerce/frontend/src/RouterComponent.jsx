import React from "react";
import { Routes, Route} from 'react-router-dom';
import HomeComponent from "./Components/HomeComponent";
import LoginComponent from "./Components/LoginComponent";
import SignUpComponent from "./Components/SignUpComponent";
import AdminRouteMiddleware from "./Components/middleware/AdminRouteMiddleware";
import Dashboard from "./Components/admin/DashboardComponent";
import AddProductComponent from "./Components/admin/AddProductComponent";
import ContactComponent from "./Components/ContactComponent";
import BrandComponent from "./Components/BrandComponent";
import AboutUs from "./Components/AboutUs";
import ManageProductComponent from "./Components/admin/ManageProductComponent";
import CheckOut from "./Components/SubComponents/CheckOut";
import ManageCheckout from "./Components/admin/ManageCheckout";
import DeliveryStatus from "./Components/SubComponents/DeliveryStatus";
import PaymentSuccess from "./Components/SubComponents/PaymentSuccess";
import Product from "./Components/SubComponents/Product";


export default function RouterComponent(){
    return(
        <div>
            <Routes>
                <Route path="/" element={<HomeComponent />}></Route>
                <Route path="/login" element={<LoginComponent />}></Route>
                <Route path="/signup" element={<SignUpComponent />}></Route>
                <Route path="/contact" element={<ContactComponent />}></Route>
                <Route path="/admin" element={<AdminRouteMiddleware/>}>
                <Route path='/admin' element={<Dashboard />}></Route>
                <Route path='/admin/addproduct' element={<AddProductComponent />}></Route>
                <Route path='/admin/manageproduct' element={<ManageProductComponent />}></Route>
                <Route path='/admin/managecheckout' element={<ManageCheckout />}></Route>
                {/* <Route path='/admin/showusers' element={<ShowUsersComponent />}></Route>
                <Route path='/admin/addusers' element={<AddUserComponent />}></Route> */}
                </Route>
                <Route path="/brand/:brandName" element={<BrandComponent />}></Route>
                <Route path="/aboutus" element={<AboutUs />}></Route>
                <Route path="/checkout" element={<CheckOut />}></Route>
                <Route path="/delivery-status" element={<DeliveryStatus />}></Route>
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/product/:productId" element={<Product />} />
            </Routes>
        </div>
    )
}