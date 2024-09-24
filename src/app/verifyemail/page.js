'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function VerifyEmailPage() {
    const [token, setToken] = useState('');
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        setError(false)
        // Extract token from URL
        const urlToken = new URLSearchParams(window.location.search).get('token');
        setToken(urlToken || '');
    }, []);

    useEffect(() => {
        setError(false)
        if (token) {
            verifyUserEmail();
        }
    }, [token]);

    const verifyUserEmail = async () => {
        try {
            await axios.post('/api/users/verifyemail', { token });
            setVerified(true);
            setError(false)
        } catch (error) {
            setError(true);
            console.error(error.response?.data || error.message);
        }
    };

    return (
        <main className="bg-black h-screen flex items-center justify-center">
            <div className="box-animate bg-[#f5f5f5] text-[#1b1b1b] flex items-center justify-center flex-col relative" style={{ backgroundImage: "url('/assets/loginimg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="absolute inset-0 bg-white opacity-80"></div>
                <div className="my-12 mx-12 relative z-10">
                    <h1 className="font-bold text-2xl flex items-center justify-center">Email Verification</h1>
                    <h2 className="text-xs mb-4 flex justify-center items-center mt-2">{token ? `Token: ${token}` : 'No verification token received'}</h2>
                    { verified && (
                        <div>
                            <h2>Email Verified Successfully!</h2>
                            <Link href="/login">
                                <a className="text-blue-500">Go to Login</a>
                            </Link>
                        </div>
                    )}

                    <div>
                        <h2>Email Verified Successfully</h2>
                        <Link href="/login" className="text-blue-500">
                                Go to Login
                            </Link>

                    </div>
                </div>
            </div>
        </main>
    );
}
