import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import Activity from '@/models/Activity';
import { getSession } from '@/lib/auth';

export async function PATCH(request, { params }) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const session = await getSession(request);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (session.role !== 'manager') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await connectDB();

    const body = await request.json();
    const salePrice = Number(body.salePrice);

    if (!salePrice || isNaN(salePrice)) {
      return NextResponse.json({ error: 'Invalid sale price' }, { status: 400 });
    }

    const product = await Product.findById(id);
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    const profit = salePrice - product.buyingCost;
    product.salePrice = salePrice;
    product.profit = profit;
    product.status = 'sold';
    product.soldAt = new Date();
    await product.save();

    await Activity.create({
      batchId: product.batchId,
      userEmail: session.email,
      action: `Marked "${product.name}" as sold at KES ${salePrice.toLocaleString()} — Profit: KES ${profit.toLocaleString()}`,
    });

    return NextResponse.json(product);
  } catch (err) {
    console.error('Sell route error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}