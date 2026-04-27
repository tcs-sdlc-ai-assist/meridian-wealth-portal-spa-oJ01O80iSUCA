/**
 * Pre-seeded mock document data per user grouped by category.
 * Each user has an array of documents spanning Statements, Tax Documents,
 * Trade Confirmations, and Prospectuses.
 * @module mock/documents
 */

import { getItem, setItem } from '../utils/storageUtils.js';
import { DOCUMENT_CATEGORIES } from '../utils/constants.js';

/**
 * Storage key for documents data.
 * @type {string}
 */
const DOCUMENTS_STORAGE_KEY = 'meridian_documents';

/**
 * @typedef {object} Document
 * @property {string} id - Unique identifier for the document
 * @property {string} userId - The user this document belongs to
 * @property {string} accountId - The account this document is associated with
 * @property {string} name - Human-readable document name
 * @property {string} category - Document category (Statement, Tax Form, Trade Confirmation, Prospectus)
 * @property {string} date - ISO 8601 date string of the document
 * @property {number} fileSize - File size in bytes
 * @property {string} downloadUrl - Simulated download URL
 */

/**
 * @typedef {object} UserDocuments
 * @property {string} userId - The user ID
 * @property {Document[]} documents - Array of documents for this user
 */

/**
 * Helper to create a document object.
 * @param {object} params - Document parameters
 * @param {string} params.id
 * @param {string} params.userId
 * @param {string} params.accountId
 * @param {string} params.name
 * @param {string} params.category
 * @param {string} params.date
 * @param {number} params.fileSize
 * @returns {Document}
 */
function createDocument({ id, userId, accountId, name, category, date, fileSize }) {
  return {
    id,
    userId,
    accountId,
    name,
    category,
    date,
    fileSize,
    downloadUrl: `/api/documents/${id}/download`,
  };
}

/** @type {UserDocuments[]} */
export const MOCK_DOCUMENTS = [
  // James Morgan (usr_jm_001)
  {
    userId: 'usr_jm_001',
    documents: [
      // Statements
      createDocument({ id: 'doc_jm_001', userId: 'usr_jm_001', accountId: 'acct_jm_001', name: 'January 2024 Statement - Individual', category: DOCUMENT_CATEGORIES.STATEMENT, date: '2024-02-01T00:00:00Z', fileSize: 245760 }),
      createDocument({ id: 'doc_jm_002', userId: 'usr_jm_001', accountId: 'acct_jm_001', name: 'December 2023 Statement - Individual', category: DOCUMENT_CATEGORIES.STATEMENT, date: '2024-01-01T00:00:00Z', fileSize: 231424 }),
      createDocument({ id: 'doc_jm_003', userId: 'usr_jm_001', accountId: 'acct_jm_001', name: 'November 2023 Statement - Individual', category: DOCUMENT_CATEGORIES.STATEMENT, date: '2023-12-01T00:00:00Z', fileSize: 218112 }),
      createDocument({ id: 'doc_jm_004', userId: 'usr_jm_001', accountId: 'acct_jm_001', name: 'October 2023 Statement - Individual', category: DOCUMENT_CATEGORIES.STATEMENT, date: '2023-11-01T00:00:00Z', fileSize: 225280 }),
      createDocument({ id: 'doc_jm_005', userId: 'usr_jm_001', accountId: 'acct_jm_002', name: 'January 2024 Statement - Roth IRA', category: DOCUMENT_CATEGORIES.STATEMENT, date: '2024-02-01T00:00:00Z', fileSize: 198656 }),
      createDocument({ id: 'doc_jm_006', userId: 'usr_jm_001', accountId: 'acct_jm_002', name: 'December 2023 Statement - Roth IRA', category: DOCUMENT_CATEGORIES.STATEMENT, date: '2024-01-01T00:00:00Z', fileSize: 192512 }),
      createDocument({ id: 'doc_jm_007', userId: 'usr_jm_001', accountId: 'acct_jm_002', name: 'November 2023 Statement - Roth IRA', category: DOCUMENT_CATEGORIES.STATEMENT, date: '2023-12-01T00:00:00Z', fileSize: 187392 }),
      createDocument({ id: 'doc_jm_008', userId: 'usr_jm_001', accountId: 'acct_jm_002', name: 'October 2023 Statement - Roth IRA', category: DOCUMENT_CATEGORIES.STATEMENT, date: '2023-11-01T00:00:00Z', fileSize: 190464 }),
      // Tax Documents
      createDocument({ id: 'doc_jm_009', userId: 'usr_jm_001', accountId: 'acct_jm_001', name: '2023 Form 1099-B - Individual', category: DOCUMENT_CATEGORIES.TAX_FORM, date: '2024-02-15T00:00:00Z', fileSize: 358400 }),
      createDocument({ id: 'doc_jm_010', userId: 'usr_jm_001', accountId: 'acct_jm_001', name: '2023 Form 1099-DIV - Individual', category: DOCUMENT_CATEGORIES.TAX_FORM, date: '2024-02-15T00:00:00Z', fileSize: 143360 }),
      createDocument({ id: 'doc_jm_011', userId: 'usr_jm_001', accountId: 'acct_jm_002', name: '2023 Form 5498 - Roth IRA', category: DOCUMENT_CATEGORIES.TAX_FORM, date: '2024-01-31T00:00:00Z', fileSize: 122880 }),
      // Trade Confirmations
      createDocument({ id: 'doc_jm_012', userId: 'usr_jm_001', accountId: 'acct_jm_001', name: 'Trade Confirmation - AAPL Buy 02/08/2024', category: DOCUMENT_CATEGORIES.TRADE_CONFIRMATION, date: '2024-02-08T10:30:00Z', fileSize: 81920 }),
      createDocument({ id: 'doc_jm_013', userId: 'usr_jm_001', accountId: 'acct_jm_001', name: 'Trade Confirmation - MSFT Sell 01/29/2024', category: DOCUMENT_CATEGORIES.TRADE_CONFIRMATION, date: '2024-01-29T09:45:00Z', fileSize: 79872 }),
      createDocument({ id: 'doc_jm_014', userId: 'usr_jm_001', accountId: 'acct_jm_002', name: 'Trade Confirmation - VTI Buy 01/22/2024', category: DOCUMENT_CATEGORIES.TRADE_CONFIRMATION, date: '2024-01-22T11:00:00Z', fileSize: 77824 }),
      createDocument({ id: 'doc_jm_015', userId: 'usr_jm_001', accountId: 'acct_jm_001', name: 'Trade Confirmation - AMZN Buy 01/10/2024', category: DOCUMENT_CATEGORIES.TRADE_CONFIRMATION, date: '2024-01-10T13:30:00Z', fileSize: 80896 }),
      createDocument({ id: 'doc_jm_016', userId: 'usr_jm_001', accountId: 'acct_jm_001', name: 'Trade Confirmation - PG Buy 12/15/2023', category: DOCUMENT_CATEGORIES.TRADE_CONFIRMATION, date: '2023-12-15T09:30:00Z', fileSize: 78848 }),
      // Prospectuses
      createDocument({ id: 'doc_jm_017', userId: 'usr_jm_001', accountId: 'acct_jm_001', name: 'Vanguard S&P 500 ETF Prospectus', category: DOCUMENT_CATEGORIES.PROSPECTUS, date: '2024-01-15T00:00:00Z', fileSize: 1048576 }),
      createDocument({ id: 'doc_jm_018', userId: 'usr_jm_001', accountId: 'acct_jm_002', name: 'Fidelity 500 Index Fund Prospectus', category: DOCUMENT_CATEGORIES.PROSPECTUS, date: '2024-01-10T00:00:00Z', fileSize: 921600 }),
      createDocument({ id: 'doc_jm_019', userId: 'usr_jm_001', accountId: 'acct_jm_001', name: 'Vanguard Total Bond Market ETF Prospectus', category: DOCUMENT_CATEGORIES.PROSPECTUS, date: '2023-12-20T00:00:00Z', fileSize: 876544 }),
    ],
  },
  // Sarah Chen (usr_sc_002)
  {
    userId: 'usr_sc_002',
    documents: [
      // Statements
      createDocument({ id: 'doc_sc_001', userId: 'usr_sc_002', accountId: 'acct_sc_001', name: 'January 2024 Statement - Individual', category: DOCUMENT_CATEGORIES.STATEMENT, date: '2024-02-01T00:00:00Z', fileSize: 276480 }),
      createDocument({ id: 'doc_sc_002', userId: 'usr_sc_002', accountId: 'acct_sc_001', name: 'December 2023 Statement - Individual', category: DOCUMENT_CATEGORIES.STATEMENT, date: '2024-01-01T00:00:00Z', fileSize: 262144 }),
      createDocument({ id: 'doc_sc_003', userId: 'usr_sc_002', accountId: 'acct_sc_001', name: 'November 2023 Statement - Individual', category: DOCUMENT_CATEGORIES.STATEMENT, date: '2023-12-01T00:00:00Z', fileSize: 253952 }),
      createDocument({ id: 'doc_sc_004', userId: 'usr_sc_002', accountId: 'acct_sc_001', name: 'October 2023 Statement - Individual', category: DOCUMENT_CATEGORIES.STATEMENT, date: '2023-11-01T00:00:00Z', fileSize: 249856 }),
      createDocument({ id: 'doc_sc_005', userId: 'usr_sc_002', accountId: 'acct_sc_001', name: 'September 2023 Statement - Individual', category: DOCUMENT_CATEGORIES.STATEMENT, date: '2023-10-01T00:00:00Z', fileSize: 241664 }),
      createDocument({ id: 'doc_sc_006', userId: 'usr_sc_002', accountId: 'acct_sc_001', name: 'August 2023 Statement - Individual', category: DOCUMENT_CATEGORIES.STATEMENT, date: '2023-09-01T00:00:00Z', fileSize: 237568 }),
      // Tax Documents
      createDocument({ id: 'doc_sc_007', userId: 'usr_sc_002', accountId: 'acct_sc_001', name: '2023 Form 1099-B - Individual', category: DOCUMENT_CATEGORIES.TAX_FORM, date: '2024-02-15T00:00:00Z', fileSize: 409600 }),
      createDocument({ id: 'doc_sc_008', userId: 'usr_sc_002', accountId: 'acct_sc_001', name: '2023 Form 1099-DIV - Individual', category: DOCUMENT_CATEGORIES.TAX_FORM, date: '2024-02-15T00:00:00Z', fileSize: 126976 }),
      createDocument({ id: 'doc_sc_009', userId: 'usr_sc_002', accountId: 'acct_sc_001', name: '2023 Form 1099-INT - Individual', category: DOCUMENT_CATEGORIES.TAX_FORM, date: '2024-02-15T00:00:00Z', fileSize: 102400 }),
      // Trade Confirmations
      createDocument({ id: 'doc_sc_010', userId: 'usr_sc_002', accountId: 'acct_sc_001', name: 'Trade Confirmation - NVDA Buy 02/09/2024', category: DOCUMENT_CATEGORIES.TRADE_CONFIRMATION, date: '2024-02-09T10:00:00Z', fileSize: 83968 }),
      createDocument({ id: 'doc_sc_011', userId: 'usr_sc_002', accountId: 'acct_sc_001', name: 'Trade Confirmation - TSLA Sell 02/07/2024', category: DOCUMENT_CATEGORIES.TRADE_CONFIRMATION, date: '2024-02-07T14:30:00Z', fileSize: 81920 }),
      createDocument({ id: 'doc_sc_012', userId: 'usr_sc_002', accountId: 'acct_sc_001', name: 'Trade Confirmation - META Buy 02/01/2024', category: DOCUMENT_CATEGORIES.TRADE_CONFIRMATION, date: '2024-02-01T09:45:00Z', fileSize: 80896 }),
      createDocument({ id: 'doc_sc_013', userId: 'usr_sc_002', accountId: 'acct_sc_001', name: 'Trade Confirmation - AMD Buy 01/18/2024', category: DOCUMENT_CATEGORIES.TRADE_CONFIRMATION, date: '2024-01-18T13:00:00Z', fileSize: 79872 }),
      createDocument({ id: 'doc_sc_014', userId: 'usr_sc_002', accountId: 'acct_sc_001', name: 'Trade Confirmation - ARKK Sell 01/10/2024', category: DOCUMENT_CATEGORIES.TRADE_CONFIRMATION, date: '2024-01-10T10:30:00Z', fileSize: 78848 }),
      createDocument({ id: 'doc_sc_015', userId: 'usr_sc_002', accountId: 'acct_sc_001', name: 'Trade Confirmation - COIN Buy 12/28/2023', category: DOCUMENT_CATEGORIES.TRADE_CONFIRMATION, date: '2023-12-28T09:00:00Z', fileSize: 77824 }),
      // Prospectuses
      createDocument({ id: 'doc_sc_016', userId: 'usr_sc_002', accountId: 'acct_sc_001', name: 'ARK Innovation ETF Prospectus', category: DOCUMENT_CATEGORIES.PROSPECTUS, date: '2024-01-20T00:00:00Z', fileSize: 1153024 }),
      createDocument({ id: 'doc_sc_017', userId: 'usr_sc_002', accountId: 'acct_sc_001', name: 'Invesco QQQ Trust Prospectus', category: DOCUMENT_CATEGORIES.PROSPECTUS, date: '2024-01-05T00:00:00Z', fileSize: 983040 }),
      createDocument({ id: 'doc_sc_018', userId: 'usr_sc_002', accountId: 'acct_sc_001', name: 'iShares Semiconductor ETF Prospectus', category: DOCUMENT_CATEGORIES.PROSPECTUS, date: '2023-12-15T00:00:00Z', fileSize: 901120 }),
    ],
  },
  // Robert Patel (usr_rp_003)
  {
    userId: 'usr_rp_003',
    documents: [
      // Statements
      createDocument({ id: 'doc_rp_001', userId: 'usr_rp_003', accountId: 'acct_rp_001', name: 'January 2024 Statement - Joint', category: DOCUMENT_CATEGORIES.STATEMENT, date: '2024-02-01T00:00:00Z', fileSize: 290816 }),
      createDocument({ id: 'doc_rp_002', userId: 'usr_rp_003', accountId: 'acct_rp_001', name: 'December 2023 Statement - Joint', category: DOCUMENT_CATEGORIES.STATEMENT, date: '2024-01-01T00:00:00Z', fileSize: 282624 }),
      createDocument({ id: 'doc_rp_003', userId: 'usr_rp_003', accountId: 'acct_rp_001', name: 'November 2023 Statement - Joint', category: DOCUMENT_CATEGORIES.STATEMENT, date: '2023-12-01T00:00:00Z', fileSize: 274432 }),
      createDocument({ id: 'doc_rp_004', userId: 'usr_rp_003', accountId: 'acct_rp_002', name: 'January 2024 Statement - Retirement IRA', category: DOCUMENT_CATEGORIES.STATEMENT, date: '2024-02-01T00:00:00Z', fileSize: 212992 }),
      createDocument({ id: 'doc_rp_005', userId: 'usr_rp_003', accountId: 'acct_rp_002', name: 'December 2023 Statement - Retirement IRA', category: DOCUMENT_CATEGORIES.STATEMENT, date: '2024-01-01T00:00:00Z', fileSize: 208896 }),
      createDocument({ id: 'doc_rp_006', userId: 'usr_rp_003', accountId: 'acct_rp_003', name: 'January 2024 Statement - Trust', category: DOCUMENT_CATEGORIES.STATEMENT, date: '2024-02-01T00:00:00Z', fileSize: 237568 }),
      createDocument({ id: 'doc_rp_007', userId: 'usr_rp_003', accountId: 'acct_rp_003', name: 'December 2023 Statement - Trust', category: DOCUMENT_CATEGORIES.STATEMENT, date: '2024-01-01T00:00:00Z', fileSize: 233472 }),
      createDocument({ id: 'doc_rp_008', userId: 'usr_rp_003', accountId: 'acct_rp_003', name: 'November 2023 Statement - Trust', category: DOCUMENT_CATEGORIES.STATEMENT, date: '2023-12-01T00:00:00Z', fileSize: 229376 }),
      // Tax Documents
      createDocument({ id: 'doc_rp_009', userId: 'usr_rp_003', accountId: 'acct_rp_001', name: '2023 Form 1099-B - Joint', category: DOCUMENT_CATEGORIES.TAX_FORM, date: '2024-02-15T00:00:00Z', fileSize: 389120 }),
      createDocument({ id: 'doc_rp_010', userId: 'usr_rp_003', accountId: 'acct_rp_001', name: '2023 Form 1099-DIV - Joint', category: DOCUMENT_CATEGORIES.TAX_FORM, date: '2024-02-15T00:00:00Z', fileSize: 163840 }),
      createDocument({ id: 'doc_rp_011', userId: 'usr_rp_003', accountId: 'acct_rp_002', name: '2023 Form 1099-R - Retirement IRA', category: DOCUMENT_CATEGORIES.TAX_FORM, date: '2024-01-31T00:00:00Z', fileSize: 135168 }),
      createDocument({ id: 'doc_rp_012', userId: 'usr_rp_003', accountId: 'acct_rp_003', name: '2023 Form 1099-B - Trust', category: DOCUMENT_CATEGORIES.TAX_FORM, date: '2024-02-15T00:00:00Z', fileSize: 307200 }),
      createDocument({ id: 'doc_rp_013', userId: 'usr_rp_003', accountId: 'acct_rp_003', name: '2023 Form 1099-DIV - Trust', category: DOCUMENT_CATEGORIES.TAX_FORM, date: '2024-02-15T00:00:00Z', fileSize: 151552 }),
      // Trade Confirmations
      createDocument({ id: 'doc_rp_014', userId: 'usr_rp_003', accountId: 'acct_rp_001', name: 'Trade Confirmation - VTI Buy 02/08/2024', category: DOCUMENT_CATEGORIES.TRADE_CONFIRMATION, date: '2024-02-08T10:00:00Z', fileSize: 82944 }),
      createDocument({ id: 'doc_rp_015', userId: 'usr_rp_003', accountId: 'acct_rp_002', name: 'Trade Confirmation - AGG Buy 01/30/2024', category: DOCUMENT_CATEGORIES.TRADE_CONFIRMATION, date: '2024-01-30T09:15:00Z', fileSize: 79872 }),
      createDocument({ id: 'doc_rp_016', userId: 'usr_rp_003', accountId: 'acct_rp_003', name: 'Trade Confirmation - SCHD Buy 01/15/2024', category: DOCUMENT_CATEGORIES.TRADE_CONFIRMATION, date: '2024-01-15T13:00:00Z', fileSize: 78848 }),
      createDocument({ id: 'doc_rp_017', userId: 'usr_rp_003', accountId: 'acct_rp_002', name: 'Trade Confirmation - VFIAX Buy 01/02/2024', category: DOCUMENT_CATEGORIES.TRADE_CONFIRMATION, date: '2024-01-02T15:00:00Z', fileSize: 80896 }),
      createDocument({ id: 'doc_rp_018', userId: 'usr_rp_003', accountId: 'acct_rp_001', name: 'Trade Confirmation - TLT Sell 12/15/2023', category: DOCUMENT_CATEGORIES.TRADE_CONFIRMATION, date: '2023-12-15T14:00:00Z', fileSize: 77824 }),
      // Prospectuses
      createDocument({ id: 'doc_rp_019', userId: 'usr_rp_003', accountId: 'acct_rp_001', name: 'Vanguard Total Stock Market ETF Prospectus', category: DOCUMENT_CATEGORIES.PROSPECTUS, date: '2024-01-12T00:00:00Z', fileSize: 1024000 }),
      createDocument({ id: 'doc_rp_020', userId: 'usr_rp_003', accountId: 'acct_rp_002', name: 'Vanguard 500 Index Fund Admiral Prospectus', category: DOCUMENT_CATEGORIES.PROSPECTUS, date: '2024-01-08T00:00:00Z', fileSize: 962560 }),
      createDocument({ id: 'doc_rp_021', userId: 'usr_rp_003', accountId: 'acct_rp_003', name: 'Vanguard Dividend Appreciation ETF Prospectus', category: DOCUMENT_CATEGORIES.PROSPECTUS, date: '2023-12-18T00:00:00Z', fileSize: 897024 }),
    ],
  },
  // Emily Watson (usr_ew_004)
  {
    userId: 'usr_ew_004',
    documents: [
      // Statements
      createDocument({ id: 'doc_ew_001', userId: 'usr_ew_004', accountId: 'acct_ew_001', name: 'January 2024 Statement - Individual', category: DOCUMENT_CATEGORIES.STATEMENT, date: '2024-02-01T00:00:00Z', fileSize: 184320 }),
      createDocument({ id: 'doc_ew_002', userId: 'usr_ew_004', accountId: 'acct_ew_001', name: 'December 2023 Statement - Individual', category: DOCUMENT_CATEGORIES.STATEMENT, date: '2024-01-01T00:00:00Z', fileSize: 178176 }),
      createDocument({ id: 'doc_ew_003', userId: 'usr_ew_004', accountId: 'acct_ew_001', name: 'November 2023 Statement - Individual', category: DOCUMENT_CATEGORIES.STATEMENT, date: '2023-12-01T00:00:00Z', fileSize: 172032 }),
      createDocument({ id: 'doc_ew_004', userId: 'usr_ew_004', accountId: 'acct_ew_001', name: 'October 2023 Statement - Individual', category: DOCUMENT_CATEGORIES.STATEMENT, date: '2023-11-01T00:00:00Z', fileSize: 169984 }),
      createDocument({ id: 'doc_ew_005', userId: 'usr_ew_004', accountId: 'acct_ew_002', name: 'January 2024 Statement - Roth IRA', category: DOCUMENT_CATEGORIES.STATEMENT, date: '2024-02-01T00:00:00Z', fileSize: 155648 }),
      createDocument({ id: 'doc_ew_006', userId: 'usr_ew_004', accountId: 'acct_ew_002', name: 'December 2023 Statement - Roth IRA', category: DOCUMENT_CATEGORIES.STATEMENT, date: '2024-01-01T00:00:00Z', fileSize: 151552 }),
      createDocument({ id: 'doc_ew_007', userId: 'usr_ew_004', accountId: 'acct_ew_002', name: 'November 2023 Statement - Roth IRA', category: DOCUMENT_CATEGORIES.STATEMENT, date: '2023-12-01T00:00:00Z', fileSize: 147456 }),
      // Tax Documents
      createDocument({ id: 'doc_ew_008', userId: 'usr_ew_004', accountId: 'acct_ew_001', name: '2023 Form 1099-B - Individual', category: DOCUMENT_CATEGORIES.TAX_FORM, date: '2024-02-15T00:00:00Z', fileSize: 204800 }),
      createDocument({ id: 'doc_ew_009', userId: 'usr_ew_004', accountId: 'acct_ew_001', name: '2023 Form 1099-DIV - Individual', category: DOCUMENT_CATEGORIES.TAX_FORM, date: '2024-02-15T00:00:00Z', fileSize: 110592 }),
      createDocument({ id: 'doc_ew_010', userId: 'usr_ew_004', accountId: 'acct_ew_002', name: '2023 Form 5498 - Roth IRA', category: DOCUMENT_CATEGORIES.TAX_FORM, date: '2024-01-31T00:00:00Z', fileSize: 98304 }),
      // Trade Confirmations
      createDocument({ id: 'doc_ew_011', userId: 'usr_ew_004', accountId: 'acct_ew_001', name: 'Trade Confirmation - VOO Buy 02/10/2024', category: DOCUMENT_CATEGORIES.TRADE_CONFIRMATION, date: '2024-02-10T09:30:00Z', fileSize: 76800 }),
      createDocument({ id: 'doc_ew_012', userId: 'usr_ew_004', accountId: 'acct_ew_002', name: 'Trade Confirmation - VTSAX Buy 01/28/2024', category: DOCUMENT_CATEGORIES.TRADE_CONFIRMATION, date: '2024-01-28T10:15:00Z', fileSize: 75776 }),
      createDocument({ id: 'doc_ew_013', userId: 'usr_ew_004', accountId: 'acct_ew_001', name: 'Trade Confirmation - AAPL Buy 01/08/2024', category: DOCUMENT_CATEGORIES.TRADE_CONFIRMATION, date: '2024-01-08T13:45:00Z', fileSize: 74752 }),
      createDocument({ id: 'doc_ew_014', userId: 'usr_ew_004', accountId: 'acct_ew_001', name: 'Trade Confirmation - BND Buy 11/28/2023', category: DOCUMENT_CATEGORIES.TRADE_CONFIRMATION, date: '2023-11-28T14:30:00Z', fileSize: 73728 }),
      createDocument({ id: 'doc_ew_015', userId: 'usr_ew_004', accountId: 'acct_ew_001', name: 'Trade Confirmation - KO Buy 10/20/2023', category: DOCUMENT_CATEGORIES.TRADE_CONFIRMATION, date: '2023-10-20T13:15:00Z', fileSize: 72704 }),
      // Prospectuses
      createDocument({ id: 'doc_ew_016', userId: 'usr_ew_004', accountId: 'acct_ew_001', name: 'Vanguard S&P 500 ETF Prospectus', category: DOCUMENT_CATEGORIES.PROSPECTUS, date: '2024-01-15T00:00:00Z', fileSize: 1048576 }),
      createDocument({ id: 'doc_ew_017', userId: 'usr_ew_004', accountId: 'acct_ew_002', name: 'Vanguard Total Stock Market Index Fund Prospectus', category: DOCUMENT_CATEGORIES.PROSPECTUS, date: '2024-01-10T00:00:00Z', fileSize: 995328 }),
    ],
  },
  // David Kim (usr_dk_005)
  {
    userId: 'usr_dk_005',
    documents: [
      // Statements
      createDocument({ id: 'doc_dk_001', userId: 'usr_dk_005', accountId: 'acct_dk_001', name: 'January 2024 Statement - Joint', category: DOCUMENT_CATEGORIES.STATEMENT, date: '2024-02-01T00:00:00Z', fileSize: 327680 }),
      createDocument({ id: 'doc_dk_002', userId: 'usr_dk_005', accountId: 'acct_dk_001', name: 'December 2023 Statement - Joint', category: DOCUMENT_CATEGORIES.STATEMENT, date: '2024-01-01T00:00:00Z', fileSize: 319488 }),
      createDocument({ id: 'doc_dk_003', userId: 'usr_dk_005', accountId: 'acct_dk_001', name: 'November 2023 Statement - Joint', category: DOCUMENT_CATEGORIES.STATEMENT, date: '2023-12-01T00:00:00Z', fileSize: 311296 }),
      createDocument({ id: 'doc_dk_004', userId: 'usr_dk_005', accountId: 'acct_dk_002', name: 'January 2024 Statement - Retirement IRA', category: DOCUMENT_CATEGORIES.STATEMENT, date: '2024-02-01T00:00:00Z', fileSize: 253952 }),
      createDocument({ id: 'doc_dk_005', userId: 'usr_dk_005', accountId: 'acct_dk_002', name: 'December 2023 Statement - Retirement IRA', category: DOCUMENT_CATEGORIES.STATEMENT, date: '2024-01-01T00:00:00Z', fileSize: 249856 }),
      createDocument({ id: 'doc_dk_006', userId: 'usr_dk_005', accountId: 'acct_dk_003', name: 'January 2024 Statement - Trust', category: DOCUMENT_CATEGORIES.STATEMENT, date: '2024-02-01T00:00:00Z', fileSize: 270336 }),
      createDocument({ id: 'doc_dk_007', userId: 'usr_dk_005', accountId: 'acct_dk_003', name: 'December 2023 Statement - Trust', category: DOCUMENT_CATEGORIES.STATEMENT, date: '2024-01-01T00:00:00Z', fileSize: 266240 }),
      createDocument({ id: 'doc_dk_008', userId: 'usr_dk_005', accountId: 'acct_dk_004', name: 'January 2024 Statement - Custodial', category: DOCUMENT_CATEGORIES.STATEMENT, date: '2024-02-01T00:00:00Z', fileSize: 196608 }),
      createDocument({ id: 'doc_dk_009', userId: 'usr_dk_005', accountId: 'acct_dk_004', name: 'December 2023 Statement - Custodial', category: DOCUMENT_CATEGORIES.STATEMENT, date: '2024-01-01T00:00:00Z', fileSize: 192512 }),
      createDocument({ id: 'doc_dk_010', userId: 'usr_dk_005', accountId: 'acct_dk_001', name: 'October 2023 Statement - Joint', category: DOCUMENT_CATEGORIES.STATEMENT, date: '2023-11-01T00:00:00Z', fileSize: 303104 }),
      // Tax Documents
      createDocument({ id: 'doc_dk_011', userId: 'usr_dk_005', accountId: 'acct_dk_001', name: '2023 Form 1099-B - Joint', category: DOCUMENT_CATEGORIES.TAX_FORM, date: '2024-02-15T00:00:00Z', fileSize: 450560 }),
      createDocument({ id: 'doc_dk_012', userId: 'usr_dk_005', accountId: 'acct_dk_001', name: '2023 Form 1099-DIV - Joint', category: DOCUMENT_CATEGORIES.TAX_FORM, date: '2024-02-15T00:00:00Z', fileSize: 184320 }),
      createDocument({ id: 'doc_dk_013', userId: 'usr_dk_005', accountId: 'acct_dk_002', name: '2023 Form 1099-R - Retirement IRA', category: DOCUMENT_CATEGORIES.TAX_FORM, date: '2024-01-31T00:00:00Z', fileSize: 143360 }),
      createDocument({ id: 'doc_dk_014', userId: 'usr_dk_005', accountId: 'acct_dk_003', name: '2023 Form 1099-B - Trust', category: DOCUMENT_CATEGORIES.TAX_FORM, date: '2024-02-15T00:00:00Z', fileSize: 368640 }),
      createDocument({ id: 'doc_dk_015', userId: 'usr_dk_005', accountId: 'acct_dk_003', name: '2023 Form 1099-DIV - Trust', category: DOCUMENT_CATEGORIES.TAX_FORM, date: '2024-02-15T00:00:00Z', fileSize: 167936 }),
      createDocument({ id: 'doc_dk_016', userId: 'usr_dk_005', accountId: 'acct_dk_004', name: '2023 Form 1099-B - Custodial', category: DOCUMENT_CATEGORIES.TAX_FORM, date: '2024-02-15T00:00:00Z', fileSize: 225280 }),
      // Trade Confirmations
      createDocument({ id: 'doc_dk_017', userId: 'usr_dk_005', accountId: 'acct_dk_001', name: 'Trade Confirmation - VTI Buy 02/07/2024', category: DOCUMENT_CATEGORIES.TRADE_CONFIRMATION, date: '2024-02-07T10:00:00Z', fileSize: 84992 }),
      createDocument({ id: 'doc_dk_018', userId: 'usr_dk_005', accountId: 'acct_dk_004', name: 'Trade Confirmation - QQQ Buy 01/20/2024', category: DOCUMENT_CATEGORIES.TRADE_CONFIRMATION, date: '2024-01-20T13:45:00Z', fileSize: 82944 }),
      createDocument({ id: 'doc_dk_019', userId: 'usr_dk_005', accountId: 'acct_dk_001', name: 'Trade Confirmation - TLT Sell 01/08/2024', category: DOCUMENT_CATEGORIES.TRADE_CONFIRMATION, date: '2024-01-08T15:30:00Z', fileSize: 80896 }),
      createDocument({ id: 'doc_dk_020', userId: 'usr_dk_005', accountId: 'acct_dk_002', name: 'Trade Confirmation - VBTLX Buy 01/03/2024', category: DOCUMENT_CATEGORIES.TRADE_CONFIRMATION, date: '2024-01-03T09:00:00Z', fileSize: 78848 }),
      createDocument({ id: 'doc_dk_021', userId: 'usr_dk_005', accountId: 'acct_dk_004', name: 'Trade Confirmation - AAPL Buy 12/10/2023', category: DOCUMENT_CATEGORIES.TRADE_CONFIRMATION, date: '2023-12-10T11:15:00Z', fileSize: 77824 }),
      createDocument({ id: 'doc_dk_022', userId: 'usr_dk_005', accountId: 'acct_dk_003', name: 'Trade Confirmation - PG Buy 11/28/2023', category: DOCUMENT_CATEGORIES.TRADE_CONFIRMATION, date: '2023-11-28T13:30:00Z', fileSize: 76800 }),
      createDocument({ id: 'doc_dk_023', userId: 'usr_dk_005', accountId: 'acct_dk_001', name: 'Trade Confirmation - JNJ Sell 08/28/2023', category: DOCUMENT_CATEGORIES.TRADE_CONFIRMATION, date: '2023-08-28T13:15:00Z', fileSize: 75776 }),
      // Prospectuses
      createDocument({ id: 'doc_dk_024', userId: 'usr_dk_005', accountId: 'acct_dk_001', name: 'Vanguard Total Stock Market ETF Prospectus', category: DOCUMENT_CATEGORIES.PROSPECTUS, date: '2024-01-12T00:00:00Z', fileSize: 1024000 }),
      createDocument({ id: 'doc_dk_025', userId: 'usr_dk_005', accountId: 'acct_dk_002', name: 'Vanguard 500 Index Fund Admiral Prospectus', category: DOCUMENT_CATEGORIES.PROSPECTUS, date: '2024-01-08T00:00:00Z', fileSize: 962560 }),
      createDocument({ id: 'doc_dk_026', userId: 'usr_dk_005', accountId: 'acct_dk_003', name: 'Vanguard Dividend Appreciation ETF Prospectus', category: DOCUMENT_CATEGORIES.PROSPECTUS, date: '2023-12-18T00:00:00Z', fileSize: 897024 }),
      createDocument({ id: 'doc_dk_027', userId: 'usr_dk_005', accountId: 'acct_dk_004', name: 'Invesco QQQ Trust Prospectus', category: DOCUMENT_CATEGORIES.PROSPECTUS, date: '2023-12-10T00:00:00Z', fileSize: 983040 }),
    ],
  },
];

/**
 * Seed mock documents into storage if not already present.
 * Reads the current documents from storage; if the key does not exist or
 * contains no data, writes the full MOCK_DOCUMENTS array.
 * @returns {boolean} True if documents were seeded, false if they already existed
 */
export function seedDocuments() {
  const existing = getItem(DOCUMENTS_STORAGE_KEY);

  if (existing !== null && Array.isArray(existing) && existing.length > 0) {
    return false;
  }

  return setItem(DOCUMENTS_STORAGE_KEY, MOCK_DOCUMENTS);
}

/**
 * Get all documents for a specific user.
 * @param {string} userId - The user ID to retrieve documents for
 * @returns {Document[]} Array of documents for the user, or empty array if not found
 */
export function getDocumentsByUserId(userId) {
  if (!userId || typeof userId !== 'string') {
    return [];
  }

  const allDocuments = getItem(DOCUMENTS_STORAGE_KEY);

  if (!allDocuments || !Array.isArray(allDocuments)) {
    return [];
  }

  const userDocuments = allDocuments.find((entry) => entry.userId === userId);

  return userDocuments ? userDocuments.documents : [];
}

/**
 * Get documents for a specific account.
 * @param {string} userId - The user ID
 * @param {string} accountId - The account ID to filter by
 * @returns {Document[]} Array of documents for the account, or empty array if not found
 */
export function getDocumentsByAccountId(userId, accountId) {
  if (!accountId || typeof accountId !== 'string') {
    return [];
  }

  const userDocuments = getDocumentsByUserId(userId);

  return userDocuments.filter((doc) => doc.accountId === accountId);
}

/**
 * Get documents filtered by category.
 * @param {string} userId - The user ID
 * @param {string} category - The document category to filter by (e.g., 'Statement', 'Tax Form')
 * @returns {Document[]} Array of documents matching the category
 */
export function getDocumentsByCategory(userId, category) {
  if (!category || typeof category !== 'string') {
    return [];
  }

  const userDocuments = getDocumentsByUserId(userId);

  return userDocuments.filter((doc) => doc.category === category);
}

/**
 * Get a single document by its ID.
 * @param {string} userId - The user ID
 * @param {string} documentId - The document ID to find
 * @returns {Document | null} The document object, or null if not found
 */
export function getDocumentById(userId, documentId) {
  if (!documentId || typeof documentId !== 'string') {
    return null;
  }

  const userDocuments = getDocumentsByUserId(userId);

  return userDocuments.find((doc) => doc.id === documentId) || null;
}

/**
 * Get documents within a date range.
 * @param {string} userId - The user ID
 * @param {string | Date} startDate - The start date (inclusive)
 * @param {string | Date} endDate - The end date (inclusive)
 * @returns {Document[]} Array of documents within the date range
 */
export function getDocumentsByDateRange(userId, startDate, endDate) {
  if (!startDate || !endDate) {
    return [];
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return [];
  }

  const userDocuments = getDocumentsByUserId(userId);

  return userDocuments.filter((doc) => {
    const docDate = new Date(doc.date);
    return docDate >= start && docDate <= end;
  });
}

/**
 * Calculate document summary for a user.
 * @param {string} userId - The user ID
 * @returns {{ totalDocuments: number, statementCount: number, taxFormCount: number, tradeConfirmationCount: number, prospectusCount: number, totalFileSize: number }}
 */
export function getDocumentSummary(userId) {
  const documents = getDocumentsByUserId(userId);

  if (documents.length === 0) {
    return {
      totalDocuments: 0,
      statementCount: 0,
      taxFormCount: 0,
      tradeConfirmationCount: 0,
      prospectusCount: 0,
      totalFileSize: 0,
    };
  }

  let statementCount = 0;
  let taxFormCount = 0;
  let tradeConfirmationCount = 0;
  let prospectusCount = 0;
  let totalFileSize = 0;

  documents.forEach((doc) => {
    totalFileSize += doc.fileSize;

    switch (doc.category) {
      case DOCUMENT_CATEGORIES.STATEMENT:
        statementCount += 1;
        break;
      case DOCUMENT_CATEGORIES.TAX_FORM:
        taxFormCount += 1;
        break;
      case DOCUMENT_CATEGORIES.TRADE_CONFIRMATION:
        tradeConfirmationCount += 1;
        break;
      case DOCUMENT_CATEGORIES.PROSPECTUS:
        prospectusCount += 1;
        break;
      default:
        break;
    }
  });

  return {
    totalDocuments: documents.length,
    statementCount,
    taxFormCount,
    tradeConfirmationCount,
    prospectusCount,
    totalFileSize,
  };
}