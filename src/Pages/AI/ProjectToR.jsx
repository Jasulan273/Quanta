import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { API_URL } from '../../Api/api';

const ProjectToR = ({ onBack }) => {
  const [projectName, setProjectName] = useState('');
  const [isCreatingChat, setIsCreatingChat] = useState(true);
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateChat = async () => {
    if (!projectName.trim()) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/project-tor/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('accessToken') ? { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } : {}),
        },
        body: JSON.stringify({ topic: projectName }),
      });
      if (!response.ok) throw new Error('Failed to create chat');
      const data = await response.json();
      setChatId(data.chat_id);
      setIsCreatingChat(false);
      setIsLoading(false);
    } catch (error) {
      console.error('Error creating ToR chat:', error);
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !chatId) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/project-tor/${chatId}/send-message/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('accessToken') ? { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } : {}),
        },
        body: JSON.stringify({ content: newMessage }),
      });
      if (!response.ok) throw new Error('Failed to send message');
      const data = await response.json();
      setMessages(data.messages || []);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages([...messages, { role: 'assistant', content: `Error: ${error.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-5xl border border-gray-200 p-6 rounded-lg shadow-xl bg-white"
      >
        <h2 className="text-2xl font-bold mb-4 text-orange-500">Project ToR Generator</h2>

        {isCreatingChat ? (
          <div className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Project Name</label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full p-2 bg-gray-100 border border-gray-300 text-gray-800 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="Enter project name"
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleCreateChat}
                disabled={isLoading || !projectName}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-lg font-medium transition-all duration-200 disabled:bg-gray-400"
              >
                {isLoading ? 'Creating...' : 'Create ToR'}
              </button>
              <button
                onClick={onBack}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 p-3 rounded-lg font-medium transition-all duration-200"
              >
                Back
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex-1 overflow-y-auto">
              {messages.length > 0 ? (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg ${msg.role === 'user' ? 'bg-orange-50 ml-auto w-fit max-w-xl' : 'bg-gray-50 mr-auto w-full'}`}
                  >
                    <div className="font-semibold text-sm mb-2 text-gray-600">
                      {msg.role === 'user' ? 'You' : 'AI Assistant'}
                    </div>
                    <p className="text-gray-700">{msg.content}</p>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500">No messages yet. Start the conversation!</div>
              )}
            </div>
            <div className="flex gap-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 bg-gray-100 border border-gray-300 text-gray-800 rounded-lg focus:ring-2 focus:ring-orange-500"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !newMessage}
                className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-lg font-medium transition-all duration-200 disabled:bg-gray-400"
              >
                {isLoading ? 'Sending...' : 'Send'}
              </button>
              <button
                onClick={onBack}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 p-3 rounded-lg font-medium transition-all duration-200"
              >
                Back
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProjectToR;