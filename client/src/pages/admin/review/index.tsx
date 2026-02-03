import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllReviews, deleteReview, type Review } from '../../../api/review';
import { useAlert } from '../../../contexts/AlertContext';
import Navbar from '../../../components/navbar';
import Loading from '../../../components/ui/loading';
import Button from '../../../components/ui/button';

function ReviewIndex() {
  const navigate = useNavigate();
  const { confirm, showSuccess, showError } = useAlert();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await getAllReviews();
      setReviews(data);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = await confirm('Bạn có chắc chắn muốn xóa đánh giá này?');
    if (!confirmed) return;
    
    try {
      setDeleteId(id);
      await deleteReview(id);
      showSuccess('Xóa đánh giá thành công!');
      await fetchReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
      showError('Không thể xóa đánh giá. Vui lòng thử lại!');
    } finally {
      setDeleteId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${star <= rating ? 'text-warning fill-current' : 'text-gray-300'}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
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
        <div className="bg-gradient-to-r from-success to-success-dark rounded-3xl p-8 shadow-2xl mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className=" text-4xl md:text-5xl font-bold text-white mb-3">Quản lý Đánh giá</h1>
              <p className="text-xl text-white opacity-90">Quản lý đánh giá của khách hàng</p>
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

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review._id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* User and Rating */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary font-bold text-lg">
                            {review.user?.name?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{review.user?.name || 'Người dùng'}</h3>
                          <p className="text-sm text-gray-500">{review.user?.email}</p>
                        </div>
                      </div>
                      {renderStars(review.rating)}
                    </div>

                    {/* Menu Item */}
                    <div className="mb-3 bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-600">Món ăn đánh giá:</p>
                      <p className="font-semibold text-gray-900">{review.item?.name || 'Không xác định'}</p>
                    </div>

                    {/* Title */}
                    {review.title && (
                      <h4 className="font-semibold text-lg text-gray-900 mb-2">{review.title}</h4>
                    )}

                    {/* Comment */}
                    {review.comment && (
                      <p className="text-gray-700 mb-3">{review.comment}</p>
                    )}

                    {/* Date */}
                    <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-start space-x-2 ml-4">
                    <Link to={`/admin/review/reply/${review._id}`}>
                      <button className="btn btn-sm btn-primary">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(review._id)}
                      disabled={deleteId === review._id}
                      className="btn btn-sm btn-error"
                    >
                      {deleteId === review._id ? (
                        <span className="loading loading-spinner loading-xs"></span>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <p className="text-lg font-medium text-gray-500">Chưa có đánh giá nào</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReviewIndex;