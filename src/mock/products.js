/**
 * Pre-seeded mock products and services catalog data.
 * Provides investment products (Stocks, ETFs, Mutual Funds, Bonds, Options, Retirement Accounts)
 * and platform services (Research Tools, Portfolio Analysis, Tax Optimization, Financial Planning, Mobile Trading).
 * @module mock/products
 */

import { getItem, setItem } from '../utils/storageUtils.js';

/**
 * Storage key for products data.
 * @type {string}
 */
const PRODUCTS_STORAGE_KEY = 'meridian_products';

/**
 * Storage key for services data.
 * @type {string}
 */
const SERVICES_STORAGE_KEY = 'meridian_services';

/**
 * Product category constants.
 * @type {object}
 */
export const PRODUCT_CATEGORIES = {
  STOCKS: 'Stocks',
  ETFS: 'ETFs',
  MUTUAL_FUNDS: 'Mutual Funds',
  BONDS: 'Bonds',
  OPTIONS: 'Options',
  RETIREMENT_ACCOUNTS: 'Retirement Accounts',
};

/**
 * Risk level constants.
 * @type {object}
 */
export const RISK_LEVELS = {
  LOW: 'Low',
  MODERATE: 'Moderate',
  HIGH: 'High',
  VERY_HIGH: 'Very High',
};

/**
 * @typedef {object} Product
 * @property {string} id - Unique identifier for the product
 * @property {string} name - Human-readable product name
 * @property {string} description - Detailed description of the product
 * @property {string} category - Product category (Stocks, ETFs, Mutual Funds, Bonds, Options, Retirement Accounts)
 * @property {number} minInvestment - Minimum investment amount in dollars
 * @property {string} riskLevel - Risk level (Low, Moderate, High, Very High)
 */

/**
 * @typedef {object} Service
 * @property {string} id - Unique identifier for the service
 * @property {string} name - Human-readable service name
 * @property {string} description - Detailed description of the service
 * @property {string[]} features - Array of feature descriptions
 */

/**
 * Helper to create a product object.
 * @param {object} params - Product parameters
 * @param {string} params.id
 * @param {string} params.name
 * @param {string} params.description
 * @param {string} params.category
 * @param {number} params.minInvestment
 * @param {string} params.riskLevel
 * @returns {Product}
 */
function createProduct({ id, name, description, category, minInvestment, riskLevel }) {
  return {
    id,
    name,
    description,
    category,
    minInvestment,
    riskLevel,
  };
}

/**
 * Helper to create a service object.
 * @param {object} params - Service parameters
 * @param {string} params.id
 * @param {string} params.name
 * @param {string} params.description
 * @param {string[]} params.features
 * @returns {Service}
 */
function createService({ id, name, description, features }) {
  return {
    id,
    name,
    description,
    features,
  };
}

