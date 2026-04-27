/**
 * Pre-seeded mock transaction activity data per user.
 * Each user has an array of transactions spanning the last 12 months.
 * @module mock/activity
 */

import { getItem, setItem } from '../utils/storageUtils.js';
import { TRANSACTION_TYPES, STATUS } from '../utils/constants.js';

/**
 * Storage key for activity data.
 * @type {string}
 */
const ACTIVITY_STORAGE_KEY = 'meridian_activity';

/**
 * @typedef {object} Transaction
 * @property {string} id - Unique identifier for the transaction
 * @property {string} accountId - The account this transaction belongs to
 * @property {string} date - ISO 8601 date string of the transaction
 * @property {string} type - Transaction type (Buy, Sell, Dividend, Transfer In, Transfer Out, Fee, Deposit, Withdrawal)
 * @property {string} symbol - Ticker symbol (empty string for non-security transactions)
 * @property {string} description - Human-readable description of the transaction
 * @property {number} quantity - Number of shares/units (0 for non-security transactions)
 * @property {number} price - Price per share/unit (0 for non-security transactions)
 * @property {number} amount - Total dollar amount of the transaction
 * @property {string} status - Transaction status: 'completed', 'pending', or 'failed'
 */

/**
 * @typedef {object} UserActivity
 * @property {string} userId - The user ID
 * @property {Transaction[]} transactions - Array of transactions for this user
 */

/**
 * Helper to create a transaction object.
 * @param {object} params - Transaction parameters
 * @param {string} params.id
 * @param {string} params.accountId
 * @param {string} params.date
 * @param {string} params.type
 * @param {string} params.symbol
 * @param {string} params.description
 * @param {number} params.quantity
 * @param {number} params.price
 * @param {number} params.amount
 * @param {string} params.status
 * @returns {Transaction}
 */
function createTransaction({ id, accountId, date, type, symbol, description, quantity, price, amount, status }) {
  return {
    id,
    accountId,
    date,
    type,
    symbol,
    description,
    quantity,
    price,
    amount: parseFloat(amount.toFixed(2)),
    status,
  };
}

