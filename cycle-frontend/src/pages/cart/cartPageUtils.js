import { initialCouponState } from '../../context/cartContextUtils';

// Component mapping for estimate details
export const componentMapping = [
  { type: "Frame Material", key: "Frame" },
  { type: "Handlebar Type", key: "Handlebar" },
  { type: "Seating Type", key: "Seating" },
  { type: "Wheel Type", key: "Wheel" },
  { type: "Tyre Type", key: "Tyre" },
  { type: "Brakes Type", key: "Brakes" },
  { type: "Chain Assembly", key: "Chain Assembly" },
];

// Local Storage keys
export const SELECTED_CART_ITEMS_KEY = 'selectedCartItems';
export const COUPON_STATE_KEY = 'couponState';

/**
 * Save selected cart items to localStorage
 * @param {Set} selectedItems - Set of selected cart IDs
 */
export const saveSelectedCartItems = (selectedItems) => {
  localStorage.setItem(SELECTED_CART_ITEMS_KEY, JSON.stringify(Array.from(selectedItems)));
};

/**
 * Get selected cart items from localStorage
 * @returns {Set} Set of selected cart IDs
 */
export const getSelectedCartItems = () => {
  const items = localStorage.getItem(SELECTED_CART_ITEMS_KEY);
  return items ? new Set(JSON.parse(items)) : new Set();
};

/**
 * Save coupon state to localStorage
 * @param {Object} couponState - Current coupon state
 */
export const saveCouponState = (couponState) => {
  localStorage.setItem(COUPON_STATE_KEY, JSON.stringify(couponState));
};

/**
 * Get coupon state from localStorage
 * @returns {Object} Coupon state
 */
export const getCouponState = () => {
  const state = localStorage.getItem(COUPON_STATE_KEY);
  return state ? JSON.parse(state) : initialCouponState;
};

/**
 * Clear all cart related data from localStorage
 */
export const clearCartStorage = () => {
  localStorage.removeItem(SELECTED_CART_ITEMS_KEY);
  localStorage.removeItem(COUPON_STATE_KEY);
};

/**
 * Calculate total quantity of items in cart
 * @param {Array} cart - Array of cart items
 * @returns {number} Total quantity
 */
export const getTotalQuantity = (cart) => {
  return cart.reduce((total, item) => total + item.quantity, 0);
};

/**
 * Calculate selected prices and totals
 * @param {Array} cart - Array of cart items
 * @param {Set} selectedItems - Set of selected cart IDs
 * @param {Object} couponState - Current coupon state
 * @param {number} shippingCost - Current shipping cost
 * @returns {Object} Calculated price details
 */
export const calculateSelectedPrices = (cart, selectedItems, couponState, shippingCost) => {
  // Calculate subtotal from selected items
  const selectedSubtotal = cart.reduce((total, item) => {
    if (selectedItems.has(item.cartId)) {
      return total + item.totalPartsPrice;
    }
    return total;
  }, 0);

  let total = selectedSubtotal;
  let discountAmount = 0;

  // Apply coupon discount if valid
  if (couponState?.isApplied && couponState?.percentage > 0) {
    discountAmount = (selectedSubtotal * couponState.percentage) / 100;
    total = selectedSubtotal - discountAmount;
  }

  // Calculate GST after discount
  const gst = total * 0.18;
  total += gst;

  // Add shipping cost if applicable (only if subtotal < 10000)
  if (selectedSubtotal > 0 && selectedSubtotal < 10000) {
    total += shippingCost;
  }

  // Calculate selected quantity
  const selectedQuantity = cart.reduce((total, item) => {
    if (selectedItems.has(item.cartId)) {
      return total + item.quantity;
    }
    return total;
  }, 0);

  return {
    subtotal: selectedSubtotal,
    discountAmount,
    gstAmount: gst,
    total,
    selectedQuantity,
    shouldShowShipping: selectedSubtotal < 10000 && selectedSubtotal > 0,
    isShippingDisabled: selectedSubtotal >= 10000
  };
};

/**
 * Validate order before proceeding to checkout
 * @param {Set} selectedItems - Set of selected cart IDs
 * @param {Array} cart - Array of cart items
 * @returns {Object} Validation result
 */
export const validateOrder = (selectedItems, cart) => {
  if (selectedItems.size === 0) {
    return { isValid: false, message: "Please select at least one item to checkout" };
  }
  
  const selectedTotal = cart.reduce((total, item) => {
    if (selectedItems.has(item.cartId)) {
      return total + item.totalPartsPrice;
    }
    return total;
  }, 0);
  
  if (selectedTotal === 0) {
    return { isValid: false, message: "Please select items to proceed" };
  }
  
  return { isValid: true };
};

/**
 * Handle coupon validation and application
 * @param {string} promoCode - Promo code to validate
 * @param {Object} couponState - Current coupon state
 * @returns {Object} Validation result
 */
export const validateCouponApplication = (promoCode, couponState) => {
  if (!promoCode || !promoCode.trim()) {
    return { isValid: false, message: "Please enter a promo code" };
  }

  // Check if the same coupon is already applied
  if (couponState && couponState.isApplied && promoCode === couponState.code) {
    return { isValid: false, message: "This coupon code is already applied" };
  }

  return { isValid: true };
};

/**
 * Handle comparison validation
 * @param {Array} existingItems - Current comparison items
 * @param {string} cartId - Cart ID to add to comparison
 * @returns {Object} Validation result
 */
export const validateComparison = (existingItems, cartId) => {
  // Check if the cartId already exists in the existingItems array
  if (existingItems.some(item => item.cart.cartId === cartId)) {
    return { isValid: false, message: "Item already in comparison list" };
  }
  
  if (existingItems.length >= 4) {
    return { isValid: false, message: "You can compare up to 4 items only" };
  }

  return { isValid: true };
};

/**
 * Validate comparison view
 * @param {Array} compareItems - Current comparison items
 * @returns {Object} Validation result
 */
export const validateComparisonView = (compareItems) => {
  if (compareItems.length < 2) {
    return { isValid: false, message: "Add at least 2 items to compare" };
  }
  return { isValid: true };
}; 