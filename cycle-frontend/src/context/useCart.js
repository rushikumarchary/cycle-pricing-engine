import { useContext } from 'react';
import { CartContext } from './CartContext';
import { CART_CONTEXT_ERROR } from './cartContextUtils';

/**
 * Custom hook to access cart context
 * @returns {Object} Cart context value
 * @throws {Error} If used outside of CartProvider
 */
const useCart = () => {
  const context = useContext(CartContext);
  
  if (context === undefined) {
    throw new Error(CART_CONTEXT_ERROR);
  }
  
  return context;
};

export default useCart; 