/**
 * Holdings page rendered at /portfolio.
 * Displays a DataTable of all user holdings with columns: Symbol, Name,
 * Quantity, Avg Cost, Current Price, Market Value, and Unrealized Gain/Loss.
 * Table is sortable by all columns and searchable by symbol/name.
 * Shows portfolio total summary at the top. New users see EmptyState.
 * Reads data from userStore via sessionStore for the current user.
 * @module pages/HoldingsPage
 */

import React, { useMemo } from 'react';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import { useSessionStore } from '../store/sessionStore.js';
import { useUserStore } from '../store/userStore.js';
import DataTable from '../components/DataTable.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { showInfoToast } from '../components/Toast.jsx';
import { formatCurrency, formatPercentage } from '../utils/formatters.js';

/**
 * Render the unrealized gain/loss cell with color coding.
 * @param {object} gainLoss - The unrealizedGainLoss object
 * @param {number} gainLoss.dollar - Dollar amount of gain/loss
 * @param {number} gainLoss.percent - Percentage of gain/loss (as decimal)
 * @returns {React.ReactElement} Colored gain/loss display
 */
function renderGainLoss(gainLoss) {
  if (!gainLoss || typeof gainLoss !== 'object') {
    return <span className="text-gray-500">$0.00 (0.00%)</span>;
  }

  const { dollar, percent } = gainLoss;
  const isPositive = dollar >= 0;
  const colorClass = isPositive ? 'text-success-600' : 'text-danger-600';
  const sign = isPositive ? '+' : '';

  return (
    <span className={`font-medium ${colorClass}`}>
      {sign}{formatCurrency(dollar)} ({formatPercentage(percent, { showSign: true })})
    </span>
  );
}

/**
 * Column definitions for the holdings DataTable.
 * @type {Array<{key: string, label: string, sortable?: boolean, render?: function}>}
 */
const HOLDINGS_COLUMNS = [
  {
    key: 'symbol',
    label: 'Symbol',
    sortable: true,
    render: (value) => (
      <span className="font-semibold text-primary-700">{value}</span>
    ),
  },
  {
    key: 'name',
    label: 'Name',
    sortable: true,
  },
  {
    key: 'quantity',
    label: 'Quantity',
    sortable: true,
    render: (value) => (
      <span>{typeof value === 'number' ? value.toLocaleString('en-US') : value}</span>
    ),
  },
  {
    key: 'avgCost',
    label: 'Avg Cost',
    sortable: true,
    render: (value) => formatCurrency(value),
  },
  {
    key: 'currentPrice',
    label: 'Current Price',
    sortable: true,
    render: (value) => formatCurrency(value),
  },
  {
    key: 'marketValue',
    label: 'Market Value',
    sortable: true,
    render: (value) => (
      <span className="font-medium">{formatCurrency(value)}</span>
    ),
  },
  {
    key: 'unrealizedGainLoss',
    label: 'Unrealized Gain/Loss',
    sortable: true,
    render: (value) => renderGainLoss(value),
  },
];

/**
 * HoldingsPage component for displaying the user's investment holdings.
 * Shows a searchable, sortable DataTable of all holdings with portfolio
 * summary statistics. Displays EmptyState for users with no holdings.
 * @returns {React.ReactElement} The HoldingsPage component
 */
function HoldingsPage() {
  const currentUser = useSessionStore((state) => state.currentUser);
  const getHoldings = useUserStore((state) => state.getHoldings);

  const userId = currentUser?.id;

  /**
   * Get holdings data for the current user.
   */
  const holdingsData = useMemo(() => {
    if (!userId) {
      return {
        holdings: [],
        summary: {
          totalMarketValue: 0,
          totalCostBasis: 0,
          totalGainLoss: 0,
          totalGainLossPercent: 0,
          holdingsCount: 0,
        },
      };
    }
    return getHoldings(userId);
  }, [userId, getHoldings]);

  const { holdings, summary } = holdingsData;
  const hasHoldings = holdings.length > 0;

  /**
   * Handle empty state action.
   */
  const handleStartTrading = () => {
    showInfoToast('Trade — Coming Soon');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Holdings</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage your investment portfolio
        </p>
      </div>

      {/* Empty State */}
      {!hasHoldings && (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <EmptyState
            icon={<ChartBarIcon className="h-12 w-12" />}
            title="No Holdings Yet"
            message="Start building your portfolio by making your first trade. Your holdings will appear here once you own securities."
            actionLabel="Start Trading"
            onAction={handleStartTrading}
          />
        </div>
      )}

      {/* Portfolio Summary */}
      {hasHoldings && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Market Value */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Total Market Value
            </p>
            <p className="mt-1 text-xl font-bold text-gray-900">
              {formatCurrency(summary.totalMarketValue)}
            </p>
          </div>

          {/* Total Cost Basis */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Total Cost Basis
            </p>
            <p className="mt-1 text-xl font-bold text-gray-900">
              {formatCurrency(summary.totalCostBasis)}
            </p>
          </div>

          {/* Total Gain/Loss */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Total Unrealized Gain/Loss
            </p>
            <p
              className={`mt-1 text-xl font-bold ${
                summary.totalGainLoss >= 0 ? 'text-success-600' : 'text-danger-600'
              }`}
            >
              {summary.totalGainLoss >= 0 ? '+' : ''}
              {formatCurrency(summary.totalGainLoss)}
            </p>
          </div>

          {/* Total Gain/Loss Percent */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Total Return
            </p>
            <p
              className={`mt-1 text-xl font-bold ${
                summary.totalGainLossPercent >= 0 ? 'text-success-600' : 'text-danger-600'
              }`}
            >
              {formatPercentage(summary.totalGainLossPercent, { showSign: true })}
            </p>
          </div>
        </div>
      )}

      {/* Holdings Table */}
      {hasHoldings && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <DataTable
            columns={HOLDINGS_COLUMNS}
            data={holdings}
            searchable
            searchPlaceholder="Search by symbol or name..."
            emptyMessage="No holdings match your search"
          />

          {/* Portfolio Total Footer */}
          <div className="mt-4 border-t border-gray-200 pt-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="text-sm text-gray-500">
                <span className="font-medium text-gray-700">{summary.holdingsCount}</span>{' '}
                {summary.holdingsCount === 1 ? 'holding' : 'holdings'}
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-xs text-gray-500">Total Value</p>
                  <p className="text-sm font-bold text-gray-900">
                    {formatCurrency(summary.totalMarketValue)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Total Gain/Loss</p>
                  <p
                    className={`text-sm font-bold ${
                      summary.totalGainLoss >= 0 ? 'text-success-600' : 'text-danger-600'
                    }`}
                  >
                    {summary.totalGainLoss >= 0 ? '+' : ''}
                    {formatCurrency(summary.totalGainLoss)} ({formatPercentage(summary.totalGainLossPercent, { showSign: true })})
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HoldingsPage;