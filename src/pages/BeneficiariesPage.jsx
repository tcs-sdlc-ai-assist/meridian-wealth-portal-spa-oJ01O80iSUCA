/**
 * Beneficiaries Management page rendered at /beneficiaries.
 * Displays beneficiaries grouped by type (Primary, Contingent) showing
 * name, relationship, share percentage, and DOB. Add/Edit buttons open
 * Modal with form fields. Validates that primary shares total 100% and
 * contingent shares total 100% before save. Remove button with confirmation.
 * All changes persist via userStore. New users see EmptyState.
 * @module pages/BeneficiariesPage
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  UsersIcon,
  PlusIcon,
  PencilSquareIcon,
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
import { validateRequired, validateName } from '../utils/validators.js';
import { BENEFICIARY_TYPES, RELATIONSHIPS } from '../mock/beneficiaries.js';

/**
 * Beneficiary type options for the form select.
 * @type {Array<{value: string, label: string}>}
 */
const TYPE_OPTIONS = [
  { value: BENEFICIARY_TYPES.PRIMARY, label: 'Primary' },
  { value: BENEFICIARY_TYPES.CONTINGENT, label: 'Contingent' },
];

/**
 * Relationship options for the form select.
 * @type {Array<{value: string, label: string}>}
 */
const RELATIONSHIP_OPTIONS = [
  { value: RELATIONSHIPS.SPOUSE, label: 'Spouse' },
  { value: RELATIONSHIPS.CHILD, label: 'Child' },
  { value: RELATIONSHIPS.SIBLING, label: 'Sibling' },
  { value: RELATIONSHIPS.PARENT, label: 'Parent' },
  { value: RELATIONSHIPS.TRUST, label: 'Trust' },
  { value: RELATIONSHIPS.ESTATE, label: 'Estate' },
  { value: RELATIONSHIPS.OTHER, label: 'Other' },
];

/**
 * Map beneficiary type to badge variant.
 * @type {Record<string, string>}
 */
const TYPE_VARIANT_MAP = {
  [BENEFICIARY_TYPES.PRIMARY]: 'info',
  [BENEFICIARY_TYPES.CONTINGENT]: 'neutral',
};

/**
 * Default form data for add/edit modal.
 * @returns {object}
 */
function getDefaultFormData() {
  return {
    name: '',
    relationship: '',
    type: '',
    sharePercentage: '',
    dateOfBirth: '',
    ssn: '•••-••-0000',
  };
}

/**
 * Default form errors.
 * @returns {object}
 */
function getDefaultFormErrors() {
  return {
    name: null,
    relationship: null,
    type: null,
    sharePercentage: null,
    dateOfBirth: null,
  };
}

/**
 * BeneficiariesPage component for managing beneficiaries.
 * Displays beneficiaries grouped by type with add, edit, and remove functionality.
 * Validates that primary shares total 100% and contingent shares total 100%.
 * Shows EmptyState for users with no beneficiaries.
 * @returns {React.ReactElement} The BeneficiariesPage component
 */
function BeneficiariesPage() {
  const currentUser = useSessionStore((state) => state.currentUser);
  const getBeneficiaries = useUserStore((state) => state.getBeneficiaries);
  const addBeneficiary = useUserStore((state) => state.addBeneficiary);
  const updateBeneficiary = useUserStore((state) => state.updateBeneficiary);
  const removeBeneficiary = useUserStore((state) => state.removeBeneficiary);

  const userId = currentUser?.id;

  // Modal state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [editingBeneficiary, setEditingBeneficiary] = useState(null);
  const [beneficiaryToRemove, setBeneficiaryToRemove] = useState(null);

  // Refresh trigger
  const [refreshKey, setRefreshKey] = useState(0);

  // Form state
  const [formData, setFormData] = useState(getDefaultFormData());
  const [formErrors, setFormErrors] = useState(getDefaultFormErrors());

  /**
   * Get beneficiaries data for the current user.
   */
  const beneficiariesData = useMemo(() => {
    if (!userId) {
      return {
        beneficiaries: [],
        summary: {
          totalBeneficiaries: 0,
          primaryCount: 0,
          contingentCount: 0,
          primaryTotalShare: 0,
          contingentTotalShare: 0,
        },
      };
    }
    return getBeneficiaries(userId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, getBeneficiaries, refreshKey]);

  const { beneficiaries, summary } = beneficiariesData;
  const hasBeneficiaries = beneficiaries.length > 0;

  /**
   * Group beneficiaries by type.
   */
  const groupedBeneficiaries = useMemo(() => {
    const primary = beneficiaries.filter((b) => b.type === BENEFICIARY_TYPES.PRIMARY);
    const contingent = beneficiaries.filter((b) => b.type === BENEFICIARY_TYPES.CONTINGENT);
    return { primary, contingent };
  }, [beneficiaries]);

  /**
   * Handle opening the add modal.
   */
  const handleOpenAddModal = useCallback(() => {
    setEditingBeneficiary(null);
    setFormData(getDefaultFormData());
    setFormErrors(getDefaultFormErrors());
    setIsFormModalOpen(true);
  }, []);

  /**
   * Handle opening the edit modal.
   * @param {object} ben - The beneficiary to edit
   */
  const handleOpenEditModal = useCallback((ben) => {
    setEditingBeneficiary(ben);
    setFormData({
      name: ben.name || '',
      relationship: ben.relationship || '',
      type: ben.type || '',
      sharePercentage: ben.sharePercentage !== undefined ? String(ben.sharePercentage) : '',
      dateOfBirth: ben.dateOfBirth || '',
      ssn: ben.ssn || '•••-••-0000',
    });
    setFormErrors(getDefaultFormErrors());
    setIsFormModalOpen(true);
  }, []);

  /**
   * Handle closing the form modal.
   */
  const handleCloseFormModal = useCallback(() => {
    setIsFormModalOpen(false);
    setEditingBeneficiary(null);
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
   * Validate the form fields.
   * @returns {boolean} True if all fields are valid
   */
  const validateForm = useCallback(() => {
    const errors = {
      name: validateName(formData.name, 'Name'),
      relationship: validateRequired(formData.relationship, 'Relationship'),
      type: validateRequired(formData.type, 'Beneficiary type'),
      sharePercentage: null,
      dateOfBirth: validateRequired(formData.dateOfBirth, 'Date of birth'),
    };

    // Share percentage validation
    const shareError = validateRequired(formData.sharePercentage, 'Share percentage');
    if (shareError) {
      errors.sharePercentage = shareError;
    } else {
      const shareNum = parseFloat(formData.sharePercentage);
      if (isNaN(shareNum) || shareNum <= 0 || shareNum > 100) {
        errors.sharePercentage = 'Share percentage must be between 1 and 100';
      }
    }

    // Date of birth validation
    if (!errors.dateOfBirth) {
      const dob = new Date(formData.dateOfBirth);
      if (isNaN(dob.getTime())) {
        errors.dateOfBirth = 'Please enter a valid date of birth';
      }
    }

    setFormErrors(errors);

    return Object.values(errors).every((error) => error === null);
  }, [formData]);

  /**
   * Validate that shares total 100% for the given type.
   * @param {string} type - The beneficiary type to validate
   * @param {number} newShare - The new share percentage being added/updated
   * @param {string | null} excludeId - The beneficiary ID to exclude (for edits)
   * @returns {string | null} Error message or null if valid
   */
  const validateShareTotal = useCallback(
    (type, newShare, excludeId) => {
      const sameBeneficiaries = beneficiaries.filter(
        (b) => b.type === type && b.id !== excludeId,
      );

      const existingTotal = sameBeneficiaries.reduce(
        (sum, b) => sum + (b.sharePercentage || 0),
        0,
      );

      const total = existingTotal + newShare;

      if (total > 100) {
        const available = 100 - existingTotal;
        return `Total ${type.toLowerCase()} shares would be ${total}%. Maximum available is ${available}%.`;
      }

      return null;
    },
    [beneficiaries],
  );

  /**
   * Handle saving a beneficiary (add or edit).
   */
  const handleSave = useCallback(() => {
    if (!userId) {
      showErrorToast('Unable to save beneficiary. Please sign in again.');
      return;
    }

    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    const shareNum = parseFloat(formData.sharePercentage);
    const excludeId = editingBeneficiary ? editingBeneficiary.id : null;

    // Validate share total
    const shareError = validateShareTotal(formData.type, shareNum, excludeId);
    if (shareError) {
      setFormErrors((prev) => ({ ...prev, sharePercentage: shareError }));
      return;
    }

    const beneficiaryData = {
      name: formData.name.trim(),
      relationship: formData.relationship,
      type: formData.type,
      sharePercentage: shareNum,
      dateOfBirth: formData.dateOfBirth,
      ssn: formData.ssn || '•••-••-0000',
    };

    let success = false;

    if (editingBeneficiary) {
      // Update existing beneficiary
      success = updateBeneficiary(userId, editingBeneficiary.id, beneficiaryData);

      if (success) {
        showSuccessToast(`${formData.name.trim()} updated successfully.`);
      } else {
        showErrorToast('Failed to update beneficiary. Please try again.');
      }
    } else {
      // Add new beneficiary
      success = addBeneficiary(userId, beneficiaryData);

      if (success) {
        showSuccessToast(`${formData.name.trim()} added as ${formData.type.toLowerCase()} beneficiary.`);
      } else {
        showErrorToast('Failed to add beneficiary. Please try again.');
      }
    }

    if (success) {
      setIsFormModalOpen(false);
      setEditingBeneficiary(null);
      setRefreshKey((prev) => prev + 1);
    }
  }, [
    userId,
    formData,
    editingBeneficiary,
    validateForm,
    validateShareTotal,
    addBeneficiary,
    updateBeneficiary,
  ]);

  /**
   * Handle initiating beneficiary removal.
   * @param {object} ben - The beneficiary to remove
   */
  const handleInitiateRemove = useCallback((ben) => {
    setBeneficiaryToRemove(ben);
    setIsConfirmModalOpen(true);
  }, []);

  /**
   * Handle closing the confirmation modal.
   */
  const handleCloseConfirmModal = useCallback(() => {
    setIsConfirmModalOpen(false);
    setBeneficiaryToRemove(null);
  }, []);

  /**
   * Handle confirming beneficiary removal.
   */
  const handleConfirmRemove = useCallback(() => {
    if (!userId || !beneficiaryToRemove) {
      showErrorToast('Unable to remove beneficiary. Please try again.');
      return;
    }

    const success = removeBeneficiary(userId, beneficiaryToRemove.id);

    if (success) {
      showSuccessToast(`${beneficiaryToRemove.name} has been removed.`);
      setRefreshKey((prev) => prev + 1);
    } else {
      showErrorToast('Failed to remove beneficiary. Please try again.');
    }

    setIsConfirmModalOpen(false);
    setBeneficiaryToRemove(null);
  }, [userId, beneficiaryToRemove, removeBeneficiary]);

  /**
   * Render a beneficiary group section.
   * @param {string} title - Section title
   * @param {string} type - Beneficiary type
   * @param {Array} items - Array of beneficiaries
   * @param {number} totalShare - Total share percentage for this type
   * @returns {React.ReactElement}
   */
  const renderGroup = (title, type, items, totalShare) => {
    if (items.length === 0) {
      return null;
    }

    const isComplete = totalShare === 100;
    const shareColorClass = isComplete ? 'text-success-600' : 'text-warning-600';

    return (
      <div key={type} className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
            <Badge
              label={`${items.length}`}
              variant={TYPE_VARIANT_MAP[type] || 'neutral'}
              size="xs"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium ${shareColorClass}`}>
              Total: {totalShare}%
            </span>
            {isComplete ? (
              <Badge label="Complete" variant="success" size="xs" />
            ) : (
              <Badge label={`${100 - totalShare}% remaining`} variant="pending" size="xs" />
            )}
          </div>
        </div>

        <div className="space-y-3">
          {items.map((ben) => (
            <div
              key={ben.id}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100">
                    <UsersIcon
                      className="h-6 w-6 text-primary-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-gray-900 truncate">
                        {ben.name}
                      </h4>
                      <Badge
                        label={ben.type}
                        variant={TYPE_VARIANT_MAP[ben.type] || 'neutral'}
                        size="xs"
                      />
                    </div>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {ben.relationship}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-gray-400">
                      <span>Share: <span className="font-medium text-gray-700">{ben.sharePercentage}%</span></span>
                      <span className="text-gray-300">•</span>
                      <span>DOB: {formatDate(ben.dateOfBirth)}</span>
                      <span className="text-gray-300">•</span>
                      <span>SSN: {ben.ssn}</span>
                    </div>
                  </div>
                </div>
                <div className="ml-4 flex flex-shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(ben)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    aria-label={`Edit ${ben.name}`}
                  >
                    <PencilSquareIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInitiateRemove(ben)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-danger-600 shadow-sm transition-colors hover:bg-danger-50 hover:border-danger-300 focus:outline-none focus:ring-2 focus:ring-danger-500 focus:ring-offset-2"
                    aria-label={`Remove ${ben.name}`}
                  >
                    <TrashIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Beneficiaries</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your account beneficiaries and their share allocations
          </p>
        </div>
        {hasBeneficiaries && (
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <PlusIcon className="h-4 w-4" aria-hidden="true" />
            Add Beneficiary
          </button>
        )}
      </div>

      {/* Empty State */}
      {!hasBeneficiaries && (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <EmptyState
            icon={<UsersIcon className="h-12 w-12" />}
            title="No Beneficiaries"
            message="Add beneficiaries to designate who will receive your account assets. Primary beneficiaries receive assets first, and contingent beneficiaries receive assets if primary beneficiaries are unavailable."
            actionLabel="Add Beneficiary"
            onAction={handleOpenAddModal}
          />
        </div>
      )}

      {/* Beneficiary Summary */}
      {hasBeneficiaries && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Total Beneficiaries
            </p>
            <p className="mt-1 text-lg font-bold text-gray-900">
              {summary.totalBeneficiaries}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Primary
            </p>
            <p className="mt-1 text-lg font-bold text-gray-900">
              {summary.primaryCount}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Primary Shares
            </p>
            <p
              className={`mt-1 text-lg font-bold ${
                summary.primaryTotalShare === 100 ? 'text-success-600' : 'text-warning-600'
              }`}
            >
              {summary.primaryTotalShare}%
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Contingent Shares
            </p>
            <p
              className={`mt-1 text-lg font-bold ${
                summary.contingentTotalShare === 100 ? 'text-success-600' : 'text-warning-600'
              }`}
            >
              {summary.contingentTotalShare}%
            </p>
          </div>
        </div>
      )}

      {/* Beneficiary Groups */}
      {hasBeneficiaries && (
        <div className="space-y-6">
          {renderGroup(
            'Primary Beneficiaries',
            BENEFICIARY_TYPES.PRIMARY,
            groupedBeneficiaries.primary,
            summary.primaryTotalShare,
          )}
          {renderGroup(
            'Contingent Beneficiaries',
            BENEFICIARY_TYPES.CONTINGENT,
            groupedBeneficiaries.contingent,
            summary.contingentTotalShare,
          )}
        </div>
      )}

      {/* Add/Edit Beneficiary Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        title={editingBeneficiary ? 'Edit Beneficiary' : 'Add Beneficiary'}
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            {editingBeneficiary
              ? 'Update the beneficiary details below.'
              : 'Enter the beneficiary details below. Primary and contingent shares must each total 100%.'}
          </p>

          <FormInput
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
            error={formErrors.name}
            placeholder="e.g., Jane Doe"
            required
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInput
              label="Relationship"
              name="relationship"
              type="select"
              value={formData.relationship}
              onChange={handleFormChange}
              error={formErrors.relationship}
              options={RELATIONSHIP_OPTIONS}
              placeholder="Select relationship"
              required
            />

            <FormInput
              label="Beneficiary Type"
              name="type"
              type="select"
              value={formData.type}
              onChange={handleFormChange}
              error={formErrors.type}
              options={TYPE_OPTIONS}
              placeholder="Select type"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInput
              label="Share Percentage"
              name="sharePercentage"
              type="number"
              value={formData.sharePercentage}
              onChange={handleFormChange}
              error={formErrors.sharePercentage}
              placeholder="e.g., 50"
              required
            />

            <FormInput
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleFormChange}
              error={formErrors.dateOfBirth}
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4">
            <button
              type="button"
              onClick={handleCloseFormModal}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              {editingBeneficiary ? 'Save Changes' : 'Add Beneficiary'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Remove Confirmation Modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={handleCloseConfirmModal}
        title="Remove Beneficiary"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to remove{' '}
            <span className="font-semibold text-gray-900">
              {beneficiaryToRemove?.name}
            </span>{' '}
            as a {beneficiaryToRemove?.type?.toLowerCase()} beneficiary?
          </p>
          <p className="text-xs text-gray-500">
            This action cannot be undone. Removing this beneficiary may affect
            the total share allocation for {beneficiaryToRemove?.type?.toLowerCase()} beneficiaries.
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
              Remove Beneficiary
            </button>
          </div>
        </div>
      </Modal>

      {/* Footer Note */}
      {hasBeneficiaries && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-xs text-gray-500">
            <span className="font-medium text-gray-700">Important:</span>{' '}
            Primary beneficiaries receive your account assets first. Contingent
            beneficiaries receive assets only if all primary beneficiaries are
            unable to receive them. Each group (Primary and Contingent) should
            have shares totaling 100%. Please review your beneficiary designations
            periodically to ensure they reflect your current wishes.
          </p>
        </div>
      )}
    </div>
  );
}

export default BeneficiariesPage;