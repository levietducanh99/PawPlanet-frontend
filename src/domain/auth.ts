/**
 * Frontend domain models for authentication
 * These models are isolated from backend DTOs
 */

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  agree: boolean;
}

export interface AuthToken {
  token: string;
  authenticated: boolean;
}

export interface User {
  id: number;
  email: string;
  username?: string;
  avatarUrl?: string;
  bio?: string;
  role?: string;
}

export const isAdmin = (user: User | null): boolean => {
  return user?.role === 'ADMIN' || user?.role === 'MODERATOR';
};

export interface LoginResult {
  token: AuthToken;
  user?: User;
  success: boolean;
}

export interface RegisterResult {
  user: User;
  success: boolean;
}

export interface AuthError {
  message: string;
  code?: string;
}
