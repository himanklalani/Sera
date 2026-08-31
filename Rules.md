# SERA Jewelry - Reference Rules & Technical Architecture

This document provides a comprehensive, exhaustive overview of the design tokens, component interactions, database schemas, routing paths, animation engines, business logic rules, and API endpoints across the Sera frontend and backend applications.

---

## 1. Brand Styling, Design System & Color Tokens

Sera utilizes a custom luxury design system built on Tailwind CSS v4, combining elegant serif typography, harmonious rose palette accents, and subtle glassmorphism effects.

### Typography
* **Serif Font**: `"Playfair Display", serif` (Enforced on all titles, section headings `h1-h6`, product names, and high-level marketing sections).
* **Sans Font**: `"Inter", sans-serif` (Enforced on body text, form fields, badges, price labels, and operational UI components).

### Color Palette (Tailwind CSS v4 `@theme` & Global CSS)
* **Baby Pink**: `#ffe4e6` (Soft page backgrounds, overlay containers, subtle highlight fills)
* **Rose 50**: `#fff1f2` (Light pink background tint for secondary banners, cards, and hover states)
* **Rose 500 / Theme Accent**: `#f43f5e` (Primary interactive color: buttons, badge highlights, active links, focused input borders)
* **Gold Accent**: `#c5a666` (Applied to luxury callouts, decorative accents, header details, and transactional email headers)
* **Body Background**: `#ffffff` (Clean white background for primary readability)
* **Body Text**: `#1a1a1a` (High-contrast charcoal for sharp readability)

### Micro-Interactions & Styling Guidelines
* **Glassmorphism**: Backdrop blur utility `backdrop-blur-md` / `backdrop-blur-lg` paired with semi-transparent white fills (`bg-white/70`, `bg-white/40`) and soft white borders (`border-white/40`).
* **Toast & Alert Rule**: **Native browser dialogs (`window.confirm`, `window.alert`) are strictly prohibited.** All confirmations (logout, order cancellation, deletion actions) must use `toast.custom()` from `react-hot-toast` with styled React components.

---

## 2. Frontend Architecture, State Management & Routing Map

The React single-page application (SPA) uses Vite and React Router DOM v7.

### Application Root & Context Providers (`App.jsx`)
* **`<CartProvider>` (`CartContext.jsx`)**: Manages shopping cart state, local storage persistence, item count calculations, subtotal calculations, and API synchronization with MongoDB.
* **`<ScrollToTop />` (`ScrollToTop.jsx`)**: Automatically resets window scroll offset to top `(0, 0)` on every route change.
* **`<AxiosInterceptor />` (`AxiosInterceptor.jsx`)**: Intercepts outgoing HTTP requests to attach JWT tokens and handles global 401 unauthenticated redirects.
* **`<Toaster position="top-center" />`**: Renders toast notifications at top-center viewport.

### Full Router Map (`App.jsx`)

#### Core E-Commerce Pages
* `/` ➔ `Home.jsx`: Hero WebGL slider, dynamic flyer popups, category bento cards, gifting 3D carousel, aesthetics collections, floating coupon drawer.
* `/shop` ➔ `Shop.jsx`: Dynamic product catalog with keyword search, category filter, aesthetic collection filter, sorting, and price range filters synced to URL query strings.
* `/shop/collection/:aesthetic` ➔ `Shop.jsx`: Direct collection deep-linking (e.g., `/shop/collection/minimalist`).
* `/product/:id` ➔ `ProductDetails.jsx`: Product view with image gallery, size options, add-to-cart, review creation/listing, share popover, and "Complete the Look" accent pairs.
* `/cart` ➔ `Cart.jsx`: Full cart management page, item quantities, free shipping progress bar (threshold ₹999), promo code input, subtotal summary.
* `/checkout` ➔ `Checkout.jsx`: Shipping address selector/form, coupon code validation, order breakdown, Razorpay online payment integration.
* `/order-success` ➔ `OrderSuccess.jsx`: Order confirmation view displaying order summary, delivery timeline, invoice download button, and confetti particle effects.
* `/profile` ➔ `profile.jsx`: User account management with tabs for Orders (with invoice download, cancellation, exchange request), Addresses (CRUD), Wishlist, Account Details, and custom styled Logout toast.

#### Authentication Pages
* `/login` ➔ `login.jsx`: User login form with JWT token storage.
* `/register` ➔ `register.jsx`: Registration form triggering email OTP verification via TempUser pipeline.
* `/forgot-password` ➔ `ForgotPassword.jsx`: Triggers password reset OTP via Brevo SMTP.
* `/reset-password` ➔ `ResetPassword.jsx`: Verifies reset OTP and updates user password.

