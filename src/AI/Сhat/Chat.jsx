import React, { useState, useEffect } from 'react';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isServerOnline, setIsServerOnline] = useState(false);

  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await fetch('http://localhost:11434/api/tags');
        if (response.ok) {
          setIsServerOnline(true);
          console.log('✅ Ollama API доступен');
        } else {
          setIsServerOnline(false);
          console.error('⚠️ Ollama API недоступен');
        }
      } catch (error) {
        setIsServerOnline(false);
        console.error('❌ Ошибка соединения с Ollama:', error);
      }
    };
    checkServer();
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    if (!isServerOnline) {
      setMessages(prev => [...prev, { role: 'bot', content: '❌ Сервер Ollama недоступен' }]);
      return;
    }

    try {
      console.log('🔄 Отправка запроса в Ollama...');
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'deepseek-coder:1.3b',
          prompt: input + '\n\n(Respond concisely and succinctly.)',
          stream: false
        })
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'bot', content: formatResponse(data.response) }]);
    } catch (error) {
      console.error('❌ Ошибка запроса:', error);
      setMessages(prev => [...prev, { role: 'bot', content: '❌ Ошибка соединения с Ollama' }]);
    }
  };

  const formatResponse = (text) => {
    return text
      .replace(/```sh([\s\S]*?)```/g, '<pre class="bg-black text-green-400 p-4 rounded-md overflow-x-auto"><code>$1</code></pre>')
      .replace(/```bash([\s\S]*?)```/g, '<pre class="bg-black text-green-400 p-4 rounded-md overflow-x-auto"><code>$1</code></pre>')
      .replace(/```python([\s\S]*?)```/g, '<pre class="bg-gray-900 text-green-400 p-4 rounded-md overflow-x-auto"><code>$1</code></pre>')
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-900 text-white p-4 rounded-md overflow-x-auto"><code>$1</code></pre>');
  };

  return (
    <div className="flex flex-col h-screen bg-white text-gray-900 p-6">
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`p-4 text-lg rounded-xl max-w-[75%] leading-relaxed whitespace-pre-line ${msg.role === 'user' ? 'bg-gray-200 text-gray-900 self-start' : 'bg-gray-300 text-gray-900 self-end'}`}
            dangerouslySetInnerHTML={{ __html: msg.content }}
          />
        ))}
      </div>
      <div className="flex gap-4 p-4 bg-gray-100 rounded-xl shadow-lg">
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="Введите сообщение..."
          className="flex-1 p-3 text-lg border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white px-6 py-3 text-lg rounded-xl hover:bg-blue-600 transition">Отправить</button>
      </div>
    </div>
  );
};

export default Chat;