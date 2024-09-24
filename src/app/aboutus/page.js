"use client"
import React, { useState } from 'react';

export default function AboutUs() {
  // State to track which accordion item is open
  const [openSection, setOpenSection] = useState(null);

  // Function to toggle the accordion sections
  const toggleSection = (section) => {
    if (openSection === section) {
      setOpenSection(null); // Close if already open
    } else {
      setOpenSection(section); // Open the selected section
    }
  };

  return (
    <main className="flex flex-col items-center justify-center w-full min-h-screen bg-[#FFFFFF]">
      {/* Section: Left side with large text */}
      <section className="container flex flex-col md:flex-row mx-auto py-10">
        <div className="md:w-1/2 flex items-center justify-center p-8">
          <h1 className="font-serif font-bold text-4xl md:text-5xl lg:text-6xl leading-snug">
            We’ve been helping customers globally.
          </h1>
        </div>

        {/* Section: Right side with accordions */}
        <div className="md:w-1/2 flex flex-col justify-start p-8">
          {/* Accordion Item: Who we are? */}
          <div className="border-t border-b py-4 cursor-pointer" onClick={() => toggleSection('whoWeAre')}>
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-xl">Who we are?</h2>
              <span className="text-green-600 text-2xl">
                {openSection === 'whoWeAre' ? '⌃' : '⌄'}
              </span> {/* Arrow icon */}
            </div>
            {openSection === 'whoWeAre' && (
              <p className="mt-2 text-gray-600">
                Our founders Dustin Moskovitz and Justin lorem Rosenstein met while leading Engineering teams at Facebook. Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </p>
            )}
          </div>

          {/* Accordion Item: What's our goal? */}
          <div className="border-t border-b py-4 mt-4 cursor-pointer" onClick={() => toggleSection('ourGoal')}>
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-xl">What’s our goal?</h2>
              <span className="text-green-600 text-2xl">
                {openSection === 'ourGoal' ? '⌃' : '⌄'}
              </span> {/* Arrow icon */}
            </div>
            {openSection === 'ourGoal' && (
              <p className="mt-2 text-gray-600">
                Our goal is to empower teams to work more effectively and achieve greater productivity through collaboration.
              </p>
            )}
          </div>

          {/* Accordion Item: Our vision */}
          <div className="border-t border-b py-4 mt-4 cursor-pointer" onClick={() => toggleSection('ourVision')}>
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-xl">Our vision</h2>
              <span className="text-green-600 text-2xl">
                {openSection === 'ourVision' ? '⌃' : '⌄'}
              </span> {/* Arrow icon */}
            </div>
            {openSection === 'ourVision' && (
              <p className="mt-2 text-gray-600">
                We envision a world where teams of all sizes can work together seamlessly to bring their best ideas to life.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* New Section: Statistics */}
      <section className="w-full bg-gray-100 py-10">
        <div className="container mx-auto flex flex-col md:flex-row justify-around items-center">
          <div className="text-center md:text-left p-4">
            <h2 className="text-3xl font-bold">2K Active Users</h2>
            <p>2000 daily active users</p>
          </div>
          <div className="text-center md:text-left p-4">
            <h2 className="text-3xl font-bold">500+ Open Jobs</h2>
            <p>Over 500 open job positions</p>
          </div>
        </div>
      </section>

      {/* New Section: How it works */}
      <section className="w-full py-10">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-bold mb-6">How it works?</h2>
          <div className="flex flex-col md:flex-row justify-around items-center">
            <div className="p-4">
              <img src="/icons/create-account.svg" alt="Create Account" className="mx-auto mb-2"/>
              <p>Create Account</p>
            </div>
            <div className="p-4">
              <img src="/icons/complete-profile.svg" alt="Complete your profile" className="mx-auto mb-2"/>
              <p>Complete your profile</p>
            </div>
            <div className="p-4">
              <img src="/icons/apply-job.svg" alt="Apply and get your dream job" className="mx-auto mb-2"/>
              <p>Apply and get your dream job</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
