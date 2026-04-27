/**
 * Authenticated layout wrapper component.
 * Renders Navbar at the top, ErrorBanner (conditionally), main content area
 * (Outlet from React Router), and Toaster. Provides consistent page structure
 * with proper padding and max-width constraints for all authenticated pages.
 * @module components/Layout
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import ErrorBanner from './ErrorBanner.jsx';
import { Toaster } from './Toast.jsx';

/**
 * Layout component for authenticated pages.
 * Renders the navigation bar, error banner (when active), main content area
 * via React Router's Outlet, and the toast notification container.
 * Applies consistent padding and max-width constraints to the content area.
 * @returns {React.ReactElement} The Layout component
 */
function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed top navigation */}
      <Navbar />

      {/* Error banner (renders conditionally based on session store state) */}
      <div className="fixed top-16 left-0 right-0 z-30">
        <ErrorBanner />
      </div>

      {/* Main content area with top padding to account for fixed navbar */}
      <main className="pt-16">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>

      {/* Toast notification container */}
      <Toaster />
    </div>
  );
}

export default Layout;