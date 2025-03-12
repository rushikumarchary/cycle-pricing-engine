import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import PropTypes from 'prop-types';
import { getAuthHeader } from '../../utils/auth';

const UpdateDateTime = ({ isOpen, onClose, itemId, currentValidTo, onUpdateSuccess }) => {
  const [validTo, setValidTo] = useState(currentValidTo ? currentValidTo.replace(' ', 'T') : '');

  // Function to format date to 'yyyy-MM-dd HH:mm:ss'
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = "00"; // Default seconds to 00

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedDate = formatDateTime(validTo);
      console.log('Sending data:', { itemId, validTo: formattedDate }); // Debug log
      
      const params = new URLSearchParams({
        itemId: itemId,
        validTo: formattedDate
      });

      const response = await axios.patch(
        `http://localhost:8080/item/update/date-time?${params.toString()}`,
        null,
        getAuthHeader()
      );
      console.log('Response:', response.data); // Debug log

      onClose();
      onUpdateSuccess();

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Date updated successfully",
      });
    } catch (error) {
      console.error('Full error:', error); // Debug log
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data || "Failed to update date",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Update Valid To Date</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Valid To
            </label>
            <input
              type="datetime-local"
              className="w-full p-2 border rounded"
              value={validTo}
              onChange={(e) => {
                const formattedDate = formatDateTime(e.target.value);
                setValidTo(formattedDate);
              }}
              min={new Date().toISOString().slice(0, 16)}
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
              Update Date
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

UpdateDateTime.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  itemId: PropTypes.number.isRequired,
  currentValidTo: PropTypes.string.isRequired,
  onUpdateSuccess: PropTypes.func.isRequired
};

export default UpdateDateTime; 