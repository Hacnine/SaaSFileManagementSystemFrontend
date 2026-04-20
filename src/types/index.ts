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

export interface SubscriptionHistory {
  id: string;
  userId: string;
  packageId: string;
  startDate: string;
  endDate?: string | null;
  createdAt: string;
  subscriptionPackage?: SubscriptionPackage;
}

export type FileType = 'IMAGE' | 'VIDEO' | 'PDF' | 'AUDIO';

export interface Folder {
  id: string;
  name: string;
  userId: string;
  parentId: string | null;
  nestingLevel: number;
  createdAt: string;
  updatedAt: string;
}

export interface FileItem {
  id: string;
  name: string;
  originalName: string;
  mimeType: string;
  size: number | string;
  path: string;
  fileType: FileType;
  userId: string;
  folderId: string;
  createdAt: string;
  updatedAt: string;
}
