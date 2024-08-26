import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import Customers from "./pages/Customers";
import AddCustomer from "./pages/AddCustomer";
import EditCustomer from "./pages/EditCustomer";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails"; // Assuming you have this component
import Home from "./pages/Home"; // Assuming you have this component
import NotFound from "./pages/NotFound";
import "./App.css"

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/edit-product/:id" element={<EditProduct />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/add-customer" element={<AddCustomer />} />
        <Route path="/edit-customer/:id" element={<EditCustomer />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<OrderDetails />} /> {/* Example detail route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
