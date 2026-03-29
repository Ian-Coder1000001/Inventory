import mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema({
  batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
  userEmail: { type: String, required: true },
  action: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Activity || mongoose.model('Activity', ActivitySchema);