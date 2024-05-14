import { NextRequest, NextResponse } from 'next/server';

/**
 * Handles the GET request for logout.
 * @param {NextRequest} request - The incoming request object.
 * @returns {Promise<NextResponse>} A promise that resolves to a response object.
 */
export async function GET(request) {
  try {
    // No need to access the token value, just set it to expire
    const response = NextResponse.json({
      message: "Logout Successful",
      success: true,
    });

    response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0), // Set expiry to past date to invalidate
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
