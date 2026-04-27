/**
 * Activity page rendered at /transactions.
 * Displays filter controls (date range picker with from/to inputs,
 * transaction type dropdown, symbol search input) and a DataTable of
 * transactions with columns: Date, Type (with badge), Symbol, Description,
 * Quantity, Price, Amount, Status (with badge).
 * Filters are applied client-side. Table is sortable by date and amount.
 * New users see EmptyState. Reads from userStore.
 * @module pages/ActivityPage
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  ClockIcon,
  FunnelIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useSessionStore } from '../store/sessionStore.js';
import { useUserStore } from '../store/userStore.js';
import DataTable from '../components/DataTable.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Badge from '../components/Badge.jsx';
import { formatCurrency, formatDateTime } from '../utils/formatters.js';
import { TRANSACTION_TYPES } from '../utils/constants.js';

/**
 * Map transaction type to badge variant.
 * @type {Record<string, string>}
 */
const TYPE_VARIANT_MAP = {
  Buy: 'info',
  Sell: 'success',
  Dividend: 'success',
  Deposit: 'success',
  Withdrawal: 'pending',
  'Transfer In': 'info',
  'Transfer Out': 'pending',
  Fee: 'failed',
  Interest: 'success',
  Split: 'neutral',
};

/**
 * Map transaction status to badge variant.
 * @type {Record<string, string>}
 */
const STATUS_VARIANT_MAP = {
  completed: 'success',
  pending: 'pending',
  failed: 'failed',
};

/**
 * Transaction type options for the filter dropdown.
 * @type {Array<{value: string, label: string}>}
 */
const TYPE_FILTER_OPTIONS = [
  { value: '', label: 'All Types' },
  { value: TRANSACTION_TYPES.BUY, label: 'Buy' },
  { value: TRANSACTION_TYPES.SELL, label: 'Sell' },
  { value: TRANSACTION_TYPES.DIVIDEND, label: 'Dividend' },
  { value: TRANSACTION_TYPES.DEPOSIT, label: 'Deposit' },
  { value: TRANSACTION_TYPES.WITHDRAWAL, label: 'Withdrawal' },
  { value: TRANSACTION_TYPES.TRANSFER_IN, label: 'Transfer In' },
  { value: TRANSACTION_TYPES.TRANSFER_OUT, label: 'Transfer Out' },
  { value: TRANSACTION_TYPES.FEE, label: 'Fee' },
  { value: TRANSACTION_TYPES.INTEREST, label: 'Interest' },
];

/**
 * Column definitions for the activity DataTable.
 * @type {Array<{key: string, label: string, sortable?: boolean, render?: function}>}
 */
const ACTIVITY_COLUMNS = [
  {
    key: 'date',
    label: 'Date',
    sortable: true,
    render: (value) => (
      <span className="text-gray-700">{formatDateTime(value)}</span>
    ),
  },
  {
    key: 'type',
    label: 'Type',
    sortable: true,
    render: (value) => (
      <Badge
        label={value || 'Unknown'}
        variant={TYPE_VARIANT_MAP[value] || 'neutral'}
        size="sm"
      />
    ),
  },
  {
    key: 'symbol',
    label: 'Symbol',
    sortable: true,
    render: (value) =>
      value ? (
        <span className="font-semibold text-primary-700">{value}</span>
      ) : (
        <span className="text-gray-400">—</span>
      ),
  },
  {
    key: 'description',
    label: 'Description',
    sortable: false,
  },
  {
    key: 'quantity',
    label: 'Quantity',
    sortable: true,
    render: (value) =>
      value && value !== 0 ? (
        <span>{typeof value === 'number' ? value.toLocaleString('en-US') : value}</span>
      ) : (
        <span className="text-gray-400">—</span>
      ),
  },
  {
    key: 'price',
    label: 'Price',
    sortable: true,
    render: (value) =>
      value && value !== 0 ? (
        <span>{formatCurrency(value)}</span>
      ) : (
        <span className="text-gray-400">—</span>
      ),
  },
  {
    key: 'amount',
    label: 'Amount',
    sortable: true,
    render: (value) => {
      if (value === null || value === undefined) {
        return <span className="text-gray-400">—</span>;
      }
      const isPositive = value >= 0;
      const colorClass = isPositive ? 'text-success-600' : 'text-danger-600';
      return (
        <span className={`font-medium ${colorClass}`}>
          {isPositive ? '+' : ''}
          {formatCurrency(value)}
        </span>
      );
    },
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    render: (value) => (
      <Badge
        label={value ? value.charAt(0).toUpperCase() + value.slice(1) : 'Unknown'}
        variant={STATUS_VARIANT_MAP[value] || 'neutral'}
        size="sm"
      />
    ),
  },
];

