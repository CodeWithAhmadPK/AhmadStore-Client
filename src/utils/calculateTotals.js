/**
 * Calculate client-side totals for cart preview
 * (Server remains authoritative for actual order total)
 * @param {Array} items
 * @param {number} deliveryFee
 * @returns {object} { itemCount, subtotal, estimatedTotal }
 */
export const calculateTotals = (items = [], deliveryFee = 0) => {
  const itemCount = items.reduce((acc, item) => acc + (Number(item.quantity) || 0), 0);

  const subtotal = items.reduce((acc, item) => {
    const price = Number(item.price) || 0;
    const qty = Number(item.quantity) || 0;
    return acc + price * qty;
  }, 0);

  const estimatedTotal = subtotal + Number(deliveryFee || 0);

  return {
    itemCount,
    subtotal: Math.round(subtotal * 100) / 100,
    estimatedTotal: Math.round(estimatedTotal * 100) / 100,
  };
};

export default calculateTotals;
