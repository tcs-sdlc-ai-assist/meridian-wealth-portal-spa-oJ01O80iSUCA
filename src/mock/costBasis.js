/**
 * Pre-seeded mock cost basis and tax lot data per user.
 * Each user has a current cost basis method and an array of tax lots
 * for their securities holdings.
 * @module mock/costBasis
 */

import { getItem, setItem } from '../utils/storageUtils.js';
import { COST_BASIS_METHODS } from '../utils/constants.js';

/**
 * Storage key for cost basis data.
 * @type {string}
 */
const COST_BASIS_STORAGE_KEY = 'meridian_cost_basis';

/**
 * @typedef {object} TaxLot
 * @property {string} lotId - Unique identifier for the tax lot
 * @property {string} accountId - The account this tax lot belongs to
 * @property {string} symbol - Ticker symbol
 * @property {string} purchaseDate - ISO 8601 date string of the purchase
 * @property {number} quantity - Number of shares/units in this lot
 * @property {number} costPerShare - Cost per share/unit at purchase
 * @property {number} totalCost - Total cost basis for this lot (quantity * costPerShare)
 * @property {number} currentValue - Current market value of this lot
 * @property {object} gainLoss - Gain/loss details for this lot
 * @property {number} gainLoss.dollar - Dollar amount of unrealized gain/loss
 * @property {number} gainLoss.percent - Percentage of unrealized gain/loss (as decimal)
 * @property {string} holdingPeriod - 'Short-Term' or 'Long-Term' based on purchase date
 */

/**
 * @typedef {object} UserCostBasis
 * @property {string} userId - The user ID
 * @property {string} currentMethod - The current cost basis method (e.g., 'FIFO', 'LIFO')
 * @property {TaxLot[]} taxLots - Array of tax lots for this user
 */

/**
 * Helper to determine holding period based on purchase date.
 * Long-term if held for more than 1 year.
 * @param {string} purchaseDate - ISO 8601 date string
 * @returns {string} 'Long-Term' or 'Short-Term'
 */
function getHoldingPeriod(purchaseDate) {
  const purchase = new Date(purchaseDate);
  const now = new Date('2024-02-11T00:00:00Z');
  const oneYearMs = 365.25 * 24 * 60 * 60 * 1000;
  return (now - purchase) > oneYearMs ? 'Long-Term' : 'Short-Term';
}

/**
 * Helper to create a tax lot object with computed fields.
 * @param {object} params - Tax lot parameters
 * @param {string} params.lotId
 * @param {string} params.accountId
 * @param {string} params.symbol
 * @param {string} params.purchaseDate
 * @param {number} params.quantity
 * @param {number} params.costPerShare
 * @param {number} params.currentPrice
 * @returns {TaxLot}
 */
function createTaxLot({ lotId, accountId, symbol, purchaseDate, quantity, costPerShare, currentPrice }) {
  const totalCost = parseFloat((quantity * costPerShare).toFixed(2));
  const currentValue = parseFloat((quantity * currentPrice).toFixed(2));
  const dollarGainLoss = parseFloat((currentValue - totalCost).toFixed(2));
  const percentGainLoss = totalCost !== 0 ? parseFloat((dollarGainLoss / totalCost).toFixed(4)) : 0;

  return {
    lotId,
    accountId,
    symbol,
    purchaseDate,
    quantity,
    costPerShare,
    totalCost,
    currentValue,
    gainLoss: {
      dollar: dollarGainLoss,
      percent: percentGainLoss,
    },
    holdingPeriod: getHoldingPeriod(purchaseDate),
  };
}

