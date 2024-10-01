"use client";
import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FaMapMarkerAlt, FaMoneyBillWave, FaClock } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

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
          setJobs(data.data); // Store jobs in state
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

  return (
    <main className="flex flex-col items-center justify-center w-full min-h-screen bg-[#E9ECEF]">
      {/* Job Search Section */}
      <section
        className="container flex flex-col items-center mx-auto mt-16 mb-16 px-4 py-24 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/assets/profile2.jpg)', minHeight: '400px' }} // Background image for the header section
      >
        <h1 className="font-bold text-4xl md:text-5xl mb-10 text-white">Find Jobs</h1>
        <div className="flex items-center w-full md:w-2/3 lg:w-1/2 mt-6 mb-16">
          <Input
            type="search"
            id="search"
            placeholder="Job Title | Keyword | Company"
            className="w-full rounded-xl border bg-white text-lg px-6 py-4 mr-2"
          />
          <Button type="submit" className="bg-[#1b1b1b] text-lg px-6 py-4 rounded-xl hover:bg-[#9c9c9c] hover:text-[#1b1b1b]">
            Search
          </Button>
        </div>
      </section>

      {/* Available Jobs Section */}
      <section className="container flex flex-col items-center mx-auto mb-10 px-4">
        <h2 className="font-bold text-2xl md:text-3xl mb-6 text-[#1b1b1b]">Available Jobs</h2>
        <div className="container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 py-4 px-2">
          {/* Job Cards */}
          {loading ? (
            <p>Loading jobs...</p>
          ) : jobs.length === 0 ? (
            <p>No jobs found.</p>
          ) : (
            jobs.map((job) => (
              <div
                key={job._id}
                className="flex flex-col bg-white p-6 rounded-lg shadow-md border border-gray-200 transition-transform duration-300 hover:scale-105"
              >
                <h3 className="font-bold text-lg text-[#237195]">{job.title}</h3>
                <div className="mt-4">
                 
                  <div className="flex items-center mb-2">
                    <FaMapMarkerAlt className="text-[#278e27] mr-2" />
                    <span className="font-bold text-[#9daf2a]">Location:</span> <span>{job.location}</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <FaMoneyBillWave className="text-[#278e27] mr-2" />
                    <span className="font-bold text-[#9daf2a]">Salary:</span> <span>{job.salaryRange.min}K - {job.salaryRange.max}K</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <FaClock className="text-[#278e27] mr-2" />
                    <span className="font-bold text-[#9daf2a]">Date:</span> <span>{new Date(job.postedAt).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <span className="font-bold text-[#9daf2a]">Job Type:</span> <span>{job.type}</span>
                  </div>
                </div>

                
                <Button 
                  className="bg-[#1b1b1b] rounded-xl border border-black hover:bg-[#9c9c9c] hover:text-[#1b1b1b] px-8 py-2 mt-4 transition-all"
                  onClick={() => router.push(`/applyjobs?id=${job._id}`)} // Navigate to ApplyJobs page
                >
                  Apply
                </Button>
              </div>
            ))
          )}
        </div>

        
        <div className="flex justify-center mt-8">
          <Button className="bg-[#1b1b1b] rounded-xl border border-black hover:bg-[#9c9c9c] hover:text-[#1b1b1b] font-bold px-8 py-4 transition-transform duration-300 ease-in-out transform hover:scale-105">
            Load More...
          </Button>
        </div>
      </section>
    </main>
  );
}
