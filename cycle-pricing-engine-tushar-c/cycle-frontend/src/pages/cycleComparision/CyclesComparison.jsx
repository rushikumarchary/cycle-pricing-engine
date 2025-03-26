import React, { useState, useEffect } from "react";
import { FaTimes, FaStar, FaPlus, FaDownload, FaEdit, FaShoppingCart, FaTrash } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { compareAPI } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Swal from "sweetalert2";

const CycleComparison = () => {
  const { userId } = useAuth();
  const [selectedCycles, setSelectedCycles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [comparisonData, setComparisonData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Function to fetch comparison data from API
  const fetchComparisonData = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const data = await compareAPI.getAllComparisons(userId);
      setComparisonData(data);
    } catch (error) {
      console.error("Error fetching comparison data:", error);
      setErrorMessage("Failed to load comparison data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComparisonData();
  }, []);

  // Helper function to map API data to comparison view
  const mapComparisonData = (data) => {
    return data.map((item) => {
      // Extract brand name, defaulting to 'Unknown' if not found
      const brand =
        item.cart && item.cart.brand
          ? `${
              item.cart.brand.charAt(0).toUpperCase() + item.cart.brand.slice(1)
            } Cycle`
          : "Unknown Cycle";
      
      return {
        id: item.id,
        brand: brand,
        price: item.priceBreakdown.finalPrice,
        variant: item.variant,
        specifications: {
          variant: item.variant || "N/A", // Add variant to specifications
          frame:
            item.itemDetails.find((detail) => detail.itemType === "Frame")
              ?.itemName || "N/A",
          handlebar:
            item.itemDetails.find((detail) => detail.itemType === "Handlebar")
              ?.itemName || "N/A",
          seating:
            item.itemDetails.find((detail) => detail.itemType === "Seating")
              ?.itemName || "N/A",
          wheel:
            item.itemDetails.find((detail) => detail.itemType === "Wheel")
              ?.itemName || "N/A",
          tyre:
            item.itemDetails.find((detail) => detail.itemType === "Tyre")
              ?.itemName || "N/A",
          brakes:
            item.itemDetails.find((detail) => detail.itemType === "Brakes")
              ?.itemName || "N/A",
          chainAssembly:
            item.itemDetails.find(
              (detail) => detail.itemType === "Chain Assembly"
            )?.itemName || "N/A",
        },
        rating: 4.0,
        reviewCount: 50,
        warranty: "1 Year",
        maxSpeed: "25 km/h",
        finance: `${Math.round(item.priceBreakdown.finalPrice / 36)}/month`,
        insurance: Math.round(item.priceBreakdown.finalPrice * 0.15),
        thumbnail: item.cart.thumbnail,
      };
    });
  };

  // Function to toggle cycle selection for comparison
  const toggleCycleSelection = (cycle) => {
    setSelectedCycles((prevSelected) => {
      // If cycle is already selected, remove it
      if (prevSelected.some((selectedCycle) => selectedCycle.id === cycle.id)) {
        return prevSelected.filter(
          (selectedCycle) => selectedCycle.id !== cycle.id
        );
      }

      // If less than 4 cycles are selected, add the cycle
      if (prevSelected.length < 4) {
        return [...prevSelected, cycle];
      }

      // If 4 cycles are already selected, replace the first one
      return [prevSelected[1], prevSelected[2], prevSelected[3], cycle];
    });
  };

  // Function to remove a cycle from comparison
  const removeCycleFromComparison = (cycleToRemove) => {
    setSelectedCycles((prevSelected) =>
      prevSelected.filter((cycle) => cycle.id !== cycleToRemove.id)
    );
  };

  // New method to clear all comparisons
  const clearComparisons = () => {
    setSelectedCycles([]);
  };

  // New method to navigate back to cart
  const navigateToCart = () => {
    navigate('/cart');
  };

  // Render comparison table when cycles are selected
  const renderComparisonTable = () => {
    if (selectedCycles.length === 0) return null;

    // Define the order of basic information rows
    const basicInfoOrder = [
      {
        key: "rating",
        label: "Rating",
        render: (cycle) => (
          <div className="flex items-center justify-center">
            <FaStar className="text-yellow-500 mr-1" />
            {cycle.rating} ({cycle.reviewCount} reviews)
          </div>
        ),
      },
      { key: "warranty", label: "Warranty", render: (cycle) => cycle.warranty },
      {
        key: "maxSpeed",
        label: "Max Speed",
        render: (cycle) => cycle.maxSpeed,
      },
      { key: "finance", label: "Finance", render: (cycle) => cycle.finance },
      {
        key: "insurance",
        label: "Insurance",
        render: (cycle) => `₹${cycle.insurance.toLocaleString()}`,
      },
    ];

    return (
      <div className="mt-8 bg-white overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Specification</th>
              {selectedCycles.map((cycle) => (
                <th key={cycle.id} className="border p-2 relative">
                  <img
                    src={cycle.thumbnail}
                    alt={cycle.brand}
                    className="w-20 h-20 object-cover mx-auto mb-2"
                  />
                  <span>{cycle.brand}</span>
                  <button
                    onClick={() => removeCycleFromComparison(cycle)}
                    className="absolute top-0 right-0 p-1 text-red-500 hover:bg-red-100"
                  >
                    <FaTimes />
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Price */}
            <tr>
              <td className="border p-2 font-semibold">Price</td>
              {selectedCycles.map((cycle) => (
                <td key={cycle.id} className="border p-2 text-center">
                  ₹{cycle.price.toLocaleString()}
                </td>
              ))}
            </tr>

            {/* Specifications */}
            {Object.keys(selectedCycles[0].specifications).map((specKey) => (
              <tr key={specKey}>
                <td className="border p-2 capitalize font-medium">
                  {specKey.replace(/([A-Z])/g, " $1").toLowerCase()}
                </td>
                {selectedCycles.map((cycle) => (
                  <td key={cycle.id} className="border p-2 text-center">
                    {cycle.specifications[specKey]}
                  </td>
                ))}
              </tr>
            ))}

            {/* Basic Information in Specific Order */}
            {basicInfoOrder.map(({ key, label, render }) => (
              <tr key={key}>
                <td className="border p-2 font-semibold">{label}</td>
                {selectedCycles.map((cycle) => (
                  <td key={cycle.id} className="border p-2 text-center">
                    {render(cycle)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Mapped cycles from API data
  const mappedCycles = mapComparisonData(comparisonData);

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading cycles...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="container mx-auto p-4">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{errorMessage}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 py-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cycle Comparisons</h1>
        <div className="flex space-x-4">
          {/* Clear Comparison Button */}
          {selectedCycles.length > 0 && (
            <button 
              onClick={clearComparisons}
              className="flex items-center bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              <FaTrash className="mr-2" /> Clear Comparisons
            </button>
          )}
          
          {/* Back to Cart Button */}
          <button 
            onClick={navigateToCart}
            className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
          >
            <FaShoppingCart className="mr-2" /> Back to Cart
          </button>
        </div>
      </div>

      {/* Comparison Status */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-gray-600">
          Selected Cycles: {selectedCycles.length}/4
        </p>
      </div>

      {/* Cycle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {mappedCycles.map((cycle) => (
          <div
            key={cycle.id}
            className={`border rounded p-4 relative cursor-pointer transition-all duration-300 
              ${
                selectedCycles.some(
                  (selectedCycle) => selectedCycle.id === cycle.id
                )
                  ? "border-blue-500 bg-blue-50"
                  : "hover:border-blue-300"
              }`}
            onClick={() => toggleCycleSelection(cycle)}
          >
            <img
              src={cycle.thumbnail}
              alt={cycle.brand}
              className="w-full h-48 object-cover mb-4"
            />
            <h3 className="text-lg font-semibold">{cycle.brand}</h3>
            <p className="text-gray-600">₹{cycle.price.toLocaleString()}</p>
            <div className="flex items-center mt-2">
              <FaStar className="text-yellow-500 mr-1" />
              <span>
                {cycle.rating} ({cycle.reviewCount} reviews)
              </span>
            </div>
            {selectedCycles.some(
              (selectedCycle) => selectedCycle.id === cycle.id
            ) && (
              <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                {selectedCycles.findIndex(
                  (selectedCycle) => selectedCycle.id === cycle.id
                ) + 1}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      {selectedCycles.length > 0 && renderComparisonTable()}
    </div>
  );
};

export default CycleComparison;