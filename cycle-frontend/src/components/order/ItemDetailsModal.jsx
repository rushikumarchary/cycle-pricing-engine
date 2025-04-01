import PropTypes from 'prop-types';
import { MdLocationOn } from 'react-icons/md';
import { IoClose } from "react-icons/io5";

const ItemDetailsModal = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-3 sm:p-4 flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-bold">Product Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-full">
            <IoClose className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
        
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Product Details */}
          <div className="flex flex-col sm:flex-row gap-4 pb-4 border-b">
            <img
              src={order.thumbnail}
              alt={order.brand}
              className="w-full sm:w-32 h-48 sm:h-32 object-cover rounded-md"
              onError={(e) => {
                e.target.src = '/src/assets/default-cycle.webp';
                e.target.onerror = null;
              }}
            />
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-medium mb-2">{order.brand}</h3>
              <div className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs sm:text-sm">
                  {Object.entries(order.specifications).map(([key, value]) => (
                    <p key={key} className="text-gray-600">
                      <span className="font-medium capitalize">{key}:</span> {value}
                    </p>
                  ))}
                </div>
                <div className="mt-4 text-xs sm:text-sm">
                  <p className="flex justify-between py-1">
                    <span className="text-gray-600">Unit Price:</span>
                    <span className="font-medium">₹{order.unitPrice.toFixed(2)}</span>
                  </p>
                  <p className="flex justify-between py-1">
                    <span className="text-gray-600">Quantity:</span>
                    <span className="font-medium">{order.quantity}</span>
                  </p>
                  <p className="flex justify-between py-1 text-sm sm:text-base font-medium">
                    <span>Total:</span>
                    <span>₹{(order.quantity * order.unitPrice).toFixed(2)}</span>
                  </p>
                </div>
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
            <div className="space-y-2">
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

ItemDetailsModal.propTypes = {
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
    specifications: PropTypes.object.isRequired,
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

export default ItemDetailsModal; 