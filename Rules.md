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
* **Rose 600**: `#e11d48` (Primary button hover states and focused accents).
* **Gold Accent**: `#c5a666` (Applied to luxury callouts, transactional email headers, and premium highlights).
* **Emerald Accent**: `#10b981` (Applied to unlocked Free Shipping bars, success badges, and delivered orders).
* **Body Background**: `#ffffff` (Clean white background for sharp contrast).
* **Body Text**: `#1a1a1a` (High-contrast charcoal black).

### Micro-Interactions & UI Rules
* **Glassmorphism Styling**: Backdrop blur utilities (`backdrop-blur-md` / `backdrop-blur-lg`) paired with semi-transparent white fills (`bg-white/70`, `bg-white/40`) and soft borders (`border-white/40`).
* **Toast & Notification Rule**: **Native browser alerts (`window.confirm`, `window.alert`) are strictly prohibited in the UI.** All interactive confirmations (logout, order cancellation, wishlist deletion, address removal) must use custom `toast.custom()` dialogs from `react-hot-toast` with styled React components.

---

## 2. Product Category Taxonomy & Keyword Policy

Sera features two core product pillars: **Anti-tarnish waterproof jewelry** and **chic women's apparel & tops**.

### Product Taxonomy
1. **EARRINGS** (`earrings`): Anti-tarnish studs, hoops, drop earrings, and huggies.
2. **NECKLACES** (`necklaces`): Minimalist anti-tarnish pendants, layered chains, and chokers.
3. **BRACELETS** (`bracelets`): Anti-tarnish cuff bracelets, chain bracelets, and bangles.
4. **COMBOS** (`combos`): Curated jewelry sets combining matching necklaces, earrings, and bracelets at bundle prices.
5. **APPAREL** (`apparel`): Premium women's tops, clothes, and everyday wear crafted from breathable cotton blend fabrics.
6. **RINGS (`rings` - PAUSED / BACKEND-ONLY)**: The `Ring` category schema and product records exist in the backend MongoDB database for data safety and legacy support, but **Rings are completely removed from the frontend UI, header navigation, category grids, and shop filters**. Ring sales are currently stopped.

> **Note on Storage**: While displayed in uppercase in UI headings, Mongoose schemas use `lowercase: true` on `category`, `tags`, and `aesthetics`. MongoDB documents store categories in lowercase (`earrings`, `necklaces`, `bracelets`, `combos`, `apparel`, `rings`).

### Sizing Policy
* **Jewelry & Accessories (Earrings, Necklaces, Bracelets, Combos)**: **100% Anti-Tarnish, Waterproof, and Universal Free Size**. All jewelry is designed with built-in adjustable extension chains, flexible cuffs, or universal fits so that **all can fit** without requiring size selection.
* **Apparel**: Sized garments requiring customer size selection (**XS, S, M, L**).

### Keyword & Terminology Rules
* **STRICTLY FORBIDDEN / AVOIDED TERMS**: **Do NOT use "18k", "coating", "plating", "plated", "PVD Coating", "PVD", "Hypoallergenic", "Stainless Steel", "Gold", "Silver", "Demi-Fine", "Everyday Luxury", or "Skin-Friendly"** in UI copy, meta tags, schema markup, or seed scripts.
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
* **`<HelmetProvider>` (`react-helmet-async`)**: Wraps the entire application to manage document head tags, dynamic SEO titles, canonical links, and OpenGraph metadata.
* **`<Preloader />` (`Preloader.jsx`)**: Preloads hero textures and core category visuals into memory before rendering.
* **`<Router>` (`BrowserRouter`)**: HTML5 history API router.
* **`<CartProvider>` (`CartContext.jsx`)**: Manages shopping cart state, local storage persistence for guests (`sera_guest_cart`), subtotal calculations, item quantity bounds, and MongoDB API synchronization (`POST /api/cart/sync`).
* **`<AxiosInterceptor />` (`AxiosInterceptor.jsx`)**: Attaches JWT authorization headers to outgoing HTTP requests, handles global 401/403 states, and dispatches `StorageEvent` for instant same-tab guest cart fallback.
* **`<Analytics />` (`Analytics.jsx`)**: Listens to router location changes and dispatches Google Analytics 4 (GA4) pageview events.
* **`<ScrollToTop />` (`ScrollToTop.jsx`)**: Resets window scroll position to `(0, 0)` on every page transition.
* **`<CookieConsent />` (`CookieConsent.jsx`)**: Cookie consent and privacy policy confirmation banner.
* **`<Toaster position="top-center" />`**: Renders top-center toast popups via `react-hot-toast`.

### Router Map (All 26 Pages + 404)

