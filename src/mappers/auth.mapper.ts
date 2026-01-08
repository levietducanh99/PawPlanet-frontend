/**
 * Auth mappers - single point of breakage for backend changes
 * Maps OpenAPI DTOs to frontend domain models
 */

import type {
  LoginRequest,
  RegisterRequest,
  ApiResponseAuthResponse,
  ApiResponseUserResponse,
  ApiResponseUserEntity,
  UserResponse,
  UserEntity
} from '@/services/api/api';
import type {
  LoginCredentials,
  RegisterCredentials,
  AuthToken,
  LoginResult,
  RegisterResult,
  User
} from '@/domain/auth';
import { decodeJWT } from '@/utils/jwt';

export const mapToLoginRequest = (credentials: LoginCredentials): LoginRequest => ({
  email: credentials.email,
  password: credentials.password
});

export const mapToRegisterRequest = (credentials: RegisterCredentials): RegisterRequest => ({
  username: credentials.username,
  email: credentials.email,
  password: credentials.password
  // Note: confirmPassword and agree are frontend-only validation
});

export const mapAuthResponse = (apiResponse: ApiResponseAuthResponse): AuthToken => {
  const authResult = apiResponse.result;
  if (!authResult) {
    console.error('Invalid auth response: missing result', apiResponse);
    throw new Error('Invalid auth response: missing result');
  }

  const token = authResult.token || '';
  const authenticated = authResult.authenticated || false;

  console.log('Auth response mapped:', { token: token ? '***' : 'empty', authenticated });

  return {
    token,
    authenticated
  };
};

export const mapUser = (dto: UserResponse): User => {
  let role = dto.role;
  // If role is missing but scope is present, map scope to role
  if (!role && (dto as any).scope) {
    const scope = (dto as any).scope;
    if (scope === 'ADMIN' || scope === 'MODERATOR') {
      role = scope;
    }
  }
  return {
    id: 0, // UserResponse doesn't have id field in current API
    email: dto.email!,
    username: dto.username,
    avatarUrl: dto.avatarUrl,
    bio: dto.bio,
    role
  };
};

export const mapUserEntity = (dto: UserEntity): User => ({
  id: dto.id || 0,
  email: dto.email!,
  username: dto.username,
  avatarUrl: dto.avatarUrl,
  bio: dto.bio,
  role: dto.role
});

export const mapLoginResult = (
  authResponse: ApiResponseAuthResponse,
  userResponse?: ApiResponseUserResponse
): LoginResult => {
  try {
    const token = mapAuthResponse(authResponse);

    // If backend provides user info, use it
    let user = userResponse?.result ? mapUser(userResponse.result) : undefined;

    // If no user info from backend, parse JWT token to extract user info
    if (!user && token.token) {
      const payload = decodeJWT(token.token);
      if (payload) {
        user = {
          id: payload.userId || 0,
          email: payload.sub || '',
          username: payload.sub?.split('@')[0], // Extract username from email
          role: payload.scope // Use scope from token as role
        };
        console.log('User created from JWT token:', { id: user.id, email: user.email, role: user.role });
      }
    }

    return {
      token,
      user,
      success: true
    };
  } catch (error) {
    console.error('Error mapping login result:', error);
    return {
      token: { token: '', authenticated: false },
      success: false
    };
  }
};

export const mapRegisterResult = (apiResponse: ApiResponseUserEntity): RegisterResult => {
  try {
    if (!apiResponse.result) {
      throw new Error('Invalid register response: missing result');
    }

    const user = mapUserEntity(apiResponse.result);

    return {
      user,
      success: true
    };
  } catch (error) {
    return {
      user: { id: 0, email: '', username: '', avatarUrl: '', bio: '' },
      success: false
    };
  }
};
