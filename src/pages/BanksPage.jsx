/**
 * Bank Management page rendered at /bank-management.
 * Displays linked bank accounts in a card list showing bank name,
 * account type, last 4 digits, status (Verified/Pending badge),
 * and linked date. Add Bank button opens a Modal with form fields.
 * On add: new bank appears as 'Pending Verification', transitions
 * to 'Verified' after 3-second setTimeout. Remove button with confirmation.
 * All changes persist via userStore. New users see EmptyState.
 * @module pages/BanksPage
 */

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  BuildingLibraryIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { useSessionStore } from '../store/sessionStore.js';
import { useUserStore } from '../store/userStore.js';
import Modal from '../components/Modal.jsx';
import FormInput from '../components/FormInput.jsx';
import Badge from '../components/Badge.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { showSuccessToast, showErrorToast } from '../components/Toast.jsx';
import { formatDate } from '../utils/formatters.js';
import { validateRequired } from '../utils/validators.js';
import { BANK_ACCOUNT_TYPES, BANK_LINK_STATUS } from '../mock/banks.js';

/**
 * Account type options for the add bank form.
 * @type {Array<{value: string, label: string}>}
 */
const ACCOUNT_TYPE_OPTIONS = [
  { value: BANK_ACCOUNT_TYPES.CHECKING, label: 'Checking' },
  { value: BANK_ACCOUNT_TYPES.SAVINGS, label: 'Savings' },
];

/**
 * Map bank link status to badge variant.
 * @type {Record<string, string>}
 */
const STATUS_VARIANT_MAP = {
  [BANK_LINK_STATUS.VERIFIED]: 'success',
  [BANK_LINK_STATUS.PENDING]: 'pending',
  'Pending Verification': 'pending',
};

/**
 * BanksPage component for managing linked bank accounts.
 * Displays a list of linked banks with add and remove functionality.
 * New banks appear as 'Pending Verification' and transition to 'Verified'
 * after a 3-second delay. Shows EmptyState for users with no linked banks.
 * @returns {React.ReactElement} The BanksPage component
 */
function BanksPage() {
  const currentUser = useSessionStore((state) => state.currentUser);
  const getBanks = useUserStore((state) => state.getBanks);
  const addBank = useUserStore((state) => state.addBank);
  const removeBank = useUserStore((state) => state.removeBank);

  const userId = currentUser?.id;

  // Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [bankToRemove, setBankToRemove] = useState(null);

  // Refresh trigger
  const [refreshKey, setRefreshKey] = useState(0);

  // Track pending verification timers
  const pendingTimersRef = useRef({});

  // Track banks that are currently in pending verification state
  const [pendingBankIds, setPendingBankIds] = useState({});

  // Add bank form state
  const [formData, setFormData] = useState({
    bankName: '',
    accountType: '',
    routingNumber: '',
    accountNumber: '',
  });
  const [formErrors, setFormErrors] = useState({
    bankName: null,
    accountType: null,
    routingNumber: null,
    accountNumber: null,
  });

  /**
   * Get banks data for the current user.
   */
  const banksData = useMemo(() => {
    if (!userId) {
      return {
        banks: [],
        summary: {
          totalBanks: 0,
          verifiedCount: 0,
          pendingCount: 0,
          checkingCount: 0,
          savingsCount: 0,
        },
      };
    }
    return getBanks(userId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, getBanks, refreshKey]);

  const { banks, summary } = banksData;
  const hasBanks = banks.length > 0;

  /**
   * Cleanup pending timers on unmount.
   */
  useEffect(() => {
    return () => {
      Object.values(pendingTimersRef.current).forEach((timerId) => {
        clearTimeout(timerId);
      });
    };
  }, []);

  /**
   * Handle opening the add bank modal.
   */
  const handleOpenAddModal = useCallback(() => {
    setFormData({
      bankName: '',
      accountType: '',
      routingNumber: '',
      accountNumber: '',
    });
    setFormErrors({
      bankName: null,
      accountType: null,
      routingNumber: null,
      accountNumber: null,
    });
    setIsAddModalOpen(true);
  }, []);

  /**
   * Handle closing the add bank modal.
   */
  const handleCloseAddModal = useCallback(() => {
    setIsAddModalOpen(false);
  }, []);

  /**
   * Handle form input change.
   * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement>} event
   */
  const handleFormChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: null }));
  }, []);

  /**
   * Validate the add bank form.
   * @returns {boolean} True if all fields are valid
   */
  const validateForm = useCallback(() => {
    const errors = {
      bankName: validateRequired(formData.bankName, 'Bank name'),
      accountType: validateRequired(formData.accountType, 'Account type'),
      routingNumber: null,
      accountNumber: null,
    };

    // Routing number validation
    const routingError = validateRequired(formData.routingNumber, 'Routing number');
    if (routingError) {
      errors.routingNumber = routingError;
    } else {
      const routingClean = formData.routingNumber.replace(/\D/g, '');
      if (routingClean.length !== 9) {
        errors.routingNumber = 'Routing number must be 9 digits';
      }
    }

    // Account number validation
    const accountError = validateRequired(formData.accountNumber, 'Account number');
    if (accountError) {
      errors.accountNumber = accountError;
    } else {
      const accountClean = formData.accountNumber.replace(/\D/g, '');
      if (accountClean.length < 4 || accountClean.length > 17) {
        errors.accountNumber = 'Account number must be between 4 and 17 digits';
      }
    }

    setFormErrors(errors);

    return Object.values(errors).every((error) => error === null);
  }, [formData]);

  /**
   * Handle adding a new bank.
   */
  const handleAddBank = useCallback(() => {
    if (!userId) {
      showErrorToast('Unable to add bank. Please sign in again.');
      return;
    }

    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    const accountClean = formData.accountNumber.replace(/\D/g, '');
    const routingClean = formData.routingNumber.replace(/\D/g, '');
    const last4 = accountClean.slice(-4);
    const maskedRouting = `•••••${routingClean.slice(-4)}`;
    const now = new Date().toISOString();

    const newBank = {
      bankName: formData.bankName.trim(),
      accountType: formData.accountType,
      last4Digits: last4,
      routingNumber: maskedRouting,
      status: BANK_LINK_STATUS.PENDING,
      linkedDate: now,
    };

    const success = addBank(userId, newBank);

    if (success) {
      showSuccessToast(`${formData.bankName.trim()} linked successfully. Verification in progress.`);
      setIsAddModalOpen(false);
      setRefreshKey((prev) => prev + 1);

      // Get the updated banks to find the newly added bank
      const updatedBanks = getBanks(userId);
      const addedBank = updatedBanks.banks.find(
        (b) =>
          b.bankName === formData.bankName.trim() &&
          b.last4Digits === last4 &&
          b.linkedDate === now,
      );

      if (addedBank) {
        setPendingBankIds((prev) => ({ ...prev, [addedBank.id]: true }));

        // Set a 3-second timer to transition to Verified
        const timerId = setTimeout(() => {
          // Update the bank status in storage
          const allBanksData = getBanks(userId);
          const bankToUpdate = allBanksData.banks.find((b) => b.id === addedBank.id);

          if (bankToUpdate && bankToUpdate.status === BANK_LINK_STATUS.PENDING) {
            // Remove and re-add with verified status
            removeBank(userId, addedBank.id);
            addBank(userId, {
              id: addedBank.id,
              bankName: addedBank.bankName,
              accountType: addedBank.accountType,
              last4Digits: addedBank.last4Digits,
              routingNumber: addedBank.routingNumber,
              status: BANK_LINK_STATUS.VERIFIED,
              linkedDate: addedBank.linkedDate,
            });

            setPendingBankIds((prev) => {
              const updated = { ...prev };
              delete updated[addedBank.id];
              return updated;
            });

            setRefreshKey((prev) => prev + 1);
            showSuccessToast(`${addedBank.bankName} has been verified.`);
          }

          delete pendingTimersRef.current[addedBank.id];
        }, 3000);

        pendingTimersRef.current[addedBank.id] = timerId;
      }
    } else {
      showErrorToast('Failed to link bank account. Please try again.');
    }
  }, [userId, formData, validateForm, addBank, getBanks, removeBank]);

  /**
   * Handle initiating bank removal.
   * @param {object} bank - The bank to remove
   */
  const handleInitiateRemove = useCallback((bank) => {
    setBankToRemove(bank);
    setIsConfirmModalOpen(true);
  }, []);

  /**
   * Handle closing the confirmation modal.
   */
  const handleCloseConfirmModal = useCallback(() => {
    setIsConfirmModalOpen(false);
    setBankToRemove(null);
  }, []);

  /**
   * Handle confirming bank removal.
   */
  const handleConfirmRemove = useCallback(() => {
    if (!userId || !bankToRemove) {
      showErrorToast('Unable to remove bank. Please try again.');
      return;
    }

    // Clear any pending timer for this bank
    if (pendingTimersRef.current[bankToRemove.id]) {
      clearTimeout(pendingTimersRef.current[bankToRemove.id]);
      delete pendingTimersRef.current[bankToRemove.id];
    }

    const success = removeBank(userId, bankToRemove.id);

    if (success) {
      showSuccessToast(`${bankToRemove.bankName} has been removed.`);
      setPendingBankIds((prev) => {
        const updated = { ...prev };
        delete updated[bankToRemove.id];
        return updated;
      });
      setRefreshKey((prev) => prev + 1);
    } else {
      showErrorToast('Failed to remove bank account. Please try again.');
    }

    setIsConfirmModalOpen(false);
    setBankToRemove(null);
  }, [userId, bankToRemove, removeBank]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bank Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your linked bank accounts for transfers and deposits
          </p>
        </div>
        {hasBanks && (
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <PlusIcon className="h-4 w-4" aria-hidden="true" />
            Add Bank
          </button>
        )}
      </div>

      {/* Empty State */}
      {!hasBanks && (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <EmptyState
            icon={<BuildingLibraryIcon className="h-12 w-12" />}
            title="No Linked Banks"
            message="Link a bank account to enable transfers, deposits, and withdrawals. Your bank information is encrypted and secure."
            actionLabel="Add Bank Account"
            onAction={handleOpenAddModal}
          />
        </div>
      )}

      {/* Bank Summary */}
      {hasBanks && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Total Banks
            </p>
            <p className="mt-1 text-lg font-bold text-gray-900">
              {summary.totalBanks}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Verified
            </p>
            <p className="mt-1 text-lg font-bold text-success-600">
              {summary.verifiedCount}
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
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Checking / Savings
            </p>
            <p className="mt-1 text-lg font-bold text-gray-900">
              {summary.checkingCount} / {summary.savingsCount}
            </p>
          </div>
        </div>
      )}

      {/* Bank Cards */}
      {hasBanks && (
        <div className="space-y-4">
          {banks.map((bank) => {
            const displayStatus = pendingBankIds[bank.id]
              ? 'Pending Verification'
              : bank.status;
            const badgeVariant = STATUS_VARIANT_MAP[displayStatus] || 'neutral';

            return (
              <div
                key={bank.id}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100">
                      <BuildingLibraryIcon
                        className="h-6 w-6 text-primary-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {bank.bankName}
                        </h3>
                        <Badge
                          label={displayStatus}
                          variant={badgeVariant}
                          size="xs"
                        />
                      </div>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {bank.accountType} •••• {bank.last4Digits}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-gray-400">
                        <span>Routing: {bank.routingNumber}</span>
                        <span className="text-gray-300">•</span>
                        <span>Linked: {formatDate(bank.linkedDate)}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleInitiateRemove(bank)}
                    className="ml-4 inline-flex flex-shrink-0 items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-danger-600 shadow-sm transition-colors hover:bg-danger-50 hover:border-danger-300 focus:outline-none focus:ring-2 focus:ring-danger-500 focus:ring-offset-2"
                    aria-label={`Remove ${bank.bankName}`}
                  >
                    <TrashIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Bank Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        title="Link Bank Account"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Enter your bank account details to link it to your Meridian account.
            Verification typically takes a few seconds.
          </p>

          <FormInput
            label="Bank Name"
            name="bankName"
            value={formData.bankName}
            onChange={handleFormChange}
            error={formErrors.bankName}
            placeholder="e.g., Chase Bank"
            required
          />

          <FormInput
            label="Account Type"
            name="accountType"
            type="select"
            value={formData.accountType}
            onChange={handleFormChange}
            error={formErrors.accountType}
            options={ACCOUNT_TYPE_OPTIONS}
            placeholder="Select account type"
            required
          />

          <FormInput
            label="Routing Number"
            name="routingNumber"
            value={formData.routingNumber}
            onChange={handleFormChange}
            error={formErrors.routingNumber}
            placeholder="9-digit routing number"
            required
          />

          <FormInput
            label="Account Number"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleFormChange}
            error={formErrors.accountNumber}
            placeholder="Your bank account number"
            required
          />

          <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4">
            <button
              type="button"
              onClick={handleCloseAddModal}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddBank}
              className="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Link Bank Account
            </button>
          </div>
        </div>
      </Modal>

      {/* Remove Confirmation Modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={handleCloseConfirmModal}
        title="Remove Bank Account"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to remove{' '}
            <span className="font-semibold text-gray-900">
              {bankToRemove?.bankName}
            </span>{' '}
            ({bankToRemove?.accountType} •••• {bankToRemove?.last4Digits}) from your
            linked accounts?
          </p>
          <p className="text-xs text-gray-500">
            This action cannot be undone. You will need to re-link this bank account
            if you want to use it again.
          </p>

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
              onClick={handleConfirmRemove}
              className="inline-flex items-center rounded-md bg-danger-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-danger-700 focus:outline-none focus:ring-2 focus:ring-danger-500 focus:ring-offset-2"
            >
              Remove Bank
            </button>
          </div>
        </div>
      </Modal>

      {/* Footer Note */}
      {hasBanks && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-xs text-gray-500">
            <span className="font-medium text-gray-700">Security Note:</span>{' '}
            Your bank account information is encrypted and stored securely. We use
            industry-standard encryption to protect your financial data. Meridian
            will never share your bank details with third parties.
          </p>
        </div>
      )}
    </div>
  );
}

export default BanksPage;