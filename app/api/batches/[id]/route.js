import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Batch from '@/models/Batch';
import Product from '@/models/Product';
import Activity from '@/models/Activity';
import { getSession } from '@/lib/auth';

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const session = await getSession(request);
    
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // UPDATED: Allow both Manager and Owner to delete batches
    if (session.role !== 'manager' && session.role !== 'owner') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectDB();
    
    const batch = await Batch.findById(id);
    if (!batch) return NextResponse.json({ error: 'Batch not found' }, { status: 404 });

    // Delete the batch and its associated products
    await Batch.findByIdAndDelete(id);
    await Product.deleteMany({ batchId: id });

    // Optional: Keep the activity log for the batch deletion 
    // or delete it if you want a complete wipe. 
    // Usually, it's better to log the deletion:
    await Activity.create({
      batchId: id,
      userEmail: session.email,
      action: `Deleted entire Batch: ${batch.name}`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Delete batch error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}


// import { NextResponse } from 'next/server';
// import { connectDB } from '@/lib/mongodb';
// import Batch from '@/models/Batch';
// import Product from '@/models/Product';
// import Activity from '@/models/Activity';
// import { getSession } from '@/lib/auth';

// export async function DELETE(request, { params }) {
//   try {
//     const { id } = await params;
//     const session = await getSession(request);
//     if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     if (session.role !== 'manager') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

//     await connectDB();
//     const batch = await Batch.findByIdAndDelete(id);
//     if (!batch) return NextResponse.json({ error: 'Batch not found' }, { status: 404 });

//     await Product.deleteMany({ batchId: id });
//     await Activity.deleteMany({ batchId: id });

//     return NextResponse.json({ success: true });
//   } catch {
//     return NextResponse.json({ error: 'Server error' }, { status: 500 });
//   }
// }