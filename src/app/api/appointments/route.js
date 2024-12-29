// api/appointment/route.js
import { connectDB } from '../../../lib/mongodb';
import Appointment from '../../../models/Appointment';
import DUser from '../../../models/UserModel';

export async function POST(req) {
    try {
        await connectDB();

        const { email, doctorId, date, timeSlot,appointmentAmount } = await req.json();

        if (!email || !doctorId || !date || !timeSlot) {
            return new Response(
                JSON.stringify({ error: 'Email, doctorId, date, and timeSlot are required.' }),
                { status: 400 }
            );
        }

        // Find the user by email to get the MongoDB _id
        const user = await DUser.findOne({ email });
        if (!user) {
            return new Response(
                JSON.stringify({ error: 'User not found with the provided email.' }),
                { status: 404 }
            );
        }
        if (user.wallet < appointmentAmount) {
            return new Response(
                JSON.stringify({ error: 'Insufficient wallet balance.' }),
                { status: 400 }
            );
        }

        // Create a new appointment
        const newAppointment = new Appointment({
            patientId: user._id, // Use MongoDB _id
            doctorId,
            date,
            timeSlot,
        });
        await DUser.findByIdAndUpdate(user._id, { $inc: { wallet: -appointmentAmount } });

        await newAppointment.save();

        return new Response(
            JSON.stringify({ message: 'Appointment booked successfully.', appointment: newAppointment }),
            { status: 201 }
        );
    } catch (error) {
        console.error('POST Error:', error);
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500 }
        );
    }
}
