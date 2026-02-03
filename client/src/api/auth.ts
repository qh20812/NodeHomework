const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:1111';
const AUTH_BASE_URL = `${API_BASE_URL}/auth`;

export const LOGIN_URL = `${AUTH_BASE_URL}/login`;
export const REGISTER_URL = `${AUTH_BASE_URL}/register`;

export async function login(email: string, password: string) {
  const res = await fetch(LOGIN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    let errorMessage = 'Login failed';
    try {
      const errorData = await res.json();
      // Map backend error codes to Vietnamese messages
      const CODE_MAP: Record<string, string> = {
        INVALID_CREDENTIALS: 'Thông tin đăng nhập không hợp lệ',
        EMAIL_ALREADY_REGISTERED: 'Email đã được đăng ký',
      };
      if (errorData.code && CODE_MAP[errorData.code]) {
        errorMessage = CODE_MAP[errorData.code];
      } else {
        errorMessage = errorData.message || errorMessage;
      }
    } catch {
      errorMessage = await res.text() || errorMessage;
    }
    throw new Error(errorMessage);
  }
  const data = await res.json();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const token = (data as any).access_token;
  if (token) localStorage.setItem('access_token', token);
  return data;
}

export async function register(name: string, email: string, phone: string, password: string) {
  const res = await fetch(REGISTER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, phone, password, role: 'cus' }),
  });
  if (!res.ok) {
    let errorMessage = 'Register failed';
    try {
      const errorData = await res.json();
      const CODE_MAP: Record<string, string> = {
        EMAIL_ALREADY_REGISTERED: 'Email đã được đăng ký',
      };
      if (errorData.code && CODE_MAP[errorData.code]) {
        errorMessage = CODE_MAP[errorData.code];
      } else {
        errorMessage = errorData.message || errorMessage;
      }
    } catch {
      errorMessage = await res.text() || errorMessage;
    }
    throw new Error(errorMessage);
  }
  return res.json();
}

export function getToken() {
  return localStorage.getItem('access_token') || '';
}

export async function me() {
  const token = getToken();
  const res = await fetch(`${AUTH_BASE_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to fetch profile');
  }
  return res.json();
}

export function logout() {
  localStorage.removeItem('access_token');
}