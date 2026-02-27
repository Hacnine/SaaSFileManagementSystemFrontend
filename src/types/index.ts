export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'USER';
  isEmailVerified: boolean;
  activePackage?: SubscriptionPackage | null;
  createdAt?: string;
}

export interface SubscriptionPackage {
  id: string;
  name: string;
  maxFolders: number;
  maxNestingLevel: number;
  allowedFileTypes: string[];
  maxFileSize: number;
  totalFileLimit: number;
  filesPerFolder: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
