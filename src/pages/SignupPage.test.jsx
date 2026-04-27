/**
 * Integration tests for SignupPage component.
 * Tests rendering of form fields, validation, submission flow, navigation, and redirect behavior.
 * @module test/SignupPage
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

// Mock react-router-dom's useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock sessionStore
let mockIsAuthenticated = false;

vi.mock('../store/sessionStore.js', () => ({
  useSessionStore: vi.fn((selector) => {
    const state = {
      isAuthenticated: mockIsAuthenticated,
    };
    return selector(state);
  }),
}));

// Mock userStore
const mockAddUser = vi.fn();

vi.mock('../store/userStore.js', () => ({
  useUserStore: vi.fn((selector) => {
    const state = {
      addUser: mockAddUser,
    };
    return selector(state);
  }),
}));

// Mock Toast
const mockShowSuccessToast = vi.fn();
const mockShowErrorToast = vi.fn();

vi.mock('../components/Toast.jsx', () => ({
  showSuccessToast: (...args) => mockShowSuccessToast(...args),
  showErrorToast: (...args) => mockShowErrorToast(...args),
  showInfoToast: vi.fn(),
  Toaster: () => null,
}));

import SignupPage from './SignupPage.jsx';

/**
 * Helper to render SignupPage within a MemoryRouter.
 * @param {object} [options] - Render options
 * @param {string[]} [options.initialEntries=['/register']] - Initial router entries
 * @returns {object} Render result
 */
function renderSignupPage(options = {}) {
  const { initialEntries = ['/register'] } = options;

  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <SignupPage />
    </MemoryRouter>,
  );
}

