/**
 * Integration tests for LoginPage component.
 * Tests rendering of user cards, login flow, navigation, and redirect behavior.
 * @module test/LoginPage
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
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
const mockLogin = vi.fn();
let mockIsAuthenticated = false;

vi.mock('../store/sessionStore.js', () => ({
  useSessionStore: vi.fn((selector) => {
    const state = {
      isAuthenticated: mockIsAuthenticated,
      login: mockLogin,
    };
    return selector(state);
  }),
}));

// Mock userStore
const mockUsers = [
  {
    id: 'usr_jm_001',
    email: 'james.morgan@example.com',
    firstName: 'James',
    lastName: 'Morgan',
    lastLogin: '2024-02-10T14:32:00Z',
    accounts: [{ type: 'Individual' }],
  },
  {
    id: 'usr_sc_002',
    email: 'sarah.chen@example.com',
    firstName: 'Sarah',
    lastName: 'Chen',
    lastLogin: '2024-02-11T09:15:00Z',
    accounts: [{ type: 'Individual' }],
  },
  {
    id: 'usr_rp_003',
    email: 'robert.patel@example.com',
    firstName: 'Robert',
    lastName: 'Patel',
    lastLogin: '2024-02-09T18:45:00Z',
    accounts: [{ type: 'Joint' }],
  },
  {
    id: 'usr_ew_004',
    email: 'emily.watson@example.com',
    firstName: 'Emily',
    lastName: 'Watson',
    lastLogin: '2024-02-11T07:20:00Z',
    accounts: [{ type: 'Individual' }],
  },
  {
    id: 'usr_dk_005',
    email: 'david.kim@example.com',
    firstName: 'David',
    lastName: 'Kim',
    lastLogin: '2024-02-08T11:05:00Z',
    accounts: [{ type: 'Joint' }],
  },
];

const mockGetUsers = vi.fn(() => mockUsers);

vi.mock('../store/userStore.js', () => ({
  useUserStore: vi.fn((selector) => {
    const state = {
      getUsers: mockGetUsers,
    };
    return selector(state);
  }),
}));

// Mock Toast
vi.mock('../components/Toast.jsx', () => ({
  showErrorToast: vi.fn(),
  showSuccessToast: vi.fn(),
  showInfoToast: vi.fn(),
  Toaster: () => null,
}));

import LoginPage from './LoginPage.jsx';

/**
 * Helper to render LoginPage within a MemoryRouter.
 * @param {object} [options] - Render options
 * @param {string[]} [options.initialEntries=['/login']] - Initial router entries
 * @returns {object} Render result
 */
function renderLoginPage(options = {}) {
  const { initialEntries = ['/login'] } = options;

  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <LoginPage />
    </MemoryRouter>,
  );
}

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsAuthenticated = false;
    mockLogin.mockReturnValue(true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('rendering', () => {
    it('renders the welcome heading', () => {
      renderLoginPage();

      expect(
        screen.getByText(/Welcome to/i),
      ).toBeInTheDocument();
    });

    it('renders the subtitle text', () => {
      renderLoginPage();

      expect(
        screen.getByText('Select a user to sign in to your account'),
      ).toBeInTheDocument();
    });

    it('renders 5 user cards', () => {
      renderLoginPage();

      const userCards = screen.getAllByRole('button', { name: /Sign in as/i });
      expect(userCards).toHaveLength(5);
    });

    it('renders the Create Account link', () => {
      renderLoginPage();

      const createAccountLink = screen.getByRole('link', { name: /Create Account/i });
      expect(createAccountLink).toBeInTheDocument();
      expect(createAccountLink).toHaveAttribute('href', '/register');
    });

    it('renders the application logo', () => {
      renderLoginPage();

      const svgs = document.querySelectorAll('svg');
      expect(svgs.length).toBeGreaterThan(0);
    });
  });

  describe('user card display', () => {
    it('displays James Morgan card with correct name', () => {
      renderLoginPage();

      expect(screen.getByText('James Morgan')).toBeInTheDocument();
    });

    it('displays Sarah Chen card with correct name', () => {
      renderLoginPage();

      expect(screen.getByText('Sarah Chen')).toBeInTheDocument();
    });

    it('displays Robert Patel card with correct name', () => {
      renderLoginPage();

      expect(screen.getByText('Robert Patel')).toBeInTheDocument();
    });

    it('displays Emily Watson card with correct name', () => {
      renderLoginPage();

      expect(screen.getByText('Emily Watson')).toBeInTheDocument();
    });

    it('displays David Kim card with correct name', () => {
      renderLoginPage();

      expect(screen.getByText('David Kim')).toBeInTheDocument();
    });

    it('displays user email addresses', () => {
      renderLoginPage();

      expect(screen.getByText('james.morgan@example.com')).toBeInTheDocument();
      expect(screen.getByText('sarah.chen@example.com')).toBeInTheDocument();
      expect(screen.getByText('robert.patel@example.com')).toBeInTheDocument();
      expect(screen.getByText('emily.watson@example.com')).toBeInTheDocument();
      expect(screen.getByText('david.kim@example.com')).toBeInTheDocument();
    });

    it('displays account type badges on user cards', () => {
      renderLoginPage();

      const individualBadges = screen.getAllByText('Individual');
      const jointBadges = screen.getAllByText('Joint');

      expect(individualBadges.length).toBe(3);
      expect(jointBadges.length).toBe(2);
    });
  });

  describe('login interaction', () => {
    it('calls login with correct userId when clicking James Morgan card', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      const jamesCard = screen.getByRole('button', { name: /Sign in as James Morgan/i });
      await user.click(jamesCard);

      expect(mockLogin).toHaveBeenCalledWith('usr_jm_001');
    });

    it('calls login with correct userId when clicking Sarah Chen card', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      const sarahCard = screen.getByRole('button', { name: /Sign in as Sarah Chen/i });
      await user.click(sarahCard);

      expect(mockLogin).toHaveBeenCalledWith('usr_sc_002');
    });

    it('calls login with correct userId when clicking Robert Patel card', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      const robertCard = screen.getByRole('button', { name: /Sign in as Robert Patel/i });
      await user.click(robertCard);

      expect(mockLogin).toHaveBeenCalledWith('usr_rp_003');
    });

    it('calls login with correct userId when clicking Emily Watson card', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      const emilyCard = screen.getByRole('button', { name: /Sign in as Emily Watson/i });
      await user.click(emilyCard);

      expect(mockLogin).toHaveBeenCalledWith('usr_ew_004');
    });

    it('calls login with correct userId when clicking David Kim card', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      const davidCard = screen.getByRole('button', { name: /Sign in as David Kim/i });
      await user.click(davidCard);

      expect(mockLogin).toHaveBeenCalledWith('usr_dk_005');
    });

    it('navigates to /accounts on successful login', async () => {
      mockLogin.mockReturnValue(true);
      const user = userEvent.setup();
      renderLoginPage();

      const jamesCard = screen.getByRole('button', { name: /Sign in as James Morgan/i });
      await user.click(jamesCard);

      expect(mockNavigate).toHaveBeenCalledWith('/accounts', { replace: true });
    });

    it('does not navigate when login fails', async () => {
      mockLogin.mockReturnValue(false);
      const user = userEvent.setup();
      renderLoginPage();

      const jamesCard = screen.getByRole('button', { name: /Sign in as James Morgan/i });
      await user.click(jamesCard);

      expect(mockNavigate).not.toHaveBeenCalledWith('/accounts', { replace: true });
    });

    it('shows error toast when login fails', async () => {
      mockLogin.mockReturnValue(false);
      const { showErrorToast } = await import('../components/Toast.jsx');
      const user = userEvent.setup();
      renderLoginPage();

      const jamesCard = screen.getByRole('button', { name: /Sign in as James Morgan/i });
      await user.click(jamesCard);

      expect(showErrorToast).toHaveBeenCalledWith('Login failed. Please try again.');
    });
  });

  describe('signup link navigation', () => {
    it('renders a link to the signup page with correct href', () => {
      renderLoginPage();

      const signupLink = screen.getByRole('link', { name: /Create Account/i });
      expect(signupLink).toHaveAttribute('href', '/register');
    });

    it('displays the "Don\'t have an account?" text', () => {
      renderLoginPage();

      expect(screen.getByText(/Don't have an account\?/i)).toBeInTheDocument();
    });
  });

  describe('authenticated user redirect', () => {
    it('redirects to /accounts when user is already authenticated', () => {
      mockIsAuthenticated = true;
      renderLoginPage();

      expect(mockNavigate).toHaveBeenCalledWith('/accounts', { replace: true });
    });

    it('does not render user cards when already authenticated', () => {
      mockIsAuthenticated = true;
      renderLoginPage();

      const userCards = screen.queryAllByRole('button', { name: /Sign in as/i });
      expect(userCards).toHaveLength(0);
    });
  });

  describe('empty users state', () => {
    it('shows a message when no users are available', () => {
      mockGetUsers.mockReturnValue([]);
      renderLoginPage();

      expect(
        screen.getByText(/No users available/i),
      ).toBeInTheDocument();
    });
  });

  describe('keyboard accessibility', () => {
    it('allows activating a user card via Enter key', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      const jamesCard = screen.getByRole('button', { name: /Sign in as James Morgan/i });
      jamesCard.focus();
      await user.keyboard('{Enter}');

      expect(mockLogin).toHaveBeenCalledWith('usr_jm_001');
    });

    it('allows activating a user card via Space key', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      const sarahCard = screen.getByRole('button', { name: /Sign in as Sarah Chen/i });
      sarahCard.focus();
      await user.keyboard(' ');

      expect(mockLogin).toHaveBeenCalledWith('usr_sc_002');
    });
  });
});