# Sera Jewels - Deployed Changes Log

This file tracks the SEO and Performance Optimization changes that have been pushed to the live production site.

## Push Date: September 1, 2026

### 1. Content & Internal Linking (Hub & Spoke Strategy)
- **Database Seeding:** Automatically populated the database with 3 new SEO-optimized articles ("Why Anti-Tarnish Jewelry is the Ultimate Everyday Luxury", "Cotton Blend vs. Pure Cotton Women's Tops", and "5 Waterproof Jewelry Gift Ideas").
- **Materials Guide Cross-Link:** Added a direct SEO backlink from the `JewelryCare.jsx` page to the Materials Guide to pass domain authority.
- **Apparel Links:** Fixed the URL structures in the seeded blogs to point directly to the clean SEO URL (`/shop/apparel`) rather than using query parameters.
- **Blog Formatting:** Fixed the Markdown rendering bug in `BlogPost.jsx` by updating the seed script to output proper HTML tags.

### 2. Core Web Vitals & Performance (Top Performers)
- **Homepage LCP (Largest Contentful Paint):** 
  - Updated `index.html` to preload the first slide of the `LuminaSlider`.
  - Added Cloudinary compression flags (`f_auto,q_auto`) to the WebGL slider images in `lumina-interactive-list.tsx` to drastically reduce payload sizes.
  - Added `loading="lazy"` and `fetchpriority="low"` to the Apparel drop image in `Home.jsx` to prevent it from blocking the initial page load.
- **Shop Grid Optimization:** 
  - Updated `Shop.jsx` to conditionally eager-load (`fetchpriority="high"`) the first 4 products above the fold, while lazily loading all remaining products below the fold.

### 3. Advanced Technical SEO
- **Dynamic Sitemaps:** 
  - Deleted the outdated static `generateSitemap.js` script from the frontend build process.
  - Updated `vercel.json` to proxy `/sitemap.xml` directly to the Express backend (`sitemapRoutes.js`), ensuring Google always receives a real-time map of all products and SEO blogs.
- **Social Media OG Crawler Interception:**
  - Added a new `GET /api/blogs/share/:slug` endpoint in `blogRoutes.js` to generate dynamic Open Graph (OG) meta tags for Journal articles.
  - Added a rewrite rule in `vercel.json` to intercept WhatsApp, Twitter, and LinkedIn crawlers hitting `/journal/:slug` and route them to the new backend endpoint, generating rich social previews for shared blogs.
- **UI Bug Fixes:** Fixed the invisible "Shop Sera Jewels" call-to-action button in `BlogPost.jsx` by migrating from undefined variables to the global `rose-500` brand color.

### 4. UI/UX & Social Sharing Improvements
- **Default Open Graph Fallback:** Injected default `<meta property="og:image">` tags into `index.html` so that social platforms (like WhatsApp) that don't execute JavaScript will automatically fall back to generating link previews with the Sera Logo instead of a blank image.
- **Share Menu Cleanup:** Removed the Instagram share button from the product details Share dropdown to streamline options.
- **Rich Clipboard Image Watermarking:** Upgraded the `getPngBlob` utility in `shareUtils.js` to dynamically draw the Sera Logo (`slogo.png`) directly onto the canvas before copying. This ensures that any copied product image retains official branding.
- **OS Clipboard Override Fix:** Modified the "Copy Link" button in `productdetails.jsx` to exclusively copy the text URL (stripping the image payload). This prevents messaging apps (like WhatsApp) from automatically dropping the text link when pasting a mixed image/text clipboard item.

## Push Date: September 2, 2026

### 5. Phase 18: Advanced E-commerce SEO Architecture
- **PLP Crawlability (Deep Pagination):** Refactored the `Shop.jsx` pagination system. Replaced JavaScript-dependent `onClick` buttons with standard HTML `<Link to="?page=X">` anchor tags. This allows search engine crawlers (like Googlebot) to follow links and discover products deep within the catalog, while maintaining the fast, client-side routing experience for human users.
- **Soft 404 Penalty Remediation:** Updated the `productdetails.jsx` error screen for deleted or invalid products. Injected a `<meta name="robots" content="noindex">` tag via the `SEO.jsx` component to explicitly command search engines to drop dead URLs from their index (preventing Soft 404 penalties). Simultaneously upgraded the UX by adding a "Return to Shop" button.
- **Social Bot Proxy Validation:** Verified and confirmed the successful integration of the Vercel-to-Express bot proxy (`/api/products/share/:id`) which dynamically injects Open Graph (OG) metadata for products when shared via WhatsApp, Facebook, or Twitter.

## Push Date: September 5, 2026

### 6. Checkout UX & Seamless Address Management
- **Multi-Address Selection on Checkout:** Redesigned the Shipping Address section on `Checkout.jsx` into interactive, selectable cards with radio checkmark badges and clear "Deliver Here" indicators.
- **In-Checkout Address Creation:** Added "+ Add Another Address" dashed quick card with an animated modal allowing buyers to add new delivery addresses without leaving the checkout flow. Automatically persists to the user profile in MongoDB (`PUT /api/auth/profile`) and sets the newly created address as active.
- **Inline Address Editing & Deletion:** Added direct Edit and Delete capabilities to saved address cards on Checkout. Edit mode pre-fills all fields and saves updates instantly.
- **CORS Local Development Optimization:** Updated Express CORS middleware in `server.js` with dynamic port regex matching for `localhost` and `127.0.0.1`, allowing seamless multi-port dev server instances without network blocking.
- **Master Playbook Expansion:** Updated `playbook.md` to v5 incorporating senior enterprise search architecture, patent analysis, and cross-archetype execution strategies.

### 7. Purchase Journey Audit — Security, Correctness & Guest Cart (20-Point Fix)

#### Backend Security (Critical)
- **Server-Side Price Integrity (`paymentRoutes.js`):** Extracted a shared `validateAndCalculateOrder()` helper used by both `/create-order` and `/verify-payment`. The server now recalculates `cartValue`, `shippingCost`, and `finalTotalPrice` directly from MongoDB product prices — client-supplied amounts are completely ignored, preventing price tampering.
- **Coupon Server Validation (`paymentRoutes.js`):** Coupons are now fully re-validated on the backend at checkout: `isActive`, `expiryDate`, `usageLimit`, `minOrderValue`, `perUserLimit`, and `isFirstOrderOnly` are all enforced. Usage count is incremented atomically with a conditional `findOneAndUpdate` to prevent race conditions.
- **Combo Stock Deduction (`paymentRoutes.js`):** Physical `comboItems` children are now the unit of stock validation and deduction. The virtual combo product stock is no longer trusted, preventing overselling of bundled products.

#### Backend Infrastructure
- **Bulk Product Endpoint (`productRoutes.js`):** Added `POST /api/products/bulk` — accepts an array of product IDs and returns live product data. Used by the guest cart to hydrate with real-time prices and stock without N+1 requests.
- **Bulk Guest Sync Endpoint (`cartRoutes.js`):** Added `POST /api/cart/sync` — merges an entire guest cart into the authenticated user's DB cart in one request, replacing the previous item-by-item loop. Stock is capped gracefully rather than failing hard.

#### Guest Cart Wiring
- **Shop.jsx:** Removed forced login gate on Add-to-Cart. Guests now add items directly via `CartContext`, updating the navbar badge immediately without any redirect.
- **Cart.jsx:** Removed login gate from greeting card add. Guests can add greeting card notes freely. "Proceed to Checkout" button redirects unauthenticated users to `/login?redirect=/checkout` instead of a dead-end `/login`.
- **Auth Link Chains:** All login/register navigation now carries `?redirect=` parameters — Login → "Create account" and Register → "Log in" both preserve the destination, eliminating dead-end redirect loops.

#### Cart State & Logic Fixes
- **`CartContext.jsx` — JSON.parse Crash Protection:** Both `getUserInfo()` and `getGuestCart()` are now wrapped in `try/catch`. Corrupted localStorage values are silently cleared and the app continues operating instead of crashing.
- **`CartContext.jsx` — N+1 Sync Eliminated:** `syncGuestCart()` now sends all guest items in one `POST /api/cart/sync` request instead of looping individual POSTs.
- **`CartContext.jsx` — Guest Cart Staleness:** `fetchCart()` for guests now calls `POST /api/products/bulk` to hydrate items with live stock and prices. Out-of-stock items are auto-removed with a toast; adjusted quantities are flagged.
- **`CartContext.jsx` — Quantity Bounds:** `updateQuantity()` now guards against `quantity < 1` to prevent negative or zero-quantity cart items.
- **Duplicate fetchCart Removed (`login.jsx`, `register.jsx`):** Removed redundant `await fetchCart()` after `await syncGuestCart()`. `syncGuestCart` already calls `fetchCart` internally, so the double call caused a race condition and unnecessary double-fetch.

