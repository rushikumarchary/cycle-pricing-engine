import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { addressAPI } from "../../utils/api";
import PropTypes from 'prop-types';

// Modified to be a reusable component
const Address = ({ isOpen, onClose, onSelectAddress, selectedAddressId }) => {
  const { userId } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    mobileNumber: "",
    pinCode: "",
    flatHouseNo: "",
    apartment: "",
    areaStreet: "",
    landmark: "",
    city: "",
    state: "",
    addressType: "HOUSE",
    deliveryInstructions: ""
  });

  // Fetch addresses on component mount
  useEffect(() => {
    if (userId) {
      fetchAddresses();
    }
  }, [userId]);

  const fetchAddresses = async () => {
    try {
      const data = await addressAPI.getUserAddresses(userId);
      setAddresses(data);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast.error(error.response?.data?.message || "Failed to fetch addresses");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const addressData = {
        user: { id: userId },
        ...newAddress
      };

      await addressAPI.saveAddress(addressData);
      toast.success("Address saved successfully");
      setShowAddForm(false);
      setNewAddress({
        fullName: "",
        mobileNumber: "",
        pinCode: "",
        flatHouseNo: "",
        apartment: "",
        areaStreet: "",
        landmark: "",
        city: "",
        state: "",
        addressType: "HOUSE",
        deliveryInstructions: ""
      });
      fetchAddresses();
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error(error.response?.data?.message || "Failed to save address");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Select Delivery Address</h1>
          <button
            onClick={onClose}
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

        {/* Address List */}
        <div className="grid gap-4 mb-6">
          {addresses.map((address) => (
            <div
              key={address.addressId}
              className={`bg-white p-4 rounded-lg shadow-md border ${
                selectedAddressId === address.addressId
                  ? "border-indigo-500 ring-2 ring-indigo-500"
                  : "border-gray-200"
              } cursor-pointer hover:border-indigo-500 transition-colors`}
              onClick={() => onSelectAddress(address)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{address.fullName}</h3>
                <span className="bg-gray-100 px-2 py-1 rounded text-sm">
                  {address.addressType}
                </span>
              </div>
              <p className="text-gray-600">
                {address.flatHouseNo}, {address.apartment}
                <br />
                {address.areaStreet}
                {address.landmark && <span>, Near {address.landmark}</span>}
                <br />
                {address.city}, {address.state} - {address.pinCode}
              </p>
              <p className="text-gray-500 mt-2">
                Mobile: {address.mobileNumber}
              </p>
              {address.deliveryInstructions && (
                <p className="text-gray-500 mt-2">
                  Note: {address.deliveryInstructions}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Add New Address Button */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
          >
            Add New Address
          </button>
          {addresses.length > 0 && (
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Add Address Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Add New Address</h2>
                <button
                  onClick={() => setShowAddForm(false)}
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

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={newAddress.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={newAddress.mobileNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Flat/House No.
                  </label>
                  <input
                    type="text"
                    name="flatHouseNo"
                    value={newAddress.flatHouseNo}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apartment/Building Name
                  </label>
                  <input
                    type="text"
                    name="apartment"
                    value={newAddress.apartment}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Area/Street
                  </label>
                  <input
                    type="text"
                    name="areaStreet"
                    value={newAddress.areaStreet}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={newAddress.landmark}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pin Code
                  </label>
                  <input
                    type="text"
                    name="pinCode"
                    value={newAddress.pinCode}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={newAddress.city}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={newAddress.state}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Type
                  </label>
                  <select
                    name="addressType"
                    value={newAddress.addressType}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="HOUSE">House</option>
                    <option value="APARTMENT">Apartment</option>
                    <option value="BUSINESS">Business</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Instructions (Optional)
                  </label>
                  <textarea
                    name="deliveryInstructions"
                    value={newAddress.deliveryInstructions}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  ></textarea>
                </div>

                <div className="md:col-span-2 flex justify-end gap-4 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

Address.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelectAddress: PropTypes.func.isRequired,
  selectedAddressId: PropTypes.number
};

export default Address;
