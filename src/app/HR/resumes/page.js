'use client';
// ResumesPage.js
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

const ResumesPage = () => {
  const searchParams = useSearchParams();
  const jobTitle = searchParams.get("jobTitle");
  const jobDescription = searchParams.get("jobDescription");
  const [resumes, setResumes] = useState([]);
  const [shortlisted, setShortlisted] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentCandidate, setCurrentCandidate] = useState(null);
  const [duration, setDuration] = useState("");
 
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  // Automatically calculate start and end time
  useEffect(() => {
    if (duration && !isNaN(duration) && Number(duration) > 0) {
      const current = new Date();
      setStartTime(current.toLocaleString());
  
      const futureTime = new Date(current.getTime() + duration * 60 * 60 * 1000);
      setEndTime(futureTime.toLocaleString());
    } else {
      setStartTime(""); 
      setEndTime("");   
    }
  }, [duration]);

  // Fetch resumes from the backend
  useEffect(() => {
    const fetchResumes = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/hr/displayresumes?jobTitle=${encodeURIComponent(jobTitle)}`
        );
        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || "Failed to fetch resumes.");
        }

        setResumes(result.data);
      } catch (err) {
        console.error("Error fetching resumes:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (jobTitle) {
      fetchResumes();
    }
  }, [jobTitle]);

  // Shortlist candidates
  const handleShortlist = async () => {
    setLoading(true);
    setError("");

    const payload = {
      jobDescription: jobDescription,
      resumes: resumes.map((resume) => ({
        candidateName: resume.candidateName,
        candidateId: resume.candidateId,
        email: resume.email,
        s3Url: resume.s3Url,
      })),
    };

    try {
      const response = await fetch(`${API_URL}/api/shortlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        setShortlisted(result.shortlistedResumes);
      } else {
        throw new Error(result.message || "Error shortlisting resumes.");
      }
    } catch (err) {
      console.error("Error shortlisting resumes:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


// Send Notification
const handleSendNotification = async () => {
  // Check if candidateId is available
  if (!currentCandidate?.candidateId) {
    alert("Candidate ID is missing. Please refresh and try again.");
    console.error("Missing candidate ID:", currentCandidate);
    return;
  }

  if (!duration || isNaN(duration)) {
    alert("Please enter a valid duration in hours.");
    return;
  }

  // Prepare the payload for the API
  const payload = {
    candidateId: currentCandidate.candidateId,
    jobTitle,
    duration,
    startTime,
    endTime,
    title: `Interview Notification for ${currentCandidate.candidateName}`,
    message: `Congratulations ${currentCandidate.candidateName}, you applied for the position of ${jobTitle}. Your interview is scheduled from ${startTime} to ${endTime}.`,
  };

  console.log("Sending payload:", payload);

  try {
    const response = await fetch(`/api/hr/notify-candidates`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    // Handle the response from the backend
    if (!result.success) {
      throw new Error(result.message || "Failed to send notification.");
    }

    alert(
      `Notification sent successfully.\nStart Time: ${startTime}\nEnd Time: ${endTime}`
    );
  } catch (err) {
    console.error("Error sending notification:", err.message);
    alert(`Failed to send notification: ${err.message}`);
  } finally {
    // Reset UI inputs and close the modal
    setShowModal(false);
    setDuration("");
  }
};

  
  // Open Notification Modal
  const openNotificationModal = (resume) => {
    setCurrentCandidate(resume);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 mt-16 px-10 mb-16 bg-[#F9FAFB] shadow-lg rounded-xl max-w-6xl">
      <h1 className="text-2xl font-bold text-center text-[#E8AF30] mt-8 mb-8">
        {jobTitle} :<span className="text-[#2B4A87]"> Resumes</span>
      </h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      {resumes.length > 0 ? (
        <div className="flex flex-col space-y-4">
          {resumes.map((resume, index) => (
  <div
    key={index}
    className="flex flex-col sm:flex-row items-center justify-between bg-gray-200 border-gray-500 rounded-lg p-4 shadow-md"
  >
    <div className="flex-1">
      <h2 className="text-xl font-bold text-[#2B4A87]">
        {resume.candidateName}
      </h2>
      <p className="text-gray-600">
        <strong>Email:</strong> {resume.email}
      </p>
      <p className="text-gray-600">
        <strong>Candidate ID:</strong> {resume.candidateId}
      </p>
      <p className="text-gray-600">
        <strong>Uploaded At:</strong>{" "}
        {new Date(resume.uploadedAt).toLocaleString()}
      </p>
    </div>
    <Button
      onClick={() =>
        window.open(resume.s3Url, "_blank", "noopener noreferrer")
      }
      className="bg-[#2B4A87] text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
    >
      View Resume
    </Button>
  </div>
))}

        </div>
      ) : (
        <div className="text-center text-gray-600 mt-10">
          <p className="text-lg font-semibold">No resumes available.</p>
        </div>
      )}

      <Button
        className="w-full bg-[#F5D547] text-[#162F65] py-3 rounded-lg font-semibold hover:bg-[#E8AF30] transition mt-6"
        onClick={handleShortlist}
      >
        Shortlist
      </Button>

      {shortlisted.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-center text-green-600">
            Shortlisted Candidates
          </h2>
          <div className="flex flex-col space-y-4">
          {shortlisted.map((resume, index) => (
  <div
    key={index}
    className="flex flex-col sm:flex-row items-center justify-between bg-green-200 border-green-500 rounded-lg p-4 shadow-md"
  >
    <div className="flex-1">
      <h2 className="text-xl font-bold text-green-700">
        {resume.candidateName}
      </h2>
      <p className="text-gray-600">
        <strong>Email:</strong> {resume.email}
      </p>
      <p className="text-gray-600">
        <strong>Candidate ID:</strong> {resume.candidateId}
      </p>
      <p className="text-gray-600">
        <strong>Overall Score:</strong> {resume.overallScore}%
      </p>
    </div>
    <Button
      onClick={() => openNotificationModal(resume)}
      className="bg-[#2B4A87] text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
    >
      Send Notification
    </Button>
  </div>
))}

          </div>
        </div>
      )}

{showModal && (
  <div className="fixed inset-0 bg-transparent bg-opacity-30 backdrop-blur-md flex justify-center items-center">
    <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md border border-[#E8AF30]">
      <h2 className="text-2xl font-bold text-center text-[#2B4A87] mb-4">
        Send Notification
      </h2>
      <div className="text-[#162F65]">
        <p className="mb-2">
          <strong>Job Title:</strong> {jobTitle} 
        </p>
        <p className="mb-2">
          <strong>Candidate Name:</strong> {currentCandidate?.candidateName}
        </p>
        <p className="mb-2">
          <strong>Candidate ID:</strong> {currentCandidate?.candidateId}
        </p>
        <p className="mb-2">
          <strong>Start Time:</strong> {startTime}
        </p>
        <p className="mb-4">
          <strong>End Time:</strong> {endTime}
        </p>
      </div>
      <label className="block mt-4">
        <span className="text-[#2B4A87] font-medium">Duration (in hours):</span>
        <input
          type="number"
          className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B4A87] transition"
          placeholder="Enter duration in hours"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
      </label>
    
      <div className="mt-6 flex justify-between space-x-4">
        <Button
          className="bg-[#E8AF30] text-[#162F65] px-4 py-2 w-full rounded-lg font-semibold hover:bg-[#F5D547] transition"
          onClick={handleSendNotification}
        >
          Send
        </Button>
        <Button
          className="bg-[#2B4A87] text-white px-4 py-2 w-full rounded-lg font-semibold hover:bg-blue-700 transition"
          onClick={() => setShowModal(false)}
        >
          Cancel
        </Button>
      </div>
    </div>
  </div>      
)}


    </div>
  );
};

export default ResumesPage;
