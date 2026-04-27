/**
 * Accounts overview page rendered at /accounts.
 * Displays welcome banner with user's first name and current date,
 * account summary cards, asset allocation DonutChart, and quick-action buttons.
 * New users with no accounts see EmptyState.
 * @module pages/AccountsPage
 */

import React, { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BanknotesIcon,
  ArrowsRightLeftIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { useSessionStore } from '../store/sessionStore.js';
import { useUserStore } from '../store/userStore.js';
import DonutChart from '../components/DonutChart.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Badge from '../components/Badge.jsx';
import { showInfoToast } from '../components/Toast.jsx';
import { formatCurrency, formatDate, formatAccountNumber, formatPercentage } from '../utils/formatters.js';

/**
 * Format the current date as a human-readable string.
 * @returns {string} Formatted date string (e.g., "Monday, February 12, 2024")
 */
function getFormattedToday() {
  const now = new Date();
  return now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Compute asset allocation data from holdings grouped by sector.
 * @param {Array} holdings - Array of holding objects
 * @returns {Array<{name: string, value: number}>} Allocation data for DonutChart
 */
function computeSectorAllocation(holdings) {
  if (!holdings || !Array.isArray(holdings) || holdings.length === 0) {
    return [];
  }

  const sectorMap = {};

  holdings.forEach((holding) => {
    const sector = holding.sector || 'Other';
    if (!sectorMap[sector]) {
      sectorMap[sector] = 0;
    }
    sectorMap[sector] += holding.marketValue || 0;
  });

  return Object.entries(sectorMap)
    .map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2)),
    }))
    .sort((a, b) => b.value - a.value);
}

/**
 * Compute asset allocation data from holdings grouped by asset type.
 * @param {Array} holdings - Array of holding objects
 * @returns {Array<{name: string, value: number}>} Allocation data for DonutChart
 */
function computeAssetTypeAllocation(holdings) {
  if (!holdings || !Array.isArray(holdings) || holdings.length === 0) {
    return [];
  }

  const typeMap = {};

  holdings.forEach((holding) => {
    const assetType = holding.assetType || 'Other';
    if (!typeMap[assetType]) {
      typeMap[assetType] = 0;
    }
    typeMap[assetType] += holding.marketValue || 0;
  });

  return Object.entries(typeMap)
    .map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2)),
    }))
    .sort((a, b) => b.value - a.value);
}

/**
 * Quick action button configuration.
 * @type {Array<{label: string, icon: React.ComponentType, color: string}>}
 */
const QUICK_ACTIONS = [
  { label: 'Trade', icon: ChartBarIcon, color: 'bg-primary-50 text-primary-700 hover:bg-primary-100' },
  { label: 'Transfer', icon: ArrowsRightLeftIcon, color: 'bg-purple-50 text-purple-700 hover:bg-purple-100' },
  { label: 'Deposit', icon: ArrowDownTrayIcon, color: 'bg-success-50 text-success-700 hover:bg-success-100' },
  { label: 'Withdraw', icon: ArrowUpTrayIcon, color: 'bg-warning-50 text-warning-700 hover:bg-warning-100' },
];

/**
 * AccountsPage component for displaying the accounts overview dashboard.
 * Shows welcome banner, account summary cards, asset allocation charts,
 * and quick-action buttons. Reads data from sessionStore and userStore.
 * @returns {React.ReactElement} The AccountsPage component
 */
