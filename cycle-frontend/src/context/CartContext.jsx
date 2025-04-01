import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { initialCouponState } from './cartContextUtils';
import { 
  getSelectedCartItems, 
  saveSelectedCartItems,
  getCouponState,
  saveCouponState
} from '../pages/cart/cartPageUtils';

// Create the context
export const CartContext = createContext(undefined);

// CartProvider component
const CartProvider = ({ children }) => {
  const [cartItemCount, setCartItemCount] = useState(0);
  const [couponState, setCouponState] = useState(() => getCouponState());
  const [selectedItems, setSelectedItems] = useState(() => getSelectedCartItems());

  // Save selected items to localStorage whenever they change
  useEffect(() => {
    saveSelectedCartItems(selectedItems);
  }, [selectedItems]);

  // Save coupon state to localStorage whenever it changes
  useEffect(() => {
    saveCouponState(couponState);
  }, [couponState]);

  const updateCartCount = (count) => {
    setCartItemCount(count);
  };

  const updateCouponState = (newState) => {
    setCouponState(newState);
  };

  const clearCouponState = () => {
    setCouponState(initialCouponState);
  };

  const updateSelectedItems = (items) => {
    // Ensure we're working with a Set
    const newItems = items instanceof Set ? items : new Set(items);
    setSelectedItems(newItems);
  };

  const value = {
    cartItemCount,
    updateCartCount,
    couponState,
    updateCouponState,
    clearCouponState,
    selectedItems,
    updateSelectedItems
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default CartProvider;