import axios from 'axios';
import { getAuthHeader, getUserId, getUserName, getUserEmail } from './auth';
import logo from '../assets/logo.png';

// Load Razorpay script
export const loadRazorpay = async () => {
  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.async = true;
  document.body.appendChild(script);

  return new Promise((resolve) => {
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
  });
};

// Generic create order function that can be used with any type of order
export const    createOrder = async (orderRequest) => {
  try {
    // Add userId from auth.js
    const userId = getUserId();
    const finalOrderRequest = {
      ...orderRequest,
      userId
    };
    console.log(finalOrderRequest);
    const response = await axios.post(
      "http://localhost:8080/payments/create-order",
      finalOrderRequest,
      getAuthHeader()
    );
    
    if (!response.data.orderId) {
      throw new Error("Failed to create order");
    }
    
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

// Verify payment
export const verifyPayment = async (paymentData) => {
  try {
    const verificationResponse = await axios.post(
      "http://localhost:8080/payments/verify-payment",
      {
        orderId: paymentData.razorpay_order_id,
        paymentId: paymentData.razorpay_payment_id,
        signature: paymentData.razorpay_signature,
      },
      getAuthHeader()
    );
    
    return verificationResponse.data;
  } catch (error) {
    console.error("Payment verification failed:", error);
    throw error;
  }
};

// Initialize Razorpay checkout
export const initializeRazorpayCheckout = ({
  orderData,
  callbacks
}) => {
  // Get user info from auth.js
  const userName = getUserName();
  const userEmail = getUserEmail();

  const options = {
    key: "rzp_test_5C7srwxYlDtKK8",
    amount: orderData.amount,
    currency: orderData.currency || "INR",
    name: "Cycle Pricing Engine",
    description: "Purchase from Cycle Pricing Engine",
    image: logo,
    order_id: orderData.orderId,
    handler: async function (response) {
      try {
        callbacks.onPaymentStart?.();
        const verificationResult = await verifyPayment(response);
        
        if (verificationResult.success) {
          await callbacks.onPaymentSuccess?.();
        } else {
          throw new Error("Payment verification failed");
        }
      } catch (error) {
        callbacks.onPaymentError?.(error);
      }
    },
    prefill: {
      name: userName,
      email: userEmail,
    },
    theme: {
      color: "#28544B",
    },
    modal: {
      ondismiss: function() {
        callbacks.onModalClose?.();
      }
    }
  };

  const rzp = new window.Razorpay(options);
  rzp.on('payment.failed', function () {
    callbacks.onPaymentFailed?.();
  });
  
  return rzp;
}; 