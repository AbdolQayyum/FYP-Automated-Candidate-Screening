"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const HRDashboard = () => {
  const [jobTitles, setJobTitles] = useState([]); // Stores job titles and descriptions
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error state

  const router = useRouter();

  // Fetch job titles and descriptions from the API
  useEffect(() => {
    const fetchJobTitles = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/hr/jobs`); // Fetch jobs
        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || "Failed to fetch job titles.");
        }

        setJobTitles(result.data); // Store jobs in state
      } catch (err) {
        console.error("Error fetching job titles:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobTitles();
  }, []);

  // Redirect to resumes page for the selected job
  const handleViewResumes = (jobTitle, jobDescription) => {
    router.push(`/HR/resumes?jobTitle=${encodeURIComponent(jobTitle)}&jobDescription=${encodeURIComponent(jobDescription)}`);
  };
  // State to manage description expansion
  const [expandedJobId, setExpandedJobId] = useState(null);

  // Function to toggle description expansion
  const toggleDescription = (jobId) => {
    setExpandedJobId(expandedJobId === jobId ? null : jobId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#162F65]"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 mt-8">{error}</div>;
  }

  return (
    <main className="flex flex-col items-center w-full min-h-screen px-6 mt-16 mb-16 bg-[#F9FAFB]">
      <motion.section
        className="container mx-auto mt-10 px-6"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-2xl font-bold text-[#1b1b1b] mb-4 text-center">Posting Jobs & View Resumes</h2>
        <p className="text-center mb-8 text-[#162F65]">
          Select a job title below to view the relevant resumes.
        </p>
        {jobTitles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {jobTitles.map((job) => (
              <motion.div
                key={job._id}
                className="flex flex-col bg-white p-6 rounded-lg shadow-md border border-gray-200 transition-transform duration-300 hover:scale-105"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="font-bold text-lg text-[#E8AF30]">
                  {job.title || "Untitled Role"}
                </h3>
                <div className="text-sm text-gray-600 mt-2">
                  <span className="font-bold text-[#162F65]">Description:</span>{" "}
                  {expandedJobId === job._id
                    ? job.description || "No description available."
                    : (job.description || "No description available.").slice(0, 100) + "..."}
                </div>
                {job.description && job.description.length > 100 && (
                  <button
                    onClick={() => toggleDescription(job._id)}
                    className="text-[#E8AF30] mt-2 underline"
                  >
                    {expandedJobId === job._id ? "Read Less" : "Read More"}
                  </button>
                )}

                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-bold text-[#162F65]">Location:</span>{" "}
                    {job.location || "Not specified"}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-bold text-[#162F65]">Posted:</span>{" "}
                    {job.postedAt ? new Date(job.postedAt).toLocaleDateString() : "Not available"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-bold text-[#162F65]">Type:</span>{" "}
                    {job.type || "Not specified"}
                  </p>
                </div>

                <Button
                  className="bg-[#F5D547] rounded-xl hover:bg-[#E8AF30] text-[#162F65] px-8 py-2 mt-4"
                  onClick={() => handleViewResumes(job.title, job.description)}
                >
                  Uploaded Resumes
                </Button>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No roles available.</p>
        )}
      </motion.section>
    </main>
  );
};

export default HRDashboard;
