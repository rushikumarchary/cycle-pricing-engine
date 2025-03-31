import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { addressAPI } from "../../utils/api";
import PropTypes from "prop-types";
import axios from "axios";

// Modified to be a reusable component
const Address = ({ isOpen, onClose, onSelectAddress, selectedAddressId }) => {
  const { userId } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [citySuggestions, setCitySuggestions] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [stateSuggestions, setStateSuggestions] = useState([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [showStateSuggestions, setShowStateSuggestions] = useState(false);
  const [isLoadingCity, setIsLoadingCity] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [isLoadingState, setIsLoadingState] = useState(false);
  
  // Add form validation state
  const [formErrors, setFormErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);

  // Refs for handling click outside
  const pincodeRef = useRef(null);
  const cityRef = useRef(null);
  const stateRef = useRef(null);

  // First, let's modify the state tracking to be more flexible
  const [selectedFromSuggestions, setSelectedFromSuggestions] = useState({
    pinCode: false,
    cityVillage: false,
    state: false
  });

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pincodeRef.current && !pincodeRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (cityRef.current && !cityRef.current.contains(event.target)) {
        setShowCitySuggestions(false);
      }
      if (stateRef.current && !stateRef.current.contains(event.target)) {
        setShowStateSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle focus
  const handleFocus = (field) => {
    // Close other suggestion boxes when focusing on a field
    if (field !== "pinCode") setShowSuggestions(false);
    if (field !== "city") setShowCitySuggestions(false);
    if (field !== "state") setShowStateSuggestions(false);
  };

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
    deliveryInstructions: "",
    postalDetails: null
  });

  // Function to fetch locations by pincode
  const fetchLocationsByPincode = async (pincode) => {
    try {
      setIsLoadingLocation(true);
      const response = await axios.get(
        `https://api.postalpincode.in/pincode/${pincode}`
      );

      if (response.data[0].Status === "Success") {
        const locations = response.data[0].PostOffice;
        setSuggestions(locations);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        // Instead of toast error, set message to search by city/village
        setNewAddress(prev => ({
          ...prev,
          city: "",
          state: ""
        }));
        setSelectedFromSuggestions({
          pinCode: false,
          cityVillage: false,
          state: false
        });
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
      setSuggestions([]);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // Function to fetch locations by city/village
  const fetchLocationsByCity = async (city) => {
    try {
      setIsLoadingCity(true);
      const response = await axios.get(
        `https://api.postalpincode.in/postoffice/${city}`
      );

      if (response.data[0].Status === "Success") {
        const locations = response.data[0].PostOffice;
        // Simplify the suggestions format to match PIN code style
        const simplifiedLocations = locations.map(loc => ({
          name: loc.Name,
          district: loc.District,
          state: loc.State,
          pincode: loc.Pincode
        }));
        setCitySuggestions(simplifiedLocations);
        setShowCitySuggestions(true);
      } else {
        setCitySuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
      setCitySuggestions([]);
    } finally {
      setIsLoadingCity(false);
    }
  };

  

  // Update handleCitySelect to allow changing from city selection
  const handleCitySelect = (location) => {
    setNewAddress(prev => ({
      ...prev,
      city: location.name,
      state: location.state,
      pinCode: location.pincode,
      postalDetails: {
        branchType: location.BranchType || 'N/A',
        deliveryStatus: location.DeliveryStatus || 'N/A',
        circle: location.Circle || location.state,
        district: location.district,
        division: location.Division || 'N/A',
        region: location.Region || 'N/A',
        country: 'India'
      }
    }));
    setSelectedFromSuggestions({
      pinCode: true,
      cityVillage: true,
      state: true
    });
    setShowCitySuggestions(false);
  };

  // Update handleLocationSelect for PIN code selection
  const handleLocationSelect = (location) => {
    setNewAddress(prev => ({
      ...prev,
      city: location.Name,
      state: location.State,
      pinCode: location.Pincode,
      postalDetails: {
        branchType: location.BranchType,
        deliveryStatus: location.DeliveryStatus,
        circle: location.Circle,
        district: location.District,
        division: location.Division,
        region: location.Region,
        country: location.Country
      }
    }));
    setSelectedFromSuggestions({
      pinCode: true,
      cityVillage: true,
      state: true
    });
    setShowSuggestions(false);
  };

  // Function to handle state selection
  const handleStateSelect = (state) => {
    setNewAddress((prev) => ({
      ...prev,
      state: state,
    }));
    setShowStateSuggestions(false);
  };

  // Modify the input fields to remove readOnly and update the handling
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Update the form value
    setNewAddress((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for the current field if it has a value
    if (value.trim()) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // If user starts typing in either field, reset the selection state
    if (name === "pinCode" || name === "city") {
      setSelectedFromSuggestions(prev => ({
        ...prev,
        pinCode: false,
        cityVillage: false,
        state: false
      }));
    }

    // Set new timeout for search based on field
    const newTimeout = setTimeout(() => {
      if (name === "pinCode" && value.length >= 3) {
        fetchLocationsByPincode(value);
      } else if (name === "city" && value.length >= 3) {
        fetchLocationsByCity(value);
      }
    }, 500);
    setSearchTimeout(newTimeout);
  };

  // Fetch addresses on component mount
  useEffect(() => {
    if (userId) {
      fetchAddresses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchAddresses = async () => {
    try {
      const data = await addressAPI.getUserAddresses(userId);
      setAddresses(data);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error(error.response?.data?.message || "Failed to fetch addresses");
    }
  };

  // Modified handleSubmit to include validation
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    const errors = {};
    if (!newAddress.fullName.trim()) errors.fullName = "Full Name is required";
    if (!newAddress.mobileNumber.trim()) errors.mobileNumber = "Mobile Number is required";
    if (!newAddress.flatHouseNo.trim()) errors.flatHouseNo = "Flat/House No. is required";
    if (!newAddress.apartment.trim()) errors.apartment = "Apartment/Building Name is required";
    if (!newAddress.areaStreet.trim()) errors.areaStreet = "Area/Street is required";
    if (!newAddress.pinCode.trim()) errors.pinCode = "PIN Code is required";
    if (!newAddress.city.trim()) errors.city = "City/Village is required";
    if (!newAddress.state.trim()) errors.state = "State is required";

    // Validate that values were selected from suggestions
    if (!selectedFromSuggestions.pinCode || !selectedFromSuggestions.cityVillage || !selectedFromSuggestions.state) {
      if (!selectedFromSuggestions.pinCode) errors.pinCode = "Please select a valid PIN code from suggestions";
      if (!selectedFromSuggestions.cityVillage) errors.city = "Please select a valid City/Village from suggestions";
      if (!selectedFromSuggestions.state) errors.state = "Please select a valid State from suggestions";
    }

    setFormErrors(errors);
    setShowErrors(true);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      const addressData = {
        user: { id: userId },
        ...newAddress,
        postalMetadata: newAddress.postalDetails || {
          branchType: 'N/A',
          deliveryStatus: 'N/A',
          circle: newAddress.state,
          district: 'N/A',
          division: 'N/A',
          region: 'N/A',
          country: 'India'
        }
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
        deliveryInstructions: "",
        postalDetails: null
      });
      setSelectedFromSuggestions({
        pinCode: false,
        cityVillage: false,
        state: false
      });
      setShowErrors(false);
      setFormErrors({});
      fetchAddresses();
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error(error.response?.data?.message || "Failed to save address");
    }
  };

  // Add this function to handle cancel
  const handleCancel = () => {
    // Clear all input fields
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
      deliveryInstructions: "",
      postalDetails: null
    });
    
    // Reset all suggestion states
    setSelectedFromSuggestions({
      pinCode: false,
      cityVillage: false,
      state: false
    });
    setSuggestions([]);
    setCitySuggestions([]);
    setShowSuggestions(false);
    setShowCitySuggestions(false);
    
    // Close the form
    setShowAddForm(false);
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
            onClick={() => {
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
                deliveryInstructions: "",
                postalDetails: null
              });
              setSelectedFromSuggestions({
                pinCode: false,
                cityVillage: false,
                state: false
              });
              setSuggestions([]);
              setCitySuggestions([]);
              setShowSuggestions(false);
              setShowCitySuggestions(false);
              setShowAddForm(true);
            }}
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

              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={newAddress.fullName}
                    onChange={handleInputChange}
                    
                    className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                      showErrors && formErrors.fullName ? 'border-red-500' : ''
                    }`}
                  />
                  {showErrors && formErrors.fullName && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={newAddress.mobileNumber}
                    onChange={handleInputChange}
                    
                    className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                      showErrors && formErrors.mobileNumber ? 'border-red-500' : ''
                    }`}
                  />
                  {showErrors && formErrors.mobileNumber && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.mobileNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Flat/House No. <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="flatHouseNo"
                    value={newAddress.flatHouseNo}
                    onChange={handleInputChange}
                
                    className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                      showErrors && formErrors.flatHouseNo ? 'border-red-500' : ''
                    }`}
                  />
                  {showErrors && formErrors.flatHouseNo && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.flatHouseNo}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apartment/Building Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="apartment"
                    value={newAddress.apartment}
                    onChange={handleInputChange}
                    
                    className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                      showErrors && formErrors.apartment ? 'border-red-500' : ''
                    }`}
                  />
                  {showErrors && formErrors.apartment && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.apartment}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Area/Street <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="areaStreet"
                    value={newAddress.areaStreet}
                    onChange={handleInputChange}
                    
                    className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                      showErrors && formErrors.areaStreet ? 'border-red-500' : ''
                    }`}
                  />
                  {showErrors && formErrors.areaStreet && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.areaStreet}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Landmark <span className="text-gray-400">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={newAddress.landmark}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="relative" ref={pincodeRef}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    PIN Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="pinCode"
                    
                    value={newAddress.pinCode}
                    onChange={handleInputChange}
                    onFocus={() => handleFocus("pinCode")}
                    className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                      showErrors && formErrors.pinCode ? 'border-red-500' : ''
                    }`}
                    placeholder="Enter PIN code to search"
                    maxLength={6}
                    
                  />
                  {showErrors && formErrors.pinCode && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.pinCode}</p>
                  )}
                  {!selectedFromSuggestions.pinCode && newAddress.pinCode && !isLoadingLocation && !suggestions.length && (
                    <p className="text-sm text-gray-500 mt-1">
                      PIN code not found. Try searching by City/Village name instead.
                    </p>
                  )}
                  {isLoadingLocation && (
                    <div className="absolute right-2 top-9">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-500"></div>
                    </div>
                  )}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {suggestions.map((location, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleLocationSelect(location)}
                        >
                          <div className="font-medium">{location.Name}</div>
                          <div className="text-sm text-gray-600">
                            {location.District}, {location.State} - {" "}
                            {location.Pincode}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative" ref={cityRef}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City/Village <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={newAddress.city}
                    onChange={handleInputChange}
                    onFocus={() => handleFocus("city")}
                    className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                      showErrors && formErrors.city ? 'border-red-500' : ''
                    }`}
                    placeholder="Type to search City/Village"
                    
                  />
                  {showErrors && formErrors.city && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>
                  )}
                  {!selectedFromSuggestions.cityVillage && (
                    <p className="text-sm text-gray-500 mt-1">
                      Please select from suggestions
                    </p>
                  )}
                  {isLoadingCity && (
                    <div className="absolute right-2 top-9">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-500"></div>
                    </div>
                  )}
                  {showCitySuggestions && citySuggestions.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {citySuggestions.map((location, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleCitySelect(location)}
                        >
                          <div className="font-medium">{location.name}</div>
                          <div className="text-sm text-gray-600">
                            {location.district}, {location.state} - {location.pincode}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative" ref={stateRef}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={newAddress.state}
                    onChange={handleInputChange}
                    onFocus={() => handleFocus("state")}
                    className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                      showErrors && formErrors.state ? 'border-red-500' : ''
                    }`}
                    placeholder="State will be auto-filled"
                    readOnly
                    
                  />
                  {showErrors && formErrors.state && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.state}</p>
                  )}
                  {isLoadingState && (
                    <div className="absolute right-2 top-9">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-500"></div>
                    </div>
                  )}
                  {showStateSuggestions && stateSuggestions.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {stateSuggestions.map((state, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleStateSelect(state)}
                        >
                          <div className="font-medium">{state}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="addressType"
                    value={newAddress.addressType}
                    onChange={handleInputChange}
                    
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
                    Delivery Instructions <span className="text-gray-400">(Optional)</span>
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
                    onClick={handleCancel}
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
  selectedAddressId: PropTypes.number,
};

export default Address;
