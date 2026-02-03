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

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  address?: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  role?: string;
  address?: string;
}

// Lấy tất cả người dùng
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await axios.get(`${API_URL}/users`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Lấy một người dùng theo ID
export const getUserById = async (id: string): Promise<User> => {
  try {
    const response = await axios.get(`${API_URL}/users/${id}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

// Tạo người dùng mới
export const createUser = async (data: CreateUserDto): Promise<User> => {
  try {
    const response = await axios.post(`${API_URL}/users`, data, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Cập nhật người dùng
export const updateUser = async (id: string, data: UpdateUserDto): Promise<User> => {
  try {
    const response = await axios.patch(`${API_URL}/users/${id}`, data, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Xóa người dùng
export const deleteUser = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/users/${id}`, getAuthHeaders());
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};
