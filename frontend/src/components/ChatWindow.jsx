import React, { useRef, useEffect } from 'react';
import { Bot, User, Loader2, BookOpen } from 'lucide-react';

export default function ChatWindow({ messages, isLoading }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-3">
          <BookOpen className="h-12 w-12 text-gray-300" />
          <p className="text-sm font-medium">No messages yet.</p>
          <p className="text-xs text-gray-400">Upload documents on the left and ask your first question below!</p>
        </div>
      ) : (
        messages.map((msg, index) => (
          <div
            key={index}
            className={`flex gap-4 max-w-3xl ${
              msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-indigo-600 text-white shadow-sm'
              }`}
            >
              {msg.role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
            </div>

            <div
              className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>

              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-2 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
                  <span className="font-semibold text-gray-600">Citations:</span>
                  <div className="flex flex-wrap gap-1">
                    {msg.sources.map((src, i) => (
                      <span key={i} className="bg-gray-100 border border-gray-200 px-2 py-0.5 rounded text-[11px] text-gray-600">
                        📄 {src}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))
      )}

      {isLoading && (
        <div className="flex gap-4 max-w-3xl">
          <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
            <Bot className="h-5 w-5" />
          </div>
          <div className="p-4 rounded-2xl bg-white border border-gray-200 text-gray-500 text-sm flex items-center gap-3 rounded-tl-none shadow-sm">
            <Loader2 className="animate-spin h-4 w-4 text-blue-600" />
            <span>Gemini is reading documents and drafting an answer...</span>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}