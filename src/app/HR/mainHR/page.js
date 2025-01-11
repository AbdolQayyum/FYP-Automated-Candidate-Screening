'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function Addjobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(5); // Number of jobs per page

  const router = useRouter();

  const handlePostJobClick = () => {
    router.push('/HR/addjobs');
  };

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

  // Handle Delete
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this job?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/hr/jobs/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        setJobs(jobs.filter((job) => job._id !== id));
        toast.success('Job deleted successfully!');
      } else {
        toast.error(data.message || 'Failed to delete job');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Server error while deleting job');
    }
  };

  // Handle Edit - Redirect to Edit Page with Job ID
  const handleEdit = (id) => {
    router.push(`/HR/addjobs/${id}`);
  };

 // Pagination Logic
const indexOfLastJob = currentPage * jobsPerPage;
const indexOfFirstJob = indexOfLastJob - jobsPerPage;

// Check if jobs is an array and not empty, then slice
const currentJobs = Array.isArray(jobs) ? jobs.slice(indexOfFirstJob, indexOfLastJob) : [];

const totalPages = Math.ceil(jobs.length / jobsPerPage);


  return (
    <main className="flex flex-col items-center justify-center w-full min-h-screen bg-[#E9ECEF] mt-14 p-14">
      <section className="container flex flex-col items-center mx-auto my-10 p-14">
        <h1 className="font-bold text-5xl mb-4 text-black text-center">
          Post Jobs Without <br /> Any Hassle.
        </h1>
        <p className="text-lg mb-6 text-gray-600 text-center">
          Uploading jobs globally. Executive jobs & work.
        </p>
        
        <div className="flex justify-center items-center mb-6">
          <Button
            type="button"
            className="bg-[#000080] text-white rounded-xl px-8 py-4 hover:bg-[#F5D547] hover:text-[#000080] transition duration-300"
            onClick={handlePostJobClick}
          >
            Post Job
          </Button>
        </div>
      </section>

      <section className="container flex flex-col items-center justify-center mt-8 mb-8">
        <h1 className="font-bold text-2xl md:text-3xl lg:text-4xl mb-4">Posted Jobs</h1>
        <p className="text-lg mb-6 text-gray-600 text-center">Here is the list of posted jobs.....!</p>

        <div className="container flex flex-col space-y-6 mt-7">
          {loading ? (
            <p>Loading jobs...</p>
          ) : currentJobs.length === 0 ? (
            <p>No jobs found.</p>
          ) : (
            currentJobs.map((job) => (
              <div key={job._id} className="bg-blue-100 p-6 rounded-lg shadow-lg flex items-center space-x-4">
                <div className="info-section flex flex-col space-y-2">
                  <h3 className="text-xl font-bold text-black">{job.title}</h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <span className="text-gray-600">Location: {job.location}</span>
                    <span className="font-semibold text-black">Salary: {job.salaryRange.min}k - {job.salaryRange.max}k PKR</span>
                    <span className="text-green-500">Type: {job.type}</span>
                    <span className="text-gray-500">Date: {new Date(job.postedAt).toLocaleString()}</span>
                  </div>

                  <div className="flex space-x-4 mt-4">
                    <Button 
                      className="bg-[#F5D547] text-[#000080] px-4 py-2 rounded-lg hover:bg-[#000080] hover:text-[#F5D547] transition duration-300"
                      onClick={() => handleEdit(job._id)}
                    >
                      <FaEdit className="inline-block mr-2" /> Edit
                    </Button>
                    
                    <Button 
                      className="bg-[#F5D547] text-[#000080] px-4 py-2 rounded-lg hover:bg-[#000080] hover:text-[#F5D547] transition duration-300"
                      onClick={() => handleDelete(job._id)}
                    >
                      <FaTrash className="inline-block mr-2" /> Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
          <div className="flex justify-center mt-6">
            <Button 
              className={`mx-2 ${currentPage === 1 ? 'bg-gray-300' : 'bg-[#000080]'} text-white rounded-lg px-4 py-2 hover:bg-[#F5D547] transition duration-300`}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>
            <span className="self-center">Page {currentPage} of {totalPages}</span>
            <Button 
              className={`mx-2 ${currentPage === totalPages ? 'bg-gray-300' : 'bg-[#000080]'} text-white rounded-lg px-4 py-2 hover:bg-[#F5D547] transition duration-300`}
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
