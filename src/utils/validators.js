/**
 * Form field validation utilities.
 * Each validator returns an error message string or null if valid.
 * @module validators
 */

/**
 * Validate that a field is not empty.
 * @param {string} value - The field value to validate
 * @param {string} [fieldName='This field'] - Human-readable field name for the error message
 * @returns {string | null} Error message or null if valid
 */
export function validateRequired(value, fieldName = 'This field') {
  if (value === null || value === undefined || String(value).trim() === '') {
    return `${fieldName} is required`;
  }
  return null;
}

/**
 * Validate an email address format.
 * @param {string} email - The email address to validate
 * @returns {string | null} Error message or null if valid
 */
export function validateEmail(email) {
  const requiredError = validateRequired(email, 'Email');
  if (requiredError) {
    return requiredError;
  }

  const trimmed = String(email).trim();
  // Standard email regex covering most valid addresses
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(trimmed)) {
    return 'Please enter a valid email address';
  }

  return null;
}

/**
 * Validate a phone number format.
 * Accepts digits, spaces, dashes, parentheses, and an optional leading +.
 * Must contain at least 10 digits.
 * @param {string} phone - The phone number to validate
 * @returns {string | null} Error message or null if valid
 */
export function validatePhone(phone) {
  const requiredError = validateRequired(phone, 'Phone number');
  if (requiredError) {
    return requiredError;
  }

  const trimmed = String(phone).trim();
  const phoneFormatRegex = /^[+]?[\d\s()-]+$/;

  if (!phoneFormatRegex.test(trimmed)) {
    return 'Please enter a valid phone number';
  }

  const digitsOnly = trimmed.replace(/\D/g, '');
  if (digitsOnly.length < 10) {
    return 'Phone number must contain at least 10 digits';
  }

  return null;
}

/**
 * Validate a password meets strength requirements.
 * Requirements: minimum 8 characters, at least one uppercase letter,
 * one lowercase letter, one number, and one special character.
 * @param {string} password - The password to validate
 * @returns {string | null} Error message or null if valid
 */
export function validatePassword(password) {
  const requiredError = validateRequired(password, 'Password');
  if (requiredError) {
    return requiredError;
  }

  const value = String(password);

  if (value.length < 8) {
    return 'Password must be at least 8 characters long';
  }

  if (!/[A-Z]/.test(value)) {
    return 'Password must contain at least one uppercase letter';
  }

  if (!/[a-z]/.test(value)) {
    return 'Password must contain at least one lowercase letter';
  }

  if (!/[0-9]/.test(value)) {
    return 'Password must contain at least one number';
  }

  if (!/[^A-Za-z0-9]/.test(value)) {
    return 'Password must contain at least one special character';
  }

  return null;
}

/**
 * Validate that a confirmation password matches the original password.
 * @param {string} confirmPassword - The confirmation password value
 * @param {string} password - The original password to match against
 * @returns {string | null} Error message or null if valid
 */
export function validateConfirmPassword(confirmPassword, password) {
  const requiredError = validateRequired(confirmPassword, 'Confirm password');
  if (requiredError) {
    return requiredError;
  }

  if (String(confirmPassword) !== String(password)) {
    return 'Passwords do not match';
  }

  return null;
}

/**
 * Validate a name field (first name, last name, etc.).
 * Must be at least 2 characters and contain only letters, spaces, hyphens, and apostrophes.
 * @param {string} name - The name to validate
 * @param {string} [fieldName='Name'] - Human-readable field name for the error message
 * @returns {string | null} Error message or null if valid
 */
export function validateName(name, fieldName = 'Name') {
  const requiredError = validateRequired(name, fieldName);
  if (requiredError) {
    return requiredError;
  }

  const trimmed = String(name).trim();

  if (trimmed.length < 2) {
    return `${fieldName} must be at least 2 characters long`;
  }

  const nameRegex = /^[a-zA-Z\s'-]+$/;
  if (!nameRegex.test(trimmed)) {
    return `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`;
  }

  return null;
}

/**
 * Validate a date of birth ensuring the user is at least 18 years old.
 * @param {string} dateOfBirth - The date of birth string (expected format: YYYY-MM-DD or any Date-parseable string)
 * @returns {string | null} Error message or null if valid
 */
export function validateDateOfBirth(dateOfBirth) {
  const requiredError = validateRequired(dateOfBirth, 'Date of birth');
  if (requiredError) {
    return requiredError;
  }

  const trimmed = String(dateOfBirth).trim();
  const dob = new Date(trimmed);

  if (isNaN(dob.getTime())) {
    return 'Please enter a valid date of birth';
  }

  const today = new Date();
  const eighteenYearsAgo = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate(),
  );

  if (dob > eighteenYearsAgo) {
    return 'You must be at least 18 years old';
  }

  if (dob > today) {
    return 'Date of birth cannot be in the future';
  }

  return null;
}