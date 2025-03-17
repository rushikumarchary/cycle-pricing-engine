import PropTypes from "prop-types";
import { useEstimate } from "../../hooks/useEstimate";
import Swal from "sweetalert2";
import axios from "axios";
import { useState, useEffect } from "react";

function PriceBreakdown({ formData, handleClear }) {
  const [calculatedPrice, setCalculatedPrice] = useState(null);
  const { addEstimate } = useEstimate();

  useEffect(() => {
    calculatePrice();
  }, [formData]);

  const calculatePrice = async () => {
    try {
      // Format the data according to your backend expectations
      const cycleConfig = {
        components: {
          brand: formData.brand,
          frame: formData.frame,
          handlebar: formData.handlebar,
          seating: formData.seating,
          wheel: formData.wheel,
          breaks: formData.breaks,
          tyre: formData.tyre,
          chainAssembly: formData.chainAssembly
        }
      };

      const response = await axios.post(
        'http://localhost:8081/api/calculateprice',
        cycleConfig
      );

      setCalculatedPrice(response.data);
    } catch (error) {
      console.error('Error calculating price:', error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to calculate price. Please try again.",
      });
    }
  };

  // Function to save estimate and navigate to Estimates page
  const handleSaveEstimate = () => {
    if (!calculatedPrice) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please wait for price calculation to complete.",
      });
      return;
    }

    const newEstimate = {
      formData,
      ...calculatedPrice
    };

    addEstimate(newEstimate);

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
      title: "Your bike estimate has been saved.",
    }).then(() => {
      handleClear();
    });
  };

  if (!calculatedPrice) {
    return <div>Calculating price...</div>;
  }

  return (
    <>
      <div className="container">
        <h3 className="text-center font-bold pb-2 md:text-4xl text-2xl md:mb-4 text-[#213832]">
          {formData.brand} Cycle Price
        </h3>
        <div className="price-table-container">
          <table className="price-table">
            <thead>
              <tr>
                <th>Component</th>
                <th>Selection</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(formData).map(([component, selection]) => (
                component !== 'brand' && (
                  <tr key={component}>
                    <td>{component}</td>
                    <td>{selection}</td>
                    <td>₹{calculatedPrice.componentPrices?.[component] || 0}</td>
                  </tr>
                )
              ))}

              <tr className="total-row">
                <td colSpan="2">Total Price (excluding GST)</td>
                <td>₹{calculatedPrice.totalPartsPrice || 0}</td>
              </tr>
              <tr className="total-row">
                <td colSpan="2">18% GST</td>
                <td>₹{calculatedPrice.gstAmount || 0}</td>
              </tr>
              <tr className="total-row">
                <td colSpan="2">Total Price</td>
                <td>₹{calculatedPrice.finalPrice || 0}</td>
              </tr>
              <tr className="total-row">
                <td colSpan="3" style={{ textAlign: "center" }}>
                  <button
                    id="saveEstimate"
                    onClick={handleSaveEstimate}
                    className="bg-blue-500 text-white font-bold p-2 rounded-md"
                  >
                    Save Estimated Price
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

PriceBreakdown.propTypes = {
  formData: PropTypes.shape({
    brand: PropTypes.string,
    frame: PropTypes.string,
    handlebar: PropTypes.string,
    seating: PropTypes.string,
    wheel: PropTypes.string,
    tyre: PropTypes.string,
    chainAssembly: PropTypes.string,
    breaks: PropTypes.string,
  }).isRequired,
  handleClear: PropTypes.func.isRequired,
};

export default PriceBreakdown;
