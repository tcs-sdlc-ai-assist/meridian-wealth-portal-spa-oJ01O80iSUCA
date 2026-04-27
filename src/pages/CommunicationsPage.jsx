/**
 * Communication Preferences page rendered at /notifications.
 * Displays a grid of notification types (Account Alerts, Trade Confirmations,
 * Market Updates, Security Alerts, Statements Available, Promotional) with
 * Toggle switches for each channel (Email, SMS, In-App).
 * Changes are persisted immediately to localStorage via userStore.updatePreferences.
 * Shows current state on reload. Styled with Tailwind.
 * @module pages/CommunicationsPage
 */

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  BellIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  DocumentTextIcon,
  MegaphoneIcon,
  ArrowsRightLeftIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { useSessionStore } from '../store/sessionStore.js';
import { useUserStore } from '../store/userStore.js';
import Toggle from '../components/Toggle.jsx';
import { showSuccessToast, showErrorToast } from '../components/Toast.jsx';
import { getPreferencesByUserId } from '../mock/seedData.js';

/**
 * Notification type configuration.
 * @type {Array<{key: string, label: string, description: string, icon: React.ComponentType}>}
 */
const NOTIFICATION_TYPES = [
  {
    key: 'accountAlerts',
    label: 'Account Alerts',
    description: 'Receive notifications about account balance changes, deposits, and withdrawals.',
    icon: ExclamationTriangleIcon,
  },
  {
    key: 'tradeConfirmations',
    label: 'Trade Confirmations',
    description: 'Get notified when your buy, sell, or transfer orders are executed.',
    icon: ArrowsRightLeftIcon,
  },
  {
    key: 'marketUpdates',
    label: 'Market Updates',
    description: 'Stay informed about market movements, price alerts, and portfolio performance.',
    icon: ChartBarIcon,
  },
  {
    key: 'securityAlerts',
    label: 'Security Alerts',
    description: 'Important notifications about login attempts, password changes, and security events.',
    icon: ShieldCheckIcon,
  },
  {
    key: 'statementsAvailable',
    label: 'Statements Available',
    description: 'Be notified when new account statements, tax documents, or reports are ready.',
    icon: DocumentTextIcon,
  },
  {
    key: 'promotional',
    label: 'Promotional',
    description: 'Receive updates about new products, services, educational content, and special offers.',
    icon: MegaphoneIcon,
  },
];

/**
 * Channel configuration.
 * @type {Array<{key: string, label: string, icon: React.ComponentType}>}
 */
const CHANNELS = [
  { key: 'email', label: 'Email', icon: EnvelopeIcon },
  { key: 'sms', label: 'SMS', icon: DevicePhoneMobileIcon },
  { key: 'inApp', label: 'In-App', icon: ComputerDesktopIcon },
];

/**
 * Build default notification preferences object.
 * @returns {object} Default notification preferences keyed by notification type and channel
 */
function getDefaultNotificationPreferences() {
  const defaults = {};
  NOTIFICATION_TYPES.forEach((type) => {
    defaults[type.key] = {};
    CHANNELS.forEach((channel) => {
      // Security alerts default to all enabled; promotional defaults to all disabled
      if (type.key === 'securityAlerts') {
        defaults[type.key][channel.key] = true;
      } else if (type.key === 'promotional') {
        defaults[type.key][channel.key] = false;
      } else {
        // Default email on, sms off, inApp on
        defaults[type.key][channel.key] = channel.key === 'email' || channel.key === 'inApp';
      }
    });
  });
  return defaults;
}

/**
 * Merge stored preferences with defaults to ensure all keys exist.
 * @param {object | null} stored - Stored notification preferences
 * @returns {object} Merged notification preferences
 */
function mergeWithDefaults(stored) {
  const defaults = getDefaultNotificationPreferences();

  if (!stored || typeof stored !== 'object') {
    return defaults;
  }

  const merged = {};
  NOTIFICATION_TYPES.forEach((type) => {
    merged[type.key] = {};
    CHANNELS.forEach((channel) => {
      if (
        stored[type.key] &&
        typeof stored[type.key] === 'object' &&
        typeof stored[type.key][channel.key] === 'boolean'
      ) {
        merged[type.key][channel.key] = stored[type.key][channel.key];
      } else {
        merged[type.key][channel.key] = defaults[type.key][channel.key];
      }
    });
  });

  return merged;
}

/**
 * CommunicationsPage component for managing notification preferences.
 * Displays a grid of notification types with toggle switches for each
 * delivery channel (Email, SMS, In-App). Changes persist immediately.
 * @returns {React.ReactElement} The CommunicationsPage component
 */
function CommunicationsPage() {
  const currentUser = useSessionStore((state) => state.currentUser);
  const updatePreferences = useUserStore((state) => state.updatePreferences);

  const userId = currentUser?.id;

  /**
   * Load initial notification preferences from storage.
   */
  const initialPrefs = useMemo(() => {
    if (!userId) {
      return getDefaultNotificationPreferences();
    }

    const storedPrefs = getPreferencesByUserId(userId);
    const notificationPrefs = storedPrefs && storedPrefs.notifications
      ? storedPrefs.notifications
      : null;

    return mergeWithDefaults(notificationPrefs);
  }, [userId]);

  const [preferences, setPreferences] = useState(initialPrefs);

  /**
   * Sync preferences when user changes.
   */
  useEffect(() => {
    setPreferences(initialPrefs);
  }, [initialPrefs]);

  /**
   * Handle toggling a notification channel for a specific type.
   * Persists the change immediately via userStore.updatePreferences.
   * @param {string} typeKey - The notification type key
   * @param {string} channelKey - The channel key
   * @param {boolean} newValue - The new toggle value
   */
  const handleToggle = useCallback(
    (typeKey, channelKey, newValue) => {
      if (!userId) {
        showErrorToast('Unable to save preferences. Please sign in again.');
        return;
      }

      const updatedPreferences = {
        ...preferences,
        [typeKey]: {
          ...preferences[typeKey],
          [channelKey]: newValue,
        },
      };

      setPreferences(updatedPreferences);

      const success = updatePreferences(userId, {
        notifications: updatedPreferences,
      });

      if (success) {
        showSuccessToast('Preference updated');
      } else {
        // Revert on failure
        setPreferences(preferences);
        showErrorToast('Failed to save preference. Please try again.');
      }
    },
    [userId, preferences, updatePreferences],
  );

  /**
   * Count enabled channels across all notification types.
   */
  const enabledCount = useMemo(() => {
    let count = 0;
    NOTIFICATION_TYPES.forEach((type) => {
      CHANNELS.forEach((channel) => {
        if (preferences[type.key] && preferences[type.key][channel.key]) {
          count += 1;
        }
      });
    });
    return count;
  }, [preferences]);

  const totalCount = NOTIFICATION_TYPES.length * CHANNELS.length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Communication Preferences</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage how you receive notifications for different account activities
        </p>
      </div>

      {/* Summary Banner */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100">
            <BellIcon className="h-6 w-6 text-primary-600" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-gray-900">
              Notification Summary
            </h2>
            <p className="mt-0.5 text-sm text-gray-500">
              You have{' '}
              <span className="font-medium text-primary-700">{enabledCount}</span>{' '}
              of{' '}
              <span className="font-medium text-gray-700">{totalCount}</span>{' '}
              notification channels enabled
            </p>
          </div>
        </div>
      </div>

      {/* Channel Legend */}
      <div className="flex flex-wrap items-center gap-4">
        {CHANNELS.map((channel) => (
          <div key={channel.key} className="flex items-center gap-2 text-sm text-gray-600">
            <channel.icon className="h-4 w-4 text-gray-400" aria-hidden="true" />
            <span>{channel.label}</span>
          </div>
        ))}
      </div>

      {/* Notification Type Cards */}
      <div className="space-y-4">
        {NOTIFICATION_TYPES.map((type) => {
          const TypeIcon = type.icon;

          return (
            <div
              key={type.key}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              {/* Type Header */}
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100">
                  <TypeIcon className="h-5 w-5 text-gray-600" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {type.label}
                  </h3>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {type.description}
                  </p>
                </div>
              </div>

              {/* Channel Toggles */}
              <div className="mt-4 grid grid-cols-1 gap-3 border-t border-gray-100 pt-4 sm:grid-cols-3">
                {CHANNELS.map((channel) => {
                  const isEnabled =
                    preferences[type.key] && preferences[type.key][channel.key] === true;

                  return (
                    <Toggle
                      key={`${type.key}-${channel.key}`}
                      enabled={isEnabled}
                      onChange={(newValue) => handleToggle(type.key, channel.key, newValue)}
                      label={channel.label}
                      description={`${type.label} via ${channel.label}`}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Note */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
        <p className="text-xs text-gray-500">
          <span className="font-medium text-gray-700">Note:</span>{' '}
          Security alerts are strongly recommended to remain enabled for all channels.
          Some regulatory notifications cannot be disabled and will always be delivered via email.
          Changes are saved automatically.
        </p>
      </div>
    </div>
  );
}

export default CommunicationsPage;