#### Information & Institutional Pages
* `/about` & `/faq` ➔ `InfoPages.jsx`: Brand storytelling, FAQs, customer support details.
* `/privacy-policy` ➔ `PrivacyPolicy.jsx`: Compliance policies.
* `/terms` ➔ `TermsPage.jsx`: Terms of service.
* `/returns` ➔ `Returns.jsx`: Returns, exchange policy, and cancellation policy documentation.
* `/contact` ➔ `Contact.jsx`: Contact form submitting messages directly to backend database.
* `/jewelry-care` ➔ `JewelryCare.jsx`: Instructions for maintaining anti-tarnish and PVD coated jewelry.
* `/materials` ➔ `MaterialsGuide.jsx`: Explanations of materials used (PVD Coating, Waterproof Stainless Steel).

#### SEO & Content Pages
* `/gifts` ➔ `GiftingHub.jsx`: Curated gifting collection guide.
* `/size-guide` ➔ `SizeGuide.jsx`: Sizing guide for rings, necklaces, and bracelets.
* `/sustainability` ➔ `Sustainability.jsx`: Ethical sourcing and eco-friendly packaging commitments.
* `/sitemap` ➔ `Sitemap.jsx`: HTML sitemap for crawlers and site navigation.
* `/journal` ➔ `BlogList.jsx`: Editorial blog index.
* `/journal/:slug` ➔ `BlogPost.jsx`: Single article view with dynamic markdown rendering.

#### Admin Pages
* `/admin` ➔ `AdminDashboard.jsx`: Comprehensive admin control panel containing tabs for Products, Orders, Categories, Coupons (with flyer visibility toggle & custom descriptions), Contacts, and Blogs.

---

## 3. Core Frontend Animations & Motion Engines

All UI transitions utilize `framer-motion` for fluid 60fps animations.

### 1. Parallax Text Ticker (`TopBanner.jsx`)
* **Continuous Marquee**: Uses `useMotionValue(0)`, `useTransform(baseX, (v) => wrap(-20, -45, v)%)`, and `useAnimationFrame()` to continuously scroll text horizontally.
* **Content**: Promotes "Free Shipping on orders above INR 999" and "Handcrafted with Love".

### 2. Global Header (`Navbar.jsx` & `MotionMenuIcon.jsx`)
* **Entrance**: Slides down from top `y: -100` to `y: 0` over 0.8s with `easeOut`.
* **Hover States**: Icons scale to `1.1` and shift color to `#f43f5e` over `0.2s`.
* **Animated Cart Badge**: Wrapped in `<AnimatePresence>` with `scale` pop transition.
* **Interactive Menu Toggle**: `MotionMenuIcon.jsx` animates hamburger lines into an 'X' shape using SVG path transitions.

### 3. Navigation Drawer (`NavOverlay.jsx`)
* **Backdrop**: Fades to `opacity: 1` over 0.3s.
* **Drawer Slide**: Horizontally translates from `x: "100%"` to `0` with cubic bezier `[0.165, 0.84, 0.44, 1]`.
* **Staggered Menu Items**: Items slide in from `x: 20` with staggered delay (`0.1s + index * 0.1s`).
* **Submenu Expansion**: Dynamic height expansion from `0` to `"auto"`.

### 4. Search Popover (`SearchOverlay.jsx`)
* **Entrance**: Drops down `y: -20` to `y: 0` with fade in.
* **Live Search Filtering**: Debounced query execution highlighting matching products dynamically.

### 5. WebGL Shader Hero Slider (`lumina-interactive-list.tsx`)
* **Shader Engine**: Three.js + GSAP driving custom fragment shaders for glass refraction, ripple effects, and frost distortions during slide changes.
* **Mobile GPU Protection**: Fragment GLSL shader logic uses **branchless math** (eliminating `if` conditional branches in favor of `mix()` and `step()`) to prevent rendering crashes on mobile ARM Mali GPUs.

### 6. Preloader Component (`Preloader.jsx`)
* **Asset Pre-computation**: Blocks hero renders until all slide textures and core category images (Earrings, Bracelets, Necklaces) are preloaded into browser cache.

