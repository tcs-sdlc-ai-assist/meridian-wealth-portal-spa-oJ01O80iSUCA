/**
 * Cost Basis page rendered at /tax-center.
 * Displays current cost basis method in a selector (FIFO, LIFO, Specific ID,
 * Average Cost, Highest Cost, Lowest Cost) with description of each method.
 * Below, shows tax lot details per security in expandable sections showing
 * lot ID, purchase date, quantity, cost per share, total cost, current value,
 * and gain/loss. Changing method opens a confirmation Modal explaining the impact.
 * On confirm, persists new method via userStore.updateCostBasis.
 * Styled with Tailwind.
 * @module pages/CostBasisPage
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  CalculatorIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { useSessionStore } from '../store/sessionStore.js';
import { useUserStore } from '../store/userStore.js';
import Modal from '../components/Modal.jsx';
import Badge from '../components/Badge.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { showSuccessToast, showErrorToast } from '../components/Toast.jsx';
import { formatCurrency, formatDate, formatPercentage } from '../utils/formatters.js';
import { COST_BASIS_METHODS } from '../utils/constants.js';

/**
 * Descriptions for each cost basis method.
 * @type {Record<string, string>}
 */
const METHOD_DESCRIPTIONS = {
  FIFO: 'First In, First Out — Sells the oldest shares first. This is the default method used by most brokerages and is generally the simplest for tax reporting.',
  LIFO: 'Last In, First Out — Sells the most recently purchased shares first. This may result in higher short-term capital gains but can be useful in certain tax strategies.',
  'Specific Identification': 'Specific Identification — You choose exactly which shares to sell. This provides the most control over your tax liability but requires careful record-keeping.',
  'Average Cost': 'Average Cost — Uses the average cost of all shares as the cost basis. This method is commonly used for mutual funds and simplifies calculations.',
  'Highest Cost': 'Highest Cost — Sells the shares with the highest cost basis first. This typically minimizes capital gains and can reduce your tax liability.',
  'Lowest Cost': 'Lowest Cost — Sells the shares with the lowest cost basis first. This typically maximizes capital gains and may be useful for tax-loss harvesting strategies.',
};

/**
 * Short labels for cost basis methods.
 * @type {Record<string, string>}
 */
const METHOD_SHORT_DESCRIPTIONS = {
  FIFO: 'Sells oldest shares first',
  LIFO: 'Sells newest shares first',
  'Specific Identification': 'Choose specific shares to sell',
  'Average Cost': 'Uses average cost of all shares',
  'Highest Cost': 'Sells highest cost shares first',
  'Lowest Cost': 'Sells lowest cost shares first',
};

/**
 * Group tax lots by symbol.
 * @param {Array} taxLots - Array of tax lot objects
 * @returns {Record<string, Array>} Tax lots grouped by symbol
 */
function groupTaxLotsBySymbol(taxLots) {
  if (!taxLots || !Array.isArray(taxLots) || taxLots.length === 0) {
    return {};
  }

  const grouped = {};

  taxLots.forEach((lot) => {
    const symbol = lot.symbol || 'Unknown';
    if (!grouped[symbol]) {
      grouped[symbol] = [];
    }
    grouped[symbol].push(lot);
  });

  // Sort lots within each symbol by purchase date ascending
  Object.keys(grouped).forEach((symbol) => {
    grouped[symbol].sort((a, b) => new Date(a.purchaseDate) - new Date(b.purchaseDate));
  });

  return grouped;
}

/**
 * Compute summary for a group of tax lots for a single symbol.
 * @param {Array} lots - Array of tax lot objects for a single symbol
 * @returns {{ totalQuantity: number, totalCost: number, totalCurrentValue: number, totalGainLoss: number, totalGainLossPercent: number }}
 */
