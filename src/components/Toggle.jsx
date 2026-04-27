/**
 * Accessible toggle switch component using @headlessui/react Switch.
 * Renders a labeled toggle with proper ARIA attributes and keyboard support.
 * Styled with Tailwind for on/off states with smooth transition.
 * @module components/Toggle
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Switch } from '@headlessui/react';

/**
 * Toggle component for rendering an accessible on/off switch.
 * @param {object} props - Component props
 * @param {boolean} props.enabled - Whether the toggle is currently on
 * @param {function} props.onChange - Callback invoked with the new boolean value when toggled
 * @param {string} props.label - Accessible label text displayed next to the toggle
 * @param {string} [props.description] - Optional description text displayed below the label
 * @param {boolean} [props.disabled=false] - Whether the toggle is disabled
 * @param {string} [props.className] - Additional CSS classes to apply to the wrapper
 * @returns {React.ReactElement} The Toggle component
 */
function Toggle({ enabled, onChange, label, description, disabled, className }) {
  return (
    <Switch.Group>
      <div className={`flex items-center justify-between${className ? ` ${className}` : ''}`}>
        <div className="flex flex-col">
          <Switch.Label
            className="text-sm font-medium text-gray-900"
            passive
          >
            {label}
          </Switch.Label>
          {description && (
            <Switch.Description className="mt-0.5 text-xs text-gray-500">
              {description}
            </Switch.Description>
          )}
        </div>
        <Switch
          checked={enabled}
          onChange={onChange}
          disabled={disabled}
          className={`${
            enabled ? 'bg-primary-600' : 'bg-gray-200'
          } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
        >
          <span className="sr-only">{label}</span>
          <span
            aria-hidden="true"
            className={`${
              enabled ? 'translate-x-5' : 'translate-x-0'
            } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
          />
        </Switch>
      </div>
    </Switch.Group>
  );
}

Toggle.propTypes = {
  /** Whether the toggle is currently on */
  enabled: PropTypes.bool.isRequired,
  /** Callback invoked with the new boolean value when toggled */
  onChange: PropTypes.func.isRequired,
  /** Accessible label text displayed next to the toggle */
  label: PropTypes.string.isRequired,
  /** Optional description text displayed below the label */
  description: PropTypes.string,
  /** Whether the toggle is disabled */
  disabled: PropTypes.bool,
  /** Additional CSS classes to apply to the wrapper */
  className: PropTypes.string,
};

Toggle.defaultProps = {
  description: null,
  disabled: false,
  className: null,
};

export default Toggle;