#### Checkout & Order Completion
- **Redirect Loop Fixed (`Checkout.jsx`):** All internal `navigate('/login')` calls updated to `navigate('/login?redirect=/checkout')`.
- **COD clearCart (`Checkout.jsx`):** `clearCart()` is now explicitly called immediately after a successful COD order API response, before navigating to `/order-success`.
- **Razorpay clearCart (`Checkout.jsx`):** `clearCart()` is also called in the Razorpay `handler` callback on successful payment verification.
- **OrderSuccess Safety Net (`OrderSuccess.jsx`):** `clearCart()` is called on mount as a defensive fallback — ensures cart always resets even if the Checkout navigation state was lost (e.g., page refresh after payment).
- **Null Pointer Protection (`Checkout.jsx`):** All `cartItems.map()` calls guarded with `item?.product` optional chaining. `subtotal` calculation filters out null-product items, preventing crashes if a product is deleted mid-session.

#### Edge Cases & Logout Desync
- **Wishlist Redirect (`productdetails.jsx`):** Unauthenticated wishlist button now redirects to `/login?redirect=/product/:id` instead of bare `/login`.
- **Size State Leaks (`productdetails.jsx`):** `setSelectedSize('')`, `setQuantity(1)`, and `setSelectedImage(0)` are reset at the top of `fetchProduct` whenever the product `id` changes, preventing stale apparel size from carrying over to a jewelry product.
- **Logout Desync (`profile.jsx`):** `clearCart()` from `useCart()` is called immediately on logout confirmation before removing `userInfo` from localStorage.
- **Auto-Logout Desync (`AxiosInterceptor.jsx`):** On 401/403 auto-logout, a `StorageEvent` is dispatched so `CartContext`'s storage listener fires and switches to guest mode in the same browser tab.

## Push Date: September 17, 2026

### 8. Product Page Conversion Optimization & Master Blueprint Synchronization
- **"Add to Cart" ➔ "Go to Cart" Transition (`productdetails.jsx`):** Automatically transitions the main CTA button to an interactive "Go to Cart ➔" action button once an item is added to the cart, eliminating mobile checkout reach friction while maintaining a clean aesthetic. Provides an inline "+ Add another to cart" secondary action and dynamic size-awareness.
- **Master Technical Blueprint Audit (`Rules.md`):** Complete synchronization of database schemas (`Blog`, `Order`, `Product`, `User`, `Coupon`), full API endpoint inventory (including Google Merchant Center feed, share crawler endpoints, auth endpoints), frontend context providers, and social share watermarking architecture.

## Push Date: September 18, 2026

### 9. Strategy 3 & 4: Gifting & Occasion Search Expansion + Sitewide Descriptive Anchor Text Architecture
- **Strategy 3 (Gifting & Female Fashion Occasion Search Engine Optimization):**
  - **New High-Intent SEO Gifting Articles:** Authored and seeded 2 strategic articles into MongoDB:
    1. *"5 Thoughtful Jewelry Gift Sets for Her Under ₹1,500"* (`/journal/5-thoughtful-jewelry-gift-sets-under-1500`) targeting price-conscious gift seekers and birthdays/anniversaries.
    2. *"The Ultimate Gifting Guide: Thoughtful Gifts for Her (Jewelry Combos & Chic Tops)"* (`/journal/ultimate-gifting-guide-jewelry-gift-sets-for-her`) targeting occasion searches and wardrobe capsule gifts.
  - **Database Blog Sanitization:** Ran a full audit across all 8 published blog articles in MongoDB. Sanitized 100% of forbidden vocabulary terms (no coating, PVD, plating, hypoallergenic, stainless steel, gold, silver, demi-fine, everyday luxury, skin-friendly) and replaced them with approved search-intent phrases.
  - **Gifting Hub Revamp (`GiftingHub.jsx`):** Replaced query links with direct canonical category cards (`/shop/necklaces`, `/shop/combos`, `/shop/earrings`, `/shop/apparel`). Added rich occasion-based gift discovery and highlighted unboxing packaging.
- **Strategy 4 (Sitewide Descriptive Anchor Text & Canonical Internal Linking):**
  - **Canonical Category Routing:** Replaced legacy query URLs (`/shop?category=...`) in `NavOverlay.jsx`, `Home.jsx`, and `GiftingHub.jsx` with canonical routes (`/shop/necklaces`, `/shop/earrings`, `/shop/bracelets`, `/shop/combos`, `/shop/apparel`), completely resolving Google Search Console canonical validation flags.
  - **Descriptive Anchor Text Injections:** Replaced generic CTA links ("Shop", "Click here", "Explore") across `JewelryCare.jsx`, `MaterialsGuide.jsx`, `SizeGuide.jsx`, `Sustainability.jsx`, and `Footer.jsx` with high-ranking keyword anchors:
    - `"anti-tarnish waterproof necklaces"` ➔ `/shop/necklaces`
    - `"waterproof earrings"` ➔ `/shop/earrings`
    - `"tarnish-resistant bracelets"` ➔ `/shop/bracelets`
    - `"matching jewelry combo sets"` ➔ `/shop/combos`
    - `"chic cotton blend tops"` ➔ `/shop/apparel`
    - `"curated jewelry gifting hub"` ➔ `/gifts`
    - `"complete jewelry care guide"` ➔ `/jewelry-care`
  - **Sitewide Footer Architecture (`Footer.jsx`):** Restructured footer into a dedicated 4-column layout including a "Collections" column and "Guides & Gifts" column with keyword-rich internal anchors on every page.
- **Category Routing & Singular/Plural DB Mapping Fix (`Shop.jsx`, `productRoutes.js`):**
  - Resolved issue where URLs like `/shop/necklaces` or `/shop/bracelets` returned 0 products because MongoDB stored categories in singular (`necklace`, `bracelet`).
  - Added seamless bidirectional category slug normalization and query matching in `productRoutes.js` (`$in: ['necklace', 'necklaces']`, `$in: ['bracelet', 'bracelets']`, etc.) and `Shop.jsx`.
  - Category filter pills in `Shop.jsx` now correctly activate when landing on plural canonical URLs.
- **Universal Free Size & Apparel Sizing Architecture (`SizeGuide.jsx`, `productdetails.jsx`):**
  - Updated `SizeGuide.jsx` with a comprehensive guide establishing that **all Sera jewelry & accessories are 100% Anti-Tarnish, Waterproof, and Universal Free Size (all can fit)** featuring adjustable built-in extension chains and flexible cuffs.
  - Sizing chart explicitly focused on women's cotton blend tops and apparel (XS, S, M, L).
  - Added a dedicated "Size: Free Size (Universal Fit • All Can Fit)" badge, updated trust badges ("Anti-Tarnish & Waterproof", "Universal Free Size"), and description specs on all non-apparel product pages in `productdetails.jsx`.
- **Strict Brand Negative Vocabulary Compliance:**
  - Audited all frontend pages and backend content ensuring 0 occurrences of forbidden terms.

### 10. Final Audit Pass: Breadcrumb Canonicals, Dead Link Clean-Up & Zero "Coming Soon" (`commit 25a3880`)
- **Breadcrumbs & JSON-LD Schema (`productdetails.jsx`):**
  - Updated breadcrumb UI and structured schema (`BreadcrumbList`) to map singular database categories to canonical plural slugs (`/shop/necklaces`, `/shop/bracelets`, `/shop/earrings`, `/shop/combos`, `/shop/apparel`).
- **Elimination of "Coming Soon" Phrasing Sitewide:**
  - `Home.jsx`: Category card fallback and CTA links updated directly to `/shop/combos` and `/shop/apparel`.
  - `InfoPages.jsx`: FAQ international shipping updated from "coming soon" to clear pan-India fulfillment notice with direct contact email.
