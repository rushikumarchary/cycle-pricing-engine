import { useState, useEffect } from "react";
import {
  FaTimes,
  FaStar,
  FaPlus
} from "react-icons/fa";
import { compareAPI } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const CycleComparison = () => {
  const [selectedCycles, setSelectedCycles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [comparisonData, setComparisonData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

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

      // Set all cycles as selected by default
      setSelectedCycles(mappedCycles);
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

      // Create specifications with prices
      const specifications = {};
      item.itemDetails.forEach(detail => {
        specifications[detail.itemType.toLowerCase()] = {
          name: detail.itemName,
          price: detail.price
        };
      });

      return {
        id: item.id,
        brand: brand,
        price: item.priceBreakdown.finalPrice,
        variant: item.variant,
        specifications,
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

      // If 4 cycles are already selected, show error toast
      if (prevSelected.length >= 4) {
        Swal.fire({
          icon: "warning",
          title: "Maximum Cycles Reached",
          text: "Please remove one cycle before adding a new one to compare.",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
        });
        return prevSelected;
      }

      // Add the new cycle
      return [...prevSelected, cycle];
    });
  };

  // Navigate to Add to Cart
  const navigateToAddToCart = () => {
    if (selectedCycles.length >= 4) {
      Swal.fire({
        icon: "warning",
        title: "Maximum Cycles Reached",
        text: "Please remove one cycle from comparison before adding more.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }
    navigate("/cart");
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
          <div className="flex items-center justify-center gap-1">
            <FaStar className="text-yellow-500" />
            <span>{cycle.rating}</span>
            <span className="text-gray-500 text-sm">({cycle.reviewCount} reviews)</span>
          </div>
        ),
      },
      { key: "warranty", label: "Warranty", render: (cycle) => cycle.warranty },
      { key: "maxSpeed", label: "Max Speed", render: (cycle) => cycle.maxSpeed },
      { key: "finance", label: "Finance", render: (cycle) => cycle.finance },
      {
        key: "insurance",
        label: "Insurance",
        render: (cycle) => `₹${cycle.insurance.toLocaleString()}`,
      },
    ];

    return (
      <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border p-4 text-left w-48">Specification</th>
                {selectedCycles.map((cycle) => (
                  <th key={cycle.id} className="border p-4 relative min-w-[200px]">
                    <div className="flex flex-col items-center">
                      <div className="relative w-24 h-24 mb-3">
                        <img
                          src={cycle.thumbnail}
                          alt={cycle.brand}
                          className="w-full h-full object-cover rounded-lg shadow-md"
                        />
                        <button
                          onClick={() => removeCycleFromComparison(cycle)}
                          className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md hover:bg-red-50 transition-colors"
                        >
                          <FaTimes className="text-red-500" />
                        </button>
                      </div>
                      <div className="text-center">
                        <h3 className="font-semibold text-lg">{cycle.brand}</h3>
                        <p className="text-gray-600">₹{cycle.price.toLocaleString()}</p>
                      </div>
                    </div>
                  </th>
                ))}
                {selectedCycles.length < 4 && (
                  <th className="border p-4">
                    <div
                      onClick={navigateToAddToCart}
                      className="flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 p-6 rounded-lg transition-colors"
                    >
                      <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-3">
                        <FaPlus className="text-3xl text-gray-400" />
                      </div>
                      <span className="text-green-500 font-medium">Add Cycle</span>
                    </div>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {/* Price Row */}
              <tr className="bg-gray-50">
                <td className="border p-4 font-semibold">Price</td>
                {selectedCycles.map((cycle) => (
                  <td key={cycle.id} className="border p-4 text-center">
                    <span className="text-lg font-semibold text-green-600">
                      ₹{cycle.price.toLocaleString()}
                    </span>
                  </td>
                ))}
                {selectedCycles.length < 4 && <td className="border"></td>}
              </tr>

              {/* Variant Row */}
              <tr>
                <td className="border p-4 font-semibold">Variant</td>
                {selectedCycles.map((cycle) => (
                  <td key={cycle.id} className="border p-4 text-center">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {cycle.variant}
                    </span>
                  </td>
                ))}
                {selectedCycles.length < 4 && <td className="border"></td>}
              </tr>

              {/* Specifications */}
              {Object.keys(selectedCycles[0].specifications)
                .filter(key => key !== 'variant')
                .map((specKey) => (
                  <tr key={specKey} className="hover:bg-gray-50">
                    <td className="border p-4 capitalize font-medium">
                      {specKey.replace(/([A-Z])/g, " $1").toLowerCase()}
                    </td>
                    {selectedCycles.map((cycle) => (
                      <td key={cycle.id} className="border p-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span>{cycle.specifications[specKey]?.name || 'N/A'}  ₹{cycle.specifications[specKey]?.price || '0'}</span>
                          
                        </div>
                      </td>
                    ))}
                    {selectedCycles.length < 4 && <td className="border"></td>}
                  </tr>
                ))}

              {/* Basic Information */}
              {basicInfoOrder.map(({ key, label, render }) => (
                <tr key={key} className="hover:bg-gray-50">
                  <td className="border p-4 font-semibold">{label}</td>
                  {selectedCycles.map((cycle) => (
                    <td key={cycle.id} className="border p-4 text-center">
                      {render(cycle)}
                    </td>
                  ))}
                  {selectedCycles.length < 4 && <td className="border"></td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Render available cycles for selection
  const renderAvailableCycles = () => {
    // Only show available cycles if there are less than 4 cycles in comparison
    if (selectedCycles.length >= 4) return null;

    const availableCycles = comparisonData.filter(
      (cycle) => !selectedCycles.some((selected) => selected.id === cycle.id)
    );

    if (availableCycles.length === 0) return null;

    return (
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Available Cycles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {availableCycles.map((cycle) => (
            <div
              key={cycle.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => toggleCycleSelection(cycle)}
            >
              <div className="relative h-48">
                <img
                  src={cycle.thumbnail}
                  alt={cycle.brand}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md">
                  <FaPlus className="text-green-500" />
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{cycle.brand}</h3>
                <p className="text-gray-600 mb-2">₹{cycle.price.toLocaleString()}</p>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <FaStar className="text-yellow-500" />
                  <span>{cycle.rating}</span>
                  <span>({cycle.reviewCount} reviews)</span>
                </div>
              </div>
            </div>
          ))}
        </div>
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
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Cycle Comparisons</h1>
          <button
            onClick={navigateToAddToCart}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
          >
            <FaPlus />
            Add More Cycles
          </button>
        </div>

        {/* Comparison Table */}
        {renderComparisonTable()}

        {/* Available Cycles Section */}
        {renderAvailableCycles()}
      </div>
    </div>
  );
};

export default CycleComparison;
