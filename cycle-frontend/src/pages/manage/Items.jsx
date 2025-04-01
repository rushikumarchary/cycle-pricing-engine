import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
// eslint-disable-next-line no-unused-vars
import { FaEdit, FaTrash, FaPlus, FaSearch, FaList } from "react-icons/fa";
import AddItem from "../../components/item/AddItem";
import UpdateItem from "../../components/item/UpdateItem";
import { useLocation, useNavigate } from "react-router-dom";
import { hasManagementAccess, isAuthenticated } from "../../utils/auth";
import { itemAPI, brandAPI } from "../../utils/api";
import toast from "react-hot-toast";

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

  }, [searchName, items]); // Dependencies: searchName and items

  // Wrap handleApiError in useCallback
  const handleApiError = useCallback(
    (error) => {
      if (error.response?.status === 403) {
        toast
          .error("Your session has expired. Please login again.")
          .then(() => {
            navigate("/signIn", { state: { redirectTo: location.pathname } });
          });
      } else {
        toast.error(error.response?.data || "An error occurred")
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

        const response = await itemAPI.getItemsByBrandName(brandName);
        setItems(response);
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
        const response = await brandAPI.getAllBrands();
        setBrands(response);

        // If we have a selected brand from navigation, use that
        if (location.state?.selectedBrand) {
          setSelectedBrand(location.state.selectedBrand);
          fetchItemsForBrand(location.state.selectedBrand);
        }
      } catch (error) {
        toast.error(error.response?.data || "Failed to fetch brands")
      }
    };

    if (!hasManagementAccess()) {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "Only Administrators and Managers can manage items.",
        showConfirmButton:false,
        timer:1500,
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
          await itemAPI.deleteItem(itemId);

          // Update items list after deletion
          if (selectedBrand) {
            await fetchItemsForBrand(selectedBrand);
          }
          toast.success("Item has been deleted.");
        } catch (error) {
          console.log(error);
          if (error.response?.status === 406) {
            Swal.fire({
              title: "Are you sure?",
              text: error.response.data,
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Yes, delete it!",
            }).then(async (result) => {
              if (result.isConfirmed) {
                try {
                  await itemAPI.deleteConfirmItem(itemId);
                  if (selectedBrand) {
                    await fetchItemsForBrand(selectedBrand);
                  }
                  toast.success("Item has been deleted.");
                } catch (error) {
                  console.log(error);
                  
                }
              }


            })
          } else {
            handleApiError(error);
          }
        }
      }
    });
  };


  return (
    <div className="container mx-auto py-0 sm:px-4  sm:py-6 md:py-0">
      {/* Brand Selection Section */}
      <div className="mb-6">
        <div className="w-full lg:w-3/4 xl:w-2/3 mx-auto flex flex-col items-center">
          <label className="block mb-4 text-center">
            {selectedBrand ? (
              <p className="text-black text-lg sm:text-xl font-bold">
                Managing Items for{" "}
                <span className="text-[#352496]">{selectedBrand}</span>
              </p>
            ) : (
              <p className="text-black text-lg sm:text-xl font-bold">
                Select a Brand to View and Manage Items
              </p>
            )}
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-xl px-4">
            <select
              className="w-full sm:w-64 p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
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
                className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2.5 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
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
            <div className="w-full lg:w-3/4 xl:w-2/3 mx-auto px-2 sm:px-4">
              <div className="mb-5 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-full sm:w-auto flex-grow">
                  <input
                    type="text"
                    placeholder="Search by item name..."
                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  {searchName.length > 0 && (
                    <button
                      onClick={() => {
                        setSearchName("");
                        setFilteredItems([]);
                      }}
                      className="w-full sm:w-auto bg-gray-500 text-white px-4 py-2.5 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Clear Search
                    </button>
                  )}
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <FaPlus className="mr-2" /> Add Item
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-blue-500 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <FaPlus className="mr-2" /> Add Item
              </button>
              <div className="text-center text-black">
                <p>No items found for this brand.</p>
                <p>Click Add Item to add your first item.</p>
              </div>
            </div>
          )}

          {currentItems.length > 0 && (
            <div className="w-full lg:w-3/4 xl:w-2/3 mx-auto px-2 sm:px-4">
              {filteredItems.length > 0 ? (
                <p className="text-gray-600 mb-4">
                  Found {filteredItems.length} item(s) matching: {searchName}
                </p>
              ) : searchName ? (
                <p className="text-gray-600 mb-4">
                  No items found matching: {searchName}
                </p>
              ) : null}

              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Mobile View */}
                <div className="block sm:hidden divide-y divide-gray-200">
                  {currentItems.map((item) => (
                    <div key={item.itemId} className="p-4 hover:bg-gray-50 mb-2 last:mb-0">
                      <div className="flex justify-between items-start mb-3">
                        <div className="space-y-1">
                          <h3 className="font-medium text-base">{item.itemName}</h3>
                          <p className="text-sm text-gray-600">{item.itemType}</p>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleEditItem(item)}
                            className="p-2 text-blue-600 hover:text-blue-800 transition-colors hover:bg-blue-50 rounded-full"
                          >
                            <FaEdit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.itemId)}
                            className="p-2 text-red-600 hover:text-red-800 transition-colors hover:bg-red-50 rounded-full"
                          >
                            <FaTrash size={18} />
                          </button>
                        </div>
                      </div>
                      <div className="text-sm space-y-2 bg-gray-50 p-3 rounded-lg">
                        <p className="flex justify-between py-1">
                          <span className="text-gray-600 font-medium">Price:</span>
                          <span className="text-gray-900">₹{Number(item.price).toFixed(2)}</span>
                        </p>
                        <p className="flex justify-between py-1">
                          <span className="text-gray-600 font-medium">Valid To:</span>
                          <span className="text-gray-900">{item.validTo}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop View */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valid To</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentItems.map((item) => (
                        <tr key={item.itemId} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">{item.itemName}</td>
                          <td className="px-4 py-3 text-sm">{item.itemType}</td>
                          <td className="px-4 py-3 text-sm">₹{Number(item.price).toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm">{item.validTo}</td>
                          <td className="px-4 py-3">
                            <div className="flex justify-end gap-3">
                              <button
                                onClick={() => handleEditItem(item)}
                                className="p-1.5 text-blue-600 hover:text-blue-800 transition-colors"
                                title="Edit"
                              >
                                <FaEdit size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(item.itemId)}
                                className="p-1.5 text-red-600 hover:text-red-800 transition-colors"
                                title="Delete"
                              >
                                <FaTrash size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1.5 rounded-lg text-sm ${
                      currentPage === 1
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600 text-white transition-colors"
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
                          className={`px-3 py-1.5 rounded-lg text-sm ${
                            currentPage === pageNum
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 hover:bg-gray-300 transition-colors"
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1.5 rounded-lg text-sm ${
                      currentPage === totalPages
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
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
