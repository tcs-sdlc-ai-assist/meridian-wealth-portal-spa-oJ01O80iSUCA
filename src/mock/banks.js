/**
 * Pre-seeded mock linked bank accounts data per user.
 * Each user has an array of linked bank accounts with details such as
 * bank name, account type, masked digits, routing number, and verification status.
 * @module mock/banks
 */

import { getItem, setItem } from '../utils/storageUtils.js';

/**
 * Storage key for banks data.
 * @type {string}
 */
const BANKS_STORAGE_KEY = 'meridian_banks';

/**
 * Bank account type constants.
 * @type {object}
 */
export const BANK_ACCOUNT_TYPES = {
  CHECKING: 'Checking',
  SAVINGS: 'Savings',
};

/**
 * Bank link status constants.
 * @type {object}
 */
export const BANK_LINK_STATUS = {
  VERIFIED: 'Verified',
  PENDING: 'Pending',
};

/**
 * @typedef {object} LinkedBank
 * @property {string} id - Unique identifier for the linked bank
 * @property {string} userId - The user this bank belongs to
 * @property {string} bankName - Name of the bank institution
 * @property {string} accountType - Bank account type (Checking or Savings)
 * @property {string} last4Digits - Last 4 digits of the bank account number
 * @property {string} routingNumber - Masked routing number (e.g., "•••••1234")
 * @property {string} status - Link verification status (Verified or Pending)
 * @property {string} linkedDate - ISO 8601 date string when the bank was linked
 */

/**
 * @typedef {object} UserBanks
 * @property {string} userId - The user ID
 * @property {LinkedBank[]} banks - Array of linked banks for this user
 */

/**
 * Helper to create a linked bank object.
 * @param {object} params - Bank parameters
 * @param {string} params.id
 * @param {string} params.userId
 * @param {string} params.bankName
 * @param {string} params.accountType
 * @param {string} params.last4Digits
 * @param {string} params.routingNumber
 * @param {string} params.status
 * @param {string} params.linkedDate
 * @returns {LinkedBank}
 */
function createBank({ id, userId, bankName, accountType, last4Digits, routingNumber, status, linkedDate }) {
  return {
    id,
    userId,
    bankName,
    accountType,
    last4Digits,
    routingNumber,
    status,
    linkedDate,
  };
}

/** @type {UserBanks[]} */
export const MOCK_BANKS = [
  // James Morgan (usr_jm_001)
  {
    userId: 'usr_jm_001',
    banks: [
      createBank({ id: 'bnk_jm_001', userId: 'usr_jm_001', bankName: 'Chase Bank', accountType: BANK_ACCOUNT_TYPES.CHECKING, last4Digits: '4829', routingNumber: '•••••0021', status: BANK_LINK_STATUS.VERIFIED, linkedDate: '2019-06-15T10:00:00Z' }),
      createBank({ id: 'bnk_jm_002', userId: 'usr_jm_001', bankName: 'Wells Fargo', accountType: BANK_ACCOUNT_TYPES.SAVINGS, last4Digits: '7153', routingNumber: '•••••1210', status: BANK_LINK_STATUS.VERIFIED, linkedDate: '2020-03-22T14:30:00Z' }),
    ],
  },
  // Sarah Chen (usr_sc_002)
  {
    userId: 'usr_sc_002',
    banks: [
      createBank({ id: 'bnk_sc_001', userId: 'usr_sc_002', bankName: 'Bank of America', accountType: BANK_ACCOUNT_TYPES.CHECKING, last4Digits: '3641', routingNumber: '•••••0226', status: BANK_LINK_STATUS.VERIFIED, linkedDate: '2021-03-25T09:15:00Z' }),
      createBank({ id: 'bnk_sc_002', userId: 'usr_sc_002', bankName: 'Citibank', accountType: BANK_ACCOUNT_TYPES.CHECKING, last4Digits: '8902', routingNumber: '•••••0089', status: BANK_LINK_STATUS.VERIFIED, linkedDate: '2022-08-10T11:00:00Z' }),
      createBank({ id: 'bnk_sc_003', userId: 'usr_sc_002', bankName: 'Marcus by Goldman Sachs', accountType: BANK_ACCOUNT_TYPES.SAVINGS, last4Digits: '5517', routingNumber: '•••••4059', status: BANK_LINK_STATUS.PENDING, linkedDate: '2024-01-28T16:45:00Z' }),
    ],
  },
  // Robert Patel (usr_rp_003)
  {
    userId: 'usr_rp_003',
    banks: [
      createBank({ id: 'bnk_rp_001', userId: 'usr_rp_003', bankName: 'US Bank', accountType: BANK_ACCOUNT_TYPES.CHECKING, last4Digits: '6274', routingNumber: '•••••0036', status: BANK_LINK_STATUS.VERIFIED, linkedDate: '2017-09-10T08:30:00Z' }),
      createBank({ id: 'bnk_rp_002', userId: 'usr_rp_003', bankName: 'Capital One', accountType: BANK_ACCOUNT_TYPES.SAVINGS, last4Digits: '1938', routingNumber: '•••••5190', status: BANK_LINK_STATUS.VERIFIED, linkedDate: '2019-11-05T13:00:00Z' }),
      createBank({ id: 'bnk_rp_003', userId: 'usr_rp_003', bankName: 'PNC Bank', accountType: BANK_ACCOUNT_TYPES.CHECKING, last4Digits: '4405', routingNumber: '•••••3177', status: BANK_LINK_STATUS.VERIFIED, linkedDate: '2022-06-18T10:15:00Z' }),
    ],
  },
  // Emily Watson (usr_ew_004)
  {
    userId: 'usr_ew_004',
    banks: [
      createBank({ id: 'bnk_ew_001', userId: 'usr_ew_004', bankName: 'Ally Bank', accountType: BANK_ACCOUNT_TYPES.CHECKING, last4Digits: '2087', routingNumber: '•••••0250', status: BANK_LINK_STATUS.VERIFIED, linkedDate: '2023-02-20T09:00:00Z' }),
      createBank({ id: 'bnk_ew_002', userId: 'usr_ew_004', bankName: 'Ally Bank', accountType: BANK_ACCOUNT_TYPES.SAVINGS, last4Digits: '2093', routingNumber: '•••••0250', status: BANK_LINK_STATUS.PENDING, linkedDate: '2024-02-05T15:30:00Z' }),
    ],
  },
  // David Kim (usr_dk_005)
  {
    userId: 'usr_dk_005',
    banks: [
      createBank({ id: 'bnk_dk_001', userId: 'usr_dk_005', bankName: 'Charles Schwab Bank', accountType: BANK_ACCOUNT_TYPES.CHECKING, last4Digits: '9312', routingNumber: '•••••2209', status: BANK_LINK_STATUS.VERIFIED, linkedDate: '2010-09-01T10:00:00Z' }),
      createBank({ id: 'bnk_dk_002', userId: 'usr_dk_005', bankName: 'First Republic Bank', accountType: BANK_ACCOUNT_TYPES.SAVINGS, last4Digits: '6748', routingNumber: '•••••0051', status: BANK_LINK_STATUS.VERIFIED, linkedDate: '2015-04-12T14:00:00Z' }),
      createBank({ id: 'bnk_dk_003', userId: 'usr_dk_005', bankName: 'Union Bank', accountType: BANK_ACCOUNT_TYPES.CHECKING, last4Digits: '3581', routingNumber: '•••••0808', status: BANK_LINK_STATUS.VERIFIED, linkedDate: '2020-01-08T11:30:00Z' }),
    ],
  },
];

