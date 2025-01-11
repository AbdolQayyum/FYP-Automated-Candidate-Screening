'use client';
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { FiUpload } from "react-icons/fi";
import { Button } from "@/components/ui/button";

const ApplyJobs = () => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [resume, setResume] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploaded, setIsUploaded] = useState(false);

  const { id: jobId } = useParams();
  const fileInputRef = useRef(null);

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
    const selectedFile = e.target.files[0];
    setResume(selectedFile);
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
    if (!job?.title || !jobId) {
      alert("Missing job details. Please refresh the page.");
      return;
    }
    setIsUploading(true);
    setIsUploaded(false);

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("jobTitle", job.title || "");
    formData.append("jobId", jobId || "");
    

    try {
      const response = await fetch(`/api/users/applyjobs/${jobId}`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload resume.");
      }

      const result = await response.json();
      setIsUploaded(true);
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
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#162F65]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-red-600 font-bold">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#E9ECEF] mt-10">
      <div className="justify-center items-center shadow-lg rounded-lg w-full space-y-6 mt-4 p-4">
        <div className="h-[400px] overflow-y-auto border rounded-md bg-gray-100 p-10">
          <h1 className="text-3xl font-bold text-center text-[#2B4A87] mb-4">{job.title}</h1>
          <div className="space-y-4">
            <div className="flex justify-between">
              <p className="font-semibold text-[#1b1b1b]">Location:</p>
              <p>{job.location}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-semibold text-[#1b1b1b]">Type:</p>
              <p>{job.type}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-semibold text-[#1b1b1b]">Salary:</p>
              <p>${job.salaryRange.min} - ${job.salaryRange.max}</p>
            </div>
          </div>
          <div className="mt-6">
            <h2 className="font-bold text-lg mb-2">Job Description</h2>
            <p className="text-gray-600">{job.description}</p>
          </div>
          <div className="mt-4">
            <h2 className="font-bold text-lg mb-2">Responsibilities</h2>
            <ul className="list-disc pl-6 text-gray-600">
              {job.responsibilities.map((resp, index) => (
                <li key={index}>{resp}</li>
              ))}
            </ul>
          </div>
          <div className="mt-4">
            <h2 className="font-bold text-lg mb-2">Requirements</h2>
            <ul className="list-disc pl-6 text-gray-600">
              {job.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".pdf, .doc, .docx"
            onChange={handleFileChange}
          />
          <Button
            onClick={handleUpload}
            className="flex items-center px-6 py-3 bg-[#E8AF30] text-white rounded-md border hover:bg-[#2B4A87]"
            disabled={isUploading}
          >
            <FiUpload size={20} />
            <span className="ml-2">Upload Resume</span>
          </Button>

          {isUploading && (
            <div className="w-full">
              <div className="relative pt-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs">Uploading...</span>
                  <span className="font-semibold text-xs">{uploadProgress}%</span>
                </div>
                <div className="bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-[#162F65] h-4 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <Button
            onClick={handleSubmit}
            className="px-6 py-3 bg-[#E8AF30] text-white rounded-md hover:bg-[#2B4A87]"
            disabled={isUploading || isUploaded}
          >
            {isUploading ? "Uploading..." : isUploaded ? "Upload Complete" : "Submit Resume"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApplyJobs;
