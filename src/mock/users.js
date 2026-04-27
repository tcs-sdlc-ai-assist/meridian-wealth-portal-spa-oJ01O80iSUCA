/**
 * Pre-seeded mock user data and seeding utility.
 * @module mock/users
 */

import { getItem, setItem } from '../utils/storageUtils.js';
import { STORAGE_KEYS, ACCOUNT_TYPES, COST_BASIS_METHODS } from '../utils/constants.js';

/**
 * @typedef {object} UserAddress
 * @property {string} street
 * @property {string} city
 * @property {string} state
 * @property {string} zip
 * @property {string} country
 */

/**
 * @typedef {object} UserEmployment
 * @property {string} status
 * @property {string} employer
 * @property {string} occupation
 * @property {number} yearsEmployed
 */

/**
 * @typedef {object} UserPreferences
 * @property {string} theme
 * @property {boolean} emailNotifications
 * @property {boolean} smsNotifications
 * @property {boolean} pushNotifications
 * @property {string} language
 * @property {string} currency
 */

/**
 * @typedef {object} UserSecurity
 * @property {boolean} twoFactorEnabled
 * @property {string} twoFactorMethod
 * @property {string} lastPasswordChange
 * @property {string[]} trustedDevices
 */

/**
 * @typedef {object} UserAccount
 * @property {string} accountId
 * @property {string} accountNumber
 * @property {string} type
 * @property {string} openedDate
 * @property {string} status
 * @property {string} riskProfile
 * @property {string} costBasisMethod
 */

/**
 * @typedef {object} MockUser
 * @property {string} id
 * @property {string} email
 * @property {string} password
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} phone
 * @property {string} dateOfBirth
 * @property {UserAddress} address
 * @property {UserEmployment} employment
 * @property {string} taxStatus
 * @property {string} taxFilingStatus
 * @property {string} incomeRange
 * @property {string} lastLogin
 * @property {UserAccount[]} accounts
 * @property {UserPreferences} preferences
 * @property {UserSecurity} security
 */

