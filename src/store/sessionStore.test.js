/**
 * Unit tests for sessionStore.js — session/auth state management.
 * Tests login, logout, getCurrentUser, isAuthenticated, errorBanner,
 * and cross-tab synchronization via storage events.
 * @module test/sessionStore
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act } from '@testing-library/react';

// We need to mock storageUtils before importing the store
vi.mock('../utils/storageUtils.js', () => {
  let store = {};
  return {
    getItem: vi.fn((key) => {
      return store[key] !== undefined ? store[key] : null;
    }),
    setItem: vi.fn((key, value) => {
      store[key] = value;
      return true;
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
      return true;
    }),
    clear: vi.fn(() => {
      store = {};
      return true;
    }),
    isStorageAvailable: vi.fn(() => true),
    __getStore: () => store,
    __resetStore: () => {
      store = {};
    },
  };
});

import { getItem, setItem, removeItem } from '../utils/storageUtils.js';
import { STORAGE_KEYS } from '../utils/constants.js';

// We need to reset the zustand store between tests
// Import the store factory fresh each time
let useSessionStore;

/**
 * Helper to seed mock users into storage.
 * @param {Array} users - Array of user objects
 */
function seedUsers(users) {
  setItem(STORAGE_KEYS.USERS, users);
}

/**
 * Sample mock users for testing.
 * @type {Array}
 */
const MOCK_USERS = [
  {
    id: 'usr_test_001',
    email: 'test.user@example.com',
    password: 'Test@1234',
    firstName: 'Test',
    lastName: 'User',
    phone: '5551234567',
    dateOfBirth: '1990-01-15',
    address: {
      street: '123 Test St',
      city: 'Testville',
      state: 'CA',
      zip: '90210',
      country: 'US',
    },
    employment: {
      status: 'Employed',
      employer: 'Test Corp',
      occupation: 'Tester',
      yearsEmployed: 5,
    },
    taxStatus: 'US Citizen',
    taxFilingStatus: 'Single',
    incomeRange: '$100,000 - $150,000',
    lastLogin: '2024-01-01T00:00:00Z',
    accounts: [
      {
        accountId: 'acct_test_001',
        accountNumber: '1234567890',
        type: 'Individual',
        openedDate: '2023-01-01',
        status: 'active',
        riskProfile: 'Moderate',
        costBasisMethod: 'FIFO',
      },
    ],
    preferences: {
      theme: 'light',
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      language: 'en',
      currency: 'USD',
    },
    security: {
      twoFactorEnabled: false,
      twoFactorMethod: 'none',
      lastPasswordChange: '2024-01-01T00:00:00Z',
      trustedDevices: [],
    },
  },
  {
    id: 'usr_test_002',
    email: 'another.user@example.com',
    password: 'Another@1234',
    firstName: 'Another',
    lastName: 'User',
    phone: '5559876543',
    dateOfBirth: '1985-06-20',
    address: {
      street: '456 Other Ave',
      city: 'Otherton',
      state: 'NY',
      zip: '10001',
      country: 'US',
    },
    employment: {
      status: 'Self-Employed',
      employer: 'Self',
      occupation: 'Consultant',
      yearsEmployed: 10,
    },
    taxStatus: 'US Citizen',
    taxFilingStatus: 'Married Filing Jointly',
    incomeRange: '$200,000 - $500,000',
    lastLogin: '2024-02-01T00:00:00Z',
    accounts: [
      {
        accountId: 'acct_test_002',
        accountNumber: '0987654321',
        type: 'Joint',
        openedDate: '2020-05-15',
        status: 'active',
        riskProfile: 'Aggressive',
        costBasisMethod: 'LIFO',
      },
    ],
    preferences: {
      theme: 'dark',
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: false,
      language: 'en',
      currency: 'USD',
    },
    security: {
      twoFactorEnabled: true,
      twoFactorMethod: 'sms',
      lastPasswordChange: '2024-01-15T00:00:00Z',
      trustedDevices: ['Chrome - Windows'],
    },
  },
];

