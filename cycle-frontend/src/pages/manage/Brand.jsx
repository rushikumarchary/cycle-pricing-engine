import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { FaEdit, FaTrash, FaPlus, FaList } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import {
  isAuthenticated,
  debugToken,
  hasManagementAccess,
  handleApiError,
} from "../../utils/auth";
import { brandAPI } from "../../utils/api";
import toast from "react-hot-toast";

const Brand = () => {
  const [brands, setBrands] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");
  const [editingBrand, setEditingBrand] = useState(null);
  const [inputError, setInputError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const brandsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBrands, setFilteredBrands] = useState([]);

  // Add authentication check
  useEffect(() => {
    const checkAuth = () => {
      debugToken();
      if (!isAuthenticated()) {
        navigate("/signIn", { state: { redirectTo: location.pathname } });
        return;
      }
    };

    checkAuth();
    // Check auth every 5 minutes
    const interval = setInterval(checkAuth, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [navigate, location.pathname]);

  // Fetch brands with auth check
  const fetchBrands = async () => {
    try {
      debugToken();

      if (!isAuthenticated()) {
        return;
      }

      const response = await brandAPI.getAllBrands();
      setBrands(response);

      if (response.length === 0) {
        toast.error("There are no brands available. Please add a new brand.")
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  useEffect(() => {
    if (!hasManagementAccess()) {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "Only Administrators and Managers can manage brands.",
      });
      navigate("/");
      return;
    }
    fetchBrands();
  }, [navigate]);

  // Add this useEffect to handle pagination when brands change
  useEffect(() => {
    const totalPages = Math.ceil(brands.length / brandsPerPage);
    // If current page is greater than total pages and brands exist,
    // set current page to last available page
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [brands.length, currentPage, brandsPerPage]);

  // Add this useEffect for search functionality
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredBrands([]);
      return;
    }

    const filtered = brands.filter((brand) =>
      brand.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBrands(filtered);
  }, [searchTerm, brands]);

  // Add brand with auth check
  const handleAddBrand = async () => {
    if (!newBrandName.trim()) {
      setInputError(true);
      return;
    }
    setInputError(false);
    try {
      await brandAPI.addBrand(newBrandName);
      await fetchBrands();
      setIsAddModalOpen(false);
      setNewBrandName("");
      toast.success("Brand added successfully")
    } catch (error) {
      handleApiError(error);
    }
  };

  // Edit brand
  const handleEditBrand = async () => {
    if (!newBrandName.trim()) {
      setInputError(true);
      return;
    }
    setInputError(false);
    if (!isAuthenticated()) {
      return;
    }

    try {
      await brandAPI.updateBrand(editingBrand.id, newBrandName);
      await fetchBrands();
      setIsEditModalOpen(false);
      setNewBrandName("");
      setEditingBrand(null);
      toast.success("Brand updated Successfully")
    } catch (error) {
      toast.error(error.response?.data || "Failed to update brand");
    }
  };

  // Modified delete handler
  const handleDelete = async (id) => {
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
          await brandAPI.deleteBrand(id);

          // Get the current number of brands on the page
          const currentPageBrands = brands.slice(
            indexOfFirstBrand,
            indexOfLastBrand
          );

          // If this is the last item on the page and not the first page,
          // decrease the current page
          if (currentPageBrands.length === 1 && currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
          }

          await fetchBrands();
          toast.success( "Brand has been deleted.")
        } catch (error) {
          toast.error(error.response?.data || "Failed to delete brand")

        }
      }
    });
  };

  const handleViewItems = (brandName) => {
    navigate("/items", { state: { selectedBrand: brandName } });
  };

  const indexOfLastBrand = currentPage * brandsPerPage;
  const indexOfFirstBrand = indexOfLastBrand - brandsPerPage;
  const currentBrands =
    filteredBrands.length > 0
      ? filteredBrands.slice(indexOfFirstBrand, indexOfLastBrand)
      : brands.slice(indexOfFirstBrand, indexOfLastBrand);
  const totalPages = Math.ceil(
    (filteredBrands.length > 0 ? filteredBrands.length : brands.length) /
      brandsPerPage
  );

  return (
    <div className="container mx-auto px-0 py-4 sm:py-6 md:py-0">
      {brands.length > 0 ? (
        <>
          {/* Search and Add Brand Section */}
          <div className="w-full md:w-3/4 lg:w-2/3 px-2 sm:px-4 mx-auto flex flex-col sm:flex-row items-center gap-4 mb-6">
            <div className="w-full sm:w-auto flex-grow">
              <input
                type="text"
                placeholder="Search brands..."
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              {searchTerm.length > 0 && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="w-full sm:w-auto bg-gray-500 text-white px-4 py-2.5 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Clear Search
                </button>
              )}
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="w-full sm:w-auto bg-blue-700 text-white px-4 py-2.5 rounded-lg hover:bg-blue-800 transition-colors flex items-center justify-center"
              >
                <FaPlus className="mr-2" /> Add Brand
              </button>
            </div>
          </div>

          {/* Search Results Info */}
          {searchTerm && (
            <div className="w-full md:w-3/4 lg:w-2/3 mx-auto px-2 sm:px-4 mb-4">
              {filteredBrands.length > 0 ? (
                <p className="text-gray-600 text-sm sm:text-base">
                  Found {filteredBrands.length} brand(s) matching: {searchTerm}
                </p>
              ) : (
                <p className="text-gray-600 text-sm sm:text-base">
                  No brands found matching: {searchTerm}
                </p>
              )}
            </div>
          )}

          {/* Brands Table */}
          <div className="overflow-x-auto w-full md:w-3/4 lg:w-2/3 mx-auto px-2 sm:px-4">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Brand Name
                    </th>
                    <th className="px-4 py-3 text-right text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentBrands.map((brand) => (
                    <tr key={brand.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm sm:text-base text-gray-900">
                        {brand.name}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end items-center gap-2 sm:gap-4">
                          <button
                            onClick={() => handleViewItems(brand.name)}
                            className="inline-flex items-center px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium text-white bg-blue-400 rounded hover:bg-blue-600 transition-colors"
                          >
                            <FaList className="mr-1 hidden sm:block" />
                            <span>View Items</span>
                          </button>
                          <button
                            onClick={() => {
                              setEditingBrand(brand);
                              setNewBrandName(brand.name);
                              setIsEditModalOpen(true);
                            }}
                            className="p-1.5 text-blue-600 hover:text-blue-800 transition-colors"
                            title="Edit"
                          >
                            <FaEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(brand.id)}
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

            {/* Pagination */}
            {(filteredBrands.length > 0 || (!searchTerm && brands.length > 0)) && totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1.5 rounded-lg text-sm ${
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
                        className={`px-3 py-1.5 rounded-lg text-sm ${
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
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1.5 rounded-lg text-sm ${
                    currentPage === totalPages
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="w-full md:w-3/4 lg:w-2/3 mx-auto px-4 text-center py-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <p className="text-gray-600 text-base sm:text-lg mb-4">
              {searchTerm
                ? "No brands found matching your search."
                : "No brands available at the moment."}
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm sm:text-base"
            >
              <FaPlus className="mr-2" /> Add Your First Brand
            </button>
          </div>
        </div>
      )}

      {/* Add Brand Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Brand</h2>
            <input
              type="text"
              value={newBrandName}
              onChange={(e) => {
                setNewBrandName(e.target.value);
                setInputError(false);
              }}
              className={`w-full border p-2.5 rounded-lg mb-1 focus:ring-2 focus:ring-blue-500 ${
                inputError ? 'border-red-500' : ''
              }`}
              placeholder="Enter brand name"
            />
            {inputError && (
              <p className="text-red-500 text-sm mb-3">Please enter a brand name</p>
            )}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setNewBrandName("");
                  setInputError(false);
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleAddBrand}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Brand Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Brand</h2>
            <input
              type="text"
              value={newBrandName}
              onChange={(e) => {
                setNewBrandName(e.target.value);
                setInputError(false);
              }}
              className={`w-full border p-2.5 rounded-lg mb-1 focus:ring-2 focus:ring-blue-500 ${
                inputError ? 'border-red-500' : ''
              }`}
              placeholder="Enter new brand name"
            />
            {inputError && (
              <p className="text-red-500 text-sm mb-3">Please enter a brand name</p>
            )}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setNewBrandName("");
                  setEditingBrand(null);
                  setInputError(false);
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleEditBrand}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Brand;
