# SERA Jewelry - Reference Rules & Technical Architecture

This document outlines the design tokens, component interactions, database schemas, routing paths, and animations across the Sera frontend and backend applications.

---

## 1. Brand Styling & Color System

Sera uses a customized Tailwind CSS v4 design system configured with standard serif and sans typography to reflect a premium luxury brand aesthetic.

### Typography
* **Serif Font**: `"Playfair Display", serif` (Applied to all headers: `h1, h2, h3, h4, h5, h6` and premium sections)
* **Sans Font**: `"Inter", sans-serif` (Applied to body copy and default UI inputs)

### Color Palette (Tailwind CSS v4 `@theme` & Global CSS Variables)
* **Baby Pink**: `#ffe4e6` (Used for page backgrounds, overlay containers, and soft highlights)
* **Rose 50**: `#fff1f2` (Light pink background tint for secondary banners, product highlights, and cards)
* **Rose 500**: `#f43f5e` (Theme accent color used for buttons, interactive states, badges, and primary text links)
* **Gold Accent**: `#c5a666` (Applied to luxury elements, contact pages, header typography, and Brevo SMTP email banners)
* **Body Background**: `#ffffff`
* **Body Text**: `#1a1a1a` (High contrast charcoal/black for primary readability)

---

## 2. Frontend Architecture & Routing

The React frontend utilizes standard Vite configs and React Router DOM v7 client-side history navigation.

### Routing Layout (`App.jsx`)
* **Root Provider**: `<CartProvider>` supplies cart state and API synchronizations.
* **Page-Reset Hook**: `<ScrollToTop />` handles scrolling window offset to `(0,0)` on location adjustments.
* **Notification System**: `<Toaster position="top-center" />` captures popups.

### Router Map (`App.jsx`)
* **Core Pages**:
  * `/` ➔ `Home` (Hero sections, WebGL shader slider, category panels, gifting slider, bento collections)
  * `/shop` ➔ `Shop` (Dynamic search/filter catalogue synced to URL query string parameters)
  * `/product/:id` ➔ `ProductDetails` (Individual item pages, reviews, sharing utilities, and coordinate items)
  * `/cart` ➔ `Cart` (Shopping drawer list, quantity adjustments)
  * `/checkout` ➔ `Checkout` (Delivery address inputs, coupon apply, Razorpay Web payment integration)
  * `/order-success` ➔ `OrderSuccess` (Displays invoice metadata and confetti effects)
  * `/profile` ➔ `Profile` (Manages user history, saved addresses, wishlist, and cancellation/exchanges)
* **Authentication Pages**:
  * `/login` (Email and password entry)
  * `/register` (Multi-step flow verified by Email OTP)
  * `/forgot-password` (Triggers Brevo verification code)
  * `/reset-password` (Resets authentication credentials)
* **Information & Compliance Pages**:
  * `/about` & `/faq` ➔ `InfoPages`
  * `/privacy-policy` ➔ `PrivacyPolicy`
  * `/terms` ➔ `TermsPage`
  * `/returns` ➔ `Returns`
  * `/contact` ➔ `Contact`
  * `/jewelry-care` ➔ `JewelryCare`
  * `/materials` ➔ `MaterialsGuide`
* **SEO & Content Discovery Pages**:
  * `/gifts` ➔ `GiftingHub` (Curated gifting collections)
  * `/size-guide` ➔ `SizeGuide` (Jewelry sizing charts)
  * `/sustainability` ➔ `Sustainability` (Eco-friendly standards and sourcing)
  * `/sitemap` ➔ `Sitemap` (HTML sitemap for user navigation & crawler indexing)
  * `/journal` ➔ `BlogList` (SEO Editorial & Brand Blog index)
  * `/journal/:slug` ➔ `BlogPost` (Individual blog articles)
* **Administrative Pages**:
  * `/admin` ➔ `AdminDashboard` (Controls products, orders, categories, contacts, blogs, and coupons)

---

## 3. Core Frontend Animations & Motion Controls

All animations utilize `framer-motion` to keep the UI smooth and responsive.

### Parallax Text Ticker (`TopBanner.jsx`)
* **Velocity**: `0.5`
* **Motion Hooks**: `useMotionValue(0)`, `useTransform(baseX, (v) => wrap(-20, -45, v)%)`, and `useAnimationFrame()`
* **Behavior**: Shifts text horizontally from left to right continuously, wrapping coordinate strings seamlessly.

