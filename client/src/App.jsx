import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import OurStore from "./pages/OurStore";
import Wishlist from "./pages/Wishlist";
import Login from "./pages/Login";
import Forgotpassword from "./pages/Forgotpassword";
import Signup from "./pages/Signup";
import Resetpassword from "./pages/Resetpassword";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundPloicy from "./pages/RefundPloicy";
import ShippingPolicy from "./pages/ShippingPolicy";
import TermAndContions from "./pages/TermAndContions";
import SingleProduct from "./pages/SingleProduct";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import { PrivateRoute } from "./routes/PrivateRoute";
import { OpenRoute } from "./routes/OpenRoute";
import Orders from "./pages/Orders";
import CategoryProducts from "./pages/CategoryProducts";
import Profile from "./pages/Profile";
import SuccessPayment from "./pages/SuccessPayment";
import Hero2 from "./components/Hero2";
import BulkOrders from "./pages/BulkOrders";
import UnsuccessfulPayment from "./pages/UnsuccessfulPayment";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="order" element={<PrivateRoute><Orders/></PrivateRoute>}/>
            <Route path="contact" element={<Contact />} />
            <Route path="product" element={<OurStore />} />
            <Route path="product/:id" element={<SingleProduct />} />
            <Route path="bulk/:id" element={<BulkOrders/>} />
            <Route path="category/:id" element={<CategoryProducts/>} />
            <Route path="cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
            <Route path="checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
            <Route path="wishlist" element={<PrivateRoute><Wishlist /></PrivateRoute>} />
            <Route path="login" element={<OpenRoute><Login /></OpenRoute>} />
            <Route path="signup" element={<OpenRoute><Signup /></OpenRoute>} />
            <Route path="forgot-password" element={<Forgotpassword />} />
            <Route path="reset-password/:token" element={<Resetpassword />} />
            <Route path="profile" element={<PrivateRoute><Profile/></PrivateRoute>} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="refund-policy" element={<RefundPloicy />} />
            <Route path="shipping-policy" element={<ShippingPolicy />} />
            <Route path="term-conditions" element={<TermAndContions />} />
            <Route path="success" element={<SuccessPayment/>} />
            <Route path="cancel" element={<UnsuccessfulPayment/>} />
            <Route path="ll" element={<Hero2/> }/>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;


