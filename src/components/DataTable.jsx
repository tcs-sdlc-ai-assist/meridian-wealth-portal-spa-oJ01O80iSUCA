/**
 * Reusable sortable, searchable data table component.
 * Accepts columns configuration, data array, and optional search/sort/click features.
 * Implements column header click sorting (asc/desc/none), search input filtering
 * across all string fields, and responsive horizontal scroll on mobile.
 * Styled with Tailwind.
 * @module components/DataTable
 */

import React, { useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { MagnifyingGlassIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import EmptyState from './EmptyState.jsx';

/**
 * Sort direction cycle: none -> asc -> desc -> none
 * @param {string | null} current - Current sort direction
 * @returns {string | null} Next sort direction
 */
function getNextSortDirection(current) {
  if (current === null) {
    return 'asc';
  }
  if (current === 'asc') {
    return 'desc';
  }
  return null;
}

/**
 * Compare two values for sorting.
 * @param {*} a - First value
 * @param {*} b - Second value
 * @param {string} direction - Sort direction ('asc' or 'desc')
 * @returns {number} Comparison result
 */
function compareValues(a, b, direction) {
  if (a === null || a === undefined) {
    return direction === 'asc' ? 1 : -1;
  }
  if (b === null || b === undefined) {
    return direction === 'asc' ? -1 : 1;
  }

  let result = 0;

  if (typeof a === 'number' && typeof b === 'number') {
    result = a - b;
  } else if (typeof a === 'string' && typeof b === 'string') {
    result = a.localeCompare(b, undefined, { sensitivity: 'base' });
  } else {
    result = String(a).localeCompare(String(b), undefined, { sensitivity: 'base' });
  }

  return direction === 'desc' ? -result : result;
}

/**
 * DataTable component for rendering sortable, searchable data tables.
 * @param {object} props - Component props
 * @param {Array<{key: string, label: string, sortable?: boolean, render?: function}>} props.columns - Column definitions
 * @param {Array<object>} props.data - Array of row data objects
 * @param {boolean} [props.searchable=false] - Whether to show the search input
 * @param {string} [props.searchPlaceholder='Search...'] - Placeholder text for the search input
 * @param {string} [props.emptyMessage='No data available'] - Message to display when no data matches
 * @param {function} [props.onRowClick] - Callback invoked with the row data when a row is clicked
 * @param {string} [props.className] - Additional CSS classes to apply to the wrapper
 * @returns {React.ReactElement} The DataTable component
 */
function DataTable({
  columns,
  data,
  searchable,
  searchPlaceholder,
  emptyMessage,
  onRowClick,
  className,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);

  /**
   * Handle column header click for sorting.
   * @param {string} key - The column key to sort by
   */
  const handleSort = useCallback(
    (key) => {
      if (sortKey === key) {
        const nextDirection = getNextSortDirection(sortDirection);
        if (nextDirection === null) {
          setSortKey(null);
          setSortDirection(null);
        } else {
          setSortDirection(nextDirection);
        }
      } else {
        setSortKey(key);
        setSortDirection('asc');
      }
    },
    [sortKey, sortDirection],
  );

  /**
   * Handle search input change.
   * @param {React.ChangeEvent<HTMLInputElement>} event
   */
  const handleSearchChange = useCallback((event) => {
    setSearchQuery(event.target.value);
  }, []);

  /**
   * Filter data based on search query across all string fields.
   */
  const filteredData = useMemo(() => {
    if (!searchable || !searchQuery.trim()) {
      return data;
    }

    const query = searchQuery.trim().toLowerCase();

    return data.filter((row) => {
      return columns.some((col) => {
        const value = row[col.key];
        if (value === null || value === undefined) {
          return false;
        }
        return String(value).toLowerCase().includes(query);
      });
    });
  }, [data, searchQuery, searchable, columns]);

  /**
   * Sort filtered data based on current sort state.
   */
  const sortedData = useMemo(() => {
    if (!sortKey || !sortDirection) {
      return filteredData;
    }

    return [...filteredData].sort((a, b) => {
      return compareValues(a[sortKey], b[sortKey], sortDirection);
    });
  }, [filteredData, sortKey, sortDirection]);

  /**
   * Render sort indicator for a column header.
   * @param {string} key - The column key
   * @returns {React.ReactElement | null}
   */
  const renderSortIndicator = (key) => {
    if (sortKey !== key || sortDirection === null) {
      return (
        <span className="ml-1 inline-flex flex-col opacity-30">
          <ChevronUpIcon className="h-3 w-3 -mb-0.5" aria-hidden="true" />
          <ChevronDownIcon className="h-3 w-3 -mt-0.5" aria-hidden="true" />
        </span>
      );
    }

    if (sortDirection === 'asc') {
      return (
        <span className="ml-1 inline-flex">
          <ChevronUpIcon className="h-3.5 w-3.5 text-primary-600" aria-hidden="true" />
        </span>
      );
    }

    return (
      <span className="ml-1 inline-flex">
        <ChevronDownIcon className="h-3.5 w-3.5 text-primary-600" aria-hidden="true" />
      </span>
    );
  };

  return (
    <div className={`w-full${className ? ` ${className}` : ''}`}>
      {/* Search Input */}
      {searchable && (
        <div className="mb-4">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={searchPlaceholder}
              className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0"
              aria-label={searchPlaceholder}
            />
          </div>
        </div>
      )}

      {/* Table */}
      {sortedData.length === 0 ? (
        <EmptyState
          title={emptyMessage}
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500${
                      col.sortable !== false ? ' cursor-pointer select-none hover:bg-gray-100 transition-colors' : ''
                    }`}
                    onClick={
                      col.sortable !== false
                        ? () => handleSort(col.key)
                        : undefined
                    }
                    aria-sort={
                      sortKey === col.key && sortDirection !== null
                        ? sortDirection === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : 'none'
                    }
                  >
                    <span className="inline-flex items-center">
                      {col.label}
                      {col.sortable !== false && renderSortIndicator(col.key)}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {sortedData.map((row, rowIndex) => (
                <tr
                  key={row.id || row.holdingId || row.lotId || rowIndex}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={`${
                    onRowClick
                      ? 'cursor-pointer hover:bg-gray-50 transition-colors'
                      : ''
                  }`}
                  tabIndex={onRowClick ? 0 : undefined}
                  onKeyDown={
                    onRowClick
                      ? (event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            onRowClick(row);
                          }
                        }
                      : undefined
                  }
                  role={onRowClick ? 'button' : undefined}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="whitespace-nowrap px-4 py-3 text-sm text-gray-700"
                    >
                      {typeof col.render === 'function'
                        ? col.render(row[col.key], row)
                        : row[col.key] !== null && row[col.key] !== undefined
                          ? String(row[col.key])
                          : ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

DataTable.propTypes = {
  /** Column definitions for the table */
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      /** Unique key matching a field in the data objects */
      key: PropTypes.string.isRequired,
      /** Display label for the column header */
      label: PropTypes.string.isRequired,
      /** Whether this column is sortable (defaults to true) */
      sortable: PropTypes.bool,
      /** Custom render function receiving (cellValue, rowData) */
      render: PropTypes.func,
    }),
  ).isRequired,
  /** Array of row data objects */
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  /** Whether to show the search input */
  searchable: PropTypes.bool,
  /** Placeholder text for the search input */
  searchPlaceholder: PropTypes.string,
  /** Message to display when no data matches */
  emptyMessage: PropTypes.string,
  /** Callback invoked with the row data when a row is clicked */
  onRowClick: PropTypes.func,
  /** Additional CSS classes to apply to the wrapper */
  className: PropTypes.string,
};

DataTable.defaultProps = {
  searchable: false,
  searchPlaceholder: 'Search...',
  emptyMessage: 'No data available',
  onRowClick: null,
  className: null,
};

export default DataTable;