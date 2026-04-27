/**
 * Zustand store for user data management and CRUD operations.
 * Provides centralized access to all user-related data including
 * holdings, activity, documents, banks, beneficiaries, and cost basis.
 * All mutations persist to localStorage via storageUtils.
 * @module store/userStore
 */

import { create } from 'zustand';
import { getItem, setItem } from '../utils/storageUtils.js';
import { STORAGE_KEYS } from '../utils/constants.js';
import { getHoldingsByUserId, getPortfolioSummary } from '../mock/holdings.js';
import { getActivityByUserId, getActivitySummary } from '../mock/activity.js';
import { getDocumentsByUserId, getDocumentSummary } from '../mock/documents.js';
import { getBanksByUserId, getBankSummary } from '../mock/banks.js';
import {
  getBeneficiariesByUserId,
  getBeneficiarySummary,
} from '../mock/beneficiaries.js';
import {
  getCostBasisByUserId,
  getCostBasisSummary,
  getTaxLotsByUserId,
} from '../mock/costBasis.js';
import { getPreferencesByUserId } from '../mock/seedData.js';

/**
 * Storage keys for domain data.
 * @type {object}
 */
const DOMAIN_KEYS = {
  BANKS: 'meridian_banks',
  BENEFICIARIES: 'meridian_beneficiaries',
  COST_BASIS: 'meridian_cost_basis',
  PREFERENCES: 'meridian_preferences',
};

/**
 * Generate a simple unique ID.
 * @param {string} prefix - Prefix for the ID
 * @returns {string}
 */
