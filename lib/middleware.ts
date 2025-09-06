import { NextRequest, NextResponse } from 'next/server';
import { serverAuth, isAdmin } from './auth';

// Extend NextRequest to include user
interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string;
    email: string;
    name: string;
    role: string;
  };
}

type RouteHandler = (
  request: NextRequest,
  params?: { params: { [key: string]: string } }
) => Promise<NextResponse>;

// Middleware to protect admin routes
export function requireAuth(handler: RouteHandler) {
  return async (
    request: NextRequest,
    params?: { params: { [key: string]: string } }
  ) => {
    try {
      const user = serverAuth.getUserFromRequest(request);

      if (!user) {
        return NextResponse.json(
          { success: false, error: 'Autentifikacija je potrebna' },
          { status: 401 }
        );
      }

      // Add user to request context (if needed)
      (request as AuthenticatedRequest).user = user;

      return await handler(request, params);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return NextResponse.json(
        { success: false, error: 'Greška pri provjeri dozvole' },
        { status: 500 }
      );
    }
  };
}

// Middleware to protect admin-only routes
export function requireAdmin(handler: RouteHandler) {
  return async (
    request: NextRequest,
    params?: { params: { [key: string]: string } }
  ) => {
    try {
      const user = serverAuth.getUserFromRequest(request);

      if (!user) {
        return NextResponse.json(
          { success: false, error: 'Autentifikacija je potrebna' },
          { status: 401 }
        );
      }

      if (!isAdmin(user)) {
        return NextResponse.json(
          { success: false, error: 'Admin dozvole su potrebne' },
          { status: 403 }
        );
      }

      // Add user to request context (if needed)
      (request as AuthenticatedRequest).user = user;

      return await handler(request, params);
    } catch (error) {
      console.error('Admin middleware error:', error);
      return NextResponse.json(
        { success: false, error: 'Greška pri provjeri admin dozvole' },
        { status: 500 }
      );
    }
  };
}
