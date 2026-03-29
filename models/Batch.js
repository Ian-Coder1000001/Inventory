import mongoose from 'mongoose';

const BatchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  batchNumber: { type: Number, required: true, unique: true },
}, { timestamps: true });

export default mongoose.models.Batch || mongoose.model('Batch', BatchSchema);