/**
 * ActivityPage component for displaying transaction activity history.
 * Shows filter controls and a sortable DataTable of all transactions.
 * Displays EmptyState for users with no transactions.
 * @returns {React.ReactElement} The ActivityPage component
 */
function ActivityPage() {
  const currentUser = useSessionStore((state) => state.currentUser);
  const getActivity = useUserStore((state) => state.getActivity);

  const userId = currentUser?.id;

  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [symbolFilter, setSymbolFilter] = useState('');

  /**
   * Get activity data for the current user.
   */
  const activityData = useMemo(() => {
    if (!userId) {
      return {
        transactions: [],
        summary: {
          totalTransactions: 0,
          totalBuys: 0,
          totalSells: 0,
          totalDividends: 0,
          totalDeposits: 0,
          totalWithdrawals: 0,
          totalFees: 0,
          pendingCount: 0,
          failedCount: 0,
        },
      };
    }
    return getActivity(userId);
  }, [userId, getActivity]);

  const { transactions, summary } = activityData;
  const hasTransactions = transactions.length > 0;

  /**
   * Determine if any filter is active.
   */
  const hasActiveFilters = dateFrom || dateTo || typeFilter || symbolFilter;

  /**
   * Apply client-side filters to transactions.
   */
  const filteredTransactions = useMemo(() => {
    if (!hasTransactions) {
      return [];
    }

    let filtered = [...transactions];

    // Date from filter
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      if (!isNaN(fromDate.getTime())) {
        filtered = filtered.filter((txn) => {
          const txnDate = new Date(txn.date);
          return txnDate >= fromDate;
        });
      }
    }

    // Date to filter
    if (dateTo) {
      const toDate = new Date(dateTo);
      if (!isNaN(toDate.getTime())) {
        // Set to end of day
        toDate.setHours(23, 59, 59, 999);
        filtered = filtered.filter((txn) => {
          const txnDate = new Date(txn.date);
          return txnDate <= toDate;
        });
      }
    }

    // Type filter
    if (typeFilter) {
      filtered = filtered.filter((txn) => txn.type === typeFilter);
    }

    // Symbol filter
    if (symbolFilter) {
      const query = symbolFilter.trim().toLowerCase();
      filtered = filtered.filter((txn) => {
        if (!txn.symbol) {
          return false;
        }
        return txn.symbol.toLowerCase().includes(query);
      });
    }

    // Sort by date descending by default
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    return filtered;
  }, [transactions, hasTransactions, dateFrom, dateTo, typeFilter, symbolFilter]);

  /**
   * Handle clearing all filters.
   */
  const handleClearFilters = useCallback(() => {
    setDateFrom('');
    setDateTo('');
    setTypeFilter('');
    setSymbolFilter('');
  }, []);

  /**
   * Handle date from change.
   * @param {React.ChangeEvent<HTMLInputElement>} event
   */
  const handleDateFromChange = useCallback((event) => {
    setDateFrom(event.target.value);
  }, []);

  /**
   * Handle date to change.
   * @param {React.ChangeEvent<HTMLInputElement>} event
   */
  const handleDateToChange = useCallback((event) => {
    setDateTo(event.target.value);
  }, []);

  /**
   * Handle type filter change.
   * @param {React.ChangeEvent<HTMLSelectElement>} event
   */
  const handleTypeFilterChange = useCallback((event) => {
    setTypeFilter(event.target.value);
  }, []);

  /**
   * Handle symbol filter change.
   * @param {React.ChangeEvent<HTMLInputElement>} event
   */
  const handleSymbolFilterChange = useCallback((event) => {
    setSymbolFilter(event.target.value);
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Activity</h1>
        <p className="mt-1 text-sm text-gray-500">
          View your transaction history and account activity
        </p>
      </div>

      {/* Empty State */}
      {!hasTransactions && (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <EmptyState
            icon={<ClockIcon className="h-12 w-12" />}
            title="No Activity Yet"
            message="Your transaction history will appear here once you start trading. Buy, sell, or transfer securities to see your activity."
          />
        </div>
      )}

      {/* Activity Summary */}
      {hasTransactions && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Total Transactions
            </p>
            <p className="mt-1 text-lg font-bold text-gray-900">
              {summary.totalTransactions}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Total Buys
            </p>
            <p className="mt-1 text-lg font-bold text-gray-900">
              {formatCurrency(summary.totalBuys)}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Total Sells
            </p>
            <p className="mt-1 text-lg font-bold text-gray-900">
              {formatCurrency(summary.totalSells)}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Dividends
            </p>
            <p className="mt-1 text-lg font-bold text-success-600">
              {formatCurrency(summary.totalDividends)}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Pending
            </p>
            <p className="mt-1 text-lg font-bold text-warning-600">
              {summary.pendingCount}
            </p>
          </div>
        </div>
      )}

      {/* Filters and Table */}
      {hasTransactions && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          {/* Filter Controls */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <FunnelIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              <h2 className="text-sm font-semibold text-gray-700">Filters</h2>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="ml-auto inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  <XMarkIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  Clear Filters
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Date From */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="filter-date-from"
                  className="block text-xs font-medium text-gray-500"
                >
                  From Date
                </label>
                <input
                  id="filter-date-from"
                  type="date"
                  value={dateFrom}
                  onChange={handleDateFromChange}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0"
                  aria-label="Filter from date"
                />
              </div>

              {/* Date To */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="filter-date-to"
                  className="block text-xs font-medium text-gray-500"
                >
                  To Date
                </label>
                <input
                  id="filter-date-to"
                  type="date"
                  value={dateTo}
                  onChange={handleDateToChange}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0"
                  aria-label="Filter to date"
                />
              </div>

              {/* Transaction Type */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="filter-type"
                  className="block text-xs font-medium text-gray-500"
                >
                  Transaction Type
                </label>
                <select
                  id="filter-type"
                  value={typeFilter}
                  onChange={handleTypeFilterChange}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0"
                  aria-label="Filter by transaction type"
                >
                  {TYPE_FILTER_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Symbol Search */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="filter-symbol"
                  className="block text-xs font-medium text-gray-500"
                >
                  Symbol
                </label>
                <input
                  id="filter-symbol"
                  type="text"
                  value={symbolFilter}
                  onChange={handleSymbolFilterChange}
                  placeholder="Search by symbol..."
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0"
                  aria-label="Filter by symbol"
                />
              </div>
            </div>
          </div>

          {/* DataTable */}
          <DataTable
            columns={ACTIVITY_COLUMNS}
            data={filteredTransactions}
            searchable={false}
            emptyMessage="No transactions match your filters"
          />

          {/* Results Footer */}
          <div className="mt-4 border-t border-gray-200 pt-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="text-sm text-gray-500">
                Showing{' '}
                <span className="font-medium text-gray-700">
                  {filteredTransactions.length}
                </span>{' '}
                of{' '}
                <span className="font-medium text-gray-700">
                  {transactions.length}
                </span>{' '}
                {transactions.length === 1 ? 'transaction' : 'transactions'}
              </div>
              {hasActiveFilters && (
                <div className="text-xs text-gray-400">
                  Filters applied
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActivityPage;