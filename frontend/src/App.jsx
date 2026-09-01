// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import React, { Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import CookieConsent from './components/CookieConsent';
import { CartProvider } from './components/CartContext';
import Preloader from './components/Preloader';
import AxiosInterceptor from './components/AxiosInterceptor';
import Analytics from './components/Analytics';

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
const NotFound = React.lazy(() => import('./pages/NotFound'));
const JewelryCare = React.lazy(() => import('./pages/JewelryCare'));
const MaterialsGuide = React.lazy(() => import('./pages/MaterialsGuide'));
const BlogList = React.lazy(() => import('./pages/BlogList'));
const BlogPost = React.lazy(() => import('./pages/BlogPost'));

// Lazy load info pages
const About = React.lazy(() => import('./pages/InfoPages').then(module => ({ default: module.About })));
const FAQ = React.lazy(() => import('./pages/InfoPages').then(module => ({ default: module.FAQ })));

// Lazy load legal / policy pages
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'));
const Returns = React.lazy(() => import('./pages/Returns'));
const TermsPage = React.lazy(() => import('./pages/TermsPage'));

const Contact = React.lazy(() => import('./pages/Contact'));

// New SEO Content Pages
const GiftingHub = React.lazy(() => import('./pages/GiftingHub'));
const SizeGuide = React.lazy(() => import('./pages/SizeGuide'));
const Sustainability = React.lazy(() => import('./pages/Sustainability'));
const Sitemap = React.lazy(() => import('./pages/Sitemap'));

function App() {
  return (
    <HelmetProvider>
      <Preloader />
      <Router>
        <CartProvider>
          <AxiosInterceptor>
          <Analytics />
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
                <Route path="/shop/:category" element={<Shop />} />
                <Route path="/shop/collection/:aesthetic" element={<Shop />} />
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

                {/* info & SEO pages */}
                <Route path="/about" element={<About />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/jewelry-care" element={<JewelryCare />} />
                <Route path="/materials" element={<MaterialsGuide />} />
                <Route path="/journal" element={<BlogList />} />
                <Route path="/journal/:slug" element={<BlogPost />} />
                <Route path="/gifts" element={<GiftingHub />} />
                <Route path="/size-guide" element={<SizeGuide />} />
                <Route path="/sustainability" element={<Sustainability />} />
                <Route path="/sitemap" element={<Sitemap />} />

                {/* legal / policy pages */}
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/returns" element={<Returns />} />

                {/* contact */}
                <Route path="/contact" element={<Contact />} />
                
                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
          </AxiosInterceptor>
      </CartProvider>
    </Router>
    </HelmetProvider>
  );
}

export default App;
