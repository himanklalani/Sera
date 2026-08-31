# SERA Full-Stack Project - Technical Architecture, UI/UX & Backend Master Blueprint

This document is the definitive master manual and technical reference for the **Sera E-Commerce Platform** (`https://www.serastore.in`). It provides comprehensive, exhaustive documentation covering design tokens, frontend routing, motion graphics engines, business logic rules, database models, backend API routes, media pipelines, and technical infrastructure.

---

## 1. Brand System, Design Tokens & UI/UX Rules

Sera uses a modern luxury aesthetic built with Tailwind CSS v4, custom Framer Motion transitions, and glassmorphism UI elements.

### Typography
* **Serif Font**: `"Playfair Display", serif` (Applied to all titles, section headers `h1-h6`, collection banners, and luxury callouts).
* **Sans Font**: `"Inter", sans-serif` (Applied to body text, UI buttons, catalog filters, price tags, and operational forms).

### Color Tokens (Tailwind CSS v4 & Global CSS)
* **Baby Pink**: `#ffe4e6` (Soft page backgrounds, overlay containers, and subtle card fills).
* **Rose 50**: `#fff1f2` (Secondary background tint, product highlight cards, hover states).
* **Rose 500 / Theme Accent**: `#f43f5e` (Primary interactive color: CTA buttons, active navigation indicators, badges, focused borders).
* **Gold Accent**: `#c5a666` (Applied to luxury callouts, transactional email headers, and premium highlights).
* **Body Background**: `#ffffff` (Clean white background for sharp contrast).
* **Body Text**: `#1a1a1a` (High-contrast charcoal black).

### Micro-Interactions & UI Rules
* **Glassmorphism Styling**: Backdrop blur utilities (`backdrop-blur-md` / `backdrop-blur-lg`) paired with semi-transparent white fills (`bg-white/70`, `bg-white/40`) and soft borders (`border-white/40`).
* **Toast & Notification Rule**: **Native browser alerts (`window.confirm`, `window.alert`) are strictly prohibited in the UI.** All interactive confirmations (logout, order cancellation, wishlist deletion, address removal) must use custom `toast.custom()` dialogs from `react-hot-toast` with styled React components.

---

## 2. Product Category Taxonomy & Keyword Policy

Sera features two core product pillars: **Anti-tarnish waterproof jewelry** and **chic women's apparel & tops**.

### Product Taxonomy
1. **EARRINGS**: Anti-tarnish studs, hoops, drop earrings, and huggies.
2. **NECKLACES**: Minimalist anti-tarnish pendants, layered chains, and chokers.
3. **BRACELETS**: Anti-tarnish cuff bracelets, chain bracelets, and bangles.
4. **COMBOS**: Curated jewelry sets combining matching necklaces, earrings, and bracelets at bundle prices.
5. **APPAREL**: Premium women's tops, clothes, and everyday wear crafted from breathable cotton blend fabrics.
6. **RINGS (PAUSED / BACKEND-ONLY)**: The `Ring` category schema and product records exist in the backend MongoDB database for data safety and legacy support, but **Rings are completely removed from the frontend UI, header navigation, category grids, and shop filters**. Ring sales are currently stopped.

### Keyword & Terminology Rules
* **STRICTLY FORBIDDEN / AVOIDED TERMS**: **Do NOT use "18k", "plating", "plated", "PVD Coating", "PVD", "Hypoallergenic", "Stainless Steel", "Everyday Luxury", or "Skin-Friendly"** in UI copy, meta tags, schema markup, or seed scripts.
* **APPROVED JEWELRY KEYWORDS**:
  - **"Anti-Tarnish" / "Anti-Tarnish Jewelry"**
  - **"Waterproof" / "Waterproof Jewelry"**
* **APPROVED APPAREL KEYWORDS**:
  - **"Women's Tops" / "Chic Tops"**
  - **"Cotton Blend Tops" / "Premium Cotton Blend"**
  - **"Affordable Women's Apparel" / "Trendy Clothes"**
  - **"Breathable Fabric Tops"**
  - **"Minimalist Women's Wear"**
* **APPROVED COMBOS & GIFTING KEYWORDS**:
  - **"Jewelry Combo Sets" / "Matching Jewelry Combos"**
  - **"Gifting Hub" / "Jewelry Gift Boxes"**
  - **"Gifts for Her" / "Birthday Gift Jewelry"**

---