/**
 * Seed mock banks into storage if not already present.
 * Reads the current banks from storage; if the key does not exist or
 * contains no data, writes the full MOCK_BANKS array.
 * @returns {boolean} True if banks were seeded, false if they already existed
 */
export function seedBanks() {
  const existing = getItem(BANKS_STORAGE_KEY);

  if (existing !== null && Array.isArray(existing) && existing.length > 0) {
    return false;
  }

  return setItem(BANKS_STORAGE_KEY, MOCK_BANKS);
}

/**
 * Get all linked banks for a specific user.
 * @param {string} userId - The user ID to retrieve banks for
 * @returns {LinkedBank[]} Array of linked banks for the user, or empty array if not found
 */
export function getBanksByUserId(userId) {
  if (!userId || typeof userId !== 'string') {
    return [];
  }

  const allBanks = getItem(BANKS_STORAGE_KEY);

  if (!allBanks || !Array.isArray(allBanks)) {
    return [];
  }

  const userBanks = allBanks.find((entry) => entry.userId === userId);

  return userBanks ? userBanks.banks : [];
}

/**
 * Get a single linked bank by its ID.
 * @param {string} userId - The user ID
 * @param {string} bankId - The bank ID to find
 * @returns {LinkedBank | null} The bank object, or null if not found
 */
export function getBankById(userId, bankId) {
  if (!bankId || typeof bankId !== 'string') {
    return null;
  }

  const userBanks = getBanksByUserId(userId);

  return userBanks.find((bank) => bank.id === bankId) || null;
}

/**
 * Get linked banks filtered by account type.
 * @param {string} userId - The user ID
 * @param {string} accountType - The bank account type to filter by (e.g., 'Checking', 'Savings')
 * @returns {LinkedBank[]} Array of banks matching the account type
 */
export function getBanksByAccountType(userId, accountType) {
  if (!accountType || typeof accountType !== 'string') {
    return [];
  }

  const userBanks = getBanksByUserId(userId);

  return userBanks.filter((bank) => bank.accountType === accountType);
}

/**
 * Get linked banks filtered by status.
 * @param {string} userId - The user ID
 * @param {string} status - The status to filter by (e.g., 'Verified', 'Pending')
 * @returns {LinkedBank[]} Array of banks matching the status
 */
export function getBanksByStatus(userId, status) {
  if (!status || typeof status !== 'string') {
    return [];
  }

  const userBanks = getBanksByUserId(userId);

  return userBanks.filter((bank) => bank.status === status);
}

/**
 * Calculate bank summary for a user.
 * @param {string} userId - The user ID
 * @returns {{ totalBanks: number, verifiedCount: number, pendingCount: number, checkingCount: number, savingsCount: number }}
 */
export function getBankSummary(userId) {
  const banks = getBanksByUserId(userId);

  if (banks.length === 0) {
    return {
      totalBanks: 0,
      verifiedCount: 0,
      pendingCount: 0,
      checkingCount: 0,
      savingsCount: 0,
    };
  }

  let verifiedCount = 0;
  let pendingCount = 0;
  let checkingCount = 0;
  let savingsCount = 0;

  banks.forEach((bank) => {
    if (bank.status === BANK_LINK_STATUS.VERIFIED) {
      verifiedCount += 1;
    }
    if (bank.status === BANK_LINK_STATUS.PENDING) {
      pendingCount += 1;
    }
    if (bank.accountType === BANK_ACCOUNT_TYPES.CHECKING) {
      checkingCount += 1;
    }
    if (bank.accountType === BANK_ACCOUNT_TYPES.SAVINGS) {
      savingsCount += 1;
    }
  });

  return {
    totalBanks: banks.length,
    verifiedCount,
    pendingCount,
    checkingCount,
    savingsCount,
  };
}