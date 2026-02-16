import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';

// Pages
import Home from './pages/Home.jsx';
import Shop from './pages/Shop.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';
import Orders from './pages/Orders.jsx';
import OrderDetails from './pages/OrderDetails.jsx';
import Invoice from './pages/Invoice.jsx';
import About from './pages/About.jsx';
import HelpCenter from './pages/Contact.jsx';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard.jsx';
import AdminProducts from './pages/admin/Products.jsx';
import AdminOrders from './pages/admin/Orders.jsx';
import AdminUsers from './pages/admin/Users.jsx';
import AdminReviews from './pages/admin/Reviews.jsx';
import AdminCoupons from './pages/admin/Coupons.jsx';

// Agent Pages
import AgentDashboard from './pages/agent/Dashboard.jsx';
import AgentOrders from './pages/agent/Orders.jsx';

// Components
import PrivateRoute from './components/PrivateRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import AgentRoute from './components/AgentRoute.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';

function App() {
    return (
        <Router>
            <div className="flex flex-col min-h-screen">
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 3000,
                        style: {
                            background: '#fff',
                            color: '#333',
                            padding: '16px',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        },
                        success: {
                            iconTheme: {
                                primary: '#22c55e',
                                secondary: '#fff',
                            },
                        },
                    }}
                />
                <ScrollToTop />
                <Navbar />
                <main className="flex-grow">
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/shop" element={<Shop />} />
                        <Route path="/product/:id" element={<ProductDetails />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/help-center" element={<HelpCenter />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Private Routes */}
                        <Route
                            path="/profile"
                            element={
                                <PrivateRoute>
                                    <Profile />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/checkout"
                            element={
                                <PrivateRoute>
                                    <Checkout />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/orders"
                            element={
                                <PrivateRoute>
                                    <Orders />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/order/:id"
                            element={
                                <PrivateRoute>
                                    <OrderDetails />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/order/:id/invoice"
                            element={
                                <PrivateRoute>
                                    <Invoice />
                                </PrivateRoute>
                            }
                        />

                        {/* Agent Routes */}
                        <Route
                            path="/agent/dashboard"
                            element={
                                <AgentRoute>
                                    <AgentDashboard />
                                </AgentRoute>
                            }
                        />
                        <Route
                            path="/agent/orders"
                            element={
                                <AgentRoute>
                                    <AgentOrders />
                                </AgentRoute>
                            }
                        />

                        {/* Admin Routes */}
                        <Route
                            path="/admin/dashboard"
                            element={
                                <AdminRoute>
                                    <AdminDashboard />
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="/admin/products"
                            element={
                                <AdminRoute>
                                    <AdminProducts />
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="/admin/orders"
                            element={
                                <AdminRoute>
                                    <AdminOrders />
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="/admin/users"
                            element={
                                <AdminRoute>
                                    <AdminUsers />
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="/admin/reviews"
                            element={
                                <AdminRoute>
                                    <AdminReviews />
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="/admin/coupons"
                            element={
                                <AdminRoute>
                                    <AdminCoupons />
                                </AdminRoute>
                            }
                        />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