### 7. Welcome Offer Modal / Flying Banner (`Home.jsx`)
* **Dynamic Backend Sync**: Fetches active flyer coupons from `/api/coupons/public`. Auto-hides completely if no flyer coupons exist.
* **Free Shipping Badge**: Explicitly displays `"FREE SHIPPING"` badge for 0-discount free shipping coupons instead of `"INR 0 OFF"`.
* **Spring Entrance**: `initial={{ x: 400, y: 400, opacity: 0, rotate: 20, scale: 0.7 }}` to `animate={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}` over 1s.
* **Rotation**: Auto-rotates active offers every 2.5s.

### 8. Floating Coupon Drawer (`Home.jsx`)
* **Dynamic Trigger**: Button hides automatically if no flyer coupons exist.
* **Viewport Clipping Protection**: Constrained to `max-h-[45vh] md:max-h-[40vh]` to prevent the drawer from extending past the bottom edge of mobile or desktop viewports.
* **Copy Feedback**: Clicking any coupon copies code to clipboard and triggers a toast feedback popup.

### 9. 3D Stacked Gifting Carousel (`Home.jsx`)
* **Gesture Tracking**: Touch-swipe enabled (`onTouchStart`/`onTouchEnd`, 50px threshold).
* **Depth Transformations**: Rotates and offsets cards dynamically based on stack position:
  ```javascript
  rotateZ: offset * 3, y: offset * 15, x: offset * 10, scale: isActive ? 1 : 0.9 - Math.abs(offset) * 0.05
  ```

### 10. Framer Button (`FramerButton.jsx`)
* Reusable button wrapper providing magnetic hover scale (`scale: 1.03`), tap compression (`scale: 0.97`), and animated arrow translate effects.

---

## 4. Business Logic & E-Commerce Policies

### Free Shipping Policy
* **Core Rule**: Shipping is **FREE (INR 0)** on all orders where cart subtotal exceeds **INR 999**.
* **Standard Shipping Fee**: **INR 100** applied if subtotal is INR 999 or below.
* **Execution Locations**: Hardcoded consistently across `Cart.jsx`, `Checkout.jsx`, and `TopBanner.jsx`.

### Order Cancellation Policy
* **Pending Orders**: Can be cancelled by user in `/profile` with **0 cancellation fee** (100% refund).
* **Processing Orders**: Can be cancelled by user in `/profile` with a fixed **INR 100 cancellation fee** deducted from refund.
* **Shipped / Delivered Orders**: Cannot be cancelled directly.

### Exchange Policy
* **Window**: Customers can request an exchange within **3 days** of delivery.
* **Defective / Damaged / Wrong Item**: Free exchange (0 fee).
* **Changed Mind / Size Exchange**: **INR 100 fee** applied to exchange request.

### Coupon Validation Rules (`/api/coupons/validate`)
1. **Minimum Order Value**: Cart subtotal must meet `minOrderValue`.
2. **First Order Only**: If `isFirstOrderOnly: true`, checks user's previous order history in MongoDB.
3. **Usage Limits**: Verifies global `usageLimit` and per-user limit.
4. **Read-Only**: `/validate` checks criteria without mutating usage counters (counters update only upon successful payment verification).

---

## 5. Backend Architecture & Database Schemas

Built with Node.js, Express, MongoDB, and Mongoose.

### Models (`backend/models/`)
* **`User.js`**: `name`, `email` (lowercase, unique), `password` (bcrypt hash), `phone`, `role` (`'user'` | `'admin'`), `addresses` array, `wishlist` references.
* **`TempUser.js`**: Holds pending registrations with OTP, expires automatically in 10 minutes.
* **`Product.js`**: `name`, `price`, `description`, `images` array (Cloudinary URLs), `category`, `aesthetics` array, `tags`, `stock`, `sales`, `rating`, `numReviews`, `accentPairs` array.
* **`Order.js`**: `user`, `items` array, `shippingAddress`, `paymentMethod`, `paymentResult`, `totalPrice`, `status` (`'pending'`, `'processing'`, `'shipped'`, `'delivered'`, `'cancelled'`, `'exchange_requested'`, `'exchange_approved'`, `'exchanged'`), `cancellationFee`, `refundAmount`, `exchangeReason`.
* **`Coupon.js`**: `code` (uppercase), `discountType` (`'percentage'` | `'fixed'`), `discountValue`, `isFreeShipping`, `minOrderValue`, `expiryDate`, `isActive`, `showInFlyer` (boolean), `description`, `usageLimit`, `usageCount`, `isFirstOrderOnly`.
* **`Blog.js`**: `title`, `slug`, `content`, `excerpt`, `author`, `coverImage`, `published`.
* **`Category.js`**: `name`, `image`, `description`.
* **`Contact.js`**: `name`, `email`, `subject`, `message`, `status` (`'unread'` | `'read'`).
* **`Newsletter.js`**: `email` (unique).
* **`Review.js`**: `product`, `user`, `name`, `rating`, `comment`.

---

## 6. Complete API Endpoints Map

### Authentication (`/api/auth`)
* `POST /api/auth/register`: Stage user and send registration OTP.
* `POST /api/auth/verify-otp`: Validate OTP and activate user account.
* `POST /api/auth/login`: Authenticate and return JWT token.
* `GET /api/auth/profile`: Get current user details, saved addresses, and wishlist.
* `PUT /api/auth/profile`: Update user profile data and addresses.
* `POST /api/auth/forgot-password`: Send password reset OTP via email.
* `POST /api/auth/reset-password`: Reset password using verified OTP.
* `GET /api/auth/wishlist`: Get user's wishlist items.
* `POST /api/auth/wishlist/:productId`: Toggle item in user wishlist.

### Products (`/api/products`)
* `GET /api/products`: Search, filter by category/aesthetic/price, and sort products.
* `GET /api/products/bestsellers`: Fetch top products sorted by sales volume.
* `GET /api/products/:id`: Get detailed metadata for a single product.
* `POST /api/products/:id/reviews`: Post a product review.
* `POST /api/products` *(Admin)*: Create new product.
* `PUT /api/products/:id` *(Admin)*: Update product details.
* `DELETE /api/products/:id` *(Admin)*: Delete product.

### Cart (`/api/cart`)
* `GET /api/cart`: Get current user's server-persisted cart.
* `POST /api/cart`: Add item or update quantity in cart.
* `PUT /api/cart`: Update item quantity.
* `DELETE /api/cart/:productId`: Remove item from cart.
* `DELETE /api/cart`: Clear entire cart.

### Coupons (`/api/coupons`)
* `GET /api/coupons/public`: Fetch active flyer coupons (`showInFlyer: true`) for frontend modals.
* `POST /api/coupons/validate`: Validate promo code against cart subtotal and user history.
* `GET /api/coupons` *(Admin)*: List all coupons.
* `POST /api/coupons` *(Admin)*: Create new coupon.
* `PUT /api/coupons/:id` *(Admin)*: Update coupon.
* `DELETE /api/coupons/:id` *(Admin)*: Delete coupon.

### Orders (`/api/orders`)
* `POST /api/orders`: Create new order.
* `GET /api/orders`: Get logged-in user's order history.
* `GET /api/orders/:id`: Get order details.
* `GET /api/orders/:id/invoice`: Stream PDF invoice generated with `pdfkit`.
* `PUT /api/orders/:id/cancel`: Process order cancellation request.
* `PUT /api/orders/:id/exchange`: Process order exchange request.
* `GET /api/orders/admin/all` *(Admin)*: Get all customer orders.
* `PUT /api/orders/:id/status` *(Admin)*: Update order fulfillment status.

### Payment (`/api/payment`)
* `POST /api/payment/create-order`: Initialize Razorpay payment session.
* `POST /api/payment/verify-payment`: Verify Razorpay signature, decrement stock, clear cart, update coupon count, set order status to `'processing'`.

### Blogs (`/api/blogs`)
* `GET /api/blogs`: Fetch published blog posts.
* `GET /api/blogs/:slug`: Fetch single blog post by slug.
* `POST /api/blogs` *(Admin)*: Create blog post.
* `PUT /api/blogs/:id` *(Admin)*: Update blog post.
* `DELETE /api/blogs/:id` *(Admin)*: Delete blog post.

### Media Upload (`/api/upload`)
* `POST /api/upload`: Upload single image to Cloudinary `jewelry-products` folder.
* `POST /api/upload/multiple`: Upload multiple images (up to 10) to Cloudinary.

---

## 7. Technical SEO & Brand Compliance Rules

### Terminology Enforcement
* **Forbidden Terms**: Do **NOT** use "18k", "plating", or "plated" in copy or seed data.
* **Required Terms**: Use "PVD Coating", "Premium Finish", "Waterproof", and "Anti-Tarnish".

### WhatsApp OpenGraph Bot Interceptor
* `vercel.json` intercepts WhatsApp/Facebook social crawler user agents and redirects `/product/:id` requests to `/api/products/share/:id`.
* The backend returns static HTML with OpenGraph dynamic meta tags (`og:image`, `og:title`) so product previews display high-res Cloudinary images in WhatsApp chats.
