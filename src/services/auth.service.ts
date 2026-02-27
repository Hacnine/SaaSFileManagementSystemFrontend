import api from './api';
import type { AuthResponse, LoginCredentials, RegisterData, ApiResponse, User } from '../types';

export const authService = {
  async register(data: RegisterData): Promise<ApiResponse> {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  async verifyEmail(token: string): Promise<ApiResponse> {
    const response = await api.get(`/auth/verify-email?token=${token}`);
    return response.data;
  },

  async forgotPassword(email: string): Promise<ApiResponse> {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(token: string, password: string): Promise<ApiResponse> {
    const response = await api.post(`/auth/reset-password?token=${token}`, {
      password,
    });
    return response.data;
  },

  async getProfile(): Promise<ApiResponse<User>> {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  async logout(): Promise<ApiResponse> {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};
