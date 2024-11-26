import { connect } from "@/dbConnection/dbConnection";
import Resume from "@/models/resumeModel";
import { NextResponse } from "next/server";

connect();

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const jobTitle = url.searchParams.get("jobTitle"); // Extract jobTitle from query params

    const query = jobTitle ? { jobTitle } : {};
    const resumes = await Resume.find(query).select("candidateName email s3Url jobTitle uploadedAt");

    if (!resumes.length) {
      return NextResponse.json(
        { success: false, message: "No resumes found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: resumes,
    });
  } catch (error) {
    console.error("Error fetching resumes:", error.message);
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}   
