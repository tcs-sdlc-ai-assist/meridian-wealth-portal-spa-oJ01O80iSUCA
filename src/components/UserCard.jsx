/**
 * Clickable user card component for the login page.
 * Displays user avatar (initials-based), full name, account type badge,
 * and last login timestamp. Styled with Tailwind as a clickable card
 * with hover/focus states and proper ARIA button role.
 * @module components/UserCard
 */

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Badge from './Badge.jsx';
import { formatDateTime } from '../utils/formatters.js';

/**
 * Color palette for avatar backgrounds based on user index or name hash.
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
    hash = hash & hash; // Convert to 32-bit integer
  }

  return Math.abs(hash) % AVATAR_COLORS.length;
}

/**
 * Get the primary account type label from a user's accounts array.
 * @param {Array<{type: string}>} accounts - The user's accounts
 * @returns {string} The primary account type label, or 'Individual' as default
 */
function getPrimaryAccountType(accounts) {
  if (!accounts || !Array.isArray(accounts) || accounts.length === 0) {
    return 'Individual';
  }

  return accounts[0].type || 'Individual';
}

/**
 * UserCard component for displaying a clickable user card on the login page.
 * @param {object} props - Component props
 * @param {object} props.user - The user object to display
 * @param {string} props.user.id - Unique user identifier
 * @param {string} props.user.firstName - User's first name
 * @param {string} props.user.lastName - User's last name
 * @param {string} [props.user.email] - User's email address
 * @param {string} [props.user.lastLogin] - ISO 8601 date string of last login
 * @param {Array<{type: string}>} [props.user.accounts] - User's accounts array
 * @param {function} props.onClick - Callback invoked with the user object when the card is clicked
 * @param {string} [props.className] - Additional CSS classes to apply to the card
 * @returns {React.ReactElement} The UserCard component
 */
function UserCard({ user, onClick, className }) {
  const initials = useMemo(
    () => getInitials(user.firstName, user.lastName),
    [user.firstName, user.lastName],
  );

  const avatarColorClass = useMemo(
    () => AVATAR_COLORS[getColorIndex(user.id || user.email || '')],
    [user.id, user.email],
  );

  const primaryAccountType = useMemo(
    () => getPrimaryAccountType(user.accounts),
    [user.accounts],
  );

  const lastLoginFormatted = useMemo(() => {
    if (!user.lastLogin) {
      return null;
    }
    return formatDateTime(user.lastLogin);
  }, [user.lastLogin]);

  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();

  /**
   * Handle card click.
   */
  const handleClick = () => {
    if (typeof onClick === 'function') {
      onClick(user);
    }
  };

  /**
   * Handle keyboard activation.
   * @param {React.KeyboardEvent} event
   */
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={`Sign in as ${fullName}`}
      className={`group flex items-center gap-4 rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm transition-all duration-200 cursor-pointer hover:border-primary-300 hover:shadow-md hover:bg-primary-50/30 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2${className ? ` ${className}` : ''}`}
    >
      {/* Avatar */}
      <div
        className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-lg font-semibold text-white ${avatarColorClass}`}
        aria-hidden="true"
      >
        {initials}
      </div>

      {/* User Info */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-semibold text-gray-900 group-hover:text-primary-700">
            {fullName}
          </span>
          <Badge label={primaryAccountType} variant="info" size="xs" />
        </div>
        {user.email && (
          <span className="mt-0.5 truncate text-xs text-gray-500">
            {user.email}
          </span>
        )}
        {lastLoginFormatted && (
          <span className="mt-1 text-xs text-gray-400">
            Last login: {lastLoginFormatted}
          </span>
        )}
      </div>

      {/* Arrow indicator */}
      <div className="flex-shrink-0 text-gray-300 transition-colors group-hover:text-primary-500" aria-hidden="true">
        <svg
          className="h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
}

UserCard.propTypes = {
  /** The user object to display */
  user: PropTypes.shape({
    /** Unique user identifier */
    id: PropTypes.string.isRequired,
    /** User's first name */
    firstName: PropTypes.string.isRequired,
    /** User's last name */
    lastName: PropTypes.string.isRequired,
    /** User's email address */
    email: PropTypes.string,
    /** ISO 8601 date string of last login */
    lastLogin: PropTypes.string,
    /** User's accounts array */
    accounts: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string,
      }),
    ),
  }).isRequired,
  /** Callback invoked with the user object when the card is clicked */
  onClick: PropTypes.func.isRequired,
  /** Additional CSS classes to apply to the card */
  className: PropTypes.string,
};

UserCard.defaultProps = {
  className: null,
};

export default UserCard;