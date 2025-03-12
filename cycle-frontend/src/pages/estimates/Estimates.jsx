import { useState } from "react";
import { Link } from "react-router-dom";
import { useEstimate } from "../../hooks/useEstimate";

function Estimates() {
  // From context, we're getting our array of estimates and the remove function.
  const { estimateData, removeEstimate } = useEstimate();
  const [selectedEstimate, setSelectedEstimate] = useState(null);

  const handleCloseModal = () => {
    setSelectedEstimate(null);
  };

  return (
    <div >
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        {estimateData && estimateData.length > 0 ? (
          <>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Cycle Estimate Summary
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              {estimateData.map((estimate, index) => (
                <div key={index} className="p-4 rounded-lg shadow-lg bg-white">
                  {/* Basic Info: Brand and Final Price */}
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-700">
                      {estimate.formData.brand} Cycle
                    </h3>
                    <p className="text-sm text-gray-600">
                      Final Price: ₹{estimate.finalPrice}
                    </p>
                  </div>
                  {/* Buttons: View Breakdown and Remove */}
                  <div className="flex justify-between">
                    <button
                      onClick={() => setSelectedEstimate(estimate)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
                    >
                      View Breakdown
                    </button>
                    <button
                      onClick={() => removeEstimate(index)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-300"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-center text-red-900 font-bold text-3xl">
            No estimates found. Please calculate first.
          </p>
        )}
        <div className="text-center mt-4">
          <Link
            to="/calculateForm"
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Go to Calculate
          </Link>
        </div>
      </div>

      {/* Modal Overlay */}
      {selectedEstimate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {selectedEstimate.formData.brand} Cycle Breakdown
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border p-2">Component</th>
                    <th className="border p-2">Selection</th>
                    <th className="border p-2">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(selectedEstimate.prices).map(([key, price]) => (
                    <tr key={key}>
                      <td className="border p-2">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </td>
                      <td className="border p-2">
                        {selectedEstimate.formData[key]}
                      </td>
                      <td className="border p-2">₹{price}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="border p-2 font-bold" colSpan="2">
                      Total Price (excluding GST)
                    </td>
                    <td className="border p-2">
                      ₹{selectedEstimate.totalPartsPrice}
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-2 font-bold" colSpan="2">
                      18% GST
                    </td>
                    <td className="border p-2">
                      ₹{selectedEstimate.gstAmount}
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-2 font-bold" colSpan="2">
                      Total Price
                    </td>
                    <td className="border p-2">
                      ₹{selectedEstimate.finalPrice}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Estimates;
