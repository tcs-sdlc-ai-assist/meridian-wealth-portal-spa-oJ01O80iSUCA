/**
 * Accessible profile dropdown navigation menu using @headlessui/react Menu.
 * Renders a user avatar button that toggles a right-aligned dropdown with
 * navigation items and a logout action. Implements keyboard navigation,
 * ARIA menu roles, and closes on outside click.
 * Styled with Tailwind.
 * @module components/ProfileDropdown
 */

import React, { useMemo, Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { NavLink } from 'react-router-dom';
import {
  UserCircleIcon,
  BellIcon,
  ShieldCheckIcon,
  BuildingLibraryIcon,
  UsersIcon,
  CalculatorIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useSessionStore } from '../store/sessionStore.js';
import { ROUTES } from '../utils/constants.js';

/**
 * Color palette for avatar backgrounds based on user name hash.
 * @type {string[]}
 */
const AVATAR_COLORS = [
  'bg-primary-500',
  'bg-success-500',
  'bg-warning-500',
  'bg-danger-500',
  'bg-purple-500',
  'bg-cyan-500',
  'bg-pink-500',
  'bg-orange-500',
  'bg-teal-500',
  'bg-indigo-500',
];

/**
 * Generate initials from a first and last name.
 * @param {string} firstName - The user's first name
 * @param {string} lastName - The user's last name
 * @returns {string} Up to two uppercase initials
 */
function getInitials(firstName, lastName) {
  const first = firstName && typeof firstName === 'string' ? firstName.trim().charAt(0) : '';
  const last = lastName && typeof lastName === 'string' ? lastName.trim().charAt(0) : '';
  return `${first}${last}`.toUpperCase();
}

/**
 * Generate a deterministic color index from a string.
 * @param {string} str - The string to hash
 * @returns {number} An index into the AVATAR_COLORS array
 */
function getColorIndex(str) {
  if (!str || typeof str !== 'string') {
    return 0;
  }

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }

  return Math.abs(hash) % AVATAR_COLORS.length;
}

/**
 * Navigation menu items configuration.
 * @type {Array<{label: string, to: string, icon: React.ComponentType}>}
 */
const MENU_ITEMS = [
  { label: 'Profile', to: ROUTES.PROFILE, icon: UserCircleIcon },
  { label: 'Communication Preferences', to: ROUTES.NOTIFICATIONS, icon: BellIcon },
  { label: 'Security', to: ROUTES.SETTINGS, icon: ShieldCheckIcon },
  { label: 'Bank Management', to: '/bank-management', icon: BuildingLibraryIcon },
  { label: 'Beneficiaries', to: '/beneficiaries', icon: UsersIcon },
  { label: 'Cost Basis', to: ROUTES.TAX_CENTER, icon: CalculatorIcon },
];

/**
 * ProfileDropdown component for displaying an accessible profile menu.
 * Uses @headlessui/react Menu for built-in keyboard navigation,
 * ARIA roles, and outside click handling.
 * @returns {React.ReactElement | null} The ProfileDropdown component, or null if not authenticated
 */
function ProfileDropdown() {
  const currentUser = useSessionStore((state) => state.currentUser);
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);
  const logout = useSessionStore((state) => state.logout);

  const initials = useMemo(
    () => getInitials(currentUser?.firstName, currentUser?.lastName),
    [currentUser?.firstName, currentUser?.lastName],
  );

  const avatarColorClass = useMemo(
    () => AVATAR_COLORS[getColorIndex(currentUser?.id || currentUser?.email || '')],
    [currentUser?.id, currentUser?.email],
  );

  const fullName = useMemo(() => {
    if (!currentUser) {
      return '';
    }
    return `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim();
  }, [currentUser]);

  if (!isAuthenticated || !currentUser) {
    return null;
  }

  return (
    <Menu as="div" className="relative">
      {/* Avatar trigger button */}
      <Menu.Button
        className="flex items-center rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        aria-label="Open profile menu"
      >
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90 ${avatarColorClass}`}
          aria-hidden="true"
        >
          {initials}
        </div>
      </Menu.Button>

      {/* Dropdown panel */}
      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-150"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-50 mt-2 w-64 origin-top-right rounded-lg border border-gray-200 bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {/* User info header */}
          <div className="border-b border-gray-100 px-4 py-3">
            <p className="text-sm font-semibold text-gray-900 truncate">{fullName}</p>
            {currentUser.email && (
              <p className="mt-0.5 text-xs text-gray-500 truncate">{currentUser.email}</p>
            )}
          </div>

          {/* Navigation items */}
          <div className="py-1">
            {MENU_ITEMS.map((item) => (
              <Menu.Item key={item.to}>
                {({ active }) => (
                  <NavLink
                    to={item.to}
                    className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                      active
                        ? 'bg-gray-50 text-primary-700'
                        : 'text-gray-700'
                    }`}
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0 text-gray-400" aria-hidden="true" />
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                )}
              </Menu.Item>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100" />

          {/* Logout item */}
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  type="button"
                  onClick={logout}
                  className={`flex w-full items-center gap-3 px-4 py-2 text-sm transition-colors ${
                    active
                      ? 'bg-danger-50 text-danger-700'
                      : 'text-gray-700'
                  }`}
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4 flex-shrink-0 text-gray-400" aria-hidden="true" />
                  <span>Logout</span>
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

export default ProfileDropdown;