// src/components/MessageBubble.js

export default function MessageBubble({ role, content }) {
  const isUser = role === 'User';
  const emoji = isUser ? '👤' : '🤖'; // User emoji for user, robot emoji for chatbot

  return (
    <div className={`my-2 flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`inline-flex items-center ${isUser ? 'flex-row-reverse' : ''}`}>
        {/* Emoji icon */}
        <span className="mx-2 text-2xl">{emoji}</span>
        
        {/* Message bubble */}
        <div className={`p-3 rounded-lg ${isUser ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
          {content}
        </div>
      </div>
    </div>
  );
}
