/**
 * Format a number as Pakistani Rupee currency
 * @param {number} amount
 * @returns {string} e.g. "Rs. 2,450"
 */
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return 'Rs. 0';
  }

  const rounded = Math.round(Number(amount));
  return `Rs. ${rounded.toLocaleString('en-PK')}`;
};

export default formatCurrency;
