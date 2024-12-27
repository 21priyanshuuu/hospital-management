import mongoose from 'mongoose';

const dUserSchema  = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    img: { type: String },
    isAdmin: { type: Boolean, default: false },
    phone: { type: String },
    address: { type: String },
    wallet: { type: Number, default: 0 }, // Added wallet for patient transactions
    role: { type: String, enum: ['patient', 'doctor'], required: true } // Added role
});

export default mongoose.models.DUser || mongoose.model('DUser', dUserSchema);
