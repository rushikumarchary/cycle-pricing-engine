import { createContext, useContext, useState, useEffect } from "react";

const OrderContext = createContext();
const ORDER_STORAGE_KEY = 'cycle_orders';

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState(() => {
    // Initialize orders from localStorage if available
    const savedOrders = localStorage.getItem(ORDER_STORAGE_KEY);
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  // Save orders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  const addOrder = (orderItems, totalAmount) => {
    const newOrder = {
      id: `ORD-${Date.now()}`,
      items: orderItems,
      totalAmount,
      date: new Date().toISOString(),
      status: 'Confirmed',
      paymentStatus: 'Paid',
      shippingDetails: {
        status: 'Processing',
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      }
    };
    setOrders(prev => [newOrder, ...prev]); // Add new order at the beginning
  };

  const getOrder = (orderId) => {
    return orders.find(order => order.id === orderId);
  };

  const getAllOrders = () => {
    return orders;
  };

  return (
    <OrderContext.Provider value={{ 
      orders, 
      addOrder, 
      getOrder,
      getAllOrders 
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const  useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
}; 