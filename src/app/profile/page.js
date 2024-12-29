"use client"
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const PaymentModal = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState('');

  const handlePayment = () => {
    console.log('Processing payment for amount:', amount);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-80 relative">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>
        
        <h2 className="text-xl font-bold mb-4 text-white">Add Money</h2>
        
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-white">
            Enter Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-400">₹</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full p-2 pl-8 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
            />
          </div>
        </div>

        <button
          onClick={handlePayment}
          className="w-full py-3 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
};

const CreateProjectModal = () => {
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('IN');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchAuthUserEmail = async () => {
    try {
      const response = await fetch('/api/authUser');
      if (!response.ok) throw new Error('Failed to fetch auth user');
      const data = await response.json();
      
      if (data && data.email) {
        return data.email;
      } else {
        throw new Error('Email not found in AuthUser response');
      }
    } catch (err) {
      console.error('AuthUser Fetch Error:', err);
      setError('Failed to fetch AuthUser details');
      return null;
    }
  };

  const fetchUserData = async () => {
    try {
      const email = await fetchAuthUserEmail();
      if (!email) return;

      const response = await fetch(`/api/users?email=${email}`);
      if (!response.ok) throw new Error('Failed to fetch user data');
      const data = await response.json();
      
      if (data) {
        setUserData(data);
      } else {
        setError('User not found');
      }
    } catch (err) {
      console.error('Fetch User Error:', err);
      setError('Failed to fetch user data');
    }
  };

  const createUser = async () => {
    if (!userData) {
      setError('No user data available for creation');
      return;
    }

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userData.userId,
          name: userData.name,
          username: userData.username,
          email: userData.email,
          phone: phoneNumber,
          address: address,
          isAdmin: userData.isAdmin || false,
          role: userData.role || 'patient',
        }),
      });

      if (!response.ok) throw new Error('Failed to create user');
      const data = await response.json();

      if (data.message === 'User saved successfully') {
        setMessage('User details updated successfully');
        setIsSubmitted(true);
      }
    } catch (err) {
      console.error('POST Error:', err);
      setError('Failed to update user details');
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setPhoneNumber(value);
  };

  const handleSubmitDetails = async () => {
    if (!phoneNumber || !address) return;
    
    setIsLoading(true);
    setError('');
    setMessage('');
    
    try {
      await createUser();
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateDetails = () => {
    setIsSubmitted(false);
    setMessage('');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <div className="bg-gray-900 text-blue p-6 rounded-lg shadow-lg w-96">
        <h5 className="text-xl font-bold mb-2 text-white">Create project</h5>
        <p className="text-sm text-gray-400 mb-4">
          Deploy your new project in one-click.
        </p>
       
        {error && (
          <div className="mb-4 p-2 bg-red-900/50 border border-red-500 rounded text-red-200 text-sm">
            {error}
          </div>
        )}
        
        {message && (
          <div className="mb-4 p-2 bg-green-900/50 border border-green-500 rounded text-green-200 text-sm">
            {message}
          </div>
        )}

        <div className="mb-4">
          <div className="flex gap-2">
            <select 
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="bg-gray-800 text-white border border-gray-700 rounded px-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
              disabled={isSubmitted}
            >
              <option value="IN">🇮🇳 +91</option>
              <option value="US">🇺🇸 +1</option>
              <option value="UK">🇬🇧 +44</option>
              <option value="AU">🇦🇺 +61</option>
            </select>
            <input
              type="tel"
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={handlePhoneChange}
              className="flex-1 p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
              maxLength="15"
              disabled={isSubmitted}
            />
          </div>
        </div>
       
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-white">Address</label>
          <input
            type="text"
            placeholder="ex:-kandivali east"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
            disabled={isSubmitted}
          />
        </div>

        <div className="flex justify-between items-center mt-6 space-x-2">
          <button 
            className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white flex-1 disabled:opacity-50"
            onClick={() => setIsSubmitted(false)}
            disabled={isLoading}
          >
            Cancel
          </button>
          {!isSubmitted ? (
            <button
              onClick={handleSubmitDetails}
              disabled={!phoneNumber || !address || isLoading}
              className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed flex-1"
            >
              {isLoading ? 'Submitting...' : 'Submit Details'}
            </button>
          ) : (
            <button
              onClick={handleUpdateDetails}
              disabled={isLoading}
              className="px-4 py-2 rounded bg-yellow-600 hover:bg-yellow-700 text-white flex-1 disabled:opacity-50"
            >
              Update Details
            </button>
          )}
        </div>
      </div>

      <PaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)} 
      />
    </div>
  );
};

export default CreateProjectModal;
