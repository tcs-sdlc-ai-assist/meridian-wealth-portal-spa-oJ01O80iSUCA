/**
 * Integration tests for Navbar component.
 * Tests rendering of navigation items, active route highlighting,
 * hamburger menu behavior, profile dropdown presence, and navigation links.
 * @module test/Navbar
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

// Mock sessionStore
let mockIsAuthenticated = true;
let mockCurrentUser = {
  id: 'usr_jm_001',
  firstName: 'James',
  lastName: 'Morgan',
  email: 'james.morgan@example.com',
  accounts: [{ type: 'Individual' }],
  security: {
    twoFactorEnabled: true,
    twoFactorMethod: 'authenticator',
    lastPasswordChange: '2024-01-15T10:00:00Z',
    trustedDevices: ['MacBook Pro - Chrome'],
  },
};
const mockLogout = vi.fn();

vi.mock('../store/sessionStore.js', () => ({
  useSessionStore: vi.fn((selector) => {
    const state = {
      isAuthenticated: mockIsAuthenticated,
      currentUser: mockCurrentUser,
      logout: mockLogout,
    };
    return selector(state);
  }),
}));

// Mock Toast
vi.mock('./Toast.jsx', () => ({
  showSuccessToast: vi.fn(),
  showErrorToast: vi.fn(),
  showInfoToast: vi.fn(),
  Toaster: () => null,
}));

import Navbar from './Navbar.jsx';

/**
 * Helper to render Navbar within a MemoryRouter at a given route.
 * @param {object} [options] - Render options
 * @param {string[]} [options.initialEntries=['/accounts']] - Initial router entries
 * @returns {object} Render result
 */
function renderNavbar(options = {}) {
  const { initialEntries = ['/accounts'] } = options;

  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Navbar />
    </MemoryRouter>,
  );
}

describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsAuthenticated = true;
    mockCurrentUser = {
      id: 'usr_jm_001',
      firstName: 'James',
      lastName: 'Morgan',
      email: 'james.morgan@example.com',
      accounts: [{ type: 'Individual' }],
      security: {
        twoFactorEnabled: true,
        twoFactorMethod: 'authenticator',
        lastPasswordChange: '2024-01-15T10:00:00Z',
        trustedDevices: ['MacBook Pro - Chrome'],
      },
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('rendering', () => {
    it('renders the navigation element with correct aria label', () => {
      renderNavbar();

      const nav = screen.getByRole('navigation', { name: /Main navigation/i });
      expect(nav).toBeInTheDocument();
    });

    it('renders the app name / logo link', () => {
      renderNavbar();

      const logoLink = screen.getByRole('link', { name: /Meridian.*Go to dashboard/i });
      expect(logoLink).toBeInTheDocument();
    });

    it('renders all 5 desktop navigation links', () => {
      renderNavbar();

      expect(screen.getAllByText('Accounts').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Holdings').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Activity').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Documents').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Products & Services').length).toBeGreaterThanOrEqual(1);
    });

    it('does not render when user is not authenticated', () => {
      mockIsAuthenticated = false;

      const { container } = renderNavbar();

      const nav = screen.queryByRole('navigation', { name: /Main navigation/i });
      expect(nav).not.toBeInTheDocument();
    });
  });

  describe('navigation links have correct hrefs', () => {
    it('Accounts link points to /accounts', () => {
      renderNavbar();

      const desktopLinks = screen.getAllByRole('link', { name: /^Accounts$/i });
      const accountsLink = desktopLinks.find((link) => link.getAttribute('href') === '/accounts');
      expect(accountsLink).toBeDefined();
    });

    it('Holdings link points to /portfolio', () => {
      renderNavbar();

      const holdingsLinks = screen.getAllByRole('link', { name: /^Holdings$/i });
      const holdingsLink = holdingsLinks.find((link) => link.getAttribute('href') === '/portfolio');
      expect(holdingsLink).toBeDefined();
    });

    it('Activity link points to /transactions', () => {
      renderNavbar();

      const activityLinks = screen.getAllByRole('link', { name: /^Activity$/i });
      const activityLink = activityLinks.find((link) => link.getAttribute('href') === '/transactions');
      expect(activityLink).toBeDefined();
    });

    it('Documents link points to /documents', () => {
      renderNavbar();

      const documentsLinks = screen.getAllByRole('link', { name: /^Documents$/i });
      const documentsLink = documentsLinks.find((link) => link.getAttribute('href') === '/documents');
      expect(documentsLink).toBeDefined();
    });

    it('Products & Services link points to /products', () => {
      renderNavbar();

      const productsLinks = screen.getAllByRole('link', { name: /Products & Services/i });
      const productsLink = productsLinks.find((link) => link.getAttribute('href') === '/products');
      expect(productsLink).toBeDefined();
    });
  });

  describe('active route highlighting', () => {
    it('highlights Accounts link when on /accounts route', () => {
      renderNavbar({ initialEntries: ['/accounts'] });

      const desktopLinks = screen.getAllByRole('link', { name: /^Accounts$/i });
      const accountsLink = desktopLinks.find((link) => link.getAttribute('href') === '/accounts');
      expect(accountsLink).toHaveAttribute('aria-current', 'page');
    });

    it('highlights Holdings link when on /portfolio route', () => {
      renderNavbar({ initialEntries: ['/portfolio'] });

      const holdingsLinks = screen.getAllByRole('link', { name: /^Holdings$/i });
      const holdingsLink = holdingsLinks.find((link) => link.getAttribute('href') === '/portfolio');
      expect(holdingsLink).toHaveAttribute('aria-current', 'page');
    });

    it('highlights Activity link when on /transactions route', () => {
      renderNavbar({ initialEntries: ['/transactions'] });

      const activityLinks = screen.getAllByRole('link', { name: /^Activity$/i });
      const activityLink = activityLinks.find((link) => link.getAttribute('href') === '/transactions');
      expect(activityLink).toHaveAttribute('aria-current', 'page');
    });

    it('highlights Documents link when on /documents route', () => {
      renderNavbar({ initialEntries: ['/documents'] });

      const documentsLinks = screen.getAllByRole('link', { name: /^Documents$/i });
      const documentsLink = documentsLinks.find((link) => link.getAttribute('href') === '/documents');
      expect(documentsLink).toHaveAttribute('aria-current', 'page');
    });

    it('highlights Products & Services link when on /products route', () => {
      renderNavbar({ initialEntries: ['/products'] });

      const productsLinks = screen.getAllByRole('link', { name: /Products & Services/i });
      const productsLink = productsLinks.find((link) => link.getAttribute('href') === '/products');
      expect(productsLink).toHaveAttribute('aria-current', 'page');
    });

    it('does not highlight Accounts link when on /portfolio route', () => {
      renderNavbar({ initialEntries: ['/portfolio'] });

      const desktopLinks = screen.getAllByRole('link', { name: /^Accounts$/i });
      const accountsLink = desktopLinks.find((link) => link.getAttribute('href') === '/accounts');
      expect(accountsLink).not.toHaveAttribute('aria-current', 'page');
    });
  });

  describe('hamburger menu', () => {
    it('renders the hamburger menu button', () => {
      renderNavbar();

      const hamburgerButton = screen.getByRole('button', { name: /Open navigation menu/i });
      expect(hamburgerButton).toBeInTheDocument();
    });

    it('hamburger button has aria-expanded set to false initially', () => {
      renderNavbar();

      const hamburgerButton = screen.getByRole('button', { name: /Open navigation menu/i });
      expect(hamburgerButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('hamburger button has aria-controls pointing to mobile menu', () => {
      renderNavbar();

      const hamburgerButton = screen.getByRole('button', { name: /Open navigation menu/i });
      expect(hamburgerButton).toHaveAttribute('aria-controls', 'mobile-navigation-menu');
    });

    it('toggles mobile menu open when hamburger is clicked', async () => {
      const user = userEvent.setup();
      renderNavbar();

      const hamburgerButton = screen.getByRole('button', { name: /Open navigation menu/i });
      await user.click(hamburgerButton);

      // After click, aria-expanded should be true and label should change
      const closeButton = screen.getByRole('button', { name: /Close navigation menu/i });
      expect(closeButton).toHaveAttribute('aria-expanded', 'true');
    });

    it('toggles mobile menu closed when hamburger is clicked again', async () => {
      const user = userEvent.setup();
      renderNavbar();

      const hamburgerButton = screen.getByRole('button', { name: /Open navigation menu/i });

      // Open
      await user.click(hamburgerButton);
      const closeButton = screen.getByRole('button', { name: /Close navigation menu/i });
      expect(closeButton).toHaveAttribute('aria-expanded', 'true');

      // Close
      await user.click(closeButton);
      const openButton = screen.getByRole('button', { name: /Open navigation menu/i });
      expect(openButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('mobile menu contains all navigation links', async () => {
      const user = userEvent.setup();
      renderNavbar();

      const hamburgerButton = screen.getByRole('button', { name: /Open navigation menu/i });
      await user.click(hamburgerButton);

      const mobileMenu = document.getElementById('mobile-navigation-menu');
      expect(mobileMenu).toBeInTheDocument();

      const mobileMenuEl = within(mobileMenu);
      expect(mobileMenuEl.getByText('Accounts')).toBeInTheDocument();
      expect(mobileMenuEl.getByText('Holdings')).toBeInTheDocument();
      expect(mobileMenuEl.getByText('Activity')).toBeInTheDocument();
      expect(mobileMenuEl.getByText('Documents')).toBeInTheDocument();
      expect(mobileMenuEl.getByText('Products & Services')).toBeInTheDocument();
    });

    it('mobile menu has correct aria-label', () => {
      renderNavbar();

      const mobileMenu = document.getElementById('mobile-navigation-menu');
      expect(mobileMenu).toHaveAttribute('aria-label', 'Mobile navigation');
    });
  });

  describe('profile dropdown', () => {
    it('renders the profile dropdown button', () => {
      renderNavbar();

      const profileButton = screen.getByRole('button', { name: /Open profile menu/i });
      expect(profileButton).toBeInTheDocument();
    });

    it('displays user initials in the avatar', () => {
      renderNavbar();

      // James Morgan -> JM
      expect(screen.getByText('JM')).toBeInTheDocument();
    });

    it('opens profile dropdown when clicked', async () => {
      const user = userEvent.setup();
      renderNavbar();

      const profileButton = screen.getByRole('button', { name: /Open profile menu/i });
      await user.click(profileButton);

      // Should show user name and menu items
      expect(screen.getByText('James Morgan')).toBeInTheDocument();
      expect(screen.getByText('james.morgan@example.com')).toBeInTheDocument();
    });

    it('shows navigation items in profile dropdown', async () => {
      const user = userEvent.setup();
      renderNavbar();

      const profileButton = screen.getByRole('button', { name: /Open profile menu/i });
      await user.click(profileButton);

      expect(screen.getByText('Profile')).toBeInTheDocument();
      expect(screen.getByText('Communication Preferences')).toBeInTheDocument();
      expect(screen.getByText('Security')).toBeInTheDocument();
      expect(screen.getByText('Bank Management')).toBeInTheDocument();
      expect(screen.getByText('Beneficiaries')).toBeInTheDocument();
      expect(screen.getByText('Cost Basis')).toBeInTheDocument();
    });

    it('shows logout button in profile dropdown', async () => {
      const user = userEvent.setup();
      renderNavbar();

      const profileButton = screen.getByRole('button', { name: /Open profile menu/i });
      await user.click(profileButton);

      expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    it('calls logout when logout button is clicked', async () => {
      const user = userEvent.setup();
      renderNavbar();

      const profileButton = screen.getByRole('button', { name: /Open profile menu/i });
      await user.click(profileButton);

      const logoutButton = screen.getByText('Logout');
      await user.click(logoutButton);

      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
  });

  describe('keyboard accessibility', () => {
    it('hamburger button closes mobile menu on Escape key', async () => {
      const user = userEvent.setup();
      renderNavbar();

      const hamburgerButton = screen.getByRole('button', { name: /Open navigation menu/i });
      await user.click(hamburgerButton);

      // Verify menu is open
      const closeButton = screen.getByRole('button', { name: /Close navigation menu/i });
      expect(closeButton).toHaveAttribute('aria-expanded', 'true');

      // Press Escape
      await user.keyboard('{Escape}');

      const openButton = screen.getByRole('button', { name: /Open navigation menu/i });
      expect(openButton).toHaveAttribute('aria-expanded', 'false');
    });
  });
});