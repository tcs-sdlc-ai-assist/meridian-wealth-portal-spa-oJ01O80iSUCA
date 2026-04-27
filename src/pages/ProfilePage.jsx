/**
 * Profile management page rendered at /profile.
 * Displays user details in sections: Personal Information, Address,
 * Employment, and Tax Information. Each section has an Edit button
 * that toggles fields to editable FormInputs. Save validates and
 * persists changes via userStore.updateUser. Cancel reverts changes.
 * Shows inline validation errors. Styled with Tailwind card sections.
 * @module pages/ProfilePage
 */

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  UserCircleIcon,
  HomeIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  PencilSquareIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useSessionStore } from '../store/sessionStore.js';
import { useUserStore } from '../store/userStore.js';
import FormInput from '../components/FormInput.jsx';
import { showSuccessToast, showErrorToast } from '../components/Toast.jsx';
import { formatDate, formatPhoneNumber } from '../utils/formatters.js';
import {
  validateName,
  validateEmail,
  validatePhone,
  validateRequired,
} from '../utils/validators.js';

/**
 * US state options for the address state select.
 * @type {Array<{value: string, label: string}>}
 */
const US_STATE_OPTIONS = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
  { value: 'DC', label: 'District of Columbia' },
];

/**
 * Employment status options.
 * @type {Array<{value: string, label: string}>}
 */
const EMPLOYMENT_STATUS_OPTIONS = [
  { value: 'Employed', label: 'Employed' },
  { value: 'Self-Employed', label: 'Self-Employed' },
  { value: 'Retired', label: 'Retired' },
  { value: 'Unemployed', label: 'Unemployed' },
  { value: 'Student', label: 'Student' },
];

/**
 * Tax filing status options.
 * @type {Array<{value: string, label: string}>}
 */
const TAX_FILING_STATUS_OPTIONS = [
  { value: 'Single', label: 'Single' },
  { value: 'Married Filing Jointly', label: 'Married Filing Jointly' },
  { value: 'Married Filing Separately', label: 'Married Filing Separately' },
  { value: 'Head of Household', label: 'Head of Household' },
  { value: 'Qualifying Widow(er)', label: 'Qualifying Widow(er)' },
];

/**
 * Tax status options.
 * @type {Array<{value: string, label: string}>}
 */
const TAX_STATUS_OPTIONS = [
  { value: 'US Citizen', label: 'US Citizen' },
  { value: 'Resident Alien', label: 'Resident Alien' },
  { value: 'Non-Resident Alien', label: 'Non-Resident Alien' },
];

/**
 * Income range options.
 * @type {Array<{value: string, label: string}>}
 */
const INCOME_RANGE_OPTIONS = [
  { value: '$0 - $25,000', label: '$0 - $25,000' },
  { value: '$25,000 - $50,000', label: '$25,000 - $50,000' },
  { value: '$50,000 - $75,000', label: '$50,000 - $75,000' },
  { value: '$75,000 - $100,000', label: '$75,000 - $100,000' },
  { value: '$100,000 - $150,000', label: '$100,000 - $150,000' },
  { value: '$150,000 - $200,000', label: '$150,000 - $200,000' },
  { value: '$200,000 - $500,000', label: '$200,000 - $500,000' },
  { value: '$500,000+', label: '$500,000+' },
];

/**
 * Display a read-only field with label and value.
 * @param {object} props - Component props
 * @param {string} props.label - Field label
 * @param {string} props.value - Field value
 * @returns {React.ReactElement}
 */
function ReadOnlyField({ label, value }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-gray-500">{label}</span>
      <span className="text-sm text-gray-900">{value || '—'}</span>
    </div>
  );
}

/**
 * Section header with edit/save/cancel buttons.
 * @param {object} props - Component props
 * @param {React.ReactNode} props.icon - Icon element
 * @param {string} props.title - Section title
 * @param {boolean} props.isEditing - Whether the section is in edit mode
 * @param {function} props.onEdit - Callback to enter edit mode
 * @param {function} props.onSave - Callback to save changes
 * @param {function} props.onCancel - Callback to cancel editing
 * @returns {React.ReactElement}
 */
