/**
 * Zustand session/auth state management store.
 * Implements SessionManager interface for session/user state.
 * Hydrates from localStorage on creation and supports cross-tab sync.
 * @module store/sessionStore
 */

import { create } from 'zustand';
import { getItem, setItem, removeItem } from '../utils/storageUtils.js';
import { STORAGE_KEYS } from '../utils/constants.js';

/**
 * Retrieve the full user object from the seeded users list by userId.
 * @param {string} userId - The user ID to look up
 * @returns {import('../mock/users.js').MockUser | null} The user object or null
 */
function findUserById(userId) {
  if (!userId || typeof userId !== 'string') {
    return null;
  }

  const users = getItem(STORAGE_KEYS.USERS);

  if (!users || !Array.isArray(users)) {
    return null;
  }

  return users.find((user) => user.id === userId) || null;
}

/**
 * Read the current user from storage.
 * @returns {import('../mock/users.js').MockUser | null}
 */
function hydrateCurrentUser() {
  const stored = getItem(STORAGE_KEYS.CURRENT_USER);

  if (!stored || typeof stored !== 'object' || !stored.id) {
    return null;
  }

  return stored;
}

/**
 * @typedef {object} SessionState
 * @property {import('../mock/users.js').MockUser | null} currentUser - The currently authenticated user
 * @property {boolean} isAuthenticated - Whether a user is currently logged in
 * @property {string | null} errorBanner - Error banner message to display, or null
 * @property {function(string): boolean} login - Log in a user by userId
 * @property {function(): void} logout - Log out the current user
 * @property {function(): import('../mock/users.js').MockUser | null} getCurrentUser - Get the current user
 * @property {function(string): void} setErrorBanner - Set an error banner message
 * @property {function(): void} clearErrorBanner - Clear the error banner
 * @property {function(): function(): void} syncAcrossTabs - Start listening for cross-tab storage events; returns cleanup function
 */

/**
 * Zustand store for session/auth state management.
 * @type {import('zustand').UseBoundStore<import('zustand').StoreApi<SessionState>>}
 */
export const useSessionStore = create((set, get) => {
  const hydrated = hydrateCurrentUser();

  return {
    currentUser: hydrated,
    isAuthenticated: hydrated !== null,
    errorBanner: null,

    /**
     * Log in a user by userId.
     * Finds the user in the seeded users list, updates lastLogin,
     * persists to storage, and updates store state.
     * @param {string} userId - The user ID to log in
     * @returns {boolean} True if login succeeded
     */
    login: (userId) => {
      if (!userId || typeof userId !== 'string') {
        set({ errorBanner: 'Invalid user ID provided.' });
        return false;
      }

      const user = findUserById(userId);

      if (!user) {
        set({ errorBanner: 'User not found. Please try again.' });
        return false;
      }

      const now = new Date().toISOString();
      const updatedUser = {
        ...user,
        lastLogin: now,
      };

      // Persist current user to storage
      const stored = setItem(STORAGE_KEYS.CURRENT_USER, updatedUser);

      if (!stored) {
        set({ errorBanner: 'Failed to save session. Storage may be unavailable.' });
        return false;
      }

      // Update the user's lastLogin in the users list
      const users = getItem(STORAGE_KEYS.USERS);
      if (users && Array.isArray(users)) {
        const updatedUsers = users.map((u) => {
          if (u.id === userId) {
            return { ...u, lastLogin: now };
          }
          return u;
        });
        setItem(STORAGE_KEYS.USERS, updatedUsers);
      }

      // Persist session marker
      setItem(STORAGE_KEYS.SESSION, { userId: updatedUser.id, loginAt: now });

      set({
        currentUser: updatedUser,
        isAuthenticated: true,
        errorBanner: null,
      });

      return true;
    },

    /**
     * Log out the current user.
     * Clears session from storage and resets store state.
     */
    logout: () => {
      removeItem(STORAGE_KEYS.CURRENT_USER);
      removeItem(STORAGE_KEYS.SESSION);

      set({
        currentUser: null,
        isAuthenticated: false,
        errorBanner: null,
      });
    },

    /**
     * Get the current user from store state.
     * @returns {import('../mock/users.js').MockUser | null}
     */
    getCurrentUser: () => {
      return get().currentUser;
    },

    /**
     * Set an error banner message.
     * @param {string} message - The error message to display
     */
    setErrorBanner: (message) => {
      if (!message || typeof message !== 'string') {
        return;
      }
      set({ errorBanner: message });
    },

    /**
     * Clear the error banner.
     */
    clearErrorBanner: () => {
      set({ errorBanner: null });
    },

    /**
     * Start listening for cross-tab storage events to sync session state.
     * When another tab logs in or out, this tab's state will update accordingly.
     * @returns {function(): void} Cleanup function to remove the event listener
     */
    syncAcrossTabs: () => {
      /**
       * Handle storage events from other tabs.
       * @param {StorageEvent} event
       */
      function handleStorageEvent(event) {
        if (event.key === STORAGE_KEYS.CURRENT_USER) {
          if (event.newValue === null) {
            // User logged out in another tab
            set({
              currentUser: null,
              isAuthenticated: false,
              errorBanner: null,
            });
          } else {
            // User logged in or updated in another tab
            try {
              const parsed = JSON.parse(event.newValue);
              if (parsed && typeof parsed === 'object' && parsed.id) {
                set({
                  currentUser: parsed,
                  isAuthenticated: true,
                  errorBanner: null,
                });
              }
            } catch (_) {
              // Ignore parse errors from other tabs
            }
          }
        }
      }

      if (typeof window !== 'undefined') {
        window.addEventListener('storage', handleStorageEvent);

        return () => {
          window.removeEventListener('storage', handleStorageEvent);
        };
      }

      return () => {};
    },
  };
});