import { connect } from "@/dbConnection/dbConnection";
import Resume from "@/models/resumeModel";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

// Connect to the database
connect();

// Utility for error responses
function createErrorResponse(message, status) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET(req) {
  try {
    // Get the token from cookies
    const token = req.cookies.get("token");
    
    // Check if token exists
    if (!token || !token.value) {
      console.error("Token is missing in request.");
      return createErrorResponse("Unauthorized: Token is missing.", 401);
    }

    // Decode the JWT token
    let decoded;
    try {
      decoded = jwt.verify(token.value, process.env.TOKEN_SECRET);
      console.log("Decoded Token:", decoded); // Log the decoded token for debugging
    } catch (error) {
      console.error("Error verifying token:", error.message);
      return createErrorResponse("Unauthorized: Invalid token.", 401);
    }

    // Extract candidateId from the decoded token
    const { id: candidateId } = decoded;

    // Ensure candidateId exists in token
    if (!candidateId) {
      console.error("Candidate ID is missing in the token.", decoded);
      return createErrorResponse("Candidate ID missing.", 400);
    }

    // Fetch resumes for the candidate from the database
    const resumes = await Resume.find({ candidateId }).lean();
    if (!resumes || resumes.length === 0) {
      console.error("No resumes found for candidate:", candidateId);
      return createErrorResponse("No resumes found.", 404);
    }

    console.log("Fetched resumes:", resumes);

    // Return the resumes in the response
    return NextResponse.json({
      success: true,
      resumes,
    });
  } catch (error) {
    console.error("Error in GET /api/users/uploadedresumes:", error.message);
    return createErrorResponse("Internal server error.", 500);
  }
}
