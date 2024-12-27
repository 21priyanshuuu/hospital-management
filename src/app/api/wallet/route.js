import { connectDB } from '@/lib/mongodb';
import DUser from '@/models/User';

export async function POST(req) {
    const { userId, amount } = await req.json();
    await connectDB();

    await User.findByIdAndUpdate(userId, { $inc: { wallet: -amount } });
    return Response.json({ message: 'Wallet updated successfully' });
}
