'use client';
import { useState, useEffect, useRef } from 'react';
import MessageBubble from '@/components/MessageBubble';

const InterviewBot = () => {
  const [messages, setMessages] = useState([
    { role: 'AI', content: 'Welcome to the Interview Bot! We’re here to assist you with your interview preparation.' },
    { role: 'AI', content: 'Please hold on while we retrieve your details to confirm your information.' },
  ]);
  const [input, setInput] = useState('');
  const [userInfo, setUserInfo] = useState({
    candidate_id: '', // Candidate ID
    candidate_name: '',
    email: '',
    job_title: '',
    experience: '',
  });
  const [experiencePrompted, setExperiencePrompted] = useState(false);
  const [detailsFetched, setDetailsFetched] = useState(false);
  const chatContainerRef = useRef(null);

  // Fetch candidate details from the backend
  useEffect(() => {
    const fetchDetails = async () => {
      if (detailsFetched) return; // Prevent multiple fetch calls

      try {
        const response = await fetch('/api/auth', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch details');
        }

        const decodedDetails = await response.json();
  const { candidateId, candidateName, email, jobTitle } = decodedDetails;

setUserInfo({
  candidate_id: candidateId || '', // Ensure proper assignment
  candidate_name: candidateName,
  email: email,
  job_title: jobTitle,
  experience: '',
});

        const newMessages = [
          { role: 'AI', content: `Hello, ${candidateName}! We're excited to assist you in your upcoming interview.` },
          { role: 'AI', content: `The email associated with your application is: ${email}.` },
          { role: 'AI', content: `Our records indicate that you have applied for the position of: "${jobTitle}".` },
          { role: 'AI', content: 'Are you a fresher or an experienced professional?' },
        ];

        setMessages((prev) => [...prev, ...newMessages]);
        setExperiencePrompted(true);
        setDetailsFetched(true); // Set the flag to true after successful fetch
      } catch (error) {
        console.error('Error fetching details:', error);
        setMessages((prev) => [
          ...prev,
          { role: 'AI', content: 'Oops! Something went wrong while fetching your details. Please try again later.' },
        ]);
      }
    };

    fetchDetails();
  }, [detailsFetched]);

  // Send data to the backend
  const sendToBackend = async (updatedUserInfo) => {
    try {
      // Log the payload being sent to the backend
      console.log("Sending data to the backend:", updatedUserInfo);
  
      const response = await fetch('/api/chatbot/interviewbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'start',
          userInfo: updatedUserInfo,
        }),
      });
  
      // Handle non-successful HTTP responses
      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Backend error response:", errorResponse);
        throw new Error(errorResponse.message || 'Failed to send data to the backend');
      }
  
      const data = await response.json();
      console.log("Received response from backend:", data);
  
      // Check if a question is received in the response
      if (data.question) {
        setMessages((prev) => [
          ...prev,
          { role: 'AI', content: 'Your details have been submitted successfully.' },
          { role: 'AI', content: data.question },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'AI', content: 'Your details have been submitted successfully.' },
          { role: 'AI', content: 'No further questions available.' },
        ]);
      }
    } catch (error) {
      console.error('Error sending data to the backend:', error);
  
      setMessages((prev) => [
        ...prev,
        { role: 'AI', content: 'An error occurred while submitting your information. Please try again.' },
      ]);
    }
  };
  
  // Fetch the next question
  const getNextQuestion = async (userResponse) => {
    try {
      const response = await fetch('/api/chatbot/interviewbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'next_question',
          userResponse,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch the next question');
      }

      const data = await response.json();

      if (data.complete) {
        await getFeedback();
      } else if (data.question) {
        setMessages((prev) => [...prev, { role: 'AI', content: data.question }]);
      }
    } catch (error) {
      console.error('Error fetching next question:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'AI', content: 'Unable to fetch the next question. Please try again later.' },
      ]);
    }
  };

  // Fetch feedback after completion
  const getFeedback = async () => {
    try {
      const response = await fetch('/api/chatbot/interviewbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'get_feedback',
          userInfo, // Pass the userInfo object
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch feedback');
      }
  
      const data = await response.json();
  
      if (data.feedback) {
        // Display feedback in the chat
        setMessages((prev) => [
          ...prev,
          {
            role: 'AI',
            content: `${userInfo.candidate_name} answered ${data.feedback.correct_count} out of ${data.feedback.total_questions} correctly.`,
          },
          { role: 'AI', content: data.feedback.final_feedback },
        ]);
  
        // Send feedback details to the backend
        await saveFeedbackToBackend({
          candidateId: userInfo.candidate_id,
          candidateName: userInfo.candidate_name,
          email: userInfo.email,
          jobTitle: userInfo.job_title,
          totalQuestions: data.feedback.total_questions,
          correctAnswers: data.feedback.correct_count,
        });
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'AI', content: 'Unable to retrieve feedback at this time.' },
      ]);
    }
  };
  
  // Save feedback to the backend
  const saveFeedbackToBackend = async (feedbackData) => {
    try {
      const response = await fetch('/api/users/save-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });

      if (!response.ok) {
        throw new Error('Failed to save feedback to the backend');
      }

      console.log('Feedback successfully saved to the backend.');
    } catch (error) {
      console.error('Error saving feedback to the backend:', error);
    }
  };

  // Handle user input
  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages((prev) => [...prev, { role: 'User', content: input }]);

      if (experiencePrompted) {
        const updatedUserInfo = { ...userInfo, experience: input.trim().toLowerCase() };
        setUserInfo(updatedUserInfo);
        setExperiencePrompted(false);

        sendToBackend(updatedUserInfo);
      } else {
        getNextQuestion(input);
      }

      setInput('');
    }
  };

  // Scroll to the bottom of the chat container
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 mt-6">
      <div className="w-full max-w-3xl bg-[#162F65] shadow-lg rounded-lg p-6 space-y-4">
        <h1 className="text-3xl font-bold text-center text-[#E8AF30] mb-4">Interviewer Bot</h1>
        <div
          className="flex flex-col space-y-3 h-[300px] overflow-y-auto p-3 bg-blue-50 rounded-lg"
          ref={chatContainerRef}
        >
          {messages.map((msg, index) => (
            <MessageBubble key={index} role={msg.role} content={msg.content} />
          ))}
        </div>

        <div className="mt-4 flex items-center space-x-4">
        <input
  type="text"
  value={input}
  onChange={(e) => setInput(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevents form submission if it's inside a form
      handleSendMessage();
    }
  }}
  placeholder="Type your answer..."
  className="flex-1 p-2 rounded-md border border-gray-300 focus:outline-none"
/>
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewBot;
