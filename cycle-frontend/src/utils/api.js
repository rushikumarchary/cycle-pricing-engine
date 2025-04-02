import axios from 'axios';
import DomainName from './config';
import { getAuthHeader, getUserId, getUserName} from './auth';

// Authentication API functions
export const authAPI = {
  // Sign in user
  signIn: async (credentials) => {
    try {
      const response = await axios.post(
        `${DomainName}/auth/signIn`,
        credentials
      );
      return response.data;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  },

  // Sign up user
  signUp: async (userData) => {
    try {
      const response = await axios.post(
        `${DomainName}/auth/signUp`,
        userData
      );
      return response.data;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  },

  // Get cart count
  getCartCount: async () => {
    try {
      const response = await axios.get(
        `${DomainName}/cart/cartItemCount`,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching cart count:', error);
      return 0;
    }
  }
};

// Address API functions
export const addressAPI = {
  // Get all addresses for a user
  getUserAddresses: async (userId) => {
    try {
      const response = await axios.get(
        `${DomainName}/addresses/${userId}`,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching addresses:', error);
      throw error;
    }
  },

  // Save new address
  saveAddress: async (addressData) => {
    try {
      const response = await axios.post(
        `${DomainName}/addresses/save`,
        addressData,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error('Error saving address:', error);
      throw error;
    }
  }
};

// Cart API functions
export const cartAPI = {
  getCartCount: async () => {
    try {
      const response = await axios.get(
        `${DomainName}/cart/cartItemCount`,
        getAuthHeader()
      );
   
      return response.data;
    } catch (error) {
      console.error('Error fetching cart count:', error);
      return 0;
    }
  },
  // Get all cart items
  getAllCartItems: async () => {
    try {
      const response = await axios.get(
        `${DomainName}/cart/getAll`,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching cart items:', error);
      throw error;
    }
  },

  // Update cart item quantity
  updateCartQuantity: async (cartId, quantity) => {
    try {
      const response = await axios.patch(
        `${DomainName}/cart/update-quantity`,
        {
          cartId,
          quantity,
        },
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      throw error;
    }
  },

  // Remove single cart item
  removeCartItem: async (cartId) => {
    try {
      const response = await axios.delete(
        `${DomainName}/cart/remove/${cartId}`,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error('Error removing cart item:', error);
      throw error;
    }
  },

  // Clear selected cart items
  clearSelectedItems: async (cartIds) => {
    try {
      const response = await axios.post(
        `${DomainName}/cart/clear-selected`,
        { cartIds },
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error('Error clearing selected cart items:', error);
      throw error;
    }
  },

  // Clear entire cart
  clearCart: async () => {
    try {
      const userName = getUserName();
      const response = await axios.delete(
        `${DomainName}/cart/clear/${userName}`,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  },

  // Add item to cart
  addToCart: async (cartData) => {
    try {
      const response = await axios.post(
        `${DomainName}/cart/add`,
        cartData,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw error;
    }
  }
};

// Calculate API functions
export const calculateAPI = {
  // Get all brands
  getBrands: async () => {
    const response = await axios.get(
      `${DomainName}/cycle/brands`,
      getAuthHeader()
    );
    return response.data;
  },

  // Get items by brand
  getItemsByBrand: async (brandId) => {
    const response = await axios.get(
      `${DomainName}/cycle/byBrand/${brandId}`,
      getAuthHeader()
    );
    return response.data;
  },

  // Calculate price
  calculatePrice: async (requestData) => {
    const response = await axios.post(
      `${DomainName}/cycle/calculate-price`,
      requestData,
      getAuthHeader()
    );
    return response.data;
  }
};

// Item management API functions
export const itemAPI = {
  // Add new item
  addItem: async (itemData) => {
    const response = await axios.post(
      `${DomainName}/item/add`,
      itemData,
      getAuthHeader()
    );
    return response.data;
  },

  // Get items by brand name
  getItemsByBrandName: async (brandName) => {
    const response = await axios.get(
      `${DomainName}/item/brand/${brandName}`,
      getAuthHeader()
    );
    return response.data;
  },

  // Delete item
  deleteItem: async (itemId) => {
    const response = await axios.delete(
      `${DomainName}/item/delete/${itemId}`,
      getAuthHeader()
    );
    return response.data;
  },

  // Delete item with confirmation
  deleteConfirmItem: async (itemId) => {
    const response = await axios.delete(
      `${DomainName}/item/confirm/delete/${itemId}`,
      getAuthHeader()
    );
    return response.data;
  },

  // Update item date and price
  updateDateAndPrice: async (itemId, validTo, price) => {
    const params = new URLSearchParams({
      itemId: itemId,
      validTo: validTo,
      price: price
    });
    const response = await axios.patch(
      `${DomainName}/item/update/date-and-price?${params.toString()}`,
      null,
      getAuthHeader()
    );
    return response.data;
  }
};

// Brand management API functions
export const brandAPI = {
  // Get all brands
  getAllBrands: async () => {
    const response = await axios.get(
      `${DomainName}/brand/brands`,
      getAuthHeader()
    );
    return response.data;
  },

  // Add new brand
  addBrand: async (name) => {
    const response = await axios.post(
      `${DomainName}/brand/add?name=${name}`,
      null,
      getAuthHeader()
    );
    return response.data;
  },

  // Update brand
  updateBrand: async (id, newBrandName) => {
    const response = await axios.patch(
      `${DomainName}/brand/update`,
      {
        id: id,
        newBrandName: newBrandName,
      },
      getAuthHeader()
    );
    return response.data;
  },

  // Delete brand
  deleteBrand: async (id) => {
    const response = await axios.delete(
      `${DomainName}/brand/delete/${id}`,
      getAuthHeader()
    );
    return response.data;
  }
};

// Modified compare API functions
export const compareAPI = {
  // Get all comparisons for a specific user
  getAllComparisons: async () => {
    // if (!userId) {
    //   throw new Error("User ID is required");
    // }
    try {
      const userId = await getUserId();
     
      const response = await axios.get(
        `${DomainName}/api/comparisons/user/${userId}`,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error(
        "Fetch Comparisons Error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
  // Add new comparisons
  addToCompare: async (cartId) => {
    const userId = await getUserId();

    if (!cartId || !userId) {
      throw new Error("Cart ID and User ID are required");
    }
    try {
      const response = await axios.post(
        `${DomainName}/api/comparisons/add?userId=${userId}&cartId=${cartId}`,
        {}, // Add empty object as the request body
        getAuthHeader() // Pass the auth header as the third parameter
      );
      return response.data;
    } catch (error) {
      console.error(
        "Add to Compare Error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
   // Delete a specific comparison (corresponding to your backend delete endpoint)
   deleteComparison: async (comparisonId) => {
    if (!comparisonId) {
      throw new Error("Comparison ID is required");
    }
    
    try {
      const response = await axios.delete(
        `${DomainName}/api/comparisons/${comparisonId}`,
        getAuthHeader()
      );
      
      return response.data;
    } catch (error) {
      console.error(
        "Delete Comparison Error:",
        error.response?.data || error.message
      );
      throw error;
    }
  }
};


// Modified order API functions
export const orderAPI = {
  // Get orders by filter - modified to use getUserId from auth.js
  getOrdersByFilter: async (userId, filter) => {
    try {
      let response;
      if (filter.includes('year-')) {
        const year = filter.split('-')[1];
        response = await axios.get(
          `${DomainName}/orders/user/${userId}/year/${year}`,
          getAuthHeader()
        );
      } else {
        response = await axios.get(
          `${DomainName}/orders/user/${userId}/${filter}`,
          getAuthHeader()
        );
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  // Admin Order Management APIs
  getAdminLastMonthOrders: async () => {
    try {
      const response = await axios.get(
        `${DomainName}/orders/admin/last-month`,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching admin last month orders:', error);
      throw error;
    }
  },

  getAdminLastThreeMonthsOrders: async () => {
    try {
      const response = await axios.get(
        `${DomainName}/orders/admin/last-three-months`,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching admin last three months orders:', error);
      throw error;
    }
  },

  getAdminLastSixMonthsOrders: async () => {
    try {
      const response = await axios.get(
        `${DomainName}/orders/admin/last-six-months`,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching admin last six months orders:', error);
      throw error;
    }
  },

  getAdminOrdersByYear: async (year) => {
    try {
      const response = await axios.get(
        `${DomainName}/orders/admin/year/${year}`,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching admin orders by year:', error);
      throw error;
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await axios.patch(
        `${DomainName}/orders/admin/update-status/${orderId}/${status}`,
        null,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }
};

// Coupon API functions
export const couponAPI = {
  // Validate coupon code
  validateCoupon: async (code) => {
    try {
      const response = await axios.get(
        `${DomainName}/coupons/code/${code}`,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error('Error validating coupon:', error);
      throw error;
    }
  },

  // Add new coupon
  addCoupon: async (percentage, couponCode) => {
    try {
      const response = await axios.post(
        `${DomainName}/coupons/add?percentage=${percentage}&couponCode=${couponCode}`,
        null,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error('Error adding coupon:', error);
      throw error;
    }
  },

  // Get all coupons
  getAllCoupons: async () => {
    try {
      const response = await axios.get(
        `${DomainName}/coupons/all`,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching coupons:', error);
      throw error;
    }
  },

  // Get coupon by ID
  getCouponById: async (id) => {
    try {
      const response = await axios.get(
        `${DomainName}/coupons/${id}`,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching coupon:', error);
      throw error;
    }
  },

  // Update coupon status
  updateStatus: async (id) => {
    try {
      const response = await axios.patch(
        `${DomainName}/coupons/status/${id}`,
        null,
        getAuthHeader()
      );
      return response.data;

      
    } catch (error) {
      console.error('Error updating coupon status:', error);
      throw error;
    }
  },

  // Update coupon
  updateCoupon: async (couponData) => {
    try {
      const response = await axios.put(
        `${DomainName}/coupons/update`,
        couponData,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error('Error updating coupon:', error);
      throw error;
    }
  },

  // Delete coupon
  deleteCoupon: async (id) => {
    try {
      const response = await axios.delete(
        `${DomainName}/coupons/delete/${id}`,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting coupon:', error);
      throw error;
    }
  }
};