describe('SignupPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsAuthenticated = false;
    mockAddUser.mockReturnValue(true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('rendering', () => {
    it('renders the create account heading', () => {
      renderSignupPage();

      expect(
        screen.getByText('Create Your Account'),
      ).toBeInTheDocument();
    });

    it('renders the subtitle text', () => {
      renderSignupPage();

      expect(
        screen.getByText(/Join .* to start managing your investments/i),
      ).toBeInTheDocument();
    });

    it('renders the first name input', () => {
      renderSignupPage();

      expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    });

    it('renders the last name input', () => {
      renderSignupPage();

      expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    });

    it('renders the email input', () => {
      renderSignupPage();

      expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    });

    it('renders the phone input', () => {
      renderSignupPage();

      expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
    });

    it('renders the password input', () => {
      renderSignupPage();

      expect(screen.getByLabelText(/^Password/i)).toBeInTheDocument();
    });

    it('renders the confirm password input', () => {
      renderSignupPage();

      expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    });

    it('renders the account type select', () => {
      renderSignupPage();

      expect(screen.getByLabelText(/Account Type/i)).toBeInTheDocument();
    });

    it('renders the date of birth input', () => {
      renderSignupPage();

      expect(screen.getByLabelText(/Date of Birth/i)).toBeInTheDocument();
    });

    it('renders the create account button', () => {
      renderSignupPage();

      expect(
        screen.getByRole('button', { name: /Create Account/i }),
      ).toBeInTheDocument();
    });

    it('renders the back to login link', () => {
      renderSignupPage();

      const loginLink = screen.getByRole('link', { name: /Back to Login/i });
      expect(loginLink).toBeInTheDocument();
      expect(loginLink).toHaveAttribute('href', '/login');
    });

    it('renders the application logo', () => {
      renderSignupPage();

      const svgs = document.querySelectorAll('svg');
      expect(svgs.length).toBeGreaterThan(0);
    });
  });

  describe('required field validation on submit', () => {
    it('shows error for empty first name on submit', async () => {
      const user = userEvent.setup();
      renderSignupPage();

      const submitButton = screen.getByRole('button', { name: /Create Account/i });
      await user.click(submitButton);

      expect(screen.getByText(/First name is required/i)).toBeInTheDocument();
    });

    it('shows error for empty last name on submit', async () => {
      const user = userEvent.setup();
      renderSignupPage();

      const submitButton = screen.getByRole('button', { name: /Create Account/i });
      await user.click(submitButton);

      expect(screen.getByText(/Last name is required/i)).toBeInTheDocument();
    });

    it('shows error for empty email on submit', async () => {
      const user = userEvent.setup();
      renderSignupPage();

      const submitButton = screen.getByRole('button', { name: /Create Account/i });
      await user.click(submitButton);

      expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
    });

    it('shows error for empty phone on submit', async () => {
      const user = userEvent.setup();
      renderSignupPage();

      const submitButton = screen.getByRole('button', { name: /Create Account/i });
      await user.click(submitButton);

      expect(screen.getByText(/Phone number is required/i)).toBeInTheDocument();
    });

    it('shows error for empty password on submit', async () => {
      const user = userEvent.setup();
      renderSignupPage();

      const submitButton = screen.getByRole('button', { name: /Create Account/i });
      await user.click(submitButton);

      expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
    });

    it('shows error for empty confirm password on submit', async () => {
      const user = userEvent.setup();
      renderSignupPage();

      const submitButton = screen.getByRole('button', { name: /Create Account/i });
      await user.click(submitButton);

      expect(screen.getByText(/Confirm password is required/i)).toBeInTheDocument();
    });

    it('shows error for empty account type on submit', async () => {
      const user = userEvent.setup();
      renderSignupPage();

      const submitButton = screen.getByRole('button', { name: /Create Account/i });
      await user.click(submitButton);

      expect(screen.getByText(/Account type is required/i)).toBeInTheDocument();
    });

    it('shows error for empty date of birth on submit', async () => {
      const user = userEvent.setup();
      renderSignupPage();

      const submitButton = screen.getByRole('button', { name: /Create Account/i });
      await user.click(submitButton);

      expect(screen.getByText(/Date of birth is required/i)).toBeInTheDocument();
    });

    it('does not call addUser when form has validation errors', async () => {
      const user = userEvent.setup();
      renderSignupPage();

      const submitButton = screen.getByRole('button', { name: /Create Account/i });
      await user.click(submitButton);

      expect(mockAddUser).not.toHaveBeenCalled();
    });
  });

  describe('inline validation for invalid inputs', () => {
    it('shows error for invalid email format', async () => {
      const user = userEvent.setup();
      renderSignupPage();

      const emailInput = screen.getByLabelText(/Email Address/i);
      await user.type(emailInput, 'notanemail');
      await user.tab();

      expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
    });

    it('shows error for phone number with less than 10 digits', async () => {
      const user = userEvent.setup();
      renderSignupPage();

      const phoneInput = screen.getByLabelText(/Phone Number/i);
      await user.type(phoneInput, '12345');
      await user.tab();

      expect(screen.getByText(/Phone number must contain at least 10 digits/i)).toBeInTheDocument();
    });

    it('shows error for password shorter than 8 characters', async () => {
      const user = userEvent.setup();
      renderSignupPage();

      const passwordInput = screen.getByLabelText(/^Password/i);
      await user.type(passwordInput, 'Ab1!');
      await user.tab();

      expect(screen.getByText(/Password must be at least 8 characters long/i)).toBeInTheDocument();
    });

    it('shows error for password without uppercase letter', async () => {
      const user = userEvent.setup();
      renderSignupPage();

      const passwordInput = screen.getByLabelText(/^Password/i);
      await user.type(passwordInput, 'abcdefg1!');
      await user.tab();

      expect(screen.getByText(/Password must contain at least one uppercase letter/i)).toBeInTheDocument();
    });

    it('shows error for password without lowercase letter', async () => {
      const user = userEvent.setup();
      renderSignupPage();

      const passwordInput = screen.getByLabelText(/^Password/i);
      await user.type(passwordInput, 'ABCDEFG1!');
      await user.tab();

      expect(screen.getByText(/Password must contain at least one lowercase letter/i)).toBeInTheDocument();
    });

    it('shows error for password without number', async () => {
      const user = userEvent.setup();
      renderSignupPage();

      const passwordInput = screen.getByLabelText(/^Password/i);
      await user.type(passwordInput, 'Abcdefgh!');
      await user.tab();

      expect(screen.getByText(/Password must contain at least one number/i)).toBeInTheDocument();
    });

    it('shows error for password without special character', async () => {
      const user = userEvent.setup();
      renderSignupPage();

      const passwordInput = screen.getByLabelText(/^Password/i);
      await user.type(passwordInput, 'Abcdefg1');
      await user.tab();

      expect(screen.getByText(/Password must contain at least one special character/i)).toBeInTheDocument();
    });

    it('shows error for first name shorter than 2 characters', async () => {
      const user = userEvent.setup();
      renderSignupPage();

      const firstNameInput = screen.getByLabelText(/First Name/i);
      await user.type(firstNameInput, 'A');
      await user.tab();

      expect(screen.getByText(/First name must be at least 2 characters long/i)).toBeInTheDocument();
    });

    it('shows error for last name shorter than 2 characters', async () => {
      const user = userEvent.setup();
      renderSignupPage();

      const lastNameInput = screen.getByLabelText(/Last Name/i);
      await user.type(lastNameInput, 'B');
      await user.tab();

      expect(screen.getByText(/Last name must be at least 2 characters long/i)).toBeInTheDocument();
    });
  });

  describe('password match validation', () => {
    it('shows error when confirm password does not match password', async () => {
      const user = userEvent.setup();
      renderSignupPage();

      const passwordInput = screen.getByLabelText(/^Password/i);
      const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);

      await user.type(passwordInput, 'Meridian@2024');
      await user.type(confirmPasswordInput, 'DifferentPass@2024');
      await user.tab();

      expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
    });

    it('does not show error when confirm password matches password', async () => {
      const user = userEvent.setup();
      renderSignupPage();

      const passwordInput = screen.getByLabelText(/^Password/i);
      const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);

      await user.type(passwordInput, 'Meridian@2024');
      await user.type(confirmPasswordInput, 'Meridian@2024');
      await user.tab();

      expect(screen.queryByText(/Passwords do not match/i)).not.toBeInTheDocument();
    });
  });

  describe('date of birth validation (18+)', () => {
    it('shows error when user is under 18', async () => {
      const user = userEvent.setup();
      renderSignupPage();

      const dobInput = screen.getByLabelText(/Date of Birth/i);

      const today = new Date();
      const underageYear = today.getFullYear() - 10;
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const underageDate = `${underageYear}-${month}-${day}`;

      await user.type(dobInput, underageDate);
      await user.tab();

      expect(screen.getByText(/You must be at least 18 years old/i)).toBeInTheDocument();
    });

    it('does not show error when user is 18 or older', async () => {
      const user = userEvent.setup();
      renderSignupPage();

      const dobInput = screen.getByLabelText(/Date of Birth/i);

      await user.type(dobInput, '1990-01-15');
      await user.tab();

      expect(screen.queryByText(/You must be at least 18 years old/i)).not.toBeInTheDocument();
    });
  });

  describe('successful submission', () => {
    /**
     * Helper to fill out the entire form with valid data.
     * @param {ReturnType<typeof userEvent.setup>} user - The user event instance
     */
    async function fillValidForm(user) {
      const firstNameInput = screen.getByLabelText(/First Name/i);
      const lastNameInput = screen.getByLabelText(/Last Name/i);
      const emailInput = screen.getByLabelText(/Email Address/i);
      const phoneInput = screen.getByLabelText(/Phone Number/i);
      const passwordInput = screen.getByLabelText(/^Password/i);
      const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);
      const accountTypeSelect = screen.getByLabelText(/Account Type/i);
      const dobInput = screen.getByLabelText(/Date of Birth/i);

      await user.type(firstNameInput, 'Jane');
      await user.type(lastNameInput, 'Doe');
      await user.type(emailInput, 'jane.doe@example.com');
      await user.type(phoneInput, '5551234567');
      await user.type(passwordInput, 'Meridian@2024');
      await user.type(confirmPasswordInput, 'Meridian@2024');
      await user.selectOptions(accountTypeSelect, 'Individual');
      await user.type(dobInput, '1990-01-15');
    }

    it('calls addUser with correct user data on valid submission', async () => {
      mockAddUser.mockReturnValue(true);
      const user = userEvent.setup();
      renderSignupPage();

      await fillValidForm(user);

      const submitButton = screen.getByRole('button', { name: /Create Account/i });
      await user.click(submitButton);

      expect(mockAddUser).toHaveBeenCalledTimes(1);
      expect(mockAddUser).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane.doe@example.com',
          phone: '5551234567',
          password: 'Meridian@2024',
          dateOfBirth: '1990-01-15',
          accounts: expect.arrayContaining([
            expect.objectContaining({
              type: 'Individual',
              status: 'active',
            }),
          ]),
        }),
      );
    });

    it('shows success toast on successful submission', async () => {
      mockAddUser.mockReturnValue(true);
      const user = userEvent.setup();
      renderSignupPage();

      await fillValidForm(user);

      const submitButton = screen.getByRole('button', { name: /Create Account/i });
      await user.click(submitButton);

      expect(mockShowSuccessToast).toHaveBeenCalledWith(
        'Account created successfully! Please sign in.',
      );
    });

    it('navigates to /login on successful submission', async () => {
      mockAddUser.mockReturnValue(true);
      const user = userEvent.setup();
      renderSignupPage();

      await fillValidForm(user);

      const submitButton = screen.getByRole('button', { name: /Create Account/i });
      await user.click(submitButton);

      expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
    });

    it('shows error toast when addUser returns false (duplicate email)', async () => {
      mockAddUser.mockReturnValue(false);
      const user = userEvent.setup();
      renderSignupPage();

      await fillValidForm(user);

      const submitButton = screen.getByRole('button', { name: /Create Account/i });
      await user.click(submitButton);

      expect(mockShowErrorToast).toHaveBeenCalledWith(
        'An account with this email already exists. Please use a different email.',
      );
    });

    it('does not navigate when addUser returns false', async () => {
      mockAddUser.mockReturnValue(false);
      const user = userEvent.setup();
      renderSignupPage();

      await fillValidForm(user);

      const submitButton = screen.getByRole('button', { name: /Create Account/i });
      await user.click(submitButton);

      expect(mockNavigate).not.toHaveBeenCalledWith('/login', { replace: true });
    });
  });

  describe('back to login link', () => {
    it('renders a link to the login page with correct href', () => {
      renderSignupPage();

      const loginLink = screen.getByRole('link', { name: /Back to Login/i });
      expect(loginLink).toHaveAttribute('href', '/login');
    });

    it('displays the "Already have an account?" text', () => {
      renderSignupPage();

      expect(screen.getByText(/Already have an account\?/i)).toBeInTheDocument();
    });
  });

  describe('authenticated user redirect', () => {
    it('redirects to /accounts when user is already authenticated', () => {
      mockIsAuthenticated = true;
      renderSignupPage();

      expect(mockNavigate).toHaveBeenCalledWith('/accounts', { replace: true });
    });

    it('does not render form fields when already authenticated', () => {
      mockIsAuthenticated = true;
      renderSignupPage();

      expect(screen.queryByLabelText(/First Name/i)).not.toBeInTheDocument();
    });
  });

  describe('password strength indicator', () => {
    it('shows password strength indicator when password is entered', async () => {
      const user = userEvent.setup();
      renderSignupPage();

      const passwordInput = screen.getByLabelText(/^Password/i);
      await user.type(passwordInput, 'Meridian@2024');

      expect(screen.getByText(/Password strength:/i)).toBeInTheDocument();
    });

    it('does not show password strength indicator when password is empty', () => {
      renderSignupPage();

      expect(screen.queryByText(/Password strength:/i)).not.toBeInTheDocument();
    });
  });

  describe('form clears errors on input change', () => {
    it('clears first name error when user starts typing', async () => {
      const user = userEvent.setup();
      renderSignupPage();

      const submitButton = screen.getByRole('button', { name: /Create Account/i });
      await user.click(submitButton);

      expect(screen.getByText(/First name is required/i)).toBeInTheDocument();

      const firstNameInput = screen.getByLabelText(/First Name/i);
      await user.type(firstNameInput, 'Jane');

      expect(screen.queryByText(/First name is required/i)).not.toBeInTheDocument();
    });

    it('clears email error when user starts typing', async () => {
      const user = userEvent.setup();
      renderSignupPage();

      const submitButton = screen.getByRole('button', { name: /Create Account/i });
      await user.click(submitButton);

      expect(screen.getByText(/Email is required/i)).toBeInTheDocument();

      const emailInput = screen.getByLabelText(/Email Address/i);
      await user.type(emailInput, 'j');

      expect(screen.queryByText(/Email is required/i)).not.toBeInTheDocument();
    });
  });
});