import { useState, useEffect, type FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getReviewById, updateReview, type Review, type UpdateReviewDto } from '../../../api/review';
import { useAlert } from '../../../contexts/AlertContext';
import Navbar from '../../../components/navbar';
import Loading from '../../../components/ui/loading';
import Button from '../../../components/ui/button';

function ReviewReply() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useAlert();

  const [review, setReview] = useState<Review | null>(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const fetchReview = async () => {
      if (!id) return;
      
      try {
        const data = await getReviewById(id);
        setReview(data);
      } catch (error) {
        console.error('Error loading review:', error);
        showError('Không thể tải đánh giá. Vui lòng thử lại!');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchReview();
  }, [id, showError]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!replyText.trim()) {
      showError('Vui lòng nhập nội dung phản hồi!');
      return;
    }

    if (!id) return;

    try {
      setLoading(true);

      // Update review with admin reply (using comment field)
      const updateData: UpdateReviewDto = {
        comment: `${review?.comment || ''}\n\n--- Phản hồi từ Admin ---\n${replyText}`,
      };

      await updateReview(id, updateData);
      showSuccess('Đã gửi phản hồi thành công!');
      navigate('/admin/review');
    } catch (error: any) {
      console.error('Error replying to review:', error);
      const message = error.response?.data?.message || 'Không thể gửi phản hồi. Vui lòng thử lại!';
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-6 h-6 ${star <= rating ? 'text-warning fill-current' : 'text-gray-300'}`}
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

  if (initialLoading) {
    return <Loading />;
  }

  if (!review) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <p className="text-lg text-gray-500">Không tìm thấy đánh giá</p>
            <Button variant="primary" className="mt-4" onClick={() => navigate('/admin/review')}>
              Quay lại danh sách
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-success to-success-dark rounded-3xl p-8 shadow-2xl mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Phản hồi đánh giá</h1>
          <p className="text-xl text-white opacity-90">Gửi phản hồi đến khách hàng</p>
        </div>

        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/admin/review')}
            className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại danh sách
          </button>
        </div>

        {/* Review Display */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Đánh giá gốc</h2>
          
          {/* User Info */}
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary font-bold text-2xl">
                {review.user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">{review.user?.name || 'Người dùng'}</h3>
              <p className="text-gray-500">{review.user?.email}</p>
            </div>
          </div>

          {/* Rating */}
          <div className="mb-4">
            {renderStars(review.rating)}
          </div>

          {/* Menu Item */}
          <div className="mb-4 bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Món ăn:</p>
            <p className="font-semibold text-lg text-gray-900">{review.item?.name || 'Không xác định'}</p>
          </div>

          {/* Title */}
          {review.title && (
            <h4 className="font-semibold text-xl text-gray-900 mb-3">{review.title}</h4>
          )}

          {/* Comment */}
          {review.comment && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 whitespace-pre-wrap">{review.comment}</p>
            </div>
          )}
        </div>

        {/* Reply Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Phản hồi của bạn</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="reply" className="block text-sm font-semibold text-gray-700 mb-2">
                Nội dung phản hồi <span className="text-error">*</span>
              </label>
              <textarea
                id="reply"
                rows={6}
                placeholder="Nhập phản hồi của bạn cho khách hàng..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="textarea bg-white text-black textarea-bordered w-full"
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                Phản hồi của bạn sẽ được thêm vào đánh giá này
              </p>
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
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                    Gửi phản hồi
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={() => navigate('/admin/review')}
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

export default ReviewReply;