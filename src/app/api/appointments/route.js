import { connectDB } from '../../../lib/mongodb';
import Appointment from '../../../models/Appointment';
import DiscountUsage from '../../../models/Discount';
import DUser from "../../../models/UserModel";
import Doctor from "../../../models/DoctorModel";  // Import Doctor model

export async function POST(req) {
    try {
        await connectDB();
        const { patientId, doctorId, appointmentDate, amount } = await req.json();

        // ✅ Validate patient
        const patient = await DUser.findById(patientId);
        if (!patient || patient.isAdmin === true) {
            return new Response(JSON.stringify({ error: 'Invalid patient ID or not a valid patient user' }), { status: 400 });
        }

        // ✅ Validate doctor from the doctor collection
        const doctor = await Doctor.findById(doctorId);  // Use Doctor model
        if (!doctor) {
            return new Response(JSON.stringify({ error: 'Doctor not found' }), { status: 400 });
        }

        console.log('Doctor found:', doctor);  // Debugging log

        // ✅ Check if doctor has available slots for the appointment date
        const isSlotAvailable = doctor.availableSlots.some(slot => slot === appointmentDate);
        if (!isSlotAvailable) {
            return new Response(JSON.stringify({ error: 'No available slots for the selected appointment date' }), { status: 400 });
        }

        // ✅ Check if the discount is applicable (first-time appointment)
        const existingDiscount = await DiscountUsage.findOne({ patientId, doctorId });
        let discount = 0;

        if (!existingDiscount) {
            discount = amount * 0.2; // 20% discount for first-time appointments
            await DiscountUsage.create({ patientId, doctorId, discountUsed: true });
        }

        // ✅ Check wallet balance
        const finalAmount = amount - discount;
        if (patient.wallet < finalAmount) {
            return new Response(JSON.stringify({ error: 'Insufficient wallet balance' }), { status: 400 });
        }

        // ✅ Deduct amount from patient wallet
        await DUser.findByIdAndUpdate(patientId, { $inc: { wallet: -finalAmount } });

        // ✅ Create appointment
        const appointment = await Appointment.create({
            patientId,
            doctorId,
            appointmentDate,
            amount: finalAmount,
            discountApplied: discount > 0,
        });

        return new Response(JSON.stringify({ message: 'Appointment booked successfully', appointment }), { status: 201 });
    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