/** @type {MockUser[]} */
export const MOCK_USERS = [
  {
    id: 'usr_jm_001',
    email: 'james.morgan@example.com',
    password: 'Meridian@2024',
    firstName: 'James',
    lastName: 'Morgan',
    phone: '5551234567',
    dateOfBirth: '1985-03-15',
    address: {
      street: '742 Evergreen Terrace',
      city: 'San Francisco',
      state: 'CA',
      zip: '94102',
      country: 'US',
    },
    employment: {
      status: 'Employed',
      employer: 'TechVentures Inc.',
      occupation: 'Software Engineer',
      yearsEmployed: 8,
    },
    taxStatus: 'US Citizen',
    taxFilingStatus: 'Married Filing Jointly',
    incomeRange: '$150,000 - $200,000',
    lastLogin: '2024-02-10T14:32:00Z',
    accounts: [
      {
        accountId: 'acct_jm_001',
        accountNumber: '8827164530',
        type: ACCOUNT_TYPES.INDIVIDUAL,
        openedDate: '2019-06-12',
        status: 'active',
        riskProfile: 'Moderate',
        costBasisMethod: COST_BASIS_METHODS[0],
      },
      {
        accountId: 'acct_jm_002',
        accountNumber: '8827164531',
        type: ACCOUNT_TYPES.ROTH_IRA,
        openedDate: '2020-01-05',
        status: 'active',
        riskProfile: 'Aggressive',
        costBasisMethod: COST_BASIS_METHODS[3],
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
      twoFactorEnabled: true,
      twoFactorMethod: 'authenticator',
      lastPasswordChange: '2024-01-15T10:00:00Z',
      trustedDevices: ['MacBook Pro - Chrome', 'iPhone 15 - Safari'],
    },
  },
  {
    id: 'usr_sc_002',
    email: 'sarah.chen@example.com',
    password: 'Meridian@2024',
    firstName: 'Sarah',
    lastName: 'Chen',
    phone: '5559876543',
    dateOfBirth: '1990-07-22',
    address: {
      street: '1200 Park Avenue',
      city: 'New York',
      state: 'NY',
      zip: '10128',
      country: 'US',
    },
    employment: {
      status: 'Employed',
      employer: 'Goldman & Associates',
      occupation: 'Financial Analyst',
      yearsEmployed: 5,
    },
    taxStatus: 'US Citizen',
    taxFilingStatus: 'Single',
    incomeRange: '$100,000 - $150,000',
    lastLogin: '2024-02-11T09:15:00Z',
    accounts: [
      {
        accountId: 'acct_sc_001',
        accountNumber: '7743219856',
        type: ACCOUNT_TYPES.INDIVIDUAL,
        openedDate: '2021-03-20',
        status: 'active',
        riskProfile: 'Aggressive',
        costBasisMethod: COST_BASIS_METHODS[2],
      },
    ],
    preferences: {
      theme: 'dark',
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: true,
      language: 'en',
      currency: 'USD',
    },
    security: {
      twoFactorEnabled: true,
      twoFactorMethod: 'sms',
      lastPasswordChange: '2023-12-01T08:30:00Z',
      trustedDevices: ['Windows Desktop - Edge'],
    },
  },
  {
    id: 'usr_rp_003',
    email: 'robert.patel@example.com',
    password: 'Meridian@2024',
    firstName: 'Robert',
    lastName: 'Patel',
    phone: '5554567890',
    dateOfBirth: '1972-11-08',
    address: {
      street: '350 Maple Drive',
      city: 'Chicago',
      state: 'IL',
      zip: '60601',
      country: 'US',
    },
    employment: {
      status: 'Self-Employed',
      employer: 'Patel Consulting LLC',
      occupation: 'Management Consultant',
      yearsEmployed: 15,
    },
    taxStatus: 'US Citizen',
    taxFilingStatus: 'Married Filing Jointly',
    incomeRange: '$200,000 - $500,000',
    lastLogin: '2024-02-09T18:45:00Z',
    accounts: [
      {
        accountId: 'acct_rp_001',
        accountNumber: '6651098234',
        type: ACCOUNT_TYPES.JOINT,
        openedDate: '2017-09-01',
        status: 'active',
        riskProfile: 'Moderate',
        costBasisMethod: COST_BASIS_METHODS[0],
      },
      {
        accountId: 'acct_rp_002',
        accountNumber: '6651098235',
        type: ACCOUNT_TYPES.RETIREMENT_IRA,
        openedDate: '2018-04-15',
        status: 'active',
        riskProfile: 'Conservative',
        costBasisMethod: COST_BASIS_METHODS[3],
      },
      {
        accountId: 'acct_rp_003',
        accountNumber: '6651098236',
        type: ACCOUNT_TYPES.TRUST,
        openedDate: '2022-01-10',
        status: 'active',
        riskProfile: 'Moderate',
        costBasisMethod: COST_BASIS_METHODS[4],
      },
    ],
    preferences: {
      theme: 'light',
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: false,
      language: 'en',
      currency: 'USD',
    },
    security: {
      twoFactorEnabled: false,
      twoFactorMethod: 'none',
      lastPasswordChange: '2024-02-01T12:00:00Z',
      trustedDevices: ['iPad Pro - Safari', 'MacBook Air - Chrome'],
    },
  },
  {
    id: 'usr_ew_004',
    email: 'emily.watson@example.com',
    password: 'Meridian@2024',
    firstName: 'Emily',
    lastName: 'Watson',
    phone: '5553216549',
    dateOfBirth: '1995-01-30',
    address: {
      street: '88 Ocean Boulevard',
      city: 'Miami',
      state: 'FL',
      zip: '33139',
      country: 'US',
    },
    employment: {
      status: 'Employed',
      employer: 'Meridian Health Systems',
      occupation: 'Registered Nurse',
      yearsEmployed: 3,
    },
    taxStatus: 'US Citizen',
    taxFilingStatus: 'Single',
    incomeRange: '$75,000 - $100,000',
    lastLogin: '2024-02-11T07:20:00Z',
    accounts: [
      {
        accountId: 'acct_ew_001',
        accountNumber: '5539874210',
        type: ACCOUNT_TYPES.INDIVIDUAL,
        openedDate: '2023-02-14',
        status: 'active',
        riskProfile: 'Conservative',
        costBasisMethod: COST_BASIS_METHODS[0],
      },
      {
        accountId: 'acct_ew_002',
        accountNumber: '5539874211',
        type: ACCOUNT_TYPES.ROTH_IRA,
        openedDate: '2023-06-01',
        status: 'active',
        riskProfile: 'Moderate',
        costBasisMethod: COST_BASIS_METHODS[3],
      },
    ],
    preferences: {
      theme: 'light',
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: false,
      language: 'en',
      currency: 'USD',
    },
    security: {
      twoFactorEnabled: true,
      twoFactorMethod: 'authenticator',
      lastPasswordChange: '2024-01-20T16:00:00Z',
      trustedDevices: ['iPhone 14 - Safari'],
    },
  },
  {
    id: 'usr_dk_005',
    email: 'david.kim@example.com',
    password: 'Meridian@2024',
    firstName: 'David',
    lastName: 'Kim',
    phone: '5557890123',
    dateOfBirth: '1968-05-19',
    address: {
      street: '2100 Wilshire Boulevard',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90025',
      country: 'US',
    },
    employment: {
      status: 'Retired',
      employer: '',
      occupation: 'Retired - Former VP of Engineering',
      yearsEmployed: 0,
    },
    taxStatus: 'US Citizen',
    taxFilingStatus: 'Married Filing Jointly',
    incomeRange: '$500,000+',
    lastLogin: '2024-02-08T11:05:00Z',
    accounts: [
      {
        accountId: 'acct_dk_001',
        accountNumber: '4428763190',
        type: ACCOUNT_TYPES.JOINT,
        openedDate: '2010-08-22',
        status: 'active',
        riskProfile: 'Conservative',
        costBasisMethod: COST_BASIS_METHODS[2],
      },
      {
        accountId: 'acct_dk_002',
        accountNumber: '4428763191',
        type: ACCOUNT_TYPES.RETIREMENT_IRA,
        openedDate: '2005-03-10',
        status: 'active',
        riskProfile: 'Conservative',
        costBasisMethod: COST_BASIS_METHODS[0],
      },
      {
        accountId: 'acct_dk_003',
        accountNumber: '4428763192',
        type: ACCOUNT_TYPES.TRUST,
        openedDate: '2015-11-30',
        status: 'active',
        riskProfile: 'Moderate',
        costBasisMethod: COST_BASIS_METHODS[4],
      },
      {
        accountId: 'acct_dk_004',
        accountNumber: '4428763193',
        type: ACCOUNT_TYPES.CUSTODIAL,
        openedDate: '2020-07-04',
        status: 'active',
        riskProfile: 'Moderate',
        costBasisMethod: COST_BASIS_METHODS[3],
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
      twoFactorEnabled: true,
      twoFactorMethod: 'sms',
      lastPasswordChange: '2023-11-10T09:00:00Z',
      trustedDevices: ['Windows Desktop - Chrome', 'Samsung Galaxy S24 - Chrome'],
    },
  },
];

/**
 * Seed mock users into storage if not already present.
 * Reads the current users from storage; if the key does not exist or
 * contains no data, writes the full MOCK_USERS array.
 * @returns {boolean} True if users were seeded, false if they already existed
 */
export function seedUsers() {
  const existing = getItem(STORAGE_KEYS.USERS);

  if (existing !== null && Array.isArray(existing) && existing.length > 0) {
    return false;
  }

  return setItem(STORAGE_KEYS.USERS, MOCK_USERS);
}