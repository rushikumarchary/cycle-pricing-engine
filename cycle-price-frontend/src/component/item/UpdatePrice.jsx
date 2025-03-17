import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import PropTypes from 'prop-types';

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
        `http://localhost:8081/api/items/update/price?${params.toString()}`,
        null,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Response:', response.data);

      if (response.status === 202) {
        onClose();
        onUpdateSuccess();

        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Price updated successfully",
          timer: 1500
        });
      }
    } catch (error) {
      console.error('Update price error:', error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to update price",
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