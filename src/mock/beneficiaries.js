/**
 * Pre-seeded mock beneficiaries data per user.
 * Each user has an array of beneficiaries with details such as
 * name, relationship, type (Primary/Contingent), share percentage,
 * date of birth, and masked SSN.
 * Shares total 100% per beneficiary type per user.
 * @module mock/beneficiaries
 */

import { getItem, setItem } from '../utils/storageUtils.js';

/**
 * Storage key for beneficiaries data.
 * @type {string}
 */
const BENEFICIARIES_STORAGE_KEY = 'meridian_beneficiaries';

/**
 * Beneficiary type constants.
 * @type {object}
 */
export const BENEFICIARY_TYPES = {
  PRIMARY: 'Primary',
  CONTINGENT: 'Contingent',
};

/**
 * Relationship constants.
 * @type {object}
 */
export const RELATIONSHIPS = {
  SPOUSE: 'Spouse',
  CHILD: 'Child',
  SIBLING: 'Sibling',
  PARENT: 'Parent',
  TRUST: 'Trust',
  ESTATE: 'Estate',
  OTHER: 'Other',
};

/**
 * @typedef {object} Beneficiary
 * @property {string} id - Unique identifier for the beneficiary
 * @property {string} userId - The user this beneficiary belongs to
 * @property {string} name - Full name of the beneficiary
 * @property {string} relationship - Relationship to the account holder (e.g., Spouse, Child, Sibling)
 * @property {string} type - Beneficiary type: 'Primary' or 'Contingent'
 * @property {number} sharePercentage - Percentage share of the benefit (0-100)
 * @property {string} dateOfBirth - ISO 8601 date string of the beneficiary's date of birth
 * @property {string} ssn - Masked Social Security Number (e.g., "•••-••-1234")
 */

/**
 * @typedef {object} UserBeneficiaries
 * @property {string} userId - The user ID
 * @property {Beneficiary[]} beneficiaries - Array of beneficiaries for this user
 */

/**
 * Helper to create a beneficiary object.
 * @param {object} params - Beneficiary parameters
 * @param {string} params.id
 * @param {string} params.userId
 * @param {string} params.name
 * @param {string} params.relationship
 * @param {string} params.type
 * @param {number} params.sharePercentage
 * @param {string} params.dateOfBirth
 * @param {string} params.ssn
 * @returns {Beneficiary}
 */
function createBeneficiary({ id, userId, name, relationship, type, sharePercentage, dateOfBirth, ssn }) {
  return {
    id,
    userId,
    name,
    relationship,
    type,
    sharePercentage,
    dateOfBirth,
    ssn,
  };
}

