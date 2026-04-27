# Changelog

All notable changes to the Meridian Wealth Portal project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-02-12

### Added

#### Authentication & Session Management
- Pre-seeded user authentication with five demo user profiles (James Morgan, Sarah Chen, Robert Patel, Emily Watson, David Kim)
- Click-to-login user card selection on the login page with avatar initials, account type badges, and last login timestamps
- New user registration with full form validation (name, email, phone, password strength, date of birth with 18+ check, account type selection)
- Zustand-based session store with localStorage hydration on app load
- Cross-tab session synchronization via `storage` event listener
- Route protection via `RouteProtector` component redirecting unauthenticated users to `/login`
- Automatic redirect from login/signup pages when already authenticated

#### Navigation & Layout
- Fixed top navigation bar with responsive hamburger menu for mobile screens (<768px)
- Desktop navigation links: Accounts, Holdings, Activity, Documents, Products & Services
- Profile dropdown menu using @headlessui/react `Menu` with keyboard navigation and ARIA roles
- Profile dropdown items: Profile, Communication Preferences, Security, Bank Management, Beneficiaries, Cost Basis, and Logout
- Active route highlighting with underline indicator on desktop and left border on mobile
- Escape key and outside click handling for mobile menu and profile dropdown
- Global error banner component for storage failures and browser compatibility issues
- Toast notification system via react-hot-toast with success, error, and info variants

#### Accounts Dashboard (`/accounts`)
- Welcome banner with user first name, current date, total portfolio value, and gain/loss indicator
- Quick action buttons: Trade, Transfer, Deposit, Withdraw (with "Coming Soon" toast)
- Account summary cards displaying account type, masked account number, market value, gain/loss, opened date, risk profile, and cost basis method
- Asset allocation donut charts (by sector and by asset type) using Recharts `PieChart` with custom tooltip and legend
- Empty state for new users with no accounts or holdings

#### Holdings Page (`/portfolio`)
- Sortable, searchable data table of all user holdings
- Table columns: Symbol, Name, Quantity, Avg Cost, Current Price, Market Value, Unrealized Gain/Loss
- Portfolio summary cards: Total Market Value, Total Cost Basis, Total Unrealized Gain/Loss, Total Return
- Color-coded gain/loss display (green for gains, red for losses)
- Empty state with "Start Trading" call-to-action

#### Activity Page (`/transactions`)
- Transaction history with client-side filtering: date range (from/to), transaction type dropdown, symbol search
- Activity summary cards: Total Transactions, Total Buys, Total Sells, Dividends, Pending count
- DataTable with columns: Date, Type (badge), Symbol, Description, Quantity, Price, Amount, Status (badge)
- Clear Filters button and results count footer
- Default sort by date descending
- Empty state for users with no transaction history

#### Documents Page (`/documents`)
- Documents grouped by category in collapsible sections: Statements, Tax Documents, Trade Confirmations, Prospectuses
- Document summary cards: Total Documents, Statements, Tax Forms, Trade Confirmations, Total Size
- Each document displays name, date, file size, and a download button
- Simulated download with success toast notification
- Empty state for users with no documents

#### Products & Services Page (`/products`)
- Investment products grid grouped by category: Stocks, ETFs, Mutual Funds, Bonds, Options, Retirement Accounts
- Product cards showing name, description, minimum investment, and risk level badge
- Platform services section: Research Tools, Portfolio Analysis, Tax Optimization, Financial Planning, Mobile Trading
- Service cards with feature bullet lists and check icons

#### Profile Management (`/profile`)
- Four editable sections: Personal Information, Address, Employment, Tax Information
- Inline edit mode with Save/Cancel buttons per section
- Form validation for all fields (name, email, phone, address, ZIP code, employment status, tax status)
- Read-only display of date of birth and SSN
- Profile summary banner with user avatar initials, full name, email, and last login date
- Changes persist to localStorage and update session state

#### Communication Preferences (`/notifications`)
- Six notification types: Account Alerts, Trade Confirmations, Market Updates, Security Alerts, Statements Available, Promotional
- Three delivery channels per type: Email, SMS, In-App
- Toggle switches using @headlessui/react `Switch` with immediate persistence
- Notification summary showing enabled channel count
- Security alerts default to all channels enabled

#### Security Settings (`/settings`)
- Change Password section with current password verification, new password input, confirm password, and password strength meter
- Two-Factor Authentication toggle with method selection (Authenticator App or SMS)
- Simulated QR code display for authenticator app setup
- Backup codes generation and clipboard copy functionality
- Login history table with date, browser/device, IP address, location, and status
- Trusted devices list
- Security overview banner showing 2FA status, last password change, and trusted device count

#### Bank Management (`/bank-management`)
- Linked bank accounts list with bank name, account type, last 4 digits, routing number, status badge, and linked date
- Add Bank modal with form validation (bank name, account type, 9-digit routing number, account number)
- New banks appear as "Pending Verification" and transition to "Verified" after 3-second simulated verification
- Remove bank with confirmation modal
- Bank summary cards: Total Banks, Verified, Pending, Checking/Savings count
- Empty state with "Add Bank Account" call-to-action

#### Beneficiaries (`/beneficiaries`)
- Beneficiaries grouped by type: Primary and Contingent
- Add/Edit beneficiary modal with fields: Full Name, Relationship, Beneficiary Type, Share Percentage, Date of Birth
- Share percentage validation ensuring primary and contingent groups each total 100%
- Remove beneficiary with confirmation modal
- Summary cards: Total Beneficiaries, Primary count, Primary Shares, Contingent Shares
- Share completion indicators (Complete badge or remaining percentage)
- Empty state with "Add Beneficiary" call-to-action

