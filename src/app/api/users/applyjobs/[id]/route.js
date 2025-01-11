import { connect } from "@/dbConnection/dbConnection";
import Resume from "@/models/resumeModel";
import Job from "@/models/jobspostingModel"
import User from "@/models/userModel"

import jwt from "jsonwebtoken";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

connect();

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Utility for error responses
function createErrorResponse(message, status) {
  return NextResponse.json({ error: message }, { status });
}

// Retry mechanism for S3 upload
async function uploadToS3(params, retries = 3) {
  try {
    await s3Client.send(new PutObjectCommand(params));
  } catch (error) {
    if (retries === 0) throw error;
    console.warn(`Retrying S3 upload... (${3 - retries + 1}/3)`);
    await uploadToS3(params, retries - 1);
  }
}

export async function POST(req) {
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

    const {id : candidateId, candidateName, email} = decoded;
    console.log("Decoded JWT payload:", decoded);

    // Extract form data
    const formData = await req.formData();
    const resumeFile = formData.get("resume");
    const jobId = formData.get("jobId");
    const jobTitle = formData.get("jobTitle");
  

    if (!resumeFile || !jobId || !jobTitle) {
      return createErrorResponse("Missing required fields: resume, jobId, or jobTitle or candidateId", 400);
    }

    // Log received data
    console.log("Received data:", { jobId, jobTitle, candidateName, email, candidateId });

    // Validate jobId format
    const jobIdRegex = /^[a-zA-Z0-9_-]+$/;
    if (!jobIdRegex.test(jobId)) {
      console.error("Invalid jobId format:", jobId);
      return createErrorResponse("Invalid jobId format.", 400);
    }

    // File validation
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (resumeFile.size > MAX_FILE_SIZE) {
      return createErrorResponse("File size exceeds the 10MB limit.", 400);
    }

    if (!allowedTypes.includes(resumeFile.type)) {
      return createErrorResponse("Invalid file type. Only PDF, DOC, and DOCX are allowed.", 400);
    }

    // S3 upload
    const fileBuffer = Buffer.from(await resumeFile.arrayBuffer());
    const fileName = `${jobId}/${jobTitle}/${Date.now()}_${resumeFile.name}`;
    const bucketName = process.env.AWS_BUCKET_NAME;

    console.log("Uploading file to S3...");
    await uploadToS3({
      Bucket: bucketName,
      Key: fileName,
      Body: fileBuffer,
      ContentType: resumeFile.type,
    });

    const s3Url = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    // Log MongoDB data
    console.log("Data to be saved to MongoDB:", {
      jobId,
      jobTitle,
      fileName,
      s3Url,
      candidateName,
      email,
      candidateId,
    });

    // Save to MongoDB
    const resume = new Resume({
      jobId,
      jobTitle,
      fileName,
      s3Url,
      uploadedAt: new Date(),
      candidateName,
      email,
      candidateId
    });

    try {
      await resume.save();
      console.log("Resume saved successfully to MongoDB.");
    } catch (err) {
      console.error("Error saving resume to MongoDB:", err);
      return createErrorResponse("Error saving resume to database.", 500);
    }

    return NextResponse.json({
      message: "Resume uploaded successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error in upload process:", error.message);
    return createErrorResponse("Internal server error.", 500);
  }
}
