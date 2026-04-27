/**
 * Authentication guard component for protected routes.
 * Checks if a user is currently authenticated via sessionStore.
 * If authenticated, renders the child routes (Outlet).
 * If not authenticated, redirects to the login page.
 * @module components/RouteProtector
 */

import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSessionStore } from '../store/sessionStore.js';
import { ROUTES } from '../utils/constants.js';

/**
 * RouteProtector component that wraps authenticated routes.
 * Reads authentication state from the session store and either
 * renders child routes via Outlet or redirects to the login page.
 * Preserves the attempted location so the user can be redirected
 * back after successful authentication.
 * @returns {React.ReactElement} The Outlet for child routes if authenticated, or a Navigate redirect to /login
 */
function RouteProtector() {
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to={ROUTES.LOGIN}
        state={{ from: location }}
        replace
      />
    );
  }

  return <Outlet />;
}

export default RouteProtector;