#### Cost Basis / Tax Center (`/tax-center`)
- Cost basis method selector: FIFO, LIFO, Specific Identification, Average Cost, Highest Cost, Lowest Cost
- Method descriptions and available methods overview grid
- Confirmation modal when changing cost basis method with impact warning
- Tax lot details grouped by symbol in expandable/collapsible sections
- Tax lot table columns: Lot ID, Purchase Date, Holding Period (Short-Term/Long-Term badge), Quantity, Cost/Share, Total Cost, Current Value, Gain/Loss
- Symbol-level and portfolio-level gain/loss summaries
- Expand All / Collapse All toggle
- Holding period summary: Short-Term lots and Long-Term lots with respective gain/loss
- Empty state for users with no tax lots

#### Data Layer & Storage
- localStorage persistence with automatic sessionStorage fallback
- Unified storage abstraction layer (`storageUtils.js`) with JSON serialization, error handling, and `onStorageError` callback
- Mock data seeding on first app load for users, holdings, activity, documents, banks, beneficiaries, cost basis, products, services, and preferences
- Seed status tracking to prevent duplicate seeding
- Data migration utility for storage key changes
- Schema validation utility for stored data integrity
- Storage quota monitoring with warning threshold

#### Reusable Components
- `Badge` — colored pill component with auto-variant detection from label text
- `DataTable` — sortable, searchable table with column header click sorting (asc/desc/none cycle)
- `DonutChart` — Recharts-based donut/pie chart with responsive container, custom tooltip, and legend
- `EmptyState` — centered placeholder with icon, title, message, and optional CTA button
- `ErrorBanner` — persistent error banner with Refresh and Reset Data actions
- `FormInput` — labeled input supporting text, email, password, tel, date, select, and number types with inline error display
- `Modal` — accessible dialog using @headlessui/react `Dialog` with focus trapping, Escape to close, and backdrop blur
- `PasswordStrength` — visual strength meter evaluating length, uppercase, lowercase, numbers, and special characters
- `Toggle` — accessible on/off switch using @headlessui/react `Switch`
- `UserCard` — clickable card with avatar, name, account type badge, email, and last login
- `Toast` — pre-configured react-hot-toast wrapper with success, error, and info helpers

#### Utilities
- `formatters.js` — formatCurrency, formatDate, formatDateTime, formatPercentage, formatPhoneNumber, formatAccountNumber, calculateGainLoss
- `validators.js` — validateRequired, validateEmail, validatePhone, validatePassword, validateConfirmPassword, validateName, validateDateOfBirth
- `constants.js` — STORAGE_KEYS, ACCOUNT_TYPES, ROUTES, COST_BASIS_METHODS, TRANSACTION_TYPES, DOCUMENT_CATEGORIES, STATUS
- `accessibilityUtils.js` — applyAria, enableKeyboardNavigation, trapFocus, getAriaProps, generateAriaId, announceToScreenReader
- `complianceChecker.js` — parseBrowserInfo, checkBrowser, handleCorruptedData, checkStorageQuota, runComplianceChecks

#### Accessibility (WCAG 2.1 AA)
- Semantic HTML with proper heading hierarchy
- ARIA landmarks: navigation, main, dialog, alert, status, menu, menuitem
- Keyboard navigation support throughout: Tab, Shift+Tab, Arrow keys, Enter, Space, Escape
- Focus management with visible focus rings (`focus:ring-2 focus:ring-primary-500`)
- Screen reader announcements for dynamic content changes
- Color contrast compliance with Tailwind custom color palette
- `aria-label`, `aria-expanded`, `aria-controls`, `aria-current`, `aria-sort`, `aria-invalid`, `aria-describedby` attributes on interactive elements
- Skip navigation support via semantic structure

#### Responsive Design
- Mobile-first Tailwind CSS with breakpoints: `sm:` (640px), `md:` (768px), `lg:` (1024px), `xl:` (1280px)
- Hamburger menu for mobile navigation (<768px)
- Responsive grid layouts for account cards, summary cards, and product grids
- Horizontal scroll on data tables for narrow viewports
- Max-width content container (`max-w-7xl`) with responsive padding

#### Testing
- Unit tests for `sessionStore` covering login, logout, hydration, cross-tab sync, and error banner
- Unit tests for `storageUtils` covering setItem, getItem, removeItem, clear, migrate, validateSchema, and fallback behavior
- Integration tests for `LoginPage` covering user card rendering, login flow, navigation, and redirect
- Integration tests for `SignupPage` covering form rendering, validation, submission, and error handling
- Integration tests for `AccountsPage` covering welcome banner, account cards, donut charts, quick actions, and empty states
- Integration tests for `Navbar` covering navigation links, active route highlighting, hamburger menu, and profile dropdown
- Integration tests for `ProfileDropdown` covering menu items, keyboard navigation, logout, and outside click

#### Build & Configuration
- Vite 5 build configuration with React plugin and path aliases
- Tailwind CSS 3.4 with custom color palette (primary, success, danger, warning)
- PostCSS with Tailwind and Autoprefixer plugins
- Vitest configuration with jsdom environment, global test setup, and v8 coverage
- Vercel deployment configuration with SPA rewrites
- Environment variable support via `.env` with `VITE_APP_NAME`, `VITE_API_BASE_URL`, `VITE_APP_ENV`