"use client"; 
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'; 

const ApplyJobs = () => {
  const searchParams = useSearchParams(); 
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobDetails = async () => {
      const id = searchParams.get('id'); 
      if (!id) {
        setError("Job ID is missing.");
        setLoading(false);
        return;
      }
      
      try {
        const response = await fetch(`/api/hr/jobs?id=${id}`);
        if (!response.ok) throw new Error("Failed to fetch job details");
        
        const data = await response.json();
        if (data.success) {
          setJob(data.data);
        } else {
          setError("Job not found.");
        }
      } catch (error) {
        setError("Error fetching job details: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [searchParams]);

  if (loading) {
    return <p>Loading job details...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!job) {
    return <p>No job found.</p>;
  }

  return (
    <div className="p-4">
      <h1 className="font-bold text-2xl">{job.title}</h1>
      <p><strong>Location:</strong> {job.location}</p>
      <p><strong>Type:</strong> {job.type}</p>
      <p><strong>Salary:</strong> {job.salaryRange.min} - {job.salaryRange.max}</p>
      <div>
        <h2 className="font-bold text-xl">Description</h2>
        <p>{job.description}</p>
      </div>
      <div>
        <h2 className="font-bold text-xl">Requirements</h2>
        <ul>
          {job.requirements.map((requirement, index) => (
            <li key={index}>{requirement}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="font-bold text-xl">Responsibilities</h2>
        <ul>
          {job.responsibilities.map((responsibility, index) => (
            <li key={index}>{responsibility}</li>
          ))}
        </ul>
      </div>
      <form className="mt-4">
        <input type="file" accept=".pdf, .doc, .docx" required />
        <button type="submit" className="bg-green-500 text-white p-2 mt-2">Upload Resume</button>
      </form>
    </div>
  );
};

export default ApplyJobs;
