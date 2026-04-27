/**
 * Toast notification provider and helper functions.
 * Wraps react-hot-toast with pre-configured styling and position.
 * @module components/Toast
 */

import React from 'react';
import toast, { Toaster as HotToaster } from 'react-hot-toast';

/**
 * Pre-configured Toaster provider component.
 * Renders the react-hot-toast container with position top-right,
 * 3000ms duration, and Tailwind-styled variants.
 * @returns {React.ReactElement} The Toaster provider element
 */
export function Toaster() {
  return (
    <HotToaster
      position="top-right"
      gutter={8}
      toastOptions={{
        duration: 3000,
        style: {
          padding: '12px 16px',
          borderRadius: '8px',
          fontSize: '14px',
          maxWidth: '420px',
        },
        success: {
          style: {
            background: '#f0fdf4',
            color: '#166534',
            border: '1px solid #bbf7d0',
          },
          iconTheme: {
            primary: '#22c55e',
            secondary: '#f0fdf4',
          },
        },
        error: {
          style: {
            background: '#fef2f2',
            color: '#991b1b',
            border: '1px solid #fecaca',
          },
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fef2f2',
          },
        },
      }}
    />
  );
}

/**
 * Show a success toast notification.
 * @param {string} message - The message to display
 * @param {object} [options={}] - Additional react-hot-toast options
 * @returns {string} The toast ID
 */
export function showSuccessToast(message, options = {}) {
  return toast.success(message, {
    ...options,
  });
}

/**
 * Show an error toast notification.
 * @param {string} message - The message to display
 * @param {object} [options={}] - Additional react-hot-toast options
 * @returns {string} The toast ID
 */
export function showErrorToast(message, options = {}) {
  return toast.error(message, {
    ...options,
  });
}

/**
 * Show an info toast notification.
 * Uses a custom styled toast with an info icon.
 * @param {string} message - The message to display
 * @param {object} [options={}] - Additional react-hot-toast options
 * @returns {string} The toast ID
 */
export function showInfoToast(message, options = {}) {
  return toast(message, {
    icon: 'ℹ️',
    style: {
      background: '#eff6ff',
      color: '#1e40af',
      border: '1px solid #bfdbfe',
    },
    ...options,
  });
}

/**
 * Convenience object grouping all toast helper functions.
 * @type {{ success: function, error: function, info: function }}
 */
export const showToast = {
  success: showSuccessToast,
  error: showErrorToast,
  info: showInfoToast,
};

export default Toaster;