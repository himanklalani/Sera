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
