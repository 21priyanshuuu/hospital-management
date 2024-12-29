'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {DoctorsGrid} from "../../component/Doctor";

const Dashboard = () => {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
  
    // Fetch AuthUser Email
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

    // Fetch User Data
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

    // Create or Update User
    const createUser = async () => {
        if (!userData) {
            setError('No user data available for creation');
            return;
        }

        try {
            const response = await axios.post('/api/users', {
                userId: userData.userId,
                name: userData.name,
                username: userData.username,
                email: userData.email,
                phone: userData.phone || '',
                wallet: userData.wallet ,
                isAdmin: userData.isAdmin || false,
                role: userData.role || 'patient',
            });

            if (response.data.message === 'User saved successfully') {
                setMessage('User created successfully');
            }
        } catch (err) {
            console.error('POST Error:', err);
            setError('Failed to create user');
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []); // Only run once when component mounts

    useEffect(() => {
        const fetchDoctors = async () => {
          try {
            const response = await axios.get('/api/doctors');
            setDoctors(response.data.data);
            setLoading(false);
          } catch (err) {
            setError(err.message);
            setLoading(false);
          }
        };
    
        fetchDoctors();
      }, []);
      console.log(doctors)
  
    return (
        <div className="p-4">
            {/* <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            {error && <p className="text-red-500">{error}</p>}
            {message && <p className="text-green-500">{message}</p>}
            
            {userData ? (
                <div>
                    <p><strong>Name:</strong> {userData.name}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>Role:</strong> {userData.role}</p>
                    <p><strong>Wallet:</strong> {userData.wallet}</p>
                    <button
                        onClick={createUser}
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Create User
                    </button>
                </div>
            ) : (
                <p>Loading user data...</p>
            )} */}
            <DoctorsGrid doctors={doctors} />
        </div>
    );
};

export default Dashboard;
