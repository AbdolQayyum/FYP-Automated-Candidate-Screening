// src/components/ChatInterface.js
'use client';
import { useState, useEffect } from 'react';
import MessageBubble from './MessageBubble';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    { role: 'AI', content: 'Welcome to the Interview Bot!' },
    { role: 'AI', content: 'Before starting the interview, I’d like to collect some information.' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

  // Ask the next question based on stepIndex
  useEffect(() => {
    if (stepIndex < steps.length && messages.length === 2) {
      const question = steps[stepIndex].question;
      setMessages((prev) => [...prev, { role: 'AI', content: question }]);
    }
  }, [stepIndex]);

  const handleSendMessage = async () => {
    if (input.trim()) {
      // Log the user input to verify it's captured correctly
      console.log("User input:", input);
      setMessages((prev) => [...prev, { role: 'User', content: input }]);

      if (!userInfoComplete) {
        const currentStep = steps[stepIndex];
        const { key, condition } = currentStep;

        setUserInfo((prev) => ({ ...prev, [key]: input }));

        // Check if the "experience" step determines flow
        if (key === 'experience' && input.toLowerCase() === 'fresher') {
          setStepIndex(steps.findIndex((step) => step.key === 'years_of_experience') + 1);
          setUserInfo((prev) => ({ ...prev, years_of_experience: '' }));
        } else if (stepIndex + 1 < steps.length) {
          // Ask the next question
          const nextStep = steps[stepIndex + 1];
          if (!nextStep.condition || userInfo.experience === nextStep.condition) {
            setMessages((prev) => [...prev, { role: 'AI', content: nextStep.question }]);
          }
          setStepIndex(stepIndex + 1);
        } else {
          // Mark user information collection as complete
          setUserInfoComplete(true);
          console.log("User information collected:", userInfo);
        }
      } else if (!isLoading) {
        // Send the collected user info to the backend
        setIsLoading(true);
        console.log("Sending user info to backend:", userInfo);

        try {
          const response = await fetch('/api/chatbot/interviewbot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userInfo),
          });

          if (!response.ok) throw new Error("Failed to fetch data from backend");

          const data = await response.json();
          console.log("Data received from Next.js API:", data); // Debug

          if (data.conversation) {
            const aiMessages = data.conversation.map((msg) => ({
              role: msg.role,
              content: msg.content,
            }));
            setMessages((prev) => [...prev, ...aiMessages]);
          } else {
            setMessages((prev) => [...prev, { role: 'AI', content: 'Error retrieving conversation.' }]);
          }
        } catch (error) {
          console.error("Error calling Next.js API route:", error);
          setMessages((prev) => [...prev, { role: 'AI', content: 'An error occurred. Please try again later.' }]);
        }

        setIsLoading(false);
      }

      setInput(''); // Clear the input field
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="flex flex-col space-y-4 mb-4 h-80 overflow-y-auto">
        {messages.map((msg, index) => (
          <MessageBubble key={index} role={msg.role} content={msg.content} />
        ))}
        {isLoading && <p>Loading questions...</p>}
      </div>
      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type your answer..."
          className="flex-grow p-2 border rounded-l-lg border-gray-300 focus:outline-none"
          disabled={isLoading} 
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none"
          disabled={isLoading}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