#### Core E-Commerce Pages
* `/` ➔ `Home.jsx`: Hero WebGL slider, dynamic flyer popups, category bento cards, gifting 3D carousel, aesthetics collections, floating coupon drawer.
* `/shop` ➔ `Shop.jsx`: Dynamic product catalog with keyword search, category filter, aesthetic collection filter, sorting, and price range filters synced to URL query strings. Anchor tag pagination for SEO crawlability.
* `/shop/:category` ➔ `Shop.jsx`: Direct category landing pages (e.g., `/shop/apparel`, `/shop/necklaces`, `/shop/earrings`, `/shop/bracelets`, `/shop/combos`).
* `/shop/collection/:aesthetic` ➔ `Shop.jsx`: Direct collection deep-linking (e.g., `/shop/collection/minimalist`, `/shop/collection/combos`).
* `/product/:id` ➔ `ProductDetails.jsx`: Product view with image gallery, size options, add-to-cart, review creation/listing, share popover, and "Complete the Look" accent pairs.
* `/cart` ➔ `Cart.jsx`: Full cart management page, item quantities, `FreeShippingBar` (threshold INR 999), promo code input, subtotal summary, greeting card addon.
* `/checkout` ➔ `Checkout.jsx`: Interactive shipping address cards with in-checkout Add/Edit/Delete address modal, coupon code validation, order breakdown, Razorpay online payment integration, and COD.
* `/order-success` ➔ `OrderSuccess.jsx`: Order confirmation view displaying order summary, delivery timeline, invoice download button, confetti particle effects, and safety-net `clearCart()` call on mount.
* `/profile` ➔ `profile.jsx`: User account management with tabs for Orders (with invoice download, cancellation, exchange request), Addresses (CRUD), Wishlist, Account Details, and custom styled Logout toast.

#### Authentication Pages
* `/login` ➔ `login.jsx`: User login form with JWT token storage, Google OAuth integration, and automatic guest cart sync (`syncGuestCart`). Preserves `?redirect=` target.
* `/register` ➔ `register.jsx`: Registration form triggering email OTP verification via TempUser pipeline. Preserves `?redirect=` target.
* `/forgot-password` ➔ `ForgotPassword.jsx`: Triggers password reset OTP via Brevo SMTP.
* `/reset-password` ➔ `ResetPassword.jsx`: Verifies reset OTP and updates user password.

#### Institutional & Information Pages
* `/about` & `/faq` ➔ `InfoPages.jsx`: Brand origin story, FAQs, customer support details.
* `/privacy-policy` ➔ `PrivacyPolicy.jsx`: Compliance policies.
* `/terms` ➔ `TermsPage.jsx`: Terms of service.
* `/returns` ➔ `Returns.jsx`: Returns, exchange policy, and cancellation policy documentation.
* `/contact` ➔ `Contact.jsx`: Contact form submitting messages directly to backend database (max 2 per email).
* `/jewelry-care` ➔ `JewelryCare.jsx`: Instructions for maintaining anti-tarnish jewelry.
* `/materials` ➔ `MaterialsGuide.jsx`: Explanations of materials used (Anti-tarnish metals, Cotton blend fabrics).

#### Content & Discovery Pages
* `/gifts` ➔ `GiftingHub.jsx`: Curated gifting collection guide.
* `/size-guide` ➔ `SizeGuide.jsx`: Sizing guide for necklaces, bracelets, and tops.
* `/sustainability` ➔ `Sustainability.jsx`: Ethical sourcing and eco-friendly packaging commitments.
* `/sitemap` ➔ `Sitemap.jsx`: HTML sitemap for human navigation.
* `/journal` ➔ `BlogList.jsx`: Editorial blog index.
* `/journal/:slug` ➔ `BlogPost.jsx`: Single article view with dynamic markdown/HTML rendering and social share buttons.

#### Admin Control Panel
* `/admin` ➔ `AdminDashboard.jsx`: Comprehensive admin control panel containing tabs for Products, Orders, Categories, Coupons (with flyer visibility toggle & custom descriptions), Contacts, and Blogs.

#### Not Found (404)
* `*` ➔ `NotFound.jsx`: Soft 404 remediation page rendering `<meta name="robots" content="noindex">` via `SEO.jsx` and "Return to Shop" CTA.

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

### 6. Free Shipping Progress Bar (`FreeShippingBar.jsx`)
* Visual progress bar indicating how close the customer is to unlocking Free Shipping (threshold: subtotal > INR 999).
* Reusable across `Cart.jsx` and `Checkout.jsx`.
* Animates fill percentage with ease-out transitions (`bg-gradient-to-r from-rose-400 via-rose-500 to-rose-600`), and turns emerald with a congratulatory checkmark when unlocked or granted via coupon.

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
* **Execution**: Consistently enforced across `Cart.jsx`, `Checkout.jsx`, `paymentRoutes.js`, and `TopBanner.jsx`.

### Order Cancellation Lifecycle
* **Pending Orders**: User can cancel via `/profile` with **100% refund** (0 fee).
* **Processing Orders**: User can cancel via `/profile` with **INR 100 fee** auto-deducted from refund amount.
* **Shipped / Delivered Orders**: Cannot be cancelled directly.