- **Social & Footer Modernization (`Footer.jsx`, `NavOverlay.jsx`):**
  - Replaced dead Pinterest placeholder (`#`) with official brand destination (`https://www.pinterest.com/serastore/`).
  - Converted hardcoded copyright year to dynamic `© {new Date().getFullYear()} Sera Jewels`.
- **Sitemap Freshness Timestamps (`backend/routes/sitemapRoutes.js`):**
  - Added real-time ISO `<lastmod>` timestamps to all 19 static, discovery, legal, and category landing page entries to trigger prompt Googlebot re-crawling.

### 11. Dynamic Sitemap Proxy Unlocking & Vercel Static Override Fix (`commit 54757f1`)
- **Vercel Static File Override Resolution (`frontend/public/sitemap.xml`):**
  - Removed legacy static `frontend/public/sitemap.xml` file (dating from August 18, 2026 containing only 19 static/outdated links).
  - Vercel's edge routing prioritizes public static assets above `vercel.json` rewrites. Deleting this file allowed the rule `"source": "/sitemap.xml"` ➔ `"destination": "https://backend.serastore.in/sitemap.xml"` to take effect.
  - Live sitemap now dynamically generates and serves all **78 URLs** (19 core/category/info pages, all active products with Google Image XML schemas, and published journal articles).

## Push Date: September 21, 2026

### 12. Google Merchant Center & Search Console Crawler Loop Remediation
- **Resolution of "Product page unavailable" & GSC "Discovered – currently not indexed":**
  - Found and fixed a critical crawler trap in `frontend/vercel.json` where a greedy `bot|Bot|Crawler|Spider` regex was intercepting Googlebot and StoreBot-Google requests on `/product/:id` and `/journal/:slug`.
  - The interception was sending search engine crawlers to a backend share endpoint with a self-referencing `<meta http-equiv="refresh">` loop, causing Merchant Center to flag "Product page unavailable" and GSC to abandon crawling with "Discovered – currently not indexed (Last crawled: N/A)".
  - Narrowed regex to only target social sharing unfurlers (`WhatsApp`, `facebookexternalhit`, `Facebot`, `Twitterbot`, `LinkedInBot`, `Pinterest`, `TelegramBot`, `Discordbot`, `Slackbot`). All search and shopping bots now receive the full React application with rendered DOM, pricing, schema, and CTAs.
- **Resolution of "Missing shipping information" & Category-Specific Delivery Times (`feedRoutes.js`, `productdetails.jsx`):**
  - Injected compliant `<g:shipping>` nodes and item-level handling times into the Google Merchant Center XML feed:
    - **Jewelry:** Handling 2–3 business days + Transit 3–4 business days (**5–7 business days total**).
    - **Apparel (Custom Stitched):** Handling 5–7 business days + Transit 5 business days (**10–12 business days total**).
    - Added `<g:shipping_label>apparel</g:shipping_label>` vs `<g:shipping_label>jewelry</g:shipping_label>`.
    - Maintained delivery price policy (Free above INR 999, INR 100 below INR 999).
  - Updated `productdetails.jsx` shipping badge to display `"Custom stitched & delivered in 10-12 business days"` for apparel.
  - Injected `<g:gender>female</g:gender>` and `<g:age_group>adult</g:age_group>` tags for Google Shopping taxonomy compliance.
- **Cart Add-on Feed Sanitization (`feedRoutes.js`, `sitemapRoutes.js`):**
  - Filtered out non-catalog cart upsells (`isAddon: true` and `category: 'add-on'`, e.g., Kit Kat, Greeting Card, Scrunchie) from Google Merchant Center and public XML sitemaps.

### 13. Deep Internal Linking Perfection & Semantic Crawlability Pass
- **Navigation Drawer Semantic Links (`NavOverlay.jsx`):**
  - Converted JavaScript button click handlers into true semantic `<Link to="...">` components across primary and category sub-menus. Guarantees search engines crawl the full navigation tree on mobile and desktop viewports.
- **Product Page Cross-Linking Wheel (`productdetails.jsx`):**
  - Replaced JavaScript `navigate('/size-guide')` buttons with semantic `<Link to="/size-guide">` tags across apparel measurements and jewelry free-size badges.
  - Injected an explicit internal backlink to the Materials Guide (`/materials`) into the product specs section, completing the three-way link wheel between every product and `/materials`, `/jewelry-care`, and `/sustainability`.
- **HTML Sitemap Synchronization (`Sitemap.jsx`):**
  - Removed outdated link to non-existent `/shop/rings`.
  - Added dedicated keyword links for `Jewelry Combo Sets` (`/shop/combos`) and `Chic Women's Tops` (`/shop/apparel`).
- **404 Recovery Funnel (`NotFound.jsx`):**
  - Updated primary CTA button to link to `/shop` ("EXPLORE THE SHOP") and added quick collection pill links (`Necklaces`, `Earrings`, `Bracelets`, `Combo Sets`, `Gifting Hub`) to prevent dead-end crawling drops.

## Push Date: September 24, 2026

### 14. GSC Canonical Deduplication & Full Accessibility (WCAG 2.1 AA) Audit

#### Root Cause of "Duplicate without user-selected canonical" (GSC)
- In a Vite SPA deployed on Vercel, every route (`/gifts`, `/shop/bracelets`, `/shop/apparel`) previously returned the same `index.html` with **no static canonical tag** and a hidden `<div style="display:none">` containing generic homepage copy. Googlebot's raw HTTP crawl pass (before JS rendering) saw identical HTML with no canonical URL, grouping them as duplicates of the homepage. Also, absence of `"trailingSlash": false` in `vercel.json` meant `/gifts` and `/gifts/` both returned 200 OK, creating duplicate URL variants in Googlebot's queue.

#### Fixes Applied

**`frontend/vercel.json`:**
- Kept `"trailingSlash": false` — Vercel sends 301 Permanent Redirects for all trailing-slash variants (`/gifts/` → `/gifts`), eliminating duplicate slash URL indexing.
- Omitted `"cleanUrls": true` because it conflicts with Vercel's SPA catch-all rewrite to `/index.html` on dynamic routes (`/cart`, `/checkout`, `/product/:id`).

**`frontend/index.html`:**
- Removed the toxic hidden fallback `<div style="display:none" aria-hidden="true">` which served identical homepage copy on every route before JS hydration.
- Added default `<link rel="canonical" href="https://www.serastore.in/" />` in static HTML so Googlebot's first HTTP pass has a canonical even without JS execution.
- Added OpenGraph and Twitter card fallback meta tags (`summary_large_image`).

**`frontend/scripts/prerender-seo.js` (NEW):**
- Created a `postbuild` static generator that reads `dist/index.html` and creates dedicated static HTML files at `dist/{route}/index.html` for all 19 canonical routes.
- Pre-bakes `<link rel="canonical">`, page-specific `<title>`, and `<meta name="description">` directly into the static HTML on line 5, so Googlebot's raw HTTP crawl reads the correct canonical instantly without JS.
- Updated `frontend/package.json` build script to `"vite build && node scripts/prerender-seo.js"`.

**`frontend/src/components/SEO.jsx`:**
- Fixed title duplication bug (`title.includes('Sera') ? title : \`${title} | Sera\`` — eliminated `... | Sera | Sera` double-appends).
- Added URL normalization stripping hashes, query params, and trailing slashes before emitting canonical tags.
- Added Schema.org `WebSite` with Google `SearchAction` (Sitelinks Searchbox) alongside `Organization`.

**`frontend/src/components/Preloader.jsx`:**
- Added bot detection (`isBot`) and non-home route detection. Bots and non-home routes immediately skip the 1.8–8s Cloudinary image preloading, allowing Googlebot's Web Rendering Service to render page content instantly without hitting render timeouts.

**`frontend/src/pages/Home.jsx`:**
- Removed conflicting duplicate `<Helmet>` inside `<HeroSection>`.
- Normalized canonical URL to `https://www.serastore.in` (no trailing slash).

#### WCAG 2.1 AA Accessibility Fixes

**`frontend/src/App.jsx`:**
- Added accessible "Skip to main content" link (`.sr-only focus:not-sr-only`) and `id="main-content"` on `<main>` for WCAG 2.4.1 compliance.

**`frontend/src/components/ui/lumina-interactive-list.tsx`:**
- Replaced duplicate outer `<main>` landmark with `<section aria-label="Hero Showcase">`.
- Upgraded hero heading to semantic `<h1>` with screen-reader text.

