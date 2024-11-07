'use client';
import { useState, useEffect, useRef } from 'react';
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
  const [questionCount, setQuestionCount] = useState(0);

  const chatContainerRef = useRef(null);

  const userInfoQuestions = [
    { key: 'user_name', question: 'What is your name?' },
    { key: 'field', question: 'What’s your field of specialization?' },
    { key: 'experience', question: 'Are you a fresher or experienced professional?' },
    { key: 'years_of_experience', question: 'How many years of experience do you have?', condition: 'experienced' },
  ];

  const startInterview = async (userInfo) => {
    const response = await fetch('/api/chatbot/interviewbot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: "start",
        userInfo: userInfo
      }),
    });
    const data = await response.json();
    if (data.question) {
      setMessages((prev) => [...prev, { role: 'AI', content: data.question }]);
      setQuestionCount(1);
    }
  };

  const getNextQuestion = async (userResponse) => {
    if (questionCount >= 20) {
      await getFeedback();
      return;
    }

    const response = await fetch('/api/chatbot/interviewbot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: "next_question",
        userResponse: userResponse
      }),
    });
    const data = await response.json();

    if (data.complete) {
      await getFeedback();
    } else if (data.question) {
      setMessages((prev) => [...prev, { role: 'AI', content: data.question }]);
      setQuestionCount((prevCount) => prevCount + 1);
    }
  };

  const getFeedback = async () => {
    try {
      const response = await fetch('/api/chatbot/interviewbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: "get_feedback"
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error from FastAPI:", errorData.detail);
        setMessages((prev) => [...prev, { role: 'AI', content: "An error occurred while generating feedback." }]);
        return;
      }
  
      const data = await response.json();
      if (data.feedback) {
        const feedbackMessages = [
          { role: 'AI', content: `You answered ${data.feedback.correct_count} out of ${data.feedback.total_questions} correctly.` },
          { role: 'AI', content: data.feedback.final_feedback },
        ];
        
        data.feedback.details.forEach((detail, index) => {
          feedbackMessages.push({
            role: 'AI',
            content: `Q${index + 1}: ${detail.question}\nYour Answer: ${detail.user_answer} - ${detail.is_correct ? 'Correct' : 'Incorrect'}\nCorrect Answer: ${detail.correct_answer}`
          });
        });

        setMessages((prev) => [...prev, ...feedbackMessages]);
      }
    } catch (error) {
      console.error("Error fetching feedback:", error);
      setMessages((prev) => [...prev, { role: 'AI', content: "Unable to retrieve feedback at this time." }]);
    }
  };

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages((prev) => [...prev, { role: 'User', content: input }]);

      if (!userInfoComplete) {
        const currentQuestion = userInfoQuestions[stepIndex];
        const updatedUserInfo = { ...userInfo, [currentQuestion.key]: input };

        setUserInfo(updatedUserInfo);

        let newIndex = stepIndex + 1;
        while (userInfoQuestions[newIndex] && userInfoQuestions[newIndex].condition && updatedUserInfo.experience !== userInfoQuestions[newIndex].condition) {
          newIndex += 1;
        }

        if (newIndex < userInfoQuestions.length) {
          setStepIndex(newIndex);
          setMessages((prev) => [...prev, { role: 'AI', content: userInfoQuestions[newIndex].question }]);
        } else {
          setUserInfoComplete(true);
          startInterview(updatedUserInfo);
        }
      } else {
        getNextQuestion(input);
      }

      setInput('');
    }
  };
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!userInfoComplete && stepIndex < userInfoQuestions.length) {
      const currentQuestion = userInfoQuestions[stepIndex].question;
      if (messages[messages.length - 1]?.content !== currentQuestion) {
        setMessages((prev) => [...prev, { role: 'AI', content: currentQuestion }]);
      }
    }
  }, [stepIndex, userInfoComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 mt-6">
      <div className="w-full max-w-3xl bg-[#162F65] shadow-lg rounded-lg p-6 space-y-4">
        {/* Heading */}
        <h1 className="text-3xl font-bold text-center text-[#E8AF30] mb-4">Interviewer Bot</h1>
        
        {/* Chat Container */}
        <div
          className="flex flex-col space-y-3 h-[300px] overflow-y-auto p-3 bg-blue-50 rounded-lg"
          ref={chatContainerRef}
        >
          {messages.map((msg, index) => (
            <MessageBubble
              key={index}
              role={msg.role}
              content={msg.content}
              isWelcomeMessage={index < 2} 
            />
          ))}
        </div>

        {/* Input Field and Send Button */}
        <div className="flex items-center justify-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your answer..."
            className="flex-grow p-3 border border-gray-300 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            className="ml-2 bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 focus:outline-none text-lg"
          >
            💬
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewBot;