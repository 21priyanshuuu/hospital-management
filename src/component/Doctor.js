"use client"

import React, { useState } from 'react';
import { Mail, Phone, Award, CreditCard, Calendar, Clock, X } from 'lucide-react';
import axios from 'axios';

const fetchAuthUserEmail = async () => {
    try {
        const response = await axios.get('/api/authUser');
        if (response.data && response.data.email) {
            return response.data.email;
        } else {
            throw new Error('Email not found in AuthUser response');
        }
    } catch (err) {
        console.error('AuthUser Fetch Error:', err);
        setError('Failed to fetch AuthUser details');
        return null;
    }
};

// Individual Doctor Card Component
const DoctorCard = ({ doctor }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [userData, setUserData] = useState(null);

  const fetchUserData = async () => {
    try {
        const email = await fetchAuthUserEmail(); // Get email dynamically
        if (!email) return; // Stop if no email is fetched

        const response = await axios.get(`/api/users?email=${email}`);
        if (response.data) {
            setUserData(response.data);
        } else {
            setError('User not found');
        }
    } catch (err) {
        console.error('Fetch User Error:', err);
        setError('Failed to fetch user data');
    }
};
  if (!doctor) return null;

  const {
    name = 'Doctor Name',
    specialization = 'Specialization',
    experience = 0,
    contact = 'Contact Number',
    email = 'email@example.com',
    consultationFee = 0,
    availableSlots = []
  } = doctor;

  const bookAppointment = async () => {
    if (!selectedDate || !selectedSlot) {
        return;
    }

    try {
        const email = await fetchAuthUserEmail(); // Fetch user email dynamically
        if (!email) {
            alert('Failed to retrieve user email');
            return;
        }

        const response = await fetch('/api/appointments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                appointmentAmount:consultationFee,
                // Send email to let the backend identify the user
                doctorId: doctor._id,
                date: selectedDate,
                timeSlot: selectedSlot,
            }),
        });

        if (response.ok) {
            alert('Appointment booked successfully!');
            setShowCalendar(false);
        } else {
            const errorData = await response.json();
            alert(`Failed to book appointment: ${errorData.error}`);
        }
    } catch (error) {
        console.error('Error booking appointment:', error);
        alert('Error booking appointment. Please try again.');
    }
};


  // Generate next 7 days for the calendar
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const timeSlots =availableSlots;

  return (

    <div className="relative">
      <div className="bg-gray-800 hover:shadow-xl transition-shadow p-6 flex flex-col rounded-lg shadow-md">
        {/* Header */}
        <div className="space-y-4 mb-4 text-center">
          <h2 className="text-2xl font-bold text-white">{name}</h2>
          <p className="text-blue-400 font-medium">{specialization}</p>
        </div>

        {/* Content */}
        <div className="flex-grow space-y-2 text-gray-300">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            <span>{experience} Years Experience</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span>{contact}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span className="truncate">{email}</span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            <span>Consultation Fee: ₹{consultationFee}</span>
          </div>
          <p className="text-sm">Available Slots: {availableSlots.length}</p>
        </div>

        {/* Footer */}
        <div className="mt-4">
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md text-sm w-full"
            onClick={() => setShowCalendar(true)}
          >
            Book Appointment
          </button>
        </div>
      </div>

      {/* Calendar Modal */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md relative">
            <button 
              onClick={() => setShowCalendar(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-xl font-bold text-white mb-4">Book Appointment</h3>
            
{/* Date Selection */}
<div className="mb-6 p-2">
  <h4 className="text-gray-300 mb-2 flex items-center gap-2 p-2">
    <Calendar className="w-4 h-4" />
    Select Date
  </h4>
  <div className="grid grid-cols-3 gap-2">
    {generateDates().map((date) => (
      <button
        key={date.toISOString()}
        onClick={() => setSelectedDate(date.toISOString())}
        className={`p-2 m-1 rounded text-sm ${
          selectedDate === date.toISOString()
            ? 'bg-blue-600 text-white'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
      >
        {date.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        })}
      </button>
    ))}
  </div>
</div>

{/* Time Slot Selection */}
{selectedDate && (
  <div className="mb-6">
    <h4 className="text-gray-300 mb-2 flex items-center gap-2 p-2">
      <Clock className="w-4 h-4" />
      Select Time
    </h4>
    <div className="grid grid-cols-3 gap-2">
      {timeSlots.map((slot) => (
        <button
          key={slot}
          onClick={() => setSelectedSlot(slot)}
          className={`p-2 m-1 rounded text-sm ${
            selectedSlot === slot
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          {slot}
        </button>
      ))}
    </div>
  </div>
)}


            {/* Confirm Button */}
            <button
              onClick={bookAppointment}
              disabled={!selectedDate || !selectedSlot}
              className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                selectedDate && selectedSlot
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-600 cursor-not-allowed'
              }`}
            >
              Confirm Booking

            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Grid Component to display all doctors
const DoctorsGrid = ({ doctors = [] }) => {
  if (!doctors.length) {
    return <div className="text-center p-6 text-white">No doctors found</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {doctors.map((doctor) => (
        <DoctorCard key={doctor._id} doctor={doctor} />
      ))}
    </div>
  );
};

export { DoctorCard, DoctorsGrid };