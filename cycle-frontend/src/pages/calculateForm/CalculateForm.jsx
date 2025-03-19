import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import PriceBreakdown from "../../components/price_breakdown/PriceBreakdown";
import axios from "axios";
import { getAuthHeader } from "../../utils/auth";
import DomainName from "../../utils/config";

function CalculateForm() {
  const [formData, setFormData] = useState({
    brand: "",
    frame: "",
    handlebar: "",
    seating: "",
    wheel: "",
    breaks: "",
    tyre: "",
    chainAssembly: "",
    comments: "",
  });
  const [brands, setBrands] = useState([]);
  const [items, setItems] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [priceData, setPriceData] = useState(null);
  const breakdownRef = useRef(null);
  const [loadingItems, setLoadingItems] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch brands on component mount
    axios
      .get(`${DomainName}/cycle/brands`, getAuthHeader())
      .then((response) => setBrands(response.data))
      .catch((error) => {
        console.error("Error fetching brands:", error);
        setError("Failed to fetch brands. Please try again later.");
      });
  }, []);

  useEffect(() => {
    if (isSubmitted && breakdownRef.current) {
      breakdownRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [isSubmitted]);

  // Separate function for handling brand selection
  const handleBrandSelect = async (brandId) => {
    setLoadingItems(true);
    setItems(null); // Reset items when brand changes
    setError(""); // Reset error message

    try {
      const response = await axios.get(
        `${DomainName}/cycle/byBrand/${brandId}`,
        getAuthHeader()
      );
      setItems(response.data);
      setFormData((prev) => ({
        ...prev,
        brand: brandId,
        frame: "",
        handlebar: "",
        seating: "",
        wheel: "",
        breaks: "",
        tyre: "",
        chainAssembly: "",
      }));
    } catch (error) {
      console.log(error);
      console.error("Error fetching items:", error);
      setError("Failed to fetch items for selected brand. Please try again.");
      setFormData((prev) => ({ ...prev, brand: "" }));
    } finally {
      setLoadingItems(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "brand") {
      handleBrandSelect(value);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(false);
    const emptyFields = Object.keys(formData).filter(
      (key) => formData[key] === "" && key !== "comments"
    );

    if (emptyFields.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Please fill in these fields: ${emptyFields.join(", ")}`,
      });
      setIsSubmitted(false);
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to calculate the price?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, calculate",
      cancelButtonText: "No, cancel",
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      const requestData = {
        brandId: formData.brand,
        tyreItemId: formData.tyre,
        wheelItemId: formData.wheel,
        frameItemId: formData.frame,
        seatingItemId: formData.seating,
        brakesItemId: formData.breaks,
        chainAssemblyItemId: formData.chainAssembly,
        handlebarItemId: formData.handlebar,
      };

      axios
        .post(
          `${DomainName}/cycle/calculate-price`,
          requestData,
          getAuthHeader()
        )
        .then((response) => {
          console.log(response.data);

          setPriceData(response.data);
          setIsSubmitted(true);
        })
        .catch((error) => {
          console.error("Error calculating price:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to calculate price. Please try again.",
          });
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
      breaks: "",
      tyre: "",
      chainAssembly: "",
      comments: "",
    });
    setItems(null);
    setIsSubmitted(false);
    setError("");
    console.log("Form cleared:", formData);
  };

  return (
    <>
      <div className="container py-1 mx-auto">
        <div className="form-container">
          <div className="form-header">
            <h2>Cycle Configuration</h2>
          </div>
          {error && (
            <p className="text-center text-red-500 font-bold mb-4">{error}</p>
          )}
          {!error && formData.brand === "" && (
            <p className="text-center text-blue-500 font-bold mb-4">
              Please select a brand first to configure your cycle.
            </p>
          )}
          {loadingItems && (
            <p className="text-center text-blue-500 font-bold mb-4">
              Loading items for selected brand...
            </p>
          )}
          <form id="cycleForm">
            <div className="form-grid">
              {/* Brand */}
              <div className="form-group">
                <label htmlFor="brand">Brand:</label>
                <select
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select Brand
                  </option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Conditionally render other fields and buttons */}
              {formData.brand !== "" && !loadingItems && items && (
                <>
                  {/* Frame */}
                  <div className="form-group">
                    <label htmlFor="frame">Frame Material:</label>
                    <select
                      id="frame"
                      name="frame"
                      value={formData.frame}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>
                        Select Frame Material
                      </option>
                      {items.Frame &&
                        items.Frame.map((item) => (
                          <option key={item.item_id} value={item.item_id}>
                            {item.item_name}
                          </option>
                        ))}
                    </select>
                  </div>
                  {/* Handlebar */}
                  <div className="form-group">
                    <label htmlFor="handlebar">Handlebar Type:</label>
                    <select
                      id="handlebar"
                      name="handlebar"
                      value={formData.handlebar}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>
                        Select Handlebar Type
                      </option>
                      {items.Handlebar &&
                        items.Handlebar.map((item) => (
                          <option key={item.item_id} value={item.item_id}>
                            {item.item_name}
                          </option>
                        ))}
                    </select>
                  </div>
                  {/* Seating */}
                  <div className="form-group">
                    <label htmlFor="seating">Seating:</label>
                    <select
                      id="seating"
                      name="seating"
                      value={formData.seating}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>
                        Select Seating
                      </option>
                      {items.Seating &&
                        items.Seating.map((item) => (
                          <option key={item.item_id} value={item.item_id}>
                            {item.item_name}
                          </option>
                        ))}
                    </select>
                  </div>
                  {/* Wheel */}
                  <div className="form-group">
                    <label htmlFor="wheel">Wheel Type:</label>
                    <select
                      id="wheel"
                      name="wheel"
                      value={formData.wheel}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>
                        Select Wheel Type
                      </option>
                      {items.Wheel &&
                        items.Wheel.map((item) => (
                          <option key={item.item_id} value={item.item_id}>
                            {item.item_name}
                          </option>
                        ))}
                    </select>
                  </div>
                  {/* Tyres */}
                  <div className="form-group">
                    <label htmlFor="tyre">Tyres:</label>
                    <select
                      id="tyre"
                      name="tyre"
                      value={formData.tyre}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>
                        Select Tyre Type
                      </option>
                      {items.Tyre &&
                        items.Tyre.map((item) => (
                          <option key={item.item_id} value={item.item_id}>
                            {item.item_name}
                          </option>
                        ))}
                    </select>
                  </div>
                  {/* Brakes */}
                  <div className="form-group">
                    <label htmlFor="breaks">Breaks :</label>
                    <select
                      id="breaks"
                      name="breaks"
                      value={formData.breaks}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>
                        Select Breaks
                      </option>
                      {items.Brakes &&
                        items.Brakes.map((item) => (
                          <option key={item.item_id} value={item.item_id}>
                            {item.item_name}
                          </option>
                        ))}
                    </select>
                  </div>
                  {/* Chain Assembly */}
                  <div className="form-group">
                    <label htmlFor="chainAssembly">Chain Assembly:</label>
                    <select
                      id="chainAssembly"
                      name="chainAssembly"
                      value={formData.chainAssembly}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>
                        Select Chain Assembly
                      </option>
                      {items["Chain Assembly"] &&
                        items["Chain Assembly"].map((item) => (
                          <option key={item.item_id} value={item.item_id}>
                            {item.item_name}
                          </option>
                        ))}
                    </select>
                  </div>
                  {/* Comments   */}
                  <div className="form-group full-width">
                    <label htmlFor="comments">Comments:</label>
                    <textarea
                      id="comments"
                      name="comments"
                      value={formData.comments}
                      onChange={handleChange}
                      placeholder="Write your comments here..."
                      rows="4"
                    ></textarea>
                  </div>
                  {/* Submit and Clear Buttons */}

                  <div>
                    {" "}
                    <button
                      type="submit"
                      className="submit-button"
                      onClick={handleSubmit}
                    >
                      Calculate
                    </button>
                    <button
                      type="button"
                      className="clear-button "
                      onClick={handleClear}
                    >
                      Clear
                    </button>
                  </div>
                </>
              )}
            </div>
          </form>
          {isSubmitted && priceData && (
            <div ref={breakdownRef} className="mt-7 scroll-mt-[4.5rem]">
              <PriceBreakdown priceData={priceData} handleClear={handleClear} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default CalculateForm;
