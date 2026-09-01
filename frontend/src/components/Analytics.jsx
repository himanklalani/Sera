import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function Analytics() {
  const location = useLocation();
  const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;

    // Wait until the main thread is idle before injecting the script
    // This defers the load, protecting our LCP and INP scores (Phase 10 / 12)
    const initAnalytics = () => {
      // Check if script already exists to prevent duplicate injections
      if (document.getElementById('ga4-script')) return;

      const script = document.createElement('script');
      script.id = 'ga4-script';
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        window.dataLayer = window.dataLayer || [];
        function gtag() {
          window.dataLayer.push(arguments);
        }
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', GA_MEASUREMENT_ID, {
          send_page_view: false, // We will handle page views manually via React Router
        });
        
        // Log the initial page view
        logPageView();
      };
    };

    const logPageView = () => {
      if (window.gtag) {
        window.gtag('event', 'page_view', {
          page_path: location.pathname + location.search,
        });
      }
    };

    // Use requestIdleCallback if available, otherwise fallback to setTimeout
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(initAnalytics);
    } else {
      setTimeout(initAnalytics, 2000);
    }
  }, []);

  // Track page view on route changes
  useEffect(() => {
    if (window.gtag && GA_MEASUREMENT_ID) {
      window.gtag('event', 'page_view', {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);

  return null;
}
