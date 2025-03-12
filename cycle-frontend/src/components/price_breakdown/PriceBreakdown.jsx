import PropTypes from "prop-types";
import { useEstimate } from "../../hooks/useEstimate";
import Swal from "sweetalert2";

function PriceBreakdown({ priceData, handleClear }) {
  PriceBreakdown.propTypes = {
    priceData: PropTypes.shape({
      brand: PropTypes.string,
      tyre: PropTypes.string,
      wheel: PropTypes.string,
      frame: PropTypes.string,
      seating: PropTypes.string,
      brakes: PropTypes.string,
      chainAssembly: PropTypes.string,
      handlebar: PropTypes.string,
      price: PropTypes.number,
      gst: PropTypes.number,
      discount: PropTypes.number,
      totalPrice: PropTypes.number,
      partsPrice: PropTypes.object,
    }).isRequired,
    handleClear: PropTypes.func.isRequired,
  };

  const { addEstimate } = useEstimate();

  const handleSaveEstimate = () => {
    // Format the data to match Estimates.jsx structure
    const formattedEstimate = {
      formData: {
        brand: priceData.brand,
        frame: priceData.frame,
        handlebar: priceData.handlebar,
        seating: priceData.seating,
        wheel: priceData.wheel,
        tyre: priceData.tyre,
        brakes: priceData.brakes,
        chainAssembly: priceData.chainAssembly
      },
      prices: {
        frame: priceData.partsPrice[priceData.frame],
        handlebar: priceData.partsPrice[priceData.handlebar],
        seating: priceData.partsPrice[priceData.seating],
        wheel: priceData.partsPrice[priceData.wheel],
        tyre: priceData.partsPrice[priceData.tyre],
        brakes: priceData.partsPrice[priceData.brakes],
        chainAssembly: priceData.partsPrice[priceData.chainAssembly]
      },
      totalPartsPrice: priceData.price,
      gstAmount: priceData.gst,
      finalPrice: priceData.totalPrice
    };

    addEstimate(formattedEstimate);

    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: () => {},
    });
    Toast.fire({
      icon: "success",
      title: "Your bike estimate has been saved.",
    }).then(() => {
      handleClear();
    });
  };

  // Define the component mapping
  const componentMapping = [
    { type: "Frame Material", key: "frame" },
    { type: "Handlebar Type", key: "handlebar" },
    { type: "Seating Type", key: "seating" },
    { type: "Wheel Type", key: "wheel" },
    { type: "Tyre Type", key: "tyre" },
    { type: "Brakes Type", key: "brakes" },
    { type: "Chain Assembly", key: "chainAssembly" }
  ];

  return (
    <>
      <div className="container ">
        <h3 className="text-center font-bold pb-2 md:text-4xl text-2xl md:mb-4 text-[#213832]">
          {priceData.brand} Cycle Price
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
              {componentMapping.map(({ type, key }) => {
                const selectedItem = priceData[key];
                const price = priceData.partsPrice[selectedItem];
                return (
                  <tr key={key}>
                    <td>{type}</td>
                    <td>{selectedItem}</td>
                    <td>{price?.toFixed(2)}</td>
                  </tr>
                );
              })}
              <tr className="total-row">
                <td colSpan="2">Total Parts Price</td>
                <td>{priceData.price.toFixed(2)}</td>
              </tr>
              <tr className="total-row">
                <td colSpan="2">GST (18%)</td>
                <td>{priceData.gst.toFixed(2)}</td>
              </tr>
              <tr className="total-row">
                <td colSpan="2">Discount Applied</td>
                <td>{priceData.discount.toFixed(2)}</td>
              </tr>
              <tr className="total-row font-bold">
                <td colSpan="2">Final Price</td>
                <td>{priceData.totalPrice.toFixed(2)}</td>
              </tr>
              <tr className="total-row">
                <td colSpan="3" style={{ textAlign: "center" }}>
                  <button
                    id="saveEstimate"
                    onClick={handleSaveEstimate}
                    className="bg-blue-500 text-white font-bold p-2 rounded-md hover:bg-blue-600 transition-colors"
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

export default PriceBreakdown;
