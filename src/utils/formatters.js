/**
 * Data formatting utilities for display.
 * @module formatters
 */

/**
 * Format a number as USD currency with commas and two decimal places.
 * @param {number | string | null | undefined} value - The numeric value to format
 * @param {object} [options] - Formatting options
 * @param {boolean} [options.showSign=false] - Whether to show a + sign for positive values
 * @param {number} [options.minimumFractionDigits=2] - Minimum decimal places
 * @param {number} [options.maximumFractionDigits=2] - Maximum decimal places
 * @returns {string} Formatted currency string (e.g., "$1,234.56")
 */
export function formatCurrency(value, options = {}) {
  const {
    showSign = false,
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  } = options;

  if (value === null || value === undefined || value === '') {
    return '$0.00';
  }

  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num)) {
    return '$0.00';
  }

  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(Math.abs(num));

  if (num < 0) {
    return `-${formatted}`;
  }

  if (showSign && num > 0) {
    return `+${formatted}`;
  }

  return formatted;
}

/**
 * Format a date string or Date object as MM/DD/YYYY.
 * @param {string | Date | number | null | undefined} value - The date value to format
 * @returns {string} Formatted date string (e.g., "01/15/2024") or empty string if invalid
 */
export function formatDate(value) {
  if (value === null || value === undefined || value === '') {
    return '';
  }

  const date = value instanceof Date ? value : new Date(value);

  if (isNaN(date.getTime())) {
    return '';
  }

  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
}

/**
 * Format a date string or Date object as MM/DD/YYYY HH:MM AM/PM.
 * @param {string | Date | number | null | undefined} value - The date/time value to format
 * @returns {string} Formatted date-time string (e.g., "01/15/2024 02:30 PM") or empty string if invalid
 */
export function formatDateTime(value) {
  if (value === null || value === undefined || value === '') {
    return '';
  }

  const date = value instanceof Date ? value : new Date(value);

  if (isNaN(date.getTime())) {
    return '';
  }

  const datePart = formatDate(date);

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours === 0 ? 12 : hours;
  const hoursStr = String(hours).padStart(2, '0');

  return `${datePart} ${hoursStr}:${minutes} ${ampm}`;
}

/**
 * Format a number as a percentage string.
 * @param {number | string | null | undefined} value - The numeric value to format (e.g., 0.1234 for 12.34%)
 * @param {object} [options] - Formatting options
 * @param {boolean} [options.showSign=false] - Whether to show a + sign for positive values
 * @param {number} [options.decimalPlaces=2] - Number of decimal places
 * @param {boolean} [options.alreadyPercent=false] - If true, value is already in percent form (e.g., 12.34 instead of 0.1234)
 * @returns {string} Formatted percentage string (e.g., "12.34%")
 */
export function formatPercentage(value, options = {}) {
  const {
    showSign = false,
    decimalPlaces = 2,
    alreadyPercent = false,
  } = options;

  if (value === null || value === undefined || value === '') {
    return '0.00%';
  }

  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num)) {
    return '0.00%';
  }

  const percentValue = alreadyPercent ? num : num * 100;
  const formatted = Math.abs(percentValue).toFixed(decimalPlaces);

  if (percentValue < 0) {
    return `-${formatted}%`;
  }

  if (showSign && percentValue > 0) {
    return `+${formatted}%`;
  }

  return `${formatted}%`;
}

/**
 * Format a phone number string as (XXX) XXX-XXXX.
 * @param {string | null | undefined} value - The phone number to format (digits only or with formatting)
 * @returns {string} Formatted phone number string (e.g., "(555) 123-4567") or the original value if not 10+ digits
 */
export function formatPhoneNumber(value) {
  if (value === null || value === undefined || value === '') {
    return '';
  }

  const cleaned = String(value).replace(/\D/g, '');

  // Handle US numbers with country code
  const digits = cleaned.length === 11 && cleaned.startsWith('1')
    ? cleaned.slice(1)
    : cleaned;

  if (digits.length !== 10) {
    return String(value);
  }

  const areaCode = digits.slice(0, 3);
  const prefix = digits.slice(3, 6);
  const line = digits.slice(6, 10);

  return `(${areaCode}) ${prefix}-${line}`;
}

/**
 * Format an account number with masking for security.
 * Shows only the last 4 characters, replacing the rest with bullets or asterisks.
 * @param {string | number | null | undefined} value - The account number to mask
 * @param {object} [options] - Formatting options
 * @param {string} [options.maskChar='•'] - Character to use for masking
 * @param {number} [options.visibleDigits=4] - Number of trailing digits to show
 * @returns {string} Masked account number (e.g., "••••••1234")
 */
export function formatAccountNumber(value, options = {}) {
  const {
    maskChar = '•',
    visibleDigits = 4,
  } = options;

  if (value === null || value === undefined || value === '') {
    return '';
  }

  const str = String(value);

  if (str.length <= visibleDigits) {
    return str;
  }

  const visible = str.slice(-visibleDigits);
  const maskedLength = str.length - visibleDigits;
  const masked = maskChar.repeat(maskedLength);

  return `${masked}${visible}`;
}

/**
 * Calculate gain/loss values given a current value and a cost basis.
 * @param {number | string} currentValue - The current market value
 * @param {number | string} costBasis - The original cost basis
 * @returns {{ dollarChange: number, percentChange: number, formattedDollar: string, formattedPercent: string, isGain: boolean, isLoss: boolean }}
 */
export function calculateGainLoss(currentValue, costBasis) {
  const current = typeof currentValue === 'string' ? parseFloat(currentValue) : currentValue;
  const basis = typeof costBasis === 'string' ? parseFloat(costBasis) : costBasis;

  if (
    current === null || current === undefined || isNaN(current) ||
    basis === null || basis === undefined || isNaN(basis)
  ) {
    return {
      dollarChange: 0,
      percentChange: 0,
      formattedDollar: '$0.00',
      formattedPercent: '0.00%',
      isGain: false,
      isLoss: false,
    };
  }

  const dollarChange = current - basis;
  const percentChange = basis !== 0 ? dollarChange / basis : 0;

  const isGain = dollarChange > 0;
  const isLoss = dollarChange < 0;

  const formattedDollar = formatCurrency(dollarChange, { showSign: true });
  const formattedPercent = formatPercentage(percentChange, { showSign: true });

  return {
    dollarChange,
    percentChange,
    formattedDollar,
    formattedPercent,
    isGain,
    isLoss,
  };
}