## 3. Frontend Architecture, Providers & Complete Page Routing Map

Built with React (Vite) and React Router DOM v7.

### Application Root & Context Providers (`App.jsx`)
* **`<CartProvider>` (`CartContext.jsx`)**: Manages shopping cart state, local storage persistence, subtotal calculations, item quantity adjustments, and MongoDB API synchronization.
* **`<ScrollToTop />` (`ScrollToTop.jsx`)**: Resets window scroll position to `(0, 0)` on every page transition.
* **`<AxiosInterceptor />` (`AxiosInterceptor.jsx`)**: Attaches JWT authorization headers to outgoing HTTP requests and handles global 401 unauthenticated states.
* **`<Toaster position="top-center" />`**: Renders top-center toast popups.

### Router Map (All 26 Pages)

#### Core E-Commerce Pages
* `/` ➔ `Home.jsx`: Hero WebGL slider, dynamic flyer popups, category bento cards, gifting 3D carousel, aesthetics collections, floating coupon drawer.
* `/shop` ➔ `Shop.jsx`: Dynamic product catalog with keyword search, category filter, aesthetic collection filter, sorting, and price range filters synced to URL query strings.
* `/shop/collection/:aesthetic` ➔ `Shop.jsx`: Direct collection deep-linking (e.g., `/shop/collection/minimalist`, `/shop/collection/combos`).
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

#### Institutional & Information Pages
* `/about` & `/faq` ➔ `InfoPages.jsx`: Brand origin story, FAQs, customer support details.
* `/privacy-policy` ➔ `PrivacyPolicy.jsx`: Compliance policies.
* `/terms` ➔ `TermsPage.jsx`: Terms of service.
* `/returns` ➔ `Returns.jsx`: Returns, exchange policy, and cancellation policy documentation.
* `/contact` ➔ `Contact.jsx`: Contact form submitting messages directly to backend database.
* `/jewelry-care` ➔ `JewelryCare.jsx`: Instructions for maintaining anti-tarnish jewelry.
* `/materials` ➔ `MaterialsGuide.jsx`: Explanations of materials used (Anti-tarnish metals, Cotton blend fabrics).

#### Content & Discovery Pages
* `/gifts` ➔ `GiftingHub.jsx`: Curated gifting collection guide.
* `/size-guide` ➔ `SizeGuide.jsx`: Sizing guide for necklaces, bracelets, and tops.
* `/sustainability` ➔ `Sustainability.jsx`: Ethical sourcing and eco-friendly packaging commitments.
* `/sitemap` ➔ `Sitemap.jsx`: HTML sitemap for human navigation.
* `/journal` ➔ `BlogList.jsx`: Editorial blog index.
* `/journal/:slug` ➔ `BlogPost.jsx`: Single article view with dynamic markdown rendering.

#### Admin Control Panel
* `/admin` ➔ `AdminDashboard.jsx`: Comprehensive admin control panel containing tabs for Products, Orders, Categories, Coupons (with flyer visibility toggle & custom descriptions), Contacts, and Blogs.

---

## 4. Core Motion Graphics & Animation Specifications

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
* **Asset Pre-computation**: Blocks hero renders until all slide textures and core category images (Earrings, Bracelets, Necklaces, Combos, Apparel) are preloaded into browser cache.

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

## 5. E-Commerce Policies & Business Logic

### Free Shipping Threshold
* **Rule**: Orders with subtotal **exceeding INR 999** automatically qualify for **Free Shipping**.
* **Standard Rate**: Orders INR 999 or below incur a **INR 100 shipping fee**.
* **Execution**: Consistently enforced across `Cart.jsx`, `Checkout.jsx`, and `TopBanner.jsx`.

### Order Cancellation Lifecycle
* **Pending Orders**: User can cancel via `/profile` with **100% refund** (0 fee).
* **Processing Orders**: User can cancel via `/profile` with **INR 100 fee** auto-deducted from refund amount.
* **Shipped / Delivered Orders**: Cannot be cancelled directly.

### Exchange Policy
* Customers can submit an exchange request within **3 days** of delivery. Free exchange applies to damaged or incorrect items; change-of-mind exchanges incur an INR 100 fee.

### Coupon Validation Rules (`/api/coupons/validate`)
1. **Minimum Order Value**: Cart subtotal must meet `minOrderValue`.
2. **First Order Only**: If `isFirstOrderOnly: true`, checks user's previous order history in MongoDB.
3. **Usage Limits**: Verifies global `usageLimit` and per-user limit.
4. **Read-Only**: `/validate` checks criteria without mutating usage counters (counters update only upon successful payment verification).

---

## 6. Complete Database Schemas (`backend/models/`)

Built with Node.js, Express, MongoDB, and Mongoose.

* **`User.js`**: `name`, `email` (unique, lowercase), `password` (hashed with bcrypt), `phone`, `role` (`'user'` | `'admin'`), `addresses` (array of address subdocuments), `wishlist` (array of Product object references).
* **`TempUser.js`**: Transient registration documents containing email details and an `otp` validation field with a 10-minute expiry window.
* **`Product.js`**: `name`, `price`, `description`, `images` array (Cloudinary URLs), `category`, `aesthetics` array, `tags`, `stock`, `sales` count, `rating`, `numReviews`, `reviews` array, `accentPairs` array.
* **`Order.js`**: `user`, `items` array, `shippingAddress`, `paymentMethod`, `paymentResult`, `totalPrice`, `status` (`'pending'`, `'processing'`, `'shipped'`, `'delivered'`, `'cancelled'`, `'exchange_requested'`, `'exchange_approved'`, `'exchanged'`), `cancellationFee`, `refundAmount`, `exchangeReason`.
* **`Coupon.js`**: `code` (uppercase), `discountType` (`'percentage'` | `'fixed'`), `discountValue`, `isFreeShipping`, `minOrderValue`, `expiryDate`, `isActive`, `showInFlyer` (boolean), `description`, `usageLimit`, `usageCount`, `isFirstOrderOnly`.
* **`Blog.js`**: `title`, `slug`, `content`, `excerpt`, `author`, `coverImage`, `published`.
* **`Category.js`**: `name`, `image`, `description`.
* **`Contact.js`**: `name`, `email`, `subject`, `message`, `status` (`'unread'` | `'read'`).
* **`Newsletter.js`**: `email` (unique).
* **`Review.js`**: `product`, `user`, `name`, `rating`, `comment`.

---

## 7. Complete API Endpoint Inventory

### 1. Authentication (`/api/auth`)
* `POST /api/auth/register`: Initiate user registration and dispatch email OTP.
* `POST /api/auth/verify-otp`: Validate OTP and activate user account.
* `POST /api/auth/login`: Authenticate credentials and return JWT token.
* `GET /api/auth/profile`: Fetch user details, saved addresses, and wishlist.
* `PUT /api/auth/profile`: Update user profile data and addresses array.
* `POST /api/auth/forgot-password`: Send password reset OTP via email.
* `POST /api/auth/reset-password`: Reset password using verified OTP.
* `GET /api/auth/wishlist`: Get user's saved wishlist items.
* `POST /api/auth/wishlist/:productId`: Toggle product in user wishlist.

### 2. Products (`/api/products`)
* `GET /api/products`: Search, filter by category/aesthetic/price, and sort products.
* `GET /api/products/bestsellers`: Fetch top products sorted by sales volume.
* `GET /api/products/:id`: Get detailed metadata and verified reviews for a single product.
* `POST /api/products/:id/reviews`: Add a customer review and update product average rating.
* `POST /api/products` *(Admin)*: Create a new product.
* `PUT /api/products/:id` *(Admin)*: Update product details.
* `DELETE /api/products/:id` *(Admin)*: Delete a product.

### 3. Cart (`/api/cart`)
* `GET /api/cart`: Get current user's server-persisted cart.
* `POST /api/cart`: Add item or update quantity in cart.
* `PUT /api/cart`: Update item quantity.
* `DELETE /api/cart/:productId`: Remove item from cart.
* `DELETE /api/cart`: Clear entire cart.

### 4. Checkout & Flyer Coupons (`/api/coupons`)
* `GET /api/coupons/public`: Fetch active flyer coupons (`showInFlyer: true`) for frontend flyer modals. Automatically sanitizes internal tracking fields like `usageCount` and `allowedUsers`.
* `POST /api/coupons/validate`: Validate promo code against cart subtotal and user history.
* `GET /api/coupons` *(Admin)*: List all coupons.
* `POST /api/coupons` *(Admin)*: Create new coupon.
* `PUT /api/coupons/:id` *(Admin)*: Update coupon.
* `DELETE /api/coupons/:id` *(Admin)*: Delete coupon.