### Exchange Policy
* Customers can submit an exchange request within **3 days** of delivery. Free exchange applies to damaged or incorrect items; change-of-mind exchanges incur an INR 100 fee.
* Admin can approve exchanges via `PUT /api/orders/:id/exchange/approve`.

### Coupon Validation Rules (`/api/coupons/validate` & Backend Checkout)
1. **Minimum Order Value**: Cart subtotal must meet `minOrderValue`.
2. **First Order Only**: If `isFirstOrderOnly: true`, checks user's previous order history in MongoDB.
3. **Usage Limits**: Verifies global `usageLimit` and `perUserLimit`.
4. **Allowed Users**: If specified, checks if current user ID matches `allowedUsers`.
5. **Read-Only `/validate`**: `/validate` checks criteria without mutating usage counters. Counters increment atomically ONLY upon successful payment verification.
6. **Double-Check at Payment**: Both `/create-order` and `/verify-payment` re-validate the coupon on the server.

### Address Management in Checkout
* Users can maintain multiple saved addresses.
* On `Checkout.jsx`, users can select between saved address cards, or add a new delivery address via an in-modal quick form that directly calls `PUT /api/auth/profile` and sets the new address as active.
* Users can edit existing addresses inline or delete them with custom modal confirmation.

---

## 6. Complete Database Schemas (`backend/models/`)

Built with Node.js, Express, MongoDB, and Mongoose.

### `User.js`
* `name`: String, trimmed.
* `email`: String, lowercase, unique, required.
* `password`: String (hashed with bcrypt).
* `phone`: String, unique, required.
* `isEmailVerified`: Boolean (default true; users created only after OTP verification).
* `role`: String enum (`'user'`, `'admin'`), default `'user'`.
* `wishlist`: Array of ObjectIds referencing `Product`.
* `addresses`: Array of address subdocuments:
  - `addressType`: String (default `'Home'`)
  - `street`: String
  - `city`: String
  - `state`: String
  - `postalCode`: String
  - `country`: String (default `'India'`)
  - `phone`: String (optional per-address contact)
  - `landmark`: String (optional)
  - `isDefault`: Boolean
* `isActive`: Boolean, default true.
* `resetPasswordOtp`: String.
* `resetPasswordExpires`: Date.
* `authProvider`: String enum (`'local'`, `'google'`), default `'local'`.

### `TempUser.js`
* Transient registration document containing `name`, `email`, `password` (pre-hashed), `phone`, and an `otp` validation string with a 10-minute TTL index for automatic expiry.

### `Product.js`
* `name`: String, required, max 200 chars.
* `description`: String, max 2000 chars.
* `category`: String, lowercase, required (`earrings`, `necklaces`, `bracelets`, `combos`, `apparel`, `rings`).
* `aesthetics`: Array of lowercase Strings (`minimalist`, `boho vibes`, `everyday glam`, `gifting`, `combos`, `statement`).
* `price`: Number, required, min 0.
* `images`: Array of Cloudinary URL Strings.
* `stock`: Number, required, default 0.
* `sales`: Number, default 0.
* `views`: Number, default 0.
* `rating`: Number, 0 to 5, default 0.
* `numReviews`: Number, default 0.
* `reviews`: Array of ObjectIds referencing `Review`.
* `user`: ObjectId referencing `User` (admin creator).
* `isActive`: Boolean, default true.
* `isAddon`: Boolean, default false.
* `featured`: Boolean, default false.
* `sku`: String, unique, sparse.
* `tags`: Array of lowercase Strings (`bestseller`, `new`, `sale`).
* `accentPairs`: Array of ObjectIds referencing `Product` ("Complete the Look").
* `isCombo`: Boolean, default false.
* `comboItems`: Array of ObjectIds referencing `Product` (physical components).
* **Indexes**: `{ category: 1 }`, `{ tags: 1 }`, `{ name: 'text', description: 'text', tags: 'text' }`, `{ rating: -1, numReviews: -1 }`, `{ featured: 1, createdAt: -1 }`.

### `Order.js`
* `user`: ObjectId referencing `User`, required.
* `items`: Array of ordered items:
  - `product`: ObjectId referencing `Product`, required.
  - `quantity`: Number, min 1, required.
  - `price`: Number, required (price snapshot at purchase time).
  - `size`: String (apparel size).
  - `name`: String (product title snapshot).
  - `comboItems`: Array of ObjectIds referencing child products (snapshot for stock reversal on cancellation).
  - `note`: String, max 450 chars (greeting card note).
* `totalPrice`: Number, required.
* `shippingPrice`: Number, default 0.
* `couponCode`: String.
* `couponDiscount`: Number, default 0.
* `razorpayOrderId`: String.
* `razorpayPaymentId`: String.
* `razorpaySignature`: String.
* `invoiceNumber`: String.
* `status`: String enum (`'pending'`, `'processing'`, `'shipped'`, `'delivered'`, `'cancelled'`, `'exchange_requested'`, `'exchange_approved'`, `'exchanged'`), default `'pending'`.
* `shippingAddress`: Subdocument with `street`, `city`, `state`, `postalCode`, `country`, `phone`, `landmark`.
* `cancellationFee`: Number, default 0.
* `exchangeFee`: Number, default 0.
* `exchangeReason`: String, max 500 chars.
* `refundAmount`: Number.
* `deliveredAt`: Date.
* `paymentMethod`: String enum (`'card'`, `'cod'`, `'upi'`, `'wallet'`), default `'cod'`.
* `paymentStatus`: String enum (`'pending'`, `'paid'`, `'failed'`, `'refunded'`), default `'pending'`.
* `trackingNumber`: String.
* **Indexes**: `{ user: 1, 'items.product': 1, status: 1 }`, `{ user: 1, status: 1 }`, `{ status: 1, deliveredAt: -1 }`.

### `Coupon.js`
* `code`: String, unique, uppercase, required.
* `discountType`: String enum (`'percentage'`, `'fixed'`), required.
* `discountValue`: Number, required.
* `minOrderValue`: Number, default 0.
* `expiryDate`: Date.
* `usageLimit`: Number.
* `usageCount`: Number, default 0.
* `perUserLimit`: Number, default 1.
* `allowedUsers`: Array of ObjectIds referencing `User`.
* `isActive`: Boolean, default true.
* `isFreeShipping`: Boolean, default false.
* `isFirstOrderOnly`: Boolean, default false.
* `description`: String, max 500 chars.
* `showInFlyer`: Boolean, default false.

### `Blog.js`
* `title`: String, required, trimmed.
* `slug`: String, lowercase, unique, required.
* `content`: String, required.
* `coverImage`: String, default `''`.
* `seoTitle`: String, default `''`.
* `seoDescription`: String, default `''`.
* `tags`: Array of Strings.
* `isPublished`: Boolean, default false.
* `author`: ObjectId referencing `User`, required.

### `Category.js`
* `name`: String, required, unique.
* `image`: String.
* `description`: String.

### `Contact.js`
* `name`: String, required.
* `email`: String, lowercase, required.
* `subject`: String.
* `message`: String, required.
* `status`: String enum (`'New'`, `'Read'`, `'Replied'`), default `'New'`.

### `Newsletter.js`
* `email`: String, lowercase, unique, required.

### `Review.js`
* `product`: ObjectId referencing `Product`, required.
* `user`: ObjectId referencing `User`, required.
* `name`: String, required.
* `rating`: Number, 1 to 5, required.
* `comment`: String, required.

### `Cart.js`
* `user`: ObjectId referencing `User`, unique, required.
* `items`: Array of `{ product: ObjectId (ref Product), quantity: Number, size: String, note: String }`.
* One document per registered user. Cleaned on payment success and auto-purges deleted products.

---

## 7. Complete API Endpoint Inventory

### 1. Authentication & Users (`/api/auth`)
* `POST /api/auth/register`: Initiate user registration and dispatch email OTP.
* `POST /api/auth/verify-otp`: Validate OTP and activate user account.
* `POST /api/auth/resend-otp`: Resend email OTP for pending registration.
* `POST /api/auth/login`: Authenticate credentials and return JWT token.
* `POST /api/auth/google`: Authenticate / register via Google OAuth token.
* `GET /api/auth/profile`: Fetch current user details, saved addresses, and populated wishlist.
* `PUT /api/auth/profile`: Update user profile data and saved addresses array.
* `GET /api/auth/wishlist`: Get user's saved wishlist items.
* `POST /api/auth/wishlist`: Add a product to the user's wishlist (`{ productId }`).
* `DELETE /api/auth/wishlist/:id`: Remove a product from the user's wishlist.
* `PUT /api/auth/wishlist/toggle`: Toggle a product in the wishlist (`{ productId }`).
* `POST /api/auth/forgot-password`: Send password reset OTP via email.
* `POST /api/auth/reset-password`: Reset password using verified OTP.
* `PUT /api/auth/change-password`: Change password for authenticated logged-in user.
* `GET /api/auth/users` *(Admin)*: List all registered customer accounts.

### 2. Products (`/api/products`)
* `GET /api/products`: Search, filter by category/aesthetic/price, and sort products with pagination.
* `GET /api/products/bestsellers`: Fetch products tagged with `bestseller` or highest sales volume.
* `GET /api/products/top-bestsellers`: Fetch top bestsellers grouped by each main category (`earrings`, `necklaces`, `bracelets`, `combos`, `apparel`).
* `GET /api/products/share/:id`: OpenGraph HTML crawler endpoint for WhatsApp and social bot link previews.
* `POST /api/products/bulk`: **Bulk fetch** — accepts `{ productIds: [] }` and returns live product data for multiple products. Used by guest cart to hydrate with real-time prices and stock.
* `GET /api/products/:id`: Get detailed metadata, populated `accentPairs`, populated `comboItems`, and verified reviews for a single product.
* `GET /api/products/:id/review-eligibility`: Check if the authenticated user is eligible to review a product (must have a delivered order containing it).
* `POST /api/products/:id/reviews`: Add a customer review and recalculate product average rating.
* `POST /api/products` *(Admin)*: Create a new product.
* `PUT /api/products/:id` *(Admin)*: Update product details.
* `DELETE /api/products/:id` *(Admin)*: Delete a product.

