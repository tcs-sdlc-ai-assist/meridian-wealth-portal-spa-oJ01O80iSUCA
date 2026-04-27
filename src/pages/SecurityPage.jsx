/**
 * Security settings page rendered at /settings.
 * Three sections: Change Password, Two-Factor Authentication, and Login History.
 * All changes persist to localStorage via userStore.updateSecurity.
 * @module pages/SecurityPage
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  ShieldCheckIcon,
  KeyIcon,
  DevicePhoneMobileIcon,
  ClockIcon,
  EyeIcon,
  EyeSlashIcon,
  ClipboardDocumentIcon,
} from '@heroicons/react/24/outline';
import { useSessionStore } from '../store/sessionStore.js';
import { useUserStore } from '../store/userStore.js';
import FormInput from '../components/FormInput.jsx';
import PasswordStrength from '../components/PasswordStrength.jsx';
import Toggle from '../components/Toggle.jsx';
import Badge from '../components/Badge.jsx';
import { showSuccessToast, showErrorToast, showInfoToast } from '../components/Toast.jsx';
import { formatDateTime } from '../utils/formatters.js';
import {
  validateRequired,
  validatePassword,
  validateConfirmPassword,
} from '../utils/validators.js';

/**
 * Generate a random alphanumeric backup code.
 * @returns {string} A backup code string (e.g., "A3F8K2")
 */
function generateBackupCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Generate an array of backup codes.
 * @param {number} count - Number of codes to generate
 * @returns {string[]} Array of backup code strings
 */
function generateBackupCodes(count = 6) {
  const codes = [];
  for (let i = 0; i < count; i++) {
    codes.push(generateBackupCode());
  }
  return codes;
}

/**
 * Simulated login history data.
 * @param {object} user - The current user object
 * @returns {Array<{id: string, date: string, browser: string, ip: string, location: string, status: string}>}
 */
function getLoginHistory(user) {
  if (!user) {
    return [];
  }

  const trustedDevices = user.security?.trustedDevices || [];
  const lastLogin = user.lastLogin || new Date().toISOString();

  const sessions = [
    {
      id: 'session_001',
      date: lastLogin,
      browser: trustedDevices[0] || 'Chrome - Windows',
      ip: '192.168.1.42',
      location: 'San Francisco, CA',
      status: 'active',
    },
    {
      id: 'session_002',
      date: '2024-02-08T09:15:00Z',
      browser: trustedDevices[1] || 'Safari - iPhone',
      ip: '10.0.0.128',
      location: 'San Francisco, CA',
      status: 'completed',
    },
    {
      id: 'session_003',
      date: '2024-02-05T14:30:00Z',
      browser: trustedDevices[0] || 'Chrome - Windows',
      ip: '192.168.1.42',
      location: 'San Francisco, CA',
      status: 'completed',
    },
    {
      id: 'session_004',
      date: '2024-01-28T11:00:00Z',
      browser: trustedDevices.length > 1 ? trustedDevices[1] : 'Firefox - macOS',
      ip: '172.16.0.55',
      location: 'New York, NY',
      status: 'completed',
    },
    {
      id: 'session_005',
      date: '2024-01-20T08:45:00Z',
      browser: trustedDevices[0] || 'Chrome - Windows',
      ip: '192.168.1.42',
      location: 'San Francisco, CA',
      status: 'completed',
    },
  ];

  return sessions;
}

/**
 * Two-factor method options.
 * @type {Array<{value: string, label: string}>}
 */
const TWO_FACTOR_METHOD_OPTIONS = [
  { value: 'authenticator', label: 'Authenticator App' },
  { value: 'sms', label: 'SMS Text Message' },
];

/**
 * SecurityPage component for managing security settings.
 * Displays sections for password change, two-factor authentication,
 * and login history. All changes persist via userStore.updateSecurity.
 * @returns {React.ReactElement} The SecurityPage component
 */
