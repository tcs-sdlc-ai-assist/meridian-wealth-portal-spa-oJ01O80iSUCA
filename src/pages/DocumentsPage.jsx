/**
 * Documents page rendered at /documents.
 * Displays documents grouped by category (Statements, Tax Documents,
 * Trade Confirmations, Prospectuses) in collapsible sections.
 * Each document shows name, date, and file size with a download button.
 * Download button triggers a simulated download toast.
 * New users see EmptyState. Reads from userStore.
 * @module pages/DocumentsPage
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  DocumentTextIcon,
  ArrowDownTrayIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { useSessionStore } from '../store/sessionStore.js';
import { useUserStore } from '../store/userStore.js';
import EmptyState from '../components/EmptyState.jsx';
import Badge from '../components/Badge.jsx';
import { showSuccessToast } from '../components/Toast.jsx';
import { formatDate } from '../utils/formatters.js';
import { DOCUMENT_CATEGORIES } from '../utils/constants.js';

/**
 * Category display order and configuration.
 * @type {Array<{key: string, label: string, variant: string}>}
 */
const CATEGORY_CONFIG = [
  { key: DOCUMENT_CATEGORIES.STATEMENT, label: 'Statements', variant: 'info' },
  { key: DOCUMENT_CATEGORIES.TAX_FORM, label: 'Tax Documents', variant: 'pending' },
  { key: DOCUMENT_CATEGORIES.TRADE_CONFIRMATION, label: 'Trade Confirmations', variant: 'success' },
  { key: DOCUMENT_CATEGORIES.PROSPECTUS, label: 'Prospectuses', variant: 'neutral' },
];

/**
 * Format file size in bytes to a human-readable string.
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size (e.g., "245 KB", "1.0 MB")
 */
function formatFileSize(bytes) {
  if (bytes === null || bytes === undefined || isNaN(bytes) || bytes === 0) {
    return '0 B';
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(0)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Group documents by category.
 * @param {Array} documents - Array of document objects
 * @returns {Record<string, Array>} Documents grouped by category
 */
function groupByCategory(documents) {
  if (!documents || !Array.isArray(documents) || documents.length === 0) {
    return {};
  }

  const grouped = {};

  documents.forEach((doc) => {
    const category = doc.category || 'Other';
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(doc);
  });

  // Sort documents within each category by date descending
  Object.keys(grouped).forEach((category) => {
    grouped[category].sort((a, b) => new Date(b.date) - new Date(a.date));
  });

  return grouped;
}

/**
 * CollapsibleSection component for rendering a collapsible document category.
 * @param {object} props - Component props
 * @param {string} props.label - Category label
 * @param {string} props.variant - Badge variant for the count
 * @param {Array} props.documents - Array of documents in this category
 * @param {boolean} props.isOpen - Whether the section is expanded
 * @param {function} props.onToggle - Callback to toggle the section
 * @param {function} props.onDownload - Callback invoked with the document when download is clicked
 * @returns {React.ReactElement} The CollapsibleSection component
 */
function CollapsibleSection({ label, variant, documents, isOpen, onToggle, onDownload }) {
  const count = documents.length;

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* Section Header */}
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <span className="inline-flex">
            {isOpen ? (
              <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            ) : (
              <ChevronRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            )}
          </span>
          <h3 className="text-sm font-semibold text-gray-900">{label}</h3>
          <Badge
            label={`${count}`}
            variant={variant}
            size="xs"
          />
        </div>
      </button>

      {/* Section Content */}
      {isOpen && (
        <div className="border-t border-gray-200">
          <div className="divide-y divide-gray-100">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between px-5 py-3 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <DocumentTextIcon
                    className="h-5 w-5 flex-shrink-0 text-gray-400"
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {doc.name}
                    </p>
                    <div className="mt-0.5 flex items-center gap-3 text-xs text-gray-500">
                      <span>{formatDate(doc.date)}</span>
                      <span className="text-gray-300">•</span>
                      <span>{formatFileSize(doc.fileSize)}</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onDownload(doc)}
                  className="ml-4 inline-flex flex-shrink-0 items-center gap-1.5 rounded-md bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-700 transition-colors hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  aria-label={`Download ${doc.name}`}
                >
                  <ArrowDownTrayIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * DocumentsPage component for displaying documents grouped by category.
 * Shows collapsible sections for each document category with download buttons.
 * Displays EmptyState for users with no documents.
 * @returns {React.ReactElement} The DocumentsPage component
 */
function DocumentsPage() {
  const currentUser = useSessionStore((state) => state.currentUser);
  const getDocuments = useUserStore((state) => state.getDocuments);

  const userId = currentUser?.id;

  /**
   * Get documents data for the current user.
   */
  const documentsData = useMemo(() => {
    if (!userId) {
      return {
        documents: [],
        summary: {
          totalDocuments: 0,
          statementCount: 0,
          taxFormCount: 0,
          tradeConfirmationCount: 0,
          prospectusCount: 0,
          totalFileSize: 0,
        },
      };
    }
    return getDocuments(userId);
  }, [userId, getDocuments]);

  const { documents, summary } = documentsData;
  const hasDocuments = documents.length > 0;

  /**
   * Group documents by category.
   */
  const groupedDocuments = useMemo(() => groupByCategory(documents), [documents]);

  /**
   * Track which sections are open. Default all to open.
   */
  const [openSections, setOpenSections] = useState(() => {
    const initial = {};
    CATEGORY_CONFIG.forEach((cat) => {
      initial[cat.key] = true;
    });
    return initial;
  });

  /**
   * Toggle a section open/closed.
   * @param {string} categoryKey - The category key to toggle
   */
  const handleToggleSection = useCallback((categoryKey) => {
    setOpenSections((prev) => ({
      ...prev,
      [categoryKey]: !prev[categoryKey],
    }));
  }, []);

  /**
   * Handle document download.
   * @param {object} doc - The document object
   */
  const handleDownload = useCallback((doc) => {
    showSuccessToast(`Download started for ${doc.name}`);
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and download your account documents, statements, and tax forms
        </p>
      </div>

      {/* Empty State */}
      {!hasDocuments && (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <EmptyState
            icon={<DocumentTextIcon className="h-12 w-12" />}
            title="No Documents Yet"
            message="Your account documents, statements, and tax forms will appear here once they are generated. Check back after your first statement period."
          />
        </div>
      )}

      {/* Document Summary */}
      {hasDocuments && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Total Documents
            </p>
            <p className="mt-1 text-lg font-bold text-gray-900">
              {summary.totalDocuments}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Statements
            </p>
            <p className="mt-1 text-lg font-bold text-gray-900">
              {summary.statementCount}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Tax Forms
            </p>
            <p className="mt-1 text-lg font-bold text-gray-900">
              {summary.taxFormCount}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Trade Confirmations
            </p>
            <p className="mt-1 text-lg font-bold text-gray-900">
              {summary.tradeConfirmationCount}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Total Size
            </p>
            <p className="mt-1 text-lg font-bold text-gray-900">
              {formatFileSize(summary.totalFileSize)}
            </p>
          </div>
        </div>
      )}

      {/* Document Categories */}
      {hasDocuments && (
        <div className="space-y-4">
          {CATEGORY_CONFIG.map((category) => {
            const categoryDocs = groupedDocuments[category.key];

            if (!categoryDocs || categoryDocs.length === 0) {
              return null;
            }

            return (
              <CollapsibleSection
                key={category.key}
                label={category.label}
                variant={category.variant}
                documents={categoryDocs}
                isOpen={openSections[category.key] || false}
                onToggle={() => handleToggleSection(category.key)}
                onDownload={handleDownload}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default DocumentsPage;