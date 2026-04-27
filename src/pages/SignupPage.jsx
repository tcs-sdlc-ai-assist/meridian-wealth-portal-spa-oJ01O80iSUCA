/**
 * Signup page component for new user registration.
 * Renders a form collecting first name, last name, email, phone, password,
 * confirm password, account type (Individual/Joint), and date of birth.
 * All fields validated using validators.js on blur and submit.
 * On valid submission, creates a new user and redirects to /login.
 * @module pages/SignupPage
 */

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSessionStore } from '../store/sessionStore.js';
import { useUserStore } from '../store/userStore.js';
import FormInput from '../components/FormInput.jsx';
import PasswordStrength from '../components/PasswordStrength.jsx';
import { showSuccessToast, showErrorToast } from '../components/Toast.jsx';
import { ROUTES, ACCOUNT_TYPES, COST_BASIS_METHODS } from '../utils/constants.js';
import {
  validateRequired,
  validateEmail,
  validatePhone,
  validatePassword,
  validateConfirmPassword,
  validateName,
  validateDateOfBirth,
} from '../utils/validators.js';

/**
 * Account type options for the select dropdown.
 * @type {Array<{value: string, label: string}>}
 */
const ACCOUNT_TYPE_OPTIONS = [
  { value: ACCOUNT_TYPES.INDIVIDUAL, label: 'Individual' },
  { value: ACCOUNT_TYPES.JOINT, label: 'Joint' },
];

/**
 * Generate a unique user ID.
 * @returns {string} A unique user ID string
 */
function generateUserId() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `usr_${timestamp}_${random}`;
}

/**
 * Generate a unique account ID.
 * @returns {string} A unique account ID string
 */
function generateAccountId() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `acct_${timestamp}_${random}`;
}

/**
 * Generate a random 10-digit account number.
 * @returns {string} A 10-digit account number string
 */
function generateAccountNumber() {
  let number = '';
  for (let i = 0; i < 10; i++) {
    number += Math.floor(Math.random() * 10).toString();
  }
  return number;
}

/**
 * SignupPage component for new user registration.
 * Renders a centered card layout with a registration form.
 * Validates all fields on blur and submit. On successful submission,
 * creates a new user via userStore.addUser and redirects to /login.
 * If already authenticated, redirects to /accounts.
 * @returns {React.ReactElement} The SignupPage component
 */
