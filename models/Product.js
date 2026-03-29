import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
  name: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  sizes: [{ type: String }],
  buyingCost: { type: Number, required: true },
  salePrice: { type: Number, default: null },
  profit: { type: Number, default: null },
  status: { type: String, enum: ['in_stock', 'sold'], default: 'in_stock' },
  soldAt: { type: Date, default: null },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);