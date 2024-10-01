"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation"; 
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function UpdateJob() {
  const { edit: jobId } = useParams(); // Get jobId from params
  const router = useRouter();

  const [jobData, setJobData] = useState({
    title: "",
    location: "",
    salaryMin: "",
    salaryMax: "",
    description: "",
    requirements: "",
    responsibilities: "",
    type: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch job details when the component loads
  useEffect(() => {
    if (!jobId) return;

    const fetchJobDetails = async () => {
      try {
        const response = await fetch(`/api/hr/jobs?id=${jobId}`); 
        if (!response.ok) {
          throw new Error(`Failed to fetch job with ID: ${jobId}`);
        }

        const result = await response.json();
        if (result.success) {
          const job = result.data;
          setJobData({
            title: job.title || "",
            location: job.location || "",
            salaryMin: job.salaryRange?.min || "",
            salaryMax: job.salaryRange?.max || "",
            description: job.description || "",
            requirements: job.requirements ? job.requirements.join(", ") : "",
            responsibilities: job.responsibilities ? job.responsibilities.join(", ") : "",
            type: job.type || "",
          });
        } else {
          setError(result.message || "Failed to load job details.");
        }
      } catch (error) {
        setError("Error fetching job details: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]); 

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobData({ ...jobData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const jobToUpdate = {
      ...jobData,
      salaryRange: {
        min: jobData.salaryMin,
        max: jobData.salaryMax,
      },
    };

    try {
      const response = await fetch(`/api/hr/jobs?id=${jobId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobToUpdate),
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.message || "Something went wrong.");
      } else {
        alert("Job updated successfully!");
        router.push("/HR/mainHR"); 
      }
    } catch (error) {
      setError("Server error: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center w-full min-h-screen bg-gradient-to-r from-indigo-50 to-blue-100 mt-12">
      <section className="container mx-auto max-w-3xl bg-white p-10 rounded-lg shadow-2xl mt-12">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-700">Updating Job</h1>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* Job Title Input */}
          <div className="mb-6">
            <Input
              name="title"
              placeholder="Job Title"
              value={jobData.title}
              onChange={handleInputChange}
              className="w-full p-4 bg-blue-50 text-gray-700 rounded-lg border border-blue-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-300"
              required
            />
          </div>

          {/* Location Input */}
          <div className="mb-6">
            <Input
              name="location"
              placeholder="Location"
              value={jobData.location}
              onChange={handleInputChange}
              className="w-full p-4 bg-blue-50 text-gray-700 rounded-lg border border-blue-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-300"
              required
            />
          </div>

          {/* Salary Min and Max Inputs */}
          <div className="mb-6">
            <div className="flex space-x-4">
              {/* Salary Min Input */}
              <Input
                name="salaryMin"
                placeholder="Salary Min"
                value={jobData.salaryMin}
                onChange={handleInputChange}
                className="w-full p-4 bg-blue-50 text-gray-700 rounded-lg border border-blue-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-300"
                required
                type="number"
                min="0"
              />

              {/* Salary Max Input */}
              <Input
                name="salaryMax"
                placeholder="Salary Max"
                value={jobData.salaryMax}
                onChange={handleInputChange}
                className="w-full p-4 bg-blue-50 text-gray-700 rounded-lg border border-blue-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-300"
                required
                type="number"
                min="0"
              />
            </div>
          </div>

          {/* Job Type Dropdown */}
          <div className="mb-6">
            <select
              name="type"
              value={jobData.type}
              onChange={handleInputChange}
              className="w-full p-4 bg-blue-50 text-gray-700 rounded-lg border border-blue-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-300"
              required
            >
              <option value="" disabled>Select Job Type</option>
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Contract">Contract</option>
              <option value="Freelance">Freelance</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          {/* Description */}
          <div className="mb-6">
            <textarea
              name="description"
              placeholder="Job Description"
              value={jobData.description}
              onChange={handleInputChange}
              className="w-full p-4 bg-blue-50 text-gray-700 rounded-lg border border-blue-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-300"
              rows="4"
              required
            ></textarea>
          </div>

          {/* Requirements */}
          <div className="mb-6">
            <textarea
              name="requirements"
              placeholder="Requirements (comma-separated)"
              value={jobData.requirements}
              onChange={handleInputChange}
              className="w-full p-4 bg-blue-50 text-gray-700 rounded-lg border border-blue-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-300"
              rows="3"
            ></textarea>
          </div>

          {/* Responsibilities */}
          <div className="mb-6">
            <textarea
              name="responsibilities"
              placeholder="Responsibilities (comma-separated)"
              value={jobData.responsibilities}
              onChange={handleInputChange}
              className="w-full p-4 bg-blue-50 text-gray-700 rounded-lg border border-blue-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-300"
              rows="3"
            ></textarea>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className={`w-full p-4 rounded-lg ${submitting ? "bg-gray-400" : "bg-blue-500 text-white"}`}
            disabled={submitting}
          >
            {submitting ? "Updating..." : "Update Job"}
          </Button>
        </form>
      </section>
    </main>
  );
}
