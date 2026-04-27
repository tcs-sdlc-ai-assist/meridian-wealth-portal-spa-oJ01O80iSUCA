/**
 * Products & Services page rendered at /products.
 * Displays two sections: Investment Products (grid of cards showing name,
 * description, category, min investment, risk level) and Platform Services
 * (list of service cards with name, description, and feature bullet points).
 * All data from mock/products.js. Styled with Tailwind card grid layout.
 * @module pages/ProductsPage
 */

import React, { useMemo } from 'react';
import {
  CubeIcon,
  WrenchScrewdriverIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { getAllProducts, getAllServices, PRODUCT_CATEGORIES, RISK_LEVELS } from '../mock/products.js';
import Badge from '../components/Badge.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { formatCurrency } from '../utils/formatters.js';

/**
 * Map risk level to badge variant.
 * @type {Record<string, string>}
 */
const RISK_VARIANT_MAP = {
  [RISK_LEVELS.LOW]: 'success',
  [RISK_LEVELS.MODERATE]: 'pending',
  [RISK_LEVELS.HIGH]: 'failed',
  [RISK_LEVELS.VERY_HIGH]: 'error',
};

/**
 * Map product category to a display color class for the category badge.
 * @type {Record<string, string>}
 */
const CATEGORY_VARIANT_MAP = {
  [PRODUCT_CATEGORIES.STOCKS]: 'info',
  [PRODUCT_CATEGORIES.ETFS]: 'success',
  [PRODUCT_CATEGORIES.MUTUAL_FUNDS]: 'pending',
  [PRODUCT_CATEGORIES.BONDS]: 'neutral',
  [PRODUCT_CATEGORIES.OPTIONS]: 'failed',
  [PRODUCT_CATEGORIES.RETIREMENT_ACCOUNTS]: 'info',
};

/**
 * Group products by category.
 * @param {Array} products - Array of product objects
 * @returns {Record<string, Array>} Products grouped by category
 */
function groupProductsByCategory(products) {
  if (!products || !Array.isArray(products) || products.length === 0) {
    return {};
  }

  const grouped = {};

  products.forEach((product) => {
    const category = product.category || 'Other';
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(product);
  });

  return grouped;
}

/**
 * Category display order.
 * @type {string[]}
 */
const CATEGORY_ORDER = [
  PRODUCT_CATEGORIES.STOCKS,
  PRODUCT_CATEGORIES.ETFS,
  PRODUCT_CATEGORIES.MUTUAL_FUNDS,
  PRODUCT_CATEGORIES.BONDS,
  PRODUCT_CATEGORIES.OPTIONS,
  PRODUCT_CATEGORIES.RETIREMENT_ACCOUNTS,
];

/**
 * ProductCard component for rendering a single product card.
 * @param {object} props - Component props
 * @param {object} props.product - The product object
 * @returns {React.ReactElement} The ProductCard component
 */
function ProductCard({ product }) {
  return (
    <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-semibold text-gray-900 leading-tight">
          {product.name}
        </h4>
        <Badge
          label={product.riskLevel}
          variant={RISK_VARIANT_MAP[product.riskLevel] || 'neutral'}
          size="xs"
        />
      </div>
      <p className="mt-2 flex-1 text-xs text-gray-500 leading-relaxed">
        {product.description}
      </p>
      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
        <div className="flex items-center gap-1.5">
          <CurrencyDollarIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
          <span className="text-xs text-gray-600">
            Min: {product.minInvestment === 0 ? '$0' : formatCurrency(product.minInvestment, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <ShieldCheckIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
          <span className="text-xs text-gray-600">
            {product.riskLevel} Risk
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * ServiceCard component for rendering a single service card.
 * @param {object} props - Component props
 * @param {object} props.service - The service object
 * @returns {React.ReactElement} The ServiceCard component
 */
function ServiceCard({ service }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <h4 className="text-base font-semibold text-gray-900">
        {service.name}
      </h4>
      <p className="mt-2 text-sm text-gray-500 leading-relaxed">
        {service.description}
      </p>
      {service.features && service.features.length > 0 && (
        <ul className="mt-4 space-y-2">
          {service.features.map((feature, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-sm text-gray-600"
            >
              <CheckCircleIcon
                className="mt-0.5 h-4 w-4 flex-shrink-0 text-success-500"
                aria-hidden="true"
              />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * ProductsPage component for displaying investment products and platform services.
 * Shows a grid of product cards grouped by category and a list of service cards.
 * @returns {React.ReactElement} The ProductsPage component
 */
function ProductsPage() {
  /**
   * Get all products from storage.
   */
  const products = useMemo(() => getAllProducts(), []);

  /**
   * Get all services from storage.
   */
  const services = useMemo(() => getAllServices(), []);

  /**
   * Group products by category.
   */
  const groupedProducts = useMemo(() => groupProductsByCategory(products), [products]);

  const hasProducts = products.length > 0;
  const hasServices = services.length > 0;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Products & Services</h1>
        <p className="mt-1 text-sm text-gray-500">
          Explore our investment products and platform services to help you achieve your financial goals
        </p>
      </div>

      {/* Investment Products Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <CubeIcon className="h-6 w-6 text-primary-600" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-gray-900">Investment Products</h2>
        </div>

        {!hasProducts && (
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <EmptyState
              icon={<CubeIcon className="h-12 w-12" />}
              title="No Products Available"
              message="Investment products are not available at this time. Please check back later."
            />
          </div>
        )}

        {hasProducts && (
          <div className="space-y-6">
            {CATEGORY_ORDER.map((category) => {
              const categoryProducts = groupedProducts[category];

              if (!categoryProducts || categoryProducts.length === 0) {
                return null;
              }

              return (
                <div key={category}>
                  <div className="mb-3 flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-gray-700">{category}</h3>
                    <Badge
                      label={`${categoryProducts.length}`}
                      variant={CATEGORY_VARIANT_MAP[category] || 'neutral'}
                      size="xs"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {categoryProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Platform Services Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <WrenchScrewdriverIcon className="h-6 w-6 text-primary-600" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-gray-900">Platform Services</h2>
        </div>

        {!hasServices && (
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <EmptyState
              icon={<WrenchScrewdriverIcon className="h-12 w-12" />}
              title="No Services Available"
              message="Platform services are not available at this time. Please check back later."
            />
          </div>
        )}

        {hasServices && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductsPage;