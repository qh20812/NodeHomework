
import { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { me, logout, getToken } from '../api/auth'
import Button from './ui/button' 

interface User {
  _id: string
  name: string
  email: string
  role: 'cus' | 'adm'
}

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState<User | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  }

  const getNavLinkClass = (path: string) => {
    const baseClass = 'font-medium transition-colors';
    return isActive(path)
      ? `${baseClass} text-primary border-b-2 border-primary-600 pb-1`
      : `${baseClass} text-gray-700 hover:text-primary-600`;
  }

  useEffect(() => {
    const fetchUser = async () => {
      const token = getToken()
      if (token) {
        try {
          const userData = await me()
          setUser(userData)
        } catch {
          localStorage.removeItem('access_token')
        }
      }
    }
    fetchUser()
  }, [])

  const handleLogout = () => {
    logout()
    setUser(null)
    setIsUserMenuOpen(false)
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900">K24WD-03</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={getNavLinkClass('/')}>
              Trang chủ
            </Link>
            <Link to="/menu" className={getNavLinkClass('/menu')}>
              Thực đơn
            </Link>
            <Link to="/category" className={getNavLinkClass('/category')}>
              Danh mục
            </Link>
            {user?.role === 'adm' && (
              <Link to="/admin" className={getNavLinkClass('/admin')}>
                Quản lý
              </Link>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {/* Cart Icon */}
                <button className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    0
                  </span>
                </button>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-gray-700 font-medium">{user.name}</span>
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Thông tin cá nhân
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Đơn hàng của tôi
                      </Link>
                      <hr className="my-2" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="ghost" className="px-4 py-2">Đăng nhập</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" className="px-4 py-2">Đăng ký</Button>
                </Link>
              </div>
            )} 
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-3">
            <Link
              to="/"
              className={`block font-medium transition-colors py-2 px-3 rounded-lg ${
                isActive('/') 
                  ? 'bg-primary-50 text-primary-600 font-semibold' 
                  : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Trang chủ
            </Link>
            <Link
              to="/menu"
              className={`block font-medium transition-colors py-2 px-3 rounded-lg ${
                isActive('/menu') 
                  ? 'bg-primary-50 text-primary-600 font-semibold' 
                  : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Thực đơn
            </Link>
            <Link
              to="/category"
              className={`block font-medium transition-colors py-2 px-3 rounded-lg ${
                isActive('/category') 
                  ? 'bg-primary-50 text-primary-600 font-semibold' 
                  : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Danh mục
            </Link>
            {user?.role === 'adm' && (
              <Link
                to="/admin"
                className={`block font-medium transition-colors py-2 px-3 rounded-lg ${
                  isActive('/admin') 
                    ? 'bg-primary-50 text-primary-600 font-semibold' 
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Quản lý
              </Link>
            )}
            <hr className="my-2" />
            {user ? (
              <>
                <div className="flex items-center space-x-2 py-2">
                  <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center">
                    <span className="text-secondary-600 font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-gray-700 font-medium">{user.name}</span>
                </div>
                <Link
                  to="/profile"
                  className="block text-gray-700 hover:text-primary-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Thông tin cá nhân
                </Link>
                <Link
                  to="/orders"
                  className="block text-gray-700 hover:text-primary-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Đơn hàng của tôi
                </Link>
                <button
                  onClick={() => {
                    handleLogout()
                    setIsMenuOpen(false)
                  }}
                  className="block w-full text-left text-red-600 hover:text-red-700"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full text-left">Đăng nhập</Button>
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="primary" className="w-full">Đăng ký</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar