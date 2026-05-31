// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import React, { Suspense } from 'react';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import CookieConsent from './components/CookieConsent';
import { CartProvider } from './components/CartContext';

// Lazy load page components for performance / code splitting
const Home = React.lazy(() => import('./pages/Home'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const Login = React.lazy(() => import('./pages/login'));
const Register = React.lazy(() => import('./pages/register'));
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = React.lazy(() => import('./pages/ResetPassword'));
const Profile = React.lazy(() => import('./pages/profile'));
const Cart = React.lazy(() => import('./pages/Cart'));
const Checkout = React.lazy(() => import('./pages/Checkout'));
const ProductDetails = React.lazy(() => import('./pages/productdetails'));
const Shop = React.lazy(() => import('./pages/Shop'));
const OrderSuccess = React.lazy(() => import('./pages/OrderSuccess'));

// Lazy load info pages
const About = React.lazy(() => import('./pages/InfoPages').then(module => ({ default: module.About })));
const FAQ = React.lazy(() => import('./pages/InfoPages').then(module => ({ default: module.FAQ })));

// Lazy load legal / policy pages
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'));
const Returns = React.lazy(() => import('./pages/Returns'));
const TermsPage = React.lazy(() => import('./pages/TermsPage'));

const Contact = React.lazy(() => import('./pages/Contact'));

function App() {
  return (
    <Router>
      <CartProvider>
        <ScrollToTop />
        <CookieConsent />
        <Toaster position="top-center" />
        <div className="min-h-screen flex flex-col bg-white">
          <Navbar />
          <main className="flex-grow">
            <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><div className="w-8 h-8 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div></div>}>
              <Routes>
                {/* core pages */}
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/product/:id" element={<ProductDetails />} />

                {/* info pages */}
                <Route path="/about" element={<About />} />
                <Route path="/faq" element={<FAQ />} />

                {/* legal / policy pages */}
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/returns" element={<Returns />} />

                {/* contact */}
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;
