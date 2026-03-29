import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { signToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const token = signToken({ id: user._id, email: user.email, role: user.role });

    // Return token in response body so frontend can store it
    const response = NextResponse.json({ role: user.role, email: user.email, token });
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}