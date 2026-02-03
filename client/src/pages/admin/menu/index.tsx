import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllMenus, deleteMenu, type Menu } from '../../../api/menu';
import { useAlert } from '../../../contexts/AlertContext';
import Navbar from '../../../components/navbar';
import Loading from '../../../components/ui/loading';
import Button from '../../../components/ui/button';

function MenuDashboard() {
  const navigate = useNavigate();
  const { confirm, showSuccess, showError } = useAlert();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchMenus = async () => {
    try {
      setLoading(true);
      const data = await getAllMenus();
      setMenus(data);
    } catch (error) {
      console.error('Error loading menus:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = await confirm('Bạn có chắc chắn muốn xóa món ăn này?');
    if (!confirmed) return;
    
    try {
      setDeleteId(id);
      await deleteMenu(id);
      showSuccess('Xóa món ăn thành công!');
      await fetchMenus();
    } catch (error) {
      console.error('Error deleting menu:', error);
      showError('Không thể xóa món ăn. Vui lòng thử lại!');
    } finally {
      setDeleteId(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
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
        <div className="bg-linear-to-r from-secondary to-primary rounded-3xl p-8 shadow-2xl mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Quản lý Món ăn</h1>
              <p className="text-xl text-white opacity-90">Quản lý thực đơn món ăn</p>
            </div>
            <Link to="/admin/menu/create">
              <Button variant="primary" size="lg" className="bg-orange-500 text-secondary-600 hover:bg-gray-100">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Thêm món ăn
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
              <thead className="bg-gradient-to-r from-secondary-50 to-primary-50">
                <tr>
                  <th className="text-base font-semibold text-gray-700 py-4">STT</th>
                  <th className="text-base font-semibold text-gray-700 py-4">Tên món</th>
                  <th className="text-base font-semibold text-gray-700 py-4">Danh mục</th>
                  <th className="text-base font-semibold text-gray-700 py-4">Giá</th>
                  <th className="text-base font-semibold text-gray-700 py-4">Trạng thái</th>
                  <th className="text-base font-semibold text-gray-700 py-4">Ngày tạo</th>
                  <th className="text-base font-semibold text-gray-700 py-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {menus.length > 0 ? (
                  menus.map((menu, index) => (
                    <tr key={menu._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4">
                        <span className="font-semibold text-gray-700">{index + 1}</span>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-20 h-20 bg-secondary-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                            {menu.image ? (
                              <img src={menu.image} alt={menu.name} className="w-full h-full object-cover" />
                            ) : (
                              <svg className="w-8 h-8 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{menu.name}</div>
                            {menu.description && (
                              <div className="text-sm text-gray-500 line-clamp-1">{menu.description}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="badge badge-outline badge-secondary">
                          {menu.category?.name || 'Chưa phân loại'}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className="font-bold text-primary">{formatCurrency(menu.price)}</span>
                      </td>
                      <td className="py-4">
                        <span className={`badge ${menu.available ? 'badge-success' : 'badge-error'}`}>
                          {menu.available ? 'Còn' : 'Hết'}
                        </span>
                      </td>
                      <td className="py-4 text-gray-600">{formatDate(menu.createdAt)}</td>
                      <td className="py-4">
                        <div className="flex items-center justify-center space-x-2">
                          <Link to={`/admin/menu/edit/${menu._id}`}>
                            <button className="btn btn-sm btn-primary">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(menu._id)}
                            disabled={deleteId === menu._id}
                            className="btn btn-sm btn-error"
                          >
                            {deleteId === menu._id ? (
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
                    <td colSpan={7} className="text-center text-gray-500 py-12">
                      <div className="flex flex-col items-center space-y-3">
                        <svg className="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <p className="text-lg font-medium">Chưa có món ăn nào</p>
                        <Link to="/admin/menu/create">
                          <Button variant="primary">Tạo món ăn đầu tiên</Button>
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

export default MenuDashboard;