/** @type {Product[]} */
export const MOCK_PRODUCTS = [
  // Stocks
  createProduct({
    id: 'prod_stock_001',
    name: 'Individual Stock Trading',
    description: 'Buy and sell shares of publicly traded companies on major U.S. exchanges including NYSE and NASDAQ. Access real-time quotes, advanced charting, and comprehensive company research.',
    category: PRODUCT_CATEGORIES.STOCKS,
    minInvestment: 1,
    riskLevel: RISK_LEVELS.HIGH,
  }),
  createProduct({
    id: 'prod_stock_002',
    name: 'Fractional Shares',
    description: 'Invest in high-priced stocks with as little as $5. Own a fraction of shares in companies like Apple, Amazon, and Google without needing to purchase a full share.',
    category: PRODUCT_CATEGORIES.STOCKS,
    minInvestment: 5,
    riskLevel: RISK_LEVELS.HIGH,
  }),
  createProduct({
    id: 'prod_stock_003',
    name: 'Dividend Growth Stocks',
    description: 'Curated selection of blue-chip companies with a proven track record of increasing dividend payments. Ideal for income-focused investors seeking long-term wealth accumulation.',
    category: PRODUCT_CATEGORIES.STOCKS,
    minInvestment: 100,
    riskLevel: RISK_LEVELS.MODERATE,
  }),
  createProduct({
    id: 'prod_stock_004',
    name: 'International Stocks (ADRs)',
    description: 'Gain exposure to global markets through American Depositary Receipts. Invest in leading international companies traded on U.S. exchanges with familiar settlement processes.',
    category: PRODUCT_CATEGORIES.STOCKS,
    minInvestment: 50,
    riskLevel: RISK_LEVELS.HIGH,
  }),

  // ETFs
  createProduct({
    id: 'prod_etf_001',
    name: 'S&P 500 Index ETFs',
    description: 'Low-cost exchange-traded funds that track the S&P 500 index, providing broad exposure to 500 of the largest U.S. companies. Commission-free trading available.',
    category: PRODUCT_CATEGORIES.ETFS,
    minInvestment: 1,
    riskLevel: RISK_LEVELS.MODERATE,
  }),
  createProduct({
    id: 'prod_etf_002',
    name: 'Total Bond Market ETFs',
    description: 'Diversified bond ETFs covering U.S. investment-grade bonds including government, corporate, and mortgage-backed securities. Suitable for portfolio stabilization and income generation.',
    category: PRODUCT_CATEGORIES.ETFS,
    minInvestment: 1,
    riskLevel: RISK_LEVELS.LOW,
  }),
  createProduct({
    id: 'prod_etf_003',
    name: 'International Equity ETFs',
    description: 'Access developed and emerging market equities through diversified international ETFs. Reduce home-country bias and capture global growth opportunities.',
    category: PRODUCT_CATEGORIES.ETFS,
    minInvestment: 1,
    riskLevel: RISK_LEVELS.MODERATE,
  }),
  createProduct({
    id: 'prod_etf_004',
    name: 'Sector & Thematic ETFs',
    description: 'Targeted exposure to specific sectors such as technology, healthcare, energy, and thematic trends like clean energy, artificial intelligence, and cybersecurity.',
    category: PRODUCT_CATEGORIES.ETFS,
    minInvestment: 1,
    riskLevel: RISK_LEVELS.HIGH,
  }),
  createProduct({
    id: 'prod_etf_005',
    name: 'Dividend Appreciation ETFs',
    description: 'ETFs focused on companies with a history of consistently growing their dividends. Combines income generation with potential capital appreciation over time.',
    category: PRODUCT_CATEGORIES.ETFS,
    minInvestment: 1,
    riskLevel: RISK_LEVELS.MODERATE,
  }),

  // Mutual Funds
  createProduct({
    id: 'prod_mf_001',
    name: 'Vanguard 500 Index Fund Admiral',
    description: 'Low-cost mutual fund tracking the S&P 500 index with an expense ratio of 0.04%. Admiral shares offer reduced fees for investors meeting the minimum investment threshold.',
    category: PRODUCT_CATEGORIES.MUTUAL_FUNDS,
    minInvestment: 3000,
    riskLevel: RISK_LEVELS.MODERATE,
  }),
  createProduct({
    id: 'prod_mf_002',
    name: 'Total Stock Market Index Fund',
    description: 'Comprehensive exposure to the entire U.S. equity market including large-, mid-, and small-cap stocks. A single-fund solution for domestic equity allocation.',
    category: PRODUCT_CATEGORIES.MUTUAL_FUNDS,
    minInvestment: 3000,
    riskLevel: RISK_LEVELS.MODERATE,
  }),
  createProduct({
    id: 'prod_mf_003',
    name: 'Target-Date Retirement Funds',
    description: 'All-in-one funds that automatically adjust asset allocation from aggressive to conservative as you approach your target retirement date. Available in 5-year increments from 2025 to 2065.',
    category: PRODUCT_CATEGORIES.MUTUAL_FUNDS,
    minInvestment: 1000,
    riskLevel: RISK_LEVELS.MODERATE,
  }),
  createProduct({
    id: 'prod_mf_004',
    name: 'Actively Managed Growth Fund',
    description: 'Professionally managed fund seeking capital appreciation by investing in growth-oriented companies. Fund managers conduct in-depth fundamental analysis to identify high-potential opportunities.',
    category: PRODUCT_CATEGORIES.MUTUAL_FUNDS,
    minInvestment: 2500,
    riskLevel: RISK_LEVELS.HIGH,
  }),
  createProduct({
    id: 'prod_mf_005',
    name: 'Total Bond Market Index Fund',
    description: 'Broad exposure to the U.S. investment-grade bond market. Includes government, corporate, and securitized bonds with varying maturities for diversified fixed-income allocation.',
    category: PRODUCT_CATEGORIES.MUTUAL_FUNDS,
    minInvestment: 3000,
    riskLevel: RISK_LEVELS.LOW,
  }),

  // Bonds
  createProduct({
    id: 'prod_bond_001',
    name: 'U.S. Treasury Bonds',
    description: 'Government-backed securities offering predictable income with maturities ranging from 10 to 30 years. Considered among the safest investments available, backed by the full faith and credit of the U.S. government.',
    category: PRODUCT_CATEGORIES.BONDS,
    minInvestment: 100,
    riskLevel: RISK_LEVELS.LOW,
  }),
  createProduct({
    id: 'prod_bond_002',
    name: 'Corporate Investment-Grade Bonds',
    description: 'Fixed-income securities issued by financially stable corporations with credit ratings of BBB or higher. Offer higher yields than treasuries with moderate credit risk.',
    category: PRODUCT_CATEGORIES.BONDS,
    minInvestment: 1000,
    riskLevel: RISK_LEVELS.MODERATE,
  }),
  createProduct({
    id: 'prod_bond_003',
    name: 'Municipal Bonds',
    description: 'Tax-advantaged bonds issued by state and local governments. Interest income is typically exempt from federal taxes and may be exempt from state taxes for in-state residents.',
    category: PRODUCT_CATEGORIES.BONDS,
    minInvestment: 5000,
    riskLevel: RISK_LEVELS.LOW,
  }),
  createProduct({
    id: 'prod_bond_004',
    name: 'High-Yield Corporate Bonds',
    description: 'Bonds issued by companies with lower credit ratings offering higher yields to compensate for increased credit risk. Suitable for investors seeking enhanced income with higher risk tolerance.',
    category: PRODUCT_CATEGORIES.BONDS,
    minInvestment: 1000,
    riskLevel: RISK_LEVELS.HIGH,
  }),

  // Options
  createProduct({
    id: 'prod_opt_001',
    name: 'Equity Options Trading',
    description: 'Trade call and put options on individual stocks and ETFs. Strategies range from basic covered calls and protective puts to advanced multi-leg spreads. Requires options approval.',
    category: PRODUCT_CATEGORIES.OPTIONS,
    minInvestment: 2000,
    riskLevel: RISK_LEVELS.VERY_HIGH,
  }),
  createProduct({
    id: 'prod_opt_002',
    name: 'Index Options',
    description: 'Cash-settled options on major market indices including S&P 500, NASDAQ-100, and Russell 2000. Useful for portfolio hedging and broad market speculation.',
    category: PRODUCT_CATEGORIES.OPTIONS,
    minInvestment: 5000,
    riskLevel: RISK_LEVELS.VERY_HIGH,
  }),
  createProduct({
    id: 'prod_opt_003',
    name: 'Covered Call Strategy',
    description: 'Generate additional income from existing stock holdings by selling call options. A conservative options strategy suitable for investors seeking to enhance portfolio yield.',
    category: PRODUCT_CATEGORIES.OPTIONS,
    minInvestment: 2000,
    riskLevel: RISK_LEVELS.MODERATE,
  }),

  // Retirement Accounts
  createProduct({
    id: 'prod_ret_001',
    name: 'Traditional IRA',
    description: 'Tax-deferred individual retirement account allowing pre-tax contributions up to annual IRS limits. Investments grow tax-free until withdrawal in retirement. Contributions may be tax-deductible.',
    category: PRODUCT_CATEGORIES.RETIREMENT_ACCOUNTS,
    minInvestment: 0,
    riskLevel: RISK_LEVELS.MODERATE,
  }),
  createProduct({
    id: 'prod_ret_002',
    name: 'Roth IRA',
    description: 'After-tax retirement account offering tax-free growth and tax-free qualified withdrawals in retirement. No required minimum distributions during the account holder\'s lifetime.',
    category: PRODUCT_CATEGORIES.RETIREMENT_ACCOUNTS,
    minInvestment: 0,
    riskLevel: RISK_LEVELS.MODERATE,
  }),
  createProduct({
    id: 'prod_ret_003',
    name: 'SEP IRA',
    description: 'Simplified Employee Pension plan designed for self-employed individuals and small business owners. Allows higher contribution limits than traditional IRAs with flexible annual contributions.',
    category: PRODUCT_CATEGORIES.RETIREMENT_ACCOUNTS,
    minInvestment: 0,
    riskLevel: RISK_LEVELS.MODERATE,
  }),
  createProduct({
    id: 'prod_ret_004',
    name: 'Rollover IRA',
    description: 'Transfer assets from a former employer\'s 401(k) or other qualified retirement plan into an IRA. Maintain tax-deferred status while gaining access to a broader range of investment options.',
    category: PRODUCT_CATEGORIES.RETIREMENT_ACCOUNTS,
    minInvestment: 0,
    riskLevel: RISK_LEVELS.MODERATE,
  }),
];

/** @type {Service[]} */
export const MOCK_SERVICES = [
  createService({
    id: 'svc_001',
    name: 'Research Tools',
    description: 'Comprehensive suite of research and analysis tools to help you make informed investment decisions. Access real-time market data, analyst reports, and proprietary screening tools.',
    features: [
      'Real-time stock quotes and market data',
      'Analyst ratings and price targets from leading firms',
      'Advanced stock and ETF screener with 100+ filters',
      'Interactive charting with technical indicators',
      'Earnings calendar and financial statement analysis',
      'Sector and industry performance comparisons',
      'Economic indicators and market commentary',
      'Watchlist management with custom alerts',
    ],
  }),
  createService({
    id: 'svc_002',
    name: 'Portfolio Analysis',
    description: 'In-depth portfolio analytics providing insights into asset allocation, risk exposure, performance attribution, and diversification metrics to optimize your investment strategy.',
    features: [
      'Asset allocation breakdown by sector, geography, and asset class',
      'Risk analysis including beta, standard deviation, and Sharpe ratio',
      'Performance attribution and benchmark comparison',
      'Diversification score and concentration risk alerts',
      'Unrealized and realized gain/loss tracking',
      'Dividend income projections and yield analysis',
      'Portfolio rebalancing recommendations',
      'Historical performance charting with custom date ranges',
    ],
  }),
  createService({
    id: 'svc_003',
    name: 'Tax Optimization',
    description: 'Intelligent tax management tools designed to minimize your tax liability and maximize after-tax returns. Automated tax-loss harvesting and comprehensive tax reporting.',
    features: [
      'Automated tax-loss harvesting across eligible accounts',
      'Wash sale rule monitoring and prevention',
      'Cost basis method optimization (FIFO, LIFO, Specific ID, Average Cost)',
      'Year-end tax planning projections',
      'Capital gains and losses summary reports',
      'Tax-efficient asset location recommendations',
      'Estimated tax payment calculator',
      'Downloadable tax forms (1099-B, 1099-DIV, 1099-INT)',
    ],
  }),
  createService({
    id: 'svc_004',
    name: 'Financial Planning',
    description: 'Personalized financial planning services combining digital tools with access to certified financial planners. Build a comprehensive plan for retirement, education, and major life goals.',
    features: [
      'Retirement readiness assessment and projections',
      'Goal-based planning for education, home purchase, and more',
      'Social Security optimization strategies',
      'Monte Carlo simulation for retirement scenarios',
      'Estate planning overview and beneficiary management',
      'Insurance needs analysis',
      'Access to Certified Financial Planners (CFP) via video consultation',
      'Personalized action plans with progress tracking',
    ],
  }),
  createService({
    id: 'svc_005',
    name: 'Mobile Trading',
    description: 'Full-featured mobile trading platform available on iOS and Android. Trade stocks, ETFs, and options on the go with the same powerful tools available on desktop.',
    features: [
      'Real-time streaming quotes and watchlists',
      'One-swipe trading for quick order execution',
      'Advanced order types including stop-loss and trailing stops',
      'Biometric authentication (Face ID, Touch ID, fingerprint)',
      'Push notifications for price alerts and order fills',
      'Mobile check deposit for account funding',
      'Dark mode and customizable dashboard layouts',
      'Offline portfolio viewing with last-synced data',
    ],
  }),
];

/**
 * Seed mock products into storage if not already present.
 * Reads the current products from storage; if the key does not exist or
 * contains no data, writes the full MOCK_PRODUCTS array.
 * @returns {boolean} True if products were seeded, false if they already existed
 */
export function seedProducts() {
  const existing = getItem(PRODUCTS_STORAGE_KEY);

  if (existing !== null && Array.isArray(existing) && existing.length > 0) {
    return false;
  }

  return setItem(PRODUCTS_STORAGE_KEY, MOCK_PRODUCTS);
}

/**
 * Seed mock services into storage if not already present.
 * Reads the current services from storage; if the key does not exist or
 * contains no data, writes the full MOCK_SERVICES array.
 * @returns {boolean} True if services were seeded, false if they already existed
 */
export function seedServices() {
  const existing = getItem(SERVICES_STORAGE_KEY);

  if (existing !== null && Array.isArray(existing) && existing.length > 0) {
    return false;
  }

  return setItem(SERVICES_STORAGE_KEY, MOCK_SERVICES);
}

/**
 * Get all products from storage.
 * @returns {Product[]} Array of all products, or empty array if not found
 */
export function getAllProducts() {
  const products = getItem(PRODUCTS_STORAGE_KEY);

  if (!products || !Array.isArray(products)) {
    return [];
  }

  return products;
}

/**
 * Get all services from storage.
 * @returns {Service[]} Array of all services, or empty array if not found
 */
export function getAllServices() {
  const services = getItem(SERVICES_STORAGE_KEY);

  if (!services || !Array.isArray(services)) {
    return [];
  }

  return services;
}

/**
 * Get a single product by its ID.
 * @param {string} productId - The product ID to find
 * @returns {Product | null} The product object, or null if not found
 */
export function getProductById(productId) {
  if (!productId || typeof productId !== 'string') {
    return null;
  }

  const products = getAllProducts();

  return products.find((product) => product.id === productId) || null;
}

/**
 * Get a single service by its ID.
 * @param {string} serviceId - The service ID to find
 * @returns {Service | null} The service object, or null if not found
 */
export function getServiceById(serviceId) {
  if (!serviceId || typeof serviceId !== 'string') {
    return null;
  }

  const services = getAllServices();

  return services.find((service) => service.id === serviceId) || null;
}

/**
 * Get products filtered by category.
 * @param {string} category - The product category to filter by (e.g., 'Stocks', 'ETFs')
 * @returns {Product[]} Array of products matching the category
 */
export function getProductsByCategory(category) {
  if (!category || typeof category !== 'string') {
    return [];
  }

  const products = getAllProducts();

  return products.filter((product) => product.category === category);
}

/**
 * Get products filtered by risk level.
 * @param {string} riskLevel - The risk level to filter by (e.g., 'Low', 'Moderate', 'High', 'Very High')
 * @returns {Product[]} Array of products matching the risk level
 */
export function getProductsByRiskLevel(riskLevel) {
  if (!riskLevel || typeof riskLevel !== 'string') {
    return [];
  }

  const products = getAllProducts();

  return products.filter((product) => product.riskLevel === riskLevel);
}

/**
 * Get products filtered by maximum minimum investment amount.
 * @param {number} maxMinInvestment - The maximum minimum investment threshold
 * @returns {Product[]} Array of products with minInvestment at or below the threshold
 */
export function getProductsByMaxMinInvestment(maxMinInvestment) {
  if (maxMinInvestment === null || maxMinInvestment === undefined || isNaN(maxMinInvestment)) {
    return [];
  }

  const products = getAllProducts();

  return products.filter((product) => product.minInvestment <= maxMinInvestment);
}

/**
 * Calculate product catalog summary.
 * @returns {{ totalProducts: number, totalServices: number, categoryCounts: Record<string, number>, riskLevelCounts: Record<string, number> }}
 */
export function getProductCatalogSummary() {
  const products = getAllProducts();
  const services = getAllServices();

  const categoryCounts = {};
  const riskLevelCounts = {};

  products.forEach((product) => {
    if (product.category) {
      categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1;
    }
    if (product.riskLevel) {
      riskLevelCounts[product.riskLevel] = (riskLevelCounts[product.riskLevel] || 0) + 1;
    }
  });

  return {
    totalProducts: products.length,
    totalServices: services.length,
    categoryCounts,
    riskLevelCounts,
  };
}