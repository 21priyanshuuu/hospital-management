import mongoose from 'mongoose';

const discountUsageSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    discountUsed: { type: Boolean, default: false },
});

export default mongoose.models.DiscountUsage || mongoose.model('DiscountUsage', discountUsageSchema);
