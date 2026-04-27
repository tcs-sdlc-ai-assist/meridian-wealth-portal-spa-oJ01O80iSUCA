/**
 * Browser compliance and error recovery utilities.
 * Provides helpers for checking browser compatibility, displaying error banners,
 * handling corrupted data, and monitoring storage quota usage.
 * @module complianceChecker
 */

import { removeItem, isStorageAvailable } from './storageUtils.js';

/**
 * @type {Array<function(string): void>}
 */
let errorBannerListeners = [];

/**
 * Register a callback to be invoked when an error banner should be displayed.
 * @param {function(string): void} callback - Receives the error message to display
 * @returns {function(): void} Unsubscribe function
 */
export function onErrorBanner(callback) {
  if (typeof callback !== 'function') {
    return () => {};
  }
  errorBannerListeners.push(callback);
  return () => {
    errorBannerListeners = errorBannerListeners.filter((cb) => cb !== callback);
  };
}

/**
 * Minimum supported browser versions.
 * Supports the latest 2 major versions of Chrome, Edge, Safari, and Firefox.
 * @type {Record<string, number>}
 */
const SUPPORTED_BROWSERS = {
  Chrome: 120,
  Edge: 120,
  Safari: 16,
  Firefox: 121,
};

/**
 * Parse the user agent string to detect browser name and version.
 * @param {string} [userAgent] - The user agent string to parse (defaults to navigator.userAgent)
 * @returns {{ name: string, version: number } | null} Detected browser info or null if unrecognized
 */
export function parseBrowserInfo(userAgent) {
  const ua = userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : '');

  if (!ua) {
    return null;
  }

  // Order matters: Edge and Chrome both contain "Chrome" in UA
  // Edge (Chromium-based)
  const edgeMatch = ua.match(/Edg(?:e|A|iOS)?\/(\d+)/);
  if (edgeMatch) {
    return { name: 'Edge', version: parseInt(edgeMatch[1], 10) };
  }

  // Firefox
  const firefoxMatch = ua.match(/Firefox\/(\d+)/);
  if (firefoxMatch) {
    return { name: 'Firefox', version: parseInt(firefoxMatch[1], 10) };
  }

  // Safari (must check before Chrome since Chrome UA also contains Safari)
  const safariMatch = ua.match(/Version\/(\d+).*Safari/);
  if (safariMatch && !ua.includes('Chrome') && !ua.includes('Chromium')) {
    return { name: 'Safari', version: parseInt(safariMatch[1], 10) };
  }

  // Chrome / Chromium
  const chromeMatch = ua.match(/(?:Chrome|Chromium)\/(\d+)/);
  if (chromeMatch) {
    return { name: 'Chrome', version: parseInt(chromeMatch[1], 10) };
  }

  return null;
}

/**
 * Check whether the current browser meets minimum version requirements.
 * Returns true if the browser is supported or if detection fails (permissive fallback).
 * @param {string} [userAgent] - Optional user agent string override for testing
 * @returns {{ supported: boolean, browser: string | null, version: number | null, message: string }}
 */
export function checkBrowser(userAgent) {
  const info = parseBrowserInfo(userAgent);

  if (!info) {
    // Cannot detect browser; allow access with a warning
    return {
      supported: true,
      browser: null,
      version: null,
      message: 'Browser could not be detected. Some features may not work as expected.',
    };
  }

  const minVersion = SUPPORTED_BROWSERS[info.name];

  if (minVersion === undefined) {
    // Unknown browser; allow access with a warning
    return {
      supported: true,
      browser: info.name,
      version: info.version,
      message: `${info.name} is not officially supported. For the best experience, use Chrome, Edge, Safari, or Firefox.`,
    };
  }

  if (info.version < minVersion) {
    return {
      supported: false,
      browser: info.name,
      version: info.version,
      message: `${info.name} ${info.version} is not supported. Please update to ${info.name} ${minVersion} or later.`,
    };
  }

  return {
    supported: true,
    browser: info.name,
    version: info.version,
    message: '',
  };
}

/**
 * Trigger a global error banner by notifying all registered listeners.
 * @param {string} message - The error message to display in the banner
 * @returns {void}
 */
export function showErrorBanner(message) {
  if (!message || typeof message !== 'string') {
    return;
  }

  // eslint-disable-next-line no-console
  console.warn(`[ComplianceChecker] Error banner: ${message}`);

  errorBannerListeners.forEach((cb) => {
    try {
      cb(message);
    } catch (_) {
      // Prevent listener errors from propagating
    }
  });
}

/**
 * Detect and handle corrupted data for a given storage key.
 * Attempts to parse the raw value from storage. If parsing fails,
 * removes the corrupted entry and triggers an error banner.
 * @param {string} key - The storage key to check for corruption
 * @returns {{ corrupted: boolean, recovered: boolean, data: * | null }}
 */
