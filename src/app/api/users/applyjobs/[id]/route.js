import { connect } from "@/dbConnection/dbConnection";
import Resume from "@/models/resumeModel";
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

export async function POST(req) {
  try {
    const token = req.cookies.get("token"); // Extract token from cookies
    if (!token || !token.value) {
      return NextResponse.json(
        { error: "Unauthorized: Token is missing." },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token.value, process.env.TOKEN_SECRET);
    } catch (error) {
      console.error("Error verifying token:", error.message);
      return NextResponse.json(
        { error: "Unauthorized: Invalid or expired token." },
        { status: 401 }
      );
    }

    const { candidateName, email } = decoded; // Extract candidate details from token
    console.log("Decoded token:", decoded);

    const formData = await req.formData();
    const resumeFile = formData.get("resume");
    const jobTitle = formData.get("jobTitle");

    if (!resumeFile || !jobTitle) {
      return NextResponse.json(
        { error: "Missing required fields: resume or jobTitle" },
        { status: 400 }
      );
    }

    // File validation
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

    if (resumeFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds the 10MB limit." },
        { status: 400 }
      );
    }

    if (!allowedTypes.includes(resumeFile.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only PDF, DOC, and DOCX are allowed." },
        { status: 400 }
      );
    }

    const fileBuffer = Buffer.from(await resumeFile.arrayBuffer());
    const fileName = `${jobTitle}/${Date.now()}_${resumeFile.name}`;
    const bucketName = process.env.AWS_BUCKET_NAME;

    // Upload file to S3 with public-read permissions
    console.log("Uploading file to S3...");
    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: fileBuffer,
        ContentType: resumeFile.type,
        // ACL: "public-read",
      })
    );

    const s3Url = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    // Save resume metadata to MongoDB
    const resume = new Resume({
      jobTitle,
      fileName,
      s3Url,
      uploadedAt: new Date(),
      candidateName,
      email,
    });

    await resume.save();

    return NextResponse.json({
      message: "Resume uploaded successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error in upload process:", error.message);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
