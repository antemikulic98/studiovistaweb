import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '../../../../config/database';

// Import User model directly
const User = require('../../../../models/User');

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email i lozinka su obavezni' },
        { status: 400 }
      );
    }

    // Connect to database
    const connected = await connectDB();
    if (!connected) {
      return NextResponse.json(
        { success: false, error: 'Greška pri povezivanju s bazom podataka' },
        { status: 500 }
      );
    }

    // Find user by email
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      isActive: true,
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Korisnik nije pronađen' },
        { status: 401 }
      );
    }

    // Check password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Pogrešna lozinka' },
        { status: 401 }
      );
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET || 'your-fallback-secret-key';
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
      jwtSecret,
      { expiresIn: '24h' }
    );

    // Create response with user data (password excluded by toJSON transform)
    const userData = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      lastLogin: user.lastLogin,
    };

    // Set HTTP-only cookie for security
    const response = NextResponse.json(
      {
        success: true,
        message: 'Uspješna prijava',
        user: userData,
        token,
      },
      { status: 200 }
    );

    // Set secure cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Greška pri prijavi' },
      { status: 500 }
    );
  }
}
