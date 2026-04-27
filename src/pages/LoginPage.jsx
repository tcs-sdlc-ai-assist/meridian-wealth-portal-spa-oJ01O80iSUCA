/**
 * Login page component with pre-seeded user card selection.
 * Displays application logo, welcome heading, and a responsive grid of
 * UserCard components for all pre-seeded users. Clicking a card logs in
 * the user and navigates to /accounts. Includes a link to the signup page.
 * If already authenticated, redirects to /accounts.
 * @module pages/LoginPage
 */

import React, { useEffect, useMemo, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSessionStore } from '../store/sessionStore.js';
import { useUserStore } from '../store/userStore.js';
import UserCard from '../components/UserCard.jsx';
import { showErrorToast } from '../components/Toast.jsx';
import { ROUTES } from '../utils/constants.js';

/**
 * LoginPage component for user authentication via pre-seeded user cards.
 * Renders a centered layout with the application logo, welcome heading,
 * a responsive grid of clickable UserCard components, and a link to signup.
 * Redirects to /accounts if the user is already authenticated.
 * @returns {React.ReactElement} The LoginPage component
 */
function LoginPage() {
  const navigate = useNavigate();
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);
  const login = useSessionStore((state) => state.login);
  const getUsers = useUserStore((state) => state.getUsers);

  const users = useMemo(() => {
    return getUsers();
  }, [getUsers]);

  /**
   * Redirect to accounts page if already authenticated.
   */
  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.ACCOUNTS, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  /**
   * Handle user card click to log in.
   * @param {object} user - The selected user object
   */
  const handleUserClick = useCallback(
    (user) => {
      if (!user || !user.id) {
        showErrorToast('Invalid user selection. Please try again.');
        return;
      }

      const success = login(user.id);

      if (success) {
        navigate(ROUTES.ACCOUNTS, { replace: true });
      } else {
        showErrorToast('Login failed. Please try again.');
      }
    },
    [login, navigate],
  );

  // Don't render login page if already authenticated (will redirect)
  if (isAuthenticated) {
    return null;
  }

  const appName = import.meta.env.VITE_APP_NAME || 'Meridian Wealth Portal';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl">
        {/* Logo and Heading */}
        <div className="mb-10 text-center">
          <div className="mb-4 flex justify-center">
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
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Welcome to {appName}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Select a user to sign in to your account
          </p>
        </div>

        {/* User Cards Grid */}
        <div className="space-y-3">
          {users && users.length > 0 ? (
            users.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onClick={handleUserClick}
              />
            ))
          ) : (
            <div className="rounded-lg border border-gray-200 bg-white px-6 py-8 text-center">
              <p className="text-sm text-gray-500">
                No users available. Please reset the application data.
              </p>
            </div>
          )}
        </div>

        {/* Create Account Link */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link
              to={ROUTES.REGISTER}
              className="font-medium text-primary-600 transition-colors hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;