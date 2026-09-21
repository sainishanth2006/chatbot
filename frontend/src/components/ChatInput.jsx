import React, { useState } from 'react';
import { Send } from 'lucide-react';

export default function ChatInput({ onSendMessage, disabled }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-200 flex gap-3">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask a question about your uploaded documents..."
        disabled={disabled}
        className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition"
      />
      <button
        type="submit"
        disabled={disabled || !input.trim()}
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center justify-center disabled:opacity-50 transition shadow-sm"
      >
        <Send className="h-4 w-4" />
      </button>
    </form>
  );
}