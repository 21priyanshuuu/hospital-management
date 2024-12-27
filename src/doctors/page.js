'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

const DoctorsPage = () => {
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        // Fetch doctor list here
    }, []);

    return (
        <div>
            <h1>Doctors List</h1>
            <ul>
                {doctors.map((doctor) => (
                    <li key={doctor.id}>{doctor.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default DoctorsPage;
