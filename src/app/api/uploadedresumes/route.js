import { connect } from "@/dbConnection/dbConnection";
import Resume from "@/models/resumeModel";
import Job from "@/models/jobspostingModel";
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
    // JWT validation
    const token = req.cookies.get("token");
    if (!token || !token.value) {
      return createErrorResponse("Unauthorized: Token is missing.", 401);
    }

    let decoded;
    try {
      decoded = jwt.verify(token.value, process.env.TOKEN_SECRET);
    } catch (error) {
      console.error("Error verifying token:", error.message);
      return createErrorResponse("Unauthorized: Invalid or expired token.", 401);
    }

    const { id: candidateId } = decoded;
    console.log("Decoded candidateId:", candidateId);

    // Fetch resumes from MongoDB
    const resumes = await Resume.find({ candidateId }).lean();

    if (!resumes || resumes.length === 0) {
      return createErrorResponse("No resumes found for this candidate.", 404);
    }

    // Fetch related job details for each resume
    const jobIds = resumes.map((resume) => resume.jobId);
    const jobs = await Job.find({ _id: { $in: jobIds } }).lean();

    // Map job details to resumes
    const jobMap = jobs.reduce((acc, job) => {
      acc[job._id] = job;
      return acc;
    }, {});

    const responseData = resumes.map((resume) => ({
      jobId: resume.jobId,
      jobTitle: jobMap[resume.jobId]?.title || "Unknown Job",
      s3Url: resume.s3Url,
      uploadedAt: resume.uploadedAt,
    }));

    return NextResponse.json({
      message: "Resumes fetched successfully",
      success: true,
      resumes: responseData,
    });
  } catch (error) {
    console.error("Error fetching resumes:", error.message);
    return createErrorResponse("Internal server error.", 500);
  }
}
