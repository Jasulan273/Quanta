import React, { useState, useEffect } from 'react';

const LessonCompiler = () => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [pyodide, setPyodide] = useState(null);

  useEffect(() => {
    const loadPyodide = async () => {
      if (language === 'python' && !pyodide) {
        const { loadPyodide } = await import('https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.mjs');
        const pyInstance = await loadPyodide();
        setPyodide(pyInstance);
      }
    };

    loadPyodide();
  }, [language]);

  const handleRunCode = async () => {
    if (!code.trim()) {
      setOutput('Please write some code first.');
      return;
    }

    const captureConsole = [];
    const originalConsoleLog = console.log;

    console.log = (message) => {
      captureConsole.push(message);
    };

    try {
      if (language === 'python') {
        if (!pyodide) {
          setOutput('Python runtime is still loading. Please wait...');
          return;
        }
        const result = pyodide.runPython(code);
        if (captureConsole.length > 0) {
          setOutput(captureConsole.join('\n'));
        } else {
          setOutput(result !== undefined ? result.toString() : 'Code executed, but no output.');
        }
      } else if (language === 'javascript') {
        const result = eval(code);
        if (captureConsole.length > 0) {
          setOutput(captureConsole.join('\n'));
        } else {
          setOutput(result !== undefined ? result.toString() : 'Code executed, but no output.');
        }
      } else {
        setOutput(`Language ${language} is not supported yet.`);
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      console.log = originalConsoleLog;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-e5e7eb text-black ">
      <div className="w-full border-[2px] p-4 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-center border-b-[2px] pb-1">Universal Code Compiler</h2>
        <div className="flex flex-col mb-4 ">
          <label htmlFor="language" className="block text-sm font-medium mb-2 text-black">
            Select Language
          </label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-1/4 p-2 bg-primary text-white rounded-lg hover:opacity-2 "
          >
            <option className='hover:bg-white' value="javascript">JavaScript</option>
            <option value="python">Python</option>
          </select>
        </div>
        <div className="flex gap-4">
          <div className="w-1/2 bg-white p-4 rounded-lg shadow-lg">
            <label htmlFor="code" className="block text-sm font-medium mb-2 text-black">
              Write Your Code
            </label>
            <textarea
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows="15"
              className="w-full p-4 bg-e5e7eb rounded-lg text-sm font-mono outline-none shadow-lg border-[1px]  "
              placeholder="Enter your code here..."
            ></textarea>
            <button
              onClick={handleRunCode}
              className="w-full bg-primary hover:bg-[#d57f34] p-3 rounded-lg font-medium mt-4 text-white transition"
            >
              Run Code
            </button>
          </div>
          <div className="w-1/2 bg-white p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-2 text-black">Output:</h3>
            <div className="w-full h-full bg-e5e7eb p-4 rounded-lg text-sm font-mono">
              <pre>{output}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonCompiler;