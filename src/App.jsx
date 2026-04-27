/**
 * Root application component.
 * Sets up React Router v6 with BrowserRouter, defines all routes,
 * seeds mock data on mount, renders toast notifications,
 * and initializes cross-tab session sync.
 * @module App
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { seedAllData } from './mock/seedData.js';
import { useSessionStore } from './store/sessionStore.js';
import { ROUTES } from './utils/constants.js';
import RouteProtector from './components/RouteProtector.jsx';
import Layout from './components/Layout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import AccountsPage from './pages/AccountsPage.jsx';
import HoldingsPage from './pages/HoldingsPage.jsx';
import ActivityPage from './pages/ActivityPage.jsx';
import DocumentsPage from './pages/DocumentsPage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import CommunicationsPage from './pages/CommunicationsPage.jsx';
import SecurityPage from './pages/SecurityPage.jsx';
import BanksPage from './pages/BanksPage.jsx';
import BeneficiariesPage from './pages/BeneficiariesPage.jsx';
import CostBasisPage from './pages/CostBasisPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

/**
 * App component — root of the application.
 * Seeds mock data on first mount, initializes cross-tab session sync,
 * and renders the full route tree with React Router v6.
 * @returns {React.ReactElement} The App component
 */
function App() {
  const syncAcrossTabs = useSessionStore((state) => state.syncAcrossTabs);

  /**
   * Seed mock data on initial mount.
   */
  useEffect(() => {
    seedAllData();
  }, []);

  /**
   * Initialize cross-tab session synchronization.
   */
  useEffect(() => {
    const cleanup = syncAcrossTabs();
    return cleanup;
  }, [syncAcrossTabs]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<SignupPage />} />

        {/* Authenticated routes */}
        <Route element={<RouteProtector />}>
          <Route element={<Layout />}>
            {/* Redirect root to accounts */}
            <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.ACCOUNTS} replace />} />
            <Route path={ROUTES.DASHBOARD} element={<Navigate to={ROUTES.ACCOUNTS} replace />} />

            {/* Main pages */}
            <Route path={ROUTES.ACCOUNTS} element={<AccountsPage />} />
            <Route path={ROUTES.PORTFOLIO} element={<HoldingsPage />} />
            <Route path={ROUTES.TRANSACTIONS} element={<ActivityPage />} />
            <Route path={ROUTES.DOCUMENTS} element={<DocumentsPage />} />
            <Route path="/products" element={<ProductsPage />} />

            {/* Profile and settings pages */}
            <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
            <Route path={ROUTES.NOTIFICATIONS} element={<CommunicationsPage />} />
            <Route path={ROUTES.SETTINGS} element={<SecurityPage />} />
            <Route path="/bank-management" element={<BanksPage />} />
            <Route path="/beneficiaries" element={<BeneficiariesPage />} />
            <Route path={ROUTES.TAX_CENTER} element={<CostBasisPage />} />
          </Route>
        </Route>

        {/* Catch-all 404 */}
        <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;