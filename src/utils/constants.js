/**
 * Application-wide constants and configuration values
 * @module constants
 */

/**
 * Keys used for browser storage (localStorage / sessionStorage)
 */
export const STORAGE_KEYS = {
  USERS: 'meridian_users',
  CURRENT_USER: 'meridian_current_user',
  SESSION: 'meridian_session',
};

/**
 * Supported brokerage account types
 */
export const ACCOUNT_TYPES = {
  INDIVIDUAL: 'Individual',
  JOINT: 'Joint',
  RETIREMENT_IRA: 'Retirement IRA',
  ROTH_IRA: 'Roth IRA',
  TRUST: 'Trust',
  CUSTODIAL: 'Custodial',
};

/**
 * Route path mappings used throughout the application
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  ACCOUNTS: '/accounts',
  ACCOUNT_DETAIL: '/accounts/:accountId',
  PORTFOLIO: '/portfolio',
  TRANSACTIONS: '/transactions',
  DOCUMENTS: '/documents',
  SETTINGS: '/settings',
  PROFILE: '/profile',
  NOTIFICATIONS: '/notifications',
  TAX_CENTER: '/tax-center',
  NOT_FOUND: '*',
};

/**
 * Cost basis calculation methods
 */
export const COST_BASIS_METHODS = [
  'FIFO',
  'LIFO',
  'Specific Identification',
  'Average Cost',
  'Highest Cost',
  'Lowest Cost',
];

/**
 * Notification delivery channels
 */
export const NOTIFICATION_CHANNELS = {
  EMAIL: 'email',
  SMS: 'sms',
  PUSH: 'push',
  IN_APP: 'in_app',
};

/**
 * Notification category types
 */
export const NOTIFICATION_TYPES = {
  TRADE_CONFIRMATION: 'trade_confirmation',
  ACCOUNT_ALERT: 'account_alert',
  PRICE_ALERT: 'price_alert',
  DOCUMENT_AVAILABLE: 'document_available',
  SECURITY: 'security',
  SYSTEM: 'system',
  DIVIDEND: 'dividend',
  TRANSFER: 'transfer',
};

/**
 * Transaction types for account activity
 */
export const TRANSACTION_TYPES = {
  BUY: 'Buy',
  SELL: 'Sell',
  DIVIDEND: 'Dividend',
  DEPOSIT: 'Deposit',
  WITHDRAWAL: 'Withdrawal',
  TRANSFER_IN: 'Transfer In',
  TRANSFER_OUT: 'Transfer Out',
  FEE: 'Fee',
  INTEREST: 'Interest',
  SPLIT: 'Split',
};

/**
 * Document category classifications
 */
export const DOCUMENT_CATEGORIES = {
  STATEMENT: 'Statement',
  TAX_FORM: 'Tax Form',
  TRADE_CONFIRMATION: 'Trade Confirmation',
  PROSPECTUS: 'Prospectus',
  ANNUAL_REPORT: 'Annual Report',
  CORRESPONDENCE: 'Correspondence',
  REGULATORY: 'Regulatory',
  AGREEMENT: 'Agreement',
};

/**
 * Generic status values used across the application
 */
export const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  PROCESSING: 'processing',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};