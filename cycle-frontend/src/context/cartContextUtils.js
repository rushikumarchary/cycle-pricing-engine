/**
 * Initial state for the coupon context
 * @type {Object}
 */
export const initialCouponState = {
    code: "",
    existingCode: "",
    isApplied: false,
    percentage: 0
  };
  
  /**
   * Error message for when useCart is used outside of CartProvider
   * @type {string}
   */
  export const CART_CONTEXT_ERROR = 'useCart must be used within a CartProvider';