/** @type {UserActivity[]} */
export const MOCK_ACTIVITY = [
  // James Morgan (usr_jm_001)
  {
    userId: 'usr_jm_001',
    transactions: [
      createTransaction({ id: 'txn_jm_001', accountId: 'acct_jm_001', date: '2024-02-08T10:30:00Z', type: TRANSACTION_TYPES.BUY, symbol: 'AAPL', description: 'Bought Apple Inc.', quantity: 25, price: 188.50, amount: -4712.50, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_jm_002', accountId: 'acct_jm_001', date: '2024-02-05T14:15:00Z', type: TRANSACTION_TYPES.DIVIDEND, symbol: 'JNJ', description: 'Dividend payment - Johnson & Johnson', quantity: 0, price: 0, amount: 47.60, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_jm_003', accountId: 'acct_jm_001', date: '2024-01-29T09:45:00Z', type: TRANSACTION_TYPES.SELL, symbol: 'MSFT', description: 'Sold Microsoft Corporation', quantity: 10, price: 410.25, amount: 4102.50, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_jm_004', accountId: 'acct_jm_002', date: '2024-01-22T11:00:00Z', type: TRANSACTION_TYPES.BUY, symbol: 'VTI', description: 'Bought Vanguard Total Stock Market ETF', quantity: 20, price: 248.30, amount: -4966.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_jm_005', accountId: 'acct_jm_001', date: '2024-01-15T16:20:00Z', type: TRANSACTION_TYPES.FEE, symbol: '', description: 'Account maintenance fee', quantity: 0, price: 0, amount: -25.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_jm_006', accountId: 'acct_jm_001', date: '2024-01-10T13:30:00Z', type: TRANSACTION_TYPES.BUY, symbol: 'AMZN', description: 'Bought Amazon.com Inc.', quantity: 15, price: 155.80, amount: -2337.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_jm_007', accountId: 'acct_jm_002', date: '2024-01-03T10:00:00Z', type: TRANSACTION_TYPES.DEPOSIT, symbol: '', description: 'Annual IRA contribution', quantity: 0, price: 0, amount: 6500.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_jm_008', accountId: 'acct_jm_001', date: '2023-12-20T15:45:00Z', type: TRANSACTION_TYPES.DIVIDEND, symbol: 'VOO', description: 'Dividend payment - Vanguard S&P 500 ETF', quantity: 0, price: 0, amount: 98.40, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_jm_009', accountId: 'acct_jm_001', date: '2023-12-15T09:30:00Z', type: TRANSACTION_TYPES.BUY, symbol: 'PG', description: 'Bought Procter & Gamble Co.', quantity: 30, price: 145.90, amount: -4377.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_jm_010', accountId: 'acct_jm_001', date: '2023-11-28T14:00:00Z', type: TRANSACTION_TYPES.SELL, symbol: 'BND', description: 'Sold Vanguard Total Bond Market ETF', quantity: 50, price: 71.85, amount: 3592.50, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_jm_011', accountId: 'acct_jm_002', date: '2023-11-15T11:20:00Z', type: TRANSACTION_TYPES.BUY, symbol: 'GOOGL', description: 'Bought Alphabet Inc. Class A', quantity: 30, price: 132.40, amount: -3972.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_jm_012', accountId: 'acct_jm_001', date: '2023-10-30T10:15:00Z', type: TRANSACTION_TYPES.DIVIDEND, symbol: 'AAPL', description: 'Dividend payment - Apple Inc.', quantity: 0, price: 0, amount: 36.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_jm_013', accountId: 'acct_jm_002', date: '2023-10-10T09:00:00Z', type: TRANSACTION_TYPES.BUY, symbol: 'FXAIX', description: 'Bought Fidelity 500 Index Fund', quantity: 50, price: 160.20, amount: -8010.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_jm_014', accountId: 'acct_jm_001', date: '2023-09-18T13:45:00Z', type: TRANSACTION_TYPES.TRANSFER_IN, symbol: '', description: 'Wire transfer from external bank', quantity: 0, price: 0, amount: 15000.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_jm_015', accountId: 'acct_jm_001', date: '2023-08-22T10:30:00Z', type: TRANSACTION_TYPES.BUY, symbol: 'MSFT', description: 'Bought Microsoft Corporation', quantity: 20, price: 322.50, amount: -6450.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_jm_016', accountId: 'acct_jm_002', date: '2023-07-14T15:00:00Z', type: TRANSACTION_TYPES.BUY, symbol: 'VXUS', description: 'Bought Vanguard Total International Stock ETF', quantity: 45, price: 53.10, amount: -2389.50, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_jm_017', accountId: 'acct_jm_001', date: '2023-06-05T11:30:00Z', type: TRANSACTION_TYPES.DIVIDEND, symbol: 'MSFT', description: 'Dividend payment - Microsoft Corporation', quantity: 0, price: 0, amount: 63.75, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_jm_018', accountId: 'acct_jm_001', date: '2023-05-12T09:15:00Z', type: TRANSACTION_TYPES.BUY, symbol: 'BND', description: 'Bought Vanguard Total Bond Market ETF', quantity: 100, price: 74.20, amount: -7420.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_jm_019', accountId: 'acct_jm_001', date: '2024-02-10T08:00:00Z', type: TRANSACTION_TYPES.BUY, symbol: 'VOO', description: 'Bought Vanguard S&P 500 ETF', quantity: 5, price: 460.10, amount: -2300.50, status: STATUS.PENDING }),
    ],
  },
  // Sarah Chen (usr_sc_002)
  {
    userId: 'usr_sc_002',
    transactions: [
      createTransaction({ id: 'txn_sc_001', accountId: 'acct_sc_001', date: '2024-02-09T10:00:00Z', type: TRANSACTION_TYPES.BUY, symbol: 'NVDA', description: 'Bought NVIDIA Corporation', quantity: 20, price: 860.50, amount: -17210.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_sc_002', accountId: 'acct_sc_001', date: '2024-02-07T14:30:00Z', type: TRANSACTION_TYPES.SELL, symbol: 'TSLA', description: 'Sold Tesla Inc.', quantity: 15, price: 180.40, amount: 2706.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_sc_003', accountId: 'acct_sc_001', date: '2024-02-01T09:45:00Z', type: TRANSACTION_TYPES.BUY, symbol: 'META', description: 'Bought Meta Platforms Inc.', quantity: 10, price: 470.25, amount: -4702.50, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_sc_004', accountId: 'acct_sc_001', date: '2024-01-25T11:15:00Z', type: TRANSACTION_TYPES.TRANSFER_IN, symbol: '', description: 'ACH transfer from checking account', quantity: 0, price: 0, amount: 10000.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_sc_005', accountId: 'acct_sc_001', date: '2024-01-18T13:00:00Z', type: TRANSACTION_TYPES.BUY, symbol: 'AMD', description: 'Bought Advanced Micro Devices Inc.', quantity: 40, price: 165.30, amount: -6612.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_sc_006', accountId: 'acct_sc_001', date: '2024-01-10T10:30:00Z', type: TRANSACTION_TYPES.SELL, symbol: 'ARKK', description: 'Sold ARK Innovation ETF', quantity: 50, price: 48.90, amount: 2445.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_sc_007', accountId: 'acct_sc_001', date: '2024-01-05T15:20:00Z', type: TRANSACTION_TYPES.FEE, symbol: '', description: 'Margin interest charge', quantity: 0, price: 0, amount: -42.18, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_sc_008', accountId: 'acct_sc_001', date: '2023-12-28T09:00:00Z', type: TRANSACTION_TYPES.BUY, symbol: 'COIN', description: 'Bought Coinbase Global Inc.', quantity: 25, price: 178.60, amount: -4465.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_sc_009', accountId: 'acct_sc_001', date: '2023-12-15T14:45:00Z', type: TRANSACTION_TYPES.BUY, symbol: 'SOXX', description: 'Bought iShares Semiconductor ETF', quantity: 15, price: 540.20, amount: -8103.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_sc_010', accountId: 'acct_sc_001', date: '2023-12-01T11:30:00Z', type: TRANSACTION_TYPES.SELL, symbol: 'SQ', description: 'Sold Block Inc.', quantity: 20, price: 72.15, amount: 1443.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_sc_011', accountId: 'acct_sc_001', date: '2023-11-20T10:00:00Z', type: TRANSACTION_TYPES.BUY, symbol: 'CRM', description: 'Bought Salesforce Inc.', quantity: 15, price: 252.80, amount: -3792.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_sc_012', accountId: 'acct_sc_001', date: '2023-11-08T16:00:00Z', type: TRANSACTION_TYPES.DIVIDEND, symbol: 'QQQ', description: 'Dividend payment - Invesco QQQ Trust', quantity: 0, price: 0, amount: 28.35, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_sc_013', accountId: 'acct_sc_001', date: '2023-10-25T09:30:00Z', type: TRANSACTION_TYPES.BUY, symbol: 'NVDA', description: 'Bought NVIDIA Corporation', quantity: 30, price: 405.20, amount: -12156.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_sc_014', accountId: 'acct_sc_001', date: '2023-10-12T13:15:00Z', type: TRANSACTION_TYPES.TRANSFER_IN, symbol: '', description: 'Wire transfer from external account', quantity: 0, price: 0, amount: 25000.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_sc_015', accountId: 'acct_sc_001', date: '2023-09-28T10:45:00Z', type: TRANSACTION_TYPES.BUY, symbol: 'QQQ', description: 'Bought Invesco QQQ Trust', quantity: 20, price: 365.40, amount: -7308.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_sc_016', accountId: 'acct_sc_001', date: '2023-08-15T14:00:00Z', type: TRANSACTION_TYPES.SELL, symbol: 'TSLA', description: 'Sold Tesla Inc.', quantity: 25, price: 232.10, amount: 5802.50, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_sc_017', accountId: 'acct_sc_001', date: '2023-07-20T11:30:00Z', type: TRANSACTION_TYPES.BUY, symbol: 'SQ', description: 'Bought Block Inc.', quantity: 50, price: 65.40, amount: -3270.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_sc_018', accountId: 'acct_sc_001', date: '2023-06-10T09:00:00Z', type: TRANSACTION_TYPES.BUY, symbol: 'AMD', description: 'Bought Advanced Micro Devices Inc.', quantity: 40, price: 112.80, amount: -4512.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_sc_019', accountId: 'acct_sc_001', date: '2023-05-05T15:30:00Z', type: TRANSACTION_TYPES.BUY, symbol: 'TSLA', description: 'Bought Tesla Inc.', quantity: 20, price: 170.30, amount: -3406.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_sc_020', accountId: 'acct_sc_001', date: '2024-02-11T08:30:00Z', type: TRANSACTION_TYPES.BUY, symbol: 'NVDA', description: 'Bought NVIDIA Corporation', quantity: 10, price: 875.00, amount: -8750.00, status: STATUS.PENDING }),
    ],
  },
  // Robert Patel (usr_rp_003)
  {
    userId: 'usr_rp_003',
    transactions: [
      createTransaction({ id: 'txn_rp_001', accountId: 'acct_rp_001', date: '2024-02-08T10:00:00Z', type: TRANSACTION_TYPES.BUY, symbol: 'VTI', description: 'Bought Vanguard Total Stock Market ETF', quantity: 30, price: 250.80, amount: -7524.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_rp_002', accountId: 'acct_rp_003', date: '2024-02-05T14:30:00Z', type: TRANSACTION_TYPES.DIVIDEND, symbol: 'VIG', description: 'Dividend payment - Vanguard Dividend Appreciation ETF', quantity: 0, price: 0, amount: 112.50, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_rp_003', accountId: 'acct_rp_002', date: '2024-01-30T09:15:00Z', type: TRANSACTION_TYPES.BUY, symbol: 'AGG', description: 'Bought iShares Core U.S. Aggregate Bond ETF', quantity: 40, price: 98.20, amount: -3928.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_rp_004', accountId: 'acct_rp_001', date: '2024-01-22T11:45:00Z', type: TRANSACTION_TYPES.DIVIDEND, symbol: 'AAPL', description: 'Dividend payment - Apple Inc.', quantity: 0, price: 0, amount: 24.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_rp_005', accountId: 'acct_rp_003', date: '2024-01-15T13:00:00Z', type: TRANSACTION_TYPES.BUY, symbol: 'SCHD', description: 'Bought Schwab U.S. Dividend Equity ETF', quantity: 50, price: 76.40, amount: -3820.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_rp_006', accountId: 'acct_rp_001', date: '2024-01-08T10:30:00Z', type: TRANSACTION_TYPES.DEPOSIT, symbol: '', description: 'Wire transfer from business account', quantity: 0, price: 0, amount: 20000.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_rp_007', accountId: 'acct_rp_002', date: '2024-01-02T15:00:00Z', type: TRANSACTION_TYPES.BUY, symbol: 'VFIAX', description: 'Bought Vanguard 500 Index Fund Admiral', quantity: 30, price: 435.60, amount: -13068.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_rp_008', accountId: 'acct_rp_003', date: '2023-12-22T09:30:00Z', type: TRANSACTION_TYPES.DIVIDEND, symbol: 'XOM', description: 'Dividend payment - Exxon Mobil Corporation', quantity: 0, price: 0, amount: 72.80, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_rp_009', accountId: 'acct_rp_001', date: '2023-12-15T14:00:00Z', type: TRANSACTION_TYPES.SELL, symbol: 'TLT', description: 'Sold iShares 20+ Year Treasury Bond ETF', quantity: 30, price: 95.40, amount: 2862.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_rp_010', accountId: 'acct_rp_001', date: '2023-12-01T11:15:00Z', type: TRANSACTION_TYPES.FEE, symbol: '', description: 'Advisory fee - Q4 2023', quantity: 0, price: 0, amount: -375.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_rp_011', accountId: 'acct_rp_003', date: '2023-11-20T10:00:00Z', type: TRANSACTION_TYPES.BUY, symbol: 'JPM', description: 'Bought JPMorgan Chase & Co.', quantity: 20, price: 155.30, amount: -3106.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_rp_012', accountId: 'acct_rp_001', date: '2023-11-10T13:30:00Z', type: TRANSACTION_TYPES.DIVIDEND, symbol: 'BRK.B', description: 'Dividend payment - Berkshire Hathaway Inc.', quantity: 0, price: 0, amount: 0.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_rp_013', accountId: 'acct_rp_002', date: '2023-10-25T09:45:00Z', type: TRANSACTION_TYPES.BUY, symbol: 'TLT', description: 'Bought iShares 20+ Year Treasury Bond ETF', quantity: 50, price: 86.20, amount: -4310.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_rp_014', accountId: 'acct_rp_001', date: '2023-10-10T15:00:00Z', type: TRANSACTION_TYPES.BUY, symbol: 'HD', description: 'Bought The Home Depot Inc.', quantity: 10, price: 298.50, amount: -2985.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_rp_015', accountId: 'acct_rp_003', date: '2023-09-28T11:30:00Z', type: TRANSACTION_TYPES.DIVIDEND, symbol: 'SCHD', description: 'Dividend payment - Schwab U.S. Dividend Equity ETF', quantity: 0, price: 0, amount: 45.60, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_rp_016', accountId: 'acct_rp_001', date: '2023-09-15T10:00:00Z', type: TRANSACTION_TYPES.TRANSFER_IN, symbol: '', description: 'Transfer from external brokerage', quantity: 0, price: 0, amount: 50000.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_rp_017', accountId: 'acct_rp_002', date: '2023-08-20T14:15:00Z', type: TRANSACTION_TYPES.BUY, symbol: 'VBTLX', description: 'Bought Vanguard Total Bond Market Index Fund', quantity: 100, price: 10.30, amount: -1030.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_rp_018', accountId: 'acct_rp_003', date: '2023-07-12T09:30:00Z', type: TRANSACTION_TYPES.BUY, symbol: 'XOM', description: 'Bought Exxon Mobil Corporation', quantity: 40, price: 108.40, amount: -4336.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_rp_019', accountId: 'acct_rp_001', date: '2023-06-05T13:00:00Z', type: TRANSACTION_TYPES.BUY, symbol: 'AAPL', description: 'Bought Apple Inc.', quantity: 25, price: 180.20, amount: -4505.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_rp_020', accountId: 'acct_rp_001', date: '2023-05-18T10:45:00Z', type: TRANSACTION_TYPES.DIVIDEND, symbol: 'VTI', description: 'Dividend payment - Vanguard Total Stock Market ETF', quantity: 0, price: 0, amount: 156.80, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_rp_021', accountId: 'acct_rp_001', date: '2024-02-09T16:00:00Z', type: TRANSACTION_TYPES.BUY, symbol: 'HD', description: 'Bought The Home Depot Inc.', quantity: 15, price: 360.20, amount: -5403.00, status: STATUS.PENDING }),
    ],
  },
  // Emily Watson (usr_ew_004)
  {
    userId: 'usr_ew_004',
    transactions: [
      createTransaction({ id: 'txn_ew_001', accountId: 'acct_ew_001', date: '2024-02-10T09:30:00Z', type: TRANSACTION_TYPES.BUY, symbol: 'VOO', description: 'Bought Vanguard S&P 500 ETF', quantity: 5, price: 460.80, amount: -2304.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_ew_002', accountId: 'acct_ew_001', date: '2024-02-05T14:00:00Z', type: TRANSACTION_TYPES.DIVIDEND, symbol: 'KO', description: 'Dividend payment - The Coca-Cola Company', quantity: 0, price: 0, amount: 20.70, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_ew_003', accountId: 'acct_ew_002', date: '2024-01-28T10:15:00Z', type: TRANSACTION_TYPES.BUY, symbol: 'VTSAX', description: 'Bought Vanguard Total Stock Market Index Fund', quantity: 20, price: 115.40, amount: -2308.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_ew_004', accountId: 'acct_ew_001', date: '2024-01-20T11:30:00Z', type: TRANSACTION_TYPES.DEPOSIT, symbol: '', description: 'Recurring deposit from payroll', quantity: 0, price: 0, amount: 1500.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_ew_005', accountId: 'acct_ew_002', date: '2024-01-15T09:00:00Z', type: TRANSACTION_TYPES.DEPOSIT, symbol: '', description: 'Roth IRA contribution', quantity: 0, price: 0, amount: 500.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_ew_006', accountId: 'acct_ew_001', date: '2024-01-08T13:45:00Z', type: TRANSACTION_TYPES.BUY, symbol: 'AAPL', description: 'Bought Apple Inc.', quantity: 5, price: 185.60, amount: -928.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_ew_007', accountId: 'acct_ew_001', date: '2023-12-28T10:30:00Z', type: TRANSACTION_TYPES.DIVIDEND, symbol: 'VOO', description: 'Dividend payment - Vanguard S&P 500 ETF', quantity: 0, price: 0, amount: 42.30, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_ew_008', accountId: 'acct_ew_002', date: '2023-12-20T15:00:00Z', type: TRANSACTION_TYPES.BUY, symbol: 'VTIAX', description: 'Bought Vanguard Total International Stock Index Fund', quantity: 30, price: 31.50, amount: -945.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_ew_009', accountId: 'acct_ew_001', date: '2023-12-15T09:15:00Z', type: TRANSACTION_TYPES.DEPOSIT, symbol: '', description: 'Recurring deposit from payroll', quantity: 0, price: 0, amount: 1500.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_ew_010', accountId: 'acct_ew_001', date: '2023-11-28T14:30:00Z', type: TRANSACTION_TYPES.BUY, symbol: 'BND', description: 'Bought Vanguard Total Bond Market ETF', quantity: 20, price: 73.40, amount: -1468.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_ew_011', accountId: 'acct_ew_001', date: '2023-11-15T11:00:00Z', type: TRANSACTION_TYPES.DEPOSIT, symbol: '', description: 'Recurring deposit from payroll', quantity: 0, price: 0, amount: 1500.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_ew_012', accountId: 'acct_ew_002', date: '2023-11-01T09:30:00Z', type: TRANSACTION_TYPES.BUY, symbol: 'VTBLX', description: 'Bought Vanguard Total Bond Market Index Fund Institutional', quantity: 50, price: 9.95, amount: -497.50, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_ew_013', accountId: 'acct_ew_001', date: '2023-10-20T13:15:00Z', type: TRANSACTION_TYPES.BUY, symbol: 'KO', description: 'Bought The Coca-Cola Company', quantity: 20, price: 54.80, amount: -1096.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_ew_014', accountId: 'acct_ew_001', date: '2023-10-15T10:00:00Z', type: TRANSACTION_TYPES.DEPOSIT, symbol: '', description: 'Recurring deposit from payroll', quantity: 0, price: 0, amount: 1500.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_ew_015', accountId: 'acct_ew_001', date: '2023-09-22T15:30:00Z', type: TRANSACTION_TYPES.BUY, symbol: 'MSFT', description: 'Bought Microsoft Corporation', quantity: 5, price: 332.40, amount: -1662.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_ew_016', accountId: 'acct_ew_002', date: '2023-08-30T09:45:00Z', type: TRANSACTION_TYPES.BUY, symbol: 'VTSAX', description: 'Bought Vanguard Total Stock Market Index Fund', quantity: 15, price: 108.20, amount: -1623.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_ew_017', accountId: 'acct_ew_001', date: '2023-07-18T14:00:00Z', type: TRANSACTION_TYPES.DIVIDEND, symbol: 'AAPL', description: 'Dividend payment - Apple Inc.', quantity: 0, price: 0, amount: 4.80, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_ew_018', accountId: 'acct_ew_001', date: '2023-06-12T10:30:00Z', type: TRANSACTION_TYPES.BUY, symbol: 'VOO', description: 'Bought Vanguard S&P 500 ETF', quantity: 3, price: 398.50, amount: -1195.50, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_ew_019', accountId: 'acct_ew_001', date: '2024-02-11T07:00:00Z', type: TRANSACTION_TYPES.BUY, symbol: 'MSFT', description: 'Bought Microsoft Corporation', quantity: 3, price: 415.00, amount: -1245.00, status: STATUS.PENDING }),
      createTransaction({ id: 'txn_ew_020', accountId: 'acct_ew_001', date: '2023-05-20T11:00:00Z', type: TRANSACTION_TYPES.TRANSFER_IN, symbol: '', description: 'Initial account funding', quantity: 0, price: 0, amount: 10000.00, status: STATUS.COMPLETED }),
    ],
  },
  // David Kim (usr_dk_005)
  {
    userId: 'usr_dk_005',
    transactions: [
      createTransaction({ id: 'txn_dk_001', accountId: 'acct_dk_001', date: '2024-02-07T10:00:00Z', type: TRANSACTION_TYPES.BUY, symbol: 'VTI', description: 'Bought Vanguard Total Stock Market ETF', quantity: 50, price: 251.20, amount: -12560.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_dk_002', accountId: 'acct_dk_003', date: '2024-02-05T14:15:00Z', type: TRANSACTION_TYPES.DIVIDEND, symbol: 'SCHD', description: 'Dividend payment - Schwab U.S. Dividend Equity ETF', quantity: 0, price: 0, amount: 165.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_dk_003', accountId: 'acct_dk_002', date: '2024-01-30T09:30:00Z', type: TRANSACTION_TYPES.WITHDRAWAL, symbol: '', description: 'Required minimum distribution', quantity: 0, price: 0, amount: -8500.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_dk_004', accountId: 'acct_dk_003', date: '2024-01-25T11:00:00Z', type: TRANSACTION_TYPES.DIVIDEND, symbol: 'VIG', description: 'Dividend payment - Vanguard Dividend Appreciation ETF', quantity: 0, price: 0, amount: 135.60, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_dk_005', accountId: 'acct_dk_004', date: '2024-01-20T13:45:00Z', type: TRANSACTION_TYPES.BUY, symbol: 'QQQ', description: 'Bought Invesco QQQ Trust', quantity: 10, price: 425.30, amount: -4253.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_dk_006', accountId: 'acct_dk_001', date: '2024-01-15T10:15:00Z', type: TRANSACTION_TYPES.DIVIDEND, symbol: 'VTI', description: 'Dividend payment - Vanguard Total Stock Market ETF', quantity: 0, price: 0, amount: 280.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_dk_007', accountId: 'acct_dk_001', date: '2024-01-08T15:30:00Z', type: TRANSACTION_TYPES.SELL, symbol: 'TLT', description: 'Sold iShares 20+ Year Treasury Bond ETF', quantity: 50, price: 94.80, amount: 4740.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_dk_008', accountId: 'acct_dk_002', date: '2024-01-03T09:00:00Z', type: TRANSACTION_TYPES.BUY, symbol: 'VBTLX', description: 'Bought Vanguard Total Bond Market Index Fund', quantity: 200, price: 9.85, amount: -1970.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_dk_009', accountId: 'acct_dk_003', date: '2023-12-22T14:00:00Z', type: TRANSACTION_TYPES.DIVIDEND, symbol: 'XOM', description: 'Dividend payment - Exxon Mobil Corporation', quantity: 0, price: 0, amount: 95.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_dk_010', accountId: 'acct_dk_001', date: '2023-12-15T10:30:00Z', type: TRANSACTION_TYPES.FEE, symbol: '', description: 'Advisory fee - Q4 2023', quantity: 0, price: 0, amount: -1250.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_dk_011', accountId: 'acct_dk_004', date: '2023-12-10T11:15:00Z', type: TRANSACTION_TYPES.BUY, symbol: 'AAPL', description: 'Bought Apple Inc.', quantity: 20, price: 195.40, amount: -3908.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_dk_012', accountId: 'acct_dk_003', date: '2023-11-28T13:30:00Z', type: TRANSACTION_TYPES.BUY, symbol: 'PG', description: 'Bought Procter & Gamble Co.', quantity: 25, price: 152.60, amount: -3815.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_dk_013', accountId: 'acct_dk_001', date: '2023-11-15T09:45:00Z', type: TRANSACTION_TYPES.BUY, symbol: 'VXUS', description: 'Bought Vanguard Total International Stock ETF', quantity: 60, price: 52.40, amount: -3144.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_dk_014', accountId: 'acct_dk_002', date: '2023-11-01T15:00:00Z', type: TRANSACTION_TYPES.DIVIDEND, symbol: 'AGG', description: 'Dividend payment - iShares Core U.S. Aggregate Bond ETF', quantity: 0, price: 0, amount: 87.50, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_dk_015', accountId: 'acct_dk_001', date: '2023-10-20T10:00:00Z', type: TRANSACTION_TYPES.TRANSFER_IN, symbol: '', description: 'Transfer from savings account', quantity: 0, price: 0, amount: 30000.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_dk_016', accountId: 'acct_dk_004', date: '2023-10-10T14:30:00Z', type: TRANSACTION_TYPES.BUY, symbol: 'GOOGL', description: 'Bought Alphabet Inc. Class A', quantity: 30, price: 138.20, amount: -4146.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_dk_017', accountId: 'acct_dk_003', date: '2023-09-25T11:00:00Z', type: TRANSACTION_TYPES.DIVIDEND, symbol: 'PG', description: 'Dividend payment - Procter & Gamble Co.', quantity: 0, price: 0, amount: 70.50, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_dk_018', accountId: 'acct_dk_002', date: '2023-09-10T09:30:00Z', type: TRANSACTION_TYPES.BUY, symbol: 'VFIAX', description: 'Bought Vanguard 500 Index Fund Admiral', quantity: 50, price: 420.80, amount: -21040.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_dk_019', accountId: 'acct_dk_001', date: '2023-08-28T13:15:00Z', type: TRANSACTION_TYPES.SELL, symbol: 'JNJ', description: 'Sold Johnson & Johnson', quantity: 20, price: 168.50, amount: 3370.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_dk_020', accountId: 'acct_dk_001', date: '2023-08-15T10:45:00Z', type: TRANSACTION_TYPES.DIVIDEND, symbol: 'JNJ', description: 'Dividend payment - Johnson & Johnson', quantity: 0, price: 0, amount: 108.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_dk_021', accountId: 'acct_dk_003', date: '2023-07-20T14:00:00Z', type: TRANSACTION_TYPES.BUY, symbol: 'VIG', description: 'Bought Vanguard Dividend Appreciation ETF', quantity: 40, price: 162.30, amount: -6492.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_dk_022', accountId: 'acct_dk_004', date: '2023-06-15T09:30:00Z', type: TRANSACTION_TYPES.DEPOSIT, symbol: '', description: 'Custodial account contribution', quantity: 0, price: 0, amount: 5000.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_dk_023', accountId: 'acct_dk_001', date: '2023-05-30T11:30:00Z', type: TRANSACTION_TYPES.BUY, symbol: 'BRK.B', description: 'Bought Berkshire Hathaway Inc. Class B', quantity: 30, price: 328.40, amount: -9852.00, status: STATUS.COMPLETED }),
      createTransaction({ id: 'txn_dk_024', accountId: 'acct_dk_001', date: '2024-02-08T16:30:00Z', type: TRANSACTION_TYPES.BUY, symbol: 'VXUS', description: 'Bought Vanguard Total International Stock ETF', quantity: 40, price: 57.50, amount: -2300.00, status: STATUS.PENDING }),
      createTransaction({ id: 'txn_dk_025', accountId: 'acct_dk_002', date: '2023-04-18T10:00:00Z', type: TRANSACTION_TYPES.SELL, symbol: 'AGG', description: 'Sold iShares Core U.S. Aggregate Bond ETF - rebalance', quantity: 30, price: 100.20, amount: 3006.00, status: STATUS.FAILED }),
    ],
  },
];

/**
 * Seed mock activity into storage if not already present.
 * Reads the current activity from storage; if the key does not exist or
 * contains no data, writes the full MOCK_ACTIVITY array.
 * @returns {boolean} True if activity was seeded, false if it already existed
 */
export function seedActivity() {
  const existing = getItem(ACTIVITY_STORAGE_KEY);

  if (existing !== null && Array.isArray(existing) && existing.length > 0) {
    return false;
  }

  return setItem(ACTIVITY_STORAGE_KEY, MOCK_ACTIVITY);
}

/**
 * Get all transactions for a specific user.
 * @param {string} userId - The user ID to retrieve transactions for
 * @returns {Transaction[]} Array of transactions for the user, or empty array if not found
 */
export function getActivityByUserId(userId) {
  if (!userId || typeof userId !== 'string') {
    return [];
  }

  const allActivity = getItem(ACTIVITY_STORAGE_KEY);

  if (!allActivity || !Array.isArray(allActivity)) {
    return [];
  }

  const userActivity = allActivity.find((entry) => entry.userId === userId);

  return userActivity ? userActivity.transactions : [];
}

/**
 * Get transactions for a specific account.
 * @param {string} userId - The user ID
 * @param {string} accountId - The account ID to filter by
 * @returns {Transaction[]} Array of transactions for the account, or empty array if not found
 */
export function getActivityByAccountId(userId, accountId) {
  if (!accountId || typeof accountId !== 'string') {
    return [];
  }

  const userTransactions = getActivityByUserId(userId);

  return userTransactions.filter((txn) => txn.accountId === accountId);
}

/**
 * Get a single transaction by its ID.
 * @param {string} userId - The user ID
 * @param {string} transactionId - The transaction ID to find
 * @returns {Transaction | null} The transaction object, or null if not found
 */
export function getTransactionById(userId, transactionId) {
  if (!transactionId || typeof transactionId !== 'string') {
    return null;
  }

  const userTransactions = getActivityByUserId(userId);

  return userTransactions.find((txn) => txn.id === transactionId) || null;
}

/**
 * Get transactions filtered by type.
 * @param {string} userId - The user ID
 * @param {string} type - The transaction type to filter by (e.g., 'Buy', 'Sell', 'Dividend')
 * @returns {Transaction[]} Array of transactions matching the type
 */
export function getActivityByType(userId, type) {
  if (!type || typeof type !== 'string') {
    return [];
  }

  const userTransactions = getActivityByUserId(userId);

  return userTransactions.filter((txn) => txn.type === type);
}

/**
 * Get transactions filtered by status.
 * @param {string} userId - The user ID
 * @param {string} status - The status to filter by (e.g., 'completed', 'pending', 'failed')
 * @returns {Transaction[]} Array of transactions matching the status
 */
export function getActivityByStatus(userId, status) {
  if (!status || typeof status !== 'string') {
    return [];
  }

  const userTransactions = getActivityByUserId(userId);

  return userTransactions.filter((txn) => txn.status === status);
}

/**
 * Get transactions within a date range.
 * @param {string} userId - The user ID
 * @param {string | Date} startDate - The start date (inclusive)
 * @param {string | Date} endDate - The end date (inclusive)
 * @returns {Transaction[]} Array of transactions within the date range
 */
export function getActivityByDateRange(userId, startDate, endDate) {
  if (!startDate || !endDate) {
    return [];
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return [];
  }

  const userTransactions = getActivityByUserId(userId);

  return userTransactions.filter((txn) => {
    const txnDate = new Date(txn.date);
    return txnDate >= start && txnDate <= end;
  });
}

/**
 * Calculate activity summary for a user.
 * @param {string} userId - The user ID
 * @returns {{ totalTransactions: number, totalBuys: number, totalSells: number, totalDividends: number, totalDeposits: number, totalWithdrawals: number, totalFees: number, pendingCount: number, failedCount: number }}
 */
export function getActivitySummary(userId) {
  const transactions = getActivityByUserId(userId);

  if (transactions.length === 0) {
    return {
      totalTransactions: 0,
      totalBuys: 0,
      totalSells: 0,
      totalDividends: 0,
      totalDeposits: 0,
      totalWithdrawals: 0,
      totalFees: 0,
      pendingCount: 0,
      failedCount: 0,
    };
  }

  let totalBuys = 0;
  let totalSells = 0;
  let totalDividends = 0;
  let totalDeposits = 0;
  let totalWithdrawals = 0;
  let totalFees = 0;
  let pendingCount = 0;
  let failedCount = 0;

  transactions.forEach((txn) => {
    switch (txn.type) {
      case TRANSACTION_TYPES.BUY:
        totalBuys += Math.abs(txn.amount);
        break;
      case TRANSACTION_TYPES.SELL:
        totalSells += txn.amount;
        break;
      case TRANSACTION_TYPES.DIVIDEND:
      case TRANSACTION_TYPES.INTEREST:
        totalDividends += txn.amount;
        break;
      case TRANSACTION_TYPES.DEPOSIT:
      case TRANSACTION_TYPES.TRANSFER_IN:
        totalDeposits += txn.amount;
        break;
      case TRANSACTION_TYPES.WITHDRAWAL:
      case TRANSACTION_TYPES.TRANSFER_OUT:
        totalWithdrawals += Math.abs(txn.amount);
        break;
      case TRANSACTION_TYPES.FEE:
        totalFees += Math.abs(txn.amount);
        break;
      default:
        break;
    }

    if (txn.status === STATUS.PENDING) {
      pendingCount += 1;
    }
    if (txn.status === STATUS.FAILED) {
      failedCount += 1;
    }
  });

  return {
    totalTransactions: transactions.length,
    totalBuys: parseFloat(totalBuys.toFixed(2)),
    totalSells: parseFloat(totalSells.toFixed(2)),
    totalDividends: parseFloat(totalDividends.toFixed(2)),
    totalDeposits: parseFloat(totalDeposits.toFixed(2)),
    totalWithdrawals: parseFloat(totalWithdrawals.toFixed(2)),
    totalFees: parseFloat(totalFees.toFixed(2)),
    pendingCount,
    failedCount,
  };
}