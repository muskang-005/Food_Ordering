// src/App.js
import React from 'react';
import Headers from './components/Headers';
import Home from './components/Home';
import CartDetails from './components/CartDetails';
import FavoriteItems from './components/FavoriteItems';
import Login from './components/Login';
import ManageProduct from './components/ManageProduct';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import toast, { Toaster } from 'react-hot-toast';
import OrderHistory from './components/OrderHistory';
import Signup from './components/Signup';
import { UserProvider } from './components/UserContext'; // Import UserProvider

function App() {
  return (
    <UserProvider> {/* Wrap your app with UserProvider */}
      <Headers />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<CartDetails />} />
        <Route path="/favorites" element={<FavoriteItems />} />
        <Route path="/orderhistory" element={<OrderHistory />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected route for managing products */}
        <Route 
          path="/manage-product" 
          element={<ProtectedRoute component={ManageProduct} role="admin" />} 
        />

        {/* Redirect any other route to Home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Toaster />
    </UserProvider>
  );
}

export default App;
