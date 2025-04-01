import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaStar,
  FaPlus,
  FaDownload,
  FaEdit,
  FaShoppingCart,
  FaTrash,
} from "react-icons/fa";
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
      const data = await compareAPI.getAllComparisons();
      console.log("API Response:", data);
      const mappedCycles = mapComparisonData(data);
      setComparisonData(mappedCycles);

      // Automatically select first two cycles if available
      if (mappedCycles.length >= 2) {
        setSelectedCycles(mappedCycles.slice(0, 2));
      }
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

  // Function to remove a cycle from comparison
  const removeCycleFromComparison = async (cycleToRemove) => {
    try {
      // Call the delete comparison API
      await compareAPI.deleteComparison(cycleToRemove.id);

      // Update local state to remove the cycle
      setSelectedCycles((prevSelected) =>
        prevSelected.filter((cycle) => cycle.id !== cycleToRemove.id)
      );

      // Update comparisonData to remove the cycle
      setComparisonData((prevData) =>
        prevData.filter((cycle) => cycle.id !== cycleToRemove.id)
      );

      // Optional: Show a success toast
      Swal.fire({
        icon: "success",
        title: "Cycle Removed",
        text: `${cycleToRemove.brand} has been removed from comparisons.`,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
    } catch (error) {
      // Handle error
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to remove cycle from comparisons. Please try again.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
      console.error("Error removing comparison:", error);
    }
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

  // Navigate to Add to Cart
  const navigateToAddToCart = () => {
    navigate("/cart");
  };

  // Render available cycles for selection
  const renderAvailableCycles = () => {
    const availableCycles = comparisonData.filter(
      (cycle) => !selectedCycles.some((selected) => selected.id === cycle.id)
    );

    return (
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {availableCycles.map((cycle) => (
            <div
              key={cycle.id}
              className="border rounded p-4 relative cursor-pointer hover:border-green-500"
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
            </div>
          ))}
        </div>
      </div>
    );
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
              {selectedCycles.length < 4 && (
                <th className="border p-2">
                  <div
                    onClick={navigateToAddToCart}
                    className="flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 p-4"
                  >
                    <FaPlus className="text-2xl text-green-500 mb-2" />
                    <span className="text-green-500">Add Cycle</span>
                  </div>
                </th>
              )}
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
              {selectedCycles.length < 4 && <td className="border"></td>}
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
                {selectedCycles.length < 4 && <td className="border"></td>}
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
                {selectedCycles.length < 4 && <td className="border"></td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center bg-white min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading cycles...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="container mx-auto p-4 bg-white min-h-screen">
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
    <div className="container mx-auto p-4 py-12 bg-white min-h-screen">
      <div className="flex justify-center items-center mb-6">
        <h1 className="text-2xl font-bold text-center">Cycle Comparisons</h1>
      </div>

      {/* Browse More Cycles Section */}
      {renderAvailableCycles()}

      {/* Comparison Table */}
      {renderComparisonTable()}
    </div>
  );
};

export default CycleComparison;
