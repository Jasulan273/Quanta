import React, { useState, useEffect } from 'react';
import { API_URL } from '../../Api/api';

const AiNotes = ({ user }) => {
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newChatTopic, setNewChatTopic] = useState('');
  const [newChatLanguage, setNewChatLanguage] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingChat, setIsCreatingChat] = useState(false);

  const languages = ['Python', 'JavaScript', 'Go', 'Java', 'C++', 'Ruby', 'TypeScript', 'PHP'];

  const fetchChats = async () => {
    try {
      const response = await fetch(`${API_URL}/conspect/`, {
        headers: {
          ...(localStorage.getItem('accessToken') ? { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } : {}),
        },
      });
      if (!response.ok) throw new Error('Failed to fetch chats');
      const data = await response.json();
      setChats(data);
      if (data.length > 0 && !selectedChatId) {
        setSelectedChatId(data[0].id);
      }
    } catch (err) {
      console.error('Error fetching chats:', err.message);
    }
  };

  const fetchChatHistory = async (chatId) => {
    try {
      const response = await fetch(`${API_URL}/conspect/${chatId}/`, {
        headers: {
          ...(localStorage.getItem('accessToken') ? { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } : {}),
        },
      });
      if (!response.ok) throw new Error('Failed to fetch chat history');
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (err) {
      console.error('Error fetching chat history:', err.message);
      setMessages([]);
    }
  };

  const handleCreateChat = async () => {
    if (!newChatTopic || !newChatLanguage) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/conspect/start/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('accessToken') ? { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } : {}),
        },
        body: JSON.stringify({
          topic: newChatTopic,
          language: newChatLanguage,
          rules_style: 'Beginner-friendly Markdown Notes',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to start chat');
      }

      const { chat_id } = await response.json();
      await fetchChats();
      setSelectedChatId(chat_id);

      const prompt = `Create a clear and concise learning summary (cheatsheet/notes) about the topic "${newChatTopic}" in ${newChatLanguage}. Keep it beginner-friendly and informative. Format in markdown or bullet points.`;
      const sendResponse = await fetch(`${API_URL}/conspect/${chat_id}/send/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('accessToken') ? { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } : {}),
        },
        body: JSON.stringify({
          content: prompt,
        }),
      });

      if (!sendResponse.ok) {
        const errorData = await sendResponse.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to send initial message');
      }

      const data = await sendResponse.json();
      setMessages(data.messages || []);
      setNewChatTopic('');
      setNewChatLanguage('');
      setIsCreatingChat(false);
    } catch (err) {
      console.error('Error creating chat:', err.message);
      setMessages([...messages, { role: 'assistant', content: `Error: ${err.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage || !selectedChatId) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/conspect/${selectedChatId}/send/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('accessToken') ? { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } : {}),
        },
        body: JSON.stringify({
          content: newMessage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to send message');
      }

      const data = await response.json();
      setMessages(data.messages || []);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err.message);
      setMessages([...messages, { role: 'assistant', content: `Error: ${err.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [user,fetchChats]);

  useEffect(() => {
    if (selectedChatId) {
      fetchChatHistory(selectedChatId);
    } else {
      setMessages([]);
    }
  }, [selectedChatId]);

  return (
    <div className="flex w-full max-w-5xl mx-auto bg-gray-100 rounded-2xl shadow-lg overflow-hidden">
      <div className="w-80 bg-white p-4 flex flex-col">
        <h2 className="text-xl font-bold text-orange-500 mb-4">📝 Conspect AI</h2>
        <button
          onClick={() => setIsCreatingChat(true)}
          className="mb-4 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg text-sm"
        >
          New Chat
        </button>
        {isCreatingChat && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <input
              type="text"
              value={newChatTopic}
              onChange={(e) => setNewChatTopic(e.target.value)}
              placeholder="Enter topic (e.g., Python Lists)"
              className="w-full mb-2 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <select
              value={newChatLanguage}
              onChange={(e) => setNewChatLanguage(e.target.value)}
              className="w-full mb-2 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="">Select language</option>
              {languages.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                onClick={handleCreateChat}
                disabled={isLoading || !newChatTopic || !newChatLanguage}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg text-sm disabled:bg-gray-400"
              >
                {isLoading ? 'Creating...' : 'Create Chat'}
              </button>
              <button
                onClick={() => setIsCreatingChat(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        <div className="flex-1 overflow-y-auto">
          {chats.length > 0 ? (
            chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChatId(chat.id)}
                className={`p-3 mb-2 rounded-lg cursor-pointer ${selectedChatId === chat.id ? 'bg-orange-100' : 'hover:bg-gray-50'}`}
              >
                <p className="font-semibold text-gray-800 truncate">{chat.topic}</p>
                <p className="text-sm text-gray-500">{chat.language}</p>
                <p className="text-xs text-gray-400">{new Date(chat.created_at).toLocaleDateString()}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No chats yet. Create one!</p>
          )}
        </div>
      </div>
      <div className="flex-1 flex flex-col bg-white">
        <div className="flex-1 overflow-y-auto p-6">
          {selectedChatId ? (
            messages.length > 0 ? (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-4 p-4 rounded-lg max-w-3xl mx-auto ${msg.role === 'user' ? 'bg-orange-50 text-right' : 'bg-gray-50'}`}
                >
                  <p className="font-semibold text-gray-800">{msg.role === 'user' ? 'You' : 'AI'}</p>
                  <p className="text-gray-700 whitespace-pre-wrap">{msg.content}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No messages yet. Start the conversation!</p>
            )
          ) : (
            <p className="text-gray-500 text-center mt-10">Select a chat or create a new one to start.</p>
          )}
        </div>
        {selectedChatId && (
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2 max-w-3xl mx-auto">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !newMessage}
                className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg text-sm disabled:bg-gray-400"
              >
                {isLoading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiNotes;