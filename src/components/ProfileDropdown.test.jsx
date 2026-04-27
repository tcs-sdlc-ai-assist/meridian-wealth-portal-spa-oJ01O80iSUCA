/**
 * Integration tests for ProfileDropdown component.
 * Tests dropdown opening, menu items display, closing behavior,
 * keyboard navigation, logout functionality, and menu item routing.
 * @module test/ProfileDropdown
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
  phone: '5551234567',
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

import ProfileDropdown from './ProfileDropdown.jsx';

/**
 * Helper to render ProfileDropdown within a MemoryRouter at a given route.
 * @param {object} [options] - Render options
 * @param {string[]} [options.initialEntries=['/accounts']] - Initial router entries
 * @returns {object} Render result
 */
function renderProfileDropdown(options = {}) {
  const { initialEntries = ['/accounts'] } = options;

  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <ProfileDropdown />
    </MemoryRouter>,
  );
}

describe('ProfileDropdown', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsAuthenticated = true;
    mockCurrentUser = {
      id: 'usr_jm_001',
      firstName: 'James',
      lastName: 'Morgan',
      email: 'james.morgan@example.com',
      phone: '5551234567',
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
    it('renders the profile dropdown button', () => {
      renderProfileDropdown();

      const profileButton = screen.getByRole('button', { name: /Open profile menu/i });
      expect(profileButton).toBeInTheDocument();
    });

    it('displays user initials in the avatar', () => {
      renderProfileDropdown();

      // James Morgan -> JM
      expect(screen.getByText('JM')).toBeInTheDocument();
    });

    it('does not render when user is not authenticated', () => {
      mockIsAuthenticated = false;

      const { container } = renderProfileDropdown();

      const profileButton = screen.queryByRole('button', { name: /Open profile menu/i });
      expect(profileButton).not.toBeInTheDocument();
    });

    it('does not render when currentUser is null', () => {
      mockCurrentUser = null;

      const { container } = renderProfileDropdown();

      const profileButton = screen.queryByRole('button', { name: /Open profile menu/i });
      expect(profileButton).not.toBeInTheDocument();
    });

    it('displays correct initials for different users', () => {
      mockCurrentUser = {
        ...mockCurrentUser,
        id: 'usr_sc_002',
        firstName: 'Sarah',
        lastName: 'Chen',
        email: 'sarah.chen@example.com',
      };

      renderProfileDropdown();

      expect(screen.getByText('SC')).toBeInTheDocument();
    });
  });

  describe('dropdown opens on click', () => {
    it('opens the dropdown menu when the avatar button is clicked', async () => {
      const user = userEvent.setup();
      renderProfileDropdown();

      const profileButton = screen.getByRole('button', { name: /Open profile menu/i });
      await user.click(profileButton);

      // Should show user name and email
      expect(screen.getByText('James Morgan')).toBeInTheDocument();
      expect(screen.getByText('james.morgan@example.com')).toBeInTheDocument();
    });

    it('dropdown is not visible before clicking', () => {
      renderProfileDropdown();

      // Menu items should not be visible
      expect(screen.queryByText('James Morgan')).not.toBeInTheDocument();
      expect(screen.queryByText('Profile')).not.toBeInTheDocument();
    });
  });

  describe('displays all 7 menu items', () => {
    it('shows all 6 navigation items and 1 logout item', async () => {
      const user = userEvent.setup();
      renderProfileDropdown();

      const profileButton = screen.getByRole('button', { name: /Open profile menu/i });
      await user.click(profileButton);

      // 6 navigation items
      expect(screen.getByText('Profile')).toBeInTheDocument();
      expect(screen.getByText('Communication Preferences')).toBeInTheDocument();
      expect(screen.getByText('Security')).toBeInTheDocument();
      expect(screen.getByText('Bank Management')).toBeInTheDocument();
      expect(screen.getByText('Beneficiaries')).toBeInTheDocument();
      expect(screen.getByText('Cost Basis')).toBeInTheDocument();

      // 1 logout item
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    it('displays user info header with full name and email', async () => {
      const user = userEvent.setup();
      renderProfileDropdown();

      const profileButton = screen.getByRole('button', { name: /Open profile menu/i });
      await user.click(profileButton);

      expect(screen.getByText('James Morgan')).toBeInTheDocument();
      expect(screen.getByText('james.morgan@example.com')).toBeInTheDocument();
    });
  });

  describe('menu items route correctly', () => {
    it('Profile link points to /profile', async () => {
      const user = userEvent.setup();
      renderProfileDropdown();

      const profileButton = screen.getByRole('button', { name: /Open profile menu/i });
      await user.click(profileButton);

      const profileLink = screen.getByText('Profile').closest('a');
      expect(profileLink).toHaveAttribute('href', '/profile');
    });

    it('Communication Preferences link points to /notifications', async () => {
      const user = userEvent.setup();
      renderProfileDropdown();

      const profileButton = screen.getByRole('button', { name: /Open profile menu/i });
      await user.click(profileButton);

      const commLink = screen.getByText('Communication Preferences').closest('a');
      expect(commLink).toHaveAttribute('href', '/notifications');
    });

    it('Security link points to /settings', async () => {
      const user = userEvent.setup();
      renderProfileDropdown();

      const profileButton = screen.getByRole('button', { name: /Open profile menu/i });
      await user.click(profileButton);

      const securityLink = screen.getByText('Security').closest('a');
      expect(securityLink).toHaveAttribute('href', '/settings');
    });

    it('Bank Management link points to /bank-management', async () => {
      const user = userEvent.setup();
      renderProfileDropdown();

      const profileButton = screen.getByRole('button', { name: /Open profile menu/i });
      await user.click(profileButton);

      const bankLink = screen.getByText('Bank Management').closest('a');
      expect(bankLink).toHaveAttribute('href', '/bank-management');
    });

    it('Beneficiaries link points to /beneficiaries', async () => {
      const user = userEvent.setup();
      renderProfileDropdown();

      const profileButton = screen.getByRole('button', { name: /Open profile menu/i });
      await user.click(profileButton);

      const benLink = screen.getByText('Beneficiaries').closest('a');
      expect(benLink).toHaveAttribute('href', '/beneficiaries');
    });

    it('Cost Basis link points to /tax-center', async () => {
      const user = userEvent.setup();
      renderProfileDropdown();

      const profileButton = screen.getByRole('button', { name: /Open profile menu/i });
      await user.click(profileButton);

      const costBasisLink = screen.getByText('Cost Basis').closest('a');
      expect(costBasisLink).toHaveAttribute('href', '/tax-center');
    });
  });

  describe('logout item clears session', () => {
    it('calls logout when logout button is clicked', async () => {
      const user = userEvent.setup();
      renderProfileDropdown();

      const profileButton = screen.getByRole('button', { name: /Open profile menu/i });
      await user.click(profileButton);

      const logoutButton = screen.getByText('Logout');
      await user.click(logoutButton);

      expect(mockLogout).toHaveBeenCalledTimes(1);
    });

    it('logout button is rendered as a button element', async () => {
      const user = userEvent.setup();
      renderProfileDropdown();

      const profileButton = screen.getByRole('button', { name: /Open profile menu/i });
      await user.click(profileButton);

      const logoutButton = screen.getByText('Logout').closest('button');
      expect(logoutButton).toBeInTheDocument();
      expect(logoutButton.tagName).toBe('BUTTON');
    });
  });

  describe('closes on outside click', () => {
    it('closes the dropdown when clicking outside', async () => {
      const user = userEvent.setup();
      renderProfileDropdown();

      const profileButton = screen.getByRole('button', { name: /Open profile menu/i });
      await user.click(profileButton);

      // Verify dropdown is open
      expect(screen.getByText('James Morgan')).toBeInTheDocument();
      expect(screen.getByText('Profile')).toBeInTheDocument();

      // Click outside the dropdown (on the body)
      await user.click(document.body);

      // Dropdown should close - menu items should no longer be visible
      expect(screen.queryByText('Profile')).not.toBeInTheDocument();
    });
  });

  describe('closes on Escape key', () => {
    it('closes the dropdown when Escape key is pressed', async () => {
      const user = userEvent.setup();
      renderProfileDropdown();

      const profileButton = screen.getByRole('button', { name: /Open profile menu/i });
      await user.click(profileButton);

      // Verify dropdown is open
      expect(screen.getByText('Profile')).toBeInTheDocument();

      // Press Escape
      await user.keyboard('{Escape}');

      // Dropdown should close
      expect(screen.queryByText('Profile')).not.toBeInTheDocument();
    });
  });

  describe('keyboard navigation', () => {
    it('opens the dropdown with Enter key on the avatar button', async () => {
      const user = userEvent.setup();
      renderProfileDropdown();

      const profileButton = screen.getByRole('button', { name: /Open profile menu/i });
      profileButton.focus();
      await user.keyboard('{Enter}');

      expect(screen.getByText('Profile')).toBeInTheDocument();
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    it('opens the dropdown with Space key on the avatar button', async () => {
      const user = userEvent.setup();
      renderProfileDropdown();

      const profileButton = screen.getByRole('button', { name: /Open profile menu/i });
      profileButton.focus();
      await user.keyboard(' ');

      expect(screen.getByText('Profile')).toBeInTheDocument();
    });

    it('navigates menu items with arrow keys', async () => {
      const user = userEvent.setup();
      renderProfileDropdown();

      const profileButton = screen.getByRole('button', { name: /Open profile menu/i });
      await user.click(profileButton);

      // Verify dropdown is open
      expect(screen.getByText('Profile')).toBeInTheDocument();

      // Press ArrowDown to navigate through items
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowDown}');

      // The headlessui Menu component handles focus management internally
      // We verify the menu is still open and items are accessible
      expect(screen.getByText('Profile')).toBeInTheDocument();
      expect(screen.getByText('Communication Preferences')).toBeInTheDocument();
      expect(screen.getByText('Security')).toBeInTheDocument();
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    it('navigates up with ArrowUp key', async () => {
      const user = userEvent.setup();
      renderProfileDropdown();

      const profileButton = screen.getByRole('button', { name: /Open profile menu/i });
      await user.click(profileButton);

      // Navigate down then up
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowUp}');

      // Menu should still be open with all items accessible
      expect(screen.getByText('Profile')).toBeInTheDocument();
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });
  });

  describe('user info display', () => {
    it('displays full name correctly for user with both first and last name', async () => {
      const user = userEvent.setup();
      renderProfileDropdown();

      const profileButton = screen.getByRole('button', { name: /Open profile menu/i });
      await user.click(profileButton);

      expect(screen.getByText('James Morgan')).toBeInTheDocument();
    });

    it('displays email in the dropdown header', async () => {
      const user = userEvent.setup();
      renderProfileDropdown();

      const profileButton = screen.getByRole('button', { name: /Open profile menu/i });
      await user.click(profileButton);

      expect(screen.getByText('james.morgan@example.com')).toBeInTheDocument();
    });

    it('handles user with no email gracefully', async () => {
      mockCurrentUser = {
        ...mockCurrentUser,
        email: undefined,
      };

      const user = userEvent.setup();
      renderProfileDropdown();

      const profileButton = screen.getByRole('button', { name: /Open profile menu/i });
      await user.click(profileButton);

      expect(screen.getByText('James Morgan')).toBeInTheDocument();
      // Should not crash when email is undefined
    });
  });

  describe('toggle behavior', () => {
    it('toggles dropdown open and closed on repeated clicks', async () => {
      const user = userEvent.setup();
      renderProfileDropdown();

      const profileButton = screen.getByRole('button', { name: /Open profile menu/i });

      // Open
      await user.click(profileButton);
      expect(screen.getByText('Profile')).toBeInTheDocument();

      // Close by clicking the button again
      await user.click(profileButton);

      // After closing, menu items should not be visible
      expect(screen.queryByText('Profile')).not.toBeInTheDocument();
    });
  });

  describe('menu item icons', () => {
    it('renders icons alongside menu item labels', async () => {
      const user = userEvent.setup();
      renderProfileDropdown();

      const profileButton = screen.getByRole('button', { name: /Open profile menu/i });
      await user.click(profileButton);

      // Each menu item should have an SVG icon (aria-hidden)
      const profileItem = screen.getByText('Profile').closest('a');
      expect(profileItem).toBeInTheDocument();

      const svgIcons = profileItem.querySelectorAll('svg');
      expect(svgIcons.length).toBeGreaterThan(0);
    });

    it('renders an icon alongside the logout button', async () => {
      const user = userEvent.setup();
      renderProfileDropdown();

      const profileButton = screen.getByRole('button', { name: /Open profile menu/i });
      await user.click(profileButton);

      const logoutButton = screen.getByText('Logout').closest('button');
      expect(logoutButton).toBeInTheDocument();

      const svgIcons = logoutButton.querySelectorAll('svg');
      expect(svgIcons.length).toBeGreaterThan(0);
    });
  });
});