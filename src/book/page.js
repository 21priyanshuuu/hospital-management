'use client';
import axios from 'axios';

const BookAppointment = () => {
    const handleBook = async () => {
        const response = await axios.post('/api/appointments', {
            patientId: '123',
            doctorId: '456',
            amount: 100,
        });
        console.log(response.data);
    };

    return (
        <div>
            <h1>Book Appointment</h1>
            <button onClick={handleBook}>Book Now</button>
        </div>
    );
};

export default BookAppointment;