describe('sessionStore', () => {
  beforeEach(async () => {
    // Reset mocked storage
    const storageUtils = await import('../utils/storageUtils.js');
    storageUtils.__resetStore();
    vi.clearAllMocks();

    // Reset zustand store by re-importing
    vi.resetModules();

    // Re-mock storageUtils for the fresh import
    vi.doMock('../utils/storageUtils.js', () => {
      let store = {};
      return {
        getItem: vi.fn((key) => {
          return store[key] !== undefined ? store[key] : null;
        }),
        setItem: vi.fn((key, value) => {
          store[key] = value;
          return true;
        }),
        removeItem: vi.fn((key) => {
          delete store[key];
          return true;
        }),
        clear: vi.fn(() => {
          store = {};
          return true;
        }),
        isStorageAvailable: vi.fn(() => true),
        __getStore: () => store,
        __resetStore: () => {
          store = {};
        },
      };
    });

    const storeModule = await import('../store/sessionStore.js');
    useSessionStore = storeModule.useSessionStore;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('initial state', () => {
    it('starts with currentUser as null when no session exists in storage', () => {
      const state = useSessionStore.getState();
      expect(state.currentUser).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });

    it('starts with errorBanner as null', () => {
      const state = useSessionStore.getState();
      expect(state.errorBanner).toBeNull();
    });
  });

  describe('login', () => {
    it('sets currentUser and isAuthenticated on successful login', async () => {
      const { setItem: mockSetItem, getItem: mockGetItem } = await import('../utils/storageUtils.js');

      // Seed users
      mockSetItem(STORAGE_KEYS.USERS, MOCK_USERS);

      const state = useSessionStore.getState();
      const result = state.login('usr_test_001');

      expect(result).toBe(true);

      const updatedState = useSessionStore.getState();
      expect(updatedState.isAuthenticated).toBe(true);
      expect(updatedState.currentUser).not.toBeNull();
      expect(updatedState.currentUser.id).toBe('usr_test_001');
      expect(updatedState.currentUser.firstName).toBe('Test');
      expect(updatedState.currentUser.lastName).toBe('User');
    });

    it('updates lastLogin timestamp on login', async () => {
      const { setItem: mockSetItem } = await import('../utils/storageUtils.js');

      mockSetItem(STORAGE_KEYS.USERS, MOCK_USERS);

      const beforeLogin = new Date().toISOString();
      const state = useSessionStore.getState();
      state.login('usr_test_001');

      const updatedState = useSessionStore.getState();
      expect(updatedState.currentUser.lastLogin).toBeDefined();

      const loginTime = new Date(updatedState.currentUser.lastLogin);
      expect(loginTime.getTime()).toBeGreaterThanOrEqual(new Date(beforeLogin).getTime() - 1000);
    });

    it('persists currentUser to storage on login', async () => {
      const { setItem: mockSetItem } = await import('../utils/storageUtils.js');

      mockSetItem(STORAGE_KEYS.USERS, MOCK_USERS);

      const state = useSessionStore.getState();
      state.login('usr_test_001');

      // Check that setItem was called with CURRENT_USER key
      expect(mockSetItem).toHaveBeenCalledWith(
        STORAGE_KEYS.CURRENT_USER,
        expect.objectContaining({
          id: 'usr_test_001',
          firstName: 'Test',
          lastName: 'User',
        }),
      );
    });

    it('persists session marker to storage on login', async () => {
      const { setItem: mockSetItem } = await import('../utils/storageUtils.js');

      mockSetItem(STORAGE_KEYS.USERS, MOCK_USERS);

      const state = useSessionStore.getState();
      state.login('usr_test_001');

      expect(mockSetItem).toHaveBeenCalledWith(
        STORAGE_KEYS.SESSION,
        expect.objectContaining({
          userId: 'usr_test_001',
          loginAt: expect.any(String),
        }),
      );
    });

    it('clears errorBanner on successful login', async () => {
      const { setItem: mockSetItem } = await import('../utils/storageUtils.js');

      mockSetItem(STORAGE_KEYS.USERS, MOCK_USERS);

      // Set an error banner first
      useSessionStore.getState().setErrorBanner('Some error');
      expect(useSessionStore.getState().errorBanner).toBe('Some error');

      // Login should clear it
      useSessionStore.getState().login('usr_test_001');
      expect(useSessionStore.getState().errorBanner).toBeNull();
    });

    it('returns false and sets errorBanner for invalid userId', () => {
      const state = useSessionStore.getState();
      const result = state.login('');

      expect(result).toBe(false);
      expect(useSessionStore.getState().isAuthenticated).toBe(false);
      expect(useSessionStore.getState().errorBanner).toBeTruthy();
    });

    it('returns false and sets errorBanner for null userId', () => {
      const state = useSessionStore.getState();
      const result = state.login(null);

      expect(result).toBe(false);
      expect(useSessionStore.getState().isAuthenticated).toBe(false);
      expect(useSessionStore.getState().errorBanner).toBeTruthy();
    });

    it('returns false and sets errorBanner for non-string userId', () => {
      const state = useSessionStore.getState();
      const result = state.login(123);

      expect(result).toBe(false);
      expect(useSessionStore.getState().isAuthenticated).toBe(false);
    });

    it('returns false when user is not found in storage', async () => {
      const { setItem: mockSetItem } = await import('../utils/storageUtils.js');

      mockSetItem(STORAGE_KEYS.USERS, MOCK_USERS);

      const state = useSessionStore.getState();
      const result = state.login('usr_nonexistent');

      expect(result).toBe(false);
      expect(useSessionStore.getState().isAuthenticated).toBe(false);
      expect(useSessionStore.getState().currentUser).toBeNull();
      expect(useSessionStore.getState().errorBanner).toBeTruthy();
    });

    it('returns false when users list is empty in storage', async () => {
      const { setItem: mockSetItem } = await import('../utils/storageUtils.js');

      mockSetItem(STORAGE_KEYS.USERS, []);

      const state = useSessionStore.getState();
      const result = state.login('usr_test_001');

      expect(result).toBe(false);
      expect(useSessionStore.getState().isAuthenticated).toBe(false);
    });

    it('returns false when setItem fails for current user', async () => {
      const storageUtils = await import('../utils/storageUtils.js');

      storageUtils.setItem(STORAGE_KEYS.USERS, MOCK_USERS);

      // Make setItem fail for CURRENT_USER
      const originalSetItem = storageUtils.setItem;
      storageUtils.setItem = vi.fn((key, value) => {
        if (key === STORAGE_KEYS.CURRENT_USER) {
          return false;
        }
        return originalSetItem(key, value);
      });

      const state = useSessionStore.getState();
      const result = state.login('usr_test_001');

      expect(result).toBe(false);
      expect(useSessionStore.getState().errorBanner).toBeTruthy();

      storageUtils.setItem = originalSetItem;
    });

    it('can login with different users sequentially', async () => {
      const { setItem: mockSetItem } = await import('../utils/storageUtils.js');

      mockSetItem(STORAGE_KEYS.USERS, MOCK_USERS);

      const state = useSessionStore.getState();

      // Login as first user
      state.login('usr_test_001');
      expect(useSessionStore.getState().currentUser.id).toBe('usr_test_001');

      // Login as second user
      useSessionStore.getState().login('usr_test_002');
      expect(useSessionStore.getState().currentUser.id).toBe('usr_test_002');
      expect(useSessionStore.getState().currentUser.firstName).toBe('Another');
    });
  });

  describe('logout', () => {
    it('clears currentUser and sets isAuthenticated to false', async () => {
      const { setItem: mockSetItem } = await import('../utils/storageUtils.js');

      mockSetItem(STORAGE_KEYS.USERS, MOCK_USERS);

      // Login first
      useSessionStore.getState().login('usr_test_001');
      expect(useSessionStore.getState().isAuthenticated).toBe(true);

      // Logout
      useSessionStore.getState().logout();

      const state = useSessionStore.getState();
      expect(state.currentUser).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });

    it('removes currentUser from storage on logout', async () => {
      const { setItem: mockSetItem, removeItem: mockRemoveItem } = await import('../utils/storageUtils.js');

      mockSetItem(STORAGE_KEYS.USERS, MOCK_USERS);

      useSessionStore.getState().login('usr_test_001');
      useSessionStore.getState().logout();

      expect(mockRemoveItem).toHaveBeenCalledWith(STORAGE_KEYS.CURRENT_USER);
    });

    it('removes session marker from storage on logout', async () => {
      const { setItem: mockSetItem, removeItem: mockRemoveItem } = await import('../utils/storageUtils.js');

      mockSetItem(STORAGE_KEYS.USERS, MOCK_USERS);

      useSessionStore.getState().login('usr_test_001');
      useSessionStore.getState().logout();

      expect(mockRemoveItem).toHaveBeenCalledWith(STORAGE_KEYS.SESSION);
    });

    it('clears errorBanner on logout', async () => {
      const { setItem: mockSetItem } = await import('../utils/storageUtils.js');

      mockSetItem(STORAGE_KEYS.USERS, MOCK_USERS);

      useSessionStore.getState().login('usr_test_001');
      useSessionStore.getState().setErrorBanner('Some error');
      expect(useSessionStore.getState().errorBanner).toBe('Some error');

      useSessionStore.getState().logout();
      expect(useSessionStore.getState().errorBanner).toBeNull();
    });

    it('is safe to call logout when not logged in', () => {
      expect(useSessionStore.getState().isAuthenticated).toBe(false);

      // Should not throw
      expect(() => useSessionStore.getState().logout()).not.toThrow();

      expect(useSessionStore.getState().currentUser).toBeNull();
      expect(useSessionStore.getState().isAuthenticated).toBe(false);
    });
  });

  describe('getCurrentUser', () => {
    it('returns null when no user is logged in', () => {
      const result = useSessionStore.getState().getCurrentUser();
      expect(result).toBeNull();
    });

    it('returns the current user after login', async () => {
      const { setItem: mockSetItem } = await import('../utils/storageUtils.js');

      mockSetItem(STORAGE_KEYS.USERS, MOCK_USERS);

      useSessionStore.getState().login('usr_test_001');

      const result = useSessionStore.getState().getCurrentUser();
      expect(result).not.toBeNull();
      expect(result.id).toBe('usr_test_001');
      expect(result.firstName).toBe('Test');
      expect(result.lastName).toBe('User');
      expect(result.email).toBe('test.user@example.com');
    });

    it('returns null after logout', async () => {
      const { setItem: mockSetItem } = await import('../utils/storageUtils.js');

      mockSetItem(STORAGE_KEYS.USERS, MOCK_USERS);

      useSessionStore.getState().login('usr_test_001');
      expect(useSessionStore.getState().getCurrentUser()).not.toBeNull();

      useSessionStore.getState().logout();
      expect(useSessionStore.getState().getCurrentUser()).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('is false initially', () => {
      expect(useSessionStore.getState().isAuthenticated).toBe(false);
    });

    it('is true after successful login', async () => {
      const { setItem: mockSetItem } = await import('../utils/storageUtils.js');

      mockSetItem(STORAGE_KEYS.USERS, MOCK_USERS);

      useSessionStore.getState().login('usr_test_001');
      expect(useSessionStore.getState().isAuthenticated).toBe(true);
    });

    it('is false after logout', async () => {
      const { setItem: mockSetItem } = await import('../utils/storageUtils.js');

      mockSetItem(STORAGE_KEYS.USERS, MOCK_USERS);

      useSessionStore.getState().login('usr_test_001');
      expect(useSessionStore.getState().isAuthenticated).toBe(true);

      useSessionStore.getState().logout();
      expect(useSessionStore.getState().isAuthenticated).toBe(false);
    });

    it('remains false after failed login', async () => {
      const { setItem: mockSetItem } = await import('../utils/storageUtils.js');

      mockSetItem(STORAGE_KEYS.USERS, MOCK_USERS);

      useSessionStore.getState().login('usr_nonexistent');
      expect(useSessionStore.getState().isAuthenticated).toBe(false);
    });
  });

  describe('setErrorBanner', () => {
    it('sets the error banner message', () => {
      useSessionStore.getState().setErrorBanner('Storage is unavailable');
      expect(useSessionStore.getState().errorBanner).toBe('Storage is unavailable');
    });

    it('overwrites previous error banner message', () => {
      useSessionStore.getState().setErrorBanner('First error');
      useSessionStore.getState().setErrorBanner('Second error');
      expect(useSessionStore.getState().errorBanner).toBe('Second error');
    });

    it('does not set error banner for empty string', () => {
      useSessionStore.getState().setErrorBanner('');
      expect(useSessionStore.getState().errorBanner).toBeNull();
    });

    it('does not set error banner for null', () => {
      useSessionStore.getState().setErrorBanner(null);
      expect(useSessionStore.getState().errorBanner).toBeNull();
    });

    it('does not set error banner for non-string value', () => {
      useSessionStore.getState().setErrorBanner(123);
      expect(useSessionStore.getState().errorBanner).toBeNull();
    });
  });

  describe('clearErrorBanner', () => {
    it('clears the error banner', () => {
      useSessionStore.getState().setErrorBanner('Some error');
      expect(useSessionStore.getState().errorBanner).toBe('Some error');

      useSessionStore.getState().clearErrorBanner();
      expect(useSessionStore.getState().errorBanner).toBeNull();
    });

    it('is safe to call when no error banner is set', () => {
      expect(useSessionStore.getState().errorBanner).toBeNull();

      expect(() => useSessionStore.getState().clearErrorBanner()).not.toThrow();
      expect(useSessionStore.getState().errorBanner).toBeNull();
    });
  });

  describe('syncAcrossTabs', () => {
    it('returns a cleanup function', () => {
      const cleanup = useSessionStore.getState().syncAcrossTabs();
      expect(typeof cleanup).toBe('function');
      cleanup();
    });

    it('registers a storage event listener', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');

      const cleanup = useSessionStore.getState().syncAcrossTabs();

      expect(addEventListenerSpy).toHaveBeenCalledWith('storage', expect.any(Function));

      cleanup();
      addEventListenerSpy.mockRestore();
    });

    it('removes the storage event listener on cleanup', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      const cleanup = useSessionStore.getState().syncAcrossTabs();
      cleanup();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('storage', expect.any(Function));

      removeEventListenerSpy.mockRestore();
    });

    it('sets currentUser to null when CURRENT_USER key is removed in another tab', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');

      const cleanup = useSessionStore.getState().syncAcrossTabs();

      // Get the handler that was registered
      const storageHandler = addEventListenerSpy.mock.calls.find(
        (call) => call[0] === 'storage',
      )[1];

      // Simulate another tab logging out
      const event = new StorageEvent('storage', {
        key: STORAGE_KEYS.CURRENT_USER,
        newValue: null,
      });

      act(() => {
        storageHandler(event);
      });

      expect(useSessionStore.getState().currentUser).toBeNull();
      expect(useSessionStore.getState().isAuthenticated).toBe(false);

      cleanup();
      addEventListenerSpy.mockRestore();
    });

    it('updates currentUser when CURRENT_USER key is set in another tab', async () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');

      const cleanup = useSessionStore.getState().syncAcrossTabs();

      // Get the handler that was registered
      const storageHandler = addEventListenerSpy.mock.calls.find(
        (call) => call[0] === 'storage',
      )[1];

      const newUser = {
        id: 'usr_test_002',
        firstName: 'Another',
        lastName: 'User',
        email: 'another.user@example.com',
      };

      // Simulate another tab logging in
      const event = new StorageEvent('storage', {
        key: STORAGE_KEYS.CURRENT_USER,
        newValue: JSON.stringify(newUser),
      });

      act(() => {
        storageHandler(event);
      });

      expect(useSessionStore.getState().currentUser).not.toBeNull();
      expect(useSessionStore.getState().currentUser.id).toBe('usr_test_002');
      expect(useSessionStore.getState().isAuthenticated).toBe(true);

      cleanup();
      addEventListenerSpy.mockRestore();
    });

    it('ignores storage events for unrelated keys', async () => {
      const { setItem: mockSetItem } = await import('../utils/storageUtils.js');

      mockSetItem(STORAGE_KEYS.USERS, MOCK_USERS);

      // Login first
      useSessionStore.getState().login('usr_test_001');

      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');

      const cleanup = useSessionStore.getState().syncAcrossTabs();

      const storageHandler = addEventListenerSpy.mock.calls.find(
        (call) => call[0] === 'storage',
      )[1];

      // Simulate a storage event for an unrelated key
      const event = new StorageEvent('storage', {
        key: 'some_other_key',
        newValue: 'some_value',
      });

      act(() => {
        storageHandler(event);
      });

      // State should remain unchanged
      expect(useSessionStore.getState().currentUser.id).toBe('usr_test_001');
      expect(useSessionStore.getState().isAuthenticated).toBe(true);

      cleanup();
      addEventListenerSpy.mockRestore();
    });

    it('handles invalid JSON in storage event gracefully', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');

      const cleanup = useSessionStore.getState().syncAcrossTabs();

      const storageHandler = addEventListenerSpy.mock.calls.find(
        (call) => call[0] === 'storage',
      )[1];

      // Simulate a storage event with invalid JSON
      const event = new StorageEvent('storage', {
        key: STORAGE_KEYS.CURRENT_USER,
        newValue: '{invalid json',
      });

      // Should not throw
      expect(() => {
        act(() => {
          storageHandler(event);
        });
      }).not.toThrow();

      cleanup();
      addEventListenerSpy.mockRestore();
    });

    it('ignores storage event with valid JSON but no id field', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');

      const cleanup = useSessionStore.getState().syncAcrossTabs();

      const storageHandler = addEventListenerSpy.mock.calls.find(
        (call) => call[0] === 'storage',
      )[1];

      // Simulate a storage event with valid JSON but no id
      const event = new StorageEvent('storage', {
        key: STORAGE_KEYS.CURRENT_USER,
        newValue: JSON.stringify({ name: 'no id here' }),
      });

      act(() => {
        storageHandler(event);
      });

      // State should not be updated since there's no id
      expect(useSessionStore.getState().isAuthenticated).toBe(false);

      cleanup();
      addEventListenerSpy.mockRestore();
    });

    it('clears errorBanner when another tab logs in', () => {
      useSessionStore.getState().setErrorBanner('Some error');
      expect(useSessionStore.getState().errorBanner).toBe('Some error');

      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');

      const cleanup = useSessionStore.getState().syncAcrossTabs();

      const storageHandler = addEventListenerSpy.mock.calls.find(
        (call) => call[0] === 'storage',
      )[1];

      const newUser = {
        id: 'usr_test_001',
        firstName: 'Test',
        lastName: 'User',
      };

      const event = new StorageEvent('storage', {
        key: STORAGE_KEYS.CURRENT_USER,
        newValue: JSON.stringify(newUser),
      });

      act(() => {
        storageHandler(event);
      });

      expect(useSessionStore.getState().errorBanner).toBeNull();

      cleanup();
      addEventListenerSpy.mockRestore();
    });

    it('clears errorBanner when another tab logs out', () => {
      useSessionStore.getState().setErrorBanner('Some error');

      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');

      const cleanup = useSessionStore.getState().syncAcrossTabs();

      const storageHandler = addEventListenerSpy.mock.calls.find(
        (call) => call[0] === 'storage',
      )[1];

      const event = new StorageEvent('storage', {
        key: STORAGE_KEYS.CURRENT_USER,
        newValue: null,
      });

      act(() => {
        storageHandler(event);
      });

      expect(useSessionStore.getState().errorBanner).toBeNull();

      cleanup();
      addEventListenerSpy.mockRestore();
    });
  });

  describe('hydration from storage', () => {
    it('hydrates currentUser from storage on store creation', async () => {
      // Reset modules to test hydration
      vi.resetModules();

      const storedUser = {
        id: 'usr_test_001',
        firstName: 'Test',
        lastName: 'User',
        email: 'test.user@example.com',
      };

      vi.doMock('../utils/storageUtils.js', () => {
        const store = {
          [STORAGE_KEYS.CURRENT_USER]: storedUser,
        };
        return {
          getItem: vi.fn((key) => {
            return store[key] !== undefined ? store[key] : null;
          }),
          setItem: vi.fn((key, value) => {
            store[key] = value;
            return true;
          }),
          removeItem: vi.fn((key) => {
            delete store[key];
            return true;
          }),
          clear: vi.fn(() => true),
          isStorageAvailable: vi.fn(() => true),
        };
      });

      const { useSessionStore: hydratedStore } = await import('../store/sessionStore.js');

      expect(hydratedStore.getState().currentUser).not.toBeNull();
      expect(hydratedStore.getState().currentUser.id).toBe('usr_test_001');
      expect(hydratedStore.getState().isAuthenticated).toBe(true);
    });

    it('starts unauthenticated when stored user has no id', async () => {
      vi.resetModules();

      vi.doMock('../utils/storageUtils.js', () => {
        const store = {
          [STORAGE_KEYS.CURRENT_USER]: { name: 'no id' },
        };
        return {
          getItem: vi.fn((key) => {
            return store[key] !== undefined ? store[key] : null;
          }),
          setItem: vi.fn(() => true),
          removeItem: vi.fn(() => true),
          clear: vi.fn(() => true),
          isStorageAvailable: vi.fn(() => true),
        };
      });

      const { useSessionStore: hydratedStore } = await import('../store/sessionStore.js');

      expect(hydratedStore.getState().currentUser).toBeNull();
      expect(hydratedStore.getState().isAuthenticated).toBe(false);
    });
  });

  describe('login updates users list', () => {
    it('updates lastLogin in the users list in storage', async () => {
      const { setItem: mockSetItem, getItem: mockGetItem } = await import('../utils/storageUtils.js');

      mockSetItem(STORAGE_KEYS.USERS, MOCK_USERS);

      useSessionStore.getState().login('usr_test_001');

      // Verify setItem was called with updated users list
      const usersSetCalls = mockSetItem.mock.calls.filter(
        (call) => call[0] === STORAGE_KEYS.USERS,
      );

      // Should have been called at least twice: once for seeding, once for updating lastLogin
      expect(usersSetCalls.length).toBeGreaterThanOrEqual(2);

      const lastUsersCall = usersSetCalls[usersSetCalls.length - 1];
      const updatedUsers = lastUsersCall[1];
      const updatedUser = updatedUsers.find((u) => u.id === 'usr_test_001');

      expect(updatedUser).toBeDefined();
      expect(updatedUser.lastLogin).toBeDefined();
      expect(new Date(updatedUser.lastLogin).getTime()).not.toBeNaN();
    });
  });
});