"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaMapMarkerAlt, FaMoneyBillWave, FaClock } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion"; // Added for animations

export default function Browsejobs() {
  const [jobs, setJobs] = useState([]); // State that Stores fetched jobs
  const [loading, setLoading] = useState(true); 
  const router = useRouter(); 

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/hr/jobs');
        const data = await response.json();
        if (data.success) {
          setJobs(data.data);
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

  const handlePush = (id) => {
    console.log("Id: " + id)
    router.push(`/applyjobs/${id}`);
  };

  return (
    <main className="flex flex-col items-center justify-center w-full min-h-screen bg-[#E9ECEF]">
      {/* Job Search Section */}
      <motion.section
        className="container flex flex-col items-center mx-auto mt-16 mb-16 px-8 py-36 bg-[#162F65]"
        //  bg-cover bg-center bg-no-repeat
        // style={{ backgroundImage: 'url(/assets/browse3.jpeg)', minHeight: '400px' }} // Background image for the header section
        // initial={{ opacity: 0, y: -50 }}
        // whileInView={{ opacity: 1, y: 0 }}
        // transition={{ duration: 0.8 }}
      >
        <h1 className="font-bold text-4xl md:text-5xl mb-10 text-[#E9ECEF]">Find Jobs</h1>
        <div className="flex items-center w-full md:w-2/3 lg:w-1/2 mt-6 mb-16">
          <Input
            type="search"
            id="search"
            placeholder="Job Title | Keyword | Company"
            className="w-full rounded-xl border bg-[#E9ECEF] text-lg px-6 py-4 mr-2"
          />
          <Button
            type="submit"
            className="bg-[#E8AF30] text-[#162F65] text-lg px-6 py-4 rounded-xl hover:bg-[#9c9c9c] hover:text-[#162F65]"
          >
            Search
          </Button>
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
          ) : jobs.length === 0 ? (
            <p>No jobs found.</p>
          ) : (
            jobs.map((job) => (
              <motion.div
                key={job._id}
                className="flex flex-col bg-white p-6 rounded-lg shadow-md border border-gray-200 transition-transform duration-300 hover:scale-105"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="font-bold text-lg text-[#162F65]">{job.title}</h3>
                <div className="mt-4">
                  <div className="flex items-center mb-2">
                    <FaMapMarkerAlt className="text-[#E8AF30] mr-2" />
                    <span className="font-bold text-[#162F65]">Location:</span> <span>{job.location}</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <FaMoneyBillWave className="text-[#E8AF30] mr-2" />
                    <span className="font-bold text-[#162F65]">Salary:</span> <span>{job.salaryRange.min}K - {job.salaryRange.max}K</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <FaClock className="text-[#E8AF30] mr-2" />
                    <span className="font-bold text-[#162F65]">Date:</span> <span>{new Date(job.postedAt).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <span className="font-bold text-[#162F65]">Job Type:</span> <span>{job.type}</span>
                  </div>
                </div>

                <Button
                  className="bg-[#E8AF30] rounded-xl hover:bg-[#9c9c9c] text-[#162F65] px-8 py-2 mt-4 transition-all"
                  onClick={() => handlePush(job._id)} // Updated to use dynamic route
                >
                  Apply
                </Button>
              </motion.div>
            ))
          )}
        </div>

        <div className="flex justify-center mt-8">
          <Button className="bg-[#E8AF30] rounded-xl border border-[#E8AF30] hover:bg-[#9c9c9c] hover:text-[#162F65] font-bold px-8 py-4 transition-transform duration-300 ease-in-out transform hover:scale-105">
            Load More...
          </Button>
        </div>
      </motion.section>
    </main>
  );
}