/** @type {UserCostBasis[]} */
export const MOCK_COST_BASIS = [
  // James Morgan (usr_jm_001)
  {
    userId: 'usr_jm_001',
    currentMethod: COST_BASIS_METHODS[0], // FIFO
    taxLots: [
      // AAPL - 150 shares total
      createTaxLot({ lotId: 'lot_jm_001', accountId: 'acct_jm_001', symbol: 'AAPL', purchaseDate: '2020-03-15T10:00:00Z', quantity: 50, costPerShare: 68.25, currentPrice: 189.84 }),
      createTaxLot({ lotId: 'lot_jm_002', accountId: 'acct_jm_001', symbol: 'AAPL', purchaseDate: '2021-06-22T14:30:00Z', quantity: 50, costPerShare: 132.40, currentPrice: 189.84 }),
      createTaxLot({ lotId: 'lot_jm_003', accountId: 'acct_jm_001', symbol: 'AAPL', purchaseDate: '2022-09-10T09:15:00Z', quantity: 25, costPerShare: 155.80, currentPrice: 189.84 }),
      createTaxLot({ lotId: 'lot_jm_004', accountId: 'acct_jm_001', symbol: 'AAPL', purchaseDate: '2024-02-08T10:30:00Z', quantity: 25, costPerShare: 188.50, currentPrice: 189.84 }),
      // MSFT - 85 shares total
      createTaxLot({ lotId: 'lot_jm_005', accountId: 'acct_jm_001', symbol: 'MSFT', purchaseDate: '2021-01-12T11:00:00Z', quantity: 40, costPerShare: 218.60, currentPrice: 415.60 }),
      createTaxLot({ lotId: 'lot_jm_006', accountId: 'acct_jm_001', symbol: 'MSFT', purchaseDate: '2022-05-18T13:45:00Z', quantity: 25, costPerShare: 268.40, currentPrice: 415.60 }),
      createTaxLot({ lotId: 'lot_jm_007', accountId: 'acct_jm_001', symbol: 'MSFT', purchaseDate: '2023-08-22T10:30:00Z', quantity: 20, costPerShare: 322.50, currentPrice: 415.60 }),
      // VOO - 60 shares total
      createTaxLot({ lotId: 'lot_jm_008', accountId: 'acct_jm_001', symbol: 'VOO', purchaseDate: '2020-06-15T09:00:00Z', quantity: 30, costPerShare: 310.20, currentPrice: 462.35 }),
      createTaxLot({ lotId: 'lot_jm_009', accountId: 'acct_jm_001', symbol: 'VOO', purchaseDate: '2022-01-20T14:00:00Z', quantity: 30, costPerShare: 449.80, currentPrice: 462.35 }),
      // BND - 200 shares total
      createTaxLot({ lotId: 'lot_jm_010', accountId: 'acct_jm_001', symbol: 'BND', purchaseDate: '2022-03-10T10:30:00Z', quantity: 100, costPerShare: 78.90, currentPrice: 72.18 }),
      createTaxLot({ lotId: 'lot_jm_011', accountId: 'acct_jm_001', symbol: 'BND', purchaseDate: '2023-05-12T09:15:00Z', quantity: 100, costPerShare: 74.20, currentPrice: 72.18 }),
      // JNJ - 40 shares total
      createTaxLot({ lotId: 'lot_jm_012', accountId: 'acct_jm_001', symbol: 'JNJ', purchaseDate: '2021-04-08T11:30:00Z', quantity: 40, costPerShare: 158.20, currentPrice: 156.74 }),
      // AMZN - 70 shares total
      createTaxLot({ lotId: 'lot_jm_013', accountId: 'acct_jm_001', symbol: 'AMZN', purchaseDate: '2022-07-14T10:00:00Z', quantity: 55, costPerShare: 118.30, currentPrice: 178.25 }),
      createTaxLot({ lotId: 'lot_jm_014', accountId: 'acct_jm_001', symbol: 'AMZN', purchaseDate: '2024-01-10T13:30:00Z', quantity: 15, costPerShare: 155.80, currentPrice: 178.25 }),
      // VTI - 120 shares total (Roth IRA)
      createTaxLot({ lotId: 'lot_jm_015', accountId: 'acct_jm_002', symbol: 'VTI', purchaseDate: '2020-08-05T09:30:00Z', quantity: 50, costPerShare: 172.40, currentPrice: 252.47 }),
      createTaxLot({ lotId: 'lot_jm_016', accountId: 'acct_jm_002', symbol: 'VTI', purchaseDate: '2021-11-15T14:00:00Z', quantity: 30, costPerShare: 238.60, currentPrice: 252.47 }),
      createTaxLot({ lotId: 'lot_jm_017', accountId: 'acct_jm_002', symbol: 'VTI', purchaseDate: '2022-10-20T10:15:00Z', quantity: 20, costPerShare: 192.50, currentPrice: 252.47 }),
      createTaxLot({ lotId: 'lot_jm_018', accountId: 'acct_jm_002', symbol: 'VTI', purchaseDate: '2024-01-22T11:00:00Z', quantity: 20, costPerShare: 248.30, currentPrice: 252.47 }),
      // VXUS - 95 shares total (Roth IRA)
      createTaxLot({ lotId: 'lot_jm_019', accountId: 'acct_jm_002', symbol: 'VXUS', purchaseDate: '2021-09-10T13:00:00Z', quantity: 50, costPerShare: 62.80, currentPrice: 57.82 }),
      createTaxLot({ lotId: 'lot_jm_020', accountId: 'acct_jm_002', symbol: 'VXUS', purchaseDate: '2023-07-14T15:00:00Z', quantity: 45, costPerShare: 53.10, currentPrice: 57.82 }),
      // GOOGL - 55 shares total (Roth IRA)
      createTaxLot({ lotId: 'lot_jm_021', accountId: 'acct_jm_002', symbol: 'GOOGL', purchaseDate: '2022-06-28T09:45:00Z', quantity: 25, costPerShare: 110.40, currentPrice: 153.41 }),
      createTaxLot({ lotId: 'lot_jm_022', accountId: 'acct_jm_002', symbol: 'GOOGL', purchaseDate: '2023-11-15T11:20:00Z', quantity: 30, costPerShare: 132.40, currentPrice: 153.41 }),
      // FXAIX - 180 shares total (Roth IRA)
      createTaxLot({ lotId: 'lot_jm_023', accountId: 'acct_jm_002', symbol: 'FXAIX', purchaseDate: '2021-03-15T10:00:00Z', quantity: 80, costPerShare: 138.50, currentPrice: 183.92 }),
      createTaxLot({ lotId: 'lot_jm_024', accountId: 'acct_jm_002', symbol: 'FXAIX', purchaseDate: '2022-08-22T14:30:00Z', quantity: 50, costPerShare: 152.80, currentPrice: 183.92 }),
      createTaxLot({ lotId: 'lot_jm_025', accountId: 'acct_jm_002', symbol: 'FXAIX', purchaseDate: '2023-10-10T09:00:00Z', quantity: 50, costPerShare: 160.20, currentPrice: 183.92 }),
      // PG - 30 shares total
      createTaxLot({ lotId: 'lot_jm_026', accountId: 'acct_jm_001', symbol: 'PG', purchaseDate: '2023-12-15T09:30:00Z', quantity: 30, costPerShare: 145.90, currentPrice: 162.35 }),
    ],
  },
  // Sarah Chen (usr_sc_002)
  {
    userId: 'usr_sc_002',
    currentMethod: COST_BASIS_METHODS[2], // Specific Identification
    taxLots: [
      // NVDA - 100 shares total
      createTaxLot({ lotId: 'lot_sc_001', accountId: 'acct_sc_001', symbol: 'NVDA', purchaseDate: '2022-10-05T10:00:00Z', quantity: 30, costPerShare: 112.40, currentPrice: 878.36 }),
      createTaxLot({ lotId: 'lot_sc_002', accountId: 'acct_sc_001', symbol: 'NVDA', purchaseDate: '2023-03-18T14:30:00Z', quantity: 20, costPerShare: 265.80, currentPrice: 878.36 }),
      createTaxLot({ lotId: 'lot_sc_003', accountId: 'acct_sc_001', symbol: 'NVDA', purchaseDate: '2023-10-25T09:30:00Z', quantity: 30, costPerShare: 405.20, currentPrice: 878.36 }),
      createTaxLot({ lotId: 'lot_sc_004', accountId: 'acct_sc_001', symbol: 'NVDA', purchaseDate: '2024-02-09T10:00:00Z', quantity: 20, costPerShare: 860.50, currentPrice: 878.36 }),
      // TSLA - 60 shares total
      createTaxLot({ lotId: 'lot_sc_005', accountId: 'acct_sc_001', symbol: 'TSLA', purchaseDate: '2022-04-12T11:00:00Z', quantity: 20, costPerShare: 310.50, currentPrice: 175.22 }),
      createTaxLot({ lotId: 'lot_sc_006', accountId: 'acct_sc_001', symbol: 'TSLA', purchaseDate: '2023-01-20T09:30:00Z', quantity: 20, costPerShare: 128.40, currentPrice: 175.22 }),
      createTaxLot({ lotId: 'lot_sc_007', accountId: 'acct_sc_001', symbol: 'TSLA', purchaseDate: '2023-05-05T15:30:00Z', quantity: 20, costPerShare: 170.30, currentPrice: 175.22 }),
      // QQQ - 45 shares total
      createTaxLot({ lotId: 'lot_sc_008', accountId: 'acct_sc_001', symbol: 'QQQ', purchaseDate: '2022-06-15T10:30:00Z', quantity: 25, costPerShare: 298.60, currentPrice: 438.67 }),
      createTaxLot({ lotId: 'lot_sc_009', accountId: 'acct_sc_001', symbol: 'QQQ', purchaseDate: '2023-09-28T10:45:00Z', quantity: 20, costPerShare: 365.40, currentPrice: 438.67 }),
      // AMD - 120 shares total
      createTaxLot({ lotId: 'lot_sc_010', accountId: 'acct_sc_001', symbol: 'AMD', purchaseDate: '2022-11-08T13:00:00Z', quantity: 40, costPerShare: 62.50, currentPrice: 177.54 }),
      createTaxLot({ lotId: 'lot_sc_011', accountId: 'acct_sc_001', symbol: 'AMD', purchaseDate: '2023-06-10T09:00:00Z', quantity: 40, costPerShare: 112.80, currentPrice: 177.54 }),
      createTaxLot({ lotId: 'lot_sc_012', accountId: 'acct_sc_001', symbol: 'AMD', purchaseDate: '2024-01-18T13:00:00Z', quantity: 40, costPerShare: 165.30, currentPrice: 177.54 }),
      // META - 40 shares total
      createTaxLot({ lotId: 'lot_sc_013', accountId: 'acct_sc_001', symbol: 'META', purchaseDate: '2023-04-10T10:15:00Z', quantity: 30, costPerShare: 228.40, currentPrice: 484.10 }),
      createTaxLot({ lotId: 'lot_sc_014', accountId: 'acct_sc_001', symbol: 'META', purchaseDate: '2024-02-01T09:45:00Z', quantity: 10, costPerShare: 470.25, currentPrice: 484.10 }),
      // ARKK - 150 shares total
      createTaxLot({ lotId: 'lot_sc_015', accountId: 'acct_sc_001', symbol: 'ARKK', purchaseDate: '2022-02-14T11:30:00Z', quantity: 100, costPerShare: 62.80, currentPrice: 47.85 }),
      createTaxLot({ lotId: 'lot_sc_016', accountId: 'acct_sc_001', symbol: 'ARKK', purchaseDate: '2022-08-20T14:00:00Z', quantity: 50, costPerShare: 42.30, currentPrice: 47.85 }),
      // SOXX - 30 shares total
      createTaxLot({ lotId: 'lot_sc_017', accountId: 'acct_sc_001', symbol: 'SOXX', purchaseDate: '2023-05-22T09:30:00Z', quantity: 15, costPerShare: 380.40, currentPrice: 578.92 }),
      createTaxLot({ lotId: 'lot_sc_018', accountId: 'acct_sc_001', symbol: 'SOXX', purchaseDate: '2023-12-15T14:45:00Z', quantity: 15, costPerShare: 540.20, currentPrice: 578.92 }),
      // CRM - 35 shares total
      createTaxLot({ lotId: 'lot_sc_019', accountId: 'acct_sc_001', symbol: 'CRM', purchaseDate: '2023-02-28T10:00:00Z', quantity: 20, costPerShare: 172.60, currentPrice: 298.56 }),
      createTaxLot({ lotId: 'lot_sc_020', accountId: 'acct_sc_001', symbol: 'CRM', purchaseDate: '2023-11-20T10:00:00Z', quantity: 15, costPerShare: 252.80, currentPrice: 298.56 }),
      // SQ - 80 shares total
      createTaxLot({ lotId: 'lot_sc_021', accountId: 'acct_sc_001', symbol: 'SQ', purchaseDate: '2023-07-20T11:30:00Z', quantity: 50, costPerShare: 65.40, currentPrice: 78.43 }),
      createTaxLot({ lotId: 'lot_sc_022', accountId: 'acct_sc_001', symbol: 'SQ', purchaseDate: '2023-09-15T14:00:00Z', quantity: 30, costPerShare: 74.80, currentPrice: 78.43 }),
      // COIN - 50 shares total
      createTaxLot({ lotId: 'lot_sc_023', accountId: 'acct_sc_001', symbol: 'COIN', purchaseDate: '2023-06-05T09:15:00Z', quantity: 25, costPerShare: 58.40, currentPrice: 205.78 }),
      createTaxLot({ lotId: 'lot_sc_024', accountId: 'acct_sc_001', symbol: 'COIN', purchaseDate: '2023-12-28T09:00:00Z', quantity: 25, costPerShare: 178.60, currentPrice: 205.78 }),
    ],
  },
  // Robert Patel (usr_rp_003)
  {
    userId: 'usr_rp_003',
    currentMethod: COST_BASIS_METHODS[0], // FIFO
    taxLots: [
      // VTI - 200 shares total (Joint)
      createTaxLot({ lotId: 'lot_rp_001', accountId: 'acct_rp_001', symbol: 'VTI', purchaseDate: '2018-03-20T10:00:00Z', quantity: 80, costPerShare: 138.50, currentPrice: 252.47 }),
      createTaxLot({ lotId: 'lot_rp_002', accountId: 'acct_rp_001', symbol: 'VTI', purchaseDate: '2020-04-10T09:30:00Z', quantity: 60, costPerShare: 148.20, currentPrice: 252.47 }),
      createTaxLot({ lotId: 'lot_rp_003', accountId: 'acct_rp_001', symbol: 'VTI', purchaseDate: '2022-07-18T14:00:00Z', quantity: 30, costPerShare: 205.40, currentPrice: 252.47 }),
      createTaxLot({ lotId: 'lot_rp_004', accountId: 'acct_rp_001', symbol: 'VTI', purchaseDate: '2024-02-08T10:00:00Z', quantity: 30, costPerShare: 250.80, currentPrice: 252.47 }),
      // AAPL - 100 shares total (Joint)
      createTaxLot({ lotId: 'lot_rp_005', accountId: 'acct_rp_001', symbol: 'AAPL', purchaseDate: '2019-01-15T11:00:00Z', quantity: 50, costPerShare: 78.40, currentPrice: 189.84 }),
      createTaxLot({ lotId: 'lot_rp_006', accountId: 'acct_rp_001', symbol: 'AAPL', purchaseDate: '2021-08-22T10:30:00Z', quantity: 25, costPerShare: 148.60, currentPrice: 189.84 }),
      createTaxLot({ lotId: 'lot_rp_007', accountId: 'acct_rp_001', symbol: 'AAPL', purchaseDate: '2023-06-05T13:00:00Z', quantity: 25, costPerShare: 180.20, currentPrice: 189.84 }),
      // BRK.B - 50 shares total (Joint)
      createTaxLot({ lotId: 'lot_rp_008', accountId: 'acct_rp_001', symbol: 'BRK.B', purchaseDate: '2019-05-10T09:00:00Z', quantity: 30, costPerShare: 208.30, currentPrice: 408.72 }),
      createTaxLot({ lotId: 'lot_rp_009', accountId: 'acct_rp_001', symbol: 'BRK.B', purchaseDate: '2021-12-15T14:30:00Z', quantity: 20, costPerShare: 298.40, currentPrice: 408.72 }),
      // VBTLX - 300 shares total (Joint)
      createTaxLot({ lotId: 'lot_rp_010', accountId: 'acct_rp_001', symbol: 'VBTLX', purchaseDate: '2020-09-08T10:15:00Z', quantity: 200, costPerShare: 11.20, currentPrice: 9.82 }),
      createTaxLot({ lotId: 'lot_rp_011', accountId: 'acct_rp_001', symbol: 'VBTLX', purchaseDate: '2023-08-20T14:15:00Z', quantity: 100, costPerShare: 10.30, currentPrice: 9.82 }),
      // HD - 25 shares total (Joint)
      createTaxLot({ lotId: 'lot_rp_012', accountId: 'acct_rp_001', symbol: 'HD', purchaseDate: '2022-04-15T11:00:00Z', quantity: 15, costPerShare: 298.50, currentPrice: 362.48 }),
      createTaxLot({ lotId: 'lot_rp_013', accountId: 'acct_rp_001', symbol: 'HD', purchaseDate: '2023-10-10T15:00:00Z', quantity: 10, costPerShare: 298.50, currentPrice: 362.48 }),
      // VFIAX - 250 shares total (Retirement IRA)
      createTaxLot({ lotId: 'lot_rp_014', accountId: 'acct_rp_002', symbol: 'VFIAX', purchaseDate: '2018-10-12T09:30:00Z', quantity: 100, costPerShare: 258.40, currentPrice: 445.18 }),
      createTaxLot({ lotId: 'lot_rp_015', accountId: 'acct_rp_002', symbol: 'VFIAX', purchaseDate: '2020-11-20T14:00:00Z', quantity: 80, costPerShare: 358.20, currentPrice: 445.18 }),
      createTaxLot({ lotId: 'lot_rp_016', accountId: 'acct_rp_002', symbol: 'VFIAX', purchaseDate: '2022-06-30T10:00:00Z', quantity: 40, costPerShare: 382.50, currentPrice: 445.18 }),
      createTaxLot({ lotId: 'lot_rp_017', accountId: 'acct_rp_002', symbol: 'VFIAX', purchaseDate: '2024-01-02T15:00:00Z', quantity: 30, costPerShare: 435.60, currentPrice: 445.18 }),
      // AGG - 180 shares total (Retirement IRA)
      createTaxLot({ lotId: 'lot_rp_018', accountId: 'acct_rp_002', symbol: 'AGG', purchaseDate: '2021-02-18T10:30:00Z', quantity: 100, costPerShare: 115.40, currentPrice: 97.56 }),
      createTaxLot({ lotId: 'lot_rp_019', accountId: 'acct_rp_002', symbol: 'AGG', purchaseDate: '2022-09-25T13:00:00Z', quantity: 40, costPerShare: 98.60, currentPrice: 97.56 }),
      createTaxLot({ lotId: 'lot_rp_020', accountId: 'acct_rp_002', symbol: 'AGG', purchaseDate: '2024-01-30T09:15:00Z', quantity: 40, costPerShare: 98.20, currentPrice: 97.56 }),
      // TLT - 100 shares total (Retirement IRA)
      createTaxLot({ lotId: 'lot_rp_021', accountId: 'acct_rp_002', symbol: 'TLT', purchaseDate: '2021-07-10T11:00:00Z', quantity: 50, costPerShare: 148.30, currentPrice: 92.45 }),
      createTaxLot({ lotId: 'lot_rp_022', accountId: 'acct_rp_002', symbol: 'TLT', purchaseDate: '2023-10-25T09:45:00Z', quantity: 50, costPerShare: 86.20, currentPrice: 92.45 }),
      // VIG - 150 shares total (Trust)
      createTaxLot({ lotId: 'lot_rp_023', accountId: 'acct_rp_003', symbol: 'VIG', purchaseDate: '2022-03-08T10:00:00Z', quantity: 80, costPerShare: 158.40, currentPrice: 178.93 }),
      createTaxLot({ lotId: 'lot_rp_024', accountId: 'acct_rp_003', symbol: 'VIG', purchaseDate: '2023-01-18T14:30:00Z', quantity: 70, costPerShare: 152.20, currentPrice: 178.93 }),
      // XOM - 80 shares total (Trust)
      createTaxLot({ lotId: 'lot_rp_025', accountId: 'acct_rp_003', symbol: 'XOM', purchaseDate: '2022-01-20T09:30:00Z', quantity: 40, costPerShare: 72.80, currentPrice: 104.28 }),
      createTaxLot({ lotId: 'lot_rp_026', accountId: 'acct_rp_003', symbol: 'XOM', purchaseDate: '2023-07-12T09:30:00Z', quantity: 40, costPerShare: 108.40, currentPrice: 104.28 }),
      // JPM - 60 shares total (Trust)
      createTaxLot({ lotId: 'lot_rp_027', accountId: 'acct_rp_003', symbol: 'JPM', purchaseDate: '2022-05-15T11:00:00Z', quantity: 40, costPerShare: 128.60, currentPrice: 196.52 }),
      createTaxLot({ lotId: 'lot_rp_028', accountId: 'acct_rp_003', symbol: 'JPM', purchaseDate: '2023-11-20T10:00:00Z', quantity: 20, costPerShare: 155.30, currentPrice: 196.52 }),
      // SCHD - 110 shares total (Trust)
      createTaxLot({ lotId: 'lot_rp_029', accountId: 'acct_rp_003', symbol: 'SCHD', purchaseDate: '2022-08-10T13:00:00Z', quantity: 60, costPerShare: 68.40, currentPrice: 79.34 }),
      createTaxLot({ lotId: 'lot_rp_030', accountId: 'acct_rp_003', symbol: 'SCHD', purchaseDate: '2024-01-15T13:00:00Z', quantity: 50, costPerShare: 76.40, currentPrice: 79.34 }),
    ],
  },
  // Emily Watson (usr_ew_004)
  {
    userId: 'usr_ew_004',
    currentMethod: COST_BASIS_METHODS[0], // FIFO
    taxLots: [
      // VOO - 30 shares total
      createTaxLot({ lotId: 'lot_ew_001', accountId: 'acct_ew_001', symbol: 'VOO', purchaseDate: '2023-03-10T09:30:00Z', quantity: 12, costPerShare: 372.40, currentPrice: 462.35 }),
      createTaxLot({ lotId: 'lot_ew_002', accountId: 'acct_ew_001', symbol: 'VOO', purchaseDate: '2023-06-12T10:30:00Z', quantity: 3, costPerShare: 398.50, currentPrice: 462.35 }),
      createTaxLot({ lotId: 'lot_ew_003', accountId: 'acct_ew_001', symbol: 'VOO', purchaseDate: '2023-09-18T14:00:00Z', quantity: 10, costPerShare: 408.20, currentPrice: 462.35 }),
      createTaxLot({ lotId: 'lot_ew_004', accountId: 'acct_ew_001', symbol: 'VOO', purchaseDate: '2024-02-10T09:30:00Z', quantity: 5, costPerShare: 460.80, currentPrice: 462.35 }),
      // AAPL - 20 shares total
      createTaxLot({ lotId: 'lot_ew_005', accountId: 'acct_ew_001', symbol: 'AAPL', purchaseDate: '2023-04-22T10:00:00Z', quantity: 10, costPerShare: 165.30, currentPrice: 189.84 }),
      createTaxLot({ lotId: 'lot_ew_006', accountId: 'acct_ew_001', symbol: 'AAPL', purchaseDate: '2023-08-15T11:30:00Z', quantity: 5, costPerShare: 178.20, currentPrice: 189.84 }),
      createTaxLot({ lotId: 'lot_ew_007', accountId: 'acct_ew_001', symbol: 'AAPL', purchaseDate: '2024-01-08T13:45:00Z', quantity: 5, costPerShare: 185.60, currentPrice: 189.84 }),
      // MSFT - 15 shares total
      createTaxLot({ lotId: 'lot_ew_008', accountId: 'acct_ew_001', symbol: 'MSFT', purchaseDate: '2023-05-20T09:00:00Z', quantity: 10, costPerShare: 318.40, currentPrice: 415.60 }),
      createTaxLot({ lotId: 'lot_ew_009', accountId: 'acct_ew_001', symbol: 'MSFT', purchaseDate: '2023-09-22T15:30:00Z', quantity: 5, costPerShare: 332.40, currentPrice: 415.60 }),
      // BND - 50 shares total
      createTaxLot({ lotId: 'lot_ew_010', accountId: 'acct_ew_001', symbol: 'BND', purchaseDate: '2023-07-10T10:00:00Z', quantity: 30, costPerShare: 75.60, currentPrice: 72.18 }),
      createTaxLot({ lotId: 'lot_ew_011', accountId: 'acct_ew_001', symbol: 'BND', purchaseDate: '2023-11-28T14:30:00Z', quantity: 20, costPerShare: 73.40, currentPrice: 72.18 }),
      // KO - 45 shares total
      createTaxLot({ lotId: 'lot_ew_012', accountId: 'acct_ew_001', symbol: 'KO', purchaseDate: '2023-04-05T11:00:00Z', quantity: 25, costPerShare: 60.80, currentPrice: 60.87 }),
      createTaxLot({ lotId: 'lot_ew_013', accountId: 'acct_ew_001', symbol: 'KO', purchaseDate: '2023-10-20T13:15:00Z', quantity: 20, costPerShare: 54.80, currentPrice: 60.87 }),
      // VTSAX - 80 shares total (Roth IRA)
      createTaxLot({ lotId: 'lot_ew_014', accountId: 'acct_ew_002', symbol: 'VTSAX', purchaseDate: '2023-06-15T09:30:00Z', quantity: 25, costPerShare: 102.40, currentPrice: 118.24 }),
      createTaxLot({ lotId: 'lot_ew_015', accountId: 'acct_ew_002', symbol: 'VTSAX', purchaseDate: '2023-08-30T09:45:00Z', quantity: 15, costPerShare: 108.20, currentPrice: 118.24 }),
      createTaxLot({ lotId: 'lot_ew_016', accountId: 'acct_ew_002', symbol: 'VTSAX', purchaseDate: '2023-11-10T10:00:00Z', quantity: 20, costPerShare: 105.80, currentPrice: 118.24 }),
      createTaxLot({ lotId: 'lot_ew_017', accountId: 'acct_ew_002', symbol: 'VTSAX', purchaseDate: '2024-01-28T10:15:00Z', quantity: 20, costPerShare: 115.40, currentPrice: 118.24 }),
      // VTIAX - 60 shares total (Roth IRA)
      createTaxLot({ lotId: 'lot_ew_018', accountId: 'acct_ew_002', symbol: 'VTIAX', purchaseDate: '2023-07-20T14:00:00Z', quantity: 30, costPerShare: 29.80, currentPrice: 33.15 }),
      createTaxLot({ lotId: 'lot_ew_019', accountId: 'acct_ew_002', symbol: 'VTIAX', purchaseDate: '2023-12-20T15:00:00Z', quantity: 30, costPerShare: 31.50, currentPrice: 33.15 }),
      // VTBLX - 100 shares total (Roth IRA)
      createTaxLot({ lotId: 'lot_ew_020', accountId: 'acct_ew_002', symbol: 'VTBLX', purchaseDate: '2023-08-05T10:30:00Z', quantity: 50, costPerShare: 10.40, currentPrice: 9.78 }),
      createTaxLot({ lotId: 'lot_ew_021', accountId: 'acct_ew_002', symbol: 'VTBLX', purchaseDate: '2023-11-01T09:30:00Z', quantity: 50, costPerShare: 9.95, currentPrice: 9.78 }),
    ],
  },
  // David Kim (usr_dk_005)
  {
    userId: 'usr_dk_005',
    currentMethod: COST_BASIS_METHODS[2], // Specific Identification
    taxLots: [
      // VTI - 350 shares total (Joint)
      createTaxLot({ lotId: 'lot_dk_001', accountId: 'acct_dk_001', symbol: 'VTI', purchaseDate: '2012-05-15T10:00:00Z', quantity: 100, costPerShare: 72.40, currentPrice: 252.47 }),
      createTaxLot({ lotId: 'lot_dk_002', accountId: 'acct_dk_001', symbol: 'VTI', purchaseDate: '2016-08-22T14:00:00Z', quantity: 80, costPerShare: 112.80, currentPrice: 252.47 }),
      createTaxLot({ lotId: 'lot_dk_003', accountId: 'acct_dk_001', symbol: 'VTI', purchaseDate: '2020-03-25T09:30:00Z', quantity: 70, costPerShare: 138.60, currentPrice: 252.47 }),
      createTaxLot({ lotId: 'lot_dk_004', accountId: 'acct_dk_001', symbol: 'VTI', purchaseDate: '2022-11-10T11:00:00Z', quantity: 50, costPerShare: 198.40, currentPrice: 252.47 }),
      createTaxLot({ lotId: 'lot_dk_005', accountId: 'acct_dk_001', symbol: 'VTI', purchaseDate: '2024-02-07T10:00:00Z', quantity: 50, costPerShare: 251.20, currentPrice: 252.47 }),
      // VXUS - 200 shares total (Joint)
      createTaxLot({ lotId: 'lot_dk_006', accountId: 'acct_dk_001', symbol: 'VXUS', purchaseDate: '2015-04-18T10:30:00Z', quantity: 80, costPerShare: 48.20, currentPrice: 57.82 }),
      createTaxLot({ lotId: 'lot_dk_007', accountId: 'acct_dk_001', symbol: 'VXUS', purchaseDate: '2019-09-12T14:00:00Z', quantity: 60, costPerShare: 50.40, currentPrice: 57.82 }),
      createTaxLot({ lotId: 'lot_dk_008', accountId: 'acct_dk_001', symbol: 'VXUS', purchaseDate: '2023-11-15T09:45:00Z', quantity: 60, costPerShare: 52.40, currentPrice: 57.82 }),
      // BRK.B - 120 shares total (Joint)
      createTaxLot({ lotId: 'lot_dk_009', accountId: 'acct_dk_001', symbol: 'BRK.B', purchaseDate: '2013-07-20T10:00:00Z', quantity: 40, costPerShare: 115.60, currentPrice: 408.72 }),
      createTaxLot({ lotId: 'lot_dk_010', accountId: 'acct_dk_001', symbol: 'BRK.B', purchaseDate: '2018-02-15T11:30:00Z', quantity: 50, costPerShare: 208.40, currentPrice: 408.72 }),
      createTaxLot({ lotId: 'lot_dk_011', accountId: 'acct_dk_001', symbol: 'BRK.B', purchaseDate: '2023-05-30T11:30:00Z', quantity: 30, costPerShare: 328.40, currentPrice: 408.72 }),
      // JNJ - 90 shares total (Joint)
      createTaxLot({ lotId: 'lot_dk_012', accountId: 'acct_dk_001', symbol: 'JNJ', purchaseDate: '2014-11-05T09:00:00Z', quantity: 50, costPerShare: 108.20, currentPrice: 156.74 }),
      createTaxLot({ lotId: 'lot_dk_013', accountId: 'acct_dk_001', symbol: 'JNJ', purchaseDate: '2020-06-18T13:30:00Z', quantity: 40, costPerShare: 142.80, currentPrice: 156.74 }),
      // TLT - 150 shares total (Joint)
      createTaxLot({ lotId: 'lot_dk_014', accountId: 'acct_dk_001', symbol: 'TLT', purchaseDate: '2019-08-10T10:00:00Z', quantity: 80, costPerShare: 138.40, currentPrice: 92.45 }),
      createTaxLot({ lotId: 'lot_dk_015', accountId: 'acct_dk_001', symbol: 'TLT', purchaseDate: '2021-03-22T14:30:00Z', quantity: 70, costPerShare: 136.80, currentPrice: 92.45 }),
      // VFIAX - 400 shares total (Retirement IRA)
      createTaxLot({ lotId: 'lot_dk_016', accountId: 'acct_dk_002', symbol: 'VFIAX', purchaseDate: '2008-06-15T09:00:00Z', quantity: 100, costPerShare: 128.40, currentPrice: 445.18 }),
      createTaxLot({ lotId: 'lot_dk_017', accountId: 'acct_dk_002', symbol: 'VFIAX', purchaseDate: '2014-01-20T10:30:00Z', quantity: 100, costPerShare: 178.60, currentPrice: 445.18 }),
      createTaxLot({ lotId: 'lot_dk_018', accountId: 'acct_dk_002', symbol: 'VFIAX', purchaseDate: '2019-05-10T14:00:00Z', quantity: 100, costPerShare: 268.40, currentPrice: 445.18 }),
      createTaxLot({ lotId: 'lot_dk_019', accountId: 'acct_dk_002', symbol: 'VFIAX', purchaseDate: '2022-12-08T09:30:00Z', quantity: 50, costPerShare: 382.60, currentPrice: 445.18 }),
      createTaxLot({ lotId: 'lot_dk_020', accountId: 'acct_dk_002', symbol: 'VFIAX', purchaseDate: '2023-09-10T09:30:00Z', quantity: 50, costPerShare: 420.80, currentPrice: 445.18 }),
      // VBTLX - 500 shares total (Retirement IRA)
      createTaxLot({ lotId: 'lot_dk_021', accountId: 'acct_dk_002', symbol: 'VBTLX', purchaseDate: '2015-10-12T10:00:00Z', quantity: 200, costPerShare: 10.80, currentPrice: 9.82 }),
      createTaxLot({ lotId: 'lot_dk_022', accountId: 'acct_dk_002', symbol: 'VBTLX', purchaseDate: '2020-07-20T14:30:00Z', quantity: 100, costPerShare: 11.40, currentPrice: 9.82 }),
      createTaxLot({ lotId: 'lot_dk_023', accountId: 'acct_dk_002', symbol: 'VBTLX', purchaseDate: '2024-01-03T09:00:00Z', quantity: 200, costPerShare: 9.85, currentPrice: 9.82 }),
      // AGG - 250 shares total (Retirement IRA)
      createTaxLot({ lotId: 'lot_dk_024', accountId: 'acct_dk_002', symbol: 'AGG', purchaseDate: '2017-04-15T11:00:00Z', quantity: 150, costPerShare: 110.20, currentPrice: 97.56 }),
      createTaxLot({ lotId: 'lot_dk_025', accountId: 'acct_dk_002', symbol: 'AGG', purchaseDate: '2021-09-28T13:00:00Z', quantity: 100, costPerShare: 114.80, currentPrice: 97.56 }),
      // VIG - 180 shares total (Trust)
      createTaxLot({ lotId: 'lot_dk_026', accountId: 'acct_dk_003', symbol: 'VIG', purchaseDate: '2016-06-10T10:00:00Z', quantity: 80, costPerShare: 82.40, currentPrice: 178.93 }),
      createTaxLot({ lotId: 'lot_dk_027', accountId: 'acct_dk_003', symbol: 'VIG', purchaseDate: '2020-01-15T14:00:00Z', quantity: 60, costPerShare: 128.60, currentPrice: 178.93 }),
      createTaxLot({ lotId: 'lot_dk_028', accountId: 'acct_dk_003', symbol: 'VIG', purchaseDate: '2023-07-20T14:00:00Z', quantity: 40, costPerShare: 162.30, currentPrice: 178.93 }),
      // SCHD - 220 shares total (Trust)
      createTaxLot({ lotId: 'lot_dk_029', accountId: 'acct_dk_003', symbol: 'SCHD', purchaseDate: '2018-11-20T09:30:00Z', quantity: 100, costPerShare: 48.60, currentPrice: 79.34 }),
      createTaxLot({ lotId: 'lot_dk_030', accountId: 'acct_dk_003', symbol: 'SCHD', purchaseDate: '2021-05-12T11:00:00Z', quantity: 70, costPerShare: 72.40, currentPrice: 79.34 }),
      createTaxLot({ lotId: 'lot_dk_031', accountId: 'acct_dk_003', symbol: 'SCHD', purchaseDate: '2023-02-28T14:30:00Z', quantity: 50, costPerShare: 74.80, currentPrice: 79.34 }),
      // PG - 75 shares total (Trust)
      createTaxLot({ lotId: 'lot_dk_032', accountId: 'acct_dk_003', symbol: 'PG', purchaseDate: '2017-08-15T10:00:00Z', quantity: 50, costPerShare: 92.40, currentPrice: 162.35 }),
      createTaxLot({ lotId: 'lot_dk_033', accountId: 'acct_dk_003', symbol: 'PG', purchaseDate: '2023-11-28T13:30:00Z', quantity: 25, costPerShare: 152.60, currentPrice: 162.35 }),
      // XOM - 100 shares total (Trust)
      createTaxLot({ lotId: 'lot_dk_034', accountId: 'acct_dk_003', symbol: 'XOM', purchaseDate: '2016-02-10T09:00:00Z', quantity: 60, costPerShare: 38.40, currentPrice: 104.28 }),
      createTaxLot({ lotId: 'lot_dk_035', accountId: 'acct_dk_003', symbol: 'XOM', purchaseDate: '2023-07-12T09:30:00Z', quantity: 40, costPerShare: 108.40, currentPrice: 104.28 }),
      // QQQ - 40 shares total (Custodial)
      createTaxLot({ lotId: 'lot_dk_036', accountId: 'acct_dk_004', symbol: 'QQQ', purchaseDate: '2020-09-15T10:30:00Z', quantity: 20, costPerShare: 278.40, currentPrice: 438.67 }),
      createTaxLot({ lotId: 'lot_dk_037', accountId: 'acct_dk_004', symbol: 'QQQ', purchaseDate: '2024-01-20T13:45:00Z', quantity: 10, costPerShare: 425.30, currentPrice: 438.67 }),
      createTaxLot({ lotId: 'lot_dk_038', accountId: 'acct_dk_004', symbol: 'QQQ', purchaseDate: '2022-03-10T09:00:00Z', quantity: 10, costPerShare: 342.60, currentPrice: 438.67 }),
      // AAPL - 80 shares total (Custodial)
      createTaxLot({ lotId: 'lot_dk_039', accountId: 'acct_dk_004', symbol: 'AAPL', purchaseDate: '2020-08-20T11:00:00Z', quantity: 40, costPerShare: 118.40, currentPrice: 189.84 }),
      createTaxLot({ lotId: 'lot_dk_040', accountId: 'acct_dk_004', symbol: 'AAPL', purchaseDate: '2022-06-15T14:30:00Z', quantity: 20, costPerShare: 135.60, currentPrice: 189.84 }),
      createTaxLot({ lotId: 'lot_dk_041', accountId: 'acct_dk_004', symbol: 'AAPL', purchaseDate: '2023-12-10T11:15:00Z', quantity: 20, costPerShare: 195.40, currentPrice: 189.84 }),
      // GOOGL - 65 shares total (Custodial)
      createTaxLot({ lotId: 'lot_dk_042', accountId: 'acct_dk_004', symbol: 'GOOGL', purchaseDate: '2021-04-10T09:30:00Z', quantity: 35, costPerShare: 58.20, currentPrice: 153.41 }),
      createTaxLot({ lotId: 'lot_dk_043', accountId: 'acct_dk_004', symbol: 'GOOGL', purchaseDate: '2023-10-10T14:30:00Z', quantity: 30, costPerShare: 138.20, currentPrice: 153.41 }),
    ],
  },
];

/**
 * Seed mock cost basis data into storage if not already present.
 * Reads the current cost basis from storage; if the key does not exist or
 * contains no data, writes the full MOCK_COST_BASIS array.
 * @returns {boolean} True if cost basis was seeded, false if it already existed
 */
export function seedCostBasis() {
  const existing = getItem(COST_BASIS_STORAGE_KEY);

  if (existing !== null && Array.isArray(existing) && existing.length > 0) {
    return false;
  }

  return setItem(COST_BASIS_STORAGE_KEY, MOCK_COST_BASIS);
}

/**
 * Get cost basis data for a specific user.
 * @param {string} userId - The user ID to retrieve cost basis for
 * @returns {UserCostBasis | null} The user's cost basis data, or null if not found
 */
export function getCostBasisByUserId(userId) {
  if (!userId || typeof userId !== 'string') {
    return null;
  }

  const allCostBasis = getItem(COST_BASIS_STORAGE_KEY);

  if (!allCostBasis || !Array.isArray(allCostBasis)) {
    return null;
  }

  return allCostBasis.find((entry) => entry.userId === userId) || null;
}

/**
 * Get all tax lots for a specific user.
 * @param {string} userId - The user ID to retrieve tax lots for
 * @returns {TaxLot[]} Array of tax lots for the user, or empty array if not found
 */
