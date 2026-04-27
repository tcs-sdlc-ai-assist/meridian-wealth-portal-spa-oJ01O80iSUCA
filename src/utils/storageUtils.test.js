/**
 * Unit tests for storageUtils.js — storage abstraction layer.
 * Tests getItem/setItem, fallback behavior, removeItem, clear,
 * corrupted JSON handling, isStorageAvailable, and migrate.
 * @module test/storageUtils
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  setItem,
  getItem,
  removeItem,
  clear,
  isStorageAvailable,
  migrate,
  validateSchema,
  handleCorruptedData,
  onStorageError,
} from './storageUtils.js';

describe('storageUtils', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  describe('isStorageAvailable', () => {
    it('returns true when localStorage is available', () => {
      expect(isStorageAvailable('localStorage')).toBe(true);
    });

    it('returns true when sessionStorage is available', () => {
      expect(isStorageAvailable('sessionStorage')).toBe(true);
    });

    it('returns false for an unknown storage type', () => {
      expect(isStorageAvailable('unknownStorage')).toBe(false);
    });

    it('returns false when storage setItem throws', () => {
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn(() => {
        throw new Error('QuotaExceededError');
      });

      expect(isStorageAvailable('localStorage')).toBe(false);

      localStorage.setItem = originalSetItem;
    });
  });

  describe('setItem', () => {
    it('stores a string value in localStorage', () => {
      const result = setItem('test_key', 'hello');
      expect(result).toBe(true);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'test_key',
        JSON.stringify('hello'),
      );
    });

    it('stores an object value in localStorage', () => {
      const data = { id: 'usr_001', name: 'Test User' };
      const result = setItem('user_data', data);
      expect(result).toBe(true);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'user_data',
        JSON.stringify(data),
      );
    });

    it('stores an array value in localStorage', () => {
      const data = [1, 2, 3];
      const result = setItem('array_data', data);
      expect(result).toBe(true);
    });

    it('stores a boolean value in localStorage', () => {
      const result = setItem('bool_key', true);
      expect(result).toBe(true);
    });

    it('stores a number value in localStorage', () => {
      const result = setItem('num_key', 42);
      expect(result).toBe(true);
    });

    it('stores null value in localStorage', () => {
      const result = setItem('null_key', null);
      expect(result).toBe(true);
    });

    it('returns false for empty key', () => {
      const result = setItem('', 'value');
      expect(result).toBe(false);
    });

    it('returns false for non-string key', () => {
      const result = setItem(null, 'value');
      expect(result).toBe(false);
    });

    it('returns false for undefined key', () => {
      const result = setItem(undefined, 'value');
      expect(result).toBe(false);
    });

    it('falls back to sessionStorage when localStorage throws', () => {
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn(() => {
        throw new Error('QuotaExceededError');
      });

      const result = setItem('fallback_key', 'fallback_value');
      expect(result).toBe(true);
      expect(sessionStorage.setItem).toHaveBeenCalledWith(
        'fallback_key',
        JSON.stringify('fallback_value'),
      );

      localStorage.setItem = originalSetItem;
    });

    it('returns false when both localStorage and sessionStorage throw', () => {
      const originalLocalSetItem = localStorage.setItem;
      const originalSessionSetItem = sessionStorage.setItem;

      localStorage.setItem = vi.fn(() => {
        throw new Error('QuotaExceededError');
      });
      sessionStorage.setItem = vi.fn(() => {
        throw new Error('QuotaExceededError');
      });

      const result = setItem('fail_key', 'fail_value');
      expect(result).toBe(false);

      localStorage.setItem = originalLocalSetItem;
      sessionStorage.setItem = originalSessionSetItem;
    });
  });

  describe('getItem', () => {
    it('retrieves a stored string value', () => {
      setItem('get_test', 'hello world');
      const result = getItem('get_test');
      expect(result).toBe('hello world');
    });

    it('retrieves a stored object value', () => {
      const data = { id: 'usr_001', name: 'Test User' };
      setItem('get_obj', data);
      const result = getItem('get_obj');
      expect(result).toEqual(data);
    });

    it('retrieves a stored array value', () => {
      const data = [1, 2, 3];
      setItem('get_arr', data);
      const result = getItem('get_arr');
      expect(result).toEqual(data);
    });

    it('retrieves a stored boolean value', () => {
      setItem('get_bool', true);
      const result = getItem('get_bool');
      expect(result).toBe(true);
    });

    it('retrieves a stored number value', () => {
      setItem('get_num', 42);
      const result = getItem('get_num');
      expect(result).toBe(42);
    });

    it('returns null for non-existent key', () => {
      const result = getItem('nonexistent_key');
      expect(result).toBeNull();
    });

    it('returns default value for non-existent key when provided', () => {
      const result = getItem('nonexistent_key', 'default');
      expect(result).toBe('default');
    });

    it('returns default value for empty key', () => {
      const result = getItem('', 'default');
      expect(result).toBe('default');
    });

    it('returns default value for non-string key', () => {
      const result = getItem(null, 'default');
      expect(result).toBe('default');
    });

    it('returns default value for undefined key', () => {
      const result = getItem(undefined, 'default');
      expect(result).toBe('default');
    });

    it('falls back to sessionStorage when localStorage getItem throws', () => {
      sessionStorage.setItem('fallback_get', JSON.stringify('session_value'));

      const originalGetItem = localStorage.getItem;
      localStorage.getItem = vi.fn(() => {
        throw new Error('SecurityError');
      });

      const result = getItem('fallback_get');
      expect(result).toBe('session_value');

      localStorage.getItem = originalGetItem;
    });

    it('returns default value when both storages fail', () => {
      const originalLocalGetItem = localStorage.getItem;
      const originalSessionGetItem = sessionStorage.getItem;

      localStorage.getItem = vi.fn(() => {
        throw new Error('SecurityError');
      });
      sessionStorage.getItem = vi.fn(() => {
        throw new Error('SecurityError');
      });

      const result = getItem('fail_get', 'fallback_default');
      expect(result).toBe('fallback_default');

      localStorage.getItem = originalLocalGetItem;
      sessionStorage.getItem = originalSessionGetItem;
    });

    it('handles corrupted JSON data gracefully', () => {
      localStorage.setItem('corrupted_key', '{invalid json');

      const originalLocalGetItem = localStorage.getItem;
      localStorage.getItem = vi.fn(() => '{invalid json');

      const result = getItem('corrupted_key', 'safe_default');
      // Should fall back to sessionStorage or return default
      expect(result).toBeDefined();

      localStorage.getItem = originalLocalGetItem;
    });
  });

  describe('removeItem', () => {
    it('removes an item from localStorage', () => {
      setItem('remove_test', 'value');
      const result = removeItem('remove_test');
      expect(result).toBe(true);
      expect(localStorage.removeItem).toHaveBeenCalledWith('remove_test');
    });

    it('removes an item from sessionStorage as well', () => {
      setItem('remove_both', 'value');
      const result = removeItem('remove_both');
      expect(result).toBe(true);
      expect(sessionStorage.removeItem).toHaveBeenCalledWith('remove_both');
    });

    it('returns false for empty key', () => {
      const result = removeItem('');
      expect(result).toBe(false);
    });

    it('returns false for non-string key', () => {
      const result = removeItem(null);
      expect(result).toBe(false);
    });

    it('returns false for undefined key', () => {
      const result = removeItem(undefined);
      expect(result).toBe(false);
    });

    it('succeeds even if key does not exist', () => {
      const result = removeItem('nonexistent_remove');
      expect(result).toBe(true);
    });
  });

  describe('clear', () => {
    it('clears all data from localStorage and sessionStorage', () => {
      setItem('clear_test_1', 'value1');
      setItem('clear_test_2', 'value2');

      const result = clear();
      expect(result).toBe(true);
      expect(localStorage.clear).toHaveBeenCalled();
      expect(sessionStorage.clear).toHaveBeenCalled();
    });

    it('returns true when storages are available', () => {
      const result = clear();
      expect(result).toBe(true);
    });
  });

  describe('migrate', () => {
    it('migrates data from old key to new key', () => {
      setItem('old_key', { data: 'test' });
      const result = migrate('old_key', 'new_key');
      expect(result).toBe(true);

      const newData = getItem('new_key');
      expect(newData).toEqual({ data: 'test' });

      const oldData = getItem('old_key');
      expect(oldData).toBeNull();
    });

    it('returns true when old key does not exist (no-op)', () => {
      const result = migrate('nonexistent_old', 'new_key');
      expect(result).toBe(true);
    });

    it('returns false for empty old key', () => {
      const result = migrate('', 'new_key');
      expect(result).toBe(false);
    });

    it('returns false for empty new key', () => {
      const result = migrate('old_key', '');
      expect(result).toBe(false);
    });

    it('returns false for non-string old key', () => {
      const result = migrate(null, 'new_key');
      expect(result).toBe(false);
    });

    it('returns false for non-string new key', () => {
      const result = migrate('old_key', null);
      expect(result).toBe(false);
    });

    it('migrates complex objects correctly', () => {
      const complexData = {
        users: [
          { id: 'usr_001', name: 'Alice' },
          { id: 'usr_002', name: 'Bob' },
        ],
        metadata: { version: 2, timestamp: '2024-01-01T00:00:00Z' },
      };

      setItem('complex_old', complexData);
      const result = migrate('complex_old', 'complex_new');
      expect(result).toBe(true);

      const migrated = getItem('complex_new');
      expect(migrated).toEqual(complexData);
    });
  });

  describe('validateSchema', () => {
    it('returns valid true when all required fields are present', () => {
      setItem('schema_test', { id: 'usr_001', name: 'Test', email: 'test@example.com' });
      const result = validateSchema('schema_test', ['id', 'name', 'email']);
      expect(result.valid).toBe(true);
      expect(result.missingFields).toEqual([]);
      expect(result.data).toEqual({ id: 'usr_001', name: 'Test', email: 'test@example.com' });
    });

    it('returns valid false when required fields are missing', () => {
      setItem('schema_missing', { id: 'usr_001' });
      const result = validateSchema('schema_missing', ['id', 'name', 'email']);
      expect(result.valid).toBe(false);
      expect(result.missingFields).toEqual(['name', 'email']);
    });

    it('returns valid false when key does not exist', () => {
      const result = validateSchema('nonexistent_schema', ['id', 'name']);
      expect(result.valid).toBe(false);
      expect(result.data).toBeNull();
      expect(result.missingFields).toEqual(['id', 'name']);
    });

    it('returns valid false when stored value is an array', () => {
      setItem('schema_array', [1, 2, 3]);
      const result = validateSchema('schema_array', ['id']);
      expect(result.valid).toBe(false);
    });

    it('returns valid true when no required fields are specified', () => {
      setItem('schema_empty', { id: 'usr_001' });
      const result = validateSchema('schema_empty', []);
      expect(result.valid).toBe(true);
      expect(result.missingFields).toEqual([]);
    });
  });

  describe('handleCorruptedData', () => {
    it('removes the key and returns true', () => {
      setItem('corrupt_test', 'some_value');
      const result = handleCorruptedData('corrupt_test');
      expect(result).toBe(true);

      const data = getItem('corrupt_test');
      expect(data).toBeNull();
    });

    it('returns true even if key does not exist', () => {
      const result = handleCorruptedData('nonexistent_corrupt');
      expect(result).toBe(true);
    });
  });

  describe('onStorageError', () => {
    it('registers an error listener and invokes it on error', () => {
      const listener = vi.fn();
      const unsubscribe = onStorageError(listener);

      // Trigger an error by passing invalid key
      setItem('', 'value');

      expect(listener).toHaveBeenCalled();
      expect(listener).toHaveBeenCalledWith(
        expect.any(Error),
        expect.any(String),
      );

      unsubscribe();
    });

    it('returns a function that unsubscribes the listener', () => {
      const listener = vi.fn();
      const unsubscribe = onStorageError(listener);

      unsubscribe();

      // Trigger an error after unsubscribe
      setItem('', 'value');

      expect(listener).not.toHaveBeenCalled();
    });

    it('returns a no-op function for non-function callback', () => {
      const unsubscribe = onStorageError('not a function');
      expect(typeof unsubscribe).toBe('function');
      unsubscribe(); // should not throw
    });

    it('handles multiple listeners', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      const unsub1 = onStorageError(listener1);
      const unsub2 = onStorageError(listener2);

      setItem('', 'value');

      expect(listener1).toHaveBeenCalled();
      expect(listener2).toHaveBeenCalled();

      unsub1();
      unsub2();
    });

    it('does not propagate errors from listeners', () => {
      const throwingListener = vi.fn(() => {
        throw new Error('Listener error');
      });
      const normalListener = vi.fn();

      const unsub1 = onStorageError(throwingListener);
      const unsub2 = onStorageError(normalListener);

      // Should not throw even though one listener throws
      expect(() => setItem('', 'value')).not.toThrow();
      expect(normalListener).toHaveBeenCalled();

      unsub1();
      unsub2();
    });
  });

  describe('round-trip data integrity', () => {
    it('preserves nested objects through set/get cycle', () => {
      const nested = {
        user: {
          id: 'usr_001',
          address: {
            street: '123 Main St',
            city: 'Springfield',
            state: 'IL',
          },
          accounts: [
            { accountId: 'acct_001', type: 'Individual' },
            { accountId: 'acct_002', type: 'Roth IRA' },
          ],
        },
      };

      setItem('nested_test', nested);
      const result = getItem('nested_test');
      expect(result).toEqual(nested);
    });

    it('preserves empty objects and arrays', () => {
      setItem('empty_obj', {});
      setItem('empty_arr', []);

      expect(getItem('empty_obj')).toEqual({});
      expect(getItem('empty_arr')).toEqual([]);
    });

    it('preserves special number values', () => {
      setItem('zero', 0);
      setItem('negative', -42.5);

      expect(getItem('zero')).toBe(0);
      expect(getItem('negative')).toBe(-42.5);
    });

    it('preserves empty string values', () => {
      setItem('empty_string', '');
      expect(getItem('empty_string')).toBe('');
    });

    it('preserves false boolean values', () => {
      setItem('false_val', false);
      expect(getItem('false_val')).toBe(false);
    });
  });
});