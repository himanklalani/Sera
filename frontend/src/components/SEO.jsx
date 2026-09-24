import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({ 
  title, 
  description, 
  canonicalUrl, 
  ogImage = 'https://res.cloudinary.com/dhby5v7rw/image/upload/f_auto,q_auto/v1780229969/hero_zvkcsm.avif', 
  schema,
  robots
}) {
  const defaultTitle = "Sera - Premium Anti-Tarnish Jewelry & Women's Apparel";
  const defaultDescription = "Shop the best anti-tarnish waterproof jewelry and chic women's cotton blend tops. From minimalist necklaces to everyday wear combos.";

  const finalTitle = title ? (title.includes('Sera') ? title : `${title} | Sera`) : defaultTitle;
  const finalDescription = description || defaultDescription;

  const normalizeCanonical = (url) => {
    if (!url) return 'https://www.serastore.in';
    const clean = url.split('?')[0].split('#')[0];
    if (clean.length > 'https://www.serastore.in'.length && clean.endsWith('/')) {
      return clean.slice(0, -1);
    }
    return clean;
  };

  const currentUrl = normalizeCanonical(canonicalUrl || (typeof window !== 'undefined' ? window.location.href : 'https://www.serastore.in'));

  // Base Organization & WebSite Schemas (always present)
  const baseSchema = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Sera Jewels",
      "url": "https://www.serastore.in",
      "logo": "https://www.serastore.in/logo.avif",
      "sameAs": [
        "https://www.instagram.com/serastore.in",
        "https://www.pinterest.com/serastore/"
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Sera Jewels",
      "url": "https://www.serastore.in",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://www.serastore.in/shop?search={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  ];

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      {robots && <meta name="robots" content={robots} />}
      
      {/* Canonical Tag - Fixes duplicate content issues */}
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={ogImage} />

      {/* Organization & WebSite Schema */}
      <script type="application/ld+json">
        {JSON.stringify(baseSchema)}
      </script>

      {/* Page-Specific Schema (if provided) */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}
