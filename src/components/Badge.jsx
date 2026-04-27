/**
 * Reusable badge/pill component for displaying status labels.
 * Renders a small colored pill with text based on the variant prop.
 * @module components/Badge
 */

import React from 'react';
import PropTypes from 'prop-types';

/**
 * Variant-to-Tailwind class mapping.
 * @type {Record<string, string>}
 */
const VARIANT_CLASSES = {
  success: 'bg-success-100 text-success-800 ring-success-200',
  pending: 'bg-warning-100 text-warning-800 ring-warning-200',
  failed: 'bg-danger-100 text-danger-800 ring-danger-200',
  error: 'bg-danger-100 text-danger-800 ring-danger-200',
  info: 'bg-primary-100 text-primary-800 ring-primary-200',
  neutral: 'bg-gray-100 text-gray-800 ring-gray-200',
};

/**
 * Map common status/type labels to badge variants.
 * @type {Record<string, string>}
 */
const LABEL_VARIANT_MAP = {
  verified: 'success',
  completed: 'success',
  active: 'success',
  primary: 'info',
  pending: 'pending',
  processing: 'pending',
  failed: 'failed',
  rejected: 'failed',
  cancelled: 'failed',
  contingent: 'neutral',
  inactive: 'neutral',
};

/**
 * Badge component for displaying status labels as colored pills.
 * @param {object} props - Component props
 * @param {string} props.label - Text to display inside the badge
 * @param {string} [props.variant] - Color variant: 'success', 'pending', 'failed', 'error', 'info', or 'neutral'.
 *   If not provided, the component will attempt to auto-detect the variant from the label text.
 * @param {string} [props.size='sm'] - Size of the badge: 'xs', 'sm', or 'md'
 * @param {string} [props.className] - Additional CSS classes to apply
 * @returns {React.ReactElement} The Badge component
 */
function Badge({ label, variant, size, className }) {
  const resolvedVariant = variant || LABEL_VARIANT_MAP[String(label).toLowerCase()] || 'neutral';
  const colorClasses = VARIANT_CLASSES[resolvedVariant] || VARIANT_CLASSES.neutral;

  let sizeClasses = 'px-2.5 py-0.5 text-xs';
  if (size === 'xs') {
    sizeClasses = 'px-2 py-0.5 text-[10px]';
  } else if (size === 'md') {
    sizeClasses = 'px-3 py-1 text-sm';
  }

  const baseClasses = 'inline-flex items-center rounded-full font-medium ring-1 ring-inset';

  return (
    <span
      className={`${baseClasses} ${sizeClasses} ${colorClasses}${className ? ` ${className}` : ''}`}
    >
      {label}
    </span>
  );
}

Badge.propTypes = {
  /** Text to display inside the badge */
  label: PropTypes.string.isRequired,
  /** Color variant for the badge */
  variant: PropTypes.oneOf(['success', 'pending', 'failed', 'error', 'info', 'neutral']),
  /** Size of the badge */
  size: PropTypes.oneOf(['xs', 'sm', 'md']),
  /** Additional CSS classes to apply */
  className: PropTypes.string,
};

Badge.defaultProps = {
  variant: null,
  size: 'sm',
  className: null,
};

export default Badge;