### Global Header Header (`Navbar.jsx`)
* **Slide down on mount**:
  ```javascript
  initial={isHome ? { y: -100, opacity: 0 } : { y: 0, opacity: 1 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.8, ease: "easeOut" }}
  ```
* **Icon States (Menu, Search, Cart)**:
  * `whileHover={{ color: '#f43f5e', scale: 1.1 }}`
  * `whileTap={{ scale: 0.95 }}`
  * Transition duration is locked at `0.2` seconds.
* **Badge (Cart items)**:
  * Wrapped in `<AnimatePresence>`
  * `initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}`

### Side Navigation Overlay Drawer (`NavOverlay.jsx`)
* **Backdrop**: Fades to `opacity: 1` from `0` using a `0.3` second transition.
* **Drawer Slide**: Slides horizontally from `x: "100%"` to `0` with cubic bezier ease-out timing:
  ```javascript
  transition={{ duration: 0.5, ease: [0.165, 0.84, 0.44, 1] }}
  ```
* **Menu Items Stagger**: Fades and moves in horizontally from `x: 20` using dynamic delay offsets:
  ```javascript
  transition={{ delay: 0.1 + index * 0.1 }}
  ```
* **Submenu Drawer**: Expands height vertically using height boundaries:
  ```javascript
  initial={{ height: 0, opacity: 0 }}
  animate={{ height: "auto", opacity: 1 }}
  exit={{ height: 0, opacity: 0 }}
  ```

### Search drawer popover (`SearchOverlay.jsx`)
* **Animation properties**: Slides down and fades in:
  ```javascript
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  ```
* **Hover elements**: `whileHover={{ scale: 1.02 }}` over search results list.

### Hero WebGL Shader Slider (`lumina-interactive-list.tsx`)
* **WebGL Shaders (Three.js + GSAP)**: Custom fragment shader driving glass refraction, frost, and ripple transitions.
* **Low-End GPU Stabilization (Mali GPUs)**: GLSL fragment shaders use **branchless math** (avoiding conditional `if` statements in favor of `mix()` and `step()` functions) to prevent shader compilation crashes and expanding circle artifacts on mobile Mali GPUs.

### Preloader Component (`Preloader.jsx`)
* **Asset Prefetching**: Blocks UI render until all 4 core Hero WebGL slide textures AND primary Category images (Earrings, Bracelet, Necklace) are fully loaded into browser memory.
* **Cinematic Easing**: Smooth cubic-bezier animation with fallback network timeout safety.

### Flying Offers Flyer Banner (`Home.jsx`)
* **Flyer Entrance**: Slides, scales, and rotates in:
  ```javascript
  initial={{ x: 400, y: 400, opacity: 0, rotate: 20, scale: 0.7 }}
  animate={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
  transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1] }} // Spring effect
  ```
* **Flyer Exit**: Slides out towards the bottom left:
  ```javascript
  exit={{ x: -420, y: mobile ? 55 : 280, opacity: 0, scale: 0.4, rotate: -8 }}
  transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
  ```
