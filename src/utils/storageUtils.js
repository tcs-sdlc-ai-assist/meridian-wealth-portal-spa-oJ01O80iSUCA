/**
 * Unified storage abstraction layer implementing the StorageManager interface.
 * Tries localStorage first, falls back to sessionStorage.
 * Includes try/catch error handling, JSON parse/stringify with schema validation,
 * and an onError callback mechanism for surfacing storage failures to the UI.
 * @module storageUtils
 */

/**
 * @type {Array<function(Error, string): void>}
 */
let errorListeners = [];

/**
 * Register a callback to be invoked when a storage error occurs.
 * @param {function(Error, string): void} callback - Receives the error and a context message
 * @returns {function(): void} Unsubscribe function
 */
export function onStorageError(callback) {
  if (typeof callback !== 'function') {
    return () => {};
  }
  errorListeners.push(callback);
  return () => {
    errorListeners = errorListeners.filter((cb) => cb !== callback);
  };
}

/**
 * Notify all registered error listeners.
 * @param {Error} error - The error that occurred
 * @param {string} context - Description of what operation failed
 */
function notifyError(error, context) {
  // eslint-disable-next-line no-console
  console.error(`[StorageManager] ${context}:`, error);
  errorListeners.forEach((cb) => {
    try {
      cb(error, context);
    } catch (_) {
      // Prevent listener errors from propagating
    }
  });
}

/**
 * Check whether a given storage mechanism is available and functional.
 * @param {'localStorage' | 'sessionStorage'} type - The storage type to check
 * @returns {boolean} True if the storage type is available and writable
 */
export function isStorageAvailable(type) {
  try {
    const storage = globalThis[type];
    if (!storage) {
      return false;
    }
    const testKey = '__meridian_storage_test__';
    storage.setItem(testKey, 'test');
    storage.removeItem(testKey);
    return true;
  } catch (_) {
    return false;
  }
}

/**
 * Returns the best available storage backend.
 * Prefers localStorage, falls back to sessionStorage.
 * @returns {Storage | null} The storage object, or null if none available
 */
function getStorage() {
  if (isStorageAvailable('localStorage')) {
    return globalThis.localStorage;
  }
  if (isStorageAvailable('sessionStorage')) {
    return globalThis.sessionStorage;
  }
  return null;
}

/**
 * Serialize a value to a JSON string for storage.
 * @param {*} value - The value to serialize
 * @returns {string} JSON string representation
 * @throws {Error} If the value is not serializable
 */
function serialize(value) {
  return JSON.stringify(value);
}

/**
 * Deserialize a JSON string from storage.
 * @param {string | null} raw - The raw string from storage
 * @returns {*} The parsed value, or null if raw is null
 * @throws {Error} If the string is not valid JSON
 */
function deserialize(raw) {
  if (raw === null || raw === undefined) {
    return null;
  }
  return JSON.parse(raw);
}

/**
 * Store a value under the given key.
 * Tries localStorage first, falls back to sessionStorage.
 * @param {string} key - Non-empty storage key
 * @param {*} value - JSON-serializable value to store
 * @returns {boolean} True if the operation succeeded
 */
export function setItem(key, value) {
  if (!key || typeof key !== 'string') {
    notifyError(new Error('Storage key must be a non-empty string'), 'setItem');
    return false;
  }

  try {
    const data = serialize(value);
    const storage = getStorage();
    if (!storage) {
      notifyError(new Error('No storage backend available'), 'setItem');
      return false;
    }
    storage.setItem(key, data);
    return true;
  } catch (error) {
    // Attempt fallback to sessionStorage if localStorage failed
    if (isStorageAvailable('sessionStorage')) {
      try {
        const data = serialize(value);
        globalThis.sessionStorage.setItem(key, data);
        return true;
      } catch (fallbackError) {
        notifyError(fallbackError, `setItem fallback failed for key "${key}"`);
        return false;
      }
    }
    notifyError(error, `setItem failed for key "${key}"`);
    return false;
  }
}

/**
 * Retrieve and deserialize a value by key.
 * Tries localStorage first, falls back to sessionStorage.
 * @param {string} key - Non-empty storage key
 * @param {*} [defaultValue=null] - Value to return if key is not found or on error
 * @returns {*} The deserialized value, or defaultValue if not found
 */