### 5. Orders & Payments (`/api/orders` & `/api/payment`)
* `POST /api/payment/create-order`: Initialize payment session with Razorpay API.
* `POST /api/payment/verify-payment`: Verify payment signature, decrement product stock, clear cart, update coupon usage count, and save order with status `'processing'`.
* `POST /api/orders`: Submit new order.
* `GET /api/orders`: Get logged-in user's order history.
* `GET /api/orders/:id`: Get single order details.
* `GET /api/orders/:id/invoice`: Stream PDF invoice generated on the fly via `pdfkit`.
* `PUT /api/orders/:id/cancel`: Process order cancellation request.
* `PUT /api/orders/:id/exchange`: Process order exchange request.
* `GET /api/orders/admin/all` *(Admin)*: Get all customer orders.
* `PUT /api/orders/:id/status` *(Admin)*: Update order fulfillment status.

### 6. Editorial Blogs (`/api/blogs`)
* `GET /api/blogs`: Fetch published blog posts.
* `GET /api/blogs/:slug`: Fetch single blog post by slug.
* `POST /api/blogs` *(Admin)*: Create blog post.
* `PUT /api/blogs/:id` *(Admin)*: Update blog post.
* `DELETE /api/blogs/:id` *(Admin)*: Delete blog post.

### 7. Categories, Contacts & Newsletters
* `GET /api/categories`: Fetch all product categories.
* `POST /api/categories` *(Admin)*: Create a new category.
* `POST /api/contact`: Submit a customer inquiry via the contact form.
* `GET /api/contact` *(Admin)*: List all customer inquiries.
* `POST /api/newsletter`: Subscribe an email to the newsletter.
* `GET /api/feed/instagram`: Fetch cached Instagram graph feed for footer UI.

### 8. Media Upload (`/api/upload`)
* `POST /api/upload`: Upload single image to Cloudinary `jewelry-products` folder.
* `POST /api/upload/multiple`: Upload batch of images (up to 10) to Cloudinary.

---

## 8. Technical Infrastructure & Web Vitals Optimization

### A. Non-WWW to WWW 301 Redirects (`vercel.json`)
* All requests arriving at `serastore.in` are permanently redirected via 301 response headers to `https://www.serastore.in/$1`.

### B. WhatsApp & Social Bot OpenGraph Interceptor (`vercel.json`)
* `vercel.json` intercepts incoming user agents matching social bots (`WhatsApp`, `facebookexternalhit`, `Twitterbot`, `LinkedInBot`, `Pinterest`, `bot`, `crawler`, `spider`) on `/product/:id` routes and rewrites the request directly to the backend endpoint: `https://backend.serastore.in/api/products/share/:id`.
* The backend endpoint fetches the target product from MongoDB and returns lightweight raw static HTML containing dynamic OpenGraph tags (`og:title`, `og:description`, `og:image`, `og:url`) with high-res Cloudinary images, enabling rich previews in chat apps.

### C. Automated XML Sitemap Generation (`sitemapRoutes.js`)
* **Live XML Endpoint**: `https://www.serastore.in/sitemap.xml` (served via backend route `GET /api/sitemap`).
* Automatically queries MongoDB `Product` and `Blog` collections to append newly added products (`/product/:id`) and published articles (`/journal/:slug`) with their exact `updatedAt` timestamps in ISO 8601 format.

### D. Dynamic Image Optimization & Cloudinary Pipeline
* All uploaded images pass through Cloudinary's dynamic image processing pipeline.
* **Auto-Format & Quality**: Cloudinary URLs automatically inject `f_auto,q_auto` to deliver modern WebP/AVIF images based on browser capabilities.
* **Width Restrictions**: Images rendered in carousels and product grids specify strict width caps (`w_600`, `w_800`, `w_2000`) to eliminate mobile bandwidth bloat.
* **Automated Alt Text**: Product images dynamically compute alt tags: `alt={`${product.name} - Anti-Tarnish Premium Jewelry & Clothes`}`.

### E. Crawling Rules (`robots.txt`)
Located at `https://www.serastore.in/robots.txt`:
```txt
User-agent: *
Allow: /

# Disallow utility and auth pages to prevent crawling overhead
Disallow: /admin
Disallow: /cart
Disallow: /checkout
Disallow: /login
Disallow: /register
Disallow: /forgot-password
Disallow: /reset-password
Disallow: /profile
Disallow: /order-success

Sitemap: https://www.serastore.in/sitemap.xml
```
