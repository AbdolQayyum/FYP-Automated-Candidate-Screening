"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from "next/navigation"; 

const ApplyJobs = () => {
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { id: jobId } = useParams(); 

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
          const job = result.data;
          setJob({
            title: job.title || "",
            location: job.location || "",
            salaryRange: {
              min: job.salaryRange?.min || "",
              max: job.salaryRange?.max || ""
            },
            description: job.description || "",
            requirements: job.requirements || [],
            responsibilities: job.responsibilities || [],
            type: job.type || "",
          });
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
  
  if (loading) {
    console.log("Loading job details...");
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    console.error("Error occurred:", error);
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!job) {
    console.warn("No job found for the given ID");
    return (
      <div className="flex justify-center items-center h-screen">
        <p>No job found.</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="p-6 max-w-lg bg-white rounded-lg shadow-md">
        <h1 className="font-bold text-3xl text-center mb-4 text-gray-800">{job.title}</h1>
        <p className="mb-2"><strong>Location:</strong> {job.location}</p>
        <p className="mb-2"><strong>Type:</strong> {job.type}</p>
        <p className="mb-4"><strong>Salary:</strong> {job.salaryRange.min} - {job.salaryRange.max}</p>
        <div className="mb-4">
          <h2 className="font-bold text-xl mb-2">Description</h2>
          <p>{job.description}</p>
        </div>
        <div className="mb-4">
          <h2 className="font-bold text-xl mb-2">Requirements</h2>
          <ul className="list-disc list-inside">
            {job.requirements.map((requirement, index) => (
              <li key={index}>{requirement}</li>
            ))}
          </ul>
        </div>
        <div className="mb-4">
          <h2 className="font-bold text-xl mb-2">Responsibilities</h2>
          <ul className="list-disc list-inside">
            {job.responsibilities.map((responsibility, index) => (
              <li key={index}>{responsibility}</li>
            ))}
          </ul>
        </div>
        <form className="mt-6 text-center">
          <input type="file" className="border p-2 mb-4 w-full" accept=".pdf, .doc, .docx" required />
          <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
            Upload Resume
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplyJobs;
