import React, { useState, useEffect, useRef } from 'react';
import { FiSend, FiX, FiHelpCircle } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';

const HighlightChat = ({ contentRef }) => {
  const [isWindowVisible, setIsWindowVisible] = useState(false);
  const [isChatMode, setIsChatMode] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState('Russian');
  const [showLanguageInput, setShowLanguageInput] = useState(false);
  const messagesEndRef = useRef(null);
  const windowRef = useRef(null);

  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
      const selection = window.getSelection();
      const text = selection.toString().trim();
      setSelectedText(text);

      if (!text || !selection.rangeCount) {
        setIsWindowVisible(false);
        setIsChatMode(false);
        return;
      }

      setIsWindowVisible(true);
      setIsChatMode(false);
    };

    const handleClickOutside = (e) => {
      if (windowRef.current && !windowRef.current.contains(e.target)) {
        setIsWindowVisible(false);
        setIsChatMode(false);
        setMessages([]);
        setInput('');
        window.getSelection().removeAllRanges();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isChatMode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getWindowPosition = () => {
    const windowHeight = isChatMode ? 400 : 160;
    const x = window.innerWidth / 2;
    const y = Math.min(window.scrollY + 100, window.innerHeight - windowHeight - 20);
    return { x, y };
  };

  const startChatWithPrompt = (mode) => async (e) => {
    e.stopPropagation();
    if (mode === 'translate') {
      setShowLanguageInput(true);
      return;
    }
    setIsChatMode(true);
    const prompt = getPromptByMode(mode, selectedText);
    setMessages([{
      text: prompt,
      sender: 'user',
      timestamp: new Date().toLocaleString('en-US', { timeZone: 'Asia/Yekaterinburg', hour12: false }),
    }]);
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_AI_URL}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: prompt,
          input: '',
          language: '',
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          text: data.result || data.answer || 'Sorry, could not process response.',
          sender: 'bot',
          timestamp: new Date().toLocaleString('en-US', { timeZone: 'Asia/Yekaterinburg', hour12: false }),
        },
      ]);

    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          text: `Sorry, could not connect to server: ${error.message}`,
          sender: 'bot',
          timestamp: new Date().toLocaleString('en-US', { timeZone: 'Asia/Yekaterinburg', hour12: false }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTranslateSubmit = async (e) => {
    e.preventDefault();
    if (!targetLanguage.trim()) return;
    
    setShowLanguageInput(false);
    setIsChatMode(true);
    const prompt = `Translate the following text to ${targetLanguage}:\n"${selectedText}"`;
    setMessages([{
      text: prompt,
      sender: 'user',
      timestamp: new Date().toLocaleString('en-US', { timeZone: 'Asia/Yekaterinburg', hour12: false }),
    }]);
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_AI_URL}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: prompt,
          input: '',
          language: '',
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          text: data.result || data.answer || 'Sorry, could not process response.',
          sender: 'bot',
          timestamp: new Date().toLocaleString('en-US', { timeZone: 'Asia/Yekaterinburg', hour12: false }),
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          text: `Sorry, could not connect to server: ${error.message}`,
          sender: 'bot',
          timestamp: new Date().toLocaleString('en-US', { timeZone: 'Asia/Yekaterinburg', hour12: false }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getPromptByMode = (mode, text) => {
    switch (mode) {
      case 'explain_term': return `Explain the key terms in this text:\n"${text}"`;
      case 'summarize': return `Summarize the following text:\n"${text}"`;
      case 'context': return `Explain the full context and meaning of this text:\n"${text}"`;
      default: return `Explain this text:\n"${text}"`;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      text: input,
      sender: 'user',
      timestamp: new Date().toLocaleString('en-US', { timeZone: 'Asia/Yekaterinburg', hour12: false }),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_AI_URL}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: input,
          input: '',
          language: '',
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          text: data.result || data.answer || 'Sorry, could not process response.',
          sender: 'bot',
          timestamp: new Date().toLocaleString('en-US', { timeZone: 'Asia/Yekaterinburg', hour12: false }),
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          text: `Sorry, could not connect to server: ${error.message}`,
          sender: 'bot',
          timestamp: new Date().toLocaleString('en-US', { timeZone: 'Asia/Yekaterinburg', hour12: false }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const closeWindow = () => {
    setIsWindowVisible(false);
    setIsChatMode(false);
    setShowLanguageInput(false);
    setMessages([]);
    setInput('');
    window.getSelection().removeAllRanges();
  };

  const backToMenu = () => {
    setIsChatMode(false);
    setShowLanguageInput(false);
    setMessages([]);
    setInput('');
  };

  const position = getWindowPosition();

  return (
    <>
      {isWindowVisible && (
        <div
          ref={windowRef}
          className="fixed z-[10000] bg-white rounded-lg shadow-lg w-80 overflow-hidden transition-all duration-200"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            transform: 'translateX(-50%)',
            maxHeight: isChatMode ? '400px' : 'auto',
            height: isChatMode ? '400px' : 'auto',
          }}
        >
          <div className="flex items-center justify-between bg-blue-500 text-white p-2">
            {isChatMode ? (
              <>
                <button onClick={backToMenu} className="text-white hover:text-gray-200 transition-colors">
                  Back
                </button>
                <span className="text-sm font-semibold">Ask about selected text</span>
              </>
            ) : showLanguageInput ? (
              <span className="text-sm font-semibold">Select language</span>
            ) : (
              <>
                <FiHelpCircle size={20} />
                <span className="text-sm font-semibold">Text Options</span>
              </>
            )}
            <button onClick={closeWindow} className="text-white hover:text-gray-200 transition-colors">
              <FiX size={16} />
            </button>
          </div>

          {showLanguageInput ? (
            <div className="p-4">
              <form onSubmit={handleTranslateSubmit}>
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">Translate to:</label>
                  <input
                    type="text"
                    value={targetLanguage}
                    onChange={(e) => setTargetLanguage(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 transition-colors"
                >
                  Confirm
                </button>
              </form>
            </div>
          ) : isChatMode ? (
            <div className="flex flex-col h-[calc(100%-48px)]">
              <div className="flex-1 p-3 overflow-y-auto bg-white">
                <div className="text-xs text-gray-500 mb-2 p-2 bg-gray-100 rounded">
                  Selected: "{selectedText}"
                </div>

                {messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-3`}>
                    <div className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-900 rounded-bl-none'} shadow-sm`}>
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                          code: ({ inline, children }) => inline ? (
                            <code className="bg-gray-200 px-2 py-1 rounded text-sm">{children}</code>
                          ) : (
                            <pre className="bg-gray-900 text-white p-3 rounded-md text-xs overflow-x-auto"><code>{children}</code></pre>
                          ),
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start mb-3">
                    <div className="max-w-[80%] p-3 rounded-lg bg-gray-100 text-gray-900 rounded-bl-none">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 rounded-full bg-blue-300 animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce delay-100"></div>
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSubmit} className="p-3 border-t bg-white">
                <div className="relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question..."
                    className="w-full border border-gray-300 rounded-lg pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                    disabled={isLoading}
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-700 disabled:text-gray-400 transition-colors"
                    disabled={isLoading || !input.trim()}
                  >
                    <FiSend size={16} />
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="p-0">
              <button onClick={startChatWithPrompt('explain_term')} className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-100 transition-colors">
                Explain Terms
              </button>
              <button onClick={startChatWithPrompt('context')} className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-100 transition-colors">
                Explain Context
              </button>
              <button onClick={startChatWithPrompt('summarize')} className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-100 transition-colors">
                Summarize
              </button>
              <button onClick={startChatWithPrompt('translate')} className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-100 transition-colors">
                Translate
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default HighlightChat;