export function getItem(key, defaultValue = null) {
  if (!key || typeof key !== 'string') {
    notifyError(new Error('Storage key must be a non-empty string'), 'getItem');
    return defaultValue;
  }

  try {
    const storage = getStorage();
    if (!storage) {
      notifyError(new Error('No storage backend available'), 'getItem');
      return defaultValue;
    }
    const raw = storage.getItem(key);
    if (raw === null) {
      return defaultValue;
    }
    return deserialize(raw);
  } catch (error) {
    // Attempt fallback to sessionStorage
    if (isStorageAvailable('sessionStorage')) {
      try {
        const raw = globalThis.sessionStorage.getItem(key);
        if (raw === null) {
          return defaultValue;
        }
        return deserialize(raw);
      } catch (fallbackError) {
        notifyError(fallbackError, `getItem fallback failed for key "${key}"`);
        return defaultValue;
      }
    }
    notifyError(error, `getItem failed for key "${key}"`);
    return defaultValue;
  }
}

/**
 * Remove a value by key from all available storage backends.
 * @param {string} key - Non-empty storage key
 * @returns {boolean} True if the operation succeeded
 */
export function removeItem(key) {
  if (!key || typeof key !== 'string') {
    notifyError(new Error('Storage key must be a non-empty string'), 'removeItem');
    return false;
  }

  let success = false;

  try {
    if (isStorageAvailable('localStorage')) {
      globalThis.localStorage.removeItem(key);
      success = true;
    }
  } catch (error) {
    notifyError(error, `removeItem localStorage failed for key "${key}"`);
  }

  try {
    if (isStorageAvailable('sessionStorage')) {
      globalThis.sessionStorage.removeItem(key);
      success = true;
    }
  } catch (error) {
    notifyError(error, `removeItem sessionStorage failed for key "${key}"`);
  }

  if (!success) {
    notifyError(new Error('No storage backend available'), `removeItem failed for key "${key}"`);
  }

  return success;
}

/**
 * Clear all data from all available storage backends.
 * @returns {boolean} True if at least one backend was cleared
 */
export function clear() {
  let success = false;

  try {
    if (isStorageAvailable('localStorage')) {
      globalThis.localStorage.clear();
      success = true;
    }
  } catch (error) {
    notifyError(error, 'clear localStorage failed');
  }

  try {
    if (isStorageAvailable('sessionStorage')) {
      globalThis.sessionStorage.clear();
      success = true;
    }
  } catch (error) {
    notifyError(error, 'clear sessionStorage failed');
  }

  if (!success) {
    notifyError(new Error('No storage backend available'), 'clear failed');
  }

  return success;
}

/**
 * Migrate data from one key to another.
 * Reads the value from oldKey, writes it to newKey, then removes oldKey.
 * If oldKey does not exist, this is a no-op.
 * @param {string} oldKey - The source key
 * @param {string} newKey - The destination key
 * @returns {boolean} True if migration succeeded or was a no-op
 */
export function migrate(oldKey, newKey) {
  if (!oldKey || typeof oldKey !== 'string' || !newKey || typeof newKey !== 'string') {
    notifyError(
      new Error('Both oldKey and newKey must be non-empty strings'),
      'migrate',
    );
    return false;
  }

  try {
    const value = getItem(oldKey);
    if (value === null) {
      // Nothing to migrate
      return true;
    }
    const written = setItem(newKey, value);
    if (written) {
      removeItem(oldKey);
      return true;
    }
    return false;
  } catch (error) {
    notifyError(error, `migrate failed from "${oldKey}" to "${newKey}"`);
    return false;
  }
}

/**
 * Validate that a stored value conforms to an expected schema shape.
 * Checks that all required keys exist on the stored object.
 * @param {string} key - The storage key to validate
 * @param {string[]} requiredFields - Array of field names that must be present
 * @returns {{ valid: boolean, data: * | null, missingFields: string[] }}
 */
export function validateSchema(key, requiredFields) {
  const data = getItem(key);
  if (data === null) {
    return { valid: false, data: null, missingFields: requiredFields || [] };
  }

  if (typeof data !== 'object' || Array.isArray(data)) {
    return { valid: false, data, missingFields: requiredFields || [] };
  }

  const missingFields = (requiredFields || []).filter(
    (field) => !(field in data),
  );

  return {
    valid: missingFields.length === 0,
    data,
    missingFields,
  };
}

/**
 * Attempt to recover from corrupted data by removing the offending key.
 * @param {string} key - The storage key with corrupted data
 * @returns {boolean} True if the key was successfully removed
 */
export function handleCorruptedData(key) {
  // eslint-disable-next-line no-console
  console.warn(`[StorageManager] Removing corrupted data for key "${key}"`);
  return removeItem(key);
}