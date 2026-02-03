import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:1111';

export interface FeaturedMenu {
  _id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category: {
    _id: string;
    name: string;
  };
  available: boolean;
}

export interface HomeStats {
  totalMenus: number;
  totalCategories: number;
  totalReviews: number;
}

// Lấy món ăn nổi bật (3 món mới nhất)
export const getFeaturedMenus = async (limit = 3): Promise<FeaturedMenu[]> => {
  try {
    const response = await axios.get(`${API_URL}/menu`);
    return response.data
      .filter((menu: FeaturedMenu) => menu.available)
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching featured menus:', error);
    return [];
  }
};

// Lấy thống kê trang chủ
export const getHomeStats = async (): Promise<HomeStats> => {
  try {
    const [menusRes, categoriesRes, reviewsRes] = await Promise.all([
      axios.get(`${API_URL}/menu`),
      axios.get(`${API_URL}/category`),
      axios.get(`${API_URL}/review`),
    ]);

    return {
      totalMenus: menusRes.data.length,
      totalCategories: categoriesRes.data.length,
      totalReviews: reviewsRes.data.length,
    };
  } catch (error) {
    console.error('Error fetching home stats:', error);
    return {
      totalMenus: 0,
      totalCategories: 0,
      totalReviews: 0,
    };
  }
};