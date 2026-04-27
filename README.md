# Meridian Wealth Portal

A comprehensive single-page application (SPA) for wealth management, built with React 18+, Vite, and Tailwind CSS. The portal provides a full-featured investment dashboard with account management, portfolio tracking, transaction history, document management, and administrative tools — all powered by client-side mock data and localStorage persistence.

---

## Table of Contents

- [Project Description](#project-description)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Folder Structure](#folder-structure)
- [Available Scripts](#available-scripts)
- [Pre-seeded Users](#pre-seeded-users)
- [Architecture Notes](#architecture-notes)
- [Browser Support](#browser-support)
- [License](#license)

---

## Project Description

Meridian Wealth Portal is a client-side wealth management dashboard that simulates a full brokerage platform experience. It features pre-seeded demo accounts with realistic portfolio data, transaction histories, documents, and account settings. The application runs entirely in the browser with no backend dependency — all data is persisted in localStorage and seeded automatically on first load.

The portal is designed to demonstrate modern React patterns including component composition, Zustand state management, client-side routing with React Router v6, accessible UI components with Headless UI, and responsive design with Tailwind CSS.

---

## Features

1. **Authentication & Session Management** — Pre-seeded user login via clickable user cards, new user registration with full form validation, Zustand-based session store with localStorage hydration, and cross-tab session synchronization.

2. **Navigation & Layout** — Fixed top navigation bar with responsive hamburger menu for mobile, desktop navigation links, profile dropdown menu with keyboard navigation and ARIA roles, and active route highlighting.

3. **Accounts Dashboard** — Welcome banner with portfolio value and gain/loss indicator, quick action buttons (Trade, Transfer, Deposit, Withdraw), account summary cards with masked account numbers, and asset allocation donut charts by sector and asset type.

4. **Holdings Page** — Sortable, searchable data table of all user holdings with columns for symbol, name, quantity, average cost, current price, market value, and unrealized gain/loss. Portfolio summary cards and color-coded gain/loss display.

5. **Activity Page** — Transaction history with client-side filtering by date range, transaction type, and symbol search. Activity summary cards and sortable DataTable with type and status badges.

6. **Documents Page** — Documents grouped by category (Statements, Tax Documents, Trade Confirmations, Prospectuses) in collapsible sections with simulated download functionality.

7. **Products & Services Page** — Investment products grid grouped by category with product cards showing minimum investment and risk level. Platform services section with feature bullet lists.

8. **Profile Management** — Four editable sections (Personal Information, Address, Employment, Tax Information) with inline edit mode, form validation, and persistence to localStorage.

9. **Communication Preferences** — Six notification types with three delivery channels (Email, SMS, In-App) using toggle switches with immediate persistence.

10. **Security Settings** — Change password with strength meter, two-factor authentication toggle with authenticator app QR code and SMS options, backup codes generation, login history table, and trusted devices list.

11. **Bank Management** — Linked bank accounts list with add/remove functionality. New banks appear as "Pending Verification" and transition to "Verified" after simulated verification.

12. **Beneficiaries** — Beneficiaries grouped by type (Primary, Contingent) with add/edit/remove modals. Share percentage validation ensuring each group totals 100%.

13. **Cost Basis / Tax Center** — Cost basis method selector with descriptions, confirmation modal on method change, and expandable tax lot details grouped by symbol with holding period badges.

14. **Reusable Component Library** — Badge, DataTable, DonutChart, EmptyState, ErrorBanner, FormInput, Modal, PasswordStrength, Toggle, UserCard, and Toast components.

15. **Accessibility (WCAG 2.1 AA)** — Semantic HTML, ARIA landmarks, keyboard navigation, focus management, screen reader announcements, and color contrast compliance.

16. **Responsive Design** — Mobile-first Tailwind CSS with breakpoints at 640px, 768px, 1024px, and 1280px. Hamburger menu, responsive grids, and horizontal scroll on data tables.

17. **Data Layer & Storage** — localStorage persistence with sessionStorage fallback, mock data seeding on first load, storage quota monitoring, and schema validation utilities.

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| [React](https://react.dev/) | 18.2+ | UI component library |
| [Vite](https://vitejs.dev/) | 5.1+ | Build tool and dev server |
| [Tailwind CSS](https://tailwindcss.com/) | 3.4+ | Utility-first CSS framework |
| [Zustand](https://zustand-demo.pmnd.rs/) | 4.5+ | Lightweight state management |
| [React Router](https://reactrouter.com/) | 6.22+ | Client-side routing |
| [Recharts](https://recharts.org/) | 2.12+ | Charting library (donut/pie charts) |
| [Headless UI](https://headlessui.com/) | 1.7+ | Accessible UI primitives (Menu, Dialog, Switch, Transition) |
| [react-hot-toast](https://react-hot-toast.com/) | 2.4+ | Toast notification system |
| [Heroicons](https://heroicons.com/) | 2.1+ | SVG icon library |
| [PropTypes](https://www.npmjs.com/package/prop-types) | 15.8+ | Runtime prop type checking |
| [Vitest](https://vitest.dev/) | 1.3+ | Unit and integration testing |
| [Testing Library](https://testing-library.com/) | 14.2+ | React component testing utilities |

---

## Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x

Verify your setup:

```bash
node --version
npm --version
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd meridian-wealth-portal
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### 4. Build for production

```bash
npm run build
```

The production build is output to the `dist/` directory.

### 5. Preview the production build

```bash
npm run preview
```

---

## Folder Structure

```
meridian-wealth-portal/
├── public/                     # Static assets
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── Badge.jsx           # Colored pill/status badge
│   │   ├── DataTable.jsx       # Sortable, searchable data table
│   │   ├── DonutChart.jsx      # Recharts-based donut/pie chart
│   │   ├── EmptyState.jsx      # Placeholder for empty data
│   │   ├── ErrorBanner.jsx     # Global error banner
│   │   ├── FormInput.jsx       # Labeled form input with validation
│   │   ├── Layout.jsx          # Authenticated page layout wrapper
│   │   ├── Modal.jsx           # Accessible dialog overlay
│   │   ├── Navbar.jsx          # Main navigation bar
│   │   ├── PasswordStrength.jsx # Password strength meter
│   │   ├── ProfileDropdown.jsx # Profile menu dropdown
│   │   ├── RouteProtector.jsx  # Authentication guard
│   │   ├── Toast.jsx           # Toast notification helpers
│   │   ├── Toggle.jsx          # Accessible on/off switch
│   │   └── UserCard.jsx        # Clickable user card for login
│   ├── mock/                   # Mock data modules
│   │   ├── activity.js         # Transaction activity data
│   │   ├── banks.js            # Linked bank accounts data
│   │   ├── beneficiaries.js    # Beneficiaries data
│   │   ├── costBasis.js        # Cost basis and tax lot data
│   │   ├── documents.js        # Document data
│   │   ├── holdings.js         # Portfolio holdings data
│   │   ├── products.js         # Products and services catalog
│   │   ├── seedData.js         # Master data seeding orchestrator
│   │   └── users.js            # Pre-seeded user profiles
│   ├── pages/                  # Route-level page components
│   │   ├── AccountsPage.jsx    # Accounts overview dashboard
│   │   ├── ActivityPage.jsx    # Transaction history
│   │   ├── BanksPage.jsx       # Bank management
│   │   ├── BeneficiariesPage.jsx # Beneficiaries management
│   │   ├── CommunicationsPage.jsx # Notification preferences
│   │   ├── CostBasisPage.jsx   # Cost basis / tax center
│   │   ├── DocumentsPage.jsx   # Documents viewer
│   │   ├── HoldingsPage.jsx    # Portfolio holdings
│   │   ├── LoginPage.jsx       # User login
│   │   ├── NotFoundPage.jsx    # 404 page
│   │   ├── ProductsPage.jsx    # Products & services
│   │   ├── ProfilePage.jsx     # Profile management
│   │   ├── SecurityPage.jsx    # Security settings
│   │   └── SignupPage.jsx      # New user registration
│   ├── store/                  # Zustand state stores
│   │   ├── sessionStore.js     # Session/auth state management
│   │   └── userStore.js        # User data CRUD operations
│   ├── test/                   # Test setup and utilities
│   │   └── setup.js            # Vitest global test setup
│   ├── utils/                  # Shared utility modules
│   │   ├── accessibilityUtils.js # ARIA and keyboard navigation helpers
│   │   ├── complianceChecker.js  # Browser compliance checks
│   │   ├── constants.js        # Application-wide constants
│   │   ├── formatters.js       # Data formatting utilities
│   │   ├── storageUtils.js     # localStorage abstraction layer
│   │   └── validators.js       # Form field validation utilities
│   ├── App.jsx                 # Root application component with routing
│   ├── index.css               # Tailwind CSS entry point
│   └── main.jsx                # Application entry point
├── .env.example                # Environment variable template
├── .gitignore                  # Git ignore rules
├── CHANGELOG.md                # Version changelog
├── DEPLOYMENT.md               # Deployment guide
├── index.html                  # HTML entry point
├── package.json                # Dependencies and scripts
├── postcss.config.js           # PostCSS configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── vercel.json                 # Vercel SPA rewrite rules
├── vite.config.js              # Vite build configuration
└── vitest.config.js            # Vitest test configuration
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server on port 3000 with hot module replacement |
| `npm run build` | Build the application for production into the `dist/` directory |
| `npm run preview` | Preview the production build locally |
| `npm test` | Run the full test suite with Vitest |
| `npm run test:watch` | Run tests in watch mode for development |

---

## Pre-seeded Users

The application ships with five demo user profiles that are automatically seeded into localStorage on first load. Click any user card on the login page to sign in — no password entry is required.

| Name | Email | Account Types | Risk Profile |
|---|---|---|---|
| **James Morgan** | james.morgan@example.com | Individual, Roth IRA | Moderate / Aggressive |
| **Sarah Chen** | sarah.chen@example.com | Individual | Aggressive |
| **Robert Patel** | robert.patel@example.com | Joint, Retirement IRA, Trust | Moderate / Conservative |
| **Emily Watson** | emily.watson@example.com | Individual, Roth IRA | Conservative / Moderate |
| **David Kim** | david.kim@example.com | Joint, Retirement IRA, Trust, Custodial | Conservative / Moderate |

Each user has pre-populated holdings, transaction history, documents, linked banks, beneficiaries, and cost basis data. New users can also be created via the registration page.

All demo accounts share the password `Meridian@2024` (used only for the change password feature verification).

---

## Architecture Notes

### Single-Page Application

The application is a client-side SPA using React Router v6 for routing. All navigation is handled in the browser — no server-side rendering or API calls are made. The `vercel.json` file configures SPA rewrites for production deployment.

### State Management

- **Session Store** (`sessionStore.js`) — Manages authentication state using Zustand. Hydrates from localStorage on app load and supports cross-tab synchronization via the `storage` event listener.
- **User Store** (`userStore.js`) — Provides centralized CRUD operations for all user-related data including holdings, activity, documents, banks, beneficiaries, and cost basis. All mutations persist to localStorage.

### Data Persistence

All application data is stored in the browser's localStorage with an automatic sessionStorage fallback. The storage abstraction layer (`storageUtils.js`) handles JSON serialization, error recovery, and quota monitoring. Mock data is seeded on first load via `seedData.js` and tracked with a seed status flag to prevent duplicate seeding.

### Component Architecture

- **Page components** (`src/pages/`) are route-level components that compose reusable components and read from Zustand stores.
- **Reusable components** (`src/components/`) are presentation-focused with PropTypes validation and accept data via props.
- **Layout component** wraps all authenticated routes with the Navbar, ErrorBanner, and Toaster.
- **RouteProtector** guards authenticated routes and redirects unauthenticated users to `/login`.

### Routing

| Path | Component | Auth Required |
|---|---|---|
| `/login` | LoginPage | No |
| `/register` | SignupPage | No |
| `/accounts` | AccountsPage | Yes |
| `/portfolio` | HoldingsPage | Yes |
| `/transactions` | ActivityPage | Yes |
| `/documents` | DocumentsPage | Yes |
| `/products` | ProductsPage | Yes |
| `/profile` | ProfilePage | Yes |
| `/notifications` | CommunicationsPage | Yes |
| `/settings` | SecurityPage | Yes |
| `/bank-management` | BanksPage | Yes |
| `/beneficiaries` | BeneficiariesPage | Yes |
| `/tax-center` | CostBasisPage | Yes |
| `*` | NotFoundPage | No |

---

## Browser Support

The application supports the latest 2 major versions of the following browsers:

| Browser | Minimum Version |
|---|---|
| Chrome | 120+ |
| Edge | 120+ |
| Safari | 16+ |
| Firefox | 121+ |

The compliance checker (`complianceChecker.js`) detects unsupported browsers and displays a warning banner. The application requires localStorage or sessionStorage to be available and functional.

---

## License

This project is private and proprietary. All rights reserved. Unauthorized copying, distribution, or modification of this software is strictly prohibited.