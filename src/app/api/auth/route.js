import { connect } from "@/dbConnection/dbConnection";
import Notification from "@/models/notificationModel"; // Import the notification model
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

// Connect to the database
connect();

function createErrorResponse(message, status) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET(req) {
  try {
    const token = req.cookies.get("token");

    if (!token || !token.value) {
      return createErrorResponse("Unauthorized: Token is missing.", 401);
    }

    let decoded;
    try {
      decoded = jwt.verify(token.value, process.env.TOKEN_SECRET);
      console.log('Decoded token:', decoded); // Debugging
    } catch (error) {
      return createErrorResponse("Unauthorized: Invalid token.", 401);
    }

    const { id: candidateId, email, candidateName } = decoded;

    // Ensure `candidateId` is included in the response
    if (!candidateId) {
      console.error('Candidate ID is missing in decoded token:', decoded);
      return createErrorResponse('Candidate ID missing.', 400);
    }
    
    const notification = await Notification.findOne({ candidateId })
      .populate("jobTitle")
      .sort({ createdAt: -1 })
      .lean();
    
    if (!notification) {
      console.error('No notification found for candidateId:', candidateId);
      return createErrorResponse('Notification not found.', 404);
    }
    
    const jobTitle = notification.jobTitle || "Not Available";
    
    // Create the response object
    const userDetails = {
      candidateId, // Include `candidateId` here
      candidateName: candidateName || 'Not Available',
      email: email || 'Not Available',
      jobTitle,
    };
    
    console.log('User details being sent:', userDetails);
    
    return NextResponse.json(userDetails, { status: 200 });
    
  } catch (error) {
    console.error("Error fetching details:", error);
    return createErrorResponse("Internal server error.", 500);
  }
}
