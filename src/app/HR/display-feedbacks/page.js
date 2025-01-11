"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [emailDetails, setEmailDetails] = useState({
    subject: "",
    message: "",
  });

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/hr/display-feedbacks", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }
  
      const data = await response.json();
      console.log("Fetched Notifications:", data.notifications); // Debugging log
      setNotifications(data.notifications || []);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Failed to load notifications. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleSendEmail = async () => {
    try {
      const recipientEmail = selectedNotification?.feedback?.email; // Extract email from feedback
  
      console.log("Preparing to send email with the following details:", {
        email: recipientEmail,
        subject: emailDetails.subject,
        message: emailDetails.message,
      });
  
      if (!recipientEmail) {
        throw new Error("Email is missing in the selected notification.");
      }
  
      const response = await fetch("/api/hr/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: recipientEmail,
          subject: emailDetails.subject,
          message: emailDetails.message,
        }),
      });
  
      console.log("Response from server:", response);
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response from server:", errorData);
        throw new Error("Failed to send email");
      }
  
      alert("Email sent successfully!");
      setShowModal(false);
    } catch (error) {
      console.error("Error sending email:", error.message);
      alert("Failed to send email. Please try again.");
    }
  };
  
  

  const openModal = (notification) => {
    console.log("Selected Notification:", notification); // Ensure feedback.email exists
  
    setSelectedNotification(notification);
  
    const subject = `Congratulations! You’re Invited to the Final Interview`;
  
    const candidateName = notification.candidateName || "Candidate";
    const jobTitle = notification.jobTitle || "Job Title";
  
    const message = `Dear ${candidateName},
      
      We are pleased to inform you that you have been selected for the final round of interviews for the position of ${jobTitle}. Congratulations on making it to this stage!
      
      The final interview will be held on:
      
      Date: ${new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toLocaleDateString()}  
      Time: ${new Date().toLocaleTimeString()}  
      Location: COMSATS
      
      Please confirm your availability for this interview by responding to this email at your earliest convenience. 
    
      We look forward to discussing your skills and experiences further and are excited about the potential of having you join our team.
      
      Best regards,
      
      HR Department
      [Automated Candidate Screening]`;
  
    setEmailDetails({
      subject: subject,
      message: message,
    });
  
    setShowModal(true);
  };
  

  const closeModal = () => {
    setShowModal(false);
    setSelectedNotification(null);
    setEmailDetails({ subject: "", message: "" });
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <main className="flex flex-col items-center w-full min-h-screen px-6 mt-16 mb-16 bg-[#F9FAFB]">
      <motion.section
        className="container mx-auto mt-10 px-6"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
      >
        <h1 className="text-2xl font-bold text-[#162F65] mb-4 text-center">
          Notifications & Feedbacks
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#162F65]"></div>
          </div>
        ) : error ? (
          <p className="text-center text-red-500 mt-8">{error}</p>
        ) : (
          <div className="flex flex-col gap-6">
            {notifications.length === 0 ? (
              <p className="text-center text-gray-500">
                No notifications available.
              </p>
            ) : (
              notifications.map((notification, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col bg-[#F9FAFB] p-6 rounded-lg shadow-md border border-[#162F65] transition-transform duration-300 hover:scale-105"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-lg font-bold text-[#E8AF30]">
                    {notification.title || "Untitled Notification"}
                  </h2>
                  <p className="text-[#1b1b1b] font-medium mt-2">
                    {notification.message || "No message available."}
                  </p>

                  {/* Display feedback if available */}
                  {notification.feedback &&
                    (notification.feedback.final_feedback ||
                      notification.feedback.correctAnswers ||
                      notification.feedback.totalQuestions) ? (
                    <div className="mt-4 bg-gray-50 p-3 rounded-lg border border-gray-300">
                      <h3 className="text-lg font-semibold text-green-700">
                        Results of Interview With Interviewer Bot
                      </h3>
                      {notification.feedback.correctAnswers !== undefined &&
                      notification.feedback.totalQuestions !== undefined ? (
                        <p className="text-gray-600 text-sm mt-1">
                          {notification.feedback.candidateName || "Candidate"}{" "}
                          has given{" "}
                          {notification.feedback.correctAnswers} correct
                          answers out of{" "}
                          {notification.feedback.totalQuestions} total
                          questions.
                        </p>
                      ) : (
                        <p className="text-gray-600 text-sm mt-1">
                          Correct Answers: - / -
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-gray-500">
                      No feedback available for this notification.
                    </p>
                  )}

                  {/* Button to Open Email Modal */}
                  <button
                    onClick={() => openModal(notification)}
                    className="mt-4 bg-[#162F65] text-white px-4 py-2 rounded-lg hover:bg-[#0f1e4f] transition-colors duration-200"
                  >
                    Send Email
                  </button>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* Email Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-[50%]"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-lg font-bold text-[#162F65] mb-4">
                Send Email for "{selectedNotification?.title}"
              </h2>
              <form className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Subject"
                  value={emailDetails.subject}  // Automatically filled subject
                  onChange={(e) =>
                    setEmailDetails({ ...emailDetails, subject: e.target.value })
                  }
                  className="border rounded-md p-2 w-full"
                />
                <textarea
                  placeholder="Message"
                  value={emailDetails.message}  // Automatically filled message
                  onChange={(e) =>
                    setEmailDetails({ ...emailDetails, message: e.target.value })
                  }
                  className="border rounded-md p-2 w-full h-32"
                />
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSendEmail}
                    className="bg-[#162F65] text-white px-4 py-2 rounded-lg hover:bg-[#0f1e4f] transition-colors"
                  >
                    Send Email
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </motion.section>
    </main>
  );
};

export default Notifications;
