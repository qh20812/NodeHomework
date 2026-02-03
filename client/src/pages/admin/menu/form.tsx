import { useState, useEffect, type FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createMenu, updateMenu, getMenuById, type CreateMenuDto, type UpdateMenuDto } from '../../../api/menu';
import { getAllCategories, type Category } from '../../../api/category';
import { useAlert } from '../../../contexts/AlertContext';
import Navbar from '../../../components/navbar';
import Loading from '../../../components/ui/loading';
import Button from '../../../components/ui/button';
import Input from '../../../components/ui/input';
import ValidateLabel from '../../../components/ui/validate-lable';

function MenuForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useAlert();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<CreateMenuDto | UpdateMenuDto>({
    name: '',
    description: '',
    price: 0,
    image: '',
    category: '',
    available: true,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesData = await getAllCategories();
        setCategories(categoriesData);

        // If edit mode, fetch menu data
        if (id) {
          const menuData = await getMenuById(id);
          setFormData({
            name: menuData.name,
            description: menuData.description || '',
            price: menuData.price,
            image: menuData.image || '',
            category: menuData.category._id,
            available: menuData.available,
          });
        }
      } catch (error) {
        console.error('Error loading data:', error);
        showError('Không thể tải dữ liệu. Vui lòng thử lại!');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchData();
  }, [id, showError]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập tên món ăn';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Tên món ăn phải có ít nhất 3 ký tự';
    }

    if (!formData.category) {
      newErrors.category = 'Vui lòng chọn danh mục';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Giá phải lớn hơn 0';
    }

    if (formData.image && !isValidUrl(formData.image)) {
      newErrors.image = 'URL hình ảnh không hợp lệ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      showError('Vui lòng kiểm tra lại thông tin!');
      return;
    }

    try {
      setLoading(true);

      // Log data trước khi gửi để debug
      console.log('Submitting data:', formData);
      console.log('Is edit mode:', isEditMode, 'ID:', id);

      if (isEditMode && id) {
        await updateMenu(id, formData);
        showSuccess('Cập nhật món ăn thành công!');
      } else {
        await createMenu(formData as CreateMenuDto);
        showSuccess('Thêm món ăn thành công!');
      }

      navigate('/admin/menu');
    } catch (error: any) {
      console.error('Error saving menu:', error);
      console.error('Error response:', error.response?.data);
      const message = error.response?.data?.message || 'Không thể lưu món ăn. Vui lòng thử lại!';
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (initialLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-primary rounded-3xl p-8 shadow-2xl mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            {isEditMode ? 'Chỉnh sửa món ăn' : 'Thêm món ăn mới'}
          </h1>
          <p className="text-xl text-white opacity-90">
            {isEditMode ? 'Cập nhật thông tin món ăn' : 'Tạo món ăn mới cho thực đơn'}
          </p>
        </div>

        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/admin/menu')}
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
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Tên món ăn <span className="text-error">*</span>
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Nhập tên món ăn"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={errors.name ? 'input-error' : ''}
              />
              {errors.name && <ValidateLabel message={errors.name} />}
            </div>

            {/* Category Select */}
            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                Danh mục <span className="text-error">*</span>
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className={`select select-bordered w-full ${errors.category ? 'select-error' : ''}`}
              >
                <option value="">Chọn danh mục</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category && <ValidateLabel message={errors.category} />}
            </div>

            {/* Price Input */}
            <div>
              <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">
                Giá (VNĐ) <span className="text-error">*</span>
              </label>
              <Input
                id="price"
                type="number"
                min="0"
                step="1000"
                placeholder="Nhập giá món ăn"
                value={formData.price}
                onChange={(e) => handleInputChange('price', Number(e.target.value))}
                className={errors.price ? 'input-error' : ''}
              />
              {errors.price && <ValidateLabel message={errors.price} />}
            </div>

            {/* Description Textarea */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                Mô tả
              </label>
              <textarea
                id="description"
                rows={4}
                placeholder="Nhập mô tả món ăn"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="textarea textarea-bordered w-full"
              />
            </div>

            {/* Image URL Input */}
            <div>
              <label htmlFor="image" className="block text-sm font-semibold text-gray-700 mb-2">
                URL hình ảnh
              </label>
              <Input
                id="image"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={formData.image}
                onChange={(e) => handleInputChange('image', e.target.value)}
                className={errors.image ? 'input-error' : ''}
              />
              {errors.image && <ValidateLabel message={errors.image} />}
              {formData.image && !errors.image && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">Xem trước:</p>
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-48 h-32 object-cover rounded-lg border-2 border-gray-200"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      setErrors(prev => ({ ...prev, image: 'Không thể tải hình ảnh' }));
                    }}
                  />
                </div>
              )}
            </div>

            {/* Available Checkbox */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="available"
                checked={formData.available}
                onChange={(e) => handleInputChange('available', e.target.checked)}
                className="checkbox checkbox-primary"
              />
              <label htmlFor="available" className="text-sm font-semibold text-gray-700 cursor-pointer">
                Món ăn còn hàng
              </label>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center space-x-4 pt-6 border-t">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={loading}
                className="flex-1"
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
                    {isEditMode ? 'Cập nhật' : 'Thêm món ăn'}
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={() => navigate('/admin/menu')}
                disabled={loading}
              >
                Hủy
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default MenuForm;
