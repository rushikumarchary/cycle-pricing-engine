import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import {
  isAuthenticated,
  debugToken,
  hasManagementAccess,
  handleApiError,
} from "../../utils/auth";
import { orderAPI } from "../../utils/api";
import { FaEye } from "react-icons/fa";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filterType, setFilterType] = useState("last-month");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const ordersPerPage = 5;
  const navigate = useNavigate();
  const location = useLocation();

  // Add authentication check
  useEffect(() => {
    const checkAuth = () => {
      
      debugToken();
      if (!isAuthenticated()) {
        console.log("Not authenticated, redirecting to login");
        navigate("/signIn", { state: { redirectTo: location.pathname } });
        return;
      }
      
    };

    checkAuth();
    // Check auth every 5 minutes
    const interval = setInterval(checkAuth, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [navigate, location.pathname]);

  // Fetch orders with auth check
  const fetchOrders = async () => {
    try {
      
      debugToken();

      if (!isAuthenticated()) {
        return;
      }

      let response;
      switch (filterType) {
        case "last-month":
          response = await orderAPI.getAdminLastMonthOrders();
          break;
        case "last-three-months":
          response = await orderAPI.getAdminLastThreeMonthsOrders();
          break;
        case "last-six-months":
          response = await orderAPI.getAdminLastSixMonthsOrders();
          break;
        case "year":
          response = await orderAPI.getAdminOrdersByYear(selectedYear);
          break;
        default:
          response = await orderAPI.getAdminLastMonthOrders();
      }
      
      // Sort orders by orderDate in descending order (newest first)
      const sortedOrders = response.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
      setOrders(sortedOrders);

    } catch (error) {
      console.error("Error fetching orders:", error);
      handleApiError(error);
    }
  };

  useEffect(() => {
    
    const hasAccess = hasManagementAccess();
  
    
    if (!hasAccess) {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "Only Administrators and Managers can manage orders.",
        
      });
      navigate("/");
      return;
    }
    fetchOrders();
  }, [navigate, filterType, selectedYear]);

  // Handle search functionality
  useEffect(() => {
    let filtered = orders;

    // First apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Then apply search term filter
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((order) =>
        order.address.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.orderId.toString().includes(searchTerm)
      );
    }

    setFilteredOrders(filtered);
  }, [searchTerm, orders, statusFilter]);

  // Handle pagination
  useEffect(() => {
    const totalPages = Math.ceil(orders.length / ordersPerPage);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [orders.length, currentPage, ordersPerPage]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await orderAPI.updateOrderStatus(orderId, newStatus);
      await fetchOrders();
      toast.success("Order status updated successfully");
    } catch (error) {
      toast.error(error.response?.data || "Failed to update order status");
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.length > 0
    ? filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder)
    : orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(
    (filteredOrders.length > 0 ? filteredOrders.length : orders.length) / ordersPerPage
  );

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'dispatch':
        return 'bg-purple-100 text-purple-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 ">
      <div className="w-full px-4 mx-auto flex flex-col gap-4">
        {/* Filter Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border rounded p-2"
            >
              <option value="last-month">Last Month</option>
              <option value="last-three-months">Last 3 Months</option>
              <option value="last-six-months">Last 6 Months</option>
              <option value="year">By Year</option>
            </select>
            {filterType === "year" && (
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="border rounded p-2"
              >
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            )}
          </div>
          <div className="flex items-center gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded py-2 font-semibold"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Dispatch">Dispatch</option>
              <option value="Delivered">Delivered</option>
              <option value="Canceled">Canceled</option>
            </select>
            <input
              type="text"
              placeholder="Search by name or order ID..."
              className="p-2 border rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm.length > 0 && (
              <button
                onClick={() => setSearchTerm("")}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Clear Search
              </button>
            )}
          </div>
        </div>

        {/* Search Results Info */}
        {searchTerm && (
          <div className="mb-4">
            {filteredOrders.length > 0 ? (
              <p className="text-gray-600">
                Found {filteredOrders.length} order(s) matching: {searchTerm}
              </p>
            ) : (
              <p className="text-gray-600">
                No orders found matching: {searchTerm}
              </p>
            )}
          </div>
        )}

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-[0_10px_20px_rgba(23,23,23,1)]">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-center">Order ID</th>
                <th className="px-6 py-3 text-center">Customer Name</th>
                <th className="px-6 py-3 text-center">Order Date</th>
                <th className="px-6 py-3 text-center">Total Amount</th>
                <th className="px-6 py-3 text-center">Status</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order) => (
                <tr key={order.orderId} className="border-b hover:bg-gray-200">
                  <td className="px-6 py-4 text-center">{order.orderId}</td>
                  <td className="px-6 py-4 text-center">{order.address.fullName}</td>
                  <td className="px-6 py-4 text-center">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-center">₹{order.totalAmount.toFixed(2)}</td>
                  <td className="px-6 py-4 text-center">
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateStatus(order.orderId, e.target.value)}
                      className="border rounded p-1"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Dispatch">Dispatch</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Canceled">Canceled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleViewDetails(order)}
                      className="text-blue-600 hover:text-blue-800"
                      title="View Details"
                    >
                      <FaEye size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {(filteredOrders.length > 0 || (!searchTerm && orders.length > 0)) && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${
                currentPage === 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              Previous
            </button>

            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 rounded ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${
                currentPage === totalPages
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-lg w-full max-w-4xl flex flex-col max-h-[85vh] my-[5vh]">
            {/* Fixed Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b bg-white rounded-t-lg">
              <h2 className="text-xl font-bold">Order Details</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto p-6 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3 text-lg">Order Information</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Order ID:</span> {selectedOrder.orderId}</p>
                    <p><span className="font-medium">Date:</span> {new Date(selectedOrder.orderDate).toLocaleString()}</p>
                    <p><span className="font-medium">Status:</span> <span className={getStatusColor(selectedOrder.status)}>{selectedOrder.status}</span></p>
                    <p><span className="font-medium">Subtotal:</span> ₹{selectedOrder.subtotal.toFixed(2)}</p>
                    <p><span className="font-medium">GST:</span> ₹{selectedOrder.gstAmount.toFixed(2)}</p>
                    <p><span className="font-medium">Shipping:</span> ₹{selectedOrder.shippingCost.toFixed(2)}</p>
                    <p className="text-lg font-semibold text-green-700">Total: ₹{selectedOrder.totalAmount.toFixed(2)}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3 text-lg">Shipping Address</h3>
                  <div className="space-y-2">
                    <p className="font-medium">{selectedOrder.address.fullName}</p>
                    <p>{selectedOrder.address.mobileNumber}</p>
                    <p>{selectedOrder.address.flatHouseNo}, {selectedOrder.address.apartment}</p>
                    <p>{selectedOrder.address.areaStreet}</p>
                    <p>{selectedOrder.address.landmark}</p>
                    <p>{selectedOrder.address.city}, {selectedOrder.address.state} - {selectedOrder.address.pinCode}</p>
                    <p className="mt-2"><span className="font-medium">Type:</span> <span className="px-2 py-1 bg-gray-200 rounded-full">{selectedOrder.address.addressType}</span></p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg">
                <h3 className="font-semibold mb-3 text-lg">Order Details</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 border">Brand</th>
                        <th className="px-4 py-3 border">Specifications</th>
                        <th className="px-4 py-3 border">Quantity</th>
                        <th className="px-4 py-3 border">Unit Price</th>
                        <th className="px-4 py-3 border">Total Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 border font-medium">{selectedOrder.brand}</td>
                        <td className="px-4 py-3 border">
                          <ul className="list-disc list-inside space-y-1">
                            <li>Frame: <span className="font-medium">{selectedOrder.specifications.frame}</span></li>
                            <li>Handlebar: <span className="font-medium">{selectedOrder.specifications.handlebar}</span></li>
                            <li>Seating: <span className="font-medium">{selectedOrder.specifications.seating}</span></li>
                            <li>Wheel: <span className="font-medium">{selectedOrder.specifications.wheel}</span></li>
                            <li>Brakes: <span className="font-medium">{selectedOrder.specifications.brakes}</span></li>
                            <li>Tyre: <span className="font-medium">{selectedOrder.specifications.tyre}</span></li>
                            <li>Chain Assembly: <span className="font-medium">{selectedOrder.specifications.chainAssembly}</span></li>
                          </ul>
                        </td>
                        <td className="px-4 py-3 border text-center">{selectedOrder.quantity}</td>
                        <td className="px-4 py-3 border text-right">₹{selectedOrder.unitPrice.toFixed(2)}</td>
                        <td className="px-4 py-3 border text-right font-medium">₹{(selectedOrder.quantity * selectedOrder.unitPrice).toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
