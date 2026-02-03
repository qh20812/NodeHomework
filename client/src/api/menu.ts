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

export interface Menu {
  _id: string;
  user?: string;
  category: {
    _id: string;
    name: string;
  };
  name: string;
  description?: string;
  price: number;
  image?: string;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMenuDto {
  category: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  available?: boolean;
}

export interface UpdateMenuDto {
  category?: string;
  name?: string;
  description?: string;
  price?: number;
  image?: string;
  available?: boolean;
}

// Lấy tất cả menu
export const getAllMenus = async (): Promise<Menu[]> => {
  try {
    const response = await axios.get(`${API_URL}/menu`);
    return response.data;
  } catch (error) {
    console.error('Error fetching menus:', error);
    throw error;
  }
};

// Lấy một menu theo ID
export const getMenuById = async (id: string): Promise<Menu> => {
  try {
    const response = await axios.get(`${API_URL}/menu/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching menu:', error);
    throw error;
  }
};

// Tạo menu mới
export const createMenu = async (data: CreateMenuDto): Promise<Menu> => {
  try {
    const response = await axios.post(`${API_URL}/menu`, data, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error creating menu:', error);
    throw error;
  }
};

// Cập nhật menu
export const updateMenu = async (id: string, data: UpdateMenuDto): Promise<Menu> => {
  try {
    const response = await axios.patch(`${API_URL}/menu/${id}`, data, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error updating menu:', error);
    throw error;
  }
};

// Xóa menu
export const deleteMenu = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/menu/${id}`, getAuthHeaders());
  } catch (error) {
    console.error('Error deleting menu:', error);
    throw error;
  }
};


