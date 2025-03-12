import { createContext, useState } from "react";
import PropTypes from "prop-types";

const EstimateContext = createContext();

export const EstimateProvider = ({ children }) => {
  // Start with an empty array; data will only persist during this session
  const [estimates, setEstimates] = useState([]);

  const addEstimate = (newEstimate) => {
    setEstimates((prev) => [...prev, newEstimate]); // Append new estimate
  };

  // Remove an estimate by its index in the array
  const removeEstimate = (indexToRemove) => {
    setEstimates((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <EstimateContext.Provider value={{ estimateData: estimates, addEstimate, removeEstimate }}>
      {children}
    </EstimateContext.Provider>
  );
};

EstimateProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default EstimateContext;
