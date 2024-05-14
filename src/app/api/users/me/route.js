import { connect } from '@/dbConnection/dbConnection';
import User from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';
import { getDataFromToken } from '@/lib/getDataFromToken';

connect();

/**
 * Handles the POST request.
 * @param {NextRequest} request - The incoming request object.
 * @returns {Promise<NextResponse>} A promise that resolves to a response object.
 */

export async function POST(request) {
    try {
        // Extract data from token
        const userId = await getDataFromToken(request);

        // Find user by userId
        const user = await User.findById(userId).select("-password");

        // Check if user exists
        if (!user) {
            return NextResponse.json({
                message: "User not found",
                error: "User not found",
            }, { status: 404 });
        }

        // Return user data
        return NextResponse.json({
            message: "User found",
            data: user,
        });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
