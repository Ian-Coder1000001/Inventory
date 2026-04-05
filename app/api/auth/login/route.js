import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { signToken } from '@/lib/auth';

export async function POST(request) {
  try {
    // 1. Check if the environment variable even exists
    if (!process.env.MONGODB_URI) {
      console.error("ERROR: MONGODB_URI is not defined in .env.local");
      return NextResponse.json({ error: 'Database configuration missing' }, { status: 500 });
    }

    const { email, password } = await request.json();

    // 2. Attempt Database Connection
    console.log("Attempting to connect to MongoDB...");
    await connectDB();
    console.log("MongoDB connected successfully.");

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = signToken({ id: user._id, email: user.email, role: user.role });

    const response = NextResponse.json({ 
      role: user.role, 
      email: user.email, 
      token 
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;

  } catch (err) {
    // 3. THIS IS THE FIX: This prints the EXACT error to your terminal
    console.error("--- LOGIN ROUTE ERROR ---");
    console.error("Message:", err.message);
    console.error("Stack:", err.stack);
    console.error("-------------------------");

    return NextResponse.json(
      { error: 'Server error', details: err.message }, 
      { status: 500 }
    );
  }
}