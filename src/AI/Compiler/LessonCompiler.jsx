import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';

const LessonCompiler = () => {
  const [code, setCode] = useState('// Write your code here...');
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
      if (language === 'python') {
        if (!pyodide) {
          setOutput('Python runtime is still loading. Please wait...');
          return;
        }
        const result = pyodide.runPython(code);
        setOutput(captureConsole.length ? captureConsole.join('\n') : result?.toString() || 'Code executed, but no output.');
      } else if (language === 'javascript') {
        const result = eval(code);
        setOutput(captureConsole.length ? captureConsole.join('\n') : result?.toString() || 'Code executed, but no output.');
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
    <div className="flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-5xl border border-gray-200 p-6 rounded-lg shadow-xl bg-white flex">
        <div className="w-1/2 pr-4">
          <h2 className="text-2xl font-bold mb-4 text-orange-500 text-center">Quanta Compiler</h2>
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

          {/* Monaco Editor */}
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
          <pre className="p-2 bg-white rounded-md">{output}</pre>
        </div>
      </div>
    </div>
  );
};

export default LessonCompiler;