function generateId(prefix) {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}_${random}`;
}

/**
 * @typedef {import('../mock/users.js').MockUser} MockUser
 */

/**
 * @typedef {object} UserStoreState
 * @property {MockUser[]} users - All users array
 * @property {MockUser | null} selectedUser - Currently selected user profile
 * @property {function(): MockUser[]} getUsers - Retrieve all users from storage
 * @property {function(string): MockUser | null} getUserById - Retrieve a user by ID
 * @property {function(object): boolean} addUser - Add a new user
 * @property {function(string, object): boolean} updateUser - Update a user by ID
 * @property {function(string): object} getHoldings - Get holdings for a user
 * @property {function(string): object} getActivity - Get activity for a user
 * @property {function(string): object} getDocuments - Get documents for a user
 * @property {function(string): object} getBanks - Get banks for a user
 * @property {function(string): object} getBeneficiaries - Get beneficiaries for a user
 * @property {function(string): object} getCostBasis - Get cost basis for a user
 * @property {function(string, object): boolean} updatePreferences - Update user preferences
 * @property {function(string, object): boolean} updateSecurity - Update user security settings
 * @property {function(string, object): boolean} addBank - Add a linked bank for a user
 * @property {function(string, string): boolean} removeBank - Remove a linked bank
 * @property {function(string, object): boolean} addBeneficiary - Add a beneficiary for a user
 * @property {function(string, string, object): boolean} updateBeneficiary - Update a beneficiary
 * @property {function(string, string): boolean} removeBeneficiary - Remove a beneficiary
 * @property {function(string, string): boolean} updateCostBasis - Update cost basis method
 */

/**
 * Zustand store for user data management.
 * @type {import('zustand').UseBoundStore<import('zustand').StoreApi<UserStoreState>>}
 */
export const useUserStore = create((set, get) => {
  const initialUsers = getItem(STORAGE_KEYS.USERS) || [];

  return {
    users: initialUsers,
    selectedUser: null,

    /**
     * Retrieve all users from storage and update state.
     * @returns {MockUser[]} Array of all users
     */
    getUsers: () => {
      const users = getItem(STORAGE_KEYS.USERS) || [];
      set({ users });
      return users;
    },

    /**
     * Retrieve a user by ID and set as selectedUser.
     * @param {string} id - The user ID
     * @returns {MockUser | null} The user object or null
     */
    getUserById: (id) => {
      if (!id || typeof id !== 'string') {
        return null;
      }

      const users = getItem(STORAGE_KEYS.USERS) || [];
      const user = users.find((u) => u.id === id) || null;

      set({ selectedUser: user });
      return user;
    },

    /**
     * Add a new user to storage.
     * @param {object} userData - The user data to add
     * @returns {boolean} True if the user was added successfully
     */
    addUser: (userData) => {
      if (!userData || typeof userData !== 'object') {
        return false;
      }

      const users = getItem(STORAGE_KEYS.USERS) || [];

      const newUser = {
        id: userData.id || generateId('usr'),
        ...userData,
      };

      // Check for duplicate ID
      if (users.some((u) => u.id === newUser.id)) {
        return false;
      }

      // Check for duplicate email
      if (userData.email && users.some((u) => u.email === userData.email)) {
        return false;
      }

      const updatedUsers = [...users, newUser];
      const stored = setItem(STORAGE_KEYS.USERS, updatedUsers);

      if (stored) {
        set({ users: updatedUsers });
        return true;
      }

      return false;
    },

    /**
     * Update a user by ID.
     * @param {string} id - The user ID to update
     * @param {object} updates - The fields to update
     * @returns {boolean} True if the user was updated successfully
     */
    updateUser: (id, updates) => {
      if (!id || typeof id !== 'string' || !updates || typeof updates !== 'object') {
        return false;
      }

      const users = getItem(STORAGE_KEYS.USERS) || [];
      const userIndex = users.findIndex((u) => u.id === id);

      if (userIndex === -1) {
        return false;
      }

      const updatedUser = { ...users[userIndex], ...updates, id };
      const updatedUsers = [...users];
      updatedUsers[userIndex] = updatedUser;

      const stored = setItem(STORAGE_KEYS.USERS, updatedUsers);

      if (stored) {
        set({ users: updatedUsers });

        // Update selectedUser if it matches
        const { selectedUser } = get();
        if (selectedUser && selectedUser.id === id) {
          set({ selectedUser: updatedUser });
        }

        // Also update current user in session if it matches
        const currentUser = getItem(STORAGE_KEYS.CURRENT_USER);
        if (currentUser && currentUser.id === id) {
          setItem(STORAGE_KEYS.CURRENT_USER, updatedUser);
        }

        return true;
      }

      return false;
    },

    /**
     * Get holdings data for a user.
     * @param {string} userId - The user ID
     * @returns {{ holdings: import('../mock/holdings.js').Holding[], summary: object }}
     */
    getHoldings: (userId) => {
      if (!userId || typeof userId !== 'string') {
        return { holdings: [], summary: { totalMarketValue: 0, totalCostBasis: 0, totalGainLoss: 0, totalGainLossPercent: 0, holdingsCount: 0 } };
      }

      const holdings = getHoldingsByUserId(userId);
      const summary = getPortfolioSummary(userId);

      return { holdings, summary };
    },

    /**
     * Get activity/transaction data for a user.
     * @param {string} userId - The user ID
     * @returns {{ transactions: import('../mock/activity.js').Transaction[], summary: object }}
     */
    getActivity: (userId) => {
      if (!userId || typeof userId !== 'string') {
        return { transactions: [], summary: { totalTransactions: 0, totalBuys: 0, totalSells: 0, totalDividends: 0, totalDeposits: 0, totalWithdrawals: 0, totalFees: 0, pendingCount: 0, failedCount: 0 } };
      }

      const transactions = getActivityByUserId(userId);
      const summary = getActivitySummary(userId);

      return { transactions, summary };
    },

    /**
     * Get documents for a user.
     * @param {string} userId - The user ID
     * @returns {{ documents: import('../mock/documents.js').Document[], summary: object }}
     */
    getDocuments: (userId) => {
      if (!userId || typeof userId !== 'string') {
        return { documents: [], summary: { totalDocuments: 0, statementCount: 0, taxFormCount: 0, tradeConfirmationCount: 0, prospectusCount: 0, totalFileSize: 0 } };
      }

      const documents = getDocumentsByUserId(userId);
      const summary = getDocumentSummary(userId);

      return { documents, summary };
    },

    /**
     * Get linked banks for a user.
     * @param {string} userId - The user ID
     * @returns {{ banks: import('../mock/banks.js').LinkedBank[], summary: object }}
     */
    getBanks: (userId) => {
      if (!userId || typeof userId !== 'string') {
        return { banks: [], summary: { totalBanks: 0, verifiedCount: 0, pendingCount: 0, checkingCount: 0, savingsCount: 0 } };
      }

      const banks = getBanksByUserId(userId);
      const summary = getBankSummary(userId);

      return { banks, summary };
    },

    /**
     * Get beneficiaries for a user.
     * @param {string} userId - The user ID
     * @returns {{ beneficiaries: import('../mock/beneficiaries.js').Beneficiary[], summary: object }}
     */
    getBeneficiaries: (userId) => {
      if (!userId || typeof userId !== 'string') {
        return { beneficiaries: [], summary: { totalBeneficiaries: 0, primaryCount: 0, contingentCount: 0, primaryTotalShare: 0, contingentTotalShare: 0 } };
      }

      const beneficiaries = getBeneficiariesByUserId(userId);
      const summary = getBeneficiarySummary(userId);

      return { beneficiaries, summary };
    },

    /**
     * Get cost basis data for a user.
     * @param {string} userId - The user ID
     * @returns {{ costBasis: import('../mock/costBasis.js').UserCostBasis | null, taxLots: import('../mock/costBasis.js').TaxLot[], summary: object }}
     */
    getCostBasis: (userId) => {
      if (!userId || typeof userId !== 'string') {
        return { costBasis: null, taxLots: [], summary: { totalLots: 0, totalCostBasis: 0, totalCurrentValue: 0, totalGainLoss: 0, totalGainLossPercent: 0, shortTermLots: 0, longTermLots: 0, shortTermGainLoss: 0, longTermGainLoss: 0, currentMethod: 'FIFO' } };
      }

      const costBasis = getCostBasisByUserId(userId);
      const taxLots = getTaxLotsByUserId(userId);
      const summary = getCostBasisSummary(userId);

      return { costBasis, taxLots, summary };
    },

    /**
     * Update user preferences.
     * @param {string} userId - The user ID
     * @param {object} prefs - The preferences to update
     * @returns {boolean} True if preferences were updated successfully
     */
    updatePreferences: (userId, prefs) => {
      if (!userId || typeof userId !== 'string' || !prefs || typeof prefs !== 'object') {
        return false;
      }

      // Update preferences in the preferences storage
      const allPreferences = getItem(DOMAIN_KEYS.PREFERENCES) || [];
      const prefIndex = allPreferences.findIndex((entry) => entry.userId === userId);

      if (prefIndex !== -1) {
        allPreferences[prefIndex] = {
          ...allPreferences[prefIndex],
          preferences: {
            ...allPreferences[prefIndex].preferences,
            ...prefs,
          },
        };
      } else {
        allPreferences.push({
          userId,
          preferences: { ...prefs },
        });
      }

      const prefsStored = setItem(DOMAIN_KEYS.PREFERENCES, allPreferences);

      // Also update the user's preferences in the users list
      const users = getItem(STORAGE_KEYS.USERS) || [];
      const userIndex = users.findIndex((u) => u.id === userId);

      if (userIndex !== -1 && users[userIndex].preferences) {
        users[userIndex] = {
          ...users[userIndex],
          preferences: {
            ...users[userIndex].preferences,
            ...prefs,
          },
        };

        const usersStored = setItem(STORAGE_KEYS.USERS, users);

        if (usersStored) {
          set({ users });

          const { selectedUser } = get();
          if (selectedUser && selectedUser.id === userId) {
            set({ selectedUser: users[userIndex] });
          }

          const currentUser = getItem(STORAGE_KEYS.CURRENT_USER);
          if (currentUser && currentUser.id === userId) {
            setItem(STORAGE_KEYS.CURRENT_USER, users[userIndex]);
          }
        }
      }

      return prefsStored;
    },

    /**
     * Update user security settings.
     * @param {string} userId - The user ID
     * @param {object} data - The security settings to update
     * @returns {boolean} True if security settings were updated successfully
     */
    updateSecurity: (userId, data) => {
      if (!userId || typeof userId !== 'string' || !data || typeof data !== 'object') {
        return false;
      }

      const users = getItem(STORAGE_KEYS.USERS) || [];
      const userIndex = users.findIndex((u) => u.id === userId);

      if (userIndex === -1) {
        return false;
      }

      users[userIndex] = {
        ...users[userIndex],
        security: {
          ...users[userIndex].security,
          ...data,
        },
      };

      const stored = setItem(STORAGE_KEYS.USERS, users);

      if (stored) {
        set({ users });

        const { selectedUser } = get();
        if (selectedUser && selectedUser.id === userId) {
          set({ selectedUser: users[userIndex] });
        }

        const currentUser = getItem(STORAGE_KEYS.CURRENT_USER);
        if (currentUser && currentUser.id === userId) {
          setItem(STORAGE_KEYS.CURRENT_USER, users[userIndex]);
        }

        return true;
      }

      return false;
    },

    /**
     * Add a linked bank for a user.
     * @param {string} userId - The user ID
     * @param {object} bank - The bank data to add
     * @returns {boolean} True if the bank was added successfully
     */
    addBank: (userId, bank) => {
      if (!userId || typeof userId !== 'string' || !bank || typeof bank !== 'object') {
        return false;
      }

      const allBanks = getItem(DOMAIN_KEYS.BANKS) || [];
      const userBanksIndex = allBanks.findIndex((entry) => entry.userId === userId);

      const newBank = {
        id: bank.id || generateId('bnk'),
        userId,
        ...bank,
      };

      if (userBanksIndex !== -1) {
        allBanks[userBanksIndex] = {
          ...allBanks[userBanksIndex],
          banks: [...allBanks[userBanksIndex].banks, newBank],
        };
      } else {
        allBanks.push({
          userId,
          banks: [newBank],
        });
      }

      return setItem(DOMAIN_KEYS.BANKS, allBanks);
    },

    /**
     * Remove a linked bank for a user.
     * @param {string} userId - The user ID
     * @param {string} bankId - The bank ID to remove
     * @returns {boolean} True if the bank was removed successfully
     */
    removeBank: (userId, bankId) => {
      if (!userId || typeof userId !== 'string' || !bankId || typeof bankId !== 'string') {
        return false;
      }

      const allBanks = getItem(DOMAIN_KEYS.BANKS) || [];
      const userBanksIndex = allBanks.findIndex((entry) => entry.userId === userId);

      if (userBanksIndex === -1) {
        return false;
      }

      const currentBanks = allBanks[userBanksIndex].banks || [];
      const filteredBanks = currentBanks.filter((b) => b.id !== bankId);

      if (filteredBanks.length === currentBanks.length) {
        // Bank not found
        return false;
      }

      allBanks[userBanksIndex] = {
        ...allBanks[userBanksIndex],
        banks: filteredBanks,
      };

      return setItem(DOMAIN_KEYS.BANKS, allBanks);
    },

    /**
     * Add a beneficiary for a user.
     * @param {string} userId - The user ID
     * @param {object} ben - The beneficiary data to add
     * @returns {boolean} True if the beneficiary was added successfully
     */
    addBeneficiary: (userId, ben) => {
      if (!userId || typeof userId !== 'string' || !ben || typeof ben !== 'object') {
        return false;
      }

      const allBeneficiaries = getItem(DOMAIN_KEYS.BENEFICIARIES) || [];
      const userBenIndex = allBeneficiaries.findIndex((entry) => entry.userId === userId);

      const newBeneficiary = {
        id: ben.id || generateId('ben'),
        userId,
        ...ben,
      };

      if (userBenIndex !== -1) {
        allBeneficiaries[userBenIndex] = {
          ...allBeneficiaries[userBenIndex],
          beneficiaries: [...allBeneficiaries[userBenIndex].beneficiaries, newBeneficiary],
        };
      } else {
        allBeneficiaries.push({
          userId,
          beneficiaries: [newBeneficiary],
        });
      }

      return setItem(DOMAIN_KEYS.BENEFICIARIES, allBeneficiaries);
    },

    /**
     * Update a beneficiary for a user.
     * @param {string} userId - The user ID
     * @param {string} benId - The beneficiary ID to update
     * @param {object} data - The fields to update
     * @returns {boolean} True if the beneficiary was updated successfully
     */
    updateBeneficiary: (userId, benId, data) => {
      if (
        !userId || typeof userId !== 'string' ||
        !benId || typeof benId !== 'string' ||
        !data || typeof data !== 'object'
      ) {
        return false;
      }

      const allBeneficiaries = getItem(DOMAIN_KEYS.BENEFICIARIES) || [];
      const userBenIndex = allBeneficiaries.findIndex((entry) => entry.userId === userId);

      if (userBenIndex === -1) {
        return false;
      }

      const beneficiaries = allBeneficiaries[userBenIndex].beneficiaries || [];
      const benIndex = beneficiaries.findIndex((b) => b.id === benId);

      if (benIndex === -1) {
        return false;
      }

      beneficiaries[benIndex] = {
        ...beneficiaries[benIndex],
        ...data,
        id: benId,
        userId,
      };

      allBeneficiaries[userBenIndex] = {
        ...allBeneficiaries[userBenIndex],
        beneficiaries: [...beneficiaries],
      };

      return setItem(DOMAIN_KEYS.BENEFICIARIES, allBeneficiaries);
    },

    /**
     * Remove a beneficiary for a user.
     * @param {string} userId - The user ID
     * @param {string} benId - The beneficiary ID to remove
     * @returns {boolean} True if the beneficiary was removed successfully
     */
    removeBeneficiary: (userId, benId) => {
      if (!userId || typeof userId !== 'string' || !benId || typeof benId !== 'string') {
        return false;
      }

      const allBeneficiaries = getItem(DOMAIN_KEYS.BENEFICIARIES) || [];
      const userBenIndex = allBeneficiaries.findIndex((entry) => entry.userId === userId);

      if (userBenIndex === -1) {
        return false;
      }

      const currentBeneficiaries = allBeneficiaries[userBenIndex].beneficiaries || [];
      const filteredBeneficiaries = currentBeneficiaries.filter((b) => b.id !== benId);

      if (filteredBeneficiaries.length === currentBeneficiaries.length) {
        // Beneficiary not found
        return false;
      }

      allBeneficiaries[userBenIndex] = {
        ...allBeneficiaries[userBenIndex],
        beneficiaries: filteredBeneficiaries,
      };

      return setItem(DOMAIN_KEYS.BENEFICIARIES, allBeneficiaries);
    },

    /**
     * Update the cost basis method for a user.
     * @param {string} userId - The user ID
     * @param {string} method - The new cost basis method
     * @returns {boolean} True if the cost basis method was updated successfully
     */
    updateCostBasis: (userId, method) => {
      if (!userId || typeof userId !== 'string' || !method || typeof method !== 'string') {
        return false;
      }

      const allCostBasis = getItem(DOMAIN_KEYS.COST_BASIS) || [];
      const userCbIndex = allCostBasis.findIndex((entry) => entry.userId === userId);

      if (userCbIndex === -1) {
        return false;
      }

      allCostBasis[userCbIndex] = {
        ...allCostBasis[userCbIndex],
        currentMethod: method,
      };

      return setItem(DOMAIN_KEYS.COST_BASIS, allCostBasis);
    },
  };
});