function computeSymbolSummary(lots) {
  if (!lots || lots.length === 0) {
    return {
      totalQuantity: 0,
      totalCost: 0,
      totalCurrentValue: 0,
      totalGainLoss: 0,
      totalGainLossPercent: 0,
    };
  }

  let totalQuantity = 0;
  let totalCost = 0;
  let totalCurrentValue = 0;

  lots.forEach((lot) => {
    totalQuantity += lot.quantity || 0;
    totalCost += lot.totalCost || 0;
    totalCurrentValue += lot.currentValue || 0;
  });

  totalCost = parseFloat(totalCost.toFixed(2));
  totalCurrentValue = parseFloat(totalCurrentValue.toFixed(2));
  const totalGainLoss = parseFloat((totalCurrentValue - totalCost).toFixed(2));
  const totalGainLossPercent = totalCost !== 0
    ? parseFloat((totalGainLoss / totalCost).toFixed(4))
    : 0;

  return {
    totalQuantity,
    totalCost,
    totalCurrentValue,
    totalGainLoss,
    totalGainLossPercent,
  };
}

/**
 * CostBasisPage component for managing cost basis method and viewing tax lots.
 * Displays the current cost basis method selector, method descriptions,
 * and expandable tax lot details grouped by security symbol.
 * @returns {React.ReactElement} The CostBasisPage component
 */
