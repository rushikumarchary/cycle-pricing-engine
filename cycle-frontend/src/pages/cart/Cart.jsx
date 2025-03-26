import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import { useCart } from "../../context/CartContext";
import { cartAPI, compareAPI } from "../../utils/api";
import React from "react";
import Address from "../../pages/address/Address";
import { loadRazorpay, createOrder, initializeRazorpayCheckout } from "../../utils/payment";

const Cart = () => {
  const { updateCartCount } = useCart();
  const [cart, setCart] = useState([]);
  const [compareItems, setCompareItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalItemsQuantity, setTotalItemsQuantity] = useState(0);
  const [promoCode, setPromoCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
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

  // Memoize getTotalQuantity function
  const getTotalQuantity = React.useCallback(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  // Update cart count whenever cart changes
  useEffect(() => {
    updateCartCount(getTotalQuantity());
  }, [cart, updateCartCount, getTotalQuantity]);

  // Fetch cart data
  const fetchCart = async () => {
    try {
      const data = await cartAPI.getAllCartItems();
      setCart(data);
    } catch (error) {
      if (!error.isHandled) {
        if (error.response && error.response.status === 401) {
          navigate('/login');
        } else {
          setCart([]);
          updateCartCount(0);
        }
        error.isHandled = true;
      }
    }
  };

  useEffect(() => {
    fetchCart();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  useEffect(() => {
    const calculateSelectedPrices = () => {
      const selectedSubtotal = cart.reduce((total, item) => {
        if (selectedItems.has(item.cartId)) {
          return total + item.totalPartsPrice;
        }
        return total;
      }, 0);
      
      setSubtotal(selectedSubtotal);
      
      if (selectedSubtotal >= 10000 || selectedSubtotal === 0) {
        setShippingCost(0);
      } else if (shippingCost === 0) {
        setShippingCost(200);
      }
      
      let total = selectedSubtotal;
      
      if (discountApplied) {
        const discount = total * 0.05;
        setDiscountAmount(discount);
        total -= discount;
      } else {
        setDiscountAmount(0);
      }
      
      const gst = total * 0.18;
      setGstAmount(gst);
      total += gst;
      
      if (selectedSubtotal > 0) {
        total += shippingCost;
      }
      
      setTotalPrice(total);
      
      const selectedQuantity = cart.reduce((total, item) => {
        if (selectedItems.has(item.cartId)) {
          return total + item.quantity;
        }
        return total;
      }, 0);
      setTotalItemsQuantity(selectedQuantity);
    };
    
    calculateSelectedPrices();
  }, [cart, selectedItems, discountApplied, shippingCost]);

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
        await cartAPI.removeCartItem(item.cartId);
        await fetchCart();
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
      await fetchCart();
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item");
    }
  };

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === "NEW5") {
      if (!discountApplied) {
        setDiscountApplied(true);
        toast.success("5% Discount Applied Successfully!");
      } else {
        toast.error("Promo Code Already Applied");
      }
    } else {
      setDiscountApplied(false);
      setDiscountAmount(0);
      toast.error("Invalid promo code");
    }
  };

  const clearPromoCode = () => {
    setPromoCode("");
    setDiscountApplied(false);
    setDiscountAmount(0);
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

  const handleCreateOrder = async (address) => {
    setIsLoading(true);
    setLoadingMessage("Creating your order...");
    try {
      // Prepare cart-specific order request
      const orderRequest = {
        addressId: address.addressId,
        shippingCost: shippingCost,
        cartIds: Array.from(selectedItems),
        discountApplied: discountApplied
      };

      // Create order using payment utility
      const orderData = await createOrder(orderRequest);
      setLoadingMessage("Initializing payment gateway...");
      await handlePaymentCheckout(orderData);
    } catch (error) {
      setIsLoading(false);
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
          onPaymentSuccess: async () => {
            await cartAPI.clearCart();
            updateCartCount(0);
            setIsLoading(false);
            setLoadingMessage("");
            toast.success("Payment Successful! Order has been Confirmed.");
            navigate("/orders");
          },
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
    if (selectedItems.size === 0) {
      toast.error("Please select at least one item to checkout");
      return;
    }
    
    // Calculate total for selected items
    const selectedTotal = cart.reduce((total, item) => {
      if (selectedItems.has(item.cartId)) {
        return total + item.totalPartsPrice;
      }
      return total;
    }, 0);
    
    if (selectedTotal === 0) {
      toast.error("Please select items to proceed");
      return;
    }
    
    setShowAddressModal(true);
  };

  const handleItemSelect = (cartId) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cartId)) {
        newSet.delete(cartId);
      } else {
        newSet.add(cartId);
      }
      return newSet;
    });
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      // Select all items that are in the cart
      setSelectedItems(new Set(cart.map(item => item.cartId)));
    } else {
      // Deselect all items
      setSelectedItems(new Set());
    }
  };

  // Component mapping for estimate details
  const componentMapping = [
    { type: "Frame Material", key: "Frame" },
    { type: "Handlebar Type", key: "Handlebar" },
    { type: "Seating Type", key: "Seating" },
    { type: "Wheel Type", key: "Wheel" },
    { type: "Tyre Type", key: "Tyre" },
    { type: "Brakes Type", key: "Brakes" },
    { type: "Chain Assembly", key: "Chain Assembly" },
  ];

  const handleAddToCompare = async (id) => {
    try {
      // Check if item is already in comparison
      const existingItems = await compareAPI.getAllComparisons();
      if (existingItems.some(item => item.cartId === id)) {
        toast.error("Item already in comparison list");
        return;
      }
      
      // Check if comparison limit is reached (max 3 items)
      if (existingItems.length >= 4) {
        toast.error("You can compare up to 4 items only");
        return;
      }

      // Add item to comparison - userId is handled internally now
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
      
      if (response.length < 2) {
        toast.error("Add at least 2 items to compare");
        return;
      }

      // Navigate to compare page
      navigate('/compare');
    } catch (error) {
      console.error("Error viewing comparisons:", error);
      toast.error("Failed to load comparison items");
    }
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
        <div className="w-full h-[60vh] flex flex-col items-center justify-center gap-4">
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
        <div className="w-full max-w-[1200px] mx-auto my-2 md:mt-4 px-3 sm:px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 lg:gap-2">
            {/* Cart Section */}
            <div className="w-full lg:w-2/3 bg-white rounded-lg shadow-md">
              <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6">
                <div className="flex justify-between items-center border-b pb-3">
                  <h1 className="font-semibold text-base sm:text-lg md:text-xl lg:text-2xl">
                    Shopping Cart
                  </h1>
                  <h2 className="font-semibold text-base sm:text-lg md:text-xl lg:text-2xl">
                    {cart.length} Products
                  </h2>
                </div>
                
                {/* Products container with sticky headers */}
                <div className="max-h-[calc(100vh-250px)] sm:max-h-[calc(100vh-280px)] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
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
                            <button
                              className="font-medium text-gray-500 text-xs sm:text-sm flex items-center gap-1 hover:text-blue-500 transition-colors whitespace-nowrap"
                              onClick={() => handleAddToCompare(cartItem.cartId)}
                            >
                              <span className="text-base sm:text-lg">+</span>
                              Add to Compare
                            </button>
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
              className="w-full lg:w-1/3 bg-[#f6f6f6] rounded-lg shadow-md p-4 sm:p-5 lg:p-6"
            >
              <h1 className="font-semibold text-lg sm:text-xl lg:text-2xl border-b pb-3 mb-4">
                Order Summary
              </h1>
              
              {/* Shipping Section */}
              {subtotal < 10000 ? (
                <div className="mb-4 sm:mb-5">
                  <label className="font-medium text-sm sm:text-base uppercase block mb-2">
                    Choose Shipping
                  </label>
                  <select
                    className="w-full p-2.5 sm:p-3 text-gray-600 text-sm sm:text-base border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={shippingCost}
                    onChange={(e) => setShippingCost(Number(e.target.value))}
                  >
                    <option value={200}>Standard shipping - ₹200.00</option>
                    <option value={500}>Express shipping - ₹500.00</option>
                  </select>
                </div>
              ) : null}

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

                {discountApplied && (
                  <div className="flex justify-between text-green-600">
                    <span className="font-medium text-sm sm:text-base uppercase">
                      Discount (5%)
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
