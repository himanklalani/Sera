import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({ 
  title, 
  description, 
  canonicalUrl, 
  ogImage = 'https://res.cloudinary.com/dhby5v7rw/image/upload/f_auto,q_auto/v1780229969/hero_zvkcsm.avif', 
  schema 
}) {
  const currentUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : 'https://www.serastore.in');
  
  const defaultTitle = 'Sera - Affordable & Minimalistic Anti-Tarnish Jewellery';
  const defaultDescription = 'Shop the best affordable, minimalistic, and cutesy anti-tarnish jewellery. From girly rings to elegant necklaces, waterproof and skin-friendly.';

  const finalTitle = title ? `${title} | Sera` : defaultTitle;
  const finalDescription = description || defaultDescription;

  // Base Organization Schema (always present)
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Sera Jewels",
    "url": "https://www.serastore.in",
    "logo": "https://www.serastore.in/logo.avif",
    "sameAs": [
      "https://www.instagram.com/serastore.in"
    ]
  };

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      
      {/* Canonical Tag - Fixes duplicate content issues */}
      <link rel="canonical" href={currentUrl.split('?')[0]} />

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

      {/* Organization Schema */}
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
