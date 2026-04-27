/**
 * Master data seeding orchestrator.
 * Checks if mock data exists in storage and seeds all data modules
 * on first app load. Called once from App.jsx.
 * @module mock/seedData
 */

import { getItem, setItem } from '../utils/storageUtils.js';
import { seedUsers } from './users.js';
import { seedHoldings } from './holdings.js';
import { seedActivity } from './activity.js';
import { seedDocuments } from './documents.js';
import { seedBanks } from './banks.js';
import { seedBeneficiaries } from './beneficiaries.js';
import { seedCostBasis } from './costBasis.js';
import { seedProducts, seedServices } from './products.js';

/**
 * Storage key used to track whether seeding has already been performed.
 * @type {string}
 */
const SEED_STATUS_KEY = 'meridian_seed_status';

/**
 * Storage key for user preferences data.
 * @type {string}
 */
const PREFERENCES_STORAGE_KEY = 'meridian_preferences';

/**
 * @typedef {object} UserPreferences
 * @property {string} userId - The user ID
 * @property {object} preferences - Preferences object
 * @property {string} preferences.theme - UI theme ('light' or 'dark')
 * @property {boolean} preferences.emailNotifications - Email notification preference
 * @property {boolean} preferences.smsNotifications - SMS notification preference
 * @property {boolean} preferences.pushNotifications - Push notification preference
 * @property {string} preferences.language - Preferred language code
 * @property {string} preferences.currency - Preferred currency code
 */

/** @type {UserPreferences[]} */
const MOCK_PREFERENCES = [
  {
    userId: 'usr_jm_001',
    preferences: {
      theme: 'light',
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      language: 'en',
      currency: 'USD',
    },
  },
  {
    userId: 'usr_sc_002',
    preferences: {
      theme: 'dark',
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: true,
      language: 'en',
      currency: 'USD',
    },
  },
  {
    userId: 'usr_rp_003',
    preferences: {
      theme: 'light',
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: false,
      language: 'en',
      currency: 'USD',
    },
  },
  {
    userId: 'usr_ew_004',
    preferences: {
      theme: 'light',
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: false,
      language: 'en',
      currency: 'USD',
    },
  },
  {
    userId: 'usr_dk_005',
    preferences: {
      theme: 'light',
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      language: 'en',
      currency: 'USD',
    },
  },
];

/**
 * Seed user preferences into storage if not already present.
 * @returns {boolean} True if preferences were seeded, false if they already existed
 */
function seedPreferences() {
  const existing = getItem(PREFERENCES_STORAGE_KEY);

  if (existing !== null && Array.isArray(existing) && existing.length > 0) {
    return false;
  }

  return setItem(PREFERENCES_STORAGE_KEY, MOCK_PREFERENCES);
}

/**
 * Check whether mock data has already been seeded.
 * @returns {boolean} True if data has been seeded previously
 */
export function isDataSeeded() {
  const status = getItem(SEED_STATUS_KEY);
  return status === true;
}

/**
 * Orchestrate seeding of all mock data modules into storage.
 * Each seed function independently checks whether its data already exists,
 * so this function is safe to call multiple times.
 *
 * Seeds the following data:
 * - Users
 * - Holdings / Portfolio
 * - Activity / Transactions
 * - Documents
 * - Linked Banks
 * - Beneficiaries
 * - Cost Basis / Tax Lots
 * - Products & Services
 * - User Preferences
 *
 * @returns {{ seeded: boolean, results: Record<string, boolean> }}
 *   seeded: true if any new data was written
 *   results: per-module seeding outcome
 */
export function seedAllData() {
  if (isDataSeeded()) {
    return {
      seeded: false,
      results: {
        users: false,
        holdings: false,
        activity: false,
        documents: false,
        banks: false,
        beneficiaries: false,
        costBasis: false,
        products: false,
        services: false,
        preferences: false,
      },
    };
  }

  const results = {
    users: seedUsers(),
    holdings: seedHoldings(),
    activity: seedActivity(),
    documents: seedDocuments(),
    banks: seedBanks(),
    beneficiaries: seedBeneficiaries(),
    costBasis: seedCostBasis(),
    products: seedProducts(),
    services: seedServices(),
    preferences: seedPreferences(),
  };

  const anySeeded = Object.values(results).some((result) => result === true);

  // Mark seeding as complete so subsequent calls are no-ops
  setItem(SEED_STATUS_KEY, true);

  return {
    seeded: anySeeded,
    results,
  };
}

/**
 * Get all preferences for a specific user.
 * @param {string} userId - The user ID to retrieve preferences for
 * @returns {object | null} The user's preferences object, or null if not found
 */
export function getPreferencesByUserId(userId) {
  if (!userId || typeof userId !== 'string') {
    return null;
  }

  const allPreferences = getItem(PREFERENCES_STORAGE_KEY);

  if (!allPreferences || !Array.isArray(allPreferences)) {
    return null;
  }

  const userPrefs = allPreferences.find((entry) => entry.userId === userId);

  return userPrefs ? userPrefs.preferences : null;
}