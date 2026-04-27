/**
 * Integration tests for AccountsPage component.
 * Tests rendering of welcome banner, account summary cards, donut charts,
 * quick action buttons, and empty state for new users.
 * @module test/AccountsPage
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

// Mock sessionStore
let mockCurrentUser = {
  id: 'usr_jm_001',
  firstName: 'James',
  lastName: 'Morgan',
  email: 'james.morgan@example.com',
  phone: '5551234567',
  accounts: [
    {
      accountId: 'acct_jm_001',
      accountNumber: '8827164530',
      type: 'Individual',
      openedDate: '2019-06-12',
      status: 'active',
      riskProfile: 'Moderate',
      costBasisMethod: 'FIFO',
    },
    {
      accountId: 'acct_jm_002',
      accountNumber: '8827164531',
      type: 'Roth IRA',
      openedDate: '2020-01-05',
      status: 'active',
      riskProfile: 'Aggressive',
      costBasisMethod: 'Average Cost',
    },
  ],
  security: {
    twoFactorEnabled: true,
    twoFactorMethod: 'authenticator',
    lastPasswordChange: '2024-01-15T10:00:00Z',
    trustedDevices: ['MacBook Pro - Chrome'],
  },
};

vi.mock('../store/sessionStore.js', () => ({
  useSessionStore: vi.fn((selector) => {
    const state = {
      currentUser: mockCurrentUser,
      isAuthenticated: true,
    };
    return selector(state);
  }),
}));

// Mock holdings data
const mockHoldings = [
  {
    holdingId: 'hld_jm_001',
    accountId: 'acct_jm_001',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    quantity: 150,
    avgCost: 142.5,
    currentPrice: 189.84,
    marketValue: 28476.0,
    unrealizedGainLoss: { dollar: 7101.0, percent: 0.3321 },
    sector: 'Technology',
    assetType: 'Stock',
  },
  {
    holdingId: 'hld_jm_002',
    accountId: 'acct_jm_001',
    symbol: 'VOO',
    name: 'Vanguard S&P 500 ETF',
    quantity: 60,
    avgCost: 380.0,
    currentPrice: 462.35,
    marketValue: 27741.0,
    unrealizedGainLoss: { dollar: 4941.0, percent: 0.2167 },
    sector: 'Broad Market',
    assetType: 'ETF',
  },
  {
    holdingId: 'hld_jm_003',
    accountId: 'acct_jm_002',
    symbol: 'VTI',
    name: 'Vanguard Total Stock Market ETF',
    quantity: 120,
    avgCost: 205.8,
    currentPrice: 252.47,
    marketValue: 30296.4,
    unrealizedGainLoss: { dollar: 5600.4, percent: 0.2268 },
    sector: 'Broad Market',
    assetType: 'ETF',
  },
];

const mockSummary = {
  totalMarketValue: 86513.4,
  totalCostBasis: 68871.0,
  totalGainLoss: 17642.4,
  totalGainLossPercent: 0.2562,
  holdingsCount: 3,
};

const mockGetHoldings = vi.fn((userId) => {
  if (userId === 'usr_jm_001') {
    return { holdings: mockHoldings, summary: mockSummary };
  }
  return {
    holdings: [],
    summary: {
      totalMarketValue: 0,
      totalCostBasis: 0,
      totalGainLoss: 0,
      totalGainLossPercent: 0,
      holdingsCount: 0,
    },
  };
});

vi.mock('../store/userStore.js', () => ({
  useUserStore: vi.fn((selector) => {
    const state = {
      getHoldings: mockGetHoldings,
    };
    return selector(state);
  }),
}));

// Mock Toast
const mockShowInfoToast = vi.fn();

vi.mock('../components/Toast.jsx', () => ({
  showInfoToast: (...args) => mockShowInfoToast(...args),
  showSuccessToast: vi.fn(),
  showErrorToast: vi.fn(),
  Toaster: () => null,
}));

// Mock DonutChart to avoid Recharts rendering issues in tests
vi.mock('../components/DonutChart.jsx', () => ({
  default: ({ data, title }) => (
    <div data-testid="donut-chart">
      <span>{title}</span>
      {data && data.map((item, index) => (
        <span key={index}>{item.name}: {item.value}</span>
      ))}
    </div>
  ),
}));

import AccountsPage from './AccountsPage.jsx';

/**
 * Helper to render AccountsPage within a MemoryRouter.
 * @param {object} [options] - Render options
 * @param {string[]} [options.initialEntries=['/accounts']] - Initial router entries
 * @returns {object} Render result
 */
function renderAccountsPage(options = {}) {
  const { initialEntries = ['/accounts'] } = options;

  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <AccountsPage />
    </MemoryRouter>,
  );
}

describe('AccountsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCurrentUser = {
      id: 'usr_jm_001',
      firstName: 'James',
      lastName: 'Morgan',
      email: 'james.morgan@example.com',
      phone: '5551234567',
      accounts: [
        {
          accountId: 'acct_jm_001',
          accountNumber: '8827164530',
          type: 'Individual',
          openedDate: '2019-06-12',
          status: 'active',
          riskProfile: 'Moderate',
          costBasisMethod: 'FIFO',
        },
        {
          accountId: 'acct_jm_002',
          accountNumber: '8827164531',
          type: 'Roth IRA',
          openedDate: '2020-01-05',
          status: 'active',
          riskProfile: 'Aggressive',
          costBasisMethod: 'Average Cost',
        },
      ],
      security: {
        twoFactorEnabled: true,
        twoFactorMethod: 'authenticator',
        lastPasswordChange: '2024-01-15T10:00:00Z',
        trustedDevices: ['MacBook Pro - Chrome'],
      },
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('welcome banner', () => {
    it('renders the welcome banner with user first name', () => {
      renderAccountsPage();

      expect(screen.getByText(/Welcome back, James/i)).toBeInTheDocument();
    });

    it('displays the current date in the welcome banner', () => {
      renderAccountsPage();

      const now = new Date();
      const year = now.getFullYear();
      // The banner should contain the current year at minimum
      expect(screen.getByText(new RegExp(String(year)))).toBeInTheDocument();
    });

    it('displays total portfolio value when holdings exist', () => {
      renderAccountsPage();

      expect(screen.getByText('Total Portfolio Value')).toBeInTheDocument();
      expect(screen.getByText('$86,513.40')).toBeInTheDocument();
    });

    it('displays gain/loss indicator in the welcome banner', () => {
      renderAccountsPage();

      // Should show the gain amount
      expect(screen.getByText(/\+\$17,642\.40/)).toBeInTheDocument();
    });
  });

  describe('account summary cards', () => {
    it('renders the "Your Accounts" heading', () => {
      renderAccountsPage();

      expect(screen.getByText('Your Accounts')).toBeInTheDocument();
    });

    it('displays the Individual account card', () => {
      renderAccountsPage();

      expect(screen.getByText('Individual')).toBeInTheDocument();
    });

    it('displays the Roth IRA account card', () => {
      renderAccountsPage();

      expect(screen.getByText('Roth IRA')).toBeInTheDocument();
    });

    it('displays masked account numbers', () => {
      renderAccountsPage();

      // Account number 8827164530 should be masked as ••••••4530
      expect(screen.getByText('••••••4530')).toBeInTheDocument();
      expect(screen.getByText('••••••4531')).toBeInTheDocument();
    });

    it('displays account status badges', () => {
      renderAccountsPage();

      const activeBadges = screen.getAllByText('active');
      expect(activeBadges.length).toBeGreaterThanOrEqual(2);
    });

    it('displays risk profile for each account', () => {
      renderAccountsPage();

      expect(screen.getByText('Moderate')).toBeInTheDocument();
      expect(screen.getByText('Aggressive')).toBeInTheDocument();
    });

    it('displays cost basis method for each account', () => {
      renderAccountsPage();

      expect(screen.getByText('FIFO')).toBeInTheDocument();
      expect(screen.getByText('Average Cost')).toBeInTheDocument();
    });

    it('displays opened date for each account', () => {
      renderAccountsPage();

      expect(screen.getByText('06/12/2019')).toBeInTheDocument();
      expect(screen.getByText('01/05/2020')).toBeInTheDocument();
    });
  });

  describe('asset allocation donut charts', () => {
    it('renders the "Asset Allocation" heading', () => {
      renderAccountsPage();

      expect(screen.getByText('Asset Allocation')).toBeInTheDocument();
    });

    it('renders donut charts for sector and asset type allocation', () => {
      renderAccountsPage();

      const charts = screen.getAllByTestId('donut-chart');
      expect(charts.length).toBe(2);
    });

    it('renders the "By Sector" donut chart', () => {
      renderAccountsPage();

      expect(screen.getByText('By Sector')).toBeInTheDocument();
    });

    it('renders the "By Asset Type" donut chart', () => {
      renderAccountsPage();

      expect(screen.getByText('By Asset Type')).toBeInTheDocument();
    });

    it('passes sector allocation data to the donut chart', () => {
      renderAccountsPage();

      // The mock holdings have Technology and Broad Market sectors
      expect(screen.getByText(/Technology/)).toBeInTheDocument();
      expect(screen.getByText(/Broad Market/)).toBeInTheDocument();
    });

    it('passes asset type allocation data to the donut chart', () => {
      renderAccountsPage();

      // The mock holdings have Stock and ETF asset types
      expect(screen.getByText(/Stock/)).toBeInTheDocument();
      expect(screen.getByText(/ETF/)).toBeInTheDocument();
    });
  });

  describe('quick action buttons', () => {
    it('renders the Trade quick action button', () => {
      renderAccountsPage();

      expect(screen.getByText('Trade')).toBeInTheDocument();
    });

    it('renders the Transfer quick action button', () => {
      renderAccountsPage();

      expect(screen.getByText('Transfer')).toBeInTheDocument();
    });

    it('renders the Deposit quick action button', () => {
      renderAccountsPage();

      expect(screen.getByText('Deposit')).toBeInTheDocument();
    });

    it('renders the Withdraw quick action button', () => {
      renderAccountsPage();

      expect(screen.getByText('Withdraw')).toBeInTheDocument();
    });

    it('shows toast when Trade button is clicked', async () => {
      const user = userEvent.setup();
      renderAccountsPage();

      const tradeButton = screen.getByText('Trade').closest('button');
      await user.click(tradeButton);

      expect(mockShowInfoToast).toHaveBeenCalledWith('Trade — Coming Soon');
    });

    it('shows toast when Transfer button is clicked', async () => {
      const user = userEvent.setup();
      renderAccountsPage();

      const transferButton = screen.getByText('Transfer').closest('button');
      await user.click(transferButton);

      expect(mockShowInfoToast).toHaveBeenCalledWith('Transfer — Coming Soon');
    });

    it('shows toast when Deposit button is clicked', async () => {
      const user = userEvent.setup();
      renderAccountsPage();

      const depositButton = screen.getByText('Deposit').closest('button');
      await user.click(depositButton);

      expect(mockShowInfoToast).toHaveBeenCalledWith('Deposit — Coming Soon');
    });

    it('shows toast when Withdraw button is clicked', async () => {
      const user = userEvent.setup();
      renderAccountsPage();

      const withdrawButton = screen.getByText('Withdraw').closest('button');
      await user.click(withdrawButton);

      expect(mockShowInfoToast).toHaveBeenCalledWith('Withdraw — Coming Soon');
    });
  });

  describe('empty state for new users', () => {
    it('shows empty state when user has no accounts', () => {
      mockCurrentUser = {
        ...mockCurrentUser,
        accounts: [],
      };

      mockGetHoldings.mockReturnValue({
        holdings: [],
        summary: {
          totalMarketValue: 0,
          totalCostBasis: 0,
          totalGainLoss: 0,
          totalGainLossPercent: 0,
          holdingsCount: 0,
        },
      });

      renderAccountsPage();

      expect(screen.getByText('No Accounts Yet')).toBeInTheDocument();
      expect(
        screen.getByText(/Your account information will appear here/i),
      ).toBeInTheDocument();
    });

    it('does not show "Your Accounts" heading when user has no accounts', () => {
      mockCurrentUser = {
        ...mockCurrentUser,
        accounts: [],
      };

      mockGetHoldings.mockReturnValue({
        holdings: [],
        summary: {
          totalMarketValue: 0,
          totalCostBasis: 0,
          totalGainLoss: 0,
          totalGainLossPercent: 0,
          holdingsCount: 0,
        },
      });

      renderAccountsPage();

      expect(screen.queryByText('Your Accounts')).not.toBeInTheDocument();
    });

    it('does not show asset allocation section when user has no holdings', () => {
      mockCurrentUser = {
        ...mockCurrentUser,
        accounts: [],
      };

      mockGetHoldings.mockReturnValue({
        holdings: [],
        summary: {
          totalMarketValue: 0,
          totalCostBasis: 0,
          totalGainLoss: 0,
          totalGainLossPercent: 0,
          holdingsCount: 0,
        },
      });

      renderAccountsPage();

      expect(screen.queryByText('Asset Allocation')).not.toBeInTheDocument();
    });

    it('shows "No Holdings Yet" when user has accounts but no holdings', () => {
      mockGetHoldings.mockReturnValue({
        holdings: [],
        summary: {
          totalMarketValue: 0,
          totalCostBasis: 0,
          totalGainLoss: 0,
          totalGainLossPercent: 0,
          holdingsCount: 0,
        },
      });

      renderAccountsPage();

      expect(screen.getByText('No Holdings Yet')).toBeInTheDocument();
      expect(
        screen.getByText(/Start building your portfolio/i),
      ).toBeInTheDocument();
    });

    it('shows "Start Trading" button in empty holdings state', () => {
      mockGetHoldings.mockReturnValue({
        holdings: [],
        summary: {
          totalMarketValue: 0,
          totalCostBasis: 0,
          totalGainLoss: 0,
          totalGainLossPercent: 0,
          holdingsCount: 0,
        },
      });

      renderAccountsPage();

      expect(screen.getByText('Start Trading')).toBeInTheDocument();
    });

    it('shows toast when "Start Trading" button is clicked in empty state', async () => {
      const user = userEvent.setup();

      mockGetHoldings.mockReturnValue({
        holdings: [],
        summary: {
          totalMarketValue: 0,
          totalCostBasis: 0,
          totalGainLoss: 0,
          totalGainLossPercent: 0,
          holdingsCount: 0,
        },
      });

      renderAccountsPage();

      const startTradingButton = screen.getByText('Start Trading');
      await user.click(startTradingButton);

      expect(mockShowInfoToast).toHaveBeenCalledWith('Trade — Coming Soon');
    });
  });

  describe('data fetching', () => {
    it('calls getHoldings with the current user ID', () => {
      renderAccountsPage();

      expect(mockGetHoldings).toHaveBeenCalledWith('usr_jm_001');
    });

    it('does not show portfolio value when there are no holdings', () => {
      mockGetHoldings.mockReturnValue({
        holdings: [],
        summary: {
          totalMarketValue: 0,
          totalCostBasis: 0,
          totalGainLoss: 0,
          totalGainLossPercent: 0,
          holdingsCount: 0,
        },
      });

      renderAccountsPage();

      expect(screen.queryByText('Total Portfolio Value')).not.toBeInTheDocument();
    });
  });

  describe('quick actions still render for users with no accounts', () => {
    it('renders quick action buttons even when user has no accounts', () => {
      mockCurrentUser = {
        ...mockCurrentUser,
        accounts: [],
      };

      mockGetHoldings.mockReturnValue({
        holdings: [],
        summary: {
          totalMarketValue: 0,
          totalCostBasis: 0,
          totalGainLoss: 0,
          totalGainLossPercent: 0,
          holdingsCount: 0,
        },
      });

      renderAccountsPage();

      expect(screen.getByText('Trade')).toBeInTheDocument();
      expect(screen.getByText('Transfer')).toBeInTheDocument();
      expect(screen.getByText('Deposit')).toBeInTheDocument();
      expect(screen.getByText('Withdraw')).toBeInTheDocument();
    });
  });
});