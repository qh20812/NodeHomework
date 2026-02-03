import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllCategories, deleteCategory, type Category } from '../../../api/category';
import { useAlert } from '../../../contexts/AlertContext';
import Navbar from '../../../components/navbar';
import Loading from '../../../components/ui/loading';
import Button from '../../../components/ui/button';

function CategoryDashboard() {
  const navigate = useNavigate();
  const { confirm, showSuccess, showError } = useAlert();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = await confirm('Bạn có chắc chắn muốn xóa danh mục này?');
    if (!confirmed) return;
    
    try {
      setDeleteId(id);
      await deleteCategory(id);
      showSuccess('Xóa danh mục thành công!');
      await fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      showError('Không thể xóa danh mục. Vui lòng thử lại!');
    } finally {
      setDeleteId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-yellow-600 rounded-3xl p-8 shadow-2xl mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Quản lý Danh mục</h1>
              <p className="text-xl text-white opacity-90">Quản lý các danh mục món ăn</p>
            </div>
            <Link to="/admin/category/create">
              <Button variant="primary" size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Thêm danh mục
              </Button>
            </Link>
          </div>
        </div>

        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại Dashboard
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-gradient-to-r from-orange-50 to-yellow-50">
                <tr>
                  <th className="text-base font-semibold text-gray-700 py-4">STT</th>
                  <th className="text-base font-semibold text-gray-700 py-4">Tên danh mục</th>
                  <th className="text-base font-semibold text-gray-700 py-4">Mô tả</th>
                  <th className="text-base font-semibold text-gray-700 py-4">Ngày tạo</th>
                  <th className="text-base font-semibold text-gray-700 py-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {categories.length > 0 ? (
                  categories.map((category, index) => (
                    <tr key={category._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4">
                        <span className="font-semibold text-gray-700">{index + 1}</span>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                            </svg>
                          </div>
                          <span className="font-medium text-gray-900">{category.name}</span>
                        </div>
                      </td>
                      <td className="py-4 text-gray-600">
                        {category.description || <span className="text-gray-400 italic">Không có mô tả</span>}
                      </td>
                      <td className="py-4 text-gray-600">{formatDate(category.createdAt)}</td>
                      <td className="py-4">
                        <div className="flex items-center justify-center space-x-2">
                          <Link to={`/admin/category/edit/${category._id}`}>
                            <button className="btn btn-sm btn-primary">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(category._id)}
                            disabled={deleteId === category._id}
                            className="btn btn-sm btn-error"
                          >
                            {deleteId === category._id ? (
                              <span className="loading loading-spinner loading-xs"></span>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center text-gray-500 py-12">
                      <div className="flex flex-col items-center space-y-3">
                        <svg className="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                        <p className="text-lg font-medium">Chưa có danh mục nào</p>
                        <Link to="/admin/category/create">
                          <Button variant="primary">Tạo danh mục đầu tiên</Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryDashboard;