/** @type {UserBeneficiaries[]} */
export const MOCK_BENEFICIARIES = [
  // James Morgan (usr_jm_001)
  {
    userId: 'usr_jm_001',
    beneficiaries: [
      createBeneficiary({ id: 'ben_jm_001', userId: 'usr_jm_001', name: 'Laura Morgan', relationship: RELATIONSHIPS.SPOUSE, type: BENEFICIARY_TYPES.PRIMARY, sharePercentage: 100, dateOfBirth: '1987-05-20', ssn: '•••-••-4821' }),
      createBeneficiary({ id: 'ben_jm_002', userId: 'usr_jm_001', name: 'Ethan Morgan', relationship: RELATIONSHIPS.CHILD, type: BENEFICIARY_TYPES.CONTINGENT, sharePercentage: 50, dateOfBirth: '2012-09-14', ssn: '•••-••-7634' }),
      createBeneficiary({ id: 'ben_jm_003', userId: 'usr_jm_001', name: 'Olivia Morgan', relationship: RELATIONSHIPS.CHILD, type: BENEFICIARY_TYPES.CONTINGENT, sharePercentage: 50, dateOfBirth: '2015-03-02', ssn: '•••-••-9158' }),
    ],
  },
  // Sarah Chen (usr_sc_002)
  {
    userId: 'usr_sc_002',
    beneficiaries: [
      createBeneficiary({ id: 'ben_sc_001', userId: 'usr_sc_002', name: 'Wei Chen', relationship: RELATIONSHIPS.PARENT, type: BENEFICIARY_TYPES.PRIMARY, sharePercentage: 50, dateOfBirth: '1962-11-30', ssn: '•••-••-3347' }),
      createBeneficiary({ id: 'ben_sc_002', userId: 'usr_sc_002', name: 'Mei Chen', relationship: RELATIONSHIPS.PARENT, type: BENEFICIARY_TYPES.PRIMARY, sharePercentage: 50, dateOfBirth: '1965-04-18', ssn: '•••-••-6712' }),
      createBeneficiary({ id: 'ben_sc_003', userId: 'usr_sc_002', name: 'Kevin Chen', relationship: RELATIONSHIPS.SIBLING, type: BENEFICIARY_TYPES.CONTINGENT, sharePercentage: 100, dateOfBirth: '1993-08-25', ssn: '•••-••-2089' }),
    ],
  },
  // Robert Patel (usr_rp_003)
  {
    userId: 'usr_rp_003',
    beneficiaries: [
      createBeneficiary({ id: 'ben_rp_001', userId: 'usr_rp_003', name: 'Anita Patel', relationship: RELATIONSHIPS.SPOUSE, type: BENEFICIARY_TYPES.PRIMARY, sharePercentage: 100, dateOfBirth: '1974-06-12', ssn: '•••-••-5523' }),
      createBeneficiary({ id: 'ben_rp_002', userId: 'usr_rp_003', name: 'Patel Family Trust', relationship: RELATIONSHIPS.TRUST, type: BENEFICIARY_TYPES.CONTINGENT, sharePercentage: 100, dateOfBirth: '2022-01-10', ssn: '•••-••-0000' }),
    ],
  },
  // Emily Watson (usr_ew_004)
  {
    userId: 'usr_ew_004',
    beneficiaries: [
      createBeneficiary({ id: 'ben_ew_001', userId: 'usr_ew_004', name: 'Margaret Watson', relationship: RELATIONSHIPS.PARENT, type: BENEFICIARY_TYPES.PRIMARY, sharePercentage: 60, dateOfBirth: '1968-12-05', ssn: '•••-••-8841' }),
      createBeneficiary({ id: 'ben_ew_002', userId: 'usr_ew_004', name: 'Thomas Watson', relationship: RELATIONSHIPS.SIBLING, type: BENEFICIARY_TYPES.PRIMARY, sharePercentage: 40, dateOfBirth: '1992-07-19', ssn: '•••-••-3376' }),
      createBeneficiary({ id: 'ben_ew_003', userId: 'usr_ew_004', name: 'Grace Watson', relationship: RELATIONSHIPS.SIBLING, type: BENEFICIARY_TYPES.CONTINGENT, sharePercentage: 100, dateOfBirth: '1998-10-28', ssn: '•••-••-5590' }),
    ],
  },
  // David Kim (usr_dk_005)
  {
    userId: 'usr_dk_005',
    beneficiaries: [
      createBeneficiary({ id: 'ben_dk_001', userId: 'usr_dk_005', name: 'Susan Kim', relationship: RELATIONSHIPS.SPOUSE, type: BENEFICIARY_TYPES.PRIMARY, sharePercentage: 100, dateOfBirth: '1970-02-14', ssn: '•••-••-4467' }),
      createBeneficiary({ id: 'ben_dk_002', userId: 'usr_dk_005', name: 'Daniel Kim', relationship: RELATIONSHIPS.CHILD, type: BENEFICIARY_TYPES.CONTINGENT, sharePercentage: 50, dateOfBirth: '1998-11-03', ssn: '•••-••-7723' }),
      createBeneficiary({ id: 'ben_dk_003', userId: 'usr_dk_005', name: 'Jennifer Kim', relationship: RELATIONSHIPS.CHILD, type: BENEFICIARY_TYPES.CONTINGENT, sharePercentage: 50, dateOfBirth: '2001-06-22', ssn: '•••-••-1198' }),
    ],
  },
];