export function handleCorruptedData(key) {
  if (!key || typeof key !== 'string') {
    return { corrupted: false, recovered: false, data: null };
  }

  let storage = null;
  let raw = null;

  try {
    if (isStorageAvailable('localStorage')) {
      storage = globalThis.localStorage;
      raw = storage.getItem(key);
    } else if (isStorageAvailable('sessionStorage')) {
      storage = globalThis.sessionStorage;
      raw = storage.getItem(key);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`[ComplianceChecker] Failed to read key "${key}":`, error);
    return { corrupted: true, recovered: false, data: null };
  }

  if (raw === null) {
    // Key does not exist; nothing to check
    return { corrupted: false, recovered: false, data: null };
  }

  try {
    const data = JSON.parse(raw);
    return { corrupted: false, recovered: false, data };
  } catch (_) {
    // Data is corrupted — attempt recovery by removing the key
    // eslint-disable-next-line no-console
    console.warn(`[ComplianceChecker] Corrupted data detected for key "${key}". Attempting recovery.`);

    const removed = removeItem(key);

    showErrorBanner(
      `Data for "${key}" was corrupted and has been reset. You may need to sign in again.`,
    );

    return { corrupted: true, recovered: removed, data: null };
  }
}

/**
 * Check the approximate storage quota usage and warn if nearing capacity.
 * Uses the StorageManager API if available, otherwise estimates based on
 * serialized size of all stored keys.
 * @param {object} [options={}] - Configuration options
 * @param {number} [options.warningThreshold=0.8] - Fraction (0-1) at which to trigger a warning
 * @param {number} [options.estimatedQuotaBytes=5242880] - Estimated total quota in bytes (default 5MB)
 * @returns {Promise<{ usageBytes: number, quotaBytes: number, usagePercent: number, warning: boolean, message: string }>}
 */
export async function checkStorageQuota(options = {}) {
  const {
    warningThreshold = 0.8,
    estimatedQuotaBytes = 5 * 1024 * 1024, // 5MB default
  } = options;

  // Try the Storage Manager API (navigator.storage.estimate)
  if (
    typeof navigator !== 'undefined' &&
    navigator.storage &&
    typeof navigator.storage.estimate === 'function'
  ) {
    try {
      const estimate = await navigator.storage.estimate();
      const usage = estimate.usage || 0;
      const quota = estimate.quota || estimatedQuotaBytes;
      const usagePercent = quota > 0 ? usage / quota : 0;
      const warning = usagePercent >= warningThreshold;

      if (warning) {
        showErrorBanner(
          `Storage is ${Math.round(usagePercent * 100)}% full. Please clear some data to avoid issues.`,
        );
      }

      return {
        usageBytes: usage,
        quotaBytes: quota,
        usagePercent,
        warning,
        message: warning
          ? `Storage usage is at ${Math.round(usagePercent * 100)}% of available quota.`
          : '',
      };
    } catch (_) {
      // Fall through to manual estimation
    }
  }

  // Manual estimation by iterating storage keys
  let totalBytes = 0;

  try {
    const storage = isStorageAvailable('localStorage')
      ? globalThis.localStorage
      : isStorageAvailable('sessionStorage')
        ? globalThis.sessionStorage
        : null;

    if (storage) {
      for (let i = 0; i < storage.length; i++) {
        const storageKey = storage.key(i);
        if (storageKey) {
          const value = storage.getItem(storageKey);
          // Approximate byte size: 2 bytes per character (UTF-16)
          totalBytes += (storageKey.length + (value ? value.length : 0)) * 2;
        }
      }
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[ComplianceChecker] Failed to estimate storage usage:', error);
  }

  const usagePercent = estimatedQuotaBytes > 0 ? totalBytes / estimatedQuotaBytes : 0;
  const warning = usagePercent >= warningThreshold;

  if (warning) {
    showErrorBanner(
      `Storage is approximately ${Math.round(usagePercent * 100)}% full. Please clear some data to avoid issues.`,
    );
  }

  return {
    usageBytes: totalBytes,
    quotaBytes: estimatedQuotaBytes,
    usagePercent,
    warning,
    message: warning
      ? `Storage usage is approximately ${Math.round(usagePercent * 100)}% of estimated quota.`
      : '',
  };
}

/**
 * Run all compliance checks and return a summary.
 * Checks browser compatibility and storage availability.
 * @returns {{ browserSupported: boolean, storageAvailable: boolean, messages: string[] }}
 */
export function runComplianceChecks() {
  const messages = [];

  // Browser check
  const browserResult = checkBrowser();
  if (!browserResult.supported) {
    messages.push(browserResult.message);
    showErrorBanner(browserResult.message);
  } else if (browserResult.message) {
    messages.push(browserResult.message);
  }

  // Storage availability check
  const localAvailable = isStorageAvailable('localStorage');
  const sessionAvailable = isStorageAvailable('sessionStorage');
  const storageAvailable = localAvailable || sessionAvailable;

  if (!storageAvailable) {
    const storageMessage =
      'Browser storage is not available. The application requires localStorage or sessionStorage to function properly.';
    messages.push(storageMessage);
    showErrorBanner(storageMessage);
  } else if (!localAvailable) {
    messages.push(
      'localStorage is not available. Falling back to sessionStorage. Data may not persist across browser sessions.',
    );
  }

  return {
    browserSupported: browserResult.supported,
    storageAvailable,
    messages,
  };
}