import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Activity from '@/models/Activity';
import { getSession } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (session.role !== 'owner') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await connectDB();
    const { batchId } = await params;
    const activities = await Activity.find({ batchId }).sort({ createdAt: -1 });
    return NextResponse.json(activities);
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}