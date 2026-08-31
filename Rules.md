# SERA Jewelry & Apparel - Technical Architecture & SEO Master Blueprint

This document serves as the master technical blueprint and search engine optimization (SEO) reference for **Sera** (`https://www.serastore.in`). It provides exhaustive context on brand rules, keyword targeting strategy, apparel & jewelry taxonomy, technical SEO infrastructure, indexing strategy, URL taxonomy, OpenGraph bot intercepts, Core Web Vitals optimizations, motion animation specifications, database schemas, and API endpoints.

---

## 1. Brand Guidelines, Target Categories & Keyword Terminology Policy

Sera positions itself as a premium, cutesy, everyday luxury brand specializing in **anti-tarnish waterproof jewelry** and **chic women's apparel & tops**. The copy across product titles, category listings, meta descriptions, image alt tags, and editorial blog posts must strictly adhere to the following keyword and terminology rules:

### Terminology Rules & Brand Language
* **STRICTLY FORBIDDEN / AVOIDED TERMS**: **Do NOT use "18k", "plating", "plated", "PVD Coating", "PVD", "Waterproof", "Hypoallergenic", "Stainless Steel", "Everyday Luxury", or "Skin-Friendly"** anywhere in website copy, product descriptions, meta tags, schema markup, or seed scripts.
* **ONLY APPROVED JEWELRY TARGET KEYWORD**: 
  - **"Anti-Tarnish" / "Anti-Tarnish Jewelry"** (This is the single approved jewelry quality descriptor).
* **APPROVED APPAREL & CLOTHES TARGET KEYWORDS**:
  - "Women's Tops" / "Chic Tops"
  - "Cotton Blend Tops" / "Premium Cotton Blend"
  - "Affordable Women's Apparel" / "Trendy Clothes"
  - "Breathable Fabric Tops"
  - "Minimalist Women's Wear"
* **APPROVED COMBOS & GIFTING TARGET KEYWORDS**:
  - "Jewelry Combo Sets" / "Matching Jewelry Combos"
  - "Gifting Hub" / "Jewelry Gift Boxes"
  - "Gifts for Her" / "Birthday Gift Jewelry"
  - "Anniversary Gift Sets"

### Product Category Taxonomy
1. **EARRINGS**: Anti-tarnish studs, hoops, drop earrings, and huggies.
2. **NECKLACES**: Minimalist anti-tarnish pendants, layered chains, and chokers.
3. **BRACELETS**: Anti-tarnish cuff bracelets, chain bracelets, and bangles.
4. **COMBOS**: Curated jewelry sets combining matching necklaces, earrings, and bracelets at bundle prices.
5. **APPAREL**: Premium women's tops, clothes, and everyday wear crafted from breathable cotton blend fabrics.
6. **RINGS (PAUSED / BACKEND-ONLY)**: The `Ring` category schema and legacy product records exist in the backend MongoDB database for data safety, but **Rings are completely removed from the frontend UI, header menus, category grids, and shop filters**. Ring sales are currently stopped.

### Brand Design Tokens
* **Primary Typography**: `"Playfair Display", serif` (Enforced on all page headers `h1-h6`, category titles, and luxury banners).
* **Secondary Typography**: `"Inter", sans-serif` (Enforced on body text, filter tags, form fields, and operational copy).
* **Color Palette**:
  - Baby Pink (`#ffe4e6`): Background fills and overlay cards.
  - Rose 50 (`#fff1f2`): Card highlights and secondary background tints.
  - Rose 500 (`#f43f5e`): Primary interactive elements, buttons, active states, and callouts.
  - Gold Accent (`#c5a666`): Luxury callout badges, header details, and email templates.
  - Body Text (`#1a1a1a`): High-contrast charcoal black.
* **Alert & Dialog Policy**: **Native browser dialogs (`window.confirm`, `window.alert`) are strictly prohibited in the UI.** All user confirmations (logout, order cancellation, item deletion) must use custom `toast.custom()` notifications from `react-hot-toast` with styled React components.

---

## 2. Technical SEO Architecture & Strategy

Sera is built as a single-page application (SPA) using React, Vite, and Vercel. Specific server-side interceptors, dynamic XML sitemaps, and canonical management systems ensure flawless search engine indexing and bot rendering.

