import { useState } from "react";
import { Link } from "react-router-dom";
import { useEstimate } from "../../hooks/useEstimate";

function Estimates() {
  // From context, we're getting our array of estimates and the remove function.
  const { estimateData, removeEstimate } = useEstimate();
  // Local state to track which estimate card is expanded (keyed by index)
  const [expanded, setExpanded] = useState({});

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        {estimateData && estimateData.length > 0 ? (
          <>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
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
                  {/* Buttons: View/Hide Breakdown and Remove */}
                  <div className="flex justify-between">
                    {!expanded[index] ? (
                      <button
                        onClick={() =>
                          setExpanded((prev) => ({ ...prev, [index]: true }))
                        }
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
                      >
                        View Breakdown
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          setExpanded((prev) => ({ ...prev, [index]: false }))
                        }
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
                      >
                        Hide Breakdown
                      </button>
                    )}
                    <button
                      onClick={() => removeEstimate(index)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-300"
                    >
                      Remove
                    </button>
                  </div>
                  {/* Detailed Breakdown Table (conditionally shown) */}
                  {expanded[index] && (
                    <div className="mt-4 overflow-x-auto">
                      <table className="min-w-full border-collapse">
                        <thead>
                          <tr>
                            <th className="border p-2">Component</th>
                            <th className="border p-2">Selection</th>
                            <th className="border p-2">Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(estimate.prices).map(
                            ([key, price]) => (
                              <tr key={key}>
                                <td className="border p-2">
                                  {key.charAt(0).toUpperCase() + key.slice(1)}
                                </td>
                                <td className="border p-2">
                                  {estimate.formData[key]}
                                </td>
                                <td className="border p-2">₹{price}</td>
                              </tr>
                            )
                          )}
                          <tr>
                            <td className="border p-2 font-bold" colSpan="2">
                              Total Price (excluding GST)
                            </td>
                            <td className="border p-2">
                              ₹{estimate.totalPartsPrice}
                            </td>
                          </tr>
                          <tr>
                            <td className="border p-2 font-bold" colSpan="2">
                              18% GST
                            </td>
                            <td className="border p-2">
                              ₹{estimate.gstAmount}
                            </td>
                          </tr>
                          <tr>
                            <td className="border p-2 font-bold" colSpan="2">
                              Total Price
                            </td>
                            <td className="border p-2">
                              ₹{estimate.finalPrice}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-center text-red-500 font-bold text-3xl">
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
    </div>
  );
}

export default Estimates;