function CostBasisPage() {
  const currentUser = useSessionStore((state) => state.currentUser);
  const getCostBasis = useUserStore((state) => state.getCostBasis);
  const updateCostBasis = useUserStore((state) => state.updateCostBasis);

  const userId = currentUser?.id;

  // Refresh trigger
  const [refreshKey, setRefreshKey] = useState(0);

  // Modal state
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingMethod, setPendingMethod] = useState(null);

  // Expanded sections state
  const [expandedSymbols, setExpandedSymbols] = useState({});

  /**
   * Get cost basis data for the current user.
   */
  const costBasisData = useMemo(() => {
    if (!userId) {
      return {
        costBasis: null,
        taxLots: [],
        summary: {
          totalLots: 0,
          totalCostBasis: 0,
          totalCurrentValue: 0,
          totalGainLoss: 0,
          totalGainLossPercent: 0,
          shortTermLots: 0,
          longTermLots: 0,
          shortTermGainLoss: 0,
          longTermGainLoss: 0,
          currentMethod: 'FIFO',
        },
      };
    }
    return getCostBasis(userId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, getCostBasis, refreshKey]);

  const { taxLots, summary } = costBasisData;
  const currentMethod = summary.currentMethod || 'FIFO';
  const hasTaxLots = taxLots.length > 0;

  /**
   * Group tax lots by symbol.
   */
  const groupedLots = useMemo(() => groupTaxLotsBySymbol(taxLots), [taxLots]);

  /**
   * Get sorted symbol keys.
   */
  const symbolKeys = useMemo(() => {
    return Object.keys(groupedLots).sort();
  }, [groupedLots]);

  /**
   * Handle method selection change.
   * @param {React.ChangeEvent<HTMLSelectElement>} event
   */
  const handleMethodChange = useCallback(
    (event) => {
      const newMethod = event.target.value;
      if (newMethod === currentMethod) {
        return;
      }
      setPendingMethod(newMethod);
      setIsConfirmModalOpen(true);
    },
    [currentMethod],
  );

  /**
   * Handle closing the confirmation modal.
   */
  const handleCloseConfirmModal = useCallback(() => {
    setIsConfirmModalOpen(false);
    setPendingMethod(null);
  }, []);

  /**
   * Handle confirming the method change.
   */
  const handleConfirmMethodChange = useCallback(() => {
    if (!userId || !pendingMethod) {
      showErrorToast('Unable to update cost basis method. Please try again.');
      setIsConfirmModalOpen(false);
      setPendingMethod(null);
      return;
    }

    const success = updateCostBasis(userId, pendingMethod);

    if (success) {
      showSuccessToast(`Cost basis method updated to ${pendingMethod}`);
      setRefreshKey((prev) => prev + 1);
    } else {
      showErrorToast('Failed to update cost basis method. Please try again.');
    }

    setIsConfirmModalOpen(false);
    setPendingMethod(null);
  }, [userId, pendingMethod, updateCostBasis]);

  /**
   * Toggle a symbol section expanded/collapsed.
   * @param {string} symbol - The symbol to toggle
   */
  const handleToggleSymbol = useCallback((symbol) => {
    setExpandedSymbols((prev) => ({
      ...prev,
      [symbol]: !prev[symbol],
    }));
  }, []);

  /**
   * Expand all symbol sections.
   */
  const handleExpandAll = useCallback(() => {
    const allExpanded = {};
    symbolKeys.forEach((symbol) => {
      allExpanded[symbol] = true;
    });
    setExpandedSymbols(allExpanded);
  }, [symbolKeys]);

  /**
   * Collapse all symbol sections.
   */
  const handleCollapseAll = useCallback(() => {
    setExpandedSymbols({});
  }, []);

  /**
   * Check if all sections are expanded.
   */
  const allExpanded = useMemo(() => {
    if (symbolKeys.length === 0) {
      return false;
    }
    return symbolKeys.every((symbol) => expandedSymbols[symbol]);
  }, [symbolKeys, expandedSymbols]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Cost Basis</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your cost basis method and view tax lot details for your holdings
        </p>
      </div>

      {/* Empty State */}
      {!hasTaxLots && (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <EmptyState
            icon={<CalculatorIcon className="h-12 w-12" />}
            title="No Tax Lots Available"
            message="Tax lot information will appear here once you have holdings in your accounts. Start trading to see your cost basis details."
          />
        </div>
      )}

      {/* Cost Basis Summary */}
      {hasTaxLots && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Total Lots
            </p>
            <p className="mt-1 text-lg font-bold text-gray-900">
              {summary.totalLots}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Total Cost Basis
            </p>
            <p className="mt-1 text-lg font-bold text-gray-900">
              {formatCurrency(summary.totalCostBasis)}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Current Value
            </p>
            <p className="mt-1 text-lg font-bold text-gray-900">
              {formatCurrency(summary.totalCurrentValue)}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Total Gain/Loss
            </p>
            <p
              className={`mt-1 text-lg font-bold ${
                summary.totalGainLoss >= 0 ? 'text-success-600' : 'text-danger-600'
              }`}
            >
              {summary.totalGainLoss >= 0 ? '+' : ''}
              {formatCurrency(summary.totalGainLoss)}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Current Method
            </p>
            <p className="mt-1 text-lg font-bold text-primary-700">
              {currentMethod}
            </p>
          </div>
        </div>
      )}

      {/* Holding Period Summary */}
      {hasTaxLots && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  Short-Term Lots
                </p>
                <p className="mt-1 text-lg font-bold text-gray-900">
                  {summary.shortTermLots}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Gain/Loss</p>
                <p
                  className={`text-sm font-bold ${
                    summary.shortTermGainLoss >= 0 ? 'text-success-600' : 'text-danger-600'
                  }`}
                >
                  {summary.shortTermGainLoss >= 0 ? '+' : ''}
                  {formatCurrency(summary.shortTermGainLoss)}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  Long-Term Lots
                </p>
                <p className="mt-1 text-lg font-bold text-gray-900">
                  {summary.longTermLots}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Gain/Loss</p>
                <p
                  className={`text-sm font-bold ${
                    summary.longTermGainLoss >= 0 ? 'text-success-600' : 'text-danger-600'
                  }`}
                >
                  {summary.longTermGainLoss >= 0 ? '+' : ''}
                  {formatCurrency(summary.longTermGainLoss)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cost Basis Method Selector */}
      {hasTaxLots && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100">
              <CalculatorIcon className="h-5 w-5 text-primary-600" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base font-semibold text-gray-900">
                Cost Basis Method
              </h2>
              <p className="mt-0.5 text-xs text-gray-500">
                Select the method used to calculate your cost basis when selling securities
              </p>

              {/* Method Selector */}
              <div className="mt-4 max-w-sm">
                <label
                  htmlFor="cost-basis-method"
                  className="block text-sm font-medium text-gray-700"
                >
                  Current Method
                </label>
                <select
                  id="cost-basis-method"
                  value={currentMethod}
                  onChange={handleMethodChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0"
                  aria-label="Select cost basis method"
                >
                  {COST_BASIS_METHODS.map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
              </div>

              {/* Current Method Description */}
              <div className="mt-4 rounded-lg border border-primary-100 bg-primary-50 p-4">
                <div className="flex items-start gap-2">
                  <InformationCircleIcon
                    className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-600"
                    aria-hidden="true"
                  />
                  <p className="text-sm text-primary-800">
                    {METHOD_DESCRIPTIONS[currentMethod] || 'No description available for this method.'}
                  </p>
                </div>
              </div>

              {/* All Methods Overview */}
              <div className="mt-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Available Methods
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {COST_BASIS_METHODS.map((method) => {
                    const isActive = method === currentMethod;
                    return (
                      <div
                        key={method}
                        className={`rounded-lg border p-3 transition-colors ${
                          isActive
                            ? 'border-primary-300 bg-primary-50'
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-medium ${
                              isActive ? 'text-primary-700' : 'text-gray-900'
                            }`}
                          >
                            {method}
                          </span>
                          {isActive && (
                            <Badge label="Active" variant="info" size="xs" />
                          )}
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          {METHOD_SHORT_DESCRIPTIONS[method] || ''}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tax Lot Details */}
      {hasTaxLots && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Tax Lot Details</h2>
            <button
              type="button"
              onClick={allExpanded ? handleCollapseAll : handleExpandAll}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              {allExpanded ? 'Collapse All' : 'Expand All'}
            </button>
          </div>

          {symbolKeys.map((symbol) => {
            const lots = groupedLots[symbol];
            const symbolSummary = computeSymbolSummary(lots);
            const isExpanded = expandedSymbols[symbol] || false;
            const isGain = symbolSummary.totalGainLoss >= 0;

            return (
              <div
                key={symbol}
                className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"
              >
                {/* Symbol Header */}
                <button
                  type="button"
                  onClick={() => handleToggleSymbol(symbol)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex">
                      {isExpanded ? (
                        <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      ) : (
                        <ChevronRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      )}
                    </span>
                    <span className="text-sm font-bold text-primary-700">{symbol}</span>
                    <Badge
                      label={`${lots.length} ${lots.length === 1 ? 'lot' : 'lots'}`}
                      variant="neutral"
                      size="xs"
                    />
                    <span className="text-xs text-gray-500">
                      {symbolSummary.totalQuantity.toLocaleString('en-US')} shares
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Current Value</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatCurrency(symbolSummary.totalCurrentValue)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Gain/Loss</p>
                      <p
                        className={`text-sm font-medium ${
                          isGain ? 'text-success-600' : 'text-danger-600'
                        }`}
                      >
                        {isGain ? '+' : ''}
                        {formatCurrency(symbolSummary.totalGainLoss)} ({formatPercentage(symbolSummary.totalGainLossPercent, { showSign: true })})
                      </p>
                    </div>
                  </div>
                </button>

                {/* Tax Lots Table */}
                {isExpanded && (
                  <div className="border-t border-gray-200">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                            >
                              Lot ID
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                            >
                              Purchase Date
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                            >
                              Holding Period
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500"
                            >
                              Quantity
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500"
                            >
                              Cost/Share
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500"
                            >
                              Total Cost
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500"
                            >
                              Current Value
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500"
                            >
                              Gain/Loss
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {lots.map((lot) => {
                            const lotGain = lot.gainLoss?.dollar || 0;
                            const lotPercent = lot.gainLoss?.percent || 0;
                            const lotIsGain = lotGain >= 0;

                            return (
                              <tr key={lot.lotId} className="hover:bg-gray-50 transition-colors">
                                <td className="whitespace-nowrap px-4 py-3 text-xs font-mono text-gray-600">
                                  {lot.lotId}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                                  {formatDate(lot.purchaseDate)}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-sm">
                                  <Badge
                                    label={lot.holdingPeriod || 'Unknown'}
                                    variant={lot.holdingPeriod === 'Long-Term' ? 'success' : 'pending'}
                                    size="xs"
                                  />
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700 text-right">
                                  {typeof lot.quantity === 'number' ? lot.quantity.toLocaleString('en-US') : lot.quantity}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700 text-right">
                                  {formatCurrency(lot.costPerShare)}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700 text-right">
                                  {formatCurrency(lot.totalCost)}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 text-right">
                                  {formatCurrency(lot.currentValue)}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-sm text-right">
                                  <span
                                    className={`font-medium ${
                                      lotIsGain ? 'text-success-600' : 'text-danger-600'
                                    }`}
                                  >
                                    {lotIsGain ? '+' : ''}
                                    {formatCurrency(lotGain)}
                                  </span>
                                  <span className="ml-1 text-xs text-gray-500">
                                    ({formatPercentage(lotPercent, { showSign: true })})
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                        {/* Symbol Total Footer */}
                        <tfoot className="bg-gray-50">
                          <tr>
                            <td
                              colSpan={3}
                              className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase text-gray-500"
                            >
                              Total
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-gray-900 text-right">
                              {symbolSummary.totalQuantity.toLocaleString('en-US')}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 text-right">
                              —
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-gray-900 text-right">
                              {formatCurrency(symbolSummary.totalCost)}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-gray-900 text-right">
                              {formatCurrency(symbolSummary.totalCurrentValue)}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-sm text-right">
                              <span
                                className={`font-semibold ${
                                  isGain ? 'text-success-600' : 'text-danger-600'
                                }`}
                              >
                                {isGain ? '+' : ''}
                                {formatCurrency(symbolSummary.totalGainLoss)}
                              </span>
                              <span className="ml-1 text-xs text-gray-500">
                                ({formatPercentage(symbolSummary.totalGainLossPercent, { showSign: true })})
                              </span>
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={handleCloseConfirmModal}
        title="Change Cost Basis Method"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            You are about to change your cost basis method from{' '}
            <span className="font-semibold text-gray-900">{currentMethod}</span> to{' '}
            <span className="font-semibold text-gray-900">{pendingMethod}</span>.
          </p>

          {pendingMethod && (
            <div className="rounded-lg border border-primary-100 bg-primary-50 p-4">
              <div className="flex items-start gap-2">
                <InformationCircleIcon
                  className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-600"
                  aria-hidden="true"
                />
                <p className="text-sm text-primary-800">
                  {METHOD_DESCRIPTIONS[pendingMethod] || 'No description available.'}
                </p>
              </div>
            </div>
          )}

          <div className="rounded-lg border border-warning-200 bg-warning-50 p-4">
            <p className="text-sm text-warning-800">
              <span className="font-semibold">Important:</span> Changing your cost basis method
              will affect how gains and losses are calculated for future sales. This change
              applies to all accounts. Previously completed transactions will not be affected.
              Please consult a tax advisor if you are unsure which method is best for your situation.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4">
            <button
              type="button"
              onClick={handleCloseConfirmModal}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmMethodChange}
              className="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Confirm Change
            </button>
          </div>
        </div>
      </Modal>

      {/* Footer Note */}
      {hasTaxLots && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-xs text-gray-500">
            <span className="font-medium text-gray-700">Disclaimer:</span>{' '}
            Cost basis information is provided for informational purposes only and should not
            be considered tax advice. Tax lot data may not reflect all adjustments such as
            wash sales, corporate actions, or return of capital distributions. Please consult
            your tax advisor and refer to your official tax documents (Form 1099-B) for
            accurate tax reporting.
          </p>
        </div>
      )}
    </div>
  );
}

export default CostBasisPage;