import { NextRequest, NextResponse } from 'next/server';
import { serverAuth } from '../../../../lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Get user from request (cookie or header)
    const user = serverAuth.getUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          authenticated: false,
          error: 'Neispravna autentifikacija',
        },
        { status: 401 }
      );
    }

    // Return user data
    return NextResponse.json(
      {
        success: true,
        authenticated: true,
        user: {
          id: user.userId,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Auth verification error:', error);
    return NextResponse.json(
      {
        success: false,
        authenticated: false,
        error: 'Greška pri provjeri autentifikacije',
      },
      { status: 500 }
    );
  }
}
