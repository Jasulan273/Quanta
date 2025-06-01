import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiMessageSquare, FiX } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';

const ChatAssistant = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chatHistory');
    return saved
      ? JSON.parse(saved)
      : [
          {
            text: "Hi! I am Quanta Assistant. What can I help you with?",
            sender: 'bot',
            username: 'Quanta Assistant',
            timestamp: new Date().toISOString(),
          },
        ];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickReplies = [
    'What courses do you offer?',
    'How to register?',
    'Where can I find my profile?',
    'Contact support',
  ];

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
  }, [messages]);

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleQuickReply = (text) => {
    setInput(text);
    handleSubmit({ preventDefault: () => {} }, text);
  };

  const handleSubmit = async (e, quickReplyText) => {
    if (e.preventDefault) e.preventDefault();
    const messageText = quickReplyText || input;
    if (!messageText.trim() || isLoading) return;

    const userMessage = {
      text: messageText,
      sender: 'user',
      username: user?.username || 'User',
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!quickReplyText) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_AI_URL}/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: messageText,
          input: '',
          language: '',
        }),
      });

      if (!response.ok) throw new Error('Network error');

      const data = await response.json();

      const botMessage = {
        text: data.result || data.answer || "I couldn't understand the response format.",
        sender: 'bot',
        username: 'Quanta Assistant',
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I'm having trouble connecting to the server.",
          sender: 'bot',
          username: 'Quanta Assistant',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    setMessages([
      {
        text: "Hi! I am Quanta Assistant. What can I help you with?",
        sender: 'bot',
        username: 'Quanta Assistant',
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-96 h-[550px] bg-white rounded-lg shadow-xl flex flex-col border border-gray-200 overflow-hidden">
          <div className="bg-white text-orange-500 p-4 rounded-t-lg flex justify-between items-center border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-lg">Quanta Assistant</h3>
            </div>
            <div className="flex space-x-2">
              <button onClick={clearHistory} className="text-xs bg-orange-100 hover:bg-orange-200 text-orange-600 px-2 py-1 rounded">
                Clear
              </button>
              <button onClick={toggleChat} className="text-gray-500 hover:text-gray-700">
                <FiX size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            <div className="space-y-3">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-xs md:max-w-md ${
                      msg.sender === 'user'
                        ? 'bg-orange-500 text-white rounded-br-none'
                        : 'bg-white text-gray-800 rounded-bl-none border'
                    } px-4 py-3 rounded-xl shadow-sm`}
                  >
                    <div className="font-medium text-sm mb-1">{msg.username}</div>
                  <ReactMarkdown
  components={{
    p: ({ node, ...props }) => <p className="text-sm">{props.children}</p>,
    code: ({ node, inline, className, children, ...props }) =>
      inline ? (
        <code className="bg-gray-100 text-sm px-1 rounded">{children}</code>
      ) : (
        <pre className="bg-gray-900 text-white p-3 rounded text-sm overflow-x-auto">
          <code>{children}</code>
        </pre>
      ),
  }}
>
  {msg.text}
</ReactMarkdown>


                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {messages.length <= 1 && (
            <div className="px-4 pb-2">
              <div className="grid grid-cols-2 gap-2">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickReply(reply)}
                    className="text-xs bg-white border border-gray-200 hover:bg-orange-50 hover:border-orange-200 px-3 py-2 rounded-lg text-left transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type question..."
                className="w-full border border-gray-300 rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors"
                disabled={isLoading || !input.trim()}
              >
                <FiSend size={18} />
              </button>
            </div>
            <div className="text-xs text-gray-500 mt-2 text-center">
              You are communicating with AI. Responses are generated automatically.
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={toggleChat}
          className="bg-orange-500 text-white p-5 rounded-full shadow-lg hover:shadow-xl hover:bg-orange-600 transition-all"
        >
          <FiMessageSquare size={24} />
        </button>
      )}
    </div>
  );
};

export default ChatAssistant;