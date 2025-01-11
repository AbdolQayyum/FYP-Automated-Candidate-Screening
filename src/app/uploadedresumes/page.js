'use client';

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const UploadedResumes = () => {
  const [resumes, setResumes] = useState([]);
  const [candidateName, setCandidateName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await fetch("/api/users/uploadedresumes", {
          method: "GET",
          credentials: "include", // Include cookies for authentication
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch resumes");
        }

        setResumes(data.resumes);
        setCandidateName(data.resumes[0]?.candidateName || "Candidate");
      } catch (err) {
        setError(err.message);
      }
    };

    fetchResumes();
  }, []);


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <main className="flex flex-col items-center w-full min-h-screen px-6 py-10 bg-gradient-to-br from-[#F9FAFB] to-[#F3F4F6] mt-14">
      <motion.section
        className="container mx-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
      >
        {/* Improved Heading */}
        <h1 className="text-center text-4xl font-bold mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#1b1b1b] to-[#162F65]">
            {candidateName}, Your Uploaded Resumes
          </span>
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Review the resumes you've submitted for different job applications.
        </p>

        {resumes.length > 0 ? (
          <motion.div
            className="flex flex-col gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {resumes.map((resume, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-transform duration-300"
                variants={itemVariants}
              >
                {/* Grid Layout for Job Title and Uploaded On */}
                <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
                  {/* Job Title */}
                  <h2 className="text-xl font-semibold text-[#162F65]">
                    {resume.jobTitle}
                  </h2>
                  {/* Uploaded On */}
                  <p className="text-sm text-gray-600">
                    <span className="font-bold text-[#162F65]">Uploaded On:</span>{" "}
                    {new Date(resume.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
                {/* Resume Link */}
                <div className="mt-4">
                  <a
                    href={resume.s3Url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-gradient-to-r from-[#F5D547] to-[#E8AF30] text-[#162F65] px-6 py-2 rounded-full text-sm font-medium shadow hover:shadow-lg transition-all hover:scale-105"
                  >
                    View Resume
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center mt-16">
            <img
              src="/no-resumes.svg"
              alt="No resumes found"
              className="w-48 mb-6"
            />
            <p className="text-lg text-gray-500">
              No resumes found. Start uploading now!
            </p>
          </div>
        )}
      </motion.section>
    </main>
  );
};

export default UploadedResumes;
