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

