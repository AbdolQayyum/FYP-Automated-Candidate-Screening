import React from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FaMapMarkerAlt, FaMoneyBillWave, FaClock } from 'react-icons/fa'; // Importing icons

export default function Browsejobs() {
  return (
    <main className="flex flex-col items-center justify-center w-full min-h-screen bg-[#E9ECEF]">
      {/* Job Search Section */}
      <section
        className="container flex flex-col items-center mx-auto mt-16 mb-16 px-4 py-24 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/assets/profile2.jpg)', minHeight: '400px' }} // Background image with increased height
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
        <h2 className="font-bold text-2xl md:text-3xl mb-6">Available Jobs</h2>
        <div className="container grid grid-cols-1 gap-6 py-4 px-2">
          {/* Job Cards */}
          {[
            { title: 'Software Engineer (Android), Libraries', location: 'Lahore, PK', salary: '55K - 70K', time: '9 hours ago', fullTime: 'Full Time' },
            { title: 'App Development', location: 'Lahore, PK', salary: '55K - 70K', time: '9 hours ago', fullTime: 'Full Time' },
            { title: 'Machine Learning Engineer', location: 'Lahore, PK', salary: '52K - 71K', time: '5 hours ago', fullTime: 'Full Time' }
          ].map((job, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-white p-6 rounded-lg shadow-md border border-gray-200"
            >
              {/* Left Section: Logo */}
              <div className="flex items-center">
                <Image
                  className="rounded-full"
                  src="/assets/arbisoft.jpg" // Replace with dynamic logo as needed
                  alt="Company Logo"
                  width={50}
                  height={50}
                />
              </div>

              {/* Middle Section: Job Details */}
              <div className="ml-4 flex-1">
                <h3 className="font-bold text-lg text-gray-800">{job.title}</h3>
                <div className="flex items-center space-x-8 mt-2 text-gray-600">
                  <div className="flex items-center space-x-2">
                    <FaMapMarkerAlt />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaMoneyBillWave />
                    <span>{job.salary}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaClock />
                    <span>{job.time}</span>
                  </div>
                </div>
                <div className="text-gray-600 mt-2">
                  <span>{job.fullTime}</span>
                </div>
              </div>

              {/* Right Section: Apply Button */}
              <Button className="bg-black text-white rounded-full px-8 py-2 hover:bg-gray-800 transition-all">
                Apply
              </Button>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="flex justify-center mt-8">
          <Button className="bg-black hover:bg-gray-800 text-white font-bold rounded-full px-8 py-4 transition-transform duration-300 ease-in-out transform hover:scale-105">
            Load More...
          </Button>
        </div>
      </section>
    </main>
  );
}
