import { NextRequest } from "next/server";
import jwt from 'jsonwebtoken';

/**
 * Handles the POST request.
 * @param {NextRequest} request - The incoming request object.
 * @returns {Promise<NextResponse>} A promise that resolves to a response object.
 */


export const getDataFromToken = (request) => {
    try {
      // Check if token cookie exists before accessing its value
      const token = request.cookies.get("token")?.value || "";
  
      if (!token) {
        // Handle missing token case (e.g., return appropriate error response)
        throw new Error('Missing token in request');
      }
  
      const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
      return decodedToken.id;
    } catch (error) {
      console.error('Error decoding token:', error.message);
      throw new Error('Invalid or missing token'); // Provide a more informative message
    }
  };
  