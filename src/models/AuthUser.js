import mongoose from 'mongoose';

const AuthUserSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, unique: true, required: true },
});

export default mongoose.models.AuthUser || mongoose.model('AuthUser', AuthUserSchema);
