import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useAuth } from "../../hooks/useAuth";
import { useOrders } from "../../context/OrderContext";
import { useCart } from "../../context/CartContext";
import { cartAPI } from "../../utils/api";
import React from "react";
import Address from "../../pages/address/Address";

const Cart = () => {
  const { userName, userEmail } = useAuth();
  const { updateCartCount } = useCart();
  const { addOrder } = useOrders();
  const [cart, setCart] = useState([]);
  const [compareItems, setCompareItems] = useState([]);
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
    // Calculate total price for all items in the cart (initial and after discount)
    const calculateTotalPrice = () => {
      // Calculate subtotal
      const newSubtotal = cart.reduce((total, cartItem) => total + cartItem.totalPartsPrice, 0);
      setSubtotal(newSubtotal);

      // Start with subtotal
      let total = newSubtotal;

      // Apply discount if promo code is active
      if (discountApplied) {
        const discount = total * 0.05;
        setDiscountAmount(discount);
        total -= discount;
      } else {
        setDiscountAmount(0);
      }

      // Calculate GST (18%) on the discounted amount
      const gst = total * 0.18;
      setGstAmount(gst);
      total += gst;

      // Add shipping cost to total only if subtotal is less than 10000
      if (newSubtotal < 10000) {
        total += shippingCost;
      }

      setTotalPrice(total);
    };

    calculateTotalPrice();
    setTotalItemsQuantity(getTotalQuantity());
  }, [cart, discountApplied, shippingCost, getTotalQuantity]);

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

  const loadRazorpay = async () => {
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

  const handleOrder = async () => {
    if (!selectedAddress) {
      setShowAddressModal(true);
      return;
    }

    try {
      await cartAPI.clearCart(userName);
      const orderItems = cart.map(item => ({
        id: item.cartId,
        title: `${item.brand} Cycle`,
        thumbnail: item.thumbnail,
        quantity: item.quantity,
        price: item.partPrice,
        parts: item.parts
      }));
      
      await addOrder(orderItems, totalPrice);
      updateCartCount(0);
      toast.success("Payment Successful! Order has been placed.");
      navigate("/orders");
    } catch (error) {
      console.error("Error processing order:", error);
      toast.error("Error processing order");
    }
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setShowAddressModal(false);
    // Proceed with payment after address selection
    handleCheckout();
  };

  // eslint-disable-next-line no-unused-vars
  const handleCheckout = async () => {
    const isLoaded = await loadRazorpay();
    if (!isLoaded) {
      toast.error("Failed to load Razorpay. Please try again.");
      return;
    }

    const options = {
      key: "rzp_test_5C7srwxYlDtKK8",
      amount: totalPrice * 100,
      currency: "INR",
      name: "Cycle Pricing Engine",
      description: "Purchase from Cycle Pricing Engine",
      image: logo,
      handler: async function (response) {
        console.log("Payment successful:", response);
        try {
          await cartAPI.clearCart(userName);
          const orderItems = cart.map(item => ({
            id: item.cartId,
            title: `${item.brand} Cycle`,
            thumbnail: item.thumbnail,
            quantity: item.quantity,
            price: item.partPrice,
            parts: item.parts
          }));
          
          await addOrder(orderItems, totalPrice);
          toast.success("Payment Successful! Order has been placed.");
          navigate("/orders");
        } catch (error) {
          toast.error( error || "Error processing order");
        }
      },
      prefill: {
        name: userName,
        email: userEmail,
      },
      theme: {
        color: "#28544B",
      },
    };  

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
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

  const handleAddToCompare = (cartItem) => {
    if (compareItems.some(item => item.cartId === cartItem.cartId)) {
      toast.error("Item already in comparison list");
      return;
    }
    if (compareItems.length >= 3) {
      toast.error("You can compare up to 3 items only");
      return;
    }
    setCompareItems([...compareItems, cartItem]);
    toast.success("Added to comparison list");
  };

  const handleViewCompare = () => {
    if (compareItems.length < 2) {
      toast.error("Add at least 2 items to compare");
      return;
    }
    // TODO: Navigate to compare page or show compare modal
    console.log("Compare items:", compareItems);
  };

  return (
    <>
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
                
                {/* Table Headers - Hide on Mobile and Small Tablets */}
                <div className="hidden lg:flex mt-4 mb-2">
                  <h3 className="font-semibold text-gray-600 text-xs uppercase w-2/5 pl-28">
                    Product Details
                  </h3>
                  <h3 className="font-semibold text-center text-gray-600 text-xs uppercase w-1/5">
                    Quantity
                  </h3>
                  <h3 className="font-semibold text-center text-gray-600 text-xs uppercase w-1/5">
                    Price
                  </h3>
                  <h3 className="font-semibold text-center text-gray-600 text-xs uppercase w-1/5">
                    Total
                  </h3>
                </div>

                {/* Products container */}
                <div className="max-h-[calc(100vh-250px)] sm:max-h-[calc(100vh-280px)] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {cart.map((cartItem, index) => (
                    <div
                      className="flex flex-col lg:flex-row items-start lg:items-center hover:bg-gray-50 py-4 border-b gap-3 lg:gap-0"
                      key={index}
                    >
                      {/* Product Info Section */}
                      <div className="flex w-full lg:w-2/5">
                        <div
                          className="w-24 sm:w-28 cursor-pointer flex-shrink-0"
                          onClick={() => setSelectedItem(cartItem)}
                        >
                          <img 
                            className="h-24 sm:h-28 w-full object-cover rounded-lg shadow-sm" 
                            src={cartItem.thumbnail} 
                            alt={`${cartItem.brand} Cycle`} 
                          />
                        </div>
                        <div className="flex flex-col justify-between ml-3 sm:ml-4 flex-grow">
                          <span className="font-bold text-base sm:text-lg">
                            {cartItem.brand} Cycle
                          </span>
                          <span className="text-gray-600 text-sm mt-1 line-clamp-2">
                            {cartItem.parts.Frame.itemName},
                            {cartItem.parts.Handlebar.itemName},
                            {cartItem.parts.Seating.itemName},
                          </span>
                          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-4 mt-2">
                            <button
                              className="font-semibold hover:text-red-500 text-gray-500 text-sm w-full lg:w-auto flex items-start gap-1 justify-center lg:justify-start"
                              onClick={() => handleRemoveOneCart(cartItem.cartId)}
                            >
                              <RxCrossCircled size={16} />
                              Remove
                            </button>
                            <button
                              className="font-semibold hover:text-blue-500 text-gray-500 text-sm w-full lg:w-auto flex items-center gap-1 justify-center lg:justify-start"
                              onClick={() => handleAddToCompare(cartItem)}
                            >
                              <span className="text-lg">+</span>
                              Add to Compare
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Mobile and Tablet Price and Quantity Section */}
                      <div className="flex flex-col w-full lg:hidden gap-3 bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 text-sm sm:text-base">Unit Price:</span>
                          <span className="font-semibold text-sm sm:text-base">₹{cartItem.partPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 text-sm sm:text-base">Quantity:</span>
                          <div className="flex items-center gap-4">
                            <button
                              className="border h-7 w-7 sm:h-9 sm:w-9 rounded-full flex items-center justify-center bg-white shadow-sm hover:bg-gray-50 active:bg-gray-100"
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
                              className="border h-8 w-8 sm:h-9 sm:w-9 rounded-full flex items-center justify-center bg-white shadow-sm hover:bg-gray-50 active:bg-gray-100"
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

                      {/* Desktop Price and Quantity Section */}
                      <div className="hidden lg:flex justify-between w-3/5">
                        <div className="flex items-center justify-center w-1/3 gap-2">
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
                        <span className="text-center w-1/3 font-semibold">
                          ₹{cartItem.partPrice.toFixed(2)}
                        </span>
                        <span className="text-center w-1/3 font-semibold">
                          ₹{cartItem.totalPartsPrice.toFixed(2)}
                        </span>
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
