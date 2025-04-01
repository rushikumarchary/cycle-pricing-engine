import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { useAuth } from "../../hooks/useAuth";
import { orderAPI } from "../../utils/api";
import { FaChevronDown } from "react-icons/fa";
import { BsSearch } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import OrderDetailsModal from "../../components/order/OrderDetailsModal";
import ItemDetailsModal from "../../components/order/ItemDetailsModal";

const UserOrders = () => {
  const { userId } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("last-month");
  const [registrationYear, setRegistrationYear] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showShipTo, setShowShipTo] = useState(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Get current year
  const currentYear = new Date().getFullYear();

  // Create array of years from registration year to current year
  const years = registrationYear
    ? Array.from(
        { length: currentYear - registrationYear + 1 },
        (_, i) => currentYear - i
      )
    : [];

  // Close ship-to dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showShipTo && !event.target.closest(".ship-to-container")) {
        setShowShipTo(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showShipTo]);

  // Function to format specifications into a single string
  const formatSpecifications = useCallback((specs) => {
    const values = Object.values(specs);
    return values.join(" , ");
  }, []);

  const fetchOrders = async (filter) => {
    if (!userId) {
      setError("Please log in to view orders.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await orderAPI.getOrdersByFilter(userId, filter);
      // Sort orders by orderDate in descending order (newest first)
      const sortedData = data.sort(
        (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
      );
      // Extract registration year from the first order's userRegisterDate
      if (
        sortedData &&
        sortedData.length > 0 &&
        sortedData[0].userRegisterDate
      ) {
        const regYear = new Date(sortedData[0].userRegisterDate).getFullYear();
        setRegistrationYear(regYear);
      }
      setOrders(sortedData);
      setFilteredOrders(sortedData);
    } catch (err) {
      setError("Failed to fetch orders. Please try again later.");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch when userId is available
  useEffect(() => {
    if (userId) {
      fetchOrders("last-month");
    }
  }, [userId]);

  // Handle filter changes
  useEffect(() => {
    if (userId && selectedFilter) {
      fetchOrders(selectedFilter);
    }
  }, [selectedFilter, userId]);

  useEffect(() => {
    // Filter orders based on search query
    const filtered = orders.filter((order) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        order.brand.toLowerCase().includes(searchLower) ||
        order.specifications.frame.toLowerCase().includes(searchLower)
      );
    });
    setFilteredOrders(filtered);
  }, [searchQuery, orders]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  // Pending, Processing, Confirmed, Dispatch,Delivered Canceled
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
        case "dispatch":
          return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-gray-100 text-gray-800";

      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const closeOrderModal = () => {
    setSelectedOrder(null);
    setShowOrderModal(false);
  };

  const openItemDetails = (order) => {
    setSelectedItem(order);
    setShowItemModal(true);
  };

  const closeItemModal = () => {
    setSelectedItem(null);
    setShowItemModal(false);
  };

  return (
    <div className="w-full md:w-[80%] mx-auto mt-6 px-2 sm:px-4">
      {/* Header Row - Title, Filter, and Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-bold">Order History</h1>

        {/* Filter and Search Container */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          {/* Filter Dropdown */}
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-[180px]"
          >
            <option value="last-month">Last Month</option>
            <option value="last-three-months">Last 3 Months</option>
            <option value="last-six-months">Last 6 Months</option>
            {years.map((year) => (
              <option key={year} value={`year-${year}`}>
                {year}
              </option>
            ))}
          </select>

          {/* Search Bar */}
          <div className="relative w-full sm:w-[300px]">
            <input
              type="text"
              placeholder="Search orders by brand or frame"
              value={searchQuery}
              onChange={handleSearch}
              className="w-full px-4 py-2 pl-10 pr-[100px] border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-gray-800 text-white rounded-md text-sm hover:bg-gray-700 transition-colors"
              onClick={() => setSearchQuery("")}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Loading, Error, and Empty States */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-600">{error}</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No orders found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.orderId}
              className="bg-white p-3 sm:p-6 rounded-lg shadow-md"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row gap-4 pb-4 border-b">
                {/* Order Info Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
                  <div>
                    <p className="text-xs text-gray-500">ORDER PLACED</p>
                    <p className="text-sm">
                      {format(new Date(order.orderDate), "dd MMM yyyy")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">TOTAL</p>
                    <p className="text-sm">₹{order.totalAmount.toFixed(2)}</p>
                  </div>
                  {/* Ship To Section */}
                  <div className="relative ship-to-container group">
                    <p className="text-xs text-gray-500">SHIP TO</p>
                    <button
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                      onClick={() =>
                        setShowShipTo(
                          showShipTo === order.orderId ? null : order.orderId
                        )
                      }
                    >
                      {order.address.fullName}
                      <FaChevronDown
                        className={`w-3 h-3 transform transition-transform ${
                          showShipTo === order.orderId ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Ship To Dropdown */}
                    <div
                      className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg p-4 z-10 min-w-[250px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out"
                      style={{
                        visibility:
                          showShipTo === order.orderId ? "visible" : "",
                        opacity: showShipTo === order.orderId ? "1" : "",
                      }}
                    >
                      {showShipTo === order.orderId && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowShipTo(null);
                          }}
                          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                        >
                          <IoClose className="w-4 h-4" />
                        </button>
                      )}
                      <p className="font-medium">{order.address.fullName}</p>
                      <p className="text-sm text-gray-600">
                        {order.address.flatHouseNo}, {order.address.apartment}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.address.areaStreet}
                      </p>
                      {order.address.landmark && (
                        <p className="text-sm text-gray-600">
                          Near {order.address.landmark}
                        </p>
                      )}
                      <p className="text-sm text-gray-600">
                        {order.address.city}, {order.address.state}{" "}
                        {order.address.pinCode}
                      </p>
                      <p className="text-sm text-gray-600">India</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">
                      ORDER # {order.orderId}
                    </p>
                    <button
                      onClick={() => openOrderDetails(order)}
                      className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
                    >
                      View order details
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="mt-4 flex flex-col sm:flex-row gap-4">
                <img
                  src={order.thumbnail}
                  alt={order.brand}
                  className="w-full sm:w-24 h-48 sm:h-24 object-cover rounded-md"
                  onError={(e) => {
                    e.target.src = "/src/assets/default-cycle.webp";
                    e.target.onerror = null;
                  }}
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-medium text-lg mb-2">{order.brand}</h3>
                    <p className="text-sm text-gray-600">
                      {formatSpecifications(order.specifications)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <button className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                      Buy it again
                    </button>
                    <button
                      onClick={() => openItemDetails(order)}
                      className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                    >
                      View your item
                    </button>
                  </div>
                </div>
                <div className="text-right mt-4 sm:mt-0">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                  <p className="mt-2 text-sm text-gray-600">
                    Estimated delivery:
                    <br />
                    <span className="font-medium">
                      {format(
                        new Date(order.estimatedDeliveryDate),
                        "dd MMM yyyy"
                      )}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showOrderModal && selectedOrder && (
        <OrderDetailsModal order={selectedOrder} onClose={closeOrderModal} />
      )}
      {showItemModal && selectedItem && (
        <ItemDetailsModal order={selectedItem} onClose={closeItemModal} />
      )}
    </div>
  );
};

export default UserOrders;
