// frontend/src/components/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Disable the browser's native scroll restoration globally.
// When React lazy-loads chunks, the page height changes after the browser
// already tried to restore scroll, causing landing at wrong positions.
// We take full control and always start at the top on any navigation or refresh.
if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

export default function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    // Use instant scroll (no smooth) so it fires before paint
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname, location.search]);

  return null;
}