export function getTaxLotsByUserId(userId) {
  const userCostBasis = getCostBasisByUserId(userId);

  return userCostBasis ? userCostBasis.taxLots : [];
}

/**
 * Get tax lots for a specific account.
 * @param {string} userId - The user ID
 * @param {string} accountId - The account ID to filter by
 * @returns {TaxLot[]} Array of tax lots for the account, or empty array if not found
 */
export function getTaxLotsByAccountId(userId, accountId) {
  if (!accountId || typeof accountId !== 'string') {
    return [];
  }

  const taxLots = getTaxLotsByUserId(userId);

  return taxLots.filter((lot) => lot.accountId === accountId);
}

/**
 * Get tax lots for a specific symbol.
 * @param {string} userId - The user ID
 * @param {string} symbol - The ticker symbol to filter by
 * @returns {TaxLot[]} Array of tax lots for the symbol, or empty array if not found
 */
export function getTaxLotsBySymbol(userId, symbol) {
  if (!symbol || typeof symbol !== 'string') {
    return [];
  }

  const taxLots = getTaxLotsByUserId(userId);

  return taxLots.filter((lot) => lot.symbol === symbol);
}

/**
 * Get a single tax lot by its ID.
 * @param {string} userId - The user ID
 * @param {string} lotId - The tax lot ID to find
 * @returns {TaxLot | null} The tax lot object, or null if not found
 */
