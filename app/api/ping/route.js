import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';

export async function GET() {
  try {
    await connectDB();
    // A simple, fast query just to keep the MongoDB connection active
    return NextResponse.json({ 
      status: 'online', 
      timestamp: new Date().toISOString(),
      message: 'Keep-alive successful' 
    }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
  }
}