import React from 'react';
import Image from 'next/image';
import { FaMapMarkerAlt, FaMoneyBillWave, FaClock } from 'react-icons/fa'; // Importing icons
import { Button } from '@/components/ui/button';

export default function Companies() {
  return (
    <main className="flex flex-col items-center justify-center w-full min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      {/* Overview and Company Info Section */}
      <section className="container mx-auto mt-16 mb-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Overview */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-2xl transition-shadow duration-300 ease-in-out">
          <h2 className="font-bold text-2xl mb-4 text-gray-800">Overview</h2>
          <p className="text-gray-600 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin tempor orci at arcu dictum, in viverra erat finibus.
          </p>
        </div>

        {/* Company Info */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-2xl transition-shadow duration-300 ease-in-out md:col-span-1">
          <div className="flex flex-col items-center text-center">
            <Image
              className="rounded-full"
              src="/assets/company_logo.png" // Replace with dynamic logo if needed
              alt="Company Logo"
              width={80}
              height={80}
            />
            <a
              href="https://companywebsite.com"
              className="mt-4 text-blue-600 font-semibold hover:underline hover:text-blue-500 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit our website
            </a>
            <div className="mt-6 text-gray-600">
              <p><strong>Location:</strong> Lahore, Pakistan</p>
              <p><strong>Email:</strong> info@company.com</p>
              <p><strong>Category:</strong> Technology, Product, Agency</p>
            </div>
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="container mx-auto px-4 mt-10">
        <h2 className="font-bold text-3xl text-gray-800 mb-6">Open Positions</h2>
        <div className="grid grid-cols-1 gap-6">
          {/* Job Card */}
          {[
            { title: 'Software Engineer (Android), Libraries', location: 'Lahore, PK', salary: '55K - 70K', time: '9 hours ago', fullTime: 'Full Time' },
            { title: 'App Development', location: 'Lahore, PK', salary: '55K - 70K', time: '9 hours ago', fullTime: 'Full Time' },
            { title: 'Machine Learning Engineer', location: 'Lahore, PK', salary: '52K - 71K', time: '5 hours ago', fullTime: 'Full Time' }
          ].map((job, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md border border-gray-200"
            >
              {/* Left Section: Logo and Job Title */}
              <div className="flex items-center">
                <Image
                  className="rounded-full"
                  src="/assets/company_logo.png" // Replace with dynamic logo if needed
                  alt="Company Logo"
                  width={50}
                  height={50}
                />
                <div className="ml-4">
                  <h3 className="font-bold text-lg text-gray-800">{job.title}</h3>
                  <p className="text-sm text-gray-500">by Conrad Labs</p>
                </div>
              </div>

              {/* Middle Section: Job Details in 2 Rows */}
              <div className="flex flex-col text-gray-600">
                <div className="flex items-center space-x-8">
                  <div className="flex items-center space-x-2">
                    <FaMapMarkerAlt className="text-black" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaMoneyBillWave className="text-black" />
                    <span>{job.salary}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-8 mt-2">
                  <div className="flex items-center space-x-2">
                    <span>{job.fullTime}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaClock className="text-black" />
                    <span>{job.time}</span>
                  </div>
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
