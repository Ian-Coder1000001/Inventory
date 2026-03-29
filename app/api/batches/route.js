import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Batch from '@/models/Batch';
import Activity from '@/models/Activity';
import { getSession } from '@/lib/auth';

export async function GET(request) {
  try {
    const session = await getSession(request);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await connectDB();
    const batches = await Batch.find().sort({ batchNumber: 1 });
    return NextResponse.json(batches);
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getSession(request);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (session.role !== 'manager') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await connectDB();
    const last = await Batch.findOne().sort({ batchNumber: -1 });
    const nextNumber = last ? last.batchNumber + 1 : 1;
    const batch = await Batch.create({ name: `Batch ${nextNumber}`, batchNumber: nextNumber });

    await Activity.create({
      batchId: batch._id,
      userEmail: session.email,
      action: `Created Batch ${nextNumber}`,
    });

    return NextResponse.json(batch, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}