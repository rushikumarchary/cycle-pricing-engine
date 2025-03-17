import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import PriceBreakdown from "../../component/price_breakdown/PriceBreakdown";

function CalculateForm() {
  const [brands, setBrands] = useState([]);
  const [components, setComponents] = useState({});
  const [selectedBrand, setSelectedBrand] = useState("");
  const [formData, setFormData] = useState({
    brand: "",
    frame: "",
    handlebar: "",
    seating: "",
    wheel: "",
    brakes: "",
    tyre: "",
    chainassembly: "",
    comments: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const breakdownRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isSubmitted && breakdownRef.current) {
      breakdownRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [isSubmitted]);

  // Fetch brands when component mounts
  useEffect(() => {
    fetchBrands();
  }, []);

  // Fetch components when brand is selected
  useEffect(() => {
    if (selectedBrand) {
      fetchComponents(selectedBrand);
    }
  }, [selectedBrand]);

  const fetchBrands = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8081/api/calculateprice/brands"
      );
      console.log("Fetched brands:", response.data);
      if (response.data) {
        setBrands(response.data);
      } else {
        throw new Error("Invalid data format received");
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
      setError("Failed to fetch brands");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch brands. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchComponents = async (brandId) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8081/api/calculateprice/byBrand/${brandId}`
      );
      console.log("Fetched components:", response.data);
      setComponents(response.data);
    } catch (error) {
      console.error("Error fetching components:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch components. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBrandChange = (e) => {
    const brandId = e.target.value;
    console.log("Selected brand ID:", brandId);
    const selectedBrandObj = brands.find(
      (brand) => brand.id.toString() === brandId
    );
    console.log("Selected brand object:", selectedBrandObj);
    setSelectedBrand(brandId);
    setFormData({
      ...formData,
      brand: selectedBrandObj?.brandName || "",
    });
    setIsSubmitted(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Updating ${name} to ${value}`);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(false);

    // Log the current form data for debugging
    console.log("Current form data:", formData);

    // Check for empty required fields (excluding "comments")
    const emptyFields = Object.entries(formData)
      .filter(([key, value]) => value === "" && key !== "comments")
      .map(([key]) => key);

    console.log("Empty fields:", emptyFields);

    if (emptyFields.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Please fill in these fields: ${emptyFields.join(", ")}`,
      });
      return;
    }

    // If all required fields are filled, ask for confirmation
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to calculate the price?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, calculate",
      cancelButtonText: "No, cancel",
    }).then((result) => {
      if (!result.isConfirmed) {
        return; // If the user cancels, stop execution
      }

      // If the user confirms, proceed with the calculation
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "success",
        title: "Your bike estimate calculation is on the way.",
      }).then(() => {
        setIsSubmitted(true);
      });
    });
  };

  const handleClear = () => {
    setFormData({
      brand: "",
      frame: "",
      handlebar: "",
      seating: "",
      wheel: "",
      brakes: "",
      tyre: "",
      chainassembly: "",
      comments: "",
    });
    setSelectedBrand("");
    setIsSubmitted(false);
  };

  // Add debug logging for components
  useEffect(() => {
    console.log("Components updated:", components);
  }, [components]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-700">Loading components...</span>
      </div>
    );
  }

  return (
    <div className="container py-6 mx-auto ">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-6xl mx-auto border border-gray-300">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5">
          <h2 className="text-2xl font-bold text-white text-center">
            Custom Cycle Configuration
          </h2>
          <p className="text-blue-100 text-center mt-1">
            Select components to build your dream bicycle
          </p>
        </div>

        <form id="cycleForm" onSubmit={handleSubmit} className="p-6">
          {/* Brand Selection with Icon */}
          <div className="mb-6">
            <label
              htmlFor="brand"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select Brand
            </label>
            <div className="relative">
              <select
                id="brand"
                name="brand"
                value={selectedBrand}
                onChange={handleBrandChange}
                required
                className="block w-full pl-3 pr-10 py-3 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm appearance-none transition duration-150 ease-in-out"
              >
                <option value="">Choose a brand</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.brandName}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Debug output (hidden) */}
          {selectedBrand && (
            <div style={{ display: "none" }}>
              Debug - Components available: {JSON.stringify(components)}
            </div>
          )}

          {/* Component Selection Cards */}
          {selectedBrand && (
            <div className="grid md:grid-cols-2 gap-5 mb-6">
              {/* Frame */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition duration-150 ease-in-out">
                <label
                  htmlFor="frame"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Frame
                </label>
                <select
                  id="frame"
                  name="frame"
                  value={formData.frame}
                  onChange={handleInputChange}
                  required
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm"
                >
                  <option value="">Select Frame</option>
                  {components.Frame?.map((item) => (
                    <option key={item.item_id} value={item.item_name}>
                      {item.item_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Handlebar */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition duration-150 ease-in-out">
                <label
                  htmlFor="handlebar"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Handlebar
                </label>
                <select
                  id="handlebar"
                  name="handlebar"
                  value={formData.handlebar}
                  onChange={handleInputChange}
                  required
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm"
                >
                  <option value="">Select Handlebar</option>
                  {components.Handlebar?.map((item) => (
                    <option key={item.item_id} value={item.item_name}>
                      {item.item_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Seating */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition duration-150 ease-in-out">
                <label
                  htmlFor="seating"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Seating
                </label>
                <select
                  id="seating"
                  name="seating"
                  value={formData.seating}
                  onChange={handleInputChange}
                  required
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm"
                >
                  <option value="">Select Seating</option>
                  {components.Seating?.map((item) => (
                    <option key={item.item_id} value={item.item_name}>
                      {item.item_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Wheel */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition duration-150 ease-in-out">
                <label
                  htmlFor="wheel"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Wheel
                </label>
                <select
                  id="wheel"
                  name="wheel"
                  value={formData.wheel}
                  onChange={handleInputChange}
                  required
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm"
                >
                  <option value="">Select Wheel</option>
                  {components.Wheel?.map((item) => (
                    <option key={item.item_id} value={item.item_name}>
                      {item.item_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Brakes */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition duration-150 ease-in-out">
                <label
                  htmlFor="brakes"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Brakes
                </label>
                <select
                  id="brakes"
                  name="brakes"
                  value={formData.brakes}
                  onChange={handleInputChange}
                  required
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm"
                >
                  <option value="">Select Brakes</option>
                  {components.Brakes?.map((item) => (
                    <option key={item.item_id} value={item.item_name}>
                      {item.item_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tyre */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition duration-150 ease-in-out">
                <label
                  htmlFor="tyre"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tyre
                </label>
                <select
                  id="tyre"
                  name="tyre"
                  value={formData.tyre}
                  onChange={handleInputChange}
                  required
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm"
                >
                  <option value="">Select Tyre</option>
                  {components.Tyre?.map((item) => (
                    <option key={item.item_id} value={item.item_name}>
                      {item.item_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Chain Assembly */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition duration-150 ease-in-out">
                <label
                  htmlFor="chainassembly"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Chain Assembly
                </label>
                <select
                  id="chainassembly"
                  name="chainassembly"
                  value={formData.chainassembly}
                  onChange={handleInputChange}
                  required
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm"
                >
                  <option value="">Select Chain Assembly</option>
                  {components["Chain Assembly"]?.map((item) => (
                    <option key={item.item_id} value={item.item_name}>
                      {item.item_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Comments Section */}
          {selectedBrand && (
            <div className="mb-6">
              <label
                htmlFor="comments"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Additional Comments
              </label>
              <textarea
                id="comments"
                name="comments"
                value={formData.comments}
                onChange={handleInputChange}
                placeholder="Any special requirements or notes for your bicycle..."
                rows="4"
                className="block w-full px-3 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm resize-y"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!selectedBrand}
            >
              <span className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                    clipRule="evenodd"
                  />
                </svg>
                Calculate Price
              </span>
            </button>
            <button
              type="button"
              className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-md shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
              onClick={handleClear}
            >
              <span className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Clear Form
              </span>
            </button>
          </div>
        </form>

        {/* Price Breakdown Section */}
        {isSubmitted && (
          <div
            ref={breakdownRef}
            className="mt-8 border-t border-gray-200 pt-6 pb-8 px-6 bg-gradient-to-b from-white to-blue-50"
          >
            <PriceBreakdown formData={formData} handleClear={handleClear} />
          </div>
        )}
      </div>
    </div>
  );
}

export default CalculateForm;
