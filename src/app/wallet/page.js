"use client"

import { useState } from 'react';
import { Wallet } from 'lucide-react';

const fetchAuthUserEmail = async () => {
    try {
        const response = await fetch('/api/authUser');
        const data = await response.json();
        if (data && data.email) {
            return data.email;
        }
        return null;
    } catch (err) {
        console.error('AuthUser Fetch Error:', err);
        return null;
    }
};

export default function WalletPage() {
    const [email, setEmail] = useState('');
    const [walletAmount, setWalletAmount] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!email || !walletAmount) {
            setErrorMessage('Please provide both email and wallet amount.');
            setIsLoading(false);
            return;
        }

        const authEmail = await fetchAuthUserEmail();
        if (!authEmail) {
            setErrorMessage('Please enter a valid registered email address');
            setIsLoading(false);
            return;
        }

        if (email === authEmail) {
            try {
                const response = await fetch('/api/users', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, wallet: walletAmount }),
                });

                const data = await response.json();

                if (response.ok) {
                    setSuccessMessage(data.message || 'Wallet updated successfully');
                    setErrorMessage('');
                    setEmail('');
                    setWalletAmount('');
                } else {
                    setErrorMessage(data.error || 'Something went wrong');
                    setSuccessMessage('');
                }
            } catch (error) {
                setErrorMessage('Failed to update wallet. Please try again.');
                setSuccessMessage('');
            }
        } else {
            setErrorMessage('You can only update your own wallet. Please enter your registered email address.');
            setSuccessMessage('');
        }
        
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-900 p-4 md:p-6 lg:p-8">
            <div className="max-w-md mx-auto bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center space-x-2 mb-2">
                        <Wallet className="w-6 h-6 text-blue-400" />
                        <h1 className="text-2xl font-bold text-white">Update Wallet</h1>
                    </div>
                    <p className="text-gray-400">
                        Modify the wallet balance for your account
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label 
                            htmlFor="email" 
                            className="block text-sm font-medium text-gray-300"
                        >
                            Email address
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="user@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-white placeholder-gray-400"
                            required
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label 
                            htmlFor="walletAmount" 
                            className="block text-sm font-medium text-gray-300"
                        >
                            Wallet Amount
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                            <input
                                type="number"
                                id="walletAmount"
                                placeholder="0.00"
                                value={walletAmount}
                                onChange={(e) => setWalletAmount(e.target.value)}
                                className="w-full pl-8 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-white placeholder-gray-400"
                                step="0.01"
                                min="0"
                                required
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className={`w-full py-2 px-4 rounded-md text-white font-medium transition
                            ${isLoading 
                                ? 'bg-blue-500 opacity-50 cursor-not-allowed' 
                                : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
                            }`}
                    >
                        {isLoading ? 'Updating...' : 'Update Wallet'}
                    </button>
                </form>

                {/* Error Message */}
                {errorMessage && (
                    <div className="mt-4 p-4 bg-red-900/50 border border-red-700 rounded-md">
                        <p className="text-red-200 text-sm">{errorMessage}</p>
                    </div>
                )}

                {/* Success Message */}
                {successMessage && (
                    <div className="mt-4 p-4 bg-green-900/50 border border-green-700 rounded-md">
                        <p className="text-green-200 text-sm">{successMessage}</p>
                    </div>
                )}
            </div>
        </div>
    );
}