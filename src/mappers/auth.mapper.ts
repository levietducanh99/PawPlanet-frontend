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

export const mapUser = (dto: UserResponse): User => ({
  id: 0, // UserResponse doesn't have id field in current API
  email: dto.email!,
  username: dto.username,
  avatarUrl: dto.avatarUrl,
  bio: dto.bio
});

export const mapUserEntity = (dto: UserEntity): User => ({
  id: dto.id || 0,
  email: dto.email!,
  username: dto.username,
  avatarUrl: dto.avatarUrl,
  bio: dto.bio
});

export const mapLoginResult = (
  authResponse: ApiResponseAuthResponse,
  userResponse?: ApiResponseUserResponse
): LoginResult => {
  try {
    const token = mapAuthResponse(authResponse);
    const user = userResponse?.result ? mapUser(userResponse.result) : undefined;

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

