import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';

const LessonCompiler = ({ task }) => {
  const [code, setCode] = useState('// Write your code here...');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [pyodide, setPyodide] = useState(null);
  const [showHintModal, setShowHintModal] = useState(false);
  const [hint, setHint] = useState({ textBefore: '', code: '', textAfter: '' }); // Изменяем hint на объект с тремя полями
  const [isLoadingHint, setIsLoadingHint] = useState(false);

  useEffect(() => {
    const loadPyodide = async () => {
      if (language === 'python' && !pyodide) {
        const { loadPyodide } = await import('https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.mjs');
        const pyInstance = await loadPyodide();
        setPyodide(pyInstance);
      }
    };
    loadPyodide();
  }, [language, pyodide]);

  const handleRunCode = async () => {
    if (!code.trim()) {
      setOutput('Please write some code first.');
      return;
    }

    let captureConsole = [];
    const originalConsoleLog = console.log;
    console.log = (message) => captureConsole.push(message);

    try {
      let result;
      if (language === 'python') {
        if (!pyodide) {
          setOutput('Python runtime is still loading. Please wait...');
          return;
        }
        result = pyodide.runPython(code);
      } else if (language === 'javascript') {
        // eslint-disable-next-line
        result = eval(code);
      } else {
        setOutput(`Language ${language} is not supported yet.`);
        return;
      }

      const finalOutput = captureConsole.length ? captureConsole.join('\n') : result?.toString() || 'Code executed, but no output.';
      setOutput(finalOutput);

      if (task && finalOutput.trim() !== task.expected_output.trim()) {
        setTimeout(() => {
          setShowHintModal(true);
        }, 3000);
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      console.log = originalConsoleLog;
    }
  };

  const fetchHintFromAI = async () => {
    setIsLoadingHint(true);

    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'deepseek-coder:1.3b',
          prompt: `Task: ${task.description}\n\nUser's code (${language}):\n${code}\n\nError: The output (${output}) does not match the expected result (${task.expected_output}). Provide a hint or solution in ${language}, write short and needed info.`,
          stream: false,
        }),
      });

      const data = await response.json();
      const rawHint = data.response;

      // Парсим текст подсказки
      // Ищем код между ```javascript и ```
      const codeBlockMatch = rawHint.match(/```javascript\n([\s\S]*?)\n```/);
      let hintTextBefore = '';
      let hintCode = '';
      let hintTextAfter = '';

      if (codeBlockMatch) {
        hintCode = codeBlockMatch[1].trim(); // Извлекаем код между ```javascript и ```
        // Делим текст на части до и после блока кода
        const parts = rawHint.split(/```javascript\n[\s\S]*?\n```/);
        hintTextBefore = parts[0].trim();
        hintTextAfter = parts[1] ? parts[1].replace(/`[^`]*`/, '').trim() : ''; // Удаляем лишние символы вроде ` ^ }
      } else {
        hintTextBefore = rawHint.trim();
      }

      setHint({ textBefore: hintTextBefore, code: hintCode, textAfter: hintTextAfter });
    } catch (error) {
      console.error('Error fetching hint:', error);
      setHint({ textBefore: 'Не удалось получить подсказку. Попробуйте снова.', code: '', textAfter: '' });
    } finally {
      setIsLoadingHint(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-5xl border border-gray-200 p-6 rounded-lg shadow-xl bg-white">
        {task && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4 text-orange-500">{task.name}</h2>
            <p className="text-gray-700 mb-4">{task.description}</p>
            <div className="mb-4">
              <strong>Input:</strong> <code>{task.input}</code>
            </div>
            <div className="mb-4">
              <strong>Expected Output:</strong> <code>{task.expected_output}</code>
            </div>
          </div>
        )}

        <div className="flex">
          <div className="w-1/2 pr-4">
            <label htmlFor="language" className="block text-sm font-medium mb-2 text-gray-700">Select Language</label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-2 bg-gray-100 border border-gray-300 text-gray-800 rounded-lg mb-4 focus:ring-2 focus:ring-orange-500"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
            </select>

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
              className="w-full bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-lg font-medium mt-4 transition-all duration-200"
            >
              Run Code
            </button>
          </div>

          <div className="w-1/2 bg-gray-100 p-4 rounded-lg text-sm font-mono border border-gray-300">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Output:</h3>
            <pre className="p-2 bg-white rounded-md whitespace-pre-wrap break-all max-h-[300px] overflow-auto">{output}</pre>
          </div>
        </div>
      </div>

      {showHintModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
          onClick={() => setShowHintModal(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl p-6 max-w-[80vw] max-h-[80vh] w-[80vw] overflow-auto"
            onClick={(e) => e.stopPropagation()}
            style={{ boxSizing: 'border-box' }}
          >
            <h3 className="text-xl font-bold mb-4">Нужна подсказка?</h3>
            <p className="mb-4">
              Ваш вывод не соответствует ожидаемому результату. Хотите получить подсказку?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  fetchHintFromAI();
                }}
                disabled={isLoadingHint}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
              >
                {isLoadingHint ? 'Загрузка...' : 'Да, дайте подсказку'}
              </button>
              <button
                onClick={() => setShowHintModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Нет, спасибо
              </button>
            </div>
          </div>
        </div>
      )}

      {hint.textBefore && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
          onClick={() => setHint({ textBefore: '', code: '', textAfter: '' })}
        >
          <div
            className="bg-white rounded-lg shadow-xl p-6 max-w-[80vw] max-h-[80vh] w-[80vw] overflow-auto"
            onClick={(e) => e.stopPropagation()}
            style={{ boxSizing: 'border-box' }}
          >
            <h3 className="text-xl font-bold mb-4">Подсказка от ИИ</h3>
            <div className="mb-4 text-gray-700">
              {hint.textBefore.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
            {hint.code && (
              <div className="mb-4">
                <h4 className="text-lg font-semibold mb-2">Пример кода:</h4>
                <pre className="whitespace-pre-wrap font-mono p-4 bg-gray-100 rounded-md max-h-[60vh] overflow-auto" style={{ fontSize: '14px' }}>
                  {hint.code}
                </pre>
              </div>
            )}
            {hint.textAfter && (
              <div className="mb-4 text-gray-700">
                {hint.textAfter.split('\n').map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            )}
            <button
              onClick={() => setHint({ textBefore: '', code: '', textAfter: '' })}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mt-4"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonCompiler;