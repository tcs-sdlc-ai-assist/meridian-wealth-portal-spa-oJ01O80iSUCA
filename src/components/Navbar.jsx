/**
 * Main navigation bar component with responsive hamburger menu.
 * Fixed top navigation displaying app logo, primary navigation links,
 * and ProfileDropdown. Collapses to hamburger menu on mobile (<768px).
 * Implements ARIA navigation landmark and keyboard accessibility.
 * Styled with Tailwind.
 * @module components/Navbar
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import ProfileDropdown from './ProfileDropdown.jsx';
import { useSessionStore } from '../store/sessionStore.js';
import { ROUTES } from '../utils/constants.js';

/**
 * Primary navigation links configuration.
 * @type {Array<{label: string, to: string}>}
 */
const NAV_LINKS = [
  { label: 'Accounts', to: ROUTES.ACCOUNTS },
  { label: 'Holdings', to: ROUTES.PORTFOLIO },
  { label: 'Activity', to: ROUTES.TRANSACTIONS },
  { label: 'Documents', to: ROUTES.DOCUMENTS },
  { label: 'Products & Services', to: '/products' },
];

/**
 * Navbar component for rendering the main application navigation bar.
 * Displays logo, primary navigation links, and profile dropdown.
 * On mobile screens (<768px), navigation links collapse into a hamburger menu.
 * @returns {React.ReactElement | null} The Navbar component, or null if not authenticated
 */
function Navbar() {
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const mobileMenuRef = useRef(null);
  const hamburgerButtonRef = useRef(null);

  /**
   * Close mobile menu when route changes.
   */
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  /**
   * Close mobile menu when clicking outside.
   */
  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    function handleClickOutside(event) {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        hamburgerButtonRef.current &&
        !hamburgerButtonRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  /**
   * Close mobile menu on Escape key.
   */
  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    function handleEscape(event) {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
        if (hamburgerButtonRef.current) {
          hamburgerButtonRef.current.focus();
        }
      }
    }

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [mobileMenuOpen]);

  /**
   * Toggle the mobile menu open/closed state.
   */
  const handleToggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  /**
   * Determine if a given path is currently active.
   * @param {string} to - The route path to check
   * @returns {boolean} True if the path matches the current location
   */
  const isActiveRoute = useCallback(
    (to) => {
      if (to === ROUTES.ACCOUNTS) {
        return location.pathname === ROUTES.ACCOUNTS || location.pathname.startsWith('/accounts/');
      }
      return location.pathname === to || location.pathname.startsWith(to + '/');
    },
    [location.pathname],
  );

  if (!isAuthenticated) {
    return null;
  }

  const appName = import.meta.env.VITE_APP_NAME || 'Meridian Wealth Portal';

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40 border-b border-gray-200 bg-white shadow-sm"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / App Name */}
          <div className="flex flex-shrink-0 items-center">
            <NavLink
              to={ROUTES.DASHBOARD}
              className="flex items-center gap-2 text-lg font-bold text-primary-700 transition-colors hover:text-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md"
              aria-label={`${appName} - Go to dashboard`}
            >
              <svg
                className="h-7 w-7 text-primary-600"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="hidden sm:inline">{appName}</span>
              <span className="sm:hidden">Meridian</span>
            </NavLink>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex md:items-center md:gap-1">
            {NAV_LINKS.map((link) => {
              const active = isActiveRoute(link.to);
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={`relative px-3 py-2 text-sm font-medium transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                    active
                      ? 'text-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  {link.label}
                  {active && (
                    <span
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-full"
                      aria-hidden="true"
                    />
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Right side: Profile Dropdown + Hamburger */}
          <div className="flex items-center gap-3">
            <ProfileDropdown />

            {/* Hamburger Menu Button (mobile only) */}
            <button
              ref={hamburgerButtonRef}
              type="button"
              onClick={handleToggleMobileMenu}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 md:hidden"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-menu"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              <span className="relative h-6 w-6">
                <Bars3Icon
                  className={`absolute inset-0 h-6 w-6 transition-all duration-200 ${
                    mobileMenuOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'
                  }`}
                  aria-hidden="true"
                />
                <XMarkIcon
                  className={`absolute inset-0 h-6 w-6 transition-all duration-200 ${
                    mobileMenuOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'
                  }`}
                  aria-hidden="true"
                />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        id="mobile-navigation-menu"
        ref={mobileMenuRef}
        className={`border-t border-gray-200 bg-white md:hidden transition-all duration-200 ease-in-out overflow-hidden ${
          mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
        role="menu"
        aria-label="Mobile navigation"
      >
        <div className="space-y-1 px-4 py-3">
          {NAV_LINKS.map((link) => {
            const active = isActiveRoute(link.to);
            return (
              <NavLink
                key={link.to}
                to={link.to}
                role="menuitem"
                tabIndex={mobileMenuOpen ? 0 : -1}
                className={`block rounded-md px-3 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  active
                    ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                {link.label}
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;