export function getTaxLotById(userId, lotId) {
  if (!lotId || typeof lotId !== 'string') {
    return null;
  }

  const taxLots = getTaxLotsByUserId(userId);

  return taxLots.find((lot) => lot.lotId === lotId) || null;
}

/**
 * Get the current cost basis method for a user.
 * @param {string} userId - The user ID
 * @returns {string} The current cost basis method, or 'FIFO' as default
 */
export function getCurrentMethod(userId) {
  const userCostBasis = getCostBasisByUserId(userId);

  return userCostBasis ? userCostBasis.currentMethod : COST_BASIS_METHODS[0];
}

/**
 * Get tax lots filtered by holding period.
 * @param {string} userId - The user ID
 * @param {'Short-Term' | 'Long-Term'} holdingPeriod - The holding period to filter by
 * @returns {TaxLot[]} Array of tax lots matching the holding period
 */
export function getTaxLotsByHoldingPeriod(userId, holdingPeriod) {
  if (!holdingPeriod || typeof holdingPeriod !== 'string') {
    return [];
  }

  const taxLots = getTaxLotsByUserId(userId);

  return taxLots.filter((lot) => lot.holdingPeriod === holdingPeriod);
}

/**
 * Calculate cost basis summary for a user.
 * @param {string} userId - The user ID
 * @returns {{ totalLots: number, totalCostBasis: number, totalCurrentValue: number, totalGainLoss: number, totalGainLossPercent: number, shortTermLots: number, longTermLots: number, shortTermGainLoss: number, longTermGainLoss: number, currentMethod: string }}
 */
