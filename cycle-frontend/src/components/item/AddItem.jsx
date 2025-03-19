/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { getAuthHeader, handleApiError, isAuthenticated } from '../../utils/auth';
import DomainName from "../../utils/config";

const AddItem = ({ isOpen, onClose, selectedBrand, onItemAdded }) => {
  const [newItem, setNewItem] = useState({
    itemName: "",
    itemType: "",
    price: 0,
    validTo: "",
    brandName: "",
  });

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
  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!selectedBrand) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please select a brand first",
      });
      return;
    }
  
    try {
      if (!isAuthenticated()) {
        return;
      }
      
      const itemData = {
        ...newItem,
        brandName: selectedBrand,
      };
  
      console.log('Sending data:', itemData); // Debug log
  
      await axios.post(
        `${DomainName}/item/add`,
        itemData,
        getAuthHeader()
      );
  
      onClose();
      setNewItem({
        itemName: "",
        itemType: "",
        price: 0,
        validTo: "",
        brandName: "",
      });
  
      // Notify parent component to refresh the items list
      onItemAdded();
  
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Item added successfully",
      });
    } catch (error) {
      handleApiError(error);
    }
  }; 

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center mt-20">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Add New Item</h2>
        <form onSubmit={handleAddItem}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Item Name
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={newItem.itemName}
              onChange={(e) =>
                setNewItem({ ...newItem, itemName: e.target.value })
              }
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Item Type
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={newItem.itemType}
              onChange={(e) =>
                setNewItem({ ...newItem, itemType: e.target.value })
              }
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Price
            </label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={newItem.price}
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  price: parseFloat(e.target.value),
                })
              }
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Valid To
            </label>
            <input
              type="datetime-local"
              className="w-full p-2 border rounded"
              value={newItem.validTo ? newItem.validTo.replace(" ", "T") : ""}
              onChange={(e) => {
                const formattedDate = formatDateTime(e.target.value);
                setNewItem({ ...newItem, validTo: formattedDate });
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
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItem;