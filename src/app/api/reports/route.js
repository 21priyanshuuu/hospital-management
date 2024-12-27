import Appointment from '@/models/Appointment';
import { connectDB } from '@/lib/mongodb';

export async function GET() {
    await connectDB();

    const report = await Appointment.aggregate([
        { $match: { discountApplied: true } },
        { $group: { _id: '$doctorId', totalDiscount: { $sum: '$amount' } } }
    ]);

    return Response.json(report);
}