export function getCostBasisSummary(userId) {
  const userCostBasis = getCostBasisByUserId(userId);

  if (!userCostBasis || userCostBasis.taxLots.length === 0) {
    return {
      totalLots: 0,
      totalCostBasis: 0,
      totalCurrentValue: 0,
      totalGainLoss: 0,
      totalGainLossPercent: 0,
      shortTermLots: 0,
      longTermLots: 0,
      shortTermGainLoss: 0,
      longTermGainLoss: 0,
      currentMethod: COST_BASIS_METHODS[0],
    };
  }

  const { taxLots, currentMethod } = userCostBasis;

  let totalCostBasis = 0;
  let totalCurrentValue = 0;
  let shortTermLots = 0;
  let longTermLots = 0;
  let shortTermGainLoss = 0;
  let longTermGainLoss = 0;

  taxLots.forEach((lot) => {
    totalCostBasis += lot.totalCost;
    totalCurrentValue += lot.currentValue;

    if (lot.holdingPeriod === 'Short-Term') {
      shortTermLots += 1;
      shortTermGainLoss += lot.gainLoss.dollar;
    } else {
      longTermLots += 1;
      longTermGainLoss += lot.gainLoss.dollar;
    }
  });

  totalCostBasis = parseFloat(totalCostBasis.toFixed(2));
  totalCurrentValue = parseFloat(totalCurrentValue.toFixed(2));
  const totalGainLoss = parseFloat((totalCurrentValue - totalCostBasis).toFixed(2));
  const totalGainLossPercent = totalCostBasis !== 0
    ? parseFloat((totalGainLoss / totalCostBasis).toFixed(4))
    : 0;

  return {
    totalLots: taxLots.length,
    totalCostBasis,
    totalCurrentValue,
    totalGainLoss,
    totalGainLossPercent,
    shortTermLots,
    longTermLots,
    shortTermGainLoss: parseFloat(shortTermGainLoss.toFixed(2)),
    longTermGainLoss: parseFloat(longTermGainLoss.toFixed(2)),
    currentMethod,
  };
}

