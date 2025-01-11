// import jwt from "jsonwebtoken";

// /**
//  * Decodes the JWT token from cookies to retrieve user information.
//  * @param {NextRequest} req - The incoming request object.
//  * @returns {Object} - Decoded user data or null if not authenticated.
//  */
// export function getUserFromToken(req) {
//   const token = req.cookies.get("token");

//   if (!token) {
//     console.error("Token is missing from cookies.");
//     return null;
//   }

//   try {
//     // Verify and decode the JWT
//     const decoded = jwt.verify(token.value, process.env.TOKEN_SECRET);
//     console.log("Decoded token:", decoded);
//     return decoded; // Contains id, username, and email
//   } catch (error) {
//     console.error("Invalid or expired token:", error.message);
//     return null;
//   }
// }

import jwt from "jsonwebtoken";
import Resume from "@/models/resumeModel";

export async function decodeTokenAndFetchData(token, secret) {
  try {
    // Decode and verify the token
    const decoded = jwt.verify(token, secret);

    const { id: candidateId, username, email } = decoded;

    if (!candidateId) {
      return { error: "Candidate ID missing.", status: 400 };
    }

    // Fetch the job details from the Job model based on candidateId
    const job = await Resume.findOne({ candidateId }).select("jobTitle").lean();

    if (!job) {
      return { error: "No job found for the candidate.", status: 404 };
    }

    const jobTitle = job?.jobTitle || "Not Available";

    return {
      candidateId,
      username,
      email,
      jobTitle,
    };
  } catch (error) {
    return { error: "Unauthorized: Invalid token.", status: 401 };
  }
}
