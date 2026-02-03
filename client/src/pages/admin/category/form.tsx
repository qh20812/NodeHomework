import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createCategory, updateCategory, getCategoryById, type CreateCategoryDto } from '../../../api/category';
import { useAlert } from '../../../contexts/AlertContext';
import Navbar from '../../../components/navbar';
import Button from '../../../components/ui/button';

function CategoryForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { showSuccess, showError } = useAlert();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<CreateCategoryDto>({
    name: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});

  useEffect(() => {
    if (isEditMode && id) {
      fetchCategory();
    }
  }, [id, isEditMode]);

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const data = await getCategoryById(id!);
      setFormData({
        name: data.name,
        description: data.description || '',
      });
    } catch (error) {
      console.error('Error loading category:', error);
      showError('Không thể tải thông tin danh mục!');
      navigate('/admin/category');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: { name?: string; description?: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên danh mục không được để trống';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Tên danh mục phải có ít nhất 2 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      if (isEditMode && id) {
        await updateCategory(id, formData);
        showSuccess('Cập nhật danh mục thành công!');
      } else {
        await createCategory(formData);
        showSuccess('Tạo danh mục thành công!');
      }
      navigate('/admin/category');
    } catch (error: any) {
      console.error('Error saving category:', error);
      if (error.response?.data?.message) {
        showError(`Lỗi: ${error.response.data.message}`);
      } else {
        showError('Không thể lưu danh mục. Vui lòng thử lại!');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-yellow-600 rounded-3xl p-8 shadow-2xl mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            {isEditMode ? 'Chỉnh sửa Danh mục' : 'Thêm Danh mục mới'}
          </h1>
          <p className="text-xl text-white opacity-90">
            {isEditMode ? 'Cập nhật thông tin danh mục' : 'Tạo danh mục món ăn mới'}
          </p>
        </div>

        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/admin/category')}
            className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại danh sách
          </button>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base font-semibold text-gray-700">
                  Tên danh mục <span className="text-red-500">*</span>
                </span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ví dụ: Món chính, Món tráng miệng..."
                className={`input input-bordered w-full text-lg ${errors.name ? 'input-error' : ''}`}
                disabled={loading}
              />
              {errors.name && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.name}</span>
                </label>
              )}
            </div>

            {/* Description Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base font-semibold text-gray-700">
                  Mô tả
                </span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Mô tả về danh mục này..."
                className="textarea textarea-bordered w-full text-lg h-32"
                disabled={loading}
              />
              {errors.description && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.description}</span>
                </label>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate('/admin/category')}
                className="btn btn-primary btn-lg"
                disabled={loading}
              >
                Hủy
              </button>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={loading}
                className="min-w-[150px]"
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm mr-2"></span>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {isEditMode ? 'Cập nhật' : 'Tạo mới'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Lưu ý:</strong> Tên danh mục sẽ được hiển thị trong menu cho khách hàng. 
                Hãy đặt tên rõ ràng và dễ hiểu.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryForm;
