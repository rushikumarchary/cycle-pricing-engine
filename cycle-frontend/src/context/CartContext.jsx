import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

// eslint-disable-next-line react/prop-types
export const CartProvider = ({ children }) => {
  const [cartItemCount, setCartItemCount] = useState(0);

  const updateCartCount = (count) => {
    setCartItemCount(count);
  };

  return (
    <CartContext.Provider value={{ 
      cartItemCount,
      updateCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 