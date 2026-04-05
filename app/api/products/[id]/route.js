import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import Activity from '@/models/Activity';
import { getSession } from '@/lib/auth';

export async function DELETE(request, { params }) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const session = await getSession(request);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // UPDATED: Allow both Manager and Owner
    if (session.role !== 'manager' && session.role !== 'owner') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectDB();
    
    // Find the product first so we can get its name/batchId for the Activity Log
    const product = await Product.findById(id);
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    await Product.findByIdAndDelete(id);

    // Log who deleted it
    await Activity.create({
      batchId: product.batchId,
      userEmail: session.email,
      action: `Deleted product "${product.name}"`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Delete product error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}


// import { NextResponse } from 'next/server';
// import { connectDB } from '@/lib/mongodb';
// import Product from '@/models/Product';
// import Activity from '@/models/Activity';
// import { getSession } from '@/lib/auth';

// export async function DELETE(request, { params }) {
//   try {
//     const resolvedParams = await params;
//     const id = resolvedParams.id;

//     const session = await getSession(request);
//     if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     if (session.role !== 'manager') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

//     await connectDB();
//     const product = await Product.findByIdAndDelete(id);
//     if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

//     await Activity.create({
//       batchId: product.batchId,
//       userEmail: session.email,
//       action: `Deleted product "${product.name}"`,
//     });

//     return NextResponse.json({ success: true });
//   } catch (err) {
//     console.error('Delete route error:', err);
//     return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
//   }
// }