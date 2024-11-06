// src/app/page.js

import ChatInterface from '../../components/ChatInterface';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Chat with our AI Interviewer</h1>
      <ChatInterface />
    </main>
  );
}
