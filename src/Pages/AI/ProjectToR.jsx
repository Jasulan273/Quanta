import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { API_URL } from '../../Api/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ProjectToR = ({ user, onBack }) => {
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newChatTopic, setNewChatTopic] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChats = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/project_tor/`, {
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
  }, [selectedChatId]);

  const fetchChatHistory = async (chatId) => {
    try {
      const response = await fetch(`${API_URL}/project_tor/${chatId}/`, {
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
    if (!newChatTopic) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/project_tor/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('accessToken') ? { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } : {}),
        },
        body: JSON.stringify({ topic: newChatTopic }),
      });
      if (!response.ok) throw new Error('Failed to create chat');
      const data = await response.json();
      await fetchChats();
      setSelectedChatId(data.chat_id);
      setNewChatTopic('');
      setIsCreatingChat(false);
    } catch (err) {
      console.error('Error creating chat:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage || !selectedChatId) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/project_tor/${selectedChatId}/send-message/`, {
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
    } catch (err) {
      console.error('Error sending message:', err.message);
      setMessages([...messages, { role: 'assistant', content: `Error: ${err.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteChat = async (chatId) => {
    if (!window.confirm('Are you sure you want to delete this chat?')) return;
    try {
      const response = await fetch(`${API_URL}/project_tor/${chatId}/`, {
        method: 'DELETE',
        headers: {
          ...(localStorage.getItem('accessToken') ? { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } : {}),
        },
      });
      if (!response.ok) throw new Error('Failed to delete chat');
      await fetchChats();
      if (selectedChatId === chatId) {
        setSelectedChatId(null);
        setMessages([]);
      }
    } catch (err) {
      console.error('Error deleting chat:', err.message);
    }
  };

  const handleGeneratePDF = async (chatId) => {
    try {
      const response = await fetch(`${API_URL}/project_tor/${chatId}/pdf/`, {
        method: 'POST',
        headers: {
          ...(localStorage.getItem('accessToken') ? { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } : {}),
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error('Failed to generate PDF: ' + errorData);
      }

      const data = await response.json();
      const url = data.url;
      if (!url) {
        throw new Error('No URL found in response');
      }

      const fullUrl = url.startsWith('http') ? url : `${API_URL}${url}`;

      const downloadResponse = await fetch(fullUrl);
      if (!downloadResponse.ok) {
        const errorData = await downloadResponse.text();
        throw new Error('Failed to download PDF: ' + errorData);
      }

      const contentType = downloadResponse.headers.get('Content-Type');
      if (!contentType || !contentType.includes('application/pdf')) {
        const errorData = await downloadResponse.text();
        throw new Error('Invalid file type received: ' + contentType + ' - ' + errorData);
      }

      const blob = await downloadResponse.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `project_tor_${chatId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('Error generating PDF:', err.message);
      alert(`Failed to generate PDF: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [user, fetchChats]);

  useEffect(() => {
    if (selectedChatId) {
      fetchChatHistory(selectedChatId);
    } else {
      setMessages([]);
    }
  }, [selectedChatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex w-full h-[calc(100vh-5rem)] bg-gray-50">
      <div className="w-72 bg-orange-50 text-gray-800 flex flex-col shadow-md border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Project ToR</h2>
        </div>
        <div className="m-4">
          <button
            onClick={() => setIsCreatingChat(true)}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md text-sm font-medium transition-colors duration-200"
          >
            New ToR
          </button>
        </div>
        {isCreatingChat && (
          <div className="mx-4 mb-4 p-4 bg-white rounded-md border border-gray-200">
            <input
              type="text"
              value={newChatTopic}
              onChange={(e) => setNewChatTopic(e.target.value)}
              placeholder="Enter project topic"
              className="w-full mb-3 p-2 rounded-md bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreateChat}
                disabled={isLoading || !newChatTopic}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md text-sm font-medium disabled:bg-gray-300 transition-colors duration-200"
              >
                {isLoading ? 'Creating...' : 'Create'}
              </button>
              <button
                onClick={() => setIsCreatingChat(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-md text-sm font-medium transition-colors duration-200"
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
                className={`p-3 mx-2 my-1 rounded-md border border-transparent transition-colors duration-200 ${
                  selectedChatId === chat.id ? 'bg-orange-100 border-orange-300' : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div
                    onClick={() => setSelectedChatId(chat.id)}
                    className="cursor-pointer flex-1 min-w-0"
                  >
                    <p className="font-medium text-sm truncate" style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                      {chat.topic}
                    </p>
                    <span className="text-xs text-gray-500">
                      {new Date(chat.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleGeneratePDF(chat.id)}
                      className="text-gray-500 hover:text-orange-500"
                      title="Download PDF"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-5L9 2H6a2 2 0 00-2 2zm7 3a1 1 0 10-2 0v4a1 1 0 102 0V7zm-5 6a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteChat(chat.id)}
                      className="text-gray-500 hover:text-red-500"
                      title="Delete Chat"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">No ToR chats yet. Create one!</div>
          )}
        </div>
      </div>
      <div className="flex-1 flex flex-col bg-white border-l border-gray-200">
        <div className="flex-1 overflow-y-auto p-5">
          {selectedChatId ? (
            messages.length > 0 ? (
              <div className="max-w-3xl mx-auto space-y-3">
                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`p-4 rounded-md border border-gray-200 shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-orange-50 ml-auto w-fit max-w-md'
                        : 'bg-gray-50 mr-auto w-full'
                    }`}
                  >
                    <div className="font-semibold text-xs mb-1 text-gray-600">
                      {msg.role === 'user' ? 'You' : 'AI Assistant'}
                    </div>
                    <div className="prose max-w-none text-gray-800">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ node, ...props }) => <p className="mb-2 leading-relaxed" {...props} />,
                          ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2" {...props} />,
                          ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-2" {...props} />,
                          li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                          code: ({ node, inline, className, children, ...props }) =>
                            !inline ? (
                              <SyntaxHighlighter
                                language={className?.replace('language-', '') || 'javascript'}
                                style={atomDark}
                                PreTag="div"
                                className="rounded-md text-sm my-2"
                                {...props}
                              >
                                {String(children).replace(/\n$/, '')}
                              </SyntaxHighlighter>
                            ) : (
                              <code className="bg-gray-200 px-1 py-0.5 rounded text-sm text-gray-800" {...props}>
                                {children}
                              </code>
                            ),
                          h1: ({ node, children, ...props }) => <h1 className="text-2xl font-bold mb-3 mt-4" {...props}>{children || 'Heading'}</h1>,
                          h2: ({ node, children, ...props }) => <h2 className="text-xl font-bold mb-2 mt-3" {...props}>{children || 'Subheading'}</h2>,
                          h3: ({ node, children, ...props }) => <h3 className="text-lg font-bold mb-2 mt-3" {...props}>{children || 'Sub-subheading'}</h3>,
                          blockquote: ({ node, ...props }) => (
                            <blockquote className="border-l-4 border-orange-300 pl-3 italic text-gray-600 mb-2" {...props} />
                          ),
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                No messages yet. Start the conversation!
              </div>
            )
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <div className="text-3xl mb-3">📋</div>
                <p className="text-lg">Select a ToR or create a new one to start</p>
              </div>
            </div>
          )}
        </div>
        {selectedChatId && (
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full p-2 pr-12 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-gray-50 text-gray-800"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !newMessage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-md disabled:bg-gray-300 transition-colors duration-200"
                >
                  {isLoading ? (
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectToR;