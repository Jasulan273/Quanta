import React, { useState } from 'react';
import axios from 'axios';
import Editor from '@monaco-editor/react';
import { API_URL } from '../../Api/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

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
  const [modalContent, setModalContent] = useState(null);

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    if (!code.trim() || Object.values(codeTemplates).includes(code.trim())) {
      setCode(codeTemplates[newLanguage]);
    }
  };

  const handleRunCode = async () => {
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
          input: code,
          language,
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
      setOutput(
        `Error: ${error.response?.data?.stderr || error.response?.data?.detail || error.message || 'Failed to run code.'}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAIFeature = async (feature) => {
    if (!code.trim()) {
      setOutput('Please write some code first.');
      return;
    }

    setIsSubmitting(true);
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        setOutput('Error: Please log in to use AI features.');
        return;
      }

      const response = await axios.post(
        `${API_URL}/compiler-features/`,
        {
          input: code,
          feature,
          language,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const { text, code: newCode } = response.data;
      setModalContent({ feature, text, code: newCode });
    } catch (error) {
      setOutput(
        `Error: ${error.response?.data?.detail || error.message || `Failed to ${feature.toLowerCase()}.`}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setModalContent(null);
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
                onClick={handleRunCode}
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
            <div className="flex space-x-2 mb-4">
              {['Refactor code', 'Analyze Code', 'Optimize Performance', 'Debug Code'].map((feature) => (
                <button
                  key={feature}
                  onClick={() => handleAIFeature(feature)}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-lg font-medium transition-all duration-200 disabled:bg-gray-400 text-xs"
                  disabled={isSubmitting}
                >
                  {feature}
                </button>
              ))}
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Output:</h3>
            <pre className="p-2 bg-white rounded-md whitespace-pre-wrap break-all max-h-[360px] overflow-auto">
              {output}
            </pre>
          </div>
        </div>
      </div>

      {modalContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-orange-500">{modalContent.feature}</h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ node, ...props }) => <p className="text-gray-700 mb-4" {...props} />,
                code: ({ node, inline, className, children, ...props }) =>
                  !inline ? (
                    <SyntaxHighlighter
                      language={language}
                      style={atomDark}
                      PreTag="div"
                      className="rounded-md text-sm my-2"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className="bg-gray-200 px-1 py-0.5 rounded text-sm text-gray-800" {...props}>
                      {children}
                    </code>
                  ),
              }}
            >
              {modalContent.text}
            </ReactMarkdown>
            {modalContent.code && (
              <SyntaxHighlighter
                language={language}
                style={atomDark}
                PreTag="div"
                className="rounded-md text-sm my-2"
              >
                {modalContent.code}
              </SyntaxHighlighter>
            )}
            <button
              onClick={closeModal}
              className="mt-4 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-lg font-medium transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StandaloneCompiler;