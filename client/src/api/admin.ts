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

export interface DashboardStats {
  totalUsers: number;
  totalMenus: number;
  totalCategories: number;
  totalOrders: number;
}

export interface RecentUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
}

export interface RecentOrder {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  items: Array<{
    menu: {
      _id: string;
      name: string;
      price: number;
    };
    quantity: number;
  }>;
  total: number;
  status: string;
  createdAt: string;
}

export interface RecentMenu {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: {
    _id: string;
    name: string;
  };
  available: boolean;
  createdAt: string;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const [usersRes, menusRes, categoriesRes, ordersRes] = await Promise.all([
      axios.get(`${API_URL}/users`, getAuthHeaders()),
      axios.get(`${API_URL}/menu`, getAuthHeaders()),
      axios.get(`${API_URL}/category`, getAuthHeaders()),
      axios.get(`${API_URL}/order`, getAuthHeaders()),
    ]);

    return {
      totalUsers: usersRes.data.length,
      totalMenus: menusRes.data.length,
      totalCategories: categoriesRes.data.length,
      totalOrders: ordersRes.data.length,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

export const getRecentUsers = async (limit = 5): Promise<RecentUser[]> => {
  try {
    const response = await axios.get(`${API_URL}/users`, getAuthHeaders());
    return response.data
      .sort((a: RecentUser, b: RecentUser) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching recent users:', error);
    throw error;
  }
};

export const getRecentOrders = async (limit = 5): Promise<RecentOrder[]> => {
  try {
    const response = await axios.get(`${API_URL}/order`, getAuthHeaders());
    return response.data
      .sort((a: RecentOrder, b: RecentOrder) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching recent orders:', error);
    throw error;
  }
};

export const getRecentMenus = async (limit = 5): Promise<RecentMenu[]> => {
  try {
    const response = await axios.get(`${API_URL}/menu`, getAuthHeaders());
    return response.data
      .sort((a: RecentMenu, b: RecentMenu) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching recent menus:', error);
    throw error;
  }
};
