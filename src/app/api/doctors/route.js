import { connectDB } from '../../../lib/mongodb';
import Doctor from '../../../models/DoctorModel';

export async function POST(req) {
    try {
        await connectDB();
        const doctors = await req.json();

        // Insert doctors into the database
        const result = await Doctor.insertMany(doctors);

        return Response.json({ message: 'Doctors added successfully', data: result });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectDB();
        const doctors = await Doctor.find({});
        return Response.json({ data: doctors });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