function SecurityPage() {
  const currentUser = useSessionStore((state) => state.currentUser);
  const updateSecurity = useUserStore((state) => state.updateSecurity);
  const updateUser = useUserStore((state) => state.updateUser);

  const userId = currentUser?.id;
  const security = currentUser?.security || {};

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: null,
    newPassword: null,
    confirmPassword: null,
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Two-factor authentication state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(
    security.twoFactorEnabled || false,
  );
  const [twoFactorMethod, setTwoFactorMethod] = useState(
    security.twoFactorMethod || 'authenticator',
  );
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [backupCodes] = useState(() => generateBackupCodes(6));

  // Login history
  const loginHistory = useMemo(() => getLoginHistory(currentUser), [currentUser]);

  /**
   * Handle password field change.
   * @param {React.ChangeEvent<HTMLInputElement>} event
   */
  const handlePasswordChange = useCallback((event) => {
    const { name, value } = event.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    setPasswordErrors((prev) => ({ ...prev, [name]: null }));
  }, []);

  /**
   * Validate and save password change.
   */
  const handleSavePassword = useCallback(() => {
    if (!userId || isChangingPassword) {
      return;
    }

    const errors = {
      currentPassword: validateRequired(passwordData.currentPassword, 'Current password'),
      newPassword: validatePassword(passwordData.newPassword),
      confirmPassword: validateConfirmPassword(
        passwordData.confirmPassword,
        passwordData.newPassword,
      ),
    };

    // Verify current password matches stored password
    if (!errors.currentPassword && currentUser?.password) {
      if (passwordData.currentPassword !== currentUser.password) {
        errors.currentPassword = 'Current password is incorrect';
      }
    }

    // Check new password is different from current
    if (
      !errors.currentPassword &&
      !errors.newPassword &&
      passwordData.currentPassword === passwordData.newPassword
    ) {
      errors.newPassword = 'New password must be different from current password';
    }

    setPasswordErrors(errors);

    const hasErrors = Object.values(errors).some((error) => error !== null);
    if (hasErrors) {
      return;
    }

    setIsChangingPassword(true);

    const now = new Date().toISOString();

    const securitySuccess = updateSecurity(userId, {
      lastPasswordChange: now,
    });

    const userSuccess = updateUser(userId, {
      password: passwordData.newPassword,
    });

    if (securitySuccess && userSuccess) {
      showSuccessToast('Password changed successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setPasswordErrors({
        currentPassword: null,
        newPassword: null,
        confirmPassword: null,
      });
    } else {
      showErrorToast('Failed to change password. Please try again.');
    }

    setIsChangingPassword(false);
  }, [userId, passwordData, currentUser, isChangingPassword, updateSecurity, updateUser]);

  /**
   * Handle two-factor authentication toggle.
   * @param {boolean} newValue - The new toggle value
   */
  const handleTwoFactorToggle = useCallback(
    (newValue) => {
      if (!userId) {
        showErrorToast('Unable to update settings. Please sign in again.');
        return;
      }

      setTwoFactorEnabled(newValue);

      const success = updateSecurity(userId, {
        twoFactorEnabled: newValue,
        twoFactorMethod: newValue ? twoFactorMethod : 'none',
      });

      if (success) {
        if (newValue) {
          showSuccessToast('Two-factor authentication enabled');
        } else {
          showSuccessToast('Two-factor authentication disabled');
          setShowBackupCodes(false);
        }
      } else {
        setTwoFactorEnabled(!newValue);
        showErrorToast('Failed to update two-factor authentication. Please try again.');
      }
    },
    [userId, twoFactorMethod, updateSecurity],
  );

  /**
   * Handle two-factor method change.
   * @param {React.ChangeEvent<HTMLSelectElement>} event
   */
  const handleMethodChange = useCallback(
    (event) => {
      const newMethod = event.target.value;
      setTwoFactorMethod(newMethod);

      if (!userId || !twoFactorEnabled) {
        return;
      }

      const success = updateSecurity(userId, {
        twoFactorMethod: newMethod,
      });

      if (success) {
        showSuccessToast(`Two-factor method updated to ${newMethod === 'authenticator' ? 'Authenticator App' : 'SMS'}`);
      } else {
        showErrorToast('Failed to update two-factor method. Please try again.');
      }
    },
    [userId, twoFactorEnabled, updateSecurity],
  );

  /**
   * Handle copying backup codes to clipboard.
   */
  const handleCopyBackupCodes = useCallback(() => {
    const codesText = backupCodes.join('\n');
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(codesText).then(
        () => {
          showSuccessToast('Backup codes copied to clipboard');
        },
        () => {
          showInfoToast('Unable to copy to clipboard. Please copy manually.');
        },
      );
    } else {
      showInfoToast('Clipboard not available. Please copy codes manually.');
    }
  }, [backupCodes]);

  /**
   * Format the last password change date.
   */
  const lastPasswordChange = useMemo(() => {
    if (!security.lastPasswordChange) {
      return 'Never';
    }
    return formatDateTime(security.lastPasswordChange);
  }, [security.lastPasswordChange]);

  if (!currentUser) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Security</h1>
          <p className="mt-1 text-sm text-gray-500">
            Unable to load security settings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Security</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your password, two-factor authentication, and review login activity
        </p>
      </div>

      {/* Security Summary Banner */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100">
            <ShieldCheckIcon className="h-6 w-6 text-primary-600" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold text-gray-900">Security Overview</h2>
            <div className="mt-1 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <span>2FA:</span>
                <Badge
                  label={twoFactorEnabled ? 'Enabled' : 'Disabled'}
                  variant={twoFactorEnabled ? 'success' : 'failed'}
                  size="xs"
                />
              </div>
              <span className="text-gray-300">•</span>
              <span className="text-sm text-gray-500">
                Last password change: {lastPasswordChange}
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-sm text-gray-500">
                Trusted devices: {security.trustedDevices?.length || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Section */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 border-b border-gray-200 px-6 py-4">
          <KeyIcon className="h-5 w-5 text-primary-600" aria-hidden="true" />
          <h2 className="text-base font-semibold text-gray-900">Change Password</h2>
        </div>
        <div className="px-6 py-5">
          <div className="max-w-md space-y-4">
            {/* Current Password */}
            <div className="relative">
              <FormInput
                label="Current Password"
                name="currentPassword"
                type={showCurrentPassword ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                error={passwordErrors.currentPassword}
                placeholder="Enter your current password"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword((prev) => !prev)}
                className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label={showCurrentPassword ? 'Hide current password' : 'Show current password'}
              >
                {showCurrentPassword ? (
                  <EyeSlashIcon className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <EyeIcon className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>

            {/* New Password */}
            <div className="relative">
              <FormInput
                label="New Password"
                name="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                error={passwordErrors.newPassword}
                placeholder="Enter a new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
              >
                {showNewPassword ? (
                  <EyeSlashIcon className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <EyeIcon className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
            <PasswordStrength password={passwordData.newPassword} />

            {/* Confirm Password */}
            <FormInput
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              error={passwordErrors.confirmPassword}
              placeholder="Re-enter your new password"
              required
            />

            {/* Save Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSavePassword}
                disabled={isChangingPassword}
                className="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isChangingPassword ? 'Changing Password...' : 'Change Password'}
              </button>
            </div>
          </div>

          {/* Password Info */}
          <div className="mt-4 rounded-lg bg-gray-50 p-3">
            <p className="text-xs text-gray-500">
              <span className="font-medium text-gray-700">Password requirements:</span>{' '}
              Minimum 8 characters, at least one uppercase letter, one lowercase letter,
              one number, and one special character.
            </p>
          </div>
        </div>
      </div>

      {/* Two-Factor Authentication Section */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 border-b border-gray-200 px-6 py-4">
          <DevicePhoneMobileIcon className="h-5 w-5 text-primary-600" aria-hidden="true" />
          <h2 className="text-base font-semibold text-gray-900">Two-Factor Authentication</h2>
        </div>
        <div className="px-6 py-5 space-y-5">
          {/* Enable/Disable Toggle */}
          <Toggle
            enabled={twoFactorEnabled}
            onChange={handleTwoFactorToggle}
            label="Enable Two-Factor Authentication"
            description="Add an extra layer of security to your account by requiring a verification code in addition to your password."
          />

          {/* 2FA Configuration (shown when enabled) */}
          {twoFactorEnabled && (
            <div className="space-y-5 border-t border-gray-100 pt-5">
              {/* Method Selection */}
              <div className="max-w-xs">
                <FormInput
                  label="Verification Method"
                  name="twoFactorMethod"
                  type="select"
                  value={twoFactorMethod}
                  onChange={handleMethodChange}
                  options={TWO_FACTOR_METHOD_OPTIONS}
                />
              </div>

              {/* Simulated QR Code (for authenticator app) */}
              {twoFactorMethod === 'authenticator' && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Scan QR Code
                  </h3>
                  <p className="text-xs text-gray-500 mb-4">
                    Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                  </p>
                  <div className="flex items-center justify-center">
                    <div className="flex h-40 w-40 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white">
                      <div className="text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-300"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
                        </svg>
                        <p className="mt-1 text-xs text-gray-400">QR Code</p>
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 text-center text-xs text-gray-400">
                    Manual entry key: <span className="font-mono font-medium text-gray-600">MERI-DIAN-WXYZ-1234</span>
                  </p>
                </div>
              )}

              {/* SMS Info */}
              {twoFactorMethod === 'sms' && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    SMS Verification
                  </h3>
                  <p className="text-xs text-gray-500">
                    Verification codes will be sent to your registered phone number.
                    Standard messaging rates may apply.
                  </p>
                  <p className="mt-2 text-xs text-gray-600">
                    Phone: <span className="font-medium">•••-•••-{(currentUser.phone || '0000').slice(-4)}</span>
                  </p>
                </div>
              )}

              {/* Backup Codes */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowBackupCodes((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  <KeyIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
                  {showBackupCodes ? 'Hide Backup Codes' : 'View Backup Codes'}
                </button>

                {showBackupCodes && (
                  <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-900">
                        Backup Codes
                      </h3>
                      <button
                        type="button"
                        onClick={handleCopyBackupCodes}
                        className="inline-flex items-center gap-1.5 rounded-md bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700 transition-colors hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                      >
                        <ClipboardDocumentIcon className="h-3.5 w-3.5" aria-hidden="true" />
                        Copy All
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">
                      Save these codes in a secure location. Each code can only be used once.
                    </p>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {backupCodes.map((code, index) => (
                        <div
                          key={index}
                          className="rounded-md border border-gray-200 bg-white px-3 py-2 text-center font-mono text-sm font-medium text-gray-800"
                        >
                          {code}
                        </div>
                      ))}
                    </div>
                    <p className="mt-3 text-xs text-warning-600">
                      ⚠ These codes will not be shown again. Store them safely.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Login History Section */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 border-b border-gray-200 px-6 py-4">
          <ClockIcon className="h-5 w-5 text-primary-600" aria-hidden="true" />
          <h2 className="text-base font-semibold text-gray-900">Login History</h2>
        </div>
        <div className="px-6 py-5">
          <p className="mb-4 text-xs text-gray-500">
            Recent login activity on your account. If you notice any suspicious activity,
            change your password immediately.
          </p>

          {loginHistory.length === 0 ? (
            <p className="py-4 text-center text-sm text-gray-500">
              No login history available.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                    >
                      Date & Time
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                    >
                      Browser / Device
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                    >
                      IP Address
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                    >
                      Location
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {loginHistory.map((session) => (
                    <tr key={session.id}>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                        {formatDateTime(session.date)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                        {session.browser}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700 font-mono">
                        {session.ip}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                        {session.location}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        <Badge
                          label={session.status === 'active' ? 'Active' : 'Completed'}
                          variant={session.status === 'active' ? 'success' : 'neutral'}
                          size="xs"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Trusted Devices */}
          {security.trustedDevices && security.trustedDevices.length > 0 && (
            <div className="mt-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Trusted Devices</h3>
              <div className="space-y-2">
                {security.trustedDevices.map((device, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5"
                  >
                    <div className="flex items-center gap-3">
                      <DevicePhoneMobileIcon
                        className="h-4 w-4 text-gray-400"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-gray-700">{device}</span>
                    </div>
                    <Badge label="Trusted" variant="success" size="xs" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Note */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
        <p className="text-xs text-gray-500">
          <span className="font-medium text-gray-700">Security Tip:</span>{' '}
          Enable two-factor authentication for maximum account security. Use a unique,
          strong password that you don&apos;t use on other websites. If you suspect
          unauthorized access, change your password immediately and contact support.
        </p>
      </div>
    </div>
  );
}

export default SecurityPage;