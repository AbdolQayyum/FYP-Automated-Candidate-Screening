"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaMapMarkerAlt, FaMoneyBillWave, FaClock } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Browsejobs() {
  const [jobs, setJobs] = useState([]); // State to store fetched jobs
  const [filteredJobs, setFilteredJobs] = useState([]); // State to store filtered jobs
  const [visibleJobs, setVisibleJobs] = useState(3); // Initial number of jobs to show
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true); 
  const router = useRouter();

  // Fetch jobs when the component mounts
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/hr/jobs');
        const data = await response.json();
        if (data.success) {
          setJobs(data.data);
          setFilteredJobs(data.data); // Initialize with all jobs
        } else {
          console.error('Failed to fetch jobs');
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Handle search input
  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = jobs.filter(job => 
      (job.title && job.title.toLowerCase().includes(term)) ||
      (job.location && job.location.toLowerCase().includes(term)) ||
      (job.type && job.type.toLowerCase().includes(term)) ||
      (job.company && job.company.toLowerCase().includes(term))
    );

    setFilteredJobs(filtered);
    setVisibleJobs(6); // Reset visible jobs on each search
  };

  // Handle navigation to job application page
  const handlePush = (id) => {
    router.push(`/applyjobs/${id}`); // Corrected URL syntax
  };

  // Handle "Load More" button
  const handleLoadMore = () => {
    if (visibleJobs < filteredJobs.length) {
      setVisibleJobs(filteredJobs.length); // Show all jobs
    }
  };

  return (
    <main className="flex flex-col items-center justify-center w-full min-h-screen bg-[#E9ECEF]">
      {/* Job Search Section */}
      <motion.section
        className="container flex flex-col items-center mx-auto mt-16 mb-16 px-8 py-36 bg-[#2B4A87] relative overflow-hidden"
        style={{ minHeight: '500px' }}
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat filter blur-lg"
          style={{ backgroundImage: 'url(/assets/bjobs.jpeg)' }}
        ></div>

        <div className="relative z-10 flex flex-col items-center text-center px-6">
          <h1 className="font-extrabold text-4xl md:text-5xl mb-4 italic text-[#162F65]">Find Jobs</h1>
          
          <p className="text-lg md:text-xl text-[#1b1b1b] max-w-2xl mb-10 italic">
            Discover your next opportunity and explore new career paths with ease. Search for the perfect job that aligns with your skills, interests, and aspirations. Let’s make that dream role a reality!
          </p>

          <div className="flex items-center w-full max-w-lg mt-4 mb-16">
            <Input
              type="search"
              id="search"
              placeholder="Job Title | Keyword | Company"
              className="w-full rounded-l-xl border bg-[#E9ECEF] text-lg px-6 py-4 mr-2"
              value={searchTerm}
              onChange={handleSearch}
            />
            <Button
              type="submit"
              className="bg-[#E8AF30] text-[#162F65] text-lg px-6 py-4 rounded-r-xl hover:bg-[#9c9c9c] hover:text-[#162F65]"
            >
              Search
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Available Jobs Section */}
      <motion.section
        className="container flex flex-col items-center mx-auto mb-10 px-4"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="font-bold text-2xl md:text-3xl mb-6 text-[#162F65]">Available Jobs</h2>
        <div className="container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 py-4 px-2">
          {/* Job Cards */}
          {loading ? (
            <p>Loading jobs...</p>
          ) : filteredJobs.length === 0 ? (
            <p>No jobs found.</p>
          ) : (
            filteredJobs.slice(0, visibleJobs).map((job) => (
              <motion.div
                key={job._id}
                className="flex flex-col bg-white p-6 rounded-lg shadow-md border border-gray-200 transition-transform duration-300 hover:scale-105"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="font-bold text-lg text-[#162F65]">{job.title || "Untitled Job"}</h3>
                <div className="mt-4">
                  <div className="flex items-center mb-2">
                    <FaMapMarkerAlt className="text-[#E8AF30] mr-2" />
                    <span className="font-bold text-[#162F65]">Location:</span> <span>{job.location || "Not specified"}</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <FaMoneyBillWave className="text-[#E8AF30] mr-2" />
                    <span className="font-bold text-[#162F65]">Salary:</span> <span>{job.salaryRange ? `${job.salaryRange.min}K - ${job.salaryRange.max}K` : "Not specified"}</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <FaClock className="text-[#E8AF30] mr-2" />
                    <span className="font-bold text-[#162F65]">Date:</span> <span>{job.postedAt ? new Date(job.postedAt).toLocaleString() : "Not available"}</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <span className="font-bold text-[#162F65]">Job Type:</span> <span>{job.type || "Not specified"}</span>
                  </div>
                </div>

                <Button
                  className="bg-[#E8AF30] rounded-xl hover:bg-[#9c9c9c] text-[#162F65] px-8 py-2 mt-4 transition-all"
                  onClick={() => handlePush(job._id)}
                >
                  Apply
                </Button>
              </motion.div>
            ))
          )}
        </div>

        {/* Load More Button */}
        <div className="flex justify-center mt-8">
          <Button
            className="bg-[#E8AF30] rounded-xl border border-[#E8AF30] font-bold px-8 py-4 transition-transform duration-300 ease-in-out transform hover:scale-105"
            onClick={handleLoadMore}
            disabled={visibleJobs >= filteredJobs.length}
          >
            {visibleJobs >= filteredJobs.length ? "No more jobs" : "Load More..."}
          </Button>
        </div>
      </motion.section>
    </main>
  );
}
