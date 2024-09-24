"use client";
import React, { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const router = useRouter();
    const [data, setData] = useState("nothing");

    const getUserDetails = async () => {
        try {
            const response = await axios.post("/api/users/me");
            console.log(response.data);
            setData(response.data._id);
        } catch (error) {
            console.error('Error fetching user details:', error);
            toast.error('Failed to fetch user details');
        }
    };

    return (
        <div>
            <h1>Profile Page</h1>
            <p>User ID: {data}</p>
            <button onClick={getUserDetails}>Get User Details</button>
            <Link href="/">Go to Home</Link>
        </div>
    );
}
