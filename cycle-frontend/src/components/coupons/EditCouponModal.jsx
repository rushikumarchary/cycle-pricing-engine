import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

function EditCouponModal({ show, onClose, onSubmit, formData, setFormData }) {
  const { t } = useTranslation();

  if (!show) return null;

  const handlePercentageChange = (e) => {
    const value = e.target.value;
    // Allow empty value for better UX while typing
    if (value === '') {
      setFormData({ ...formData, percentage: 0 });
      return;
    }
    
    // Convert to number and validate
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 100) {
      // Store as number to match API format
      setFormData({ ...formData, percentage: numValue });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">{t('Edit Coupon')}</h2>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {t('Coupon Code')}
            </label>
            <input
              type="text"
              value={formData.couponCode}
              onChange={(e) => setFormData({ ...formData, couponCode: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#28544B]"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {t('Percentage')} (1-100)
            </label>
            <input
              type="number"
              value={formData.percentage || ''}
              onChange={handlePercentageChange}
              min="1"
              max="100"
              step="any"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#28544B]"
              required
              placeholder="Enter value between 1 and 100"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {t('Status')}
            </label>
            <select
              value={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#28544B]"
            >
              <option value="Y">{t('Active')}</option>
              <option value="N">{t('Inactive')}</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              {t('Cancel')}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#28544B] text-white rounded-lg hover:bg-[#1a3d36]"
            >
              {t('Update')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

EditCouponModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  formData: PropTypes.shape({
    couponCode: PropTypes.string.isRequired,
    percentage: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]).isRequired,
    isActive: PropTypes.string.isRequired
  }).isRequired,
  setFormData: PropTypes.func.isRequired
};

export default EditCouponModal; 