"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FaMapMarkerAlt, FaMoneyBillWave, FaClock } from 'react-icons/fa'; 

const JOBS_PER_PAGE = 4; 

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/hr/jobs'); // Adjust this URL to match your API
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

  // Calculate total pages
  const totalPages = Math.ceil(jobs.length / JOBS_PER_PAGE);

  // Get jobs for the current page
  const currentJobs = jobs.slice((currentPage - 1) * JOBS_PER_PAGE, currentPage * JOBS_PER_PAGE);

  return (
    <main className="flex flex-col items-center justify-center w-full min-h-screen bg-[#E9ECEF]">
      {/* Section 1 */}
      <section className="container flex flex-col md:flex-row mx-auto h-screen mb-10">
        <div className="flex flex-col justify-center md:order-1 md:w-1/2 md:ml-8">
          <h1 className="font-bold text-3xl md:text-4xl lg:text-4xl mb-4">
            There Are <span style={{ color: 'blue' }}>500</span> Posting Here For You!
          </h1>
          <p className="text-sm mb-4">
            Empower yourself with the tools and resources you need to land your dream job. Our platform connects talented individuals with leading employers, making it easier than ever to find the perfect job match. Take control of your career and start exploring our job listings today!
          </p>

          <div className="flex items-center mt-2 mb-2 mr-3">
            <Input
              type="search"
              id="search"
              placeholder="  Job Title, Keyword or Company"
              className="w-full rounded-xl border mr-2 bg-slate-70"
            />
            <Button type="submit" className="w-auto bg-[#1b1b1b] rounded-xl border hover:bg-[#9c9c9c] hover:text-[#1b1b1b]">
              Find Jobs
            </Button>
          </div>
        </div>

        <div className="relative flex justify-end md:order-2 w-full md:w-1/2 mt-20">
          <div className="absolute mr-10" style={{ top: '4rem' }}>
            <div className="w-96 h-96 rounded-full bg-[#869dd7]"></div>
          </div>
          <div>
            <Image
              className="relative object-fit"
              src="/assets/profileremove.png"
              alt="profile image"
              width={450}
              height={450}
            />
          </div>
        </div>
      </section>

      {/* Section 2 */}
      <section className="container flex flex-col items-center justify-center mt-8 mb-8">
        <div className="flex flex-col items-center justify-center">
          <h1 className="font-bold text-2xl md:text-3xl lg:text-4xl mb-4 mt-4">
            Latest Jobs
          </h1>
          <p className="text-x">
            Recognize your value and pursue a career that aligns with your aspirations
          </p>
        </div>

        <div className="container grid grid-cols-1 md:grid-cols-2 gap-4 py-4 px-2 rounded-lg mt-7">
          {loading ? (
            <p>Loading jobs...</p>
          ) : currentJobs.length === 0 ? (
            <p>No jobs found.</p>
          ) : (
            currentJobs.map((job) => (
              <div key={job._id} className="box2-animate bg-[#b9f1ef] p-6 rounded-lg shadow-lg flex items-center space-x-4">
                <div className="info-section flex flex-col space-y-2">
                  <div className='flex flex-row items-center'>
                    {/* Uncomment this to show the company logo */}
                    {/* <Image
                      className="rounded-full w-24 h-24 object-cover"
                      src={job.companyLogo}
                      alt="Company Logo"
                      width={500}
                      height={500}
                    /> */}
                    <h3 className="font-bold text-xl ml-4">{job.title}</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-x-8 px-8 md:px-20">
                    <div>
                      <span className="text-gray-600 block">
                        <FaMapMarkerAlt className="inline mr-1" />
                        <span className="font-bold">Location:</span> {job.location}
                      </span>
                      <span className="text-gray-600 block">
                        <FaMoneyBillWave className="inline mr-1" />
                        <span className="font-bold">Salary:</span> {job.salaryRange.min}k - {job.salaryRange.max}k (PKR)
                      </span>
                    </div>
                    <div>
                      <span className="text-green-600 block">
                        <span className="font-bold">Type:</span> {job.type}
                      </span>
                      <span className="text-gray-600 block">
                        <FaClock className="inline mr-1" />
                        <span className="font-bold">Date:</span> {new Date(job.postedAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between mt-4">
          <Button 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(prev => prev - 1)} 
            className="mr-2"
          >
            Previous
          </Button>
          <Button 
            disabled={currentPage === totalPages} 
            onClick={() => setCurrentPage(prev => prev + 1)} 
            className="ml-2"
          >
            Next
          </Button>
        </div>
      </section>

      {/* Featured Companies */}
      <section className="container flex flex-col items-center justify-center mt-8">
        <div className="flex flex-col items-center justify-center">
          <h1 className="font-bold text-2xl md:text-3xl lg:text-4xl mb-4 mt-4">
            Featured Companies 
          </h1>
          <p className="text-x">
            Recognize your value and pursue a career that aligns with your aspirations
          </p>
        </div>

        <div className='flex flex-row space-x-12 mt-6 mb-8 '>
          <div className="box3-animate flex flex-col items-center box bg-black rounded-full border-black mt-8 mb-8">
            <Image
              className="object-fit"
              src="/assets/netsol.jpg" 
              alt="Profile Image"
              width={200}
              height={200}
            />
            <div className='text-xl font-bold text-center text-[#f5f5f5] bg-[#1b1b1b] w-full'>
              <h3 className="text-xl font-bold p-1">NETSOL</h3>
            </div>
          </div>

          <div className="box3-animate flex flex-col items-center box bg-black rounded-md border-black mt-8 mb-8">
            <Image
              className="object-fit"
              src="/assets/techno.jpg" 
              alt="Profile Image"
              width={200}
              height={200}
            />
            <div className='text-xl font-bold text-center text-[#f5f5f5] bg-[#1b1b1b] w-full'>
              <h3 className="text-xl font-bold p-1">TECHNOLOGICX</h3>
            </div>
          </div>

          <div className="box3-animate flex flex-col items-center box bg-black rounded-md border-black mt-8 mb-8">
            <Image
              className="object-fit"
              src="/assets/conard.jpg" 
              alt="Profile Image"
              width={200}
              height={200}
            />
            <div className='text-xl font-bold text-center text-[#f5f5f5] bg-[#1b1b1b] w-full'>
              <h3 className="text-xl font-bold p-1">CONARD</h3>
            </div>
          </div>

          <div className="box3-animate flex flex-col items-center box bg-black rounded-md border-black mt-8 mb-8">
            <Image
              className="object-fit"
              src="/assets/arbisoft.jpg" 
              alt="Profile Image"
              width={200}
              height={200}
            />
            <div className='text-xl font-bold text-center text-[#f5f5f5] bg-[#1b1b1b] w-full'>
              <h3 className="text-xl font-bold p-1">ARBISOFT</h3>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
