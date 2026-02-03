import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllUsers, deleteUser, type User } from '../../../api/users';
import { useAlert } from '../../../contexts/AlertContext';
import Navbar from '../../../components/navbar';
import Loading from '../../../components/ui/loading';
// import Button from '../../../components/ui/button';

function UserIndex() {
  const navigate = useNavigate();
  const { confirm, showSuccess, showError } = useAlert();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = await confirm('Bạn có chắc chắn muốn xóa người dùng này?');
    if (!confirmed) return;
    
    try {
      setDeleteId(id);
      await deleteUser(id);
      showSuccess('Xóa người dùng thành công!');
      await fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      showError('Không thể xóa người dùng. Vui lòng thử lại!');
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

  const getRoleBadge = (role: string) => {
    if (role === 'adm') {
      return <span className="badge badge-error">Admin</span>;
    }
    return <span className="badge badge-info">Khách</span>;
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-primary rounded-3xl p-8 shadow-2xl mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Quản lý Người dùng</h1>
              <p className="text-xl text-white opacity-90">Quản lý tài khoản người dùng hệ thống</p>
            </div>
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
                  <th className="text-base font-semibold text-gray-700 py-4">Tên</th>
                  <th className="text-base font-semibold text-gray-700 py-4">Email</th>
                  <th className="text-base font-semibold text-gray-700 py-4">Số điện thoại</th>
                  <th className="text-base font-semibold text-gray-700 py-4">Vai trò</th>
                  <th className="text-base font-semibold text-gray-700 py-4">Ngày tạo</th>
                  <th className="text-base font-semibold text-gray-700 py-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user, index) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4">
                        <span className="font-semibold text-gray-700">{index + 1}</span>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-primary font-bold text-lg">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{user.name}</div>
                            {user.address && (
                              <div className="text-sm text-gray-500 line-clamp-1">{user.address}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-gray-600">{user.email}</td>
                      <td className="py-4 text-gray-600">{user.phone}</td>
                      <td className="py-4">{getRoleBadge(user.role)}</td>
                      <td className="py-4 text-gray-600">{formatDate(user.createdAt)}</td>
                      <td className="py-4">
                        <div className="flex items-center justify-center space-x-2">
                          <Link to={`/admin/users/${user._id}`}>
                            <button className="btn btn-sm btn-info">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(user._id)}
                            disabled={deleteId === user._id}
                            className="btn btn-sm btn-error"
                          >
                            {deleteId === user._id ? (
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
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <p className="text-lg font-medium">Chưa có người dùng nào</p>
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

export default UserIndex;