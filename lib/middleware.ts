import { NextRequest, NextResponse } from 'next/server';
import { serverAuth, isAdmin } from './auth';

// Middleware to protect admin routes
export function requireAuth(handler: Function) {
  return async (request: NextRequest, ...args: any[]) => {
    try {
      const user = serverAuth.getUserFromRequest(request);

      if (!user) {
        return NextResponse.json(
          { success: false, error: 'Autentifikacija je potrebna' },
          { status: 401 }
        );
      }

      // Add user to request context (if needed)
      (request as any).user = user;

      return await handler(request, ...args);
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
export function requireAdmin(handler: Function) {
  return async (request: NextRequest, ...args: any[]) => {
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
      (request as any).user = user;

      return await handler(request, ...args);
    } catch (error) {
      console.error('Admin middleware error:', error);
      return NextResponse.json(
        { success: false, error: 'Greška pri provjeri admin dozvole' },
        { status: 500 }
      );
    }
  };
}
