import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useAuth } from '../../hooks/useAuth';
import { orderAPI } from '../../utils/api';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';
import {  BsSearch } from 'react-icons/bs';
import { IoMdBicycle } from "react-icons/io";

const Orders = () => {
  const { userId } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('last-month');
  // const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [expandedItemId, setExpandedItemId] = useState(null);
  const [showAddress, setShowAddress] = useState({});
  const [registrationYear, setRegistrationYear] = useState(null);

  // Get current year
  const currentYear = new Date().getFullYear();
  
  // Create array of years from registration year to current year
  const years = registrationYear 
    ? Array.from(
        { length: currentYear - registrationYear + 1 },
        (_, i) => currentYear - i
      )
    : [];

  const fetchOrders = async (filter) => {
    if (!userId) {
      setError('Please log in to view orders.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await orderAPI.getOrdersByFilter(userId, filter);
      // Extract registration year from the first order's userRegisterDate
      if (data && data.length > 0 && data[0].userRegisterDate) {
        const regYear = new Date(data[0].userRegisterDate).getFullYear();
        setRegistrationYear(regYear);
      }
      setOrders(data);
      setFilteredOrders(data);
    } catch (err) {
      setError('Failed to fetch orders. Please try again later.');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch when userId is available
  useEffect(() => {
    if (userId) {
      fetchOrders('last-month');
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
    const filtered = orders.filter(order => {
      const searchLower = searchQuery.toLowerCase();
      return order.items.some(item => 
        item.brand.toLowerCase().includes(searchLower) ||
        item.frame.toLowerCase().includes(searchLower)
      );
    });
    setFilteredOrders(filtered);
  }, [searchQuery, orders]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // const toggleOrderExpansion = (orderId) => {
  //   setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  //   setExpandedItemId(null);
  //   setShowAddress({});
  // };

  const toggleItemDetails = (itemId) => {
    setExpandedItemId(expandedItemId === itemId ? null : itemId);
  };

  const toggleAddress = (orderId) => {
    setShowAddress(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  return (
    <div className="w-full md:w-[90%] mx-auto mt-6 px-4">
      {/* Header Row - Title, Filter, and Search in single line */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        {/* Title */}
        <h1 className="text-2xl font-bold whitespace-nowrap">Order History</h1>
        
        {/* Filter Dropdown */}
        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-[180px]"
        >
          <option value="last-month">Last Month</option>
          <option value="last-three-months">Last 3 Months</option>
          <option value="last-six-months">Last 6 Months</option>
          {years.map(year => (
            <option key={year} value={`year-${year}`}>{year}</option>
          ))}
        </select>

        {/* Search Bar */}
        <div className="relative w-[300px]">
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
            onClick={() => setSearchQuery('')}
          >
            Clear 
          </button>
        </div>
      </div>

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
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div key={order.orderId} className="bg-white p-4 sm:p-6 rounded-lg shadow-md transition-all duration-300">
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <div className="space-y-1 w-full sm:w-auto">
                  <p className="text-sm text-gray-600">Order ID: <span className="font-medium">{order.orderId}</span></p>
                  <p className="text-sm text-gray-600">
                    Placed on: <span className="font-medium">
                      {format(new Date(order.orderDate), 'MMM dd, yyyy, hh:mm a')}
                    </span>
                  </p>
                </div>
                <div className="mt-2 sm:mt-0 flex flex-col sm:items-end w-full sm:w-auto">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)} w-fit`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Items Summary */}
              <div className="border-t border-b py-4">
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id}>
                      <div className="flex justify-between items-center">
                        <button
                          onClick={() => toggleItemDetails(item.id)}
                          className="flex items-center gap-2 font-medium text-indigo-600 hover:text-indigo-800"
                        >
                          {/* <BsBoxSeam /> */}
                          <IoMdBicycle />
                          {item.brand}
                          {expandedItemId === item.id ? <FaChevronUp className="w-4 h-4" /> : <FaChevronDown className="w-4 h-4" />}
                        </button>
                        <span className="text-gray-600">₹{(item.quantity * item.unitPrice).toFixed(2)}</span>
                      </div>
                      
                      {/* Collapsible Item Details */}
                      <div className={`mt-2 ml-6 transition-all duration-300 ${expandedItemId === item.id ? 'block' : 'hidden'}`}>
                        <div className="text-sm text-gray-600">
                          <p>Quantity: {item.quantity} × ₹{item.unitPrice.toFixed(2)}</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                            <p><span className="font-medium">Frame:</span> {item.frame}</p>
                            <p><span className="font-medium">Handlebar:</span> {item.handlebar}</p>
                            <p><span className="font-medium">Seating:</span> {item.seating}</p>
                            <p><span className="font-medium">Wheel:</span> {item.wheel}</p>
                            <p><span className="font-medium">Brakes:</span> {item.brakes}</p>
                            <p><span className="font-medium">Tyre:</span> {item.tyre}</p>
                            <p><span className="font-medium">Chain Assembly:</span> {item.chainAssembly}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Summary */}
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Items Total:</span>
                  <span className="font-medium">₹{order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">GST (18%):</span>
                  <span className="font-medium">₹{order.gstAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-medium">₹{order.shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-bold pt-2 border-t">
                  <span>Grand Total:</span>
                  <span>₹{order.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Shipping Address Button */}
              <button
                onClick={() => toggleAddress(order.orderId)}
                className="w-full flex items-center justify-between p-2 mt-4 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors duration-200"
              >
                <span className="font-medium flex items-center gap-2">
                  <MdLocationOn />
                  Shipping Address
                </span>
                {showAddress[order.orderId] ? <FaChevronUp /> : <FaChevronDown />}
              </button>

              {/* Collapsible Address */}
              <div className={`mt-2 transition-all duration-300 ${showAddress[order.orderId] ? 'block' : 'hidden'}`}>
                <div className="text-sm text-gray-600 border-t pt-4">
                  <p className="font-medium">{order.address.fullName}</p>
                  <p>{order.address.flatHouseNo}, {order.address.apartment}</p>
                  <p>{order.address.areaStreet}</p>
                  <p>{order.address.landmark && `Near ${order.address.landmark}`}</p>
                  <p>{order.address.city}, {order.address.state} - {order.address.pinCode}</p>
                  <p>Phone: {order.address.mobileNumber}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;