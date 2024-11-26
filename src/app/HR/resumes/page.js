"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

const ResumesPage = () => {
  const searchParams = useSearchParams();
  const jobTitle = searchParams.get("jobTitle"); // Extract `jobTitle` from URL
  const [jobDescription, setJobDescription] = useState(""); // Store job description
  const [resumes, setResumes] = useState([]); // Store resumes
  const [shortlisted, setShortlisted] = useState([]); // Store shortlisted resumes
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error state

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  // Fetch resumes and job description from the backend
  useEffect(() => {
    const fetchResumes = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/hr/displayresumes?jobTitle=${encodeURIComponent(jobTitle)}`
        );
        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || "Failed to fetch resumes.");
        }

        setJobDescription(result.jobDescription); // Set job description
        setResumes(result.data); // Set resumes
      } catch (err) {
        console.error("Error fetching resumes:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (jobTitle) {
      fetchResumes();
    }
  }, [jobTitle]);

  // Handle shortlisting resumes
  const handleShortlist = async () => {
    setLoading(true);
    setError("");

    const payload = {
      jobDescription: jobDescription, // Include job description
      resumes: resumes.map((resume) => ({
        candidateName: resume.candidateName || "Unknown", // Fallback to avoid missing fields
        email: resume.email || "Unknown",
        s3Url: resume.s3Url || "",
        resumeText: resume.resumeText || "",
      })),
    };

    console.log("Sending payload:", JSON.stringify(payload, null, 2));

    try {
      const response = await fetch(`${API_URL}/api/shortlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("Response Status:", response.status);

      if (!response.ok) {
        const errorDetails = await response.json();
        console.error("Error details from server:", errorDetails);
        throw new Error(errorDetails.detail || "Failed to shortlist resumes.");
      }

      const result = await response.json();
      setShortlisted(result.shortlistedResumes || []);
    } catch (err) {
      console.error("Error shortlisting resumes:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-8">
        An error occurred: {error}. Please try again later.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 mt-16 px-10 mb-16 bg-[#F9FAFB] shadow-lg rounded-xl max-w-6xl">
      <h1 className="text-2xl font-bold text-center text-[#E8AF30] mt-8 mb-8">
        {jobTitle} :<span className="text-[#2B4A87]"> Resumes</span>
      </h1>

      {/* Display Job Description */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-bold text-[#162F65]">Job Description</h2>
        <p className="text-gray-600 mt-2">{jobDescription || "No description available."}</p>
      </div>

      {/* Render Resumes */}
      {shortlisted.length > 0 ? (
        <div>
          <h2 className="text-xl text-center text-green-600 font-bold mb-4">
            Shortlisted Resumes:
          </h2>
          <div className="flex flex-col space-y-4">
            {shortlisted.map((resume, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row items-center justify-between bg-green-200 border-green-500 rounded-lg p-4 shadow-md"
              >
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-green-700">
                    {resume.candidateName}
                  </h2>
                  <p className="text-gray-600">
                    <strong>Email:</strong> {resume.email}
                  </p>
                  <p className="text-gray-600">
                    <strong>Overall Score:</strong> {resume.overallScore}%
                  </p>
                </div>
                <div className="mt-4 sm:mt-0">
                  <Button
                    onClick={() =>
                      window.open(resume.s3Url, "_blank", "noopener noreferrer")
                    }
                    className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition"
                  >
                    View Resume
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : resumes.length === 0 ? (
        <p className="text-center text-red-500">No resumes found.</p>
      ) : (
        <div className="flex flex-col space-y-4">
          {resumes.map((resume, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row items-center justify-between bg-gray-200 border-gray-500 rounded-lg p-4 shadow-md"
            >
              <div className="flex-1">
                <h2 className="text-xl font-bold text-[#2B4A87]">
                  {resume.candidateName}
                </h2>
                <p className="text-gray-600">
                  <strong>Email:</strong> {resume.email}
                </p>
                <p className="text-gray-600">
                  <strong>Uploaded At:</strong>{" "}
                  {new Date(resume.uploadedAt).toLocaleString()}
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <Button
                  onClick={() =>
                    window.open(resume.s3Url, "_blank", "noopener noreferrer")
                  }
                  className="bg-[#2B4A87] text-white px-4 py-2 rounded-md hover:bg-[#E8AF30] transition"
                >
                  View Resume
                </Button>
              </div>
            </div>
          ))}
          <Button
            className="w-full bg-[#F5D547] text-[#162F65] py-3 rounded-lg font-semibold hover:bg-[#E8AF30] transition mt-6"
            onClick={handleShortlist}
          >
            Shortlist
          </Button>
        </div>
      )}
    </div>
  );
};

export default ResumesPage;
