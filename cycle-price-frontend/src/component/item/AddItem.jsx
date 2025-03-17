/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AddItem = ({ isOpen, onClose, selectedBrand, onItemAdded }) => {
  const [newItem, setNewItem] = useState({
    itemName: "",
    itemType: "",
    price: 0,
    validTo: "",
    brandName: "",
  });

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toISOString().slice(0, 19).replace("T", " ");
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
      // Format the data exactly as expected by the backend
      const itemRequest = {
        itemName: newItem.itemName,
        itemType: newItem.itemType,
        price: Number(newItem.price),
        validTo: newItem.validTo,
        brandName: selectedBrand,
      };

      console.log("Sending data:", itemRequest);

      // Update to use the correct endpoint
      const response = await axios.post(
        "http://localhost:8081/api/items",
        itemRequest,
        {
          headers: {
            "Content-Type": "application/json",
          },
          validateStatus: function (status) {
            return status >= 200 && status < 300; // Accept any success status
          },
        }
      );

      console.log("Response:", response); // Debug log

      if (response.data) {
        setNewItem({
          itemName: "",
          itemType: "",
          price: 0,
          validTo: "",
          brandName: "",
        });
        onClose();

        await Swal.fire({
          icon: "success",
          title: "Success",
          text: "Item added successfully",
          timer: 1500,
        });

        // Refresh the items list
        if (onItemAdded) {
          await onItemAdded();
        }
      }
    } catch (error) {
      console.error("Error adding item:", error);
      console.error("Error response:", error.response?.data);

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "Failed to add item. Please try again.",
      });
    }
  };

  // Update the datetime input handler
  const handleDateTimeChange = (e) => {
    try {
      const formattedDate = formatDateTime(e.target.value);
      setNewItem({ ...newItem, validTo: formattedDate });
    } catch (error) {
      console.error("Date formatting error:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl w-full max-w-md shadow-2xl transform transition-all">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
          Add New Item
        </h2>

        <form onSubmit={handleAddItem} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Item Name
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
              value={newItem.itemName}
              onChange={(e) =>
                setNewItem({ ...newItem, itemName: e.target.value })
              }
              placeholder="Enter item name"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Item Type
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
              value={newItem.itemType}
              onChange={(e) =>
                setNewItem({ ...newItem, itemType: e.target.value })
              }
              placeholder="Enter item type"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Price
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                step="0.01"
                min="0"
                className="w-full p-3 pl-7 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                value={newItem.price}
                onChange={(e) =>
                  setNewItem({ ...newItem, price: e.target.value })
                }
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Valid Until
            </label>
            <input
              type="datetime-local"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
              value={newItem.validTo ? newItem.validTo.replace(" ", "T") : ""}
              onChange={handleDateTimeChange}
              min={new Date().toISOString().slice(0, 16)}
              required
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-100 text-gray-800 px-5 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300 shadow-md"
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
