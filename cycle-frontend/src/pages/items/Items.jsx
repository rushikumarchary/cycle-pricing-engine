/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaEdit, FaTrash, FaPlus, FaSearch, FaList } from "react-icons/fa";
import AddItem from "../../components/item/AddItem";
import UpdateItem from "../../components/item/UpdateItem";
import { useLocation, useNavigate } from "react-router-dom";
import {
  hasManagementAccess,
  getAuthHeader,
  handleApiError,
  isAuthenticated,
} from "../../utils/auth";
import DomainName from "../../utils/config";

function Items() {
  const location = useLocation();
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);

  // Add authentication check
  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated()) {
        navigate("/signIn", { state: { redirectTo: location.pathname } });
        return;
      }
    };

    checkAuth();
    const interval = setInterval(checkAuth, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [navigate, location.pathname]);

  // Add this useEffect for search functionality
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
  }, [searchName, items]); // Dependencies: searchName and items

  // Wrap handleApiError in useCallback
  const handleApiError = useCallback(
    (error) => {
      if (error.response?.status === 403) {
        Swal.fire({
          icon: "error",
          title: "Session Expired",
          text: "Your session has expired. Please login again.",
        }).then(() => {
          navigate("/signIn", { state: { redirectTo: location.pathname } });
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data || "An error occurred",
        });
      }
    },
    [navigate, location.pathname]
  );

  // Fetch items with auth check
  const fetchItemsForBrand = useCallback(
    async (brandName) => {
      try {
        if (!isAuthenticated()) {
          return;
        }

        const response = await axios.get(
          `${DomainName}/item/brand/${brandName}`,
          getAuthHeader()
        );
        setItems(response.data);
        setCurrentPage(1);
      } catch (error) {
        setItems([]);
        handleApiError(error);
      }
    },
    [handleApiError]
  );

  // Separate useEffect for initial brands fetch
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get(
          `${DomainName}/brand/brands`,
          getAuthHeader()
        );
        setBrands(response.data);

        // If we have a selected brand from navigation, use that
        if (location.state?.selectedBrand) {
          setSelectedBrand(location.state.selectedBrand);
          fetchItemsForBrand(location.state.selectedBrand);
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data || "Failed to fetch brands",
        });
      }
    };

    if (!hasManagementAccess()) {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "Only Administrators and Managers can manage items.",
      }).then(() => {
        navigate("/");
      });
      return;
    }

    fetchBrands();
  }, [location.state?.selectedBrand, fetchItemsForBrand, navigate]); // Add dependencies

  // Empty dependency array as it doesn't depend on any props or state

  // Modify handleBrandChange to use the new fetchItemsForBrand function
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

  // Add this useEffect to handle pagination when items change
  useEffect(() => {
    const totalPages = Math.ceil(
      (filteredItems.length > 0 ? filteredItems.length : items.length) /
        itemsPerPage
    );
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [items.length, filteredItems.length, currentPage, itemsPerPage]);

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setIsUpdateModalOpen(true);
  };

  // Update delete handler
  const handleDelete = (itemId) => {
    if (!isAuthenticated()) {
      return;
    }

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
          await axios.delete(
            `${DomainName}/item/delete/${itemId}`,
            getAuthHeader()
          );

          // Update items list after deletion
          if (selectedBrand) {
            await fetchItemsForBrand(selectedBrand);
          }

          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Item has been deleted.",
          });
        } catch (error) {
          console.log(error);
          if (error.response?.status === 406) {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: error.response?.data || "An error occurred",
            });
          } else {
            handleApiError(error);
          }
        }
      }
    });
  };

  const handleItemAdded = async () => {
    try {
      // Refresh items list after adding new item
      const response = await axios.get(
        `${DomainName}/item/brand/${selectedBrand}`,
        getAuthHeader()
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

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex justify-center">
        <div className="w-2/3 flex flex-col justify-center items-center">
          <label className="block text-gray-200 text-xl font-bold mb-4 text-center">
            {selectedBrand
              ? <p className="text-black text-xl font-bold text-center">Managing Items for <span className="text-[#352496]">{selectedBrand}</span></p>
              : <p className="text-black text-xl font-bold text-center">Select a Brand to View and Manage Items</p>
              }
          </label>
          <div className="flex items-center gap-4">
            <select
              className="w-64 p-2 border rounded"
              value={selectedBrand} 
              onChange={handleBrandChange}
            >
              <option value="" disabled>
                Select a brand
              </option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.name}>
                  {brand.name}
                </option>
              ))}
            </select>
            {!selectedBrand && (
              <button
                onClick={() => navigate("/brand")}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
              >
                <FaList className="mr-2" /> Manage Brands
              </button>
            )}
          </div>
        </div>
      </div>

      {selectedBrand ? (
        <>
          {items.length > 0 ? (
            <div className="mb-5  flex items-center justify-between">
              <span className="flex gap-4">
                <input
                  type="text"
                  placeholder="Search by item name..."
                  className="p-2 border rounded"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                />
                {searchName.length > 0 && (
                  <button
                    onClick={() => {
                      setSearchName("");
                      setFilteredItems([]);
                    }}
                    className="bg-gray-500 text-white px-4 p-2 rounded hover:bg-gray-600"
                  >
                    Clear Search
                  </button>
                )}
              </span>
              <span >
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
                >
                  <FaPlus className="mr-2" /> Add Item
                </button>
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
            <div className="mb-5">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
            >
              <FaPlus className="mr-2" /> Add Item
            </button>
          </div>
            <div className="text-center text-black mt-8">
              <p>No items found for this brand.</p>
              <p>Click Add Item to add your first item.</p>
            </div>
            </div>
          )}

          {currentItems.length > 0 && (
            <div className="mb-4">
              {filteredItems.length > 0 ? (
                <p className="text-gray-600">
                  Found {filteredItems.length} item(s) matching : {searchName}
                </p>
              ) : searchName ? (
                <p className="text-gray-600">
                  No items found matching : {searchName}{" "}
                </p>
              ) : null}
            </div>
          )}

          {currentItems.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg shadow-[2px_4px_12px_rgba(75,75,112,1)]">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left">Item Name</th>  
                    <th className="px-6 py-3 text-left">Type</th>
                    <th className="px-6 py-3 text-left">Price</th>
                    <th className="px-6 py-3 text-left">Valid To</th>
                    <th className="px-6 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item) => (
                    <tr key={item.itemId} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">{item.itemName}</td>
                      <td className="px-6 py-4">{item.itemType}</td>
                      <td className="px-6 py-4">
                        {Number(item.price).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        {item.validTo}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditItem(item)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(item.itemId)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Improved Pagination */}
              <div className="flex justify-center items-center gap-2 mt-4">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${
                    currentPage === 1
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                >
                  Previous
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1 rounded ${
                          currentPage === pageNum
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 hover:bg-gray-300"
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
                  className={`px-3 py-1 rounded ${
                    currentPage === totalPages
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center text-gray-900 font-bold mt-8">
          <p>Please select a brand to view and manage items.</p>
          <p>You can also go to the Brands page to manage your brands.</p>
        </div>
      )}

      <AddItem
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        selectedBrand={selectedBrand}
        onItemAdded={() => fetchItemsForBrand(selectedBrand)}
        authConfig={getAuthHeader()}
      />

      {selectedItem && (
        <UpdateItem
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          itemId={selectedItem.itemId}
          currentValidTo={selectedItem.validTo}
          currentPrice={selectedItem.price}
          onUpdateSuccess={() => fetchItemsForBrand(selectedBrand)}
        />
      )}
    </div>
  );
}

export default Items;
