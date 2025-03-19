import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import PropTypes from 'prop-types';
import { getAuthHeader } from '../../utils/auth';
import DomainName from '../../utils/config';

const UpdateItem = ({ isOpen, onClose, itemId, currentValidTo, currentPrice, onUpdateSuccess }) => {
  const [validTo, setValidTo] = useState('');
  const [price, setPrice] = useState('');

  // Update state when modal opens or props change
  useEffect(() => {
    if (currentValidTo && currentPrice) {
      // Convert the date string to the format required by datetime-local input
      const date = new Date(currentValidTo);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;
      
      // Set both date and price
      setValidTo(formattedDate);
      setPrice(currentPrice);
    }
  }, [currentValidTo, currentPrice, isOpen]);

  // Function to format date to 'yyyy-MM-dd HH:mm:ss'
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = "00";

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedDate = formatDateTime(validTo);
      console.log('Sending data:', { itemId, validTo: formattedDate, price });
      
      const params = new URLSearchParams({
        itemId: itemId,
        validTo: formattedDate,
        price: price
      });

      const response = await axios.patch(
        `${DomainName}/item/update/date-and-price?${params.toString()}`,
        null,
        getAuthHeader()
      );
      console.log('Response:', response.data);

      onClose();
      onUpdateSuccess();

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Item updated successfully",
      });
    } catch (error) {
      console.error('Full error:', error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data || "Failed to update item",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Update Item Details</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Valid To
            </label>
            <input
              type="datetime-local"
              className="w-full p-2 border rounded"
              value={validTo}
              onChange={(e) => setValidTo(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Price
            </label>
            <input
              type="number"
              step="0.01"
              className="w-full p-2 border rounded"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
              min="0"
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Update Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

UpdateItem.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  itemId: PropTypes.number.isRequired,
  currentValidTo: PropTypes.string.isRequired,
  currentPrice: PropTypes.number.isRequired,
  onUpdateSuccess: PropTypes.func.isRequired
};

export default UpdateItem; 