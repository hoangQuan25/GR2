// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AuctionList from "./pages/home/AuctionList";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import AuctionItemDetail from "./pages/biddetail/AuctionItemDetail";
import MyProducts from "./pages/products/MyProducs";
import ProductForm from "./pages/products/AddProduct";
import MyAuctions from "./pages/myauction/MyAuctions";
import { NotificationProvider } from "./context/NotificationContext";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <Header />
            <Routes>
              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <AuctionList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/item/:id"
                element={
                  <ProtectedRoute>
                    <AuctionItemDetail />
                  </ProtectedRoute>
                }
              />

              {/* Add Product & My Products */}
              <Route
                path="/add-product"
                element={
                  <ProtectedRoute>
                    <ProductForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-product/:productId"
                element={
                  <ProtectedRoute>
                    <ProductForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-products"
                element={
                  <ProtectedRoute>
                    <MyProducts />
                  </ProtectedRoute>
                }
              />

              {/* My Auctions */}
              <Route
                path="/my-auctions"
                element={
                  <ProtectedRoute>
                    <MyAuctions />
                  </ProtectedRoute>
                }
              />

              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              {/* Add more routes as needed */}
            </Routes>
          </div>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
