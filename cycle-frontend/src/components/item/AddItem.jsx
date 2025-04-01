/* eslint-disable react/prop-types */
import { useState } from "react";
import { isAuthenticated } from '../../utils/auth';
import { itemAPI } from "../../utils/api";
import toast from "react-hot-toast";

const AddItem = ({ isOpen, onClose, selectedBrand, onItemAdded }) => {
  const [newItem, setNewItem] = useState({
    itemName: "",
    itemType: "",
    price: 0,
    validTo: "",
    brandName: "",
  });

  const [errors, setErrors] = useState({
    itemName: false,
    itemType: false,
    price: false,
    validTo: false,
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

  const validateFields = () => {
    const newErrors = {
      itemName: !newItem.itemName.trim(),
      itemType: !newItem.itemType.trim(),
      price: !newItem.price || newItem.price <= 0,
      validTo: !newItem.validTo,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!selectedBrand) {
      toast.error("Please select a brand first");
      return;
    }

    if (!validateFields()) {
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
  
      await itemAPI.addItem(itemData);
  
      onClose();
      setNewItem({
        itemName: "",
        itemType: "",
        price: 0,
        validTo: "",
        brandName: "",
      });
      setErrors({
        itemName: false,
        itemType: false,
        price: false,
        validTo: false,
      });
  
      // Notify parent component to refresh the items list
      onItemAdded();
      toast.success("Item added successfully")
  
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add item")
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
              className={`w-full p-2 border rounded ${errors.itemName ? 'border-red-500' : ''}`}
              value={newItem.itemName}
              onChange={(e) => {
                setNewItem({ ...newItem, itemName: e.target.value });
                setErrors({ ...errors, itemName: false });
              }}
              
            />
            {errors.itemName && (
              <p className="text-red-500 text-sm mt-1">Item name is required</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Item Type
            </label>
            <input
              type="text"
              className={`w-full p-2 border rounded ${errors.itemType ? 'border-red-500' : ''}`}
              value={newItem.itemType}
              onChange={(e) => {
                setNewItem({ ...newItem, itemType: e.target.value });
                setErrors({ ...errors, itemType: false });
              }}
              
            />
            {errors.itemType && (
              <p className="text-red-500 text-sm mt-1">Item type is required</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Price
            </label>
            <input
              type="number"
              className={`w-full p-2 border rounded ${errors.price ? 'border-red-500' : ''}`}
              value={newItem.price}
              onChange={(e) => {
                setNewItem({
                  ...newItem,
                  price: parseFloat(e.target.value),
                });
                setErrors({ ...errors, price: false });
              }}
              
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">Price must be greater than 0</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Valid To
            </label>
            <input
              type="datetime-local"
              className={`w-full p-2 border rounded ${errors.validTo ? 'border-red-500' : ''}`}
              value={newItem.validTo ? newItem.validTo.replace(" ", "T") : ""}
              onChange={(e) => {
                const formattedDate = formatDateTime(e.target.value);
                setNewItem({ ...newItem, validTo: formattedDate });
                setErrors({ ...errors, validTo: false });
              }}
              min={new Date().toISOString().slice(0, 16)}
              
            />
            {errors.validTo && (
              <p className="text-red-500 text-sm mt-1">Valid to date is required</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                // Clear all form fields
                setNewItem({
                  itemName: "",
                  itemType: "",
                  price: 0,
                  validTo: "",
                  brandName: "",
                });
                // Reset all error states
                setErrors({
                  itemName: false,
                  itemType: false,
                  price: false,
                  validTo: false,
                });
                onClose();
              }}
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