/**
 * Calculate cost basis summary for a specific symbol across all accounts.
 * @param {string} userId - The user ID
 * @param {string} symbol - The ticker symbol
 * @returns {{ symbol: string, totalLots: number, totalQuantity: number, totalCostBasis: number, totalCurrentValue: number, totalGainLoss: number, totalGainLossPercent: number, avgCostPerShare: number }}
 */
export function getSymbolCostBasisSummary(userId, symbol) {
  const lots = getTaxLotsBySymbol(userId, symbol);

  if (lots.length === 0) {
    return {
      symbol: symbol || '',
      totalLots: 0,
      totalQuantity: 0,
      totalCostBasis: 0,
      totalCurrentValue: 0,
      totalGainLoss: 0,
      totalGainLossPercent: 0,
      avgCostPerShare: 0,
    };
  }

  let totalQuantity = 0;
  let totalCostBasis = 0;
  let totalCurrentValue = 0;

  lots.forEach((lot) => {
    totalQuantity += lot.quantity;
    totalCostBasis += lot.totalCost;
    totalCurrentValue += lot.currentValue;
  });

  totalCostBasis = parseFloat(totalCostBasis.toFixed(2));
  totalCurrentValue = parseFloat(totalCurrentValue.toFixed(2));
  const totalGainLoss = parseFloat((totalCurrentValue - totalCostBasis).toFixed(2));
  const totalGainLossPercent = totalCostBasis !== 0
    ? parseFloat((totalGainLoss / totalCostBasis).toFixed(4))
    : 0;
  const avgCostPerShare = totalQuantity !== 0
    ? parseFloat((totalCostBasis / totalQuantity).toFixed(2))
    : 0;

  return {
    symbol,
    totalLots: lots.length,
    totalQuantity,
    totalCostBasis,
    totalCurrentValue,
    totalGainLoss,
    totalGainLossPercent,
    avgCostPerShare,
  };
}