function SectionHeader({ icon, title, isEditing, onEdit, onSave, onCancel }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
      <div className="flex items-center gap-3">
        {icon}
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="flex items-center gap-2">
        {isEditing ? (
          <>
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <XMarkIcon className="h-3.5 w-3.5" aria-hidden="true" />
              Cancel
            </button>
            <button
              type="button"
              onClick={onSave}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
              Save
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <PencilSquareIcon className="h-3.5 w-3.5" aria-hidden="true" />
            Edit
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * ProfilePage component for displaying and editing user profile information.
 * Shows sections for Personal Information, Address, Employment, and Tax Information.
 * Each section can be independently edited with inline validation.
 * @returns {React.ReactElement} The ProfilePage component
 */
function ProfilePage() {
  const currentUser = useSessionStore((state) => state.currentUser);
  const updateUser = useUserStore((state) => state.updateUser);

  const userId = currentUser?.id;

  // Track which sections are in edit mode
  const [editingSection, setEditingSection] = useState(null);

  // Personal Information state
  const [personalData, setPersonalData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
  });
  const [personalErrors, setPersonalErrors] = useState({
    firstName: null,
    lastName: null,
    email: null,
    phone: null,
  });

  // Address state
  const [addressData, setAddressData] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
  });
  const [addressErrors, setAddressErrors] = useState({
    street: null,
    city: null,
    state: null,
    zip: null,
  });

  // Employment state
  const [employmentData, setEmploymentData] = useState({
    status: '',
    employer: '',
    occupation: '',
    yearsEmployed: '',
  });
  const [employmentErrors, setEmploymentErrors] = useState({
    status: null,
    employer: null,
    occupation: null,
  });

  // Tax Information state
  const [taxData, setTaxData] = useState({
    taxStatus: '',
    taxFilingStatus: '',
    incomeRange: '',
  });
  const [taxErrors, setTaxErrors] = useState({
    taxStatus: null,
    taxFilingStatus: null,
    incomeRange: null,
  });

  /**
   * Initialize form data from current user.
   */
  useEffect(() => {
    if (currentUser) {
      setPersonalData({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        dateOfBirth: currentUser.dateOfBirth || '',
      });
      setAddressData({
        street: currentUser.address?.street || '',
        city: currentUser.address?.city || '',
        state: currentUser.address?.state || '',
        zip: currentUser.address?.zip || '',
      });
      setEmploymentData({
        status: currentUser.employment?.status || '',
        employer: currentUser.employment?.employer || '',
        occupation: currentUser.employment?.occupation || '',
        yearsEmployed: currentUser.employment?.yearsEmployed !== undefined
          ? String(currentUser.employment.yearsEmployed)
          : '',
      });
      setTaxData({
        taxStatus: currentUser.taxStatus || '',
        taxFilingStatus: currentUser.taxFilingStatus || '',
        incomeRange: currentUser.incomeRange || '',
      });
    }
  }, [currentUser]);

  /**
   * Reset a section's form data to current user values.
   * @param {string} section - The section to reset
   */
  const resetSection = useCallback(
    (section) => {
      if (!currentUser) {
        return;
      }

      switch (section) {
        case 'personal':
          setPersonalData({
            firstName: currentUser.firstName || '',
            lastName: currentUser.lastName || '',
            email: currentUser.email || '',
            phone: currentUser.phone || '',
            dateOfBirth: currentUser.dateOfBirth || '',
          });
          setPersonalErrors({ firstName: null, lastName: null, email: null, phone: null });
          break;
        case 'address':
          setAddressData({
            street: currentUser.address?.street || '',
            city: currentUser.address?.city || '',
            state: currentUser.address?.state || '',
            zip: currentUser.address?.zip || '',
          });
          setAddressErrors({ street: null, city: null, state: null, zip: null });
          break;
        case 'employment':
          setEmploymentData({
            status: currentUser.employment?.status || '',
            employer: currentUser.employment?.employer || '',
            occupation: currentUser.employment?.occupation || '',
            yearsEmployed: currentUser.employment?.yearsEmployed !== undefined
              ? String(currentUser.employment.yearsEmployed)
              : '',
          });
          setEmploymentErrors({ status: null, employer: null, occupation: null });
          break;
        case 'tax':
          setTaxData({
            taxStatus: currentUser.taxStatus || '',
            taxFilingStatus: currentUser.taxFilingStatus || '',
            incomeRange: currentUser.incomeRange || '',
          });
          setTaxErrors({ taxStatus: null, taxFilingStatus: null, incomeRange: null });
          break;
        default:
          break;
      }
    },
    [currentUser],
  );

  /**
   * Handle entering edit mode for a section.
   * @param {string} section - The section to edit
   */
  const handleEdit = useCallback((section) => {
    setEditingSection(section);
  }, []);

  /**
   * Handle cancelling edit mode for a section.
   */
  const handleCancel = useCallback(() => {
    if (editingSection) {
      resetSection(editingSection);
    }
    setEditingSection(null);
  }, [editingSection, resetSection]);

  /**
   * Handle personal data input change.
   * @param {React.ChangeEvent<HTMLInputElement>} event
   */
  const handlePersonalChange = useCallback((event) => {
    const { name, value } = event.target;
    setPersonalData((prev) => ({ ...prev, [name]: value }));
    setPersonalErrors((prev) => ({ ...prev, [name]: null }));
  }, []);

  /**
   * Handle address data input change.
   * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement>} event
   */
  const handleAddressChange = useCallback((event) => {
    const { name, value } = event.target;
    setAddressData((prev) => ({ ...prev, [name]: value }));
    setAddressErrors((prev) => ({ ...prev, [name]: null }));
  }, []);

  /**
   * Handle employment data input change.
   * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement>} event
   */
  const handleEmploymentChange = useCallback((event) => {
    const { name, value } = event.target;
    setEmploymentData((prev) => ({ ...prev, [name]: value }));
    setEmploymentErrors((prev) => ({ ...prev, [name]: null }));
  }, []);

  /**
   * Handle tax data input change.
   * @param {React.ChangeEvent<HTMLSelectElement>} event
   */
  const handleTaxChange = useCallback((event) => {
    const { name, value } = event.target;
    setTaxData((prev) => ({ ...prev, [name]: value }));
    setTaxErrors((prev) => ({ ...prev, [name]: null }));
  }, []);

  /**
   * Validate and save personal information.
   */
  const handleSavePersonal = useCallback(() => {
    if (!userId) {
      return;
    }

    const errors = {
      firstName: validateName(personalData.firstName, 'First name'),
      lastName: validateName(personalData.lastName, 'Last name'),
      email: validateEmail(personalData.email),
      phone: validatePhone(personalData.phone),
    };

    setPersonalErrors(errors);

    const hasErrors = Object.values(errors).some((error) => error !== null);
    if (hasErrors) {
      return;
    }

    const success = updateUser(userId, {
      firstName: personalData.firstName.trim(),
      lastName: personalData.lastName.trim(),
      email: personalData.email.trim(),
      phone: personalData.phone.replace(/\D/g, ''),
    });

    if (success) {
      showSuccessToast('Personal information updated successfully');
      setEditingSection(null);
    } else {
      showErrorToast('Failed to update personal information. Please try again.');
    }
  }, [userId, personalData, updateUser]);

  /**
   * Validate and save address information.
   */
  const handleSaveAddress = useCallback(() => {
    if (!userId) {
      return;
    }

    const errors = {
      street: validateRequired(addressData.street, 'Street address'),
      city: validateRequired(addressData.city, 'City'),
      state: validateRequired(addressData.state, 'State'),
      zip: validateRequired(addressData.zip, 'ZIP code'),
    };

    // Additional ZIP validation
    if (!errors.zip) {
      const zipClean = String(addressData.zip).trim();
      const zipRegex = /^\d{5}(-\d{4})?$/;
      if (!zipRegex.test(zipClean)) {
        errors.zip = 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)';
      }
    }

    setAddressErrors(errors);

    const hasErrors = Object.values(errors).some((error) => error !== null);
    if (hasErrors) {
      return;
    }

    const success = updateUser(userId, {
      address: {
        street: addressData.street.trim(),
        city: addressData.city.trim(),
        state: addressData.state.trim(),
        zip: addressData.zip.trim(),
        country: currentUser?.address?.country || 'US',
      },
    });

    if (success) {
      showSuccessToast('Address updated successfully');
      setEditingSection(null);
    } else {
      showErrorToast('Failed to update address. Please try again.');
    }
  }, [userId, addressData, updateUser, currentUser]);

  /**
   * Validate and save employment information.
   */
  const handleSaveEmployment = useCallback(() => {
    if (!userId) {
      return;
    }

    const errors = {
      status: validateRequired(employmentData.status, 'Employment status'),
      employer: null,
      occupation: null,
    };

    setEmploymentErrors(errors);

    const hasErrors = Object.values(errors).some((error) => error !== null);
    if (hasErrors) {
      return;
    }

    const yearsEmployed = employmentData.yearsEmployed
      ? parseInt(employmentData.yearsEmployed, 10)
      : 0;

    const success = updateUser(userId, {
      employment: {
        status: employmentData.status.trim(),
        employer: employmentData.employer.trim(),
        occupation: employmentData.occupation.trim(),
        yearsEmployed: isNaN(yearsEmployed) ? 0 : yearsEmployed,
      },
    });

    if (success) {
      showSuccessToast('Employment information updated successfully');
      setEditingSection(null);
    } else {
      showErrorToast('Failed to update employment information. Please try again.');
    }
  }, [userId, employmentData, updateUser]);

  /**
   * Validate and save tax information.
   */
  const handleSaveTax = useCallback(() => {
    if (!userId) {
      return;
    }

    const errors = {
      taxStatus: validateRequired(taxData.taxStatus, 'Tax status'),
      taxFilingStatus: validateRequired(taxData.taxFilingStatus, 'Filing status'),
      incomeRange: null,
    };

    setTaxErrors(errors);

    const hasErrors = Object.values(errors).some((error) => error !== null);
    if (hasErrors) {
      return;
    }

    const success = updateUser(userId, {
      taxStatus: taxData.taxStatus.trim(),
      taxFilingStatus: taxData.taxFilingStatus.trim(),
      incomeRange: taxData.incomeRange.trim(),
    });

    if (success) {
      showSuccessToast('Tax information updated successfully');
      setEditingSection(null);
    } else {
      showErrorToast('Failed to update tax information. Please try again.');
    }
  }, [userId, taxData, updateUser]);

  /**
   * Get the full name of the user.
   */
  const fullName = useMemo(() => {
    if (!currentUser) {
      return '';
    }
    return `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="mt-1 text-sm text-gray-500">
            Unable to load profile information.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage your personal information
        </p>
      </div>

      {/* Profile Summary Banner */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-xl font-bold text-primary-700">
            {(currentUser.firstName || '').charAt(0).toUpperCase()}
            {(currentUser.lastName || '').charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-gray-900 truncate">{fullName}</h2>
            <p className="text-sm text-gray-500 truncate">{currentUser.email}</p>
            {currentUser.lastLogin && (
              <p className="mt-0.5 text-xs text-gray-400">
                Last login: {formatDate(currentUser.lastLogin)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Personal Information Section */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <SectionHeader
          icon={<UserCircleIcon className="h-5 w-5 text-primary-600" aria-hidden="true" />}
          title="Personal Information"
          isEditing={editingSection === 'personal'}
          onEdit={() => handleEdit('personal')}
          onSave={handleSavePersonal}
          onCancel={handleCancel}
        />
        <div className="px-6 py-5">
          {editingSection === 'personal' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormInput
                  label="First Name"
                  name="firstName"
                  value={personalData.firstName}
                  onChange={handlePersonalChange}
                  error={personalErrors.firstName}
                  required
                />
                <FormInput
                  label="Last Name"
                  name="lastName"
                  value={personalData.lastName}
                  onChange={handlePersonalChange}
                  error={personalErrors.lastName}
                  required
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormInput
                  label="Email Address"
                  name="email"
                  type="email"
                  value={personalData.email}
                  onChange={handlePersonalChange}
                  error={personalErrors.email}
                  required
                />
                <FormInput
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={personalData.phone}
                  onChange={handlePersonalChange}
                  error={personalErrors.phone}
                  required
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <span className="block text-sm font-medium text-gray-700">
                    Date of Birth
                  </span>
                  <span className="block rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500">
                    {formatDate(personalData.dateOfBirth) || '—'}
                  </span>
                  <p className="text-xs text-gray-400">Date of birth cannot be changed</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <ReadOnlyField label="First Name" value={currentUser.firstName} />
              <ReadOnlyField label="Last Name" value={currentUser.lastName} />
              <ReadOnlyField label="Email Address" value={currentUser.email} />
              <ReadOnlyField label="Phone Number" value={formatPhoneNumber(currentUser.phone)} />
              <ReadOnlyField label="Date of Birth" value={formatDate(currentUser.dateOfBirth)} />
            </div>
          )}
        </div>
      </div>

      {/* Address Section */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <SectionHeader
          icon={<HomeIcon className="h-5 w-5 text-primary-600" aria-hidden="true" />}
          title="Address"
          isEditing={editingSection === 'address'}
          onEdit={() => handleEdit('address')}
          onSave={handleSaveAddress}
          onCancel={handleCancel}
        />
        <div className="px-6 py-5">
          {editingSection === 'address' ? (
            <div className="space-y-4">
              <FormInput
                label="Street Address"
                name="street"
                value={addressData.street}
                onChange={handleAddressChange}
                error={addressErrors.street}
                placeholder="123 Main Street"
                required
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <FormInput
                  label="City"
                  name="city"
                  value={addressData.city}
                  onChange={handleAddressChange}
                  error={addressErrors.city}
                  placeholder="San Francisco"
                  required
                />
                <FormInput
                  label="State"
                  name="state"
                  type="select"
                  value={addressData.state}
                  onChange={handleAddressChange}
                  error={addressErrors.state}
                  options={US_STATE_OPTIONS}
                  placeholder="Select state"
                  required
                />
                <FormInput
                  label="ZIP Code"
                  name="zip"
                  value={addressData.zip}
                  onChange={handleAddressChange}
                  error={addressErrors.zip}
                  placeholder="94102"
                  required
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <ReadOnlyField label="Street Address" value={currentUser.address?.street} />
              <ReadOnlyField label="City" value={currentUser.address?.city} />
              <ReadOnlyField label="State" value={currentUser.address?.state} />
              <ReadOnlyField label="ZIP Code" value={currentUser.address?.zip} />
            </div>
          )}
        </div>
      </div>

      {/* Employment Section */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <SectionHeader
          icon={<BriefcaseIcon className="h-5 w-5 text-primary-600" aria-hidden="true" />}
          title="Employment"
          isEditing={editingSection === 'employment'}
          onEdit={() => handleEdit('employment')}
          onSave={handleSaveEmployment}
          onCancel={handleCancel}
        />
        <div className="px-6 py-5">
          {editingSection === 'employment' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormInput
                  label="Employment Status"
                  name="status"
                  type="select"
                  value={employmentData.status}
                  onChange={handleEmploymentChange}
                  error={employmentErrors.status}
                  options={EMPLOYMENT_STATUS_OPTIONS}
                  placeholder="Select status"
                  required
                />
                <FormInput
                  label="Employer"
                  name="employer"
                  value={employmentData.employer}
                  onChange={handleEmploymentChange}
                  error={employmentErrors.employer}
                  placeholder="Company name"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormInput
                  label="Occupation"
                  name="occupation"
                  value={employmentData.occupation}
                  onChange={handleEmploymentChange}
                  error={employmentErrors.occupation}
                  placeholder="Job title"
                />
                <FormInput
                  label="Years Employed"
                  name="yearsEmployed"
                  type="number"
                  value={employmentData.yearsEmployed}
                  onChange={handleEmploymentChange}
                  placeholder="0"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <ReadOnlyField label="Employment Status" value={currentUser.employment?.status} />
              <ReadOnlyField label="Employer" value={currentUser.employment?.employer} />
              <ReadOnlyField label="Occupation" value={currentUser.employment?.occupation} />
              <ReadOnlyField
                label="Years Employed"
                value={
                  currentUser.employment?.yearsEmployed !== undefined
                    ? String(currentUser.employment.yearsEmployed)
                    : ''
                }
              />
            </div>
          )}
        </div>
      </div>

      {/* Tax Information Section */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <SectionHeader
          icon={<DocumentTextIcon className="h-5 w-5 text-primary-600" aria-hidden="true" />}
          title="Tax Information"
          isEditing={editingSection === 'tax'}
          onEdit={() => handleEdit('tax')}
          onSave={handleSaveTax}
          onCancel={handleCancel}
        />
        <div className="px-6 py-5">
          {editingSection === 'tax' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormInput
                  label="Tax Status"
                  name="taxStatus"
                  type="select"
                  value={taxData.taxStatus}
                  onChange={handleTaxChange}
                  error={taxErrors.taxStatus}
                  options={TAX_STATUS_OPTIONS}
                  placeholder="Select tax status"
                  required
                />
                <FormInput
                  label="Filing Status"
                  name="taxFilingStatus"
                  type="select"
                  value={taxData.taxFilingStatus}
                  onChange={handleTaxChange}
                  error={taxErrors.taxFilingStatus}
                  options={TAX_FILING_STATUS_OPTIONS}
                  placeholder="Select filing status"
                  required
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormInput
                  label="Income Range"
                  name="incomeRange"
                  type="select"
                  value={taxData.incomeRange}
                  onChange={handleTaxChange}
                  error={taxErrors.incomeRange}
                  options={INCOME_RANGE_OPTIONS}
                  placeholder="Select income range"
                />
                <div className="flex flex-col gap-1">
                  <span className="block text-sm font-medium text-gray-700">
                    SSN
                  </span>
                  <span className="block rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500">
                    •••-••-••••
                  </span>
                  <p className="text-xs text-gray-400">SSN cannot be changed online</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <ReadOnlyField label="Tax Status" value={currentUser.taxStatus} />
              <ReadOnlyField label="Filing Status" value={currentUser.taxFilingStatus} />
              <ReadOnlyField label="Income Range" value={currentUser.incomeRange} />
              <ReadOnlyField label="SSN" value="•••-••-••••" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;