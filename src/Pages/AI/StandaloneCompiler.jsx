import React, { useState } from 'react';
import axios from 'axios';
import Editor from '@monaco-editor/react';
import { API_URL } from '../../Api/api';

const StandaloneCompiler = ({ onBack }) => {
  const codeTemplates = {
    javascript: `console.log("Hello, World!");`,
    python: `print("Hello, World!")`,
    cpp: `#include <iostream>
using namespace std;
int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
    go: `package main
import "fmt"
func main() {
    fmt.Println("Hello, World!")
}`,
    csharp: `using System;
class Program {
    static void Main() {
        Console.WriteLine("Hello, World!");
    }
}`,
    java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
  };

  const [code, setCode] = useState(codeTemplates.javascript);
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    if (!code.trim() || Object.values(codeTemplates).includes(code.trim())) {
      setCode(codeTemplates[newLanguage]);
    }
  };

  const handleCodeAction = async (action) => {
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
        `${API_URL}/compiler/`,
        {
          code,
          language,
          action,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const { stdout, stderr, exit_code } = response.data;
      if (exit_code === 0) {
        setOutput(stdout || 'Code executed successfully, but no output was produced.');
      } else {
        setOutput(stderr || `Error: Code execution failed with exit code ${exit_code}.`);
      }
    } catch (error) {
      console.error(`${action} error:`, {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      setOutput(
        `Error: ${error.response?.data?.stderr || error.response?.data?.detail || error.message || `Failed to ${action} code.`}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-5xl border border-gray-200 p-6 rounded-lg shadow-xl bg-white">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-orange-500">Code Compiler</h2>
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="p-2 bg-gray-100 border border-gray-300 text-gray-800 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="go">Go</option>
            <option value="csharp">C#</option>
            <option value="java">Java</option>
          </select>
        </div>

        <div className="flex">
          <div className="w-1/2 pr-4">
            <div className="border rounded-lg overflow-hidden">
              <Editor
                height="400px"
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

            <div className="flex gap-4 mt-4">
              <button
                onClick={() => handleCodeAction('test')}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-lg font-medium transition-all duration-200 disabled:bg-gray-400"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Running...' : 'Run Code'}
              </button>
              <button
                onClick={onBack}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 p-3 rounded-lg font-medium transition-all duration-200"
              >
                Back
              </button>
            </div>
          </div>

          <div className="w-1/2 bg-gray-100 p-4 rounded-lg text-sm font-mono border border-gray-300">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Output:</h3>
            <pre className="p-2 bg-white rounded-md whitespace-pre-wrap break-all max-h-[400px] overflow-auto">
              {output}
            </pre>
            <div className="mt-4 flex flex-col gap-2">
              <button
                onClick={() => handleCodeAction('refactor')}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-lg font-medium transition-all duration-200 disabled:bg-gray-400"
                disabled={isSubmitting}
              >
                Refactor Code
              </button>
              <button
                onClick={() => handleCodeAction('analyze')}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-lg font-medium transition-all duration-200 disabled:bg-gray-400"
                disabled={isSubmitting}
              >
                Analyze Code
              </button>
              <button
                onClick={() => handleCodeAction('optimize')}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-lg font-medium transition-all duration-200 disabled:bg-gray-400"
                disabled={isSubmitting}
              >
                Optimize Performance
              </button>
              <button
                onClick={() => handleCodeAction('debug')}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-lg font-medium transition-all duration-200 disabled:bg-gray-400"
                disabled={isSubmitting}
              >
                Debug Code
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StandaloneCompiler;