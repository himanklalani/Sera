import { useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Global Axios Interceptor
 * - Watches ALL axios responses across the entire app
 * - On a 401/403 error (expired/invalid token), wipes localStorage and
 *   redirects to /login with a `redirect` param so the user returns to
 *   their previous page after logging back in
 * - Safely cleans up the interceptor when the component unmounts
 * - Ignores 401s that come from the login/register endpoints themselves
 *   so they can still show "wrong password" errors normally
 */
const AUTH_ROUTES = ['/api/auth/login', '/api/auth/register', '/api/auth/verify-otp', '/api/auth/google'];

const AxiosInterceptor = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const interceptorRef = useRef(null);

  useEffect(() => {
    interceptorRef.current = axios.interceptors.response.use(
      // Pass successful responses through untouched
      (response) => response,

      // Handle errors globally
      (error) => {
        const status = error.response?.status;
        const requestUrl = error.config?.url || '';

        // Only auto-logout on 401/403 from protected endpoints
        // Do NOT intercept auth-route errors (login/register) — they need
        // to show their own "wrong password" / "account not found" messages
        const isAuthRoute = AUTH_ROUTES.some((route) => requestUrl.includes(route));

        if ((status === 401 || status === 403) && !isAuthRoute) {
          // Wipe the stale session
          localStorage.removeItem('userInfo');

          // Capture where the user currently is (unless they're already on login)
          const currentPath = location.pathname;
          const isAlreadyOnAuthPage = ['/login', '/register', '/forgot-password', '/reset-password'].includes(currentPath);

          if (!isAlreadyOnAuthPage) {
            navigate(`/login?redirect=${encodeURIComponent(currentPath)}`, { replace: true });
          }
        }

        // Always reject so individual catch blocks still work as expected
        return Promise.reject(error);
      }
    );

    // Cleanup: eject this interceptor when the component unmounts
    return () => {
      if (interceptorRef.current !== null) {
        axios.interceptors.response.eject(interceptorRef.current);
      }
    };
    // Re-attach if navigation changes (so location.pathname is always fresh)
  }, [navigate, location]);

  return children;
};

export default AxiosInterceptor;
