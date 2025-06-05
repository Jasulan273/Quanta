import React, { useState } from 'react';

const AiNotes = () => {
  const [topic, setTopic] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic) return;

    setIsLoading(true);
    try {
      const prompt = `Create a clear and concise learning summary (cheatsheet/notes) about the topic "${topic}". Keep it beginner-friendly and informative. Format in markdown or bullet points.`;

      const response = await fetch(`${process.env.REACT_APP_AI_URL}/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: prompt,
          input: '',
          language: '',
        }),
      });

      const data = await response.json();
      setSummary(data.result || data.answer || 'No summary generated.');
    } catch (err) {
      setSummary('Error generating summary.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6">
      <h2 className="text-xl font-bold text-orange-500 mb-4">📝 Generate a Study Summary</h2>
      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter topic (e.g., Python Lists)"
        className="w-full mb-4 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
      />
      <button
        onClick={handleGenerate}
        disabled={isLoading}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg text-sm"
      >
        {isLoading ? 'Generating...' : 'Generate Summary'}
      </button>

      {summary && (
        <div className="mt-6 bg-orange-50 p-4 rounded-lg text-sm text-gray-800 whitespace-pre-wrap">
          {summary}
        </div>
      )}
    </div>
  );
};

export default AiNotes;
