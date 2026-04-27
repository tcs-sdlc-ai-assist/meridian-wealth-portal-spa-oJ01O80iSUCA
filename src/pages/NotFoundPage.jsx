/**
 * 404 Not Found page rendered for unknown routes.
 * Displays a centered message with '404 — Page Not Found', a brief description,
 * and a 'Go to Home' button that navigates to /accounts (if authenticated)
 * or /login (if not). Styled with Tailwind.
 * @module pages/NotFoundPage
 */

import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionStore } from '../store/sessionStore.js';
import { ROUTES } from '../utils/constants.js';

/**
 * NotFoundPage component for displaying a 404 error page.
 * Shows a centered layout with a 404 heading, descriptive message,
 * and a navigation button that directs authenticated users to /accounts
 * and unauthenticated users to /login.
 * @returns {React.ReactElement} The NotFoundPage component
 */
function NotFoundPage() {
  const navigate = useNavigate();
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);

  /**
   * Handle the 'Go to Home' button click.
   * Navigates to /accounts if authenticated, otherwise to /login.
   */
  const handleGoHome = useCallback(() => {
    if (isAuthenticated) {
      navigate(ROUTES.ACCOUNTS, { replace: true });
    } else {
      navigate(ROUTES.LOGIN, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md text-center">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <svg
            className="h-12 w-12 text-primary-600"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* 404 Heading */}
        <h1 className="text-6xl font-bold tracking-tight text-gray-900 sm:text-7xl">
          404
        </h1>

        {/* Title */}
        <h2 className="mt-4 text-xl font-semibold text-gray-900 sm:text-2xl">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="mt-3 text-sm text-gray-500">
          Sorry, the page you are looking for doesn&apos;t exist or has been moved.
          Please check the URL or navigate back to the home page.
        </p>

        {/* Go to Home Button */}
        <div className="mt-8">
          <button
            type="button"
            onClick={handleGoHome}
            className="inline-flex items-center rounded-md bg-primary-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Go to Home
          </button>
        </div>

        {/* Additional Help */}
        <p className="mt-6 text-xs text-gray-400">
          If you believe this is an error, please contact support.
        </p>
      </div>
    </div>
  );
}

export default NotFoundPage;