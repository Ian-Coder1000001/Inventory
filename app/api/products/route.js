import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import Activity from '@/models/Activity';
import { getSession } from '@/lib/auth';

export async function GET(request) {
  try {
    const session = await getSession(request);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const batchId = searchParams.get('batchId');
    if (!batchId) return NextResponse.json({ error: 'batchId required' }, { status: 400 });

    await connectDB();
    const products = await Product.find({ batchId }).sort({ createdAt: -1 });
    return NextResponse.json(products);
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
    const { batchId, name, imageUrl, sizes, buyingCost } = await request.json();
    const product = await Product.create({ batchId, name, imageUrl, sizes, buyingCost });

    await Activity.create({
      batchId,
      userEmail: session.email,
      action: `Added product "${name}" with buying cost KES ${buyingCost}`,
    });

    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}