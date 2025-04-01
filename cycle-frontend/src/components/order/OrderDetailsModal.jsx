import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { MdLocationOn } from 'react-icons/md';
import { IoClose } from "react-icons/io5";

const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;

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
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-3 sm:p-4 flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-bold">Order Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-full">
            <IoClose className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
        
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Order Status and Dates */}
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Order Placed</p>
                <p className="text-sm sm:text-base font-medium">{format(new Date(order.orderDate), 'MMM dd, yyyy')}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Order ID</p>
                <p className="text-sm sm:text-base font-medium">{order.orderId}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)} mt-1`}>
                  {order.status}
                </span>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Estimated Delivery</p>
                <p className="text-sm sm:text-base font-medium">{format(new Date(order.estimatedDeliveryDate), 'MMM dd, yyyy')}</p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="border rounded-lg p-3 sm:p-4">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <MdLocationOn className="text-gray-600" />
              Shipping Address
            </h3>
            <div className="text-xs sm:text-sm text-gray-600">
              <p className="font-medium">{order.address.fullName}</p>
              <p>{order.address.flatHouseNo}, {order.address.apartment}</p>
              <p>{order.address.areaStreet}</p>
              {order.address.landmark && <p>Near {order.address.landmark}</p>}
              <p>{order.address.city}, {order.address.state} - {order.address.pinCode}</p>
              <p>Phone: {order.address.mobileNumber}</p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="border rounded-lg p-3 sm:p-4">
            <h3 className="font-medium mb-4">Order Summary</h3>
            <div className="flex flex-col sm:flex-row items-start gap-4 pb-4 border-b">
              <img
                src={order.thumbnail}
                alt={`${order.brand} cycle`}
                className="w-full sm:w-24 h-48 sm:h-24 object-cover rounded-md"
                onError={(e) => {
                  e.target.src = '/src/assets/default-cycle.webp';
                  e.target.onerror = null;
                }}
              />
              <div className="flex-1">
                <h4 className="font-medium">{order.brand}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 text-xs sm:text-sm text-gray-600">
                  <p>Frame: {order.specifications.frame}</p>
                  <p>Handlebar: {order.specifications.handlebar}</p>
                  <p>Seating: {order.specifications.seating}</p>
                  <p>Wheel: {order.specifications.wheel}</p>
                  <p>Brakes: {order.specifications.brakes}</p>
                  <p>Tyre: {order.specifications.tyre}</p>
                  <p>Chain Assembly: {order.specifications.chainAssembly}</p>
                </div>
              </div>
              <div className="text-right w-full sm:w-auto">
                <p className="font-medium">₹{order.unitPrice.toFixed(2)}</p>
                <p className="text-xs sm:text-sm text-gray-600">Qty: {order.quantity}</p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-600">Items Total:</span>
                <span>₹{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-600">GST (18%):</span>
                <span>₹{order.gstAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-600">Shipping:</span>
                <span>₹{order.shippingCost.toFixed(2)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-xs sm:text-sm text-green-600">
                  <span>Discount:</span>
                  <span>-₹{order.discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm sm:text-base font-bold pt-2 border-t">
                <span>Grand Total:</span>
                <span>₹{order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

OrderDetailsModal.propTypes = {
  order: PropTypes.shape({
    orderId: PropTypes.string.isRequired,
    orderDate: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    estimatedDeliveryDate: PropTypes.string.isRequired,
    brand: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    unitPrice: PropTypes.number.isRequired,
    subtotal: PropTypes.number.isRequired,
    gstAmount: PropTypes.number.isRequired,
    shippingCost: PropTypes.number.isRequired,
    discountAmount: PropTypes.number.isRequired,
    totalAmount: PropTypes.number.isRequired,
    specifications: PropTypes.shape({
      frame: PropTypes.string.isRequired,
      handlebar: PropTypes.string.isRequired,
      seating: PropTypes.string.isRequired,
      wheel: PropTypes.string.isRequired,
      brakes: PropTypes.string.isRequired,
      tyre: PropTypes.string.isRequired,
      chainAssembly: PropTypes.string.isRequired,
    }).isRequired,
    address: PropTypes.shape({
      fullName: PropTypes.string.isRequired,
      flatHouseNo: PropTypes.string.isRequired,
      apartment: PropTypes.string.isRequired,
      areaStreet: PropTypes.string.isRequired,
      landmark: PropTypes.string,
      city: PropTypes.string.isRequired,
      state: PropTypes.string.isRequired,
      pinCode: PropTypes.string.isRequired,
      mobileNumber: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default OrderDetailsModal; 