/**
 * Seed mock beneficiaries into storage if not already present.
 * Reads the current beneficiaries from storage; if the key does not exist or
 * contains no data, writes the full MOCK_BENEFICIARIES array.
 * @returns {boolean} True if beneficiaries were seeded, false if they already existed
 */
export function seedBeneficiaries() {
  const existing = getItem(BENEFICIARIES_STORAGE_KEY);

  if (existing !== null && Array.isArray(existing) && existing.length > 0) {
    return false;
  }

  return setItem(BENEFICIARIES_STORAGE_KEY, MOCK_BENEFICIARIES);
}

/**
 * Get all beneficiaries for a specific user.
 * @param {string} userId - The user ID to retrieve beneficiaries for
 * @returns {Beneficiary[]} Array of beneficiaries for the user, or empty array if not found
 */
export function getBeneficiariesByUserId(userId) {
  if (!userId || typeof userId !== 'string') {
    return [];
  }

  const allBeneficiaries = getItem(BENEFICIARIES_STORAGE_KEY);

  if (!allBeneficiaries || !Array.isArray(allBeneficiaries)) {
    return [];
  }

  const userBeneficiaries = allBeneficiaries.find((entry) => entry.userId === userId);

  return userBeneficiaries ? userBeneficiaries.beneficiaries : [];
}

/**
 * Get a single beneficiary by its ID.
 * @param {string} userId - The user ID
 * @param {string} beneficiaryId - The beneficiary ID to find
 * @returns {Beneficiary | null} The beneficiary object, or null if not found
 */
export function getBeneficiaryById(userId, beneficiaryId) {
  if (!beneficiaryId || typeof beneficiaryId !== 'string') {
    return null;
  }

  const userBeneficiaries = getBeneficiariesByUserId(userId);

  return userBeneficiaries.find((ben) => ben.id === beneficiaryId) || null;
}

/**
 * Get beneficiaries filtered by type.
 * @param {string} userId - The user ID
 * @param {string} type - The beneficiary type to filter by (e.g., 'Primary', 'Contingent')
 * @returns {Beneficiary[]} Array of beneficiaries matching the type
 */
export function getBeneficiariesByType(userId, type) {
  if (!type || typeof type !== 'string') {
    return [];
  }

  const userBeneficiaries = getBeneficiariesByUserId(userId);

  return userBeneficiaries.filter((ben) => ben.type === type);
}

/**
 * Get beneficiaries filtered by relationship.
 * @param {string} userId - The user ID
 * @param {string} relationship - The relationship to filter by (e.g., 'Spouse', 'Child')
 * @returns {Beneficiary[]} Array of beneficiaries matching the relationship
 */
export function getBeneficiariesByRelationship(userId, relationship) {
  if (!relationship || typeof relationship !== 'string') {
    return [];
  }

  const userBeneficiaries = getBeneficiariesByUserId(userId);

  return userBeneficiaries.filter((ben) => ben.relationship === relationship);
}

/**
 * Calculate beneficiary summary for a user.
 * @param {string} userId - The user ID
 * @returns {{ totalBeneficiaries: number, primaryCount: number, contingentCount: number, primaryTotalShare: number, contingentTotalShare: number }}
 */
export function getBeneficiarySummary(userId) {
  const beneficiaries = getBeneficiariesByUserId(userId);

  if (beneficiaries.length === 0) {
    return {
      totalBeneficiaries: 0,
      primaryCount: 0,
      contingentCount: 0,
      primaryTotalShare: 0,
      contingentTotalShare: 0,
    };
  }

  let primaryCount = 0;
  let contingentCount = 0;
  let primaryTotalShare = 0;
  let contingentTotalShare = 0;

  beneficiaries.forEach((ben) => {
    if (ben.type === BENEFICIARY_TYPES.PRIMARY) {
      primaryCount += 1;
      primaryTotalShare += ben.sharePercentage;
    }
    if (ben.type === BENEFICIARY_TYPES.CONTINGENT) {
      contingentCount += 1;
      contingentTotalShare += ben.sharePercentage;
    }
  });

  return {
    totalBeneficiaries: beneficiaries.length,
    primaryCount,
    contingentCount,
    primaryTotalShare,
    contingentTotalShare,
  };
}