* **Auto-rotation Loop**: Rotates current active offer index every `2.5` seconds.
* **Progress Bar indicator**: Animates horizontally at the base of the banner from `width: "0%"` to `"100%"` over `6` seconds (the banner's visible lifetime).
* **Infinite Sparkle animations**: Rotates and pulses scales continuously:
  ```javascript
  animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7], rotate: [0, 180, 360] }}
  transition={{ duration: 2.5, repeat: Infinity }}
  ```
* **Infinite Heart pulse**:
  ```javascript
  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
  transition={{ duration: 2.2, repeat: Infinity }}
  ```
* **Shimmer Overlays**: Translates a gradient sweep across the card to indicate interactivity:
  ```javascript
  animate={{ x: ['-100%', '200%'] }}
  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }}
  ```

### Floating Coupon Drawer (`Home.jsx`)
* **Drawer Entry**: Slides from the left boundary:
  ```javascript
  initial={{ opacity: 0, scale: 0.5, x: -50 }}
  animate={{ opacity: 1, scale: 1, x: 0 }}
  transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1], delay: 0.2 }}
  ```
* **Heartbeat Indicator Dot**:
  ```javascript
  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }}
  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
  ```

### Gifting Section Stacked Carousel (`Home.jsx`)
* **Carousel Mechanics**: A touch-responsive stacked cards layout tracking touch gestures (`onTouchStart` and `onTouchEnd` distance threshold: `50px`).
* **Active Card transitions**: Cards stack sequentially by adjusting depth and angles according to index offset:
  ```javascript
  animate={{
    rotateZ: offset * 3,
    y: offset * 15,
    x: offset * 10,
    scale: isActive ? 1 : 0.9 - Math.abs(offset) * 0.05,
    zIndex: giftImages.length - Math.abs(offset),
  }}
  transition={{ duration: 0.3, ease: "easeOut" }}
  ```

### Shop Catalog Grid (`Shop.jsx`)
* **Card Hover**: Cards elevate slightly: `whileHover={{ y: -8 }}`.
* **Shopping Cart button reveal**: Button slides up when card is hovered:
  ```css
  opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300
  ```
* **Mobile Sidebar Filters drawer**: Slides from the left using a spring:
  ```javascript
  initial={{ x: -300, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  exit={{ x: -300, opacity: 0 }}
  transition={{ type: "spring", damping: 25 }}
  ```

### Product Detail Actions (`productdetails.jsx`)
* **Image swap**: Fades the main image in on selection swap: `key={selectedImage} initial={{ opacity: 0 }} animate={{ opacity: 1 }}`.
* **Share dropdown menu**:
  ```javascript
  initial={{ opacity: 0, scale: 0.95, y: -10 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  exit={{ opacity: 0, scale: 0.95, y: -10 }}
  ```
* **Review Form slide-down**:
  ```javascript
  initial={{ opacity: 0, height: 0 }}
  animate={{ opacity: 1, height: 'auto' }}
  exit={{ opacity: 0, height: 0 }}
  ```

---

## 4. Media & Image Asset Architecture

Images are divided into local assets and optimized Cloudinary URLs.

### Local Assets Folder Map (`/public/`)
* **Logo**: `/logo.avif`
* **Hero Image**: `/hero.avif`
* **Category images**: `/images/earring.jpg`, `/images/bracelet.png`, `/images/ring.png`, `/images/necklace.jpg`
* **Curated section covers**: `/images/bestsellers.jpg`, `/images/everyday.jpg`, `/images/pair.jpg`, `/images/minimalist.jpg`, `/images/boho.png`
* **Slider panels**: `/images/tinified/gift1.avif` to `gift5.avif`, `/images/tinified/gallery1.avif` to `gallery6.avif`

### LazyImage Optimization Component (`Home.jsx`)
* Implements an `IntersectionObserver` to trigger image downloads with `rootMargin: '100px'` and `threshold: 0.01`.
* Replaces standard links with custom resolution bounds if hosting via Unsplash (`q=75&auto=format&fit=crop&w=2000`).

### Cloudinary Integration & Image Optimization Pipeline
* **API Route**: `/api/upload` (single upload) and `/api/upload/multiple` (batch upload up to 10 images)
* **Backend Controller**: Multer captures media into memory buffer blocks and forwards it directly to Cloudinary streams.
* **Cloudinary Auto-optimization rules**:
  * Folder target: `jewelry-products`
  * Scaling transform: `width: 2000, height: 2000, crop: 'limit'`
  * Auto quality rules: `quality: 'auto:best'`
* **Mobile Payload & Dimension Constraints**:
  * Carousel cards & Bento Grid images must specify explicit width caps (`f_auto,q_auto,w_800` or `w_600`) in Cloudinary URLs to eliminate mobile rendering lag and frame drops.
* **Database Mapping**: The secure URL (`result.secure_url`) is stored in the database under `Product.images`.

---

## 5. Backend Logic, APIs & Data Schema

The backend is built with Node, Express, MongoDB/Mongoose, and includes:

### Database Schemas (`backend/models/`)
* **User (`User.js`)**: Fields for `name`, `email` (unique, lowercase), `password` (hashed with bcrypt), `phone` (mandatory), `role` (`'user'` or `'admin'`), `addresses` (array of address subdocuments), and `wishlist` (array of Product object references).
* **TempUser (`TempUser.js`)**: Transient registration documents featuring email details and an `otp` code validation field with a 10-minute expiry window.
* **Product (`Product.js`)**: Fields for `name`, `price`, `images` (Cloudinary URLs), `category`, `tags` (e.g. `'bestseller'`, `'minimalist'`), `stock`, `sales` count, `rating`, `numReviews`, `reviews` array, and `accentPairs` (related accessories to Complete the Look).
* **Order (`Order.js`)**: Tracks `user`, `items`, `shippingAddress`, `totalPrice`, `status` (`'pending'`, `'processing'`, `'shipped'`, `'delivered'`, `'cancelled'`, `'exchange_requested'`, `'exchange_approved'`, `'exchanged'`), payment details, and returns metadata.
* **Coupon (`Coupon.js`)**: Code rules, discount mappings (`'percentage'` or `'fixed'`), `minOrderValue`, global `usageLimit`, `perUserLimit`, and user exclusions.

### API Endpoints List

#### 1. Authentication (`/api/auth`)
* `POST /api/auth/register` (Stages registration data, generates and emails OTP)
* `POST /api/auth/verify-otp` (Validates registration OTP, activates the `User` profile)
* `POST /api/auth/login` (Authenticates user, signs and returns a JWT)
* `GET /api/auth/profile` (Fetches user details, addresses, and wishlist)
* `PUT /api/auth/profile` (Updates user profile and addresses array)

#### 2. Products (`/api/products`)
* `GET /api/products` (Fetches list of products with filters, sorting, search keyword, and pagination support)
* `GET /api/products/bestsellers` (Returns list of top sellers sorted by sales volume)
* `GET /api/products/:id` (Returns single product metadata and verified customer reviews)
* `POST /api/products/:id/reviews` (Adds customer review, calculates and updates average rating)

#### 3. Shopping Cart (`/api/cart`)
* `GET /api/cart` (Fetches the user's cart subtotal and items from MongoDB)
* `POST /api/cart` (Adds an item or updates quantity in the active cart document)
* `PUT /api/cart` (Updates cart item quantity)
* `DELETE /api/cart/:productId` (Removes item from cart)

#### 4. Checkout Coupons (`/api/coupons`)
* `POST /api/coupons/validate` (Validates active coupon criteria: minimum cart values, first order checks, expiry, and user restrictions. Runs as a read-only query; does *not* increment the coupon usage count)

#### 5. Payments & Orders (`/api/payment` & `/api/orders`)
* `POST /api/payment/create-order` (Initiates payment order session with Razorpay API)
* `POST /api/payment/verify-payment` (Verifies payment signatures, decreases product stock, clears shopping cart, increments coupon usage counts, and saves the final `Order` document with status `'paid'`)
* `GET /api/orders/:id/invoice` (Generates a clean PDF invoice using `pdfkit` stream buffers)
* `PUT /api/orders/:id/cancel` (Applies a cancellation fee if status is `'processing'`)
* `PUT /api/orders/:id/exchange` (Logs exchange requests, checking that it is within the 3-day delivery window)

---

## 6. Technical SEO & Brand Compliance (Phase 18)

Sera strictly enforces premium brand aesthetics and high-performance technical SEO routing.

### Brand Terminology
* **Prohibited Terms**: Do NOT use "18k", "plating", or "plated" anywhere in the copy, frontend UI, or backend seed scripts.
* **Approved Alternatives**: Use "PVD Coating", "Premium Finish", "Waterproof", and "Anti-Tarnish".
* **Trust Badges**: Must use clean SVG/React Icons (`react-icons`) rather than emojis (e.g., `FaTint` for Sweatproof, `FaGem` for Premium Finish, `FaTruck` for Free Shipping).

### Aesthetic Collection Routing
* **Schema Upgrade**: The `Product` model includes an `aesthetics` array (e.g., `['boho vibes', 'minimalist']`).
* **Frontend Routing**: Supports deep-linking collections via `/shop/collection/:aesthetic` instead of URL query parameters. This is natively parsed by `Shop.jsx` to filter products dynamically.

### SEO & Social Interceptors
* **Image Alt-Text Automation**: Product images append target keywords to the product name (e.g., `alt={`${product.name} - Anti-Tarnish Premium Jewelry`}`).
* **Canonical Routing**: `Shop.jsx` implements strict canonical URLs via the `<SEO>` component to prevent Google from indexing empty parameter-based queries (preventing "Soft 404" errors).
* **WhatsApp / Social OG Interceptor**: 
  * Problem: SPAs on Vercel send generic `index.html` meta tags to social bots.
  * Solution: `vercel.json` utilizes a regex `user-agent` matcher to identify bots (WhatsApp, Facebook, LinkedIn, Pinterest) and rewrite `/product/:id` requests to the backend endpoint `GET /api/products/share/:id`.
  * The backend returns raw HTML with dynamic OpenGraph meta tags and instantly redirects human clicks back to the React SPA URL.

### Performance Protections
* **Lazy-Loaded Integrations**: Heavy 3rd-party scripts (like the Instagram Embed Feed) must never block the main thread. They are deferred using an `IntersectionObserver` (loading only when scrolled into view) or a fallback 5-second timer.
