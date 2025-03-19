import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import PropTypes from 'prop-types';
import { getAuthHeader } from '../../utils/auth';
import DomainName from '../../utils/config';

const UpdatePrice = ({ isOpen, onClose, itemId, currentPrice, onUpdateSuccess }) => {
  const [price, setPrice] = useState(currentPrice);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const params = new URLSearchParams({
        itemId: itemId,
        price: price
      });

      const response = await axios.patch(
        `${DomainName}/item/update/price?${params.toString()}`,
        null,
        getAuthHeader()
      );
      console.log('Response:', response.data);

      onClose();
      onUpdateSuccess();

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Price updated successfully",
      });
    } catch (error) {
      console.error('Full error:', error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data || "Failed to update price",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Update Price</h2>
        <form onSubmit={handleSubmit}>
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
              Update Price
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

UpdatePrice.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  itemId: PropTypes.number.isRequired,
  currentPrice: PropTypes.number.isRequired,
  onUpdateSuccess: PropTypes.func.isRequired
};

export default UpdatePrice; 