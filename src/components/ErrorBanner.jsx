/**
 * Global error banner component for storage failures and browser compatibility issues.
 * Displays a persistent banner at the top of the page with a warning icon,
 * error message, and action buttons (Refresh, Reset Data).
 * Reads error state from sessionStore.
 * Styled with Tailwind in amber/red colors.
 * @module components/ErrorBanner
 */

import React, { useCallback } from 'react';
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useSessionStore } from '../store/sessionStore.js';
import { clear } from '../utils/storageUtils.js';

/**
 * ErrorBanner component for displaying persistent error messages at the top of the page.
 * Renders only when there is an active error banner message in the session store.
 * Provides Refresh and Reset Data action buttons for error recovery.
 * @returns {React.ReactElement | null} The ErrorBanner component, or null if no error
 */
function ErrorBanner() {
  const errorBanner = useSessionStore((state) => state.errorBanner);
  const clearErrorBanner = useSessionStore((state) => state.clearErrorBanner);

  /**
   * Handle the Refresh button click.
   * Reloads the current page to attempt recovery.
   */
  const handleRefresh = useCallback(() => {
    window.location.reload();
  }, []);

  /**
   * Handle the Reset Data button click.
   * Clears all storage data and reloads the page to re-seed fresh data.
   */
  const handleResetData = useCallback(() => {
    clear();
    window.location.reload();
  }, []);

  /**
   * Handle the dismiss button click.
   * Clears the error banner from the session store.
   */
  const handleDismiss = useCallback(() => {
    clearErrorBanner();
  }, [clearErrorBanner]);

  if (!errorBanner) {
    return null;
  }

  return (
    <div
      className="relative w-full bg-danger-50 border-b border-danger-200"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          {/* Icon and message */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon
                className="h-5 w-5 text-danger-600"
                aria-hidden="true"
              />
            </div>
            <p className="text-sm font-medium text-danger-800 truncate">
              {errorBanner}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={handleRefresh}
              className="inline-flex items-center rounded-md bg-danger-100 px-3 py-1.5 text-xs font-medium text-danger-800 transition-colors hover:bg-danger-200 focus:outline-none focus:ring-2 focus:ring-danger-500 focus:ring-offset-2"
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={handleResetData}
              className="inline-flex items-center rounded-md bg-danger-100 px-3 py-1.5 text-xs font-medium text-danger-800 transition-colors hover:bg-danger-200 focus:outline-none focus:ring-2 focus:ring-danger-500 focus:ring-offset-2"
            >
              Reset Data
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              className="rounded-md p-1 text-danger-500 transition-colors hover:bg-danger-100 hover:text-danger-700 focus:outline-none focus:ring-2 focus:ring-danger-500 focus:ring-offset-2"
              aria-label="Dismiss error banner"
            >
              <XMarkIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ErrorBanner;