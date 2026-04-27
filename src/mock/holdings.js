/**
 * Pre-seeded mock holdings/portfolio data per user.
 * Each user has an array of holdings spanning stocks, ETFs, bonds, and mutual funds.
 * @module mock/holdings
 */

import { getItem, setItem } from '../utils/storageUtils.js';

/**
 * Storage key for holdings data.
 * @type {string}
 */
const HOLDINGS_STORAGE_KEY = 'meridian_holdings';

/**
 * @typedef {object} Holding
 * @property {string} holdingId - Unique identifier for the holding
 * @property {string} accountId - The account this holding belongs to
 * @property {string} symbol - Ticker symbol
 * @property {string} name - Full security name
 * @property {number} quantity - Number of shares/units held
 * @property {number} avgCost - Average cost basis per share/unit
 * @property {number} currentPrice - Current market price per share/unit
 * @property {number} marketValue - Total current market value (quantity * currentPrice)
 * @property {object} unrealizedGainLoss - Unrealized gain/loss details
 * @property {number} unrealizedGainLoss.dollar - Dollar amount of unrealized gain/loss
 * @property {number} unrealizedGainLoss.percent - Percentage of unrealized gain/loss (as decimal, e.g. 0.12 = 12%)
 * @property {string} sector - Market sector classification
 * @property {string} assetType - Asset type: 'Stock', 'ETF', 'Bond', or 'Mutual Fund'
 */

/**
 * @typedef {object} UserHoldings
 * @property {string} userId - The user ID
 * @property {Holding[]} holdings - Array of holdings for this user
 */

/**
 * Helper to compute derived holding fields from quantity, avgCost, and currentPrice.
 * @param {object} params - Holding parameters
 * @param {string} params.holdingId
 * @param {string} params.accountId
 * @param {string} params.symbol
 * @param {string} params.name
 * @param {number} params.quantity
 * @param {number} params.avgCost
 * @param {number} params.currentPrice
 * @param {string} params.sector
 * @param {string} params.assetType
 * @returns {Holding}
 */
function createHolding({ holdingId, accountId, symbol, name, quantity, avgCost, currentPrice, sector, assetType }) {
  const marketValue = parseFloat((quantity * currentPrice).toFixed(2));
  const costBasis = parseFloat((quantity * avgCost).toFixed(2));
  const dollarGainLoss = parseFloat((marketValue - costBasis).toFixed(2));
  const percentGainLoss = costBasis !== 0 ? parseFloat((dollarGainLoss / costBasis).toFixed(4)) : 0;

  return {
    holdingId,
    accountId,
    symbol,
    name,
    quantity,
    avgCost,
    currentPrice,
    marketValue,
    unrealizedGainLoss: {
      dollar: dollarGainLoss,
      percent: percentGainLoss,
    },
    sector,
    assetType,
  };
}

/** @type {UserHoldings[]} */
export const MOCK_HOLDINGS = [
  // James Morgan (usr_jm_001)
  {
    userId: 'usr_jm_001',
    holdings: [
      createHolding({ holdingId: 'hld_jm_001', accountId: 'acct_jm_001', symbol: 'AAPL', name: 'Apple Inc.', quantity: 150, avgCost: 142.50, currentPrice: 189.84, sector: 'Technology', assetType: 'Stock' }),
      createHolding({ holdingId: 'hld_jm_002', accountId: 'acct_jm_001', symbol: 'MSFT', name: 'Microsoft Corporation', quantity: 85, avgCost: 285.30, currentPrice: 415.60, sector: 'Technology', assetType: 'Stock' }),
      createHolding({ holdingId: 'hld_jm_003', accountId: 'acct_jm_001', symbol: 'VOO', name: 'Vanguard S&P 500 ETF', quantity: 60, avgCost: 380.00, currentPrice: 462.35, sector: 'Broad Market', assetType: 'ETF' }),
      createHolding({ holdingId: 'hld_jm_004', accountId: 'acct_jm_001', symbol: 'BND', name: 'Vanguard Total Bond Market ETF', quantity: 200, avgCost: 76.50, currentPrice: 72.18, sector: 'Fixed Income', assetType: 'ETF' }),
      createHolding({ holdingId: 'hld_jm_005', accountId: 'acct_jm_001', symbol: 'JNJ', name: 'Johnson & Johnson', quantity: 40, avgCost: 158.20, currentPrice: 156.74, sector: 'Healthcare', assetType: 'Stock' }),
      createHolding({ holdingId: 'hld_jm_006', accountId: 'acct_jm_001', symbol: 'AMZN', name: 'Amazon.com Inc.', quantity: 70, avgCost: 128.45, currentPrice: 178.25, sector: 'Consumer Discretionary', assetType: 'Stock' }),
      createHolding({ holdingId: 'hld_jm_007', accountId: 'acct_jm_002', symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', quantity: 120, avgCost: 205.80, currentPrice: 252.47, sector: 'Broad Market', assetType: 'ETF' }),
      createHolding({ holdingId: 'hld_jm_008', accountId: 'acct_jm_002', symbol: 'VXUS', name: 'Vanguard Total International Stock ETF', quantity: 95, avgCost: 54.30, currentPrice: 57.82, sector: 'International', assetType: 'ETF' }),
      createHolding({ holdingId: 'hld_jm_009', accountId: 'acct_jm_002', symbol: 'GOOGL', name: 'Alphabet Inc. Class A', quantity: 55, avgCost: 105.60, currentPrice: 153.41, sector: 'Technology', assetType: 'Stock' }),
      createHolding({ holdingId: 'hld_jm_010', accountId: 'acct_jm_002', symbol: 'FXAIX', name: 'Fidelity 500 Index Fund', quantity: 180, avgCost: 155.00, currentPrice: 183.92, sector: 'Broad Market', assetType: 'Mutual Fund' }),
      createHolding({ holdingId: 'hld_jm_011', accountId: 'acct_jm_001', symbol: 'PG', name: 'Procter & Gamble Co.', quantity: 30, avgCost: 145.90, currentPrice: 162.35, sector: 'Consumer Staples', assetType: 'Stock' }),
    ],
  },
  // Sarah Chen (usr_sc_002)
  {
    userId: 'usr_sc_002',
    holdings: [
      createHolding({ holdingId: 'hld_sc_001', accountId: 'acct_sc_001', symbol: 'NVDA', name: 'NVIDIA Corporation', quantity: 100, avgCost: 245.80, currentPrice: 878.36, sector: 'Technology', assetType: 'Stock' }),
      createHolding({ holdingId: 'hld_sc_002', accountId: 'acct_sc_001', symbol: 'TSLA', name: 'Tesla Inc.', quantity: 60, avgCost: 198.50, currentPrice: 175.22, sector: 'Consumer Discretionary', assetType: 'Stock' }),
      createHolding({ holdingId: 'hld_sc_003', accountId: 'acct_sc_001', symbol: 'QQQ', name: 'Invesco QQQ Trust', quantity: 45, avgCost: 355.20, currentPrice: 438.67, sector: 'Technology', assetType: 'ETF' }),
      createHolding({ holdingId: 'hld_sc_004', accountId: 'acct_sc_001', symbol: 'AMD', name: 'Advanced Micro Devices Inc.', quantity: 120, avgCost: 98.75, currentPrice: 177.54, sector: 'Technology', assetType: 'Stock' }),
      createHolding({ holdingId: 'hld_sc_005', accountId: 'acct_sc_001', symbol: 'META', name: 'Meta Platforms Inc.', quantity: 40, avgCost: 285.00, currentPrice: 484.10, sector: 'Communication Services', assetType: 'Stock' }),
      createHolding({ holdingId: 'hld_sc_006', accountId: 'acct_sc_001', symbol: 'ARKK', name: 'ARK Innovation ETF', quantity: 150, avgCost: 52.30, currentPrice: 47.85, sector: 'Technology', assetType: 'ETF' }),
      createHolding({ holdingId: 'hld_sc_007', accountId: 'acct_sc_001', symbol: 'SOXX', name: 'iShares Semiconductor ETF', quantity: 30, avgCost: 420.00, currentPrice: 578.92, sector: 'Technology', assetType: 'ETF' }),
      createHolding({ holdingId: 'hld_sc_008', accountId: 'acct_sc_001', symbol: 'CRM', name: 'Salesforce Inc.', quantity: 35, avgCost: 210.40, currentPrice: 298.56, sector: 'Technology', assetType: 'Stock' }),
      createHolding({ holdingId: 'hld_sc_009', accountId: 'acct_sc_001', symbol: 'SQ', name: 'Block Inc.', quantity: 80, avgCost: 68.90, currentPrice: 78.43, sector: 'Financials', assetType: 'Stock' }),
      createHolding({ holdingId: 'hld_sc_010', accountId: 'acct_sc_001', symbol: 'COIN', name: 'Coinbase Global Inc.', quantity: 50, avgCost: 115.20, currentPrice: 205.78, sector: 'Financials', assetType: 'Stock' }),
    ],
  },
  // Robert Patel (usr_rp_003)
  {
    userId: 'usr_rp_003',
    holdings: [
      createHolding({ holdingId: 'hld_rp_001', accountId: 'acct_rp_001', symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', quantity: 200, avgCost: 190.25, currentPrice: 252.47, sector: 'Broad Market', assetType: 'ETF' }),
      createHolding({ holdingId: 'hld_rp_002', accountId: 'acct_rp_001', symbol: 'AAPL', name: 'Apple Inc.', quantity: 100, avgCost: 120.00, currentPrice: 189.84, sector: 'Technology', assetType: 'Stock' }),
      createHolding({ holdingId: 'hld_rp_003', accountId: 'acct_rp_001', symbol: 'BRK.B', name: 'Berkshire Hathaway Inc. Class B', quantity: 50, avgCost: 310.50, currentPrice: 408.72, sector: 'Financials', assetType: 'Stock' }),
      createHolding({ holdingId: 'hld_rp_004', accountId: 'acct_rp_001', symbol: 'VBTLX', name: 'Vanguard Total Bond Market Index Fund', quantity: 300, avgCost: 10.45, currentPrice: 9.82, sector: 'Fixed Income', assetType: 'Mutual Fund' }),
      createHolding({ holdingId: 'hld_rp_005', accountId: 'acct_rp_002', symbol: 'VFIAX', name: 'Vanguard 500 Index Fund Admiral', quantity: 250, avgCost: 380.00, currentPrice: 445.18, sector: 'Broad Market', assetType: 'Mutual Fund' }),
      createHolding({ holdingId: 'hld_rp_006', accountId: 'acct_rp_002', symbol: 'AGG', name: 'iShares Core U.S. Aggregate Bond ETF', quantity: 180, avgCost: 102.30, currentPrice: 97.56, sector: 'Fixed Income', assetType: 'ETF' }),
      createHolding({ holdingId: 'hld_rp_007', accountId: 'acct_rp_002', symbol: 'TLT', name: 'iShares 20+ Year Treasury Bond ETF', quantity: 100, avgCost: 105.80, currentPrice: 92.45, sector: 'Fixed Income', assetType: 'ETF' }),
      createHolding({ holdingId: 'hld_rp_008', accountId: 'acct_rp_003', symbol: 'VIG', name: 'Vanguard Dividend Appreciation ETF', quantity: 150, avgCost: 155.40, currentPrice: 178.93, sector: 'Broad Market', assetType: 'ETF' }),
      createHolding({ holdingId: 'hld_rp_009', accountId: 'acct_rp_003', symbol: 'XOM', name: 'Exxon Mobil Corporation', quantity: 80, avgCost: 85.60, currentPrice: 104.28, sector: 'Energy', assetType: 'Stock' }),
      createHolding({ holdingId: 'hld_rp_010', accountId: 'acct_rp_003', symbol: 'JPM', name: 'JPMorgan Chase & Co.', quantity: 60, avgCost: 138.90, currentPrice: 196.52, sector: 'Financials', assetType: 'Stock' }),
      createHolding({ holdingId: 'hld_rp_011', accountId: 'acct_rp_001', symbol: 'HD', name: 'The Home Depot Inc.', quantity: 25, avgCost: 305.20, currentPrice: 362.48, sector: 'Consumer Discretionary', assetType: 'Stock' }),
      createHolding({ holdingId: 'hld_rp_012', accountId: 'acct_rp_003', symbol: 'SCHD', name: 'Schwab U.S. Dividend Equity ETF', quantity: 110, avgCost: 72.15, currentPrice: 79.34, sector: 'Broad Market', assetType: 'ETF' }),
    ],
  },
  // Emily Watson (usr_ew_004)
  {
    userId: 'usr_ew_004',
    holdings: [
      createHolding({ holdingId: 'hld_ew_001', accountId: 'acct_ew_001', symbol: 'VOO', name: 'Vanguard S&P 500 ETF', quantity: 30, avgCost: 395.00, currentPrice: 462.35, sector: 'Broad Market', assetType: 'ETF' }),
      createHolding({ holdingId: 'hld_ew_002', accountId: 'acct_ew_001', symbol: 'AAPL', name: 'Apple Inc.', quantity: 20, avgCost: 165.30, currentPrice: 189.84, sector: 'Technology', assetType: 'Stock' }),
      createHolding({ holdingId: 'hld_ew_003', accountId: 'acct_ew_001', symbol: 'MSFT', name: 'Microsoft Corporation', quantity: 15, avgCost: 340.00, currentPrice: 415.60, sector: 'Technology', assetType: 'Stock' }),
      createHolding({ holdingId: 'hld_ew_004', accountId: 'acct_ew_001', symbol: 'BND', name: 'Vanguard Total Bond Market ETF', quantity: 50, avgCost: 74.80, currentPrice: 72.18, sector: 'Fixed Income', assetType: 'ETF' }),
      createHolding({ holdingId: 'hld_ew_005', accountId: 'acct_ew_001', symbol: 'KO', name: 'The Coca-Cola Company', quantity: 45, avgCost: 56.20, currentPrice: 60.87, sector: 'Consumer Staples', assetType: 'Stock' }),
      createHolding({ holdingId: 'hld_ew_006', accountId: 'acct_ew_002', symbol: 'VTSAX', name: 'Vanguard Total Stock Market Index Fund', quantity: 80, avgCost: 105.50, currentPrice: 118.24, sector: 'Broad Market', assetType: 'Mutual Fund' }),
      createHolding({ holdingId: 'hld_ew_007', accountId: 'acct_ew_002', symbol: 'VTIAX', name: 'Vanguard Total International Stock Index Fund', quantity: 60, avgCost: 30.80, currentPrice: 33.15, sector: 'International', assetType: 'Mutual Fund' }),
      createHolding({ holdingId: 'hld_ew_008', accountId: 'acct_ew_002', symbol: 'VTBLX', name: 'Vanguard Total Bond Market Index Fund Institutional', quantity: 100, avgCost: 10.20, currentPrice: 9.78, sector: 'Fixed Income', assetType: 'Mutual Fund' }),
    ],
  },
  // David Kim (usr_dk_005)
  {
    userId: 'usr_dk_005',
    holdings: [
      createHolding({ holdingId: 'hld_dk_001', accountId: 'acct_dk_001', symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', quantity: 350, avgCost: 165.40, currentPrice: 252.47, sector: 'Broad Market', assetType: 'ETF' }),
      createHolding({ holdingId: 'hld_dk_002', accountId: 'acct_dk_001', symbol: 'VXUS', name: 'Vanguard Total International Stock ETF', quantity: 200, avgCost: 48.90, currentPrice: 57.82, sector: 'International', assetType: 'ETF' }),
      createHolding({ holdingId: 'hld_dk_003', accountId: 'acct_dk_001', symbol: 'BRK.B', name: 'Berkshire Hathaway Inc. Class B', quantity: 120, avgCost: 225.00, currentPrice: 408.72, sector: 'Financials', assetType: 'Stock' }),
      createHolding({ holdingId: 'hld_dk_004', accountId: 'acct_dk_001', symbol: 'JNJ', name: 'Johnson & Johnson', quantity: 90, avgCost: 135.60, currentPrice: 156.74, sector: 'Healthcare', assetType: 'Stock' }),
      createHolding({ holdingId: 'hld_dk_005', accountId: 'acct_dk_002', symbol: 'VFIAX', name: 'Vanguard 500 Index Fund Admiral', quantity: 400, avgCost: 310.00, currentPrice: 445.18, sector: 'Broad Market', assetType: 'Mutual Fund' }),
      createHolding({ holdingId: 'hld_dk_006', accountId: 'acct_dk_002', symbol: 'VBTLX', name: 'Vanguard Total Bond Market Index Fund', quantity: 500, avgCost: 10.80, currentPrice: 9.82, sector: 'Fixed Income', assetType: 'Mutual Fund' }),
      createHolding({ holdingId: 'hld_dk_007', accountId: 'acct_dk_002', symbol: 'AGG', name: 'iShares Core U.S. Aggregate Bond ETF', quantity: 250, avgCost: 108.50, currentPrice: 97.56, sector: 'Fixed Income', assetType: 'ETF' }),
      createHolding({ holdingId: 'hld_dk_008', accountId: 'acct_dk_003', symbol: 'VIG', name: 'Vanguard Dividend Appreciation ETF', quantity: 180, avgCost: 140.20, currentPrice: 178.93, sector: 'Broad Market', assetType: 'ETF' }),
      createHolding({ holdingId: 'hld_dk_009', accountId: 'acct_dk_003', symbol: 'SCHD', name: 'Schwab U.S. Dividend Equity ETF', quantity: 220, avgCost: 65.80, currentPrice: 79.34, sector: 'Broad Market', assetType: 'ETF' }),
      createHolding({ holdingId: 'hld_dk_010', accountId: 'acct_dk_003', symbol: 'PG', name: 'Procter & Gamble Co.', quantity: 75, avgCost: 128.40, currentPrice: 162.35, sector: 'Consumer Staples', assetType: 'Stock' }),
      createHolding({ holdingId: 'hld_dk_011', accountId: 'acct_dk_003', symbol: 'XOM', name: 'Exxon Mobil Corporation', quantity: 100, avgCost: 62.30, currentPrice: 104.28, sector: 'Energy', assetType: 'Stock' }),
      createHolding({ holdingId: 'hld_dk_012', accountId: 'acct_dk_004', symbol: 'QQQ', name: 'Invesco QQQ Trust', quantity: 40, avgCost: 310.50, currentPrice: 438.67, sector: 'Technology', assetType: 'ETF' }),
      createHolding({ holdingId: 'hld_dk_013', accountId: 'acct_dk_004', symbol: 'AAPL', name: 'Apple Inc.', quantity: 80, avgCost: 130.00, currentPrice: 189.84, sector: 'Technology', assetType: 'Stock' }),
      createHolding({ holdingId: 'hld_dk_014', accountId: 'acct_dk_004', symbol: 'GOOGL', name: 'Alphabet Inc. Class A', quantity: 65, avgCost: 92.40, currentPrice: 153.41, sector: 'Technology', assetType: 'Stock' }),
      createHolding({ holdingId: 'hld_dk_015', accountId: 'acct_dk_001', symbol: 'TLT', name: 'iShares 20+ Year Treasury Bond ETF', quantity: 150, avgCost: 118.90, currentPrice: 92.45, sector: 'Fixed Income', assetType: 'ETF' }),
    ],
  },
];

/**
 * Seed mock holdings into storage if not already present.
 * Reads the current holdings from storage; if the key does not exist or
 * contains no data, writes the full MOCK_HOLDINGS array.
 * @returns {boolean} True if holdings were seeded, false if they already existed
 */
export function seedHoldings() {
  const existing = getItem(HOLDINGS_STORAGE_KEY);

  if (existing !== null && Array.isArray(existing) && existing.length > 0) {
    return false;
  }

  return setItem(HOLDINGS_STORAGE_KEY, MOCK_HOLDINGS);
}

/**
 * Get all holdings for a specific user.
 * @param {string} userId - The user ID to retrieve holdings for
 * @returns {Holding[]} Array of holdings for the user, or empty array if not found
 */
export function getHoldingsByUserId(userId) {
  if (!userId || typeof userId !== 'string') {
    return [];
  }

  const allHoldings = getItem(HOLDINGS_STORAGE_KEY);

  if (!allHoldings || !Array.isArray(allHoldings)) {
    return [];
  }

  const userHoldings = allHoldings.find((entry) => entry.userId === userId);

  return userHoldings ? userHoldings.holdings : [];
}

/**
 * Get holdings for a specific account.
 * @param {string} userId - The user ID
 * @param {string} accountId - The account ID to filter by
 * @returns {Holding[]} Array of holdings for the account, or empty array if not found
 */
export function getHoldingsByAccountId(userId, accountId) {
  if (!accountId || typeof accountId !== 'string') {
    return [];
  }

  const userHoldings = getHoldingsByUserId(userId);

  return userHoldings.filter((holding) => holding.accountId === accountId);
}

/**
 * Get a single holding by its ID.
 * @param {string} userId - The user ID
 * @param {string} holdingId - The holding ID to find
 * @returns {Holding | null} The holding object, or null if not found
 */
export function getHoldingById(userId, holdingId) {
  if (!holdingId || typeof holdingId !== 'string') {
    return null;
  }

  const userHoldings = getHoldingsByUserId(userId);

  return userHoldings.find((holding) => holding.holdingId === holdingId) || null;
}

/**
 * Calculate portfolio summary for a user.
 * @param {string} userId - The user ID
 * @returns {{ totalMarketValue: number, totalCostBasis: number, totalGainLoss: number, totalGainLossPercent: number, holdingsCount: number }}
 */
export function getPortfolioSummary(userId) {
  const holdings = getHoldingsByUserId(userId);

  if (holdings.length === 0) {
    return {
      totalMarketValue: 0,
      totalCostBasis: 0,
      totalGainLoss: 0,
      totalGainLossPercent: 0,
      holdingsCount: 0,
    };
  }

  let totalMarketValue = 0;
  let totalCostBasis = 0;

  holdings.forEach((holding) => {
    totalMarketValue += holding.marketValue;
    totalCostBasis += holding.quantity * holding.avgCost;
  });

  totalMarketValue = parseFloat(totalMarketValue.toFixed(2));
  totalCostBasis = parseFloat(totalCostBasis.toFixed(2));

  const totalGainLoss = parseFloat((totalMarketValue - totalCostBasis).toFixed(2));
  const totalGainLossPercent = totalCostBasis !== 0
    ? parseFloat((totalGainLoss / totalCostBasis).toFixed(4))
    : 0;

  return {
    totalMarketValue,
    totalCostBasis,
    totalGainLoss,
    totalGainLossPercent,
    holdingsCount: holdings.length,
  };
}