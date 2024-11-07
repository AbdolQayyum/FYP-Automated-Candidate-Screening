'use client'
import { useState, useEffect } from 'react';
import MessageBubble from '@/components/MessageBubble';

const InterviewBot = () => {
  const [messages, setMessages] = useState([
    { role: 'AI', content: 'Welcome to the Interview Bot!' },
    { role: 'AI', content: 'Before starting the interview, I’d like to collect some information.' },
  ]);
  const [input, setInput] = useState('');
  const [userInfo, setUserInfo] = useState({
    user_name: '',
    field: '',
    experience: '',
    years_of_experience: '',
  });
  const [userInfoComplete, setUserInfoComplete] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    { key: 'user_name', question: 'What is your name?' },
    { key: 'field', question: 'What’s your field of specialization?' },
    { key: 'experience', question: 'Are you a fresher or experienced professional?' },
    { key: 'years_of_experience', question: 'How many years of experience do you have?', condition: 'experienced' },
  ];

  // Trigger the next question when stepIndex changes
  useEffect(() => {
    if (stepIndex < steps.length && !userInfoComplete) {
      const currentStep = steps[stepIndex];
      
      setMessages((prevMessages) => {
        const lastMessage = prevMessages[prevMessages.length - 1];
        if (lastMessage.role === 'AI' && lastMessage.content === currentStep.question) {
          return prevMessages; // Avoid repeating the question
        }
        return [...prevMessages, { role: 'AI', content: currentStep.question }];
      });
    }
  }, [stepIndex, userInfoComplete]);

  // Send userInfo to the backend and retrieve questions once all information is collected
  useEffect(() => {
    if (userInfoComplete) {
      const sendDataToBackend = async () => {
        try {
          const response = await fetch('/api/chatbot/interviewbot', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userInfo),
          });

          if (!response.ok) {
            throw new Error('Failed to send data to the backend');
          }

          const data = await response.json();
          if (data.message) {
            setMessages((prev) => [...prev, { role: 'AI', content: data.message }]);
          }

          // Display questions from FastAPI's conversation response
          if (data.conversation && Array.isArray(data.conversation)) {
            const botMessages = data.conversation.map((msg) => ({
              role: msg.role,
              content: msg.content,
            }));
            setMessages((prev) => [...prev, ...botMessages]);
          }
        } catch (error) {
          console.error("Error fetching data from backend:", error);
          setMessages((prev) => [...prev, { role: 'AI', content: 'An error occurred. Please try again later.' }]);
        }
      };

      sendDataToBackend();
    }
  }, [userInfoComplete, userInfo]);

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages((prev) => [...prev, { role: 'User', content: input }]);
      const currentStep = steps[stepIndex];
      const { key } = currentStep;

      setUserInfo((prev) => {
        const updatedUserInfo = { ...prev, [key]: input };
        return updatedUserInfo;
      });

      // Determine next step
      if (key === 'experience') {
        if (input.toLowerCase() === 'fresher') {
          setStepIndex(stepIndex + 2); // Skip years_of_experience step if fresher
          setUserInfo((prev) => ({ ...prev, years_of_experience: '' }));
        } else {
          setStepIndex((prev) => prev + 1);
        }
      } else {
        setStepIndex((prev) => prev + 1);
      }

      // Mark user info collection complete if we've reached the end of steps
      if (stepIndex + 1 >= steps.length || (key === 'experience' && input.toLowerCase() === 'fresher')) {
        setUserInfoComplete(true);
      }

      setInput(''); // Clear input field
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#EFF0F2]">
      {/* Title */}
      <h1 className="text-3xl font-bold text-center text-[#162F65] mb-6 mt-6">
        Interviewer Bot
      </h1>
      
      {/* Chat Box */}
      <div className="w-full max-w-xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col space-y-4 mb-4 h-80 overflow-y-auto">
          {messages.map((msg, index) => (
            <MessageBubble key={index} role={msg.role} content={msg.content} />
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your answer..."
            className="flex-grow p-2 border rounded-l-lg border-gray-300 focus:outline-none"
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewBot;
