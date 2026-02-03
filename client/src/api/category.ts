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

export interface Category {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
}

// Lấy tất cả danh mục
export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const response = await axios.get(`${API_URL}/category`);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Lấy một danh mục theo ID
export const getCategoryById = async (id: string): Promise<Category> => {
  try {
    const response = await axios.get(`${API_URL}/category/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching category:', error);
    throw error;
  }
};

// Tạo danh mục mới
export const createCategory = async (data: CreateCategoryDto): Promise<Category> => {
  try {
    const response = await axios.post(`${API_URL}/category`, data, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

// Cập nhật danh mục
export const updateCategory = async (id: string, data: UpdateCategoryDto): Promise<Category> => {
  try {
    const response = await axios.patch(`${API_URL}/category/${id}`, data, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

// Xóa danh mục
export const deleteCategory = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/category/${id}`, getAuthHeaders());
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};
