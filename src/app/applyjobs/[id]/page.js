"use client";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { FiUpload } from "react-icons/fi";
import { Button } from "@/components/ui/button";

const ApplyJobs = () => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [resume, setResume] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const { id: jobId } = useParams();
  const fileInputRef = useRef(null);

  // Fetch job details
  useEffect(() => {
    if (!jobId) return;

    const fetchJobDetails = async () => {
      try {
        const response = await fetch(`/api/hr/jobs?id=${jobId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch job with ID: ${jobId}`);
        }

        const result = await response.json();
        if (result.success) {
          setJob(result.data);
        } else {
          setError(result.message || "Failed to load job details.");
        }
      } catch (error) {
        setError("Error fetching job details: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
    setUploadProgress(0); // Reset progress when a new file is selected
  };

  const handleUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async () => {
    if (!resume) {
      alert("Please select a resume to upload.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("jobTitle", job?.title);

    try {
      const response = await fetch(`/api/users/applyjobs/${jobId}`, {
        method: "POST",
        body: formData,
        credentials: "include", // Ensure cookies are sent with the request
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload resume.");
      }

      const result = await response.json();
      alert(result.message || "Resume uploaded successfully.");
    } catch (err) {
      console.error("Error uploading resume:", err);
      alert(err.message || "Failed to upload resume.");
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#457B9D]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-red-600 font-bold">{error}</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-gray-500 font-semibold">No job found for the given ID.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      {/* Job Title */}
      <h1 className="text-3xl font-bold text-[#1D3557]">{job.title}</h1>

      {/* Job Details */}
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-4 space-y-4 overflow-y-auto">
        <p><strong className="text-[#457B9D]">Location:</strong> {job.location}</p>
        <p><strong className="text-[#457B9D]">Type:</strong> {job.type}</p>
        <p><strong className="text-[#457B9D]">Salary:</strong> ${job.salaryRange.min} - ${job.salaryRange.max}</p>
        <div>
          <h2 className="text-lg font-semibold text-[#1D3557] mb-1">Description</h2>
          <p className="text-sm text-gray-700 leading-tight">{job.description}</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-[#1D3557] mb-1">Requirements</h2>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            {job.requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-[#1D3557] mb-1">Responsibilities</h2>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            {job.responsibilities.map((resp, index) => (
              <li key={index}>{resp}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Upload Section */}
      <div className="mt-4 text-center">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".pdf, .doc, .docx"
          onChange={handleFileChange}
        />
        <Button
          onClick={handleUpload}
          className="inline-flex items-center px-4 py-2 bg-[#E8AF30] text-black rounded-xl border hover:bg-[#EFF0F2]"
          disabled={isUploading}
        >
          <FiUpload size={18} />
          <span className="ml-2">Upload Resume</span>
        </Button>
        <Button
          onClick={handleSubmit}
          className="mt-2 bg-[#E8AF30] text-black rounded-xl border hover:bg-[#EFF0F2]"
          disabled={isUploading}
        >
          {isUploading ? `Uploading... ${Math.round(uploadProgress)}%` : "Submit Resume"}
        </Button>
        {isUploading && (
          <div className="w-full max-w-md bg-gray-300 rounded-full h-2.5 mt-4">
            <div
              className="bg-[#457B9D] h-2.5 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplyJobs;
