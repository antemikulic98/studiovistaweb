import jwt from 'jsonwebtoken';

// Types for authentication
export interface User {
  userId: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

// Client-side authentication utilities
export const clientAuth = {
  // Check if user is authenticated on client side
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('isAdmin') === 'true';
  },

  // Get current user data from localStorage
  getCurrentUser: (): User | null => {
    if (typeof window === 'undefined') return null;

    const email = localStorage.getItem('adminEmail');
    const name = localStorage.getItem('adminName');
    const role = localStorage.getItem('adminRole');

    if (!email || !name || !role) return null;

    return {
      userId: 'local', // We'll update this when we get it from the API
      email,
      name,
      role: role as 'admin' | 'user',
    };
  },

  // Clear authentication data
  logout: async (): Promise<void> => {
    try {
      // Call logout API to clear server-side cookie
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout API call failed:', error);
    }

    // Clear client-side data
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminName');
    localStorage.removeItem('adminRole');
  },

  // Redirect to login if not authenticated
  requireAuth: (): boolean => {
    const isAuth = clientAuth.isAuthenticated();
    if (!isAuth && typeof window !== 'undefined') {
      window.location.href = '/login';
      return false;
    }
    return isAuth;
  },
};

// Server-side JWT utilities
export const serverAuth = {
  // Verify JWT token
  verifyToken: (token: string): User | null => {
    try {
      const jwtSecret = process.env.JWT_SECRET || 'your-fallback-secret-key';
      const decoded = jwt.verify(token, jwtSecret) as any;

      return {
        userId: decoded.userId,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role,
      };
    } catch (error) {
      console.error('JWT verification failed:', error);
      return null;
    }
  },

  // Get user from request (from cookie or Authorization header)
  getUserFromRequest: (request: any): User | null => {
    try {
      // Try to get token from cookie first
      let token = request.cookies.get('auth-token')?.value;

      // If no cookie, try Authorization header
      if (!token) {
        const authHeader = request.headers.get('Authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
          token = authHeader.substring(7);
        }
      }

      if (!token) {
        return null;
      }

      return serverAuth.verifyToken(token);
    } catch (error) {
      console.error('Error getting user from request:', error);
      return null;
    }
  },
};

// Role checking utilities
export const hasRole = (user: User | null, role: 'admin' | 'user'): boolean => {
  if (!user) return false;
  if (role === 'user') return true; // Any authenticated user is a 'user'
  return user.role === role;
};

export const isAdmin = (user: User | null): boolean => {
  return hasRole(user, 'admin');
};
