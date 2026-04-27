/**
 * Reusable empty state display component.
 * Renders a centered layout with an icon, title, description message,
 * and an optional call-to-action button when no data is available.
 * @module components/EmptyState
 */

import React from 'react';
import PropTypes from 'prop-types';

/**
 * EmptyState component for displaying a placeholder when no data is available.
 * @param {object} props - Component props
 * @param {React.ReactNode} [props.icon] - Icon element to display above the title
 * @param {string} props.title - Title text to display
 * @param {string} [props.message] - Description message to display below the title
 * @param {string} [props.actionLabel] - Label for the optional CTA button
 * @param {function} [props.onAction] - Callback invoked when the CTA button is clicked
 * @returns {React.ReactElement} The EmptyState component
 */
function EmptyState({ icon, title, message, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && (
        <div className="mb-4 text-gray-400">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900">
        {title}
      </h3>
      {message && (
        <p className="mt-2 max-w-md text-sm text-gray-500">
          {message}
        </p>
      )}
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

EmptyState.propTypes = {
  /** Icon element to display above the title */
  icon: PropTypes.node,
  /** Title text to display */
  title: PropTypes.string.isRequired,
  /** Description message to display below the title */
  message: PropTypes.string,
  /** Label for the optional CTA button */
  actionLabel: PropTypes.string,
  /** Callback invoked when the CTA button is clicked */
  onAction: PropTypes.func,
};

EmptyState.defaultProps = {
  icon: null,
  message: null,
  actionLabel: null,
  onAction: null,
};

export default EmptyState;