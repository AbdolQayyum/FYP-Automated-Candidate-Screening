// src/components/MessageBubble.js

export default function MessageBubble({ role, content }) {
  const isUser = role === 'User';
  const emoji = isUser ? '👤' : '🤖'; // User emoji for user, robot emoji for chatbot

  return (
    <div className={`my-1 flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`inline-flex items-center ${isUser ? 'flex-row-reverse' : ''}`}>
        {/* Emoji icon */}
        <span className="mx-1 text-lg">{emoji}</span>
        
        {/* Message bubble */}
        <div className={`p-2 rounded-md text-sm ${isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
          {content}
        </div>
      </div>
    </div>
  );
}
