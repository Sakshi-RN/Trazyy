// utils/formatCurrency.js

/**
 * Formats a number into Indian Rupee currency format.
 * Example: 30000000 => ₹3,00,00,000
 *
 * @param {number|string} value - The numeric value to format
 * @returns {string} Formatted INR currency string
 */
export const formatCurrency = (value) => {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return '₹0';
  }

  try {
    return Number(value).toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  } catch (error) {
    console.warn('formatCurrency error:', error.message);
    return '₹0';
  }
};

/**
 * Formats a plain number using Indian number grouping.
 * Example: 30000000 => 3,00,00,000
 *
 * @param {number|string} value - The numeric value to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (value) => {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return '0';
  }

  try {
    return Number(value).toLocaleString('en-IN', {
      maximumFractionDigits: 0,
    });
  } catch (error) {
    console.warn('formatNumber error:', error.message);
    return '0';
  }
};
