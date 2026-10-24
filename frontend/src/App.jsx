import React, { useState } from 'react';
import Sidebar from './components/sidebar';
import ChatWindow from './components/chatWindow';
import ChatInput from './components/ChatInput';
import { sendChatMessage } from './api/client';

export default function App() {
  const [sessionId, setSessionId] = useState(() => `session_${crypto.randomUUID()}`);
  const [messages, setMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);

  const startNewSession = () =>{
    const newId = "session_" + crypto.randomUUID();
    setSessionId(newId);
    setMessages([]);
  }

  const handleSendMessage = async (questionText) => {
    const userMsg = { role: 'user', content: questionText };
    setMessages((prev) => [...prev, userMsg]);
    setChatLoading(true);

    try {
      const response = await sendChatMessage(questionText, sessionId);
      const assistantMsg = {
        role: 'assistant',
        content: response.answer,
        sources: response.sources,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg = {
        role: 'assistant',
        content: `Error: ${err.message}`,
        sources: [],
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans antialiased">
      {/* Sidebar Panel */}
      <Sidebar sessionId={sessionId} />

      {/* Main Chat Workspace */}
      <div className="flex-1 flex flex-col h-full">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-md font-semibold text-gray-800">Knowledge Assistant Workspace</h2>
          <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">
            Backend Online
          </span>
        </header>

        {/* Chat History Container */}
        <ChatWindow messages={messages} isLoading={chatLoading} />

        {/* Query Input Bar */}
        <ChatInput onSendMessage={handleSendMessage} disabled={chatLoading} />
      </div>
    </div>
  );
}