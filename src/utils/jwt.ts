/**
 * JWT Token utilities
 * Parse and decode JWT tokens to extract user information
 */

interface JWTPayload {
  sub?: string; // email
  scope?: string; // ADMIN, USER, MODERATOR
  userId?: number;
  exp?: number;
  iat?: number;
  [key: string]: any;
}

/**
 * Decode JWT token payload (without verification)
 * Note: This only decodes the payload, does NOT verify signature
 */
export const decodeJWT = (token: string): JWTPayload | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Invalid JWT format');
      return null;
    }

    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded) as JWTPayload;
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
};

/**
 * Extract user role/scope from JWT token
 */
export const extractRoleFromToken = (token: string): string | undefined => {
  const payload = decodeJWT(token);
  return payload?.scope;
};

/**
 * Extract user email from JWT token
 */
export const extractEmailFromToken = (token: string): string | undefined => {
  const payload = decodeJWT(token);
  return payload?.sub;
};

/**
 * Extract user ID from JWT token
 */
export const extractUserIdFromToken = (token: string): number | undefined => {
  const payload = decodeJWT(token);
  return payload?.userId;
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  const payload = decodeJWT(token);
  if (!payload?.exp) return true;

  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
};

