import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:1111';

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  item: {
    _id: string;
    name: string;
    price: number;
  };
  rating: number;
  title?: string;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewDto {
  user: string;
  item: string;
  rating: number;
  title?: string;
  comment?: string;
}

export interface UpdateReviewDto {
  rating?: number;
  title?: string;
  comment?: string;
}

// Lấy tất cả đánh giá
export const getAllReviews = async (): Promise<Review[]> => {
  try {
    const response = await axios.get(`${API_URL}/review`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

// Lấy một đánh giá theo ID
export const getReviewById = async (id: string): Promise<Review> => {
  try {
    const response = await axios.get(`${API_URL}/review/${id}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error fetching review:', error);
    throw error;
  }
};

// Tạo đánh giá mới
export const createReview = async (data: CreateReviewDto): Promise<Review> => {
  try {
    const response = await axios.post(`${API_URL}/review`, data, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};

// Cập nhật đánh giá
export const updateReview = async (id: string, data: UpdateReviewDto): Promise<Review> => {
  try {
    const response = await axios.patch(`${API_URL}/review/${id}`, data, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error updating review:', error);
    throw error;
  }
};

// Xóa đánh giá
export const deleteReview = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/review/${id}`, getAuthHeaders());
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};
