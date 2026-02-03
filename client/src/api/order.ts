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

export interface OrderItem {
  menu: string;
  quantity: number;
}

export interface Order {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  items: {
    menu: {
      _id: string;
      name: string;
      price: number;
    };
    quantity: number;
  }[];
  total: number;
  status: string;
  deliveryAddress?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderDto {
  user: string;
  items: OrderItem[];
  total: number;
  status?: string;
  deliveryAddress?: string;
}

// Tạo đơn hàng mới
export const createOrder = async (data: CreateOrderDto): Promise<Order> => {
  try {
    const response = await axios.post(`${API_URL}/order`, data, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Lấy tất cả đơn hàng
export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const response = await axios.get(`${API_URL}/order`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

// Lấy một đơn hàng theo ID
export const getOrderById = async (id: string): Promise<Order> => {
  try {
    const response = await axios.get(`${API_URL}/order/${id}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};
