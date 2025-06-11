import React, { useState } from 'react';
import axios from 'axios';
import Editor from '@monaco-editor/react';
import { API_URL } from '../../Api/api';

const LessonCompiler = ({ tasks, courseId, moduleId, lessonId, onHintRequest, hintData }) => {
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(0);
  const [code, setCode] = useState(tasks[0]?.solution?.initial_code || '// Write your code here...');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState(tasks[0]?.language === 1 ? 'python' : 'javascript');
  const [hint, setHint] = useState({ text: '', code: '' });
  const [isLoadingHint, setIsLoadingHint] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentTask = tasks[selectedTaskIndex] || null;

  const handleRunCode = async () => {
    if (!currentTask?.id) {
      setOutput('Error: Invalid task ID.');
      return;
    }
    if (!code.trim()) {
      setOutput('Please write some code first.');
      return;
    }

    setIsSubmitting(true);
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        setOutput('Error: Please log in to submit code.');
        return;
      }
      const response = await axios.post(
        `${API_URL}/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/submit-answer/`,
        {
          answers: [{ exercise_id: currentTask.id, submitted_code: code }],
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const result = response.data.results[0];
      setOutput(
        result.is_correct
          ? 'Correct!'
          : `Incorrect. Output: ${result.submitted_output || 'None'}\nExpected: ${result.expected_output || 'None'}\nError: ${result.stderr || 'None'}`
      );
    } catch (error) {
      setOutput(
        `Error: ${error.response?.data?.detail || error.message || 'Failed to submit code.'}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchHint = async () => {
    if (!currentTask?.id) {
      setHint({ text: 'Error: Invalid task ID.', code: '' });
      return;
    }

    setIsLoadingHint(true);
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        setHint({ text: 'Error: Please log in to request a hint.', code: '' });
        return;
      }

      const response = await onHintRequest(currentTask.id, true, code);

      if (response.hint) {
        setHint({
          text: response.hint || 'No hint provided.',
          code: response.fixed_code || '',
        });
      } else {
        setHint({
          text: response.error || 'Unable to fetch hint.',
          code: '',
        });
      }
    } catch (error) {
      if (error.response?.status === 500) {
        setHint({
          text: `Unable to fetch hint from server. Please review the task description: "${currentTask.description || 'No description available.'}" or check your code for syntax errors.`,
          code: currentTask.solution?.initial_code || '',
        });
      } else {
        setHint({
          text: `Error fetching hint: ${error.response?.data?.detail || error.message || 'Failed to fetch hint from server.'}`,
          code: '',
        });
      }
    } finally {
      setIsLoadingHint(false);
    }
  };

  const handleTaskChange = (index) => {
    setSelectedTaskIndex(index);
    setCode(tasks[index]?.solution?.initial_code || '// Write your code here...');
    setLanguage(tasks[index]?.language === 1 ? 'python' : 'javascript');
    setOutput('');
    setHint({ text: '', code: '' });
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-5xl border border-gray-200 p-6 rounded-lg shadow-xl bg-white">
        {tasks.length > 1 && (
          <div className="mb-6">
            <label htmlFor="task-select" className="block text-sm font-medium mb-2 text-gray-700">
              Select Task
            </label>
            <select
              id="task-select"
              value={selectedTaskIndex}
              onChange={(e) => handleTaskChange(Number(e.target.value))}
              className="w-full p-2 bg-gray-100 border border-gray-300 text-gray-800 rounded-lg mb-4 focus:ring-2 focus:ring-orange-500"
            >
              {tasks.map((task, index) => (
                <option key={task.id} value={index}>
                  {task.title}
                </option>
              ))}
            </select>
          </div>
        )}
        {currentTask ? (
          <div className="mb-6 relative">
            <div className="absolute top-0 right-0 flex items-center space-x-2">
              <span className="text-sm text-gray-600">Hint count:</span>
              {hintData && currentTask ? (
                <button
                  onClick={() => fetchHint()}
                  disabled={isLoadingHint || !hintData[currentTask.id] || hintData[currentTask.id].remaining === 0}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                    isLoadingHint || !hintData[currentTask.id] || hintData[currentTask.id].remaining === 0
                      ? 'bg-gray-400'
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                  title={
                    !hintData[currentTask.id]
                      ? 'No hint data available'
                      : hintData[currentTask.id].remaining === 0
                      ? `No hints available. Next hint in ${hintData[currentTask.id].next_available_in_minutes || 'unknown'} minutes.`
                      : `${hintData[currentTask.id].remaining || 0} hints remaining`
                  }
                >
                  {hintData[currentTask.id]?.remaining || 0}
                </button>
              ) : (
                <button
                  disabled
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-gray-400"
                  title="No hint data available"
                >
                  0
                </button>
              )}
            </div>
            <h2 className="text-2xl font-bold mb-4 text-orange-500">{currentTask.title}</h2>
            <p className="text-gray-700 mb-4">{currentTask.description}</p>
            <div className="mb-4">
              <strong>Expected Output:</strong>{' '}
              <code>{currentTask.solution?.expected_output || 'Not specified'}</code>
            </div>
          </div>
        ) : (
          <p className="text-red-600">Error: No task provided.</p>
        )}

        <div className="flex">
          <div className="w-1/2 pr-4">
            <div className="border rounded-lg overflow-hidden">
              <Editor
                height="300px"
                defaultLanguage="javascript"
                language={language}
                theme="vs-light"
                value={code}
                onChange={(newValue) => setCode(newValue)}
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  automaticLayout: true,
                }}
              />
            </div>
            <button
              onClick={handleRunCode}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-lg font-medium mt-4 transition-all duration-200 disabled:bg-gray-400"
              disabled={isSubmitting || !currentTask}
            >
              {isSubmitting ? 'Submitting...' : 'Run Code'}
            </button>
          </div>
          <div className="w-1/2 bg-gray-100 p-4 rounded-lg text-sm font-mono border border-gray-300">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Output:</h3>
            <pre className="p-2 bg-white rounded-md whitespace-pre-wrap break-all max-h-[300px] overflow-auto">
              {output}
            </pre>
          </div>
        </div>
      </div>

      {hint.text && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
          onClick={() => setHint({ text: '', code: '' })}
        >
          <div
            className="bg-white rounded-lg shadow-xl p-6 max-w-[80vw] max-h-[80vh] w-[80vw] overflow-auto"
            onClick={(e) => e.stopPropagation()}
            style={{ boxSizing: 'border-box' }}
          >
            <h3 className="text-xl font-bold mb-4">Hint from Backend</h3>
            <div className="mb-4 text-gray-700">
              {hint.text.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
            {hint.code && (
              <div className="mb-4">
                <h4 className="text-lg font-semibold mb-2">Suggested Code:</h4>
                <pre
                  className="whitespace-pre-wrap font-mono p-4 bg-gray-100 rounded-md max-h-[60vh] overflow-auto"
                  style={{ fontSize: '14px' }}
                >
                  {hint.code}
                </pre>
              </div>
            )}
            <button
              onClick={() => setHint({ text: '', code: '' })}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

LessonCompiler.defaultProps = {
  hintData: {},
  tasks: [],
};

export default LessonCompiler;