import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserById, type User } from '../../../api/users';
import { useAlert } from '../../../contexts/AlertContext';
import Navbar from '../../../components/navbar';
import Loading from '../../../components/ui/loading';
import Button from '../../../components/ui/button';

function UserShow() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showError } = useAlert();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      
      try {
        const data = await getUserById(id);
        setUser(data);
      } catch (error) {
        console.error('Error loading user:', error);
        showError('Không thể tải thông tin người dùng. Vui lòng thử lại!');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, showError]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRoleInfo = (role: string) => {
    if (role === 'adm') {
      return {
        label: 'Quản trị viên',
        badge: 'badge-error',
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        ),
      };
    }
    return {
      label: 'Khách hàng',
      badge: 'badge-info',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    };
  };

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <p className="text-lg text-gray-500">Không tìm thấy người dùng</p>
            <Button variant="primary" className="mt-4" onClick={() => navigate('/admin/users')}>
              Quay lại danh sách
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const roleInfo = getRoleInfo(user.role);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-primary rounded-3xl p-8 shadow-2xl mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Chi tiết Người dùng</h1>
          <p className="text-xl text-white opacity-90">Thông tin chi tiết tài khoản</p>
        </div>

        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/admin/users')}
            className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại danh sách
          </button>
        </div>

        {/* User Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-secondary-100 to-primary-100 p-8">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                <span className="text-primary font-bold text-4xl">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h2>
                <div className="flex items-center space-x-2">
                  <span className={`badge ${roleInfo.badge} badge-lg`}>{roleInfo.label}</span>
                </div>
              </div>
              <div className="text-primary-600">
                {roleInfo.icon}
              </div>
            </div>
          </div>

          {/* User Details */}
          <div className="p-8 space-y-6">
            {/* Contact Information */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Thông tin liên hệ
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p className="font-semibold text-gray-900">{user.email}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Số điện thoại</p>
                  <p className="font-semibold text-gray-900">{user.phone}</p>
                </div>
              </div>
            </div>

            {/* Address */}
            {user.address && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Địa chỉ
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-900">{user.address}</p>
                </div>
              </div>
            )}

            {/* Account Information */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Thông tin tài khoản
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">ID</p>
                  <p className="font-mono text-sm text-gray-900">{user._id}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Vai trò</p>
                  <span className={`badge ${roleInfo.badge}`}>{roleInfo.label}</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Ngày tạo</p>
                  <p className="font-semibold text-gray-900">{formatDate(user.createdAt)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Cập nhật lần cuối</p>
                  <p className="font-semibold text-gray-900">{formatDate(user.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserShow;