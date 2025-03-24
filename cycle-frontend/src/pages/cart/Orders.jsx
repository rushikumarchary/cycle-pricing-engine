
import { useOrders } from '../../context/OrderContext';
import { format } from 'date-fns';

const Orders = () => {
  const { orders } = useOrders();

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

  return (
    <div className="w-full md:w-[90%] mx-auto mt-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Order History</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No orders found</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-6 rounded-lg shadow-md">
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 pb-4 border-b">
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Order ID: <span className="font-medium">{order.id}</span></p>
                  <p className="text-sm text-gray-600">
                    Placed on: <span className="font-medium">
                      {format(new Date(order.date), 'MMM dd, yyyy, hh:mm a')}
                    </span>
                  </p>
                </div>
                <div className="mt-2 sm:mt-0 flex flex-col sm:items-end">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <p className="font-bold text-lg mt-2">₹{order.totalAmount.toFixed(2)}</p>
                </div>
              </div>
              
              {/* Order Items */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800">Items</h3>
                <div className="divide-y">
                  {order.items.map((item) => (
                    <div key={item.id} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex items-start gap-4">
                        <img 
                          src={item.thumbnail} 
                          alt={item.title} 
                          className="w-20 h-20 object-cover rounded-lg shadow-sm"
                        />
                        <div className="flex-grow">
                          <h4 className="font-medium text-gray-900">{item.title}</h4>
                          <div className="mt-1 text-sm text-gray-600">
                            <p>Quantity: {item.quantity} × ₹{item.price.toFixed(2)}</p>
                            <p className="mt-1 font-medium">
                              Total: ₹{(item.quantity * item.price).toFixed(2)}
                            </p>
                          </div>
                          {/* Parts Details Accordion */}
                          <details className="mt-2">
                            <summary className="text-sm text-indigo-600 cursor-pointer hover:text-indigo-700">
                              View Parts Details
                            </summary>
                            <div className="mt-2 pl-2 text-sm text-gray-600 space-y-1">
                              {Object.entries(item.parts).map(([key, part]) => (
                                <p key={key}>
                                  <span className="font-medium">{key}:</span> {part.itemName}
                                </p>
                              ))}
                            </div>
                          </details>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Details */}
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-800">Shipping Status</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {order.shippingDetails.status} • Estimated Delivery by{' '}
                      {format(new Date(order.shippingDetails.estimatedDelivery), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.shippingDetails.status)}`}>
                    {order.shippingDetails.status}
                  </span>
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