### A. Non-WWW to WWW 301 Redirects (`vercel.json`)
* All requests arriving at `serastore.in` are permanently redirected via 301 response headers to `https://www.serastore.in/$1`.

### B. WhatsApp & Social Bot OpenGraph Interceptor (`vercel.json`)
* **Problem**: SPAs serve a single static `index.html` file to web scrapers, causing WhatsApp, Facebook, LinkedIn, Twitter, and Pinterest to display generic homepage meta tags when specific product links are shared.
* **Solution**: `vercel.json` intercepts incoming user agents matching social bots (`WhatsApp`, `facebookexternalhit`, `Twitterbot`, `LinkedInBot`, `Pinterest`, `bot`, `crawler`, `spider`) on `/product/:id` routes and rewrites the request directly to the backend endpoint: `https://backend.serastore.in/api/products/share/:id`.
* **Backend Processing**: The endpoint fetches the target `Product` from MongoDB and returns lightweight, raw static HTML containing dynamic OpenGraph tags (`og:title`, `og:description`, `og:image`, `og:url`) with high-res Cloudinary images, enabling instant rich previews in chat apps. Human users clicking the shared link are seamlessly redirected back to the React SPA interface.

### C. Automated XML Sitemap Generation (`sitemapRoutes.js`)
* **Live XML Endpoint**: `https://www.serastore.in/sitemap.xml` (served via backend route `GET /api/sitemap`).
* **Dynamic Indexing**: Automatically queries MongoDB `Product` and `Blog` collections to append newly added products (`/product/:id`) and published articles (`/journal/:slug`) with their exact `updatedAt` timestamps in ISO 8601 format.
* **HTML Fallback Sitemap**: Accessible to users and bots at `/sitemap`.

### D. Canonical Tag Management & Query String Normalization (`SEO.jsx`)
* All pages utilize the dynamic `<SEO />` wrapper component built on `react-helmet-async`.
* **Canonical Rule**: `currentUrl.split('?')[0]` is enforced on all canonical tags.
* **Purpose**: Prevents Google from indexing duplicate content or parameter-heavy URLs when users filter or sort the shop catalog (`/shop?category=EARRING&sort=price_low` resolves its canonical tag strictly back to `https://www.serastore.in/shop`).

### E. Structured Data / JSON-LD Schemas (`SEO.jsx` & `productdetails.jsx`)
* **Global Organization Schema**: Injected on all pages via `<SEO />`:
  ```json
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Sera Jewels",
    "url": "https://www.serastore.in",
    "logo": "https://www.serastore.in/logo.avif",
    "sameAs": ["https://www.instagram.com/serastore.in"]
  }
  ```
* **Product Schema**: Injected on individual product detail pages (`/product/:id`), detailing product name, description, Cloudinary image URLs, currency (`INR`), price, stock availability (`InStock` / `OutOfStock`), average rating score, and review count.
* **BreadcrumbList Schema**: Injected across category and product pages for Google Search snippet breadcrumb formatting.

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

---

## 3. URL Taxonomy, Information Architecture & Target Intent Map

| Route URL | Page Component | Change Frequency | Priority | Target User Intent & Keyword Strategy |
| :--- | :--- | :--- | :--- | :--- |
| `/` | `Home.jsx` | Daily | `1.0` | Core brand landing page; targets "Anti-Tarnish Jewelry", "Chic Women's Tops". |
| `/shop` | `Shop.jsx` | Daily | `0.9` | E-commerce catalog; targets "Buy Anti Tarnish Earrings", "Buy Anti Tarnish Necklaces", "Buy Tops & Apparel". |
| `/shop/collection/:aesthetic` | `Shop.jsx` | Weekly | `0.85` | Targeted collection landings (e.g. `/shop/collection/minimalist`, `/shop/collection/boho-vibes`, `/shop/collection/combos`). |
| `/product/:id` | `ProductDetails.jsx` | Weekly | `0.8` | Product-specific transaction pages targeting exact product search queries (jewelry & clothes). |
| `/journal` | `BlogList.jsx` | Daily | `0.8` | Content hub targeting long-tail anti-tarnish jewelry care, styling, cotton blend clothes guide, and gift guide search queries. |
| `/journal/:slug` | `BlogPost.jsx` | Monthly | `0.7` | In-depth editorial articles targeting specific long-tail keywords. |
| `/gifts` | `GiftingHub.jsx` | Weekly | `0.8` | Targets "Jewelry Gift Sets", "Gifts for Her", "Birthday Gift Jewelry Boxes", "Combo Gift Sets". |
| `/jewelry-care` | `JewelryCare.jsx` | Monthly | `0.7` | Educational landing targeting "How to clean anti-tarnish jewelry", maintenance guides. |
| `/materials` | `MaterialsGuide.jsx` | Monthly | `0.7` | Educational page explaining anti-tarnish quality standards and cotton blend fabric quality. |
| `/size-guide` | `SizeGuide.jsx` | Monthly | `0.6` | Utility guide targeting "Necklace Length Guide", "Top Size Chart". |
| `/sustainability` | `Sustainability.jsx` | Monthly | `0.6` | Eco-friendly packaging and ethical sourcing commitments. |
| `/about` | `InfoPages.jsx` | Monthly | `0.6` | Brand origin, mission statement, and craft details. |
| `/faq` | `InfoPages.jsx` | Weekly | `0.7` | FAQ page targeting customer service and shipping inquiries. |
| `/contact` | `Contact.jsx` | Monthly | `0.6` | Contact details and inquiry submission form. |
| `/sitemap` | `Sitemap.jsx` | Daily | `0.5` | HTML sitemap for human navigation and secondary crawler traversal. |
| `/privacy-policy` | `PrivacyPolicy.jsx` | Yearly | `0.3` | Legal privacy policy. |
| `/terms` | `TermsPage.jsx` | Yearly | `0.3` | Legal terms of service. |
| `/returns` | `Returns.jsx` | Yearly | `0.3` | Shipping, return, exchange, and cancellation policy documentation. |

---

## 4. On-Page Performance & Core Web Vitals Optimization

High search rankings depend on fast load times, zero cumulative layout shift (CLS), and low interaction to next paint (INP).

### A. Dynamic Image Optimization & Cloudinary Pipeline
* All uploaded images pass through Cloudinary's dynamic image processing pipeline.
* **Auto-Format & Quality**: Cloudinary URLs automatically inject `f_auto,q_auto` to deliver modern WebP/AVIF images based on the user's browser capabilities.
* **Width Restrictions**: Images rendered in carousels and product grids specify strict width caps (`w_600`, `w_800`, `w_2000`) to eliminate unnecessary mobile bandwidth usage.
* **Automated Alt Text**: Product images dynamically compute keyword-rich alt tags:
  `alt={`${product.name} - Anti-Tarnish Premium Jewelry & Clothes`}`.

### B. Preloader & Texture Prefetching (`Preloader.jsx`)
* Prevents Cumulative Layout Shift (CLS) on the homepage by prefetching all 4 WebGL hero slider textures and core category images into browser memory before revealing the UI.

### C. Low-GPU Shader Optimization (`lumina-interactive-list.tsx`)
* WebGL fragment shaders driving the hero slider utilize **branchless GLSL math** (replacing `if` conditions with `mix()` and `step()` functions) to prevent GPU stalls and frame drops on low-end mobile devices (e.g. ARM Mali GPUs).

### D. Deferral of 3rd-Party Scripts
* Non-critical scripts (such as Instagram feeds and external analytics) are deferred using `IntersectionObserver` triggers or fallback timers, preventing them from blocking the browser's main thread during initial page load.

---

## 5. Full Motion Engine & Animation Specifications

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

## 6. Complete Component & Page Architecture

### Component Map (`frontend/src/components/`)
1. **`Navbar.jsx`**: Sticky header with animated brand logo, route links, cart counter badge, and mobile drawer trigger.
2. **`NavOverlay.jsx`**: Mobile side drawer featuring staggered item entrance animations and expandable category submenus.
3. **`SearchOverlay.jsx`**: Debounced search popover with live keyword matching.
4. **`SEO.jsx`**: `react-helmet-async` wrapper managing meta titles, descriptions, canonical tags, OpenGraph data, and JSON-LD schemas.
5. **`TopBanner.jsx`**: Continuous marquee ticker promoting free shipping and brand highlights.
6. **`Preloader.jsx`**: Asset prefetching screen ensuring 0 CLS load.
7. **`FramerButton.jsx`**: Reusable interactive button with magnetic hover scaling and tap feedback.
8. **`CookieConsent.jsx`**: Privacy consent banner with session storage memory.
9. **`AxiosInterceptor.jsx`**: Handles global JWT authorization headers and handles 401 unauthenticated API states.
10. **`CartContext.jsx`**: React Context managing global shopping cart state, totals, and local storage sync.
11. **`ErrorBoundary.jsx`**: Captures runtime React errors to prevent full application crashes.
12. **`Footer.jsx`**: Site footer containing newsletter subscription form, quick links, category links, payment badges, and social media handles.
13. **`ScrollToTop.jsx`**: Automatically scrolls window to `(0, 0)` upon navigation.
14. **`TextArrowCTA.jsx`**: Micro-interaction call-to-action button with arrow animation.
15. **`AdminBlogTab.jsx`**: Control interface for managing editorial journal posts in the admin panel.
16. **`ui/lumina-interactive-list.tsx`**: Three.js WebGL shader hero slider.