function SignupPage() {
  const navigate = useNavigate();
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);
  const addUser = useUserStore((state) => state.addUser);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    accountType: '',
    dateOfBirth: '',
  });

  const [errors, setErrors] = useState({
    firstName: null,
    lastName: null,
    email: null,
    phone: null,
    password: null,
    confirmPassword: null,
    accountType: null,
    dateOfBirth: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Redirect to accounts page if already authenticated.
   */
  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.ACCOUNTS, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  /**
   * Validate a single field by name.
   * @param {string} name - The field name to validate
   * @param {string} value - The field value to validate
   * @returns {string | null} Error message or null if valid
   */
  const validateField = useCallback(
    (name, value) => {
      switch (name) {
        case 'firstName':
          return validateName(value, 'First name');
        case 'lastName':
          return validateName(value, 'Last name');
        case 'email':
          return validateEmail(value);
        case 'phone':
          return validatePhone(value);
        case 'password':
          return validatePassword(value);
        case 'confirmPassword':
          return validateConfirmPassword(value, formData.password);
        case 'accountType':
          return validateRequired(value, 'Account type');
        case 'dateOfBirth':
          return validateDateOfBirth(value);
        default:
          return null;
      }
    },
    [formData.password],
  );

  /**
   * Handle input change events.
   * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement>} event
   */
  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error on change
    setErrors((prev) => ({ ...prev, [name]: null }));
  }, []);

  /**
   * Handle input blur events for field-level validation.
   * @param {React.FocusEvent<HTMLInputElement | HTMLSelectElement>} event
   */
  const handleBlur = useCallback(
    (event) => {
      const { name, value } = event.target;
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    },
    [validateField],
  );

  /**
   * Validate all form fields.
   * @returns {boolean} True if all fields are valid
   */
  const validateAllFields = useCallback(() => {
    const newErrors = {
      firstName: validateField('firstName', formData.firstName),
      lastName: validateField('lastName', formData.lastName),
      email: validateField('email', formData.email),
      phone: validateField('phone', formData.phone),
      password: validateField('password', formData.password),
      confirmPassword: validateField('confirmPassword', formData.confirmPassword),
      accountType: validateField('accountType', formData.accountType),
      dateOfBirth: validateField('dateOfBirth', formData.dateOfBirth),
    };

    setErrors(newErrors);

    return Object.values(newErrors).every((error) => error === null);
  }, [formData, validateField]);

  /**
   * Handle form submission.
   * @param {React.FormEvent} event
   */
  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();

      if (isSubmitting) {
        return;
      }

      const isValid = validateAllFields();

      if (!isValid) {
        return;
      }

      setIsSubmitting(true);

      try {
        const userId = generateUserId();
        const accountId = generateAccountId();
        const accountNumber = generateAccountNumber();
        const now = new Date().toISOString();

        const newUser = {
          id: userId,
          email: formData.email.trim(),
          password: formData.password,
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          phone: formData.phone.replace(/\D/g, ''),
          dateOfBirth: formData.dateOfBirth,
          address: {
            street: '',
            city: '',
            state: '',
            zip: '',
            country: 'US',
          },
          employment: {
            status: '',
            employer: '',
            occupation: '',
            yearsEmployed: 0,
          },
          taxStatus: 'US Citizen',
          taxFilingStatus: 'Single',
          incomeRange: '',
          lastLogin: null,
          accounts: [
            {
              accountId,
              accountNumber,
              type: formData.accountType,
              openedDate: now.split('T')[0],
              status: 'active',
              riskProfile: 'Moderate',
              costBasisMethod: COST_BASIS_METHODS[0],
            },
          ],
          preferences: {
            theme: 'light',
            emailNotifications: true,
            smsNotifications: false,
            pushNotifications: false,
            language: 'en',
            currency: 'USD',
          },
          security: {
            twoFactorEnabled: false,
            twoFactorMethod: 'none',
            lastPasswordChange: now,
            trustedDevices: [],
          },
        };

        const success = addUser(newUser);

        if (success) {
          showSuccessToast('Account created successfully! Please sign in.');
          navigate(ROUTES.LOGIN, { replace: true });
        } else {
          showErrorToast('An account with this email already exists. Please use a different email.');
        }
      } catch (error) {
        showErrorToast('Failed to create account. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, isSubmitting, validateAllFields, addUser, navigate],
  );

  // Don't render signup page if already authenticated (will redirect)
  if (isAuthenticated) {
    return null;
  }

  const appName = import.meta.env.VITE_APP_NAME || 'Meridian Wealth Portal';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg">
        {/* Logo and Heading */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <svg
              className="h-12 w-12 text-primary-600"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Create Your Account
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Join {appName} to start managing your investments
          </p>
        </div>

        {/* Signup Form Card */}
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-8 shadow-sm sm:px-8">
          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-4">
              {/* Name Row */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormInput
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.firstName}
                  placeholder="Jane"
                  required
                />
                <FormInput
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.lastName}
                  placeholder="Doe"
                  required
                />
              </div>

              {/* Email */}
              <FormInput
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.email}
                placeholder="jane.doe@example.com"
                required
              />

              {/* Phone */}
              <FormInput
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.phone}
                placeholder="(555) 123-4567"
                required
              />

              {/* Password */}
              <div>
                <FormInput
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.password}
                  placeholder="Create a strong password"
                  required
                />
                <PasswordStrength password={formData.password} className="mt-2" />
              </div>

              {/* Confirm Password */}
              <FormInput
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.confirmPassword}
                placeholder="Re-enter your password"
                required
              />

              {/* Account Type and DOB Row */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormInput
                  label="Account Type"
                  name="accountType"
                  type="select"
                  value={formData.accountType}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.accountType}
                  options={ACCOUNT_TYPE_OPTIONS}
                  placeholder="Select account type"
                  required
                />
                <FormInput
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.dateOfBirth}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center rounded-md bg-primary-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="mr-2 h-4 w-4 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Back to Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to={ROUTES.LOGIN}
              className="font-medium text-primary-600 transition-colors hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md"
            >
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;