// src/components/MessageBubble.js

export default function MessageBubble({ role, content }) {
    return (
      <div className={`my-2 ${role === 'User' ? 'text-right' : 'text-left'}`}>
        <div className={`inline-block p-3 rounded-lg ${role === 'User' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
          {content}
        </div>
      </div>
    );
  }
  