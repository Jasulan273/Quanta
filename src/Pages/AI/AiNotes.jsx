import React, { useState, useEffect, useCallback } from 'react';
import { API_URL } from '../../Api/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

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

  const fetchChats = useCallback(async () => {
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
  }, [selectedChatId]);

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
      const sendResponse = await fetch(`${API_URL}/conspect/${chat_id}/send-message/`, {
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
      const response = await fetch(`${API_URL}/conspect/${selectedChatId}/send-message/`, {
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

  const handleDeleteChat = async (chatId) => {
    if (!window.confirm('Are you sure you want to delete this chat?')) return;
    try {
      const response = await fetch(`${API_URL}/conspect/${chatId}/`, {
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
    const response = await fetch(`${API_URL}/conspect/${chatId}/pdf/`, {
      method: 'POST',
      headers: {
        ...(localStorage.getItem('accessToken') ? { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } : {}),
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.log(errorData)
      throw new Error('Failed to generate PDF');
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
    a.download = `conspect_${chatId}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (err) {
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

  return (
    <div className="flex w-full h-screen bg-gray-100">
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-orange-500 flex items-center">
            <span className="mr-2">📝</span>
            Conspect AI
          </h2>
        </div>
        
        <button
          onClick={() => setIsCreatingChat(true)}
          className="m-4 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg text-sm transition-colors"
        >
          New Chat
        </button>

        {isCreatingChat && (
          <div className="mx-4 mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <input
              type="text"
              value={newChatTopic}
              onChange={(e) => setNewChatTopic(e.target.value)}
              placeholder="Enter topic (e.g., Python Lists)"
              className="w-full mb-3 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            />
            <select
              value={newChatLanguage}
              onChange={(e) => setNewChatLanguage(e.target.value)}
              className="w-full mb-3 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
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
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg text-sm disabled:bg-gray-400 transition-colors"
              >
                {isLoading ? 'Creating...' : 'Create'}
              </button>
              <button
                onClick={() => setIsCreatingChat(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg text-sm transition-colors"
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
                className={`p-3 mx-2 my-1 rounded-lg border border-transparent transition-colors ${
                  selectedChatId === chat.id 
                    ? 'bg-orange-100 border-orange-200' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div
                    onClick={() => setSelectedChatId(chat.id)}
                    className="cursor-pointer flex-1"
                  >
                    <p className="font-semibold text-gray-800 truncate">{chat.topic}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {chat.language}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(chat.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleGeneratePDF(chat.id)}
                      className="text-gray-500 hover:text-orange-500"
                      title="Generate PDF"
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
            <div className="p-4 text-center text-gray-500">
              No chats yet. Create one!
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          {selectedChatId ? (
            messages.length > 0 ? (
              <div className="max-w-4xl mx-auto space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-orange-50 ml-auto w-fit max-w-xl'
                        : 'bg-gray-50 mr-auto w-full'
                    }`}
                  >
                    <div className="font-semibold text-sm mb-2 text-gray-600">
                      {msg.role === 'user' ? 'You' : 'AI Assistant'}
                    </div>
                    <div className="prose max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ node, ...props }) => <p className="mb-3" {...props} />,
                          ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-3" {...props} />,
                          ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-3" {...props} />,
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
                              <code className="bg-gray-200 px-1 py-0.5 rounded text-sm" {...props}>
                                {children}
                              </code>
                            ),
                          h1: ({ node, children, ...props }) => <h1 className="text-2xl font-bold mb-3 mt-4" {...props}>{children || 'Heading'}</h1>,
                          h2: ({ node, children, ...props }) => <h2 className="text-xl font-bold mb-3 mt-4" {...props}>{children || 'Subheading'}</h2>,
                          h3: ({ node, children, ...props }) => <h3 className="text-lg font-bold mb-3 mt-4" {...props}>{children || 'Sub-subheading'}</h3>,
                          blockquote: ({ node, ...props }) => (
                            <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-3" {...props} />
                          ),
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                No messages yet. Start the conversation!
              </div>
            )
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <div className="text-4xl mb-4">📚</div>
                <p className="text-xl">Select a chat or create a new one to start</p>
              </div>
            </div>
          )}
        </div>

        {selectedChatId && (
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full p-3 pr-16 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !newMessage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-lg disabled:bg-gray-400 transition-colors"
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
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

export default AiNotes;