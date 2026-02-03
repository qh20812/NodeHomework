import { useState, useEffect } from 'react';
import { getAllMenus, type Menu } from '../api/menu';
import { createReview } from '../api/review';
import { createOrder } from '../api/order';
import { useAlert } from '../contexts/AlertContext';
import Navbar from '../components/navbar';
import Loading from '../components/ui/loading';
import Button from '../components/ui/button';

function MenuPage() {
  const { showSuccess, showError } = useAlert();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  
  // Review form state
  const [rating, setRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  
  // Order form state
  const [quantity, setQuantity] = useState(1);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [orderLoading, setOrderLoading] = useState(false);

  useEffect(() => {
    fetchMenus();
  }, []);

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const handleOpenReviewModal = (menu: Menu) => {
    setSelectedMenu(menu);
    setRating(5);
    setReviewTitle('');
    setReviewComment('');
    setShowReviewModal(true);
  };

  const handleOpenOrderModal = (menu: Menu) => {
    setSelectedMenu(menu);
    setQuantity(1);
    setDeliveryAddress('');
    setShowOrderModal(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedMenu) return;

    // Get current user info from localStorage
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      showError('Vui lòng đăng nhập để đánh giá!');
      return;
    }

    const user = JSON.parse(userStr);

    if (!user.id) {
      showError('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại!');
      return;
    }

    try {
      setReviewLoading(true);
      const reviewData = {
        user: user.id,
        item: selectedMenu._id,
        rating,
        title: reviewTitle,
        comment: reviewComment,
      };
      
      await createReview(reviewData);
      showSuccess('Đánh giá món ăn thành công!');
      setShowReviewModal(false);
    } catch (error: any) {
      console.error('Error submitting review:', error);
      console.error('Error response:', error.response?.data);
      const message = error.response?.data?.message || 'Không thể gửi đánh giá. Vui lòng thử lại!';
      showError(message);
    } finally {
      setReviewLoading(false);
    }
  };

  const handleSubmitOrder = async () => {
    if (!selectedMenu) return;

    // Get current user info from localStorage
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      showError('Vui lòng đăng nhập để đặt món!');
      return;
    }

    const user = JSON.parse(userStr);

    if (!deliveryAddress.trim()) {
      showError('Vui lòng nhập địa chỉ giao hàng!');
      return;
    }

    if (!user.id) {
      showError('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại!');
      return;
    }

    try {
      setOrderLoading(true);
      const total = selectedMenu.price * quantity;
      
      await createOrder({
        user: user.id,
        items: [
          {
            menu: selectedMenu._id,
            quantity,
          },
        ],
        total,
        status: 'confirmed',
        deliveryAddress,
      });

      showSuccess('Đặt món thành công! Đơn hàng của bạn đang được xử lý.');
      setShowOrderModal(false);
    } catch (error: any) {
      console.error('Error creating order:', error);
      const message = error.response?.data?.message || 'Không thể đặt món. Vui lòng thử lại!';
      showError(message);
    } finally {
      setOrderLoading(false);
    }
  };

  const renderStars = (currentRating: number, interactive: boolean = false, onChange?: (rating: number) => void) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onChange?.(star)}
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
            disabled={!interactive}
          >
            <svg
              className={`w-6 h-6 ${star <= currentRating ? 'text-warning fill-current' : 'text-gray-300'}`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-orange-600 rounded-3xl p-8 shadow-2xl mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Thực đơn</h1>
          <p className="text-xl text-white opacity-90">Khám phá các món ăn ngon của chúng tôi</p>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menus.length > 0 ? (
            menus.map((menu) => (
              <div key={menu._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                {/* Image */}
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                  {menu.image ? (
                    <img src={menu.image} alt={menu.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary-100 to-primary-100">
                      <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  )}
                  {!menu.available && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="badge badge-error badge-lg">Hết hàng</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-3">
                    <span className="badge badge-outline badge-secondary">{menu.category?.name}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{menu.name}</h3>
                  {menu.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{menu.description}</p>
                  )}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-primary">{formatCurrency(menu.price)}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      className="flex-1"
                      onClick={() => handleOpenOrderModal(menu)}
                      disabled={!menu.available}
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Đặt món
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => handleOpenReviewModal(menu)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <p className="text-lg font-medium text-gray-500">Chưa có món ăn nào</p>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedMenu && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-2xl mb-4">Đánh giá món ăn</h3>
            <p className="text-gray-600 mb-6">Đánh giá cho: <span className="font-semibold">{selectedMenu.name}</span></p>
            
            <div className="space-y-4">
              {/* Rating */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Đánh giá <span className="text-error">*</span>
                </label>
                {renderStars(rating, true, setRating)}
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tiêu đề
                </label>
                <input
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="Nhập tiêu đề đánh giá"
                  className="input input-bordered w-full"
                />
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nhận xét
                </label>
                <textarea
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Chia sẻ trải nghiệm của bạn về món ăn này..."
                  className="textarea textarea-bordered w-full"
                />
              </div>
            </div>

            <div className="modal-action">
              <button
                className="btn"
                onClick={() => setShowReviewModal(false)}
                disabled={reviewLoading}
              >
                Hủy
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSubmitReview}
                disabled={reviewLoading}
              >
                {reviewLoading ? (
                  <>
                    <span className="loading loading-spinner loading-sm mr-2"></span>
                    Đang gửi...
                  </>
                ) : (
                  'Gửi đánh giá'
                )}
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setShowReviewModal(false)}></div>
        </div>
      )}

      {/* Order Modal */}
      {showOrderModal && selectedMenu && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-2xl mb-4">Đặt món</h3>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  {selectedMenu.image ? (
                    <img src={selectedMenu.image} alt={selectedMenu.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary-100 to-primary-100">
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-lg">{selectedMenu.name}</h4>
                  <p className="text-primary-600 font-bold">{formatCurrency(selectedMenu.price)}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Quantity */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Số lượng <span className="text-error">*</span>
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    className="btn btn-circle btn-outline"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="input input-bordered w-24 text-center"
                  />
                  <button
                    className="btn btn-circle btn-outline"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Địa chỉ giao hàng <span className="text-error">*</span>
                </label>
                <textarea
                  rows={3}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Nhập địa chỉ giao hàng đầy đủ..."
                  className="textarea textarea-bordered w-full"
                />
              </div>

              {/* Total */}
              <div className="bg-primary-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Tổng cộng:</span>
                  <span className="text-2xl font-bold text-primary-600">
                    {formatCurrency(selectedMenu.price * quantity)}
                  </span>
                </div>
              </div>
            </div>

            <div className="modal-action">
              <button
                className="btn"
                onClick={() => setShowOrderModal(false)}
                disabled={orderLoading}
              >
                Hủy
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSubmitOrder}
                disabled={orderLoading}
              >
                {orderLoading ? (
                  <>
                    <span className="loading loading-spinner loading-sm mr-2"></span>
                    Đang xử lý...
                  </>
                ) : (
                  'Xác nhận đặt món'
                )}
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setShowOrderModal(false)}></div>
        </div>
      )}
    </div>
  );
}

export default MenuPage;