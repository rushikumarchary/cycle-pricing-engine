/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaList,
  FaCalendarAlt,
  FaTag,
  FaDollarSign,
  FaClock,
} from "react-icons/fa";
import AddItem from "../../component/item/AddItem";
import UpdateDateTime from "../../component/item/UpdateDateTime";
import UpdatePrice from "../../component/item/UpdatePrice";
import { useLocation, useNavigate } from "react-router-dom";

function Items() {
  const location = useLocation();
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateDateModalOpen, setIsUpdateDateModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isUpdatePriceModalOpen, setIsUpdatePriceModalOpen] = useState(false);
  const [selectedItemForPrice, setSelectedItemForPrice] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);

  const authConfig = {
    auth: {
      username: "Admin",
      password: "admin123",
    },
  };

  // Search functionality
  useEffect(() => {
    if (searchName.trim() === "") {
      setFilteredItems([]);
      return;
    }

    const filtered = items.filter((item) =>
      item.itemName.toLowerCase().includes(searchName.toLowerCase())
    );
    setFilteredItems(filtered);
    console.log(filtered);
  }, [searchName, items]);

  // Fetch items for brand
  const fetchItemsForBrand = useCallback(async (brandName) => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/items/brand/${brandName}`
      );
      console.log("Fetched items:", response.data);
      setItems(response.data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching items:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to fetch items";
      setItems([]);
      setCurrentPage(1);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });
    }
  }, []);

  // Fetch brands
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const brandsResponse = await axios.get(
          "http://localhost:8081/api/brands/getAllBrands"
        );
        setBrands(brandsResponse.data);

        if (location.state?.selectedBrand) {
          setSelectedBrand(location.state.selectedBrand);
          await fetchItemsForBrand(location.state.selectedBrand);
        }
      } catch (error) {
        console.error("Error fetching brands:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data || "Failed to fetch brands",
        });
      }
    };

    fetchBrands();
  }, [location.state?.selectedBrand, fetchItemsForBrand]);

  // Handle brand change
  const handleBrandChange = async (e) => {
    const brandName = e.target.value;
    setSelectedBrand(brandName);
    setSearchName("");
    setFilteredItems([]);
    await fetchItemsForBrand(brandName);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems =
    filteredItems.length > 0
      ? filteredItems.slice(indexOfFirstItem, indexOfLastItem)
      : items.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(
    (filteredItems.length > 0 ? filteredItems.length : items.length) /
      itemsPerPage
  );

  // Handle pagination when items change
  useEffect(() => {
    const totalPages = Math.ceil(
      (filteredItems.length > 0 ? filteredItems.length : items.length) /
        itemsPerPage
    );
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [items.length, filteredItems.length, currentPage, itemsPerPage]);

  // Handle editing valid to date
  const handleEditValidTo = (itemId, validTo) => {
    console.log("ItemId:", itemId, "ValidTo:", validTo);
    setSelectedItem({ itemId, validTo });
    setIsUpdateDateModalOpen(true);
  };

  // Handle deleting an item
  const handleDelete = (itemId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(
            `http://localhost:8081/api/items/${itemId}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Basic " + btoa("admin:admin123"),
              },
            }
          );

          if (response.status === 200) {
            // Get current page items before deletion
            const currentPageItems =
              filteredItems.length > 0
                ? filteredItems.slice(indexOfFirstItem, indexOfLastItem)
                : items.slice(indexOfFirstItem, indexOfLastItem);

            // If this is the last item on the page and not the first page,
            // decrease the current page
            if (currentPageItems.length === 1 && currentPage > 1) {
              setCurrentPage((prev) => prev - 1);
            }

            // Remove the deleted item from the items array
            setItems((prevItems) =>
              prevItems.filter((item) => item.itemId !== itemId)
            );

            // Also update filtered items if search is active
            if (filteredItems.length > 0) {
              setFilteredItems((prevFiltered) =>
                prevFiltered.filter((item) => item.itemId !== itemId)
              );
            }

            // Refresh the items list for the selected brand
            await fetchItemsForBrand(selectedBrand);

            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Item Deleted Successfully",
              text: response.data,
              showConfirmButton: false,
              timer: 1500,
            });
          }
        } catch (error) {
          console.error("Delete error:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error.response?.data?.message || "Failed to delete item",
          });
        }
      }
    });
  };

  // Handle item add success
  const handleItemAdded = async () => {
    if (selectedBrand) {
      await fetchItemsForBrand(selectedBrand);
    }
  };

  // Handle update success
  const handleUpdateSuccess = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/item/brand/${selectedBrand}`
      );
      setItems(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to refresh items list",
      });
    }
  };

  // Handle editing price
  const handleEditPrice = (itemId, price) => {
    setSelectedItemForPrice({ itemId, price });
    setIsUpdatePriceModalOpen(true);
  };

  // Generate background color for cards based on item type
  const getCardColor = (type) => {
    switch (type.toLowerCase()) {
      case "electronics":
        return "from-purple-500 to-indigo-600";
      case "clothing":
        return "from-blue-500 to-teal-400";
      case "food":
        return "from-orange-400 to-pink-500";
      case "furniture":
        return "from-amber-500 to-yellow-400";
      case "books":
        return "from-emerald-500 to-green-400";
      default:
        return "from-gray-700 to-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-white text-center">
            {selectedBrand
              ? `${selectedBrand} Inventory`
              : "Inventory Management"}
          </h1>
          <p className="text-gray-100 text-center mt-2">
            {selectedBrand
              ? "Browse and manage your brand's inventory items"
              : "Select a brand to start managing your inventory"}
          </p>
        </div>

        {/* Brand Selection Section */}
        <div className="mb-8 bg-white rounded-lg p-6 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <label className="block text-gray-300 text-lg font-medium mb-2">
                Select Brand
              </label>
              <div className="relative">
                <select
                  className="w-full bg-gray-400 text-white p-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm appearance-none"
                  value={selectedBrand}
                  onChange={handleBrandChange}
                >
                  <option value="" disabled>
                    Select a brand
                  </option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.brandName}>
                      {brand.brandName}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              {!selectedBrand ? (
                <button
                  onClick={() => navigate("/brand")}
                  className="flex items-center justify-center mt-8 gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <FaList /> Manage Brands
                </button>
              ) : (
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <FaPlus /> Add Item
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        {selectedBrand ? (
          <>
            {/* Search Section */}
            {items.length > 0 && (
              <div className="mb-8">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search items by name..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white placeholder-gray-400 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                  />
                  {searchName.length > 0 && (
                    <button
                      onClick={() => {
                        setSearchName("");
                        setFilteredItems([]);
                      }}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {filteredItems.length > 0 ? (
                  <p className="mt-2 text-gray-400">
                    Found {filteredItems.length} item(s) matching {searchName}
                  </p>
                ) : searchName ? (
                  <p className="mt-2 text-gray-400">
                    No items found matching {searchName}
                  </p>
                ) : null}
              </div>
            )}

            {/* Empty State */}
            {items.length === 0 && (
              <div className="text-center py-16 bg-white rounded-lg shadow-md">
                <svg
                  className="mx-auto h-16 w-16 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <h2 className="mt-4 text-xl font-semibold text-white">
                  No items found
                </h2>
                <p className="mt-2 text-gray-400">
                  Get started by adding your first item.
                </p>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="mt-6 flex items-center justify-center gap-2 mx-auto bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-medium py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <FaPlus /> Add First Item
                </button>
              </div>
            )}

            {/* Items Grid/Card View */}
            {currentItems.length > 0 && (
              <div className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentItems.map((item) => (
                    <div
                      key={item.itemId}
                      className={`bg-gradient-to-br ${getCardColor(
                        item.itemType
                      )} rounded-xl shadow-lg overflow-hidden border border-gray-700 transition-transform duration-200 hover:scale-102 hover:shadow-xl`}
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-bold text-white truncate">
                            {item.itemName}
                          </h3>
                          <button
                            onClick={() => handleDelete(item.itemId)}
                            className="text-gray-300 hover:text-red-400 transition-colors"
                            aria-label="Delete item"
                          >
                            <FaTrash />
                          </button>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center">
                            <FaTag className="text-white opacity-80 mr-2" />
                            <span className="text-white">{item.itemType}</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <FaDollarSign className="text-white opacity-80 mr-2" />
                              <span className="text-white font-medium">
                                ${Number(item.price).toFixed(2)}
                              </span>
                            </div>
                            <button
                              onClick={() =>
                                handleEditPrice(item.itemId, item.price)
                              }
                              className="text-white hover:text-yellow-300 transition-colors"
                              aria-label="Edit price"
                            >
                              <FaEdit />
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <FaClock className="text-white opacity-80 mr-2" />
                              <span className="text-white">{item.validTo}</span>
                            </div>
                            <button
                              onClick={() =>
                                handleEditValidTo(item.itemId, item.validTo)
                              }
                              className="text-white hover:text-yellow-300 transition-colors"
                              aria-label="Edit expiration date"
                            >
                              <FaCalendarAlt />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="inline-flex bg-gray-800 rounded-lg shadow-lg p-1">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      currentPage === 1
                        ? "text-gray-500 cursor-not-allowed"
                        : "text-white hover:bg-blue-600 transition-colors"
                    }`}
                  >
                    Previous
                  </button>

                  <div className="flex items-center px-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-8 h-8 mx-1 flex items-center justify-center rounded-md ${
                            currentPage === pageNum
                              ? "bg-blue-600 text-white"
                              : "text-gray-300 hover:bg-gray-700"
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      currentPage === totalPages
                        ? "text-gray-500 cursor-not-allowed"
                        : "text-white hover:bg-blue-600 transition-colors"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-lg p-10 shadow-md text-center">
         
            <h2 className="text-2xl font-bold text-white mb-3">
              No Brand Selected
            </h2>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Please select a brand from the dropdown above to view and manage
              items, or go to the Brands page to create a new brand.
            </p>
            <button
              onClick={() => navigate("/brand")}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              <FaList /> Manage Brands
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddItem
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        selectedBrand={selectedBrand}
        onItemAdded={handleItemAdded}
      />

      {selectedItem && (
        <UpdateDateTime
          isOpen={isUpdateDateModalOpen}
          onClose={() => setIsUpdateDateModalOpen(false)}
          itemId={selectedItem.itemId}
          currentValidTo={selectedItem.validTo}
          authConfig={authConfig}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}

      {selectedItemForPrice && (
        <UpdatePrice
          isOpen={isUpdatePriceModalOpen}
          onClose={() => setIsUpdatePriceModalOpen(false)}
          itemId={selectedItemForPrice.itemId}
          currentPrice={selectedItemForPrice.price}
          authConfig={authConfig}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
}

export default Items;
