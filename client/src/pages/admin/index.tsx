import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getDashboardStats, 
  getRecentUsers, 
  getRecentOrders,
  type DashboardStats,
  type RecentUser,
  type RecentOrder
} from '../../api/admin';
import Loading from '../../components/ui/loading';
import Navbar from '../../components/navbar';

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsData, usersData, ordersData] = await Promise.all([
          getDashboardStats(),
          getRecentUsers(5),
          getRecentOrders(5),
        ]);
        setStats(statsData);
        setRecentUsers(usersData);
        setRecentOrders(ordersData);
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  // const formatDate = (dateString: string) => {
  //   return new Date(dateString).toLocaleDateString('vi-VN', {
  //     day: '2-digit',
  //     month: '2-digit',
  //     year: 'numeric',
  //     hour: '2-digit',
  //     minute: '2-digit'
  //   });
  // };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      pending: 'badge-warning badge-lg',
      confirmed: 'badge-info badge-lg',
      delivered: 'badge-success badge-lg',
      cancelled: 'badge-error badge-lg',
    };
    const labels: Record<string, string> = {
      pending: 'Chờ xử lý',
      confirmed: 'Đã xác nhận',
      delivered: 'Đã giao',
      cancelled: 'Đã hủy',
    };
    return (
      <span className={`badge ${badges[status] || 'badge-ghost badge-lg'}`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Section - Matching homepage style */}
        <div className="bg-linear-to-r from-primary-600 to-secondary-600 rounded-3xl p-8 shadow-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-3">Dashboard Quản Trị</h1>
          <p className="text-xl text-gray-600 opacity-90">Tổng quan hoạt động hệ thống</p>
        </div>

        {/* Stats Cards - Larger and more prominent */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Stat 1 - Users */}
          <div 
            onClick={() => navigate('/admin/users')}
            className="bg-linear-to-br from-primary-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 text-primary-100"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h3 className="text-gray-600 text-lg font-medium mb-2">Người dùng</h3>
            <p className="text-4xl font-bold text-primary mb-1">{stats?.totalUsers || 0}</p>
            <p className="text-sm text-gray-500">Tổng số người dùng</p>
          </div>

          {/* Stat 2 - Menus */}
          <div 
            onClick={() => navigate('/admin/menu')}
            className="bg-linear-to-br from-secondary-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 text-secondary-100"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <svg className="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h3 className="text-gray-600 text-lg font-medium mb-2">Món ăn</h3>
            <p className="text-4xl font-bold text-secondary mb-1">{stats?.totalMenus || 0}</p>
            <p className="text-sm text-gray-500">Tổng số món trong menu</p>
          </div>

          {/* Stat 3 - Categories */}
          <div 
            onClick={() => navigate('/admin/category')}
            className="bg-gradient-to-br from-orange-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 text-orange-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
              </div>
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h3 className="text-gray-600 text-lg font-medium mb-2">Danh mục</h3>
            <p className="text-4xl font-bold text-orange-600 mb-1">{stats?.totalCategories || 0}</p>
            <p className="text-sm text-gray-500">Tổng số danh mục</p>
          </div>

          {/* Stat 4 - Orders */}
          <div 
            onClick={() => navigate('/admin/review')}
            className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h3 className="text-gray-600 text-lg font-medium mb-2">Đánh giá</h3>
            <p className="text-4xl font-bold text-green-600 mb-1">{stats?.totalOrders || 0}</p>
            <p className="text-sm text-gray-500">Tổng số đánh giá</p>
          </div>
        </div>

        {/* Tables Grid - Larger spacing and better design */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Users Table */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 px-8 py-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary-100"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Người dùng mới nhất</h2>
                  <p className="text-sm text-gray-600">{recentUsers.length} người dùng gần đây</p>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto" style={{ maxHeight: '400px' }}>
              <table className="table w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="text-base font-semibold text-gray-700 py-4">STT</th>
                    <th className="text-base font-semibold text-gray-700 py-4">Tên</th>
                    <th className="text-base font-semibold text-gray-700 py-4">Email</th>
                    <th className="text-base font-semibold text-gray-700 py-4">Vai trò</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.length > 0 ? (
                    recentUsers.map((user, index) => (
                      <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4">
                          <span className="font-semibold text-gray-700">{index + 1}</span>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                              <span className="text-primary font-semibold text-lg">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="font-medium text-gray-900">{user.name}</span>
                          </div>
                        </td>
                        <td className="py-4 text-gray-600">{user.email}</td>
                        <td className="py-4">
                          <span className={`badge badge-lg ${user.role === 'adm' ? 'badge-primary' : 'badge-ghost'}`}>
                            {user.role === 'adm' ? 'Admin' : 'Khách'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center text-gray-500 py-12">
                        <div className="flex flex-col items-center space-y-2">
                          <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
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

          {/* Recent Orders Table */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 px-8 py-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-orange-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Đơn hàng gần đây</h2>
                  <p className="text-sm text-gray-600">{recentOrders.length} đơn hàng mới nhất</p>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto" style={{ maxHeight: '400px' }}>
              <table className="table w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="text-base font-semibold text-gray-700 py-4">STT</th>
                    <th className="text-base font-semibold text-gray-700 py-4">Khách hàng</th>
                    <th className="text-base font-semibold text-gray-700 py-4">Tổng tiền</th>
                    <th className="text-base font-semibold text-gray-700 py-4">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length > 0 ? (
                    recentOrders.map((order, index) => (
                      <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4">
                          <span className="font-semibold text-gray-700">{index + 1}</span>
                        </td>
                        <td className="py-4">
                          <div className="font-medium text-gray-900">{order.user?.name || 'N/A'}</div>
                          <div className="text-sm text-gray-500 flex items-center space-x-1 mt-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <span>{order.items?.length || 0} món</span>
                          </div>
                        </td>
                        <td className="py-4 font-bold text-lg text-primary-600">
                          {formatCurrency(order.total)}
                        </td>
                        <td className="py-4">{getStatusBadge(order.status)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center text-gray-500 py-12">
                        <div className="flex flex-col items-center space-y-2">
                          <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                          <p className="text-lg font-medium">Chưa có đơn hàng nào</p>
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
    </div>
  );
}

export default AdminDashboard;
