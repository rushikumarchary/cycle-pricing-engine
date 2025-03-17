import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaList,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const api = axios.create({
  baseURL: "http://localhost:8081/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const Brand = () => {
  const [brands, setBrands] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");
  const [editingBrand, setEditingBrand] = useState(null);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const brandsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch brands
  const fetchBrands = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8081/api/brands/getAllBrands"
      );
      console.log("Fetched brands:", response.data); // Debug log
      setBrands(response.data);

      // Check if the response data is empty
      if (response.data.length === 0) {
        Swal.fire({
          icon: "info",
          title: "No Brands Found",
          text: "There are no brands available. Please add a new brand.",
        });
      }
    } catch (error) {
      setBrands([]); // Clear brands on error
      if (error.code === "ERR_NETWORK") {
        Swal.fire({
          icon: "error",
          title: "Server Error",
          text: "Unable to connect to the server. Please try again later.",
          footer: '<a href="#">Need help?</a>',
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            error.response?.data || "Failed to fetch brands. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

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
      brand.brandName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBrands(filtered);
  }, [searchTerm, brands]);

  // Add brand
  const handleAddBrand = async () => {
    if (!newBrandName.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Brand name cannot be empty",
      });
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8081/api/brands/add/${encodeURIComponent(
          newBrandName
        )}`
      );

      if (response.data) {
        await fetchBrands();
        setIsAddModalOpen(false);
        setNewBrandName("");

        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Brand added successfully",
        });
      } else {
        throw new Error("Failed to add brand");
      }
    } catch (error) {
      console.error("Add brand error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data || "Failed to add brand. Please try again.",
      });
    }
  };

  // Edit brand
  const handleEditBrand = async () => {
    if (!newBrandName.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Brand name cannot be empty",
      });
      return;
    }

    try {
      // Check if editingBrand exists and has an id
      if (!editingBrand?.brandId) {
        console.error("No brand ID found:", editingBrand);
        throw new Error("Brand ID is missing");
      }

      console.log(
        "Updating brand:",
        editingBrand.brandId,
        "with name:",
        newBrandName
      );

      const response = await api.put(
        `/brands/${editingBrand.brandId}`,
        { brandName: newBrandName },
        {
          headers: {
            Authorization: "Basic " + btoa("admin:admin123"),
          },
        }
      );

      console.log("Update response:", response);

      if (response.status === 200) {
        await fetchBrands();
        setIsEditModalOpen(false);
        setNewBrandName("");
        setEditingBrand(null);

        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Success",
          text: response.data || "Brand updated successfully",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error("Update error:", error);

      let errorMessage = "Failed to update brand";
      if (error.response) {
        switch (error.response.status) {
          case 404:
            errorMessage = "Brand not found";
            break;
          case 409:
            errorMessage = "Brand name already exists";
            break;
          default:
            errorMessage = error.response?.data || "Failed to update brand";
        }
      }

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });
    }
  };

  // Modified delete handler
  const handleDelete = (id) => {
    // Validate id before proceeding
    if (!id) {
      console.error("Invalid brand ID:", id);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Invalid brand ID",
      });
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
          console.log("Deleting brand with ID:", id); // Debug log

          const response = await api.delete(`/brands/${id}`, {
            headers: {
              Authorization: "Basic " + btoa("admin:admin123"), // Note: Changed to match case sensitivity
            },
          });

          if (response.status === 200) {
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

            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Deleted!",
              text: response.data,
              showConfirmButton: false,
              timer: 1500,
            });
          }
        } catch (error) {
          console.error("Delete error:", error);
          let errorMessage = "Failed to delete brand";

          if (error.response) {
            switch (error.response.status) {
              case 400:
                errorMessage = "Invalid brand ID";
                break;
              case 404:
                errorMessage = "Brand not found";
                break;
              default:
                errorMessage =
                  error.response?.data?.message || "Failed to delete brand";
            }
          }

          Swal.fire({
            icon: "error",
            title: "Error",
            text: errorMessage,
          });
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
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-white text-center">
            Brand Management
          </h1>
          <p className="text-gray-100 text-center mt-2">
            Manage your product brands efficiently
          </p>
        </div>

        {/* Top Action Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-1/2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search brands..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <FaTimes className="text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-full hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200 shadow-md flex items-center justify-center w-full md:w-auto"
          >
            <FaPlus className="mr-2" /> Add New Brand
          </button>
        </div>

        {/* Search Results Info */}
        {searchTerm && (
          <div className="mb-4 bg-white p-4 rounded-lg shadow-md">
            {filteredBrands.length > 0 ? (
              <p className="text-gray-600 font-medium">
                Found{" "}
                <span className="text-blue-600 font-bold">
                  {filteredBrands.length}
                </span>{" "}
                brand(s) matching: <span className="italic">{searchTerm}</span>
              </p>
            ) : (
              <p className="text-gray-600">
                No brands found matching:{" "}
                <span className="italic">{searchTerm}</span>
              </p>
            )}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-20 bg-white rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : brands.length > 0 ? (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">
                      Brand Name
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentBrands.map((brand, index) => (
                    <tr
                      key={brand.brandId}
                      className={`hover:bg-blue-50 transition-colors duration-150 ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="text-lg font-medium text-gray-900">
                          {brand.brandName}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center items-center gap-4">
                          <button
                            onClick={() => handleViewItems(brand.brandName)}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full hover:from-blue-600 hover:to-blue-700 flex items-center text-sm transform hover:scale-105 transition-all duration-200 shadow-sm"
                          >
                            <FaList className="mr-2" />
                            <span>View Items</span>
                          </button>
                          <button
                            onClick={() => {
                              console.log("Setting editing brand:", brand);
                              setEditingBrand({
                                ...brand,
                                id: brand.brandId, // Map brandId to id for consistency
                              });
                              setNewBrandName(brand.brandName);
                              setIsEditModalOpen(true);
                            }}
                            className="bg-amber-500 text-white p-2 rounded-full hover:bg-amber-600 shadow-sm transform hover:scale-110 transition-all duration-200"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => {
                              if (!brand.brandId) {
                                console.error("No brand ID found:", brand);
                                Swal.fire({
                                  icon: "error",
                                  title: "Error",
                                  text: "Invalid brand ID",
                                });
                                return;
                              }
                              handleDelete(brand.brandId);
                            }}
                            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-sm transform hover:scale-110 transition-all duration-200"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {(filteredBrands.length > 0 ||
              (!searchTerm && brands.length > 0)) &&
              totalPages > 1 && (
                <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-center">
                    <div>
                      <nav
                        className="inline-flex rounded-md shadow-sm -space-x-px"
                        aria-label="Pagination"
                      >
                        <button
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                          disabled={currentPage === 1}
                          className={`relative inline-flex items-center px-3 py-2 rounded-l-md border ${
                            currentPage === 1
                              ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                          }`}
                        >
                          Previous
                        </button>

                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1
                        ).map((pageNum) => (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`relative inline-flex items-center px-4 py-2 border ${
                              currentPage === pageNum
                                ? "bg-blue-600 text-white border-blue-600 font-medium"
                                : "bg-white border-gray-300 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                            }`}
                          >
                            {pageNum}
                          </button>
                        ))}

                        <button
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages)
                            )
                          }
                          disabled={currentPage === totalPages}
                          className={`relative inline-flex items-center px-3 py-2 rounded-r-md border ${
                            currentPage === totalPages
                              ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                          }`}
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-10 text-center">
            <div className="text-gray-400 mb-4">
              <svg
                className="mx-auto h-16 w-16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <p className="text-gray-600 text-lg mb-6">
              {searchTerm
                ? "No brands found matching your search."
                : "No brands available at the moment."}
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200 shadow-md flex items-center mx-auto"
            >
              <FaPlus className="mr-2" /> Add Your First Brand
            </button>
          </div>
        )}

        {/* Add Brand Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all">
              <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">
                Add New Brand
              </h2>
              <div className="mb-6">
                <label
                  htmlFor="brandName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Brand Name
                </label>
                <input
                  id="brandName"
                  type="text"
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter brand name"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setNewBrandName("");
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddBrand}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Add Brand
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Brand Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all">
              <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">
                Edit Brand
              </h2>
              <div className="mb-6">
                <label
                  htmlFor="editBrandName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Brand Name
                </label>
                <input
                  id="editBrandName"
                  type="text"
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter new brand name"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setNewBrandName("");
                    setEditingBrand(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditBrand}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Update Brand
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Brand;
