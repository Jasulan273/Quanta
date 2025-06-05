import React, { useState, useEffect, useRef } from 'react';
import { FiSend, FiX, FiHelpCircle, FiChevronDown } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';

const HighlightChat = ({ contentRef }) => {
  const [isIconVisible, setIsIconVisible] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState({ icon: { x: 0, y: 0 }, chat: { x: 0, y: 0 } });
  const [lockedChatPosition, setLockedChatPosition] = useState(null);
  const messagesEndRef = useRef(null);
  const chatRef = useRef(null);
  const iconRef = useRef(null);
  const lastSelectionRef = useRef(null);
  const AI_API_URL = process.env.REACT_APP_AI_URL;

  useEffect(() => {
    const handleSelection = (e) => {
      const selection = window.getSelection();
      const text = selection.toString().trim();
      setSelectedText(text);

      if (!text || !selection.rangeCount) {
        setIsIconVisible(false);
        setIsOptionsOpen(false);
        setIsChatOpen(false);
        setLockedChatPosition(null);
        lastSelectionRef.current = null;
        return;
      }

      const currentSelection = text + selection.rangeCount;
      if (lastSelectionRef.current === currentSelection) return;
      lastSelectionRef.current = currentSelection;

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const parentRect = contentRef.current?.getBoundingClientRect() || { top: 0, left: 0 };

      const centerX = rect.left + rect.width / 2 + window.scrollX - parentRect.left;
      const bottomY = rect.bottom + window.scrollY - parentRect.top;

      const chatHeight = 400;
      const offset = 10;
      const viewportHeight = window.innerHeight;
      let chatY = rect.top + window.scrollY - parentRect.top - chatHeight - offset;
      if (chatY < window.scrollY + 10) {
        chatY = bottomY + offset;
      }

      const viewportWidth = window.innerWidth;
      const chatWidth = 320;
      const clampedX = Math.min(Math.max(centerX, chatWidth / 2), viewportWidth - chatWidth / 2);

      const newPosition = {
        icon: { x: clampedX, y: bottomY },
        chat: { x: clampedX, y: chatY },
      };

      setPosition(newPosition);
      setLockedChatPosition(newPosition.chat);
      setIsIconVisible(true);
      setIsOptionsOpen(false);
    };

    const handleClickOutside = (e) => {
      if (
        chatRef.current &&
        !chatRef.current.contains(e.target) &&
        iconRef.current &&
        !iconRef.current.contains(e.target)
      ) {
        setIsIconVisible(false);
        setIsOptionsOpen(false);
        setIsChatOpen(false);
        setLockedChatPosition(null);
        lastSelectionRef.current = null;
      }
    };

    document.addEventListener('mouseup', handleSelection);
    document.addEventListener('touchend', handleSelection);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('touchend', handleSelection);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [contentRef]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const openOptions = (e) => {
    e.stopPropagation();
    setIsOptionsOpen((prev) => !prev);
  };

  const startChatWithPrompt = (mode) => (e) => {
    e.stopPropagation();
    setIsOptionsOpen(false);
    setIsIconVisible(false);
    setIsChatOpen(true);
    const prompt = getPromptByMode(mode, selectedText);
    setMessages([
      {
        text: prompt,
        sender: 'user',
        timestamp: new Date().toISOString(),
      },
    ]);
    setIsLoading(true);
  };

  const getPromptByMode = (mode, text) => {
    switch (mode) {
      case 'explain_term':
        return `Explain the key terms in this text:\n"${text}"`;
      case 'summarize':
        return `Summarize the following text:\n"${text}"`;
      case 'translate':
        return `Translate the following text to Russian:\n"${text}"`;
      case 'context':
        return `Explain the full context and meaning of this text:\n"${text}"`;
      default:
        return `Explain this text:\n"${text}"`;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      text: input,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${AI_API_URL}/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: input,
          context: selectedText,
          language: 'en',
        }),
      });

      if (!response.ok) throw new Error('Network error');

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          text: data.result || data.answer || 'Sorry, could not process response.',
          sender: 'bot',
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          text: 'Sorry, could not connect to server.',
          sender: 'bot',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const closeChat = () => {
    setIsChatOpen(false);
    setIsOptionsOpen(false);
    setMessages([]);
    setInput('');
    window.getSelection().removeAllRanges();
    setLockedChatPosition(null);
    lastSelectionRef.current = null;
  };

  return (
    <>
      {isIconVisible && !isChatOpen && (
        <div
          ref={iconRef}
          className="fixed z-[1000] flex items-center justify-center"
          style={{
            left: `${position.icon.x}px`,
            top: `${position.icon.y}px`,
            transform: 'translate(-50%, 0)',
          }}
        >
          <button
            onClick={openOptions}
            className="bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
            aria-label="Open AI options"
          >
            <FiHelpCircle size={24} />
            <FiChevronDown
              size={16}
              className={`ml-1 transition-transform ${isOptionsOpen ? 'rotate-180' : ''}`}
            />
          </button>

          <div
            className={`absolute mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-200 ${isOptionsOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}
            style={{ pointerEvents: isOptionsOpen ? 'auto' : 'none', left: '50%', transform: 'translateX(-50%)', top: '100%' }}
          >
            <button
              onClick={startChatWithPrompt('explain_term')}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-100"
            >
              Explain Terms
            </button>
            <button
              onClick={startChatWithPrompt('context')}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-100"
            >
              Explain Context
            </button>
            <button
              onClick={startChatWithPrompt('summarize')}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-100"
            >
              Summarize
            </button>
            <button
              onClick={startChatWithPrompt('translate')}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-100"
            >
              Translate to Russian
            </button>
          </div>
        </div>
      )}

      {isChatOpen && (
        <div
          ref={chatRef}
          className="fixed z-[1000] bg-white rounded-lg shadow-xl w-80 max-h-[400px] flex flex-col border border-gray-200"
          style={{
            left: `${(lockedChatPosition || position.chat).x}px`,
            top: `${(lockedChatPosition || position.chat).y}px`,
            transform: 'translate(-50%, 0)',
          }}
        >
          <div className="bg-blue-600 text-white p-3 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold text-sm">Ask about selected text</h3>
            <button
              onClick={closeChat}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <FiX size={16} />
            </button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto bg-white">
            <div className="text-xs text-gray-500 mb-2 p-2 bg-gray-100 rounded">
              Selected: "{selectedText}"
            </div>

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-3`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-900 rounded-bl-none'} shadow-sm`}
                >
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      code: ({ inline, children }) =>
                        inline ? (
                          <code className="bg-gray-200 px-2 py-1 rounded text-sm">{children}</code>
                        ) : (
                          <pre className="bg-gray-900 text-white p-3 rounded-md text-xs overflow-x-auto">
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
      )}
    </>
  );
};

export default HighlightChat;