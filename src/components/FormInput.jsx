/**
 * Reusable form input component with label, input field, and inline error message.
 * Supports text, email, password, tel, date, select, and number input types.
 * @module components/FormInput
 */

import React from 'react';
import PropTypes from 'prop-types';

/**
 * FormInput component for rendering labeled form fields with validation error display.
 * @param {object} props - Component props
 * @param {string} props.label - Label text displayed above the input
 * @param {string} props.name - Input name attribute, also used for id generation
 * @param {string | number} [props.value=''] - Current input value
 * @param {function} props.onChange - Change handler invoked with the input event
 * @param {string | null} [props.error=null] - Validation error message to display below the input
 * @param {string} [props.type='text'] - Input type: 'text', 'email', 'password', 'tel', 'date', 'select', or 'number'
 * @param {Array<{value: string, label: string}>} [props.options=[]] - Options array for select type inputs
 * @param {string} [props.placeholder=''] - Placeholder text for the input
 * @param {boolean} [props.disabled=false] - Whether the input is disabled
 * @param {boolean} [props.required=false] - Whether the input is required
 * @param {string} [props.className] - Additional CSS classes to apply to the wrapper
 * @returns {React.ReactElement} The FormInput component
 */
function FormInput({
  label,
  name,
  value,
  onChange,
  error,
  type,
  options,
  placeholder,
  disabled,
  required,
  className,
}) {
  const inputId = `form-input-${name}`;
  const errorId = `form-error-${name}`;

  const baseInputClasses =
    'block w-full rounded-md border px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500';

  const normalClasses =
    'border-gray-300 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-primary-500';

  const errorClasses =
    'border-danger-500 text-gray-900 placeholder-gray-400 focus:border-danger-500 focus:ring-danger-500';

  const inputClasses = `${baseInputClasses} ${error ? errorClasses : normalClasses}`;

  const renderInput = () => {
    if (type === 'select') {
      return (
        <select
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={inputClasses}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : undefined}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        id={inputId}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={inputClasses}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? errorId : undefined}
      />
    );
  };

  return (
    <div className={`flex flex-col gap-1${className ? ` ${className}` : ''}`}>
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && (
          <span className="ml-0.5 text-danger-500" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {renderInput()}
      {error && (
        <p id={errorId} className="mt-0.5 text-xs text-danger-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

FormInput.propTypes = {
  /** Label text displayed above the input */
  label: PropTypes.string.isRequired,
  /** Input name attribute, also used for id generation */
  name: PropTypes.string.isRequired,
  /** Current input value */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Change handler invoked with the input event */
  onChange: PropTypes.func.isRequired,
  /** Validation error message to display below the input */
  error: PropTypes.string,
  /** Input type */
  type: PropTypes.oneOf(['text', 'email', 'password', 'tel', 'date', 'select', 'number']),
  /** Options array for select type inputs */
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ),
  /** Placeholder text for the input */
  placeholder: PropTypes.string,
  /** Whether the input is disabled */
  disabled: PropTypes.bool,
  /** Whether the input is required */
  required: PropTypes.bool,
  /** Additional CSS classes to apply to the wrapper */
  className: PropTypes.string,
};

FormInput.defaultProps = {
  value: '',
  error: null,
  type: 'text',
  options: [],
  placeholder: '',
  disabled: false,
  required: false,
  className: null,
};

export default FormInput;