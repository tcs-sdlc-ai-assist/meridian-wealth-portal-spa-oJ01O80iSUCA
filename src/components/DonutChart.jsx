/**
 * Asset allocation donut chart component using Recharts PieChart.
 * Renders a responsive donut chart with legend showing category names,
 * values, and percentages. Styled with Tailwind wrapper.
 * @module components/DonutChart
 */

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency, formatPercentage } from '../utils/formatters.js';

/**
 * Size-to-dimension mapping for the chart.
 * @type {Record<string, { width: number, height: number, innerRadius: number, outerRadius: number }>}
 */
const SIZE_CONFIG = {
  sm: { width: 200, height: 200, innerRadius: 50, outerRadius: 80 },
  md: { width: 280, height: 280, innerRadius: 70, outerRadius: 110 },
  lg: { width: 360, height: 360, innerRadius: 90, outerRadius: 140 },
};

/**
 * Default color palette for chart segments when no color is provided.
 * @type {string[]}
 */
const DEFAULT_COLORS = [
  '#3b82f6',
  '#22c55e',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#06b6d4',
  '#ec4899',
  '#f97316',
  '#14b8a6',
  '#6366f1',
  '#84cc16',
  '#a855f7',
];

/**
 * Custom tooltip component for the donut chart.
 * @param {object} props - Tooltip props from Recharts
 * @param {boolean} props.active - Whether the tooltip is active
 * @param {Array} props.payload - Tooltip payload data
 * @returns {React.ReactElement | null}
 */
function CustomTooltip({ active, payload }) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const entry = payload[0];
  const { name, value, payload: dataPayload } = entry;
  const percent = dataPayload && dataPayload.percent !== undefined ? dataPayload.percent : 0;

  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-lg">
      <p className="text-sm font-medium text-gray-900">{name}</p>
      <p className="text-sm text-gray-600">
        {formatCurrency(value)}
      </p>
      <p className="text-xs text-gray-500">
        {formatPercentage(percent, { alreadyPercent: true })}
      </p>
    </div>
  );
}

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.arrayOf(PropTypes.object),
};

CustomTooltip.defaultProps = {
  active: false,
  payload: [],
};

/**
 * DonutChart component for displaying asset allocation as a donut/pie chart.
 * @param {object} props - Component props
 * @param {Array<{name: string, value: number, color?: string}>} props.data - Array of data entries with name, value, and optional color
 * @param {string} [props.title] - Optional title displayed above the chart
 * @param {string} [props.size='md'] - Size of the chart: 'sm', 'md', or 'lg'
 * @param {string} [props.className] - Additional CSS classes to apply to the wrapper
 * @returns {React.ReactElement} The DonutChart component
 */
function DonutChart({ data, title, size, className }) {
  const config = SIZE_CONFIG[size] || SIZE_CONFIG.md;

  /**
   * Compute total value and enrich data with percentages and resolved colors.
   */
  const { enrichedData, totalValue } = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return { enrichedData: [], totalValue: 0 };
    }

    const total = data.reduce((sum, entry) => {
      const val = typeof entry.value === 'number' && !isNaN(entry.value) ? entry.value : 0;
      return sum + val;
    }, 0);

    const enriched = data.map((entry, index) => {
      const val = typeof entry.value === 'number' && !isNaN(entry.value) ? entry.value : 0;
      const percent = total > 0 ? (val / total) * 100 : 0;
      const color = entry.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length];

      return {
        name: entry.name || 'Unknown',
        value: val,
        percent: parseFloat(percent.toFixed(2)),
        color,
      };
    });

    return { enrichedData: enriched, totalValue: total };
  }, [data]);

  if (enrichedData.length === 0) {
    return (
      <div className={`flex flex-col items-center${className ? ` ${className}` : ''}`}>
        {title && (
          <h3 className="mb-4 text-base font-semibold text-gray-900">{title}</h3>
        )}
        <p className="py-8 text-sm text-gray-500">No allocation data available</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center${className ? ` ${className}` : ''}`}>
      {title && (
        <h3 className="mb-4 text-base font-semibold text-gray-900">{title}</h3>
      )}

      {/* Chart */}
      <div style={{ width: config.width, height: config.height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={enrichedData}
              cx="50%"
              cy="50%"
              innerRadius={config.innerRadius}
              outerRadius={config.outerRadius}
              dataKey="value"
              nameKey="name"
              stroke="none"
              paddingAngle={1}
            >
              {enrichedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Total */}
      <div className="mt-2 text-center">
        <p className="text-xs text-gray-500">Total</p>
        <p className="text-lg font-semibold text-gray-900">
          {formatCurrency(totalValue)}
        </p>
      </div>

      {/* Legend */}
      <div className="mt-4 w-full max-w-xs space-y-2">
        {enrichedData.map((entry, index) => (
          <div
            key={`legend-${index}`}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="inline-block h-3 w-3 flex-shrink-0 rounded-full"
                style={{ backgroundColor: entry.color }}
                aria-hidden="true"
              />
              <span className="truncate text-gray-700">{entry.name}</span>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0 pl-2">
              <span className="text-gray-900 font-medium">
                {formatCurrency(entry.value)}
              </span>
              <span className="text-gray-500 w-14 text-right">
                {formatPercentage(entry.percent, { alreadyPercent: true })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

DonutChart.propTypes = {
  /** Array of data entries with name, value, and optional color */
  data: PropTypes.arrayOf(
    PropTypes.shape({
      /** Category name displayed in the legend */
      name: PropTypes.string.isRequired,
      /** Numeric value for the segment */
      value: PropTypes.number.isRequired,
      /** Optional hex color for the segment */
      color: PropTypes.string,
    }),
  ).isRequired,
  /** Optional title displayed above the chart */
  title: PropTypes.string,
  /** Size of the chart */
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  /** Additional CSS classes to apply to the wrapper */
  className: PropTypes.string,
};

DonutChart.defaultProps = {
  title: null,
  size: 'md',
  className: null,
};

export default DonutChart;