/**
 * Password strength indicator component.
 * Accepts a password string prop and displays a visual strength bar
 * with color coding (red/orange/yellow/green) and text label.
 * Evaluates based on length, uppercase, lowercase, numbers, and special characters.
 * @module components/PasswordStrength
 */

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

/**
 * Strength level configuration.
 * @type {Array<{label: string, color: string, bgColor: string, textColor: string}>}
 */
const STRENGTH_LEVELS = [
  { label: 'Weak', color: 'bg-danger-500', bgColor: 'bg-danger-100', textColor: 'text-danger-700' },
  { label: 'Fair', color: 'bg-warning-500', bgColor: 'bg-warning-100', textColor: 'text-warning-700' },
  { label: 'Good', color: 'bg-yellow-400', bgColor: 'bg-yellow-100', textColor: 'text-yellow-700' },
  { label: 'Strong', color: 'bg-success-500', bgColor: 'bg-success-100', textColor: 'text-success-700' },
];

/**
 * Evaluate the strength of a password.
 * Returns a score from 0 to 4 based on:
 * - Length >= 8
 * - Contains uppercase letter
 * - Contains lowercase letter
 * - Contains number
 * - Contains special character
 * @param {string} password - The password to evaluate
 * @returns {number} Strength score from 0 to 4
 */
function evaluateStrength(password) {
  if (!password || typeof password !== 'string' || password.length === 0) {
    return 0;
  }

  let score = 0;

  if (password.length >= 8) {
    score += 1;
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  }

  if (/[a-z]/.test(password)) {
    score += 1;
  }

  if (/[0-9]/.test(password)) {
    score += 1;
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    score += 1;
  }

  // Map 0-5 score to 0-4 strength level
  if (score <= 1) {
    return 0; // Weak
  }
  if (score === 2) {
    return 1; // Fair
  }
  if (score === 3) {
    return 2; // Good
  }
  return 3; // Strong (4-5)
}

/**
 * PasswordStrength component for displaying a visual password strength meter.
 * @param {object} props - Component props
 * @param {string} props.password - The password string to evaluate
 * @param {string} [props.className] - Additional CSS classes to apply to the wrapper
 * @returns {React.ReactElement} The PasswordStrength component
 */
function PasswordStrength({ password, className }) {
  const strengthIndex = useMemo(() => evaluateStrength(password), [password]);

  const hasPassword = password && typeof password === 'string' && password.length > 0;

  if (!hasPassword) {
    return null;
  }

  const strength = STRENGTH_LEVELS[strengthIndex];
  const totalSegments = STRENGTH_LEVELS.length;
  const filledSegments = strengthIndex + 1;

  return (
    <div className={`flex flex-col gap-1.5${className ? ` ${className}` : ''}`}>
      {/* Strength bar */}
      <div className="flex gap-1">
        {STRENGTH_LEVELS.map((level, index) => (
          <div
            key={level.label}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
              index < filledSegments ? strength.color : 'bg-gray-200'
            }`}
            aria-hidden="true"
          />
        ))}
      </div>

      {/* Strength label */}
      <p
        className={`text-xs font-medium ${strength.textColor}`}
        role="status"
        aria-live="polite"
      >
        Password strength: {strength.label}
      </p>
    </div>
  );
}

PasswordStrength.propTypes = {
  /** The password string to evaluate */
  password: PropTypes.string,
  /** Additional CSS classes to apply to the wrapper */
  className: PropTypes.string,
};

PasswordStrength.defaultProps = {
  password: '',
  className: null,
};

export default PasswordStrength;