function AccountsPage() {
  const currentUser = useSessionStore((state) => state.currentUser);
  const getHoldings = useUserStore((state) => state.getHoldings);

  const userId = currentUser?.id;
  const firstName = currentUser?.firstName || 'User';
  const accounts = currentUser?.accounts || [];

  /**
   * Get holdings data for the current user.
   */
  const holdingsData = useMemo(() => {
    if (!userId) {
      return { holdings: [], summary: { totalMarketValue: 0, totalCostBasis: 0, totalGainLoss: 0, totalGainLossPercent: 0, holdingsCount: 0 } };
    }
    return getHoldings(userId);
  }, [userId, getHoldings]);

  const { holdings, summary } = holdingsData;

  /**
   * Compute sector allocation for DonutChart.
   */
  const sectorAllocation = useMemo(() => computeSectorAllocation(holdings), [holdings]);

  /**
   * Compute asset type allocation for DonutChart.
   */
  const assetTypeAllocation = useMemo(() => computeAssetTypeAllocation(holdings), [holdings]);

  /**
   * Compute per-account market values.
   */
  const accountValues = useMemo(() => {
    if (!holdings || holdings.length === 0) {
      return {};
    }

    const valueMap = {};

    holdings.forEach((holding) => {
      const acctId = holding.accountId;
      if (!valueMap[acctId]) {
        valueMap[acctId] = { marketValue: 0, costBasis: 0 };
      }
      valueMap[acctId].marketValue += holding.marketValue || 0;
      valueMap[acctId].costBasis += (holding.quantity || 0) * (holding.avgCost || 0);
    });

    Object.keys(valueMap).forEach((key) => {
      valueMap[key].marketValue = parseFloat(valueMap[key].marketValue.toFixed(2));
      valueMap[key].costBasis = parseFloat(valueMap[key].costBasis.toFixed(2));
      valueMap[key].gainLoss = parseFloat((valueMap[key].marketValue - valueMap[key].costBasis).toFixed(2));
      valueMap[key].gainLossPercent = valueMap[key].costBasis !== 0
        ? parseFloat((valueMap[key].gainLoss / valueMap[key].costBasis).toFixed(4))
        : 0;
    });

    return valueMap;
  }, [holdings]);

  /**
   * Handle quick action button click.
   * @param {string} actionLabel - The label of the action
   */
  const handleQuickAction = useCallback((actionLabel) => {
    showInfoToast(`${actionLabel} — Coming Soon`);
  }, []);

  const todayFormatted = useMemo(() => getFormattedToday(), []);

  const hasAccounts = accounts.length > 0;
  const hasHoldings = holdings.length > 0;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-xl bg-gradient-to-r from-primary-600 to-primary-800 px-6 py-6 text-white shadow-md">
        <h1 className="text-xl font-bold sm:text-2xl">
          Welcome back, {firstName}
        </h1>
        <p className="mt-1 text-sm text-primary-100">
          {todayFormatted}
        </p>
        {hasHoldings && (
          <div className="mt-4 flex flex-wrap items-end gap-4">
            <div>
              <p className="text-xs text-primary-200">Total Portfolio Value</p>
              <p className="text-2xl font-bold sm:text-3xl">
                {formatCurrency(summary.totalMarketValue)}
              </p>
            </div>
            <div className="mb-1">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  summary.totalGainLoss >= 0
                    ? 'bg-white/20 text-green-100'
                    : 'bg-white/20 text-red-200'
                }`}
              >
                {summary.totalGainLoss >= 0 ? '+' : ''}
                {formatCurrency(summary.totalGainLoss)} ({formatPercentage(summary.totalGainLossPercent, { showSign: true })})
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={() => handleQuickAction(action.label)}
            className={`flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-4 shadow-sm transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${action.color}`}
          >
            <action.icon className="h-6 w-6" aria-hidden="true" />
            <span className="text-sm font-medium">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Empty State for new users */}
      {!hasAccounts && (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <EmptyState
            icon={<BanknotesIcon className="h-12 w-12" />}
            title="No Accounts Yet"
            message="Your account information will appear here once your accounts are set up. Get started by exploring our products and services."
          />
        </div>
      )}

      {/* Account Summary Cards */}
      {hasAccounts && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Your Accounts</h2>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {accounts.map((account) => {
              const acctValue = accountValues[account.accountId] || {
                marketValue: 0,
                costBasis: 0,
                gainLoss: 0,
                gainLossPercent: 0,
              };

              return (
                <div
                  key={account.accountId}
                  className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {account.type}
                        </h3>
                        <Badge label={account.status || 'active'} size="xs" />
                      </div>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {formatAccountNumber(account.accountNumber)}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0 pl-4">
                      <p className="text-lg font-bold text-gray-900">
                        {formatCurrency(acctValue.marketValue)}
                      </p>
                      <p
                        className={`text-xs font-medium ${
                          acctValue.gainLoss >= 0 ? 'text-success-600' : 'text-danger-600'
                        }`}
                      >
                        {acctValue.gainLoss >= 0 ? '+' : ''}
                        {formatCurrency(acctValue.gainLoss)} ({formatPercentage(acctValue.gainLossPercent, { showSign: true })})
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3 border-t border-gray-100 pt-3">
                    <div>
                      <p className="text-xs text-gray-500">Opened</p>
                      <p className="text-sm font-medium text-gray-700">
                        {formatDate(account.openedDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Risk Profile</p>
                      <p className="text-sm font-medium text-gray-700">
                        {account.riskProfile || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Cost Basis</p>
                      <p className="text-sm font-medium text-gray-700">
                        {account.costBasisMethod || 'FIFO'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Asset Allocation Charts */}
      {hasHoldings && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Asset Allocation</h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Sector Allocation */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <DonutChart
                data={sectorAllocation}
                title="By Sector"
                size="md"
              />
            </div>

            {/* Asset Type Allocation */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <DonutChart
                data={assetTypeAllocation}
                title="By Asset Type"
                size="md"
              />
            </div>
          </div>
        </div>
      )}

      {/* Empty holdings state for users with accounts but no holdings */}
      {hasAccounts && !hasHoldings && (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <EmptyState
            icon={<ChartBarIcon className="h-12 w-12" />}
            title="No Holdings Yet"
            message="Start building your portfolio by making your first trade. Your holdings and asset allocation will appear here."
            actionLabel="Start Trading"
            onAction={() => handleQuickAction('Trade')}
          />
        </div>
      )}
    </div>
  );
}

export default AccountsPage;