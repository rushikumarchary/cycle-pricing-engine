import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";
import { MdDelete } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

import useCart from "../../context/useCart";
import { cartAPI, compareAPI, couponAPI } from "../../utils/api";
import Address from "../../pages/address/Address";
import { loadRazorpay, createOrder, initializeRazorpayCheckout } from "../../utils/payment";
import {
  componentMapping,
  getTotalQuantity,
  calculateSelectedPrices,
  validateOrder,
  
  validateComparison,
  validateComparisonView
} from "./cartPageUtils";

const Cart = () => {
  const { 
    updateCartCount, 
    couponState, 
    updateCouponState, 
    clearCouponState,
    selectedItems,
    updateSelectedItems
  } = useCart();

  const [cart, setCart] = useState([]);
  const [compareItems, setCompareItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalItemsQuantity, setTotalItemsQuantity] = useState(0);
  const [promoCode, setPromoCode] = useState(couponState.code || "");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [shippingCost, setShippingCost] = useState(200);
  const [gstAmount, setGstAmount] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const preserveSelections = location.state?.preserveSelections || false;
  const newCartId = location.state?.newCartId;

  // Fetch cart function
  const fetchCart = async () => {
    try {
      const data = await cartAPI.getAllCartItems();
      setCart(data);
      const updatedItems = await compareAPI.getAllComparisons();
      setCompareItems(updatedItems);
      
      // Get the current cart IDs
      const currentCartIds = new Set(data.map(item => item.cartId));
      
      // If we have a new cartId from navigation, add it to existing selections
      if (newCartId && currentCartIds.has(newCartId)) {
        const newSelectedItems = new Set([...Array.from(selectedItems), newCartId]);
        updateSelectedItems(newSelectedItems);
      }
      // If no selections exist, select the most recent item
      else if (selectedItems.size === 0) {
        const mostRecentItem = data[data.length - 1];
        if (mostRecentItem) {
          const newSelectedItems = new Set([mostRecentItem.cartId]);
          updateSelectedItems(newSelectedItems);
        }
      }
      // Filter out any selected items that are no longer in the cart
      else {
        const validSelectedItems = new Set(
          Array.from(selectedItems).filter(id => currentCartIds.has(id))
        );
        if (validSelectedItems.size !== selectedItems.size) {
          updateSelectedItems(validSelectedItems);
        }
      }
      
      // Calculate prices after fetching cart
      const prices = calculateSelectedPrices(data, selectedItems, couponState, shippingCost);
      setSubtotal(prices.subtotal);
      setDiscountAmount(prices.discountAmount);
      setGstAmount(prices.gstAmount);
      setTotalPrice(prices.total);
      setTotalItemsQuantity(prices.selectedQuantity);
      
    } catch (error) {
      if (!error.isHandled) {
        if (error.response && error.response.status === 401) {
          navigate('/login');
        } else {
          setCart([]);
          updateSelectedItems(new Set());
          updateCartCount(0);
        }
        error.isHandled = true;
      }
    }
  };

  // Update cart count whenever cart changes
  useEffect(() => {
    updateCartCount(getTotalQuantity(cart));
  }, [cart, updateCartCount]);

  // Update prices when relevant values change
  useEffect(() => {
    const prices = calculateSelectedPrices(cart, selectedItems, selectedItems.size > 0 ? couponState : { isApplied: false }, shippingCost);
    setSubtotal(prices.subtotal);
    setDiscountAmount(prices.discountAmount);
    setGstAmount(prices.gstAmount);
    setTotalPrice(prices.total);
    setTotalItemsQuantity(prices.selectedQuantity);
    
    // Set shipping cost based on subtotal
    if (prices.subtotal >= 10000) {
      setShippingCost(0);
    } else if (prices.subtotal > 0) {
      setShippingCost(200);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart, selectedItems, couponState]);

  useEffect(() => {
    fetchCart();
    // Clear the navigation state after handling it
    if (preserveSelections || newCartId) {
      window.history.replaceState({}, document.title);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preserveSelections, newCartId]);

  // Keep promoCode in sync with couponState
  useEffect(() => {
    if (couponState.isApplied) {
      setPromoCode(couponState.code);
    } else {
      setPromoCode("");
    }
  }, [couponState]);

  const handleCreateOrder = async (address) => {
    setIsLoading(true);
    setLoadingMessage("Creating your order...");
    try {
      // Store ordered cartIds before creating order
      const orderedCartIds = Array.from(selectedItems);
      
      // Prepare cart-specific order request
      const orderRequest = {
        addressId: address.addressId,
        shippingCost: shippingCost,
        cartIds: orderedCartIds,
        couponCode: couponState.isApplied ? promoCode : null
      };
      // Create order using payment utility
      const orderData = await createOrder(orderRequest);
      
   
      
      setLoadingMessage("Initializing payment gateway...");
      await handlePaymentCheckout(orderData);

      // Cleanup operations after order creation - non-blocking
      setTimeout(() => {
        // Remove ordered items from selections
        const newSelectedItems = new Set(selectedItems);
        orderedCartIds.forEach(id => newSelectedItems.delete(id));
        updateSelectedItems(newSelectedItems);
        // Update cart count
        updateCartCount(getTotalQuantity(cart));
        // Clear coupon state
        clearPromoCode();
      }, 0);

    } catch (error) {
      setIsLoading(false);
      clearPromoCode();
      setLoadingMessage("");
      toast.error(error.response?.data?.message || "Failed to create order. Please try again later.");
    }
  };

  const handlePaymentCheckout = async (orderData) => {
    try {
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        throw new Error("Failed to load payment gateway");
      }

      const razorpay = initializeRazorpayCheckout({
        orderData,
        callbacks: {
          onPaymentStart: () => {
            setLoadingMessage("Verifying payment...");
          },
          onPaymentSuccess: handlePaymentSuccess,
          onPaymentError: () => {
            setIsLoading(false);
            setLoadingMessage("");
            toast.error("Payment verification failed. Please contact support if amount was deducted.");
          },
          onPaymentFailed: () => {
            setIsLoading(false);
            setLoadingMessage("");
            toast.error("Payment failed. Please try again.");
          },
          onModalClose: () => {
            setIsLoading(false);
            setLoadingMessage("");
            toast.error("Payment cancelled. Please try again.");
          }
        }
      });

      razorpay.open();
    } catch (error) {
      setIsLoading(false);
      setLoadingMessage("");
      toast.error(error.message || "Payment initialization failed. Please try again.");
    }
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  // Add handleOrder function
  const handleOrder = () => {
    const validation = validateOrder(selectedItems, cart);
    if (!validation.isValid) {
      toast.error(validation.message);
      return;
    }
    setShowAddressModal(true);
  };

  // Handle item selection
  const handleItemSelect = (cartId) => {
    const newSet = new Set(selectedItems);
    if (newSet.has(cartId)) {
      newSet.delete(cartId);
    } else {
      newSet.add(cartId);
    }
    updateSelectedItems(newSet);

    // Clear coupon if no items selected
    if (newSet.size === 0 && couponState.isApplied) {
      clearPromoCode();
    }
  };

  // Handle select all
  const handleSelectAll = (checked) => {
    if (checked) {
      const allIds = new Set(cart.map(item => item.cartId));
      updateSelectedItems(allIds);
    } else {
      updateSelectedItems(new Set());
      // Clear coupon when unselecting all
      if (couponState.isApplied) {
        clearPromoCode();
      }
    }
  };

  const handleAddToCompare = async (id) => {
    try {
      const existingItems = await compareAPI.getAllComparisons();
     
      const validation = validateComparison(existingItems, id);
      
      if (!validation.isValid) {
        toast.error(validation.message);  
        return;
      }

      await compareAPI.addToCompare(id);
      const updatedItems = await compareAPI.getAllComparisons();
      setCompareItems(updatedItems);
      toast.success("Added to comparison list");
    } catch (error) {
      console.error("Error adding item to compare:", error);
      toast.error("Failed to add item to comparison");
    }
  };

  const handleViewCompare = async () => {
    try {
      const response = await compareAPI.getAllComparisons();
      setCompareItems(response);
      
      const validation = validateComparisonView(response);
      if (!validation.isValid) {
        toast.error(validation.message);
        return;
      }

      navigate('/compare');
    } catch (error) {
      console.error("Error viewing comparisons:", error);
      toast.error("Failed to load comparison items");
    }
  };

  // Handle payment success
  const handlePaymentSuccess = () => {
    setIsLoading(false);
    setLoadingMessage("");
    
    // Select the last item by default after successful checkout
    const lastItem = cart[cart.length - 1];
    if (lastItem) {
      updateSelectedItems(new Set([lastItem.cartId]));
    }
    
    // Fetch updated cart to refresh the view
    fetchCart();
    
    toast.success("Payment Successful! Order has been Confirmed.");
    navigate("/user/orders");
  };

  // Update shipping cost handler
  const handleShippingCostChange = (e) => {
    const newShippingCost = Number(e.target.value);
    setShippingCost(newShippingCost);
  };

  const applyPromoCode = async () => {
    if (!promoCode.trim()) {
      toast.error("Please enter a promo code");
      return;
    }

    // Check if any items are selected
    if (selectedItems.size === 0) {
      toast.error("Please select at least one item to apply coupon");
      return;
    }

    try {
      const couponData = await couponAPI.validateCoupon(promoCode);

      console.log(couponData);
      
      if (couponData.isActive === "Y") {
        if (couponState.existingCode) {
          const result = await Swal.fire({
            title: 'Change Coupon?',
            text: 'A different coupon is already applied. Do you want to replace it?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, replace it!',
            cancelButtonText: 'No, keep current'
          });

          if (!result.isConfirmed) {
            setPromoCode(couponState.code);
            return;
          }
        }

        updateCouponState({
          code: promoCode,
          existingCode: couponData.couponCode,
          isApplied: true,
          percentage: couponData.percentage
        });
        toast.success(`${couponData.percentage}% Discount Applied Successfully!`);
      } else {
        setPromoCode("");
        clearCouponState();
        toast.error("Invalid or inactive promo code");
      }
    } catch (error) {
      setPromoCode("");
      clearCouponState();
      toast.error(error.response?.data || "Invalid promo code");
    }
  };

  const clearPromoCode = React.useCallback(() => {
    setPromoCode("");
    clearCouponState();
  }, [clearCouponState]);

  const handleIncrement = async (item) => {
    try {
      await cartAPI.updateCartQuantity(item.cartId, item.quantity + 1);
      await fetchCart();
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
    }
  };

  const handleDecrement = async (item) => {
    if (item.quantity > 1) {
      try {
        await cartAPI.updateCartQuantity(item.cartId, item.quantity - 1);
        await fetchCart();
      } catch (error) {
        console.error("Error updating quantity:", error);
        toast.error("Failed to update quantity");
      }
    } else {
      try {
         await  handleRemoveOneCart(item.cartId);
        toast.success("Item removed from cart");
      } catch (error) {
        console.error("Error removing item:", error);
        toast.error("Failed to remove item");
      }
    }
  };

  const handleRemoveOneCart = async (cartId) => {
    try {
      await cartAPI.removeCartItem(cartId);
      // Update selectedItems by removing the deleted cartId
      const newSet = new Set(selectedItems);
      newSet.delete(cartId);
      // Clear coupon if this was the last selected item
      if (newSet.size === 0 && couponState.isApplied) {
        clearPromoCode();
      }
      updateSelectedItems(newSet);
      await fetchCart();
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item");
    }
  };

  let continueShopping = () => {
    navigate(-1);
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setShowAddressModal(false);
    // After selecting address, proceed with order creation
    handleCreateOrder(address);
  };

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            <p className="text-lg font-semibold">{loadingMessage}</p>
          </div>
        </div>
      )}
      {cart.length === 0 ? (
        <div className="w-full min-h-screen pt-[72px] lg:pt-4 flex flex-col items-center justify-center gap-4">
          <h2 className="text-2xl font-bold">Your cart is empty!</h2>
          <p className="text-black text-semibold">
            Explore our products and add items to your cart
          </p>
          <button
            onClick={() => navigate("/calculate")}
            className="mt-4 bg-indigo-500 text-white px-6 py-2 rounded-md hover:bg-indigo-600 transition-colors"
          >
            Explore Products
          </button>
        </div>
      ) : (
       
        <div className="w-full max-w-[1200px] mx-auto px-3 sm:px-4 md:px-6 pb-6">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 lg:gap-6">
            {/* Cart Section */}
            <div className="w-full lg:w-[65%] bg-white rounded-lg shadow-md">
              <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                <div className="flex justify-between items-center border-b pb-3">
                  <h1 className="font-semibold text-base sm:text-lg md:text-xl">
                    Shopping Cart
                  </h1>
                  <h2 className="font-semibold text-base sm:text-lg md:text-xl">
                    {cart.length} Products
                  </h2>
                </div>
                
                {/* Products container with adjusted height */}
                <div className="h-[calc(100vh-250px)] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {/* Sticky Headers */}
                  <div className="hidden lg:flex py-3 border-b sticky top-0 bg-white z-10">
                    <div className="w-[50%] pl-4">
                      <div className="flex items-center gap-6">
                        <span className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          checked={selectedItems.size === cart.length}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                        />
                        <span className="font-semibold text-center text-gray-600 text-xs uppercase">Select All</span>
                        </span>
                        <h3 className="font-semibold text-gray-600 text-xs uppercase">Product Details</h3>
                      </div>
                    </div>
                    <div className="w-[50%] grid grid-cols-3">
                      <h3 className="font-semibold text-center text-gray-600 text-xs uppercase">Quantity</h3>
                      <h3 className="font-semibold text-center text-gray-600 text-xs uppercase">Price</h3>
                      <h3 className="font-semibold text-center text-gray-600 text-xs uppercase">Total</h3>
                    </div>
                  </div>  

                  {/* Cart Items */}
                  {cart.map((cartItem, index) => (
                    <div
                      className="flex flex-col lg:flex-row items-start lg:items-center py-4 border-b gap-3 lg:gap-0"
                      key={index}
                    >
                      {/* Product Info Section */}
                      <div className="flex w-full lg:w-[50%] hover:bg-gray-50 rounded-lg p-2">
                        {/* Checkbox */}
                        <div className="flex items-center mr-2">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            checked={selectedItems.has(cartItem.cartId)}
                            onChange={() => handleItemSelect(cartItem.cartId)}
                          />
                        </div>
                        
                        {/* Product Image */}
                        <div
                          className="w-20 h-20 sm:w-24 sm:h-24 cursor-pointer flex-shrink-0"
                          onClick={() => setSelectedItem(cartItem)}
                        >
                          <img 
                            className="h-full w-full object-cover rounded-lg shadow-sm" 
                            src={cartItem.thumbnail} 
                            alt={`${cartItem.brand} Cycle`} 
                          />
                        </div>
                        
                        {/* Product Details */}
                        <div className="flex flex-col ml-3 sm:ml-4 flex-grow">
                          <div className="flex-grow">
                            <span className="font-bold text-sm sm:text-base block mb-1">
                              {cartItem.brand} Cycle
                            </span>
                            <span className="text-gray-600 text-xs sm:text-sm line-clamp-2">
                              {cartItem.parts.Frame.itemName},
                              {cartItem.parts.Handlebar.itemName},
                              {cartItem.parts.Seating.itemName}
                            </span>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              className="font-medium text-gray-500 text-xs sm:text-sm flex items-center gap-1 hover:text-red-500 transition-colors"
                              onClick={() => handleRemoveOneCart(cartItem.cartId)}
                            >
                              <RxCrossCircled className="text-base sm:text-lg" />
                              Remove
                            </button>
                            {!compareItems.some(item => item.cart.cartId === cartItem.cartId) && (
                              <button
                                className="font-medium text-gray-500 text-xs sm:text-sm flex items-center gap-1 hover:text-blue-500 transition-colors whitespace-nowrap"
                                onClick={() => handleAddToCompare(cartItem.cartId)}
                              >
                                <span className="text-base sm:text-lg">+</span>
                                Add to Compare
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Desktop Price and Quantity Section */}
                      <div className="hidden lg:grid grid-cols-3 w-[50%]">
                        <div className="flex items-center justify-center">
                          <div className="flex items-center gap-0">
                            <button
                              className="border h-8 w-8 rounded-full flex items-center justify-center bg-white shadow-sm hover:bg-gray-50 active:bg-gray-100 text-gray-600"
                              onClick={() => handleDecrement(cartItem)}
                              aria-label={cartItem.quantity === 1 ? "Remove item" : "Decrease quantity"}
                            >
                              {cartItem.quantity === 1 ? (
                                <MdDelete className="text-red-500" size={16} />
                              ) : (
                                <span className="text-gray-600">-</span>
                              )}
                            </button>
                            <span className="w-8 text-center font-medium">{cartItem.quantity}</span>
                            <button
                              className="border h-8 w-8 rounded-full flex items-center justify-center bg-white shadow-sm hover:bg-gray-50 active:bg-gray-100 text-gray-600"
                              onClick={() => handleIncrement(cartItem)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-center">
                          <span className="font-semibold">₹{cartItem.partPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-center">
                          <span className="font-semibold">₹{cartItem.totalPartsPrice.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Mobile and Tablet Price and Quantity Section */}
                      <div className="flex flex-col w-full lg:hidden gap-3 bg-gray-50 p-3 rounded-lg mt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 text-sm sm:text-base">Unit Price:</span>
                          <span className="font-semibold text-sm sm:text-base">₹{cartItem.partPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 text-sm sm:text-base">Quantity:</span>
                          <div className="flex items-center gap-4">
                            <button
                              className="border h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center bg-white shadow-sm hover:bg-gray-50 active:bg-gray-100"
                              onClick={() => handleDecrement(cartItem)}
                              aria-label={cartItem.quantity === 1 ? "Remove item" : "Decrease quantity"}
                            >
                              {cartItem.quantity === 1 ? (
                                <MdDelete className="text-red-500" size={16} />
                              ) : (
                                <span className="text-gray-600">-</span>
                              )}
                            </button>
                            <span className="w-8 text-center text-sm sm:text-base font-medium">{cartItem.quantity}</span>
                            <button
                              className="border h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center bg-white shadow-sm hover:bg-gray-50 active:bg-gray-100"
                              onClick={() => handleIncrement(cartItem)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center border-t pt-2">
                          <span className="text-gray-600 text-sm sm:text-base">Total:</span>
                          <span className="font-bold text-sm sm:text-base">₹{cartItem.totalPartsPrice.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-4">
                  <button
                    className="flex items-center justify-center font-semibold text-indigo-600 text-sm sm:text-base hover:text-indigo-700 w-full sm:w-auto"
                    onClick={continueShopping}
                  >
                    <FaLongArrowAltLeft size={18} className="mr-2" />
                    Continue Shopping
                  </button>
                  <button
                    className="flex items-center justify-center font-semibold text-indigo-600 text-sm sm:text-base hover:text-indigo-700 w-full sm:w-auto"
                    onClick={handleViewCompare}
                  >
                    Compare ({compareItems.length})
                  </button>
                </div>
              </div>
            </div>

            {/* Order Summary Section */}
            <div
              id="summary"
              className="w-full lg:w-[35%] bg-[#f6f6f6] rounded-lg shadow-md p-4 sm:p-5"
            >
              <h1 className="font-semibold text-lg sm:text-xl border-b pb-3 mb-4">
                Order Summary
              </h1>
              
              {/* Shipping Section */}
              <div className="mb-4 sm:mb-5">
                <label className="font-medium text-sm sm:text-base uppercase block mb-2">
                  Choose Shipping
                </label>
                <select
                  className="w-full p-2.5 sm:p-3 text-gray-600 text-sm sm:text-base border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={shippingCost}
                  onChange={handleShippingCostChange}
                  disabled={subtotal >= 10000}
                >
                  <option value={200}>Standard shipping - ₹200.00</option>
                  <option value={500}>Express shipping - ₹500.00</option>
                </select>
              </div>

              {/* Promo Code */}
              <div className="mb-4 sm:mb-5">
                <label
                  htmlFor="promo"
                  className="font-medium text-sm sm:text-base uppercase block mb-2"
                >
                  Apply coupon code
                </label>
                <div className="flex items-center relative gap-1">
                  <input
                    type="text"
                    id="promo"
                    placeholder="Enter your code"
                    className="w-full h-11 sm:h-12 px-3 text-sm sm:text-base border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  {promoCode && (
                    <button
                      onClick={clearPromoCode}
                      className="absolute right-[100px] sm:right-[120px] top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                      aria-label="Clear promo code"
                    >
                      <RxCrossCircled size={20} />
                    </button>
                  )}
                  <button
                    className="h-11 sm:h-12 px-4 sm:px-6 bg-gray-100 text-gray-700 border border-l-0 text-sm sm:text-base font-medium hover:bg-gray-200 active:bg-gray-300 transition-colors rounded-r-lg min-w-[90px] sm:min-w-[110px] flex items-center justify-center"
                    onClick={applyPromoCode}
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between">
                  <span className="font-normal text-sm sm:text-base ">
                    Subtotal ({totalItemsQuantity} Items)
                  </span>
                  <span className="font-normal text-sm sm:text-base">
                    ₹{subtotal.toFixed(2)}
                  </span>
                </div>

                {couponState.isApplied && (
                  <div className="flex justify-between text-green-600">
                    <span className="font-medium text-sm sm:text-base uppercase">
                      Discount ({couponState.percentage}%)
                    </span>
                    <span className="font-semibold text-sm sm:text-base">
                      -₹{discountAmount.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="font-medium text-sm sm:text-base uppercase">
                    GST (18%)
                  </span>
                  <span className="font-semibold text-sm sm:text-base">
                    ₹{gstAmount.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium text-sm sm:text-base uppercase">
                    Shipping Cost
                  </span>
                  <span className="font-semibold text-sm sm:text-base">
                    {subtotal >= 10000 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `₹${shippingCost.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between mb-4">
                    <span className="font-bold text-base sm:text-lg uppercase">Total</span>
                    <span className="font-bold text-base sm:text-lg">₹{totalPrice.toFixed(2)}</span>
                  </div>
                  <button
                    className="w-full bg-indigo-500 text-white py-3 sm:py-4 px-4 rounded-lg font-semibold hover:bg-indigo-600 active:bg-indigo-700 transition-colors text-sm sm:text-base shadow-sm"
                    onClick={handleOrder}
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Overlay */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {selectedItem.brand} Cycle Breakdown
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border p-2">Component Type</th>
                    <th className="border p-2">Selected Item</th>
                    <th className="border p-2">Price (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {componentMapping.map(({ type, key }) => {
                    const part = selectedItem.parts[key];
                    return part ? (
                      <tr key={key}>
                        <td className="border p-2">{type}</td>
                        <td className="border p-2">{part.itemName}</td>
                        <td className="border p-2">₹{part.price.toFixed(2)}</td>
                      </tr>
                    ) : null;
                  })}
                  <tr>
                    <td className="border p-2 font-bold" colSpan="2">
                      Total Parts Price
                    </td>
                    <td className="border p-2">
                      ₹{selectedItem.partPrice.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-2 font-bold" colSpan="2">
                      18% GST
                    </td>
                    <td className="border p-2">
                      ₹{(selectedItem.partPrice * 0.18).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-2 font-bold" colSpan="2">
                      Final Price
                    </td>
                    <td className="border p-2">
                      ₹{(selectedItem.partPrice * 1.18).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Address Modal */}
      <Address
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onSelectAddress={handleAddressSelect}
        selectedAddressId={selectedAddress?.addressId}
      />
    </>
  );
};

export default Cart;
