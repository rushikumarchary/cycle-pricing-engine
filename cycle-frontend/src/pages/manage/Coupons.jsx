import { useState, useEffect } from 'react';
import { couponAPI } from '../../utils/api';
import { FiPlus, FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight, FiChevronLeft, FiChevronRight, FiSearch } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../../utils/auth';
import Swal from 'sweetalert2';
import AddCouponModal from '../../components/coupons/AddCouponModal';
import EditCouponModal from '../../components/coupons/EditCouponModal';

function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    couponCode: '',
    percentage: 0,
    isActive: 'Y'
  });
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const ITEMS_PER_PAGE = 6;

  // Filter coupons based on status and search term
  const getFilteredCoupons = () => {
    return coupons.filter(coupon => {
      const matchesStatus = statusFilter === 'all' || coupon.isActive === statusFilter;
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === '' || 
        coupon.couponCode.toLowerCase().includes(searchLower) || 
        coupon.percentage.toString().includes(searchTerm);
      return matchesStatus && matchesSearch;
    });
  };

  const filteredCoupons = getFilteredCoupons();
  const totalPages = Math.ceil(filteredCoupons.length / ITEMS_PER_PAGE);
  
  // Get current coupons for pagination
  const getCurrentCoupons = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredCoupons.slice(startIndex, endIndex);
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchTerm]);

  // Add authentication check
  useEffect(() => {
    const checkAuth = () => {
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

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const data = await couponAPI.getAllCoupons();
      setCoupons(data);
      setIsLoading(false);
    } catch (error) {
      toast.error(error.response?.data || 'Failed to fetch coupons');
      setIsLoading(false);
    }
  };

  const handleAddCoupon = async (e) => {
    e.preventDefault();
    try {
      await couponAPI.addCoupon(parseFloat(formData.percentage), formData.couponCode);
      toast.success('Coupon added successfully');
      setShowAddModal(false);
      setFormData({ couponCode: '', percentage: 0, isActive: 'Y' });
      fetchCoupons();
    } catch (error) {
      toast.error(error.response?.data || 'Failed to add coupon');
    }
  };

  const handleUpdateStatus = async (id) => {
    try {
      await couponAPI.updateStatus(id);
      toast.success('Coupon status updated successfully');
      fetchCoupons();
    } catch (error) {
      toast.error(error.response?.data || 'Failed to update coupon status');
    }
  };

  const handleUpdateCoupon = async (e) => {
    e.preventDefault();
    try {
      await couponAPI.updateCoupon({
        couponId: selectedCoupon.couponId,
        couponCode: formData.couponCode,
        percentage: parseFloat(formData.percentage),
        isActive: formData.isActive
      });
      toast.success('Coupon updated successfully');
      setShowEditModal(false);
      setFormData({ couponCode: '', percentage: 0, isActive: 'Y' });
      fetchCoupons();
    } catch (error) {
      toast.error(error.response?.data || 'Failed to update coupon');
    }
  };

  const handleDeleteCoupon = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#28544B',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await couponAPI.deleteCoupon(id);
        toast.success('Coupon deleted successfully');
        fetchCoupons();
      } catch (error) {
        toast.error(error.response?.data || 'Failed to delete coupon');
      }
    }
  };

  const openEditModal = (coupon) => {
    setSelectedCoupon(coupon);
    setFormData({
      couponCode: coupon.couponCode,
      percentage: coupon.percentage,
      isActive: coupon.isActive
    });
    setShowEditModal(true);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="container mx-auto px-4 sm:px-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 mb-6">
        {/* Title and Filters Container */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-6">
          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-800 mb-4 lg:mb-0 whitespace-nowrap">{t('Manage Coupons')}</h1>
          
          {/* Filters Section */}
          <div className="flex flex-col md:flex-col lg:flex-row gap-4 lg:items-center">
            {/* Status Dropdown */}
            <div className="w-full lg:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#28544B] bg-white"
              >
                <option value="all">All Status</option>
                <option value="Y">Active</option>
                <option value="N">Inactive</option>
              </select>
            </div>

            {/* Search Box */}
            <div className="w-full lg:w-[300px] relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by coupon code or percentage..."
                className="w-full pl-10 pr-20 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#28544B]"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#1f2937] text-white px-4 py-1 rounded text-sm hover:bg-[#374151] transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Add Coupon Button */}
            <button
              onClick={() => {
                setFormData({ couponCode: '', percentage: '', isActive: 'Y' });
                setShowAddModal(true);
              }}
              className="whitespace-nowrap bg-[#28544B] text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-[#1a3d36] transition-colors lg:ml-auto"
            >
              <FiPlus className="text-xl" /> {t('Add Coupon')}
            </button>
          </div>
        </div>
      </div>

      {/* Coupons Table - Desktop */}
      <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('Coupon Code')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('Percentage')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('Status')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('Actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {getCurrentCoupons().map((coupon) => (
              <tr key={coupon.couponId}>
                <td className="px-6 py-4 whitespace-nowrap">{coupon.couponCode}</td>
                <td className="px-6 py-4 whitespace-nowrap">{coupon.percentage}%</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleUpdateStatus(coupon.couponId)}
                    className={`flex items-center gap-2 ${
                      coupon.isActive === 'Y' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {coupon.isActive === 'Y' ? 
                      <FiToggleRight className="text-3xl" /> : 
                      <FiToggleLeft className="text-3xl" />
                    }
                    <span className="text-sm">{coupon.isActive === 'Y' ? 'Active' : 'Inactive'}</span>
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => openEditModal(coupon)}
                      className="text-blue-600 hover:text-blue-800 transform hover:scale-110 transition-all duration-200"
                    >
                      <FiEdit2 className="text-xl" />
                    </button>
                    <button
                      onClick={() => handleDeleteCoupon(coupon.couponId)}
                      className="text-red-600 hover:text-red-800 transform hover:scale-110 transition-all duration-200"
                    >
                      <FiTrash2 className="text-xl" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Coupons Cards - Mobile */}
      <div className="md:hidden space-y-4">
        {getCurrentCoupons().map((coupon) => (
          <div key={coupon.couponId} className="bg-white rounded-lg shadow p-4">
            {/* Coupon Information */}
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-500 font-medium">{t('Coupon Code')}</label>
                <span className="text-base font-semibold text-gray-800">{coupon.couponCode}</span>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-500 font-medium">{t('Percentage')}</label>
                <span className="text-base font-semibold text-gray-800">{coupon.percentage}%</span>
              </div>
            </div>

            {/* Status Button */}
            <button
              onClick={() => handleUpdateStatus(coupon.couponId)}
              className={`w-full mb-2 flex items-center justify-center gap-2 py-2 px-4 rounded-lg ${
                coupon.isActive === 'Y' 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-red-100 text-red-600'
              }`}
            >
              {coupon.isActive === 'Y' ? 
                <FiToggleRight className="text-2xl" /> : 
                <FiToggleLeft className="text-2xl" />
              }
              <span>{coupon.isActive === 'Y' ? 'Active' : 'Inactive'}</span>
            </button>

            {/* Edit and Delete Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => openEditModal(coupon)}
                className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transform hover:scale-105 transition-all duration-200 active:scale-95"
              >
                <FiEdit2 className="text-lg" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDeleteCoupon(coupon.couponId)}
                className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600 transform hover:scale-105 transition-all duration-200 active:scale-95"
              >
                <FiTrash2 className="text-lg" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 gap-2 flex-wrap">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 rounded-lg ${
              currentPage === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-[#28544B] hover:bg-[#28544B] hover:text-white'
            }`}
          >
            <FiChevronLeft className="text-xl" />
          </button>
          
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 rounded-lg ${
                currentPage === index + 1
                  ? 'bg-[#28544B] text-white'
                  : 'text-[#28544B] hover:bg-[#28544B] hover:text-white'
              }`}
            >
              {index + 1}
            </button>
          ))}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-lg ${
              currentPage === totalPages
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-[#28544B] hover:bg-[#28544B] hover:text-white'
            }`}
          >
            <FiChevronRight className="text-xl" />
          </button>
        </div>
      )}

      {/* Add Coupon Modal */}
      <AddCouponModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddCoupon}
        formData={formData}
        setFormData={setFormData}
      />

      {/* Edit Coupon Modal */}
      <EditCouponModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleUpdateCoupon}
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  );
}

export default Coupons;
