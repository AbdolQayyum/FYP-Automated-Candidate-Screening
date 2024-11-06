"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion'; // Added for animations

export default function AboutUs() {
  // State to track which accordion item is open
  const [openSection, setOpenSection] = useState(null);

  // Function to toggle the accordion sections
  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <main className="flex flex-col items-center justify-center w-full min-h-screen bg-[#E9ECEF] mt-5 py-5">
      
      {/* Section: Left side with large text */}
      <motion.section
        className="container flex flex-col md:flex-row mx-auto py-10"
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="md:w-1/2 flex items-center justify-center p-8">
          <h1 className="font-serif font-bold text-4xl md:text-5xl lg:text-6xl leading-snug text-[#162F65]">
          <span className="text-[#E8AF30]">We’ve been helping customers globally.</span> 
          </h1>
        </div>

        {/* Section: Right side with accordions */}
        <div className="md:w-1/2 flex flex-col justify-start p-8">
          {/* Accordion Item: Who we are? - Always open */}
          <div className="border-t border-b py-4">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-xl text-[#162F65]">Who we are?</h2>
              <span className="text-[#E8AF30] text-2xl">⌃</span>
            </div>
            <p className="mt-2 text-gray-600">
              Our founders <span className="text-[#E8AF30]">Dustin Moskovitz</span> and <span className="text-[#E8AF30]">Justin Rosenstein</span> met while leading Engineering teams at Facebook.
            </p>
          </div>

          {/* Accordion Item: What's our goal? */}
          <div className="border-t border-b py-4 mt-4 cursor-pointer" onClick={() => toggleSection('ourGoal')}>
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-xl text-[#162F65]">What’s our goal?</h2>
              <span className="text-[#E8AF30] text-2xl">
                {openSection === 'ourGoal' ? '⌃' : '⌄'}
              </span>
            </div>
            {openSection === 'ourGoal' && (
              <motion.p
                className="mt-2 text-gray-600"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                Our goal is to <span className="text-[#E8AF30]">empower teams</span> to work more effectively and achieve greater productivity through collaboration.
              </motion.p>
            )}
          </div>

          {/* Accordion Item: Our vision */}
          <div className="border-t border-b py-4 mt-4 cursor-pointer" onClick={() => toggleSection('ourVision')}>
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-xl text-[#162F65]">Our vision</h2>
              <span className="text-[#E8AF30] text-2xl">
                {openSection === 'ourVision' ? '⌃' : '⌄'}
              </span>
            </div>
            {openSection === 'ourVision' && (
              <motion.p
                className="mt-2 text-gray-600"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                We envision a world where <span className="text-[#E8AF30]">teams of all sizes</span> can work together seamlessly to bring their best ideas to life.
              </motion.p>
            )}
          </div>
        </div>
      </motion.section>

      {/* New Section: Statistics */}
      <motion.section
        className="w-full bg-gray-100 py-10"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto flex flex-col md:flex-row justify-around items-center">
          <div className="text-center md:text-left p-4">
            <h2 className="text-3xl font-bold text-[#162F65]">
              <span className="text-[#E8AF30]">2K</span> Active Users
            </h2>
            <p className="text-[#162F65]">2000 daily active users</p>
          </div>
          <div className="text-center md:text-left p-4">
            <h2 className="text-3xl font-bold text-[#162F65]">
              <span className="text-[#E8AF30]">500+</span> Open Jobs
            </h2>
            <p className="text-[#162F65]">Over 500 open job positions</p>
          </div>
        </div>
      </motion.section>

      {/* New Section: How it works */}
      <motion.section
        className="w-full py-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-bold mb-6 text-[#162F65]">How it works?</h2>
          <div className="flex flex-col md:flex-row justify-around items-center">
            <motion.div className="p-4" whileHover={{ scale: 1.1 }}>
              <img src="/icons/create-account.svg" alt="Create Account" className="mx-auto mb-2"/>
              <p className="text-[#162F65]">
                <span className="text-[#E8AF30]">Create</span> Account
              </p>
            </motion.div>
            <motion.div className="p-4" whileHover={{ scale: 1.1 }}>
              <img src="/icons/complete-profile.svg" alt="Complete your profile" className="mx-auto mb-2"/>
              <p className="text-[#162F65]">
                <span className="text-[#E8AF30]">Complete</span> your profile
              </p>
            </motion.div>
            <motion.div className="p-4" whileHover={{ scale: 1.1 }}>
              <img src="/icons/apply-job.svg" alt="Apply and get your dream job" className="mx-auto mb-2"/>
              <p className="text-[#162F65]">
                <span className="text-[#E8AF30]">Apply</span> and get your dream job
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </main>
  );
}
