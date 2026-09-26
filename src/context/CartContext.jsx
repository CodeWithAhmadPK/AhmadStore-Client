import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const CartContext = createContext(null);

const CART_STORAGE_KEY = 'ahmad_store_guest_cart';

// Helper to generate a unique key per item based on product ID and selected variants
const getCartItemKey = (productId, variants = []) => {
  const sortedVariants = [...variants].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  return `${productId}_${JSON.stringify(sortedVariants)}`;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  /**
   * Add item to guest cart
   * @param {object} product - Full product details
   * @param {number} quantity - Quantity to add
   * @param {Array} variants - Selected variants array [{ name, value }]
   */
  const addItem = (product, quantity = 1, variants = []) => {
    if (!product || !product._id) return;

    const qtyToAdd = Math.max(1, parseInt(quantity, 10) || 1);
    const itemKey = getCartItemKey(product._id, variants);

    // Determine unit price (sale price if active)
    const unitPrice =
      product.salePrice !== null && product.salePrice !== undefined && product.salePrice > 0
        ? product.salePrice
        : product.price;

    const primaryImage =
      product.images && product.images.length > 0
        ? (product.images.find((img) => img.isPrimary) || product.images[0]).url
        : '';

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => getCartItemKey(item.product, item.variants) === itemKey
      );

      if (existingIndex > -1) {
        // Update existing item quantity up to stock
        const updated = [...prevItems];
        const newQuantity = updated[existingIndex].quantity + qtyToAdd;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: Math.min(newQuantity, product.stockQuantity || 9999),
        };
        return updated;
      } else {
        // Add new item entry
        return [
          ...prevItems,
          {
            key: itemKey,
            product: product._id,
            slug: product.slug,
            name: product.name,
            sku: product.sku || '',
            image: primaryImage,
            price: unitPrice,
            stockQuantity: product.stockQuantity,
            quantity: Math.min(qtyToAdd, product.stockQuantity || 9999),
            variants,
          },
        ];
      }
    });
  };

  /**
   * Remove item from cart by key or product+variants
   */
  const removeItem = (productId, variants = []) => {
    const itemKey = getCartItemKey(productId, variants);
    setCartItems((prevItems) =>
      prevItems.filter((item) => getCartItemKey(item.product, item.variants) !== itemKey)
    );
  };

  /**
   * Update item quantity
   */
  const updateQuantity = (productId, quantity, variants = []) => {
    const itemKey = getCartItemKey(productId, variants);
    const newQty = parseInt(quantity, 10);

    if (newQty <= 0) {
      removeItem(productId, variants);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (getCartItemKey(item.product, item.variants) === itemKey) {
          const clampedQty = item.stockQuantity ? Math.min(newQty, item.stockQuantity) : newQty;
          return { ...item, quantity: clampedQty };
        }
        return item;
      })
    );
  };

  /**
   * Clear the entire cart
   */
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculated values
  const itemCount = useMemo(
    () => cartItems.reduce((acc, item) => acc + (item.quantity || 0), 0),
    [cartItems]
  );

  const subtotal = useMemo(
    () =>
      cartItems.reduce((acc, item) => {
        const itemPrice = Number(item.price) || 0;
        const itemQty = Number(item.quantity) || 0;
        return acc + itemPrice * itemQty;
      }, 0),
    [cartItems]
  );

  const value = {
    cartItems,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    itemCount,
    subtotal: Math.round(subtotal * 100) / 100,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