### 3. Cart (`/api/cart`)
* `GET /api/cart`: Get current user's server-persisted cart (auto-cleans deleted products).
* `POST /api/cart`: Add item or update quantity in cart (stock-capped, returns warning flag).
* `PUT /api/cart/:productId`: Update item quantity (validates against live stock).
* `DELETE /api/cart/:productId`: Remove specific item from cart.
* `POST /api/cart/sync`: **Bulk guest cart sync** — merges an array of `{ productId, quantity, size, note }` items from the guest localStorage cart into the authenticated user's DB cart in one request. Stock is capped gracefully.

### 4. Checkout & Flyer Coupons (`/api/coupons`)
* `GET /api/coupons/public`: Fetch active flyer coupons (`showInFlyer: true`) for frontend flyer modals. Automatically sanitizes internal tracking fields like `usageCount` and `allowedUsers`.
* `POST /api/coupons/validate`: Validate promo code against cart subtotal (`cartValue`), `orderTotal`, and user history. Read-only; does not mutate counters.
* `GET /api/coupons` *(Admin)*: List all coupons with populated `allowedUsers`.
* `POST /api/coupons` *(Admin)*: Create new coupon.
* `PUT /api/coupons/:id` *(Admin)*: Update coupon.
* `DELETE /api/coupons/:id` *(Admin)*: Delete coupon.

### 5. Orders & Payments (`/api/orders` & `/api/payment`)
* `POST /api/payment/create-order`: Initialize Razorpay payment session. **Server recalculates order total from DB prices** via `validateAndCalculateOrder()` — the client-supplied amount is completely ignored.
* `POST /api/payment/verify-payment`: Verify Razorpay signature, **server recalculates total**, atomically decrements product stock (combo child components for combos), increments coupon usage atomically, clears DB cart, and saves order.
* `POST /api/orders`: Submit new COD order (calculates totals on server, decrements stock, clears DB cart).
* `GET /api/orders`: Get logged-in user's order history.
* `GET /api/orders/:id`: Get single order details.
* `GET /api/orders/:id/invoice`: Stream PDF invoice generated on the fly via `pdfkit`.
* `PUT /api/orders/:id/cancel`: Process order cancellation request (100% refund for pending; INR 100 fee for processing).
* `PUT /api/orders/:id/exchange`: Submit order exchange request within 3 days of delivery.
* `GET /api/orders/all/admin` *(Admin)*: Get all customer orders with pagination and user metadata.
* `PUT /api/orders/:id/status` *(Admin)*: Update order fulfillment status.
* `PUT /api/orders/:id/exchange/approve` *(Admin)*: Approve an exchange request.
* `PUT /api/orders/:id/update` *(Admin)*: Update shipping address or customer details before shipment.

### 6. Editorial Blogs (`/api/blogs`)
* `GET /api/blogs`: Fetch published blog posts (supports `?all=true` for admin preview).
* `GET /api/blogs/:slug`: Fetch single blog post by slug.
* `GET /api/blogs/share/:slug`: OpenGraph HTML crawler endpoint for WhatsApp and social bot link previews.
* `POST /api/blogs` *(Admin)*: Create blog post.
* `PUT /api/blogs/:id` *(Admin)*: Update blog post.
* `DELETE /api/blogs/:id` *(Admin)*: Delete blog post.

### 7. Categories, Contacts & Newsletters
* `GET /api/categories`: Fetch all product categories.
* `POST /api/categories` *(Admin)*: Create a new category.
* `DELETE /api/categories/:id` *(Admin)*: Delete category.
* `POST /api/contact`: Submit a customer inquiry via the contact form (rate-limited to max 2 submissions per email address).
* `GET /api/contact` *(Admin)*: List all customer inquiries.
* `PUT /api/contact/:id/status` *(Admin)*: Update inquiry status (`New`, `Read`, `Replied`).
* `POST /api/newsletter`: Subscribe an email to the newsletter (IP rate-limited to max 5 requests per day).
* `GET /api/newsletter` *(Admin)*: List all newsletter subscribers.

### 8. Product Feeds, Sitemaps & Merchant Crawlers
* `GET /api/feed/google-merchant`: Returns an XML RSS 2.0 product catalog feed formatted for Google Merchant Center (ordered with `<g:shipping>` before `<g:price>`, `<g:transit_time_label>`, `<g:custom_label_0>`, and strict filtering excluding `isAddon: true` gift add-ons).
* `GET /api/products/merchant/:id`: Dedicated endpoint for StoreBot-Google and AdsBot-Google crawlers returning fully static HTML without redirects (eliminating GMC "Product page unavailable" errors), complete with Schema.org `Product` JSON-LD (`OfferShippingDetails`), breadcrumbs, canonical tag, and `X-Robots-Tag: noindex`.
* `GET /sitemap.xml`: Dynamically generated XML sitemap mapping all active products and published blogs with `updatedAt` timestamps.

### 9. Media Upload (`/api/upload`)
* `POST /api/upload`: Upload single image buffer to Cloudinary `jewelry-products` folder (max 5MB, returns `secure_url`).
* `POST /api/upload/multiple`: Upload batch of images (up to 10) to Cloudinary.

### 10. System Health Check
* `GET /api/healthcheck`: Health check endpoint that pings MongoDB connection pool and verifies server liveness.

---

## 8. Technical Infrastructure & Web Vitals Optimization

### A. Non-WWW to WWW 301 Redirects (`vercel.json`)
* All requests arriving at `serastore.in` are permanently redirected via 301 response headers to `https://www.serastore.in/$1`.

### B. Crawler & Social Bot Interception Architecture (`vercel.json`)
* `vercel.json` applies a strict priority-ordered proxy routing hierarchy for crawlers and bots:
  1. **Google Merchant Crawlers (`StoreBot-Google`, `AdsBot-Google`)** on `/product/:id`:
     - Proxied directly to `https://backend.serastore.in/api/products/merchant/:id`.
     - Returns 100% static HTML with product title `<h1>`, price, availability, images, breadcrumbs, and Schema.org `Product` JSON-LD with `OfferShippingDetails`.
     - **Zero redirects**: Prevents the infinite redirect loop and solves Google Merchant Center's "Product page unavailable" error.
     - Emits `X-Robots-Tag: noindex` so the merchant proxy URL is never indexed separately from the canonical product page.
  2. **Social Media Scrapers (`WhatsApp`, `facebookexternalhit`, `Facebot`, `Twitterbot`, `LinkedInBot`, `Pinterest`, `TelegramBot`, `Discordbot`, `Slackbot`)**:
     - `/product/:id` ➔ Proxied to `https://backend.serastore.in/api/products/share/:id`.
     - `/journal/:slug` ➔ Proxied to `https://backend.serastore.in/api/blogs/share/:slug`.
     - Returns static HTML containing rich OpenGraph (`og:title`, `og:description`, `og:image`, `og:url`) and Twitter Card metadata, alongside an instant meta-refresh redirect (`<meta http-equiv="refresh">`) for human visitors who open the share link.
  3. **Search Engine Headless Crawlers (Googlebot, Bingbot) & Regular Users**:
     - Route directly to the React SPA `/index.html` (or pre-baked static route shells).
     - Headless Chrome renders client-side JS seamlessly.
     - **CRITICAL**: Never add broad `bot|Bot|crawler|spider` tokens to `vercel.json` regexes, as this catches Google StoreBot and causes redirect loops or blank page issues.

### C. Automated XML Sitemap Generation
* **Live XML Endpoint**: `https://www.serastore.in/sitemap.xml` (rewritten via `vercel.json` to backend `https://backend.serastore.in/sitemap.xml`).
* Automatically queries MongoDB `Product` and `Blog` collections to append newly added products (`/product/:id`) and published articles (`/journal/:slug`) with their exact `updatedAt` timestamps in ISO 8601 format.

### D. Centralized SEO Component (`SEO.jsx`)
* Injected into all pages via `react-helmet-async`.
* Standardizes title template (`Page | Sera`), description, canonical URL (stripping URL query params), OpenGraph, and Twitter tags.
* Emits default JSON-LD `Organization` schema and supports page-specific structured data (e.g. `Product`, `Article`).
* Injects `<meta name="robots" content="noindex">` on 404 and invalid product error states.

### E. Dynamic Image Optimization & Cloudinary Pipeline
* All uploaded images pass through Cloudinary's dynamic image processing pipeline.
* **Auto-Format & Quality**: Cloudinary URLs automatically inject `f_auto,q_auto` to deliver modern WebP/AVIF images based on browser capabilities.
* **Width Restrictions**: Images rendered in carousels and product grids specify strict width caps (`w_600`, `w_800`, `w_2000`) to eliminate mobile bandwidth bloat.
* **Automated Alt Text**: Product images dynamically compute alt tags: `alt={`${product.name} - Anti-Tarnish Premium Jewelry & Clothes`}`.

### F. Crawling Rules (`robots.txt`)
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

### G. Search Engine Indexing & Canonical Deduplication System (GSC Fixes)
* **Root Cause of "Duplicate without user-selected canonical"**: In client-side SPAs, raw HTTP crawlers saw identical blank `index.html` shells across all routes. Previously, a hidden `<div style="display:none">` in `index.html` containing homepage copy was parsed by crawlers as the text of every page, triggering Google Search Console's "Duplicate without user-selected canonical" warning on static routes. Furthermore, lack of trailing-slash enforcement allowed `/gifts` and `/gifts/` to resolve independently.
* **Build-Time Static Prerendering (`frontend/scripts/prerender-seo.js`)**:
  - Automatically runs post-build (`vite build && node scripts/prerender-seo.js` in `frontend/package.json`).
  - Generates dedicated static HTML shells for all 19 top-level routes (e.g. `/gifts/index.html`, `/shop/index.html`, `/shop/bracelets/index.html`, `/journal/index.html`, etc.) in `frontend/dist/`.
  - Statically bakes the unique `<link rel="canonical">`, `<title>`, `<meta name="description">`, OpenGraph, and Twitter tags directly into the initial HTML document before any JavaScript executes.
* **URL Normalization & Trailing Slash Enforcement (`vercel.json`)**:
  - `"trailingSlash": false` 308-redirects any trailing slash request (e.g., `/gifts/` ➔ `/gifts`), guaranteeing that every URL has exactly one canonical format.
  - (`cleanUrls: true` is omitted to prevent conflict with Vercel's SPA catch-all rewrite to `/index.html`).
* **SPA Shell Cleanup (`index.html`)**:
  - Removed all hidden keyword `<div style="display:none">` blocks.
  - Included fallback canonical `<link rel="canonical" href="https://www.serastore.in" />` on the root shell.
* **Preloader Bot Bypass (`Preloader.jsx`)**:
  - Detects bot user agents (`/bot|googlebot|crawler|spider|robot|crawling/i`) and non-home routes.
  - Bypasses the 1.8s–8s Cloudinary image preloader instantly so search engine crawlers (Googlebot WRS) never hit 5-second rendering timeouts.
* **Semantic & Accessibility Cleanliness (WCAG 2.1 AA)**:
  - Standardized single `<h1>` hierarchy per page.
  - Replaced duplicate `<main>` landmarks with semantic `<section>`.
  - Added skip-to-main-content link (`#main-content`) and ARIA dialog/progressbar attributes (`NavOverlay`, `SearchOverlay`, `FreeShippingBar`, `Footer`).

### H. Shipping Policy & Google Merchant Center Integration
* **Free Shipping Threshold**: Free shipping on orders **₹999 and above**. Flat ₹99 shipping fee on orders under ₹999.
* **Delivery Timelines**:
  - **Jewelry & Accessories**: Standard delivery within **5–7 business days**.
  - **Apparel**: Custom-stitched to order within **10–12 business days**.
* **Google Merchant Feed Requirements (`/api/feed/google-merchant`)**:
  - `<g:shipping>` node block must be positioned **before** `<g:price>` for GMC schema parsing.
  - `<g:transit_time_label>` is set dynamically to `custom-stitched` for apparel and `standard` for jewelry.
  - `<g:custom_label_0>` categorizes items (`apparel` vs `jewelry`) for campaign bidding and policy segmentation.
  - Prices are normalized with `Number.toFixed(2)`.
  - Gift add-ons (`isAddon: true` such as chocolates, greeting cards, scrunchies) are strictly filtered out of the merchant feed.

---

## 9. Email & SMTP Infrastructure (Brevo)

All transactional emails are dispatched via **Brevo (formerly Sendinblue)** SMTP using `emailService.js`.

### Email Triggers
| Trigger | Recipient | Subject |
| :--- | :--- | :--- |
| New user registration | New user | OTP verification email for account activation |
| Resend OTP | User | Resend registration OTP |
| Forgot password | User | Password reset OTP email |
| Successful payment / Order placed | User | Order confirmation with invoice summary |
| Exchange request | Admin (`ADMIN_EMAIL`) | Customer exchange request notification |
| Contact form submission | Admin (`ADMIN_EMAIL`) | New customer inquiry from website contact form |

### Email Design Rules
* **Header Accent**: Gold (`#c5a666`) used in email banners and header backgrounds to match the luxury brand aesthetic.
* **Logo**: Served via the public Cloudinary URL or absolute path to `/logo.avif`.

---

## 10. Valid Product Field Values

These are the valid enumerated values for the `Product` model's categorical fields. Any new admin creating or seeding products must use these values.

### `category` Field (stored in lowercase in DB via Mongoose `lowercase: true`)
* `"earrings"`
* `"necklaces"`
* `"bracelets"`
* `"combos"`
* `"apparel"`
* `"rings"` *(Paused — backend-only for historical orders, do not list new)*

### `tags` Field (stored in lowercase in DB)
* `"bestseller"` — Shown in the Bestsellers section on the homepage.
* `"new"` — Flagged as new arrivals in the catalog.
* `"sale"` — Products currently on discount or promotional pricing.

### `aesthetics` Field (stored in lowercase in DB, drives `/shop/collection/:aesthetic` routing)
* `"minimalist"` — Clean, simple designs.
* `"boho vibes"` — Earthy, layered, free-spirited styles.
* `"everyday glam"` — Subtle shimmer and elevated daily wear.
* `"gifting"` — Curated sets and gift-ready pieces.
* `"combos"` — Multi-piece bundle sets.
* `"statement"` — Bold, eye-catching accent pieces.

---

## 11. Deployment Topology

| Layer | Technology | Host / URL |
| :--- | :--- | :--- |
| **Frontend SPA** | React + Vite | Vercel → `https://www.serastore.in` |
| **Backend API** | Node.js + Express | Vercel / Railway → `https://backend.serastore.in` |
| **Database** | MongoDB Atlas | Cloud-hosted MongoDB cluster |
| **Media CDN** | Cloudinary | `https://res.cloudinary.com/dhby5v7rw/` |
| **Email SMTP** | Brevo | Outbound transactional email (`smtp-relay.brevo.com`) |
| **Payments** | Razorpay | Payment gateway (`razorpay.com`) |

---

## 12. Required Environment Variables

### Frontend (`frontend/.env`)
```
VITE_API_URL=https://backend.serastore.in
VITE_RAZORPAY_KEY_ID=<your_razorpay_key>
```

### Backend (`backend/.env`)
```
PORT=5000
MONGODB_URI=<mongodb+srv connection string>
JWT_SECRET=<secret string>
CLOUDINARY_CLOUD_NAME=dhby5v7rw
CLOUDINARY_API_KEY=<cloudinary api key>
CLOUDINARY_API_SECRET=<cloudinary api secret>
RAZORPAY_KEY_ID=<razorpay key>
RAZORPAY_KEY_SECRET=<razorpay secret>
BREVO_SMTP_HOST=smtp-relay.brevo.com
BREVO_SMTP_PORT=587
BREVO_SMTP_USER=<brevo login email>
BREVO_SMTP_PASS=<brevo smtp key>
SENDER_EMAIL=noreply@serastore.in
ADMIN_EMAIL=admin@serastore.in
```

---

## 13. Cart Architecture & Guest/Auth State Rules

### Guest Cart (`localStorage`)
* Stored under key `sera_guest_cart` as a JSON array of `{ _id, product (full object), quantity, size, note }`.
* On every `fetchCart()` call for unauthenticated users, `CartContext` calls `POST /api/products/bulk` to hydrate items with live stock and prices. Deleted items are removed with a toast; quantity-capped items are flagged.
* `JSON.parse` on both `userInfo` and `sera_guest_cart` is wrapped in `try/catch` — corrupted values are cleared and the app continues operating cleanly without crashing.

### Guest → Auth Sync (`syncGuestCart`)
* Called immediately after login / register / Google OAuth — **before** navigation to the redirect target.
* Sends all guest items in a single `POST /api/cart/sync` request (bulk, not N+1).
* After sync, `localStorage` key `sera_guest_cart` is deleted and `fetchCart()` is called internally to pull the merged cart from the database.
* **Do not call `fetchCart()` separately after `syncGuestCart()`** — it is already invoked internally.

### Cart Reset Rules
* `clearCart()` must be called in: **COD order success**, **Razorpay payment success**, **`OrderSuccess.jsx` mount** (safety net), and **explicit user logout** (`profile.jsx`).
* `AxiosInterceptor` dispatches a `StorageEvent('storage', { key: 'userInfo' })` on 401/403 auto-logout so `CartContext`'s storage listener fires and switches to guest mode in the **same browser tab** (not only cross-tab).

### Security Rules (Non-Negotiable)
* **Never trust client-supplied `totalAmount` or `amount` for payment.** `paymentRoutes.js` recalculates the total server-side using `validateAndCalculateOrder()` for both `/create-order` and `/verify-payment`.
* **Coupon codes must be validated server-side at both `create-order` and `verify-payment` stages.** Frontend `/api/coupons/validate` is for UX feedback only — it does **not** lock in the discount.
* **Combo stock is deducted from physical child `comboItems`, not the virtual parent product.**
* **`updateQuantity()` in `CartContext` guards `quantity < 1`** to prevent negative or zero-quantity cart items.

---

## 14. Social Sharing & Canvas Watermarking Architecture (`shareUtils.js`)

* **Rich Clipboard Image Watermarking**:
  - `getPngBlob()` in `shareUtils.js` loads the target product image and draws it onto an 800x900 canvas.
  - Automatically composites the official Sera logo (`/slogo.png`) centered at the bottom of the canvas with a clean white padding banner.
  - Generates a PNG blob written to `navigator.clipboard` alongside plain text.
* **OS / Chat App Clipboard Compatibility**:
  - Direct "Copy Link" buttons copy plain text URLs exclusively, preventing WhatsApp or mobile operating systems from dropping text links when mixed image/text clipboards are pasted.
* **Native Web Share**:
  - Uses `navigator.share` with fallback to clipboard copy when the Web Share API is unsupported.
