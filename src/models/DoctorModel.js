import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    specialization: { type: String, required: true },
    experience: { type: Number, required: true },
    contact: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    consultationFee: { type: Number, required: true },
    availableSlots: [String], // Array of time slots
});

export default mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema);