---

## 7. Business Logic, Operations & Payment Pipeline

### Free Shipping Threshold
* **Rule**: Orders with subtotal **exceeding INR 999** automatically qualify for **Free Shipping**.
* **Standard Rate**: Orders INR 999 or below incur a **INR 100 shipping fee**.

### Order Cancellation Lifecycle
* **Pending Orders**: User can cancel via `/profile` with **100% refund** (0 fee).
* **Processing Orders**: User can cancel via `/profile` with **INR 100 fee** auto-deducted from refund amount.

### Exchange Window
* Customers can submit an exchange request within **3 days** of delivery. Free exchange applies to damaged or incorrect items; change-of-mind exchanges incur an INR 100 fee.

### Payment Processing (`/api/payment`)
* Razorpay Web integration. Payment verification checks server-side signature hashes, updates product stock levels, clears user cart, updates coupon usage counts, and sets order status to `'processing'`.

---

## 8. Database Schemas (`backend/models/`)

* **`User.js`**: `name`, `email`, `password`, `phone`, `role`, `addresses` array, `wishlist` array.
* **`TempUser.js`**: Holds pending registrations with OTP, expires automatically in 10 minutes.
* **`Product.js`**: `name`, `price`, `description`, `images`, `category`, `aesthetics` array, `tags`, `stock`, `sales`, `rating`, `numReviews`, `accentPairs`.
* **`Coupon.js`**: `code`, `discountType`, `discountValue`, `isFreeShipping`, `minOrderValue`, `expiryDate`, `isActive`, `showInFlyer`, `description`, `usageLimit`, `usageCount`, `isFirstOrderOnly`.
* **`Order.js`**: `user`, `items`, `shippingAddress`, `paymentMethod`, `paymentResult`, `totalPrice`, `status`, `cancellationFee`, `refundAmount`.
* **`Blog.js`**: `title`, `slug`, `content`, `excerpt`, `author`, `coverImage`, `published`.
* **`Category.js`**: `name`, `image`, `description`.
* **`Contact.js`**: `name`, `email`, `subject`, `message`, `status`.
* **`Newsletter.js`**: `email`.
* **`Review.js`**: `product`, `user`, `name`, `rating`, `comment`.

---

## 9. Complete API Endpoint Inventory

### Auth Endpoints (`/api/auth`)
* `POST /api/auth/register`: Initiate OTP verification.
* `POST /api/auth/verify-otp`: Complete registration.
* `POST /api/auth/login`: Authenticate & issue JWT.
* `GET /api/auth/profile`: Fetch profile data.
* `PUT /api/auth/profile`: Update user information.

### Products Endpoints (`/api/products`)
* `GET /api/products`: Catalog search & dynamic filtering.
* `GET /api/products/bestsellers`: Bestsellers feed.
* `GET /api/products/:id`: Product metadata & reviews.
* `GET /api/products/share/:id`: OpenGraph HTML route for social bots.

### Cart & Coupon Endpoints (`/api/cart` & `/api/coupons`)
* `GET /api/cart`: Server-synced cart.
* `GET /api/coupons/public`: Active flyer coupons for frontend modals.
* `POST /api/coupons/validate`: Coupon validation check.

### Order & Invoice Endpoints (`/api/orders`)
* `POST /api/orders`: Submit new order.
* `GET /api/orders/:id/invoice`: PDF invoice generation via `pdfkit`.
* `GET /api/sitemap`: Dynamic XML sitemap generator.