**`frontend/src/components/NavOverlay.jsx`:**
- Added `role="dialog" aria-modal="true" aria-label="Navigation Menu"` and `aria-label="Close Navigation Menu"` on close button.

**`frontend/src/components/SearchOverlay.jsx`:**
- Added `role="dialog" aria-modal="true" aria-label="Product Search"`.

**`frontend/src/components/Footer.jsx`:**
- Added `id="newsletter-email"` and `aria-label="Email address for newsletter"` to newsletter input.

**`frontend/src/components/FreeShippingBar.jsx`:**
- Added `role="progressbar" aria-valuenow={...} aria-valuemin={0} aria-valuemax={100} aria-label="Free shipping progress"`.

---

### 15. Google Merchant Center "Product Page Unavailable" Fix — StoreBot-Google Routing

#### Root Cause
Google Merchant Center uses **StoreBot-Google**, a non-JS-rendering crawler. Unlike Googlebot (which runs full headless Chrome), StoreBot reads raw HTTP response HTML only. When StoreBot hit `https://www.serastore.in/product/:id`, Vercel returned the blank 4,048-byte React SPA shell with no product data → GMC flagged 21 products as "Product page unavailable".

**History of the redirect loop fix (Sept 21):** The original fix correctly removed the broad `bot|Bot` regex from `vercel.json` (which was causing an infinite redirect loop: StoreBot → share endpoint → `<meta http-equiv="refresh">` back to `/product/:id` → StoreBot → loop). But removing the regex entirely left StoreBot back at the blank SPA shell. The Sept 21 fix stopped the loop but didn't provide StoreBot with real product HTML.

#### Fixes Applied

**`backend/routes/productRoutes.js` — New `GET /api/products/merchant/:id` endpoint:**
- Dedicated StoreBot endpoint returning fully rendered static product HTML with **zero redirects**.
- Response body contains: product `<h1>`, price, description, availability, images, breadcrumb nav, and `<link>` to canonical product URL.
- Full Schema.org `Product` JSON-LD with `OfferShippingDetails` (handling time + transit time per category).
- Sets `X-Robots-Tag: noindex` so this helper URL is never indexed itself.
- `<link rel="canonical" href="https://www.serastore.in/product/:id">` tells Google the real URL.

**`frontend/vercel.json` — Bot routing updated:**
- Added `StoreBot-Google` and `AdsBot-Google` intercept rule **before** the social bot rule.
- StoreBot hits `/product/:id` → proxied to `/api/products/merchant/:id` (real product HTML, no redirect).
- Social bots (WhatsApp/Facebook/Twitter/etc) still route to `/api/products/share/:id` (OG tags + human redirect).
- Regular users and Googlebot still receive the full React SPA.

**Bot Routing Priority Map (vercel.json):**
```
/product/:id
  1. UA: StoreBot-Google / AdsBot-Google  →  /api/products/merchant/:id  (rich HTML, NO redirect)
  2. UA: WhatsApp / FB / Twitter / etc    →  /api/products/share/:id     (OG tags + human redirect)
  3. Everyone else (users, Googlebot)     →  React SPA /index.html
```

**`backend/routes/feedRoutes.js` — Merchant Center XML Feed improvements:**
- Moved `<g:shipping>` block **before** `<g:price>` (GMC processes in document order; shipping before price helps attribute recognition).
- Added `<g:transit_time_label>` (`standard` for jewelry, `custom-stitched` for apparel) for India shipping policy binding.
- Added `<g:custom_label_0>` (apparel vs jewelry) for GMC campaign segmentation.
- Normalized price format to always use `Number.toFixed(2)`.

#### "Missing Shipping Information" Note
The `<g:shipping>` nodes were already added Sept 21. GMC needs a manual **"Fetch Now"** in Merchant Center → Data Sources to re-crawl the feed and clear cached errors.

#### "Available Soon" Add-Ons (Kit Kat, Cadbury Silk, Greeting Card, Scrunchie)
These were submitted to GMC before the `isAddon: true` filter was deployed. Feed filter is in place. GMC will drop them after next scheduled feed refresh.

