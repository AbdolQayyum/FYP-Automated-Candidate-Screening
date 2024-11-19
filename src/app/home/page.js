"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaMapMarkerAlt, FaMoneyBillWave, FaClock } from "react-icons/fa";
import { motion } from "framer-motion";

const JOBS_PER_PAGE = 4;

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("/api/hr/jobs");
        const data = await response.json();
        if (data.success) {
          setJobs(data.data);
        } else {
          console.error("Failed to fetch jobs");
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Calculate total pages
  const totalPages = Math.ceil(jobs.length / JOBS_PER_PAGE);

  // Get jobs for the current page
  const currentJobs = jobs.slice(
    (currentPage - 1) * JOBS_PER_PAGE,
    currentPage * JOBS_PER_PAGE
  );

  return (
    <main className="flex flex-col items-center justify-center w-full min-h-screen bg-[#E9ECEF] relative z-0 mt-14">
      {/* Navbar */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#2B4A87] text-[#EFF0F2]">
        {/* Add your Navbar content here */}
        Navbar Content
      </header>

      {/* Section 1: Hero Section */}
      <motion.section
        className="container flex flex-col md:flex-row mx-auto h-screen mb-4 p-2 relative z-20"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex flex-col justify-center md:order-1 md:w-1/2 md:ml-8">
          <h1 className="font-semibold text-4xl md:text-4xl lg:text-4xl mb-4 text-[#1b1b1b]">
            There are <span style={{ color: "#2B4A87", fontWeight: "900" }}>500</span> Posting Here For You!
          </h1>

          <p className="text-sm mb-4 text-[#1b1b1b] max-w-lg">
            Empower yourself with the tools and resources you need to land your
            dream job. Our platform connects talented individuals with leading
            employers, making it easier than ever to find the perfect job match.
            Take control of your career and start exploring our job listings
            today!
          </p>

          <div className="flex items-center mb-2 mr-3 mt-2">
            <Input
              type="search"
              id="search"
              placeholder="  Job Title, Keyword or Company"
              className="w-full rounded-xl border mr-2 bg-slate-100"
            />
            <Button
              type="submit"
              className="w-auto bg-[#E8AF30] text-[#1b1b1b] rounded-xl border hover:bg-[#EFF0F2] hover:text-[#1b1b1b]"
            >
              Find Jobs
            </Button>
          </div>
        </div>

        <div className="relative flex justify-end md:order-2 w-full md:w-1/2">
          <div className="absolute mr-10" style={{ top: "4rem" }}>
            <div className="w-96 h-96 rounded-full bg-[#2B4A87] z-10"></div>
          </div>
          <div className="z-20">
            <Image
              className="relative object-cover"
              src="/assets/profileremove.png"
              alt="profile image"
              width={450}
              height={450}
            />
          </div>
        </div>
      </motion.section>

      {/* Section 2: Latest Jobs */}
      <motion.section
        className="container flex flex-col items-center justify-center mt-8 mb-8 py-8 px-4 rounded-xl relative z-5"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col items-center justify-center">
          <h1 className="font-bold text-2xl md:text-3xl lg:text-4xl mb-4 mt-8 text-[#1b1b1b]">
            Latest Jobs
          </h1>
          <p className="text-[#1b1b1b] italic text-center px-4 sm:px-0">
            Recognize your value and pursue a career that aligns with your aspirations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 px-8 rounded-lg mt-7 w-full max-w-5xl">
          {loading ? (
            <p className="text-[#1b1b1b]">Loading jobs...</p>
          ) : currentJobs.length === 0 ? (
            <p className="text-[#1b1b1b]">No jobs found.</p>
          ) : (
            currentJobs.map((job) => (
              <div
                key={job._id}
                className="bg-[#bce2e0] p-4 md:p-6 rounded-lg border hover:shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full"
              >
                <div className="info-section flex flex-col space-y-2 text-[#2B4A87]">
                  <div className="flex flex-row italic items-center text-[#1b1b1b]">
                    <h3 className="font-bold text-xl ml-4">{job.title}</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 px-4 md:px-10">
                    <div>
                      <span className="block">
                        <FaMapMarkerAlt className="inline mr-1" />
                        <span className="font-bold text-[#4A90E2]">Location:</span> {job.location}
                      </span>
                      <span className="block">
                        <FaMoneyBillWave className="inline mr-1" />
                        <span className="font-bold text-[#50C878]">Salary:</span> {job.salaryRange.min} -{" "}
                        {job.salaryRange.max}
                      </span>
                    </div>
                    <div>
                      <span className="block">
                        <span className="font-bold text-[#FF7F50]">Type:</span> {job.type}
                      </span>
                      <span className="block">
                        <FaClock className="inline mr-1" />
                        <span className="font-bold text-[#423b6d]">Date:</span>{" "}
                        {new Date(job.postedAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center sm:justify-between mt-6 flex-wrap">
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="mr-2 bg-[#E8AF30] text-[#2B4A87]"
          >
            Previous
          </Button>
          <Button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="ml-2 bg-[#E8AF30] text-[#2B4A87]"
          >
            Next
          </Button>
        </div>
      </motion.section>

      {/* Featured Languages */}
      <motion.section
        className="container flex flex-col items-center justify-center mt-8 relative z-5"
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.7 }}
      >
        <div className="flex flex-col items-center justify-center">
          <h1 className="font-bold text-2xl md:text-3xl lg:text-4xl mb-4 mt-4 text-[#1b1b1b]">
            Languages
          </h1>
          <p className="text-[#1b1b1b] italic text-center">
            Recognize your value and pursue a career that aligns with your aspirations
          </p>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-8 mt-6 mb-8">
          {/* Language Boxes */}
          <div className="box3-animate flex flex-col items-center bg-[#E8AF30] rounded-full border-black p-4 m-4 text-center">
            <Image
              className="object-cover"
              src="/assets/python.jpeg"
              alt="Python"
              width={200}
              height={200}
            />
            <h3 className="text-xl font-bold text-center text-[#EFF0F2] bg-[#E8AF30] w-full p-1">
              Python
            </h3>
          </div>

          <div className="box3-animate flex flex-col items-center bg-[#E8AF30] rounded-md border-black p-4 m-4 text-center">
            <Image
              className="object-cover"
              src="/assets/javascript.png"
              alt="JavaScript"
              width={200}
              height={200}
            />
            <h3 className="text-xl font-bold text-center text-[#EFF0F2] bg-[#E8AF30] w-full p-1">
              JavaScript
            </h3>
          </div>

          <div className="box3-animate flex flex-col items-center bg-[#E8AF30] rounded-md border-black p-4 m-4 text-center">
            <Image
              className="object-cover"
              src="/assets/java2.png"
              alt="Java"
              width={200}
              height={200}
            />
            <h3 className="text-xl font-bold text-center text-[#EFF0F2] bg-[#E8AF30] w-full p-1">
              Java
            </h3>
          </div>

          <div className="box3-animate flex flex-col items-center bg-[#E8AF30] rounded-md border-black p-4 m-4 text-center">
            <Image
              className="object-cover"
              src="/assets/csharp.png"
              alt="C#"
              width={200}
              height={200}
            />
            <h3 className="text-xl font-bold text-center text-[#EFF0F2] bg-[#E8AF30] w-full p-1">
              C#
            </h3>
          </div>
        </div>
      </motion.section>
    </main>
  );
}
