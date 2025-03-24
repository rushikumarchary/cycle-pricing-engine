import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import cycle1 from "../../assets/cycle1.webp";
import cycle2 from "../../assets/cycle2.webp";
import cycle3 from "../../assets/cycle3.webp";
import cycle4 from "../../assets/cycle4.webp";
import { cartAPI } from "../../utils/api";

function PriceBreakdown({ priceData, handleClear }) {
  const navigate = useNavigate();

  // Brand to image mapping
  const brandImageMap = {
    'Honda': cycle1,
    'Tata': cycle2,
    'Atlas': cycle3,
    'Hero': cycle4
  };

  const handleAddToCart = async () => {
    // Create toast mixin
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timerProgressBar: true,
    });

    // Show loading toast
    Toast.fire({
      title: 'Adding to cart...',
      didOpen: () => {
        Swal.showLoading();
      },
      allowOutsideClick: false
    });

    try {
      // Extract itemIds from parts
      const itemIds = Object.values(priceData.parts).map(part => part.itemId);

      // Get the correct image based on brand
      const thumbnailImage = brandImageMap[priceData.brand] || cycle1; // Default to cycle1 if brand not found

      // Prepare API request body
      const apiRequestBody = {
        brand: priceData.brand,
        itemIds: itemIds,
        thumbnail: thumbnailImage,
        quantity: 1
      };

      // Make API call using cartAPI
      await cartAPI.addToCart(apiRequestBody);
      
      // Update toast to success
      Toast.fire({
        icon: "success",
        title: "Added to cart successfully!",
        timer: 1500,
        timerProgressBar: false,
      });

      handleClear();
      // Navigate to cart after success
      setTimeout(() => {
        navigate('/cart');
      }, 1500);
      
    } catch (error) {
      console.error("Error adding to cart:", error);
      Toast.fire({
        icon: "error",
        title: "Failed to add item to cart",
        timer: 1500
      });
    }
  };

  // Define the parts mapping for the table
  const partsMapping = [
    { label: "Frame Material", key: "Frame" },
    { label: "Handlebar Type", key: "Handlebar" },
    { label: "Seating Type", key: "Seating" },
    { label: "Wheel Type", key: "Wheel" },
    { label: "Brakes Type", key: "Brakes" },
    { label: "Tyre Type", key: "Tyre" },
    { label: "Chain Assembly", key: "Chain Assembly" }
  ];

  return (
    <>
      <div className="container">
        <h3 className="text-center font-bold pb-2 md:text-4xl text-2xl md:mb-4 text-[#213832]">
          <span className="text-blue-700">{priceData.brand}</span> Cycle Price
        </h3>
        <div className="price-table-container">
          <table className="price-table">
            <thead>
              <tr>
                <th>Component Type</th>
                <th>Selected Item</th>
                <th>Price (₹)</th>
              </tr>
            </thead>
            <tbody>
              {partsMapping.map(({ label, key }) => {
                const part = priceData.parts[key];
                return (
                  <tr key={key}>
                    <td>{label}</td>
                    <td>{part?.itemName || "N/A"}</td>
                    <td>{part?.price?.toFixed(2) || "0.00"}</td>
                  </tr>
                );
              })}
              <tr className="total-row">
                <td colSpan="2">Total Parts Price</td>
                <td>{priceData.totalPartsPrice.toFixed(2)}</td>
              </tr>
              <tr className="total-row">
                <td colSpan="3" style={{ textAlign: "center" }} className="space-x-4">
                  <button
                    onClick={handleAddToCart}
                    className="bg-green-500 text-white font-bold p-2 rounded-md hover:bg-green-600 transition-colors ml-4"
                  >
                    Add to Cart
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default PriceBreakdown;
