import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LanguageQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const questions = [
    {
      question: "Your project focus?",
      options: [
        { text: "Web Apps", value: "web" },
        { text: "Data Science", value: "data" },
        { text: "Games", value: "game" },
        { text: "Systems", value: "system" },
      ],
    },
    {
      question: "Learning curve?",
      options: [
        { text: "Beginner", value: "easy" },
        { text: "Moderate", value: "moderate" },
        { text: "Advanced", value: "hard" },
      ],
    },
    {
      question: "Coding experience?",
      options: [
        { text: "None", value: "beginner" },
        { text: "Some", value: "intermediate" },
        { text: "Pro", value: "advanced" },
      ],
    },
    {
      question: "Typing preference?",
      options: [
        { text: "Strict", value: "strongly_typed" },
        { text: "Flexible", value: "dynamically_typed" },
        { text: "Any", value: "no_preference" },
      ],
    },
    {
      question: "Performance priority?",
      options: [
        { text: "High speed", value: "performance" },
        { text: "Ease over speed", value: "ease" },
        { text: "Balanced", value: "balanced" },
      ],
    },
    {
      question: "Community size?",
      options: [
        { text: "Large", value: "large" },
        { text: "Niche", value: "niche" },
        { text: "Any", value: "any" },
      ],
    },
  ];

  const handleAnswer = (value) => {
    setAnswers({ ...answers, [currentQuestion]: value });
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitAnswers();
    }
  };

const submitAnswers = async () => {
  setIsLoading(true);
  try {
    const prompt = `
      Based on these quiz answers: ${JSON.stringify(answers)}, recommend 3 programming languages. 
      Provide a short, one-sentence explanation per language, directly tied to the user's answers. 
      Use simple language, no code examples. 
      Format:
      text-answer:
      1. [Language]: [Why it fits].
      2. [Language]: [Why it fits].
      3. [Language]: [Why it fits].
      languages:
      [Language]
      [Language]
      [Language]
    `;

    const response = await fetch(`${process.env.REACT_APP_AI_URL}/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: prompt,
        input: '',
        language: ''
      }),
    });

    if (!response.ok) throw new Error('Network response was not ok');

    const data = await response.json();
    setResult(data.result || data.answer || "No response received.");
  } catch (error) {
    console.error('Error:', error);
    setResult('Sorry, something went wrong.');
  } finally {
    setIsLoading(false);
  }
};


  const parseResult = () => {
    if (!result) return { textAnswer: '', languages: [] };
    const textAnswerMatch = result.match(/text-answer:([\s\S]*?)languages:/);
    const languagesMatch = result.match(/languages:([\s\S]*)/);
    const textAnswer = textAnswerMatch ? textAnswerMatch[1].trim() : result;
    const languages = languagesMatch
      ? languagesMatch[1].trim().split('\n ').map(lang => lang.trim()).filter(lang => lang)
      : [];
    return { textAnswer, languages };
  };

  const { textAnswer, languages } = parseResult();

  const cardVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
    exit: { opacity: 0, x: -100, transition: { duration: 0.3 } },
  };

  const buttonVariants = {
    hover: { scale: 1.1, boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)' },
    tap: { scale: 0.9 },
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-orange-100 to-gray-200 p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-48"
            >
              <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-orange-500"></div>
              <p className="mt-3 text-gray-600 text-sm">Finding your languages...</p>
            </motion.div>
          ) : result ? (
            <motion.div
              key="result"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <h2 className="text-xl font-bold mb-4 text-orange-500">Your Top Languages</h2>
              <div className="mb-4 text-gray-600 text-sm">
                {textAnswer.split('\n').map((line, index) => (
                  <p key={index} className="mb-1">{line}</p>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {languages.map((lang, index) => (
                  <motion.div
                    key={index}
                    className="p-3 bg-orange-50 rounded-lg text-center text-orange-600 font-semibold text-sm"
                    whileHover={{ scale: 1.15, rotate: 2, boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)' }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    {lang}
                  </motion.div>
                ))}
              </div>
              <motion.button
                onClick={() => {
                  setCurrentQuestion(0);
                  setAnswers({});
                  setResult(null);
                }}
                className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg text-sm transition-all duration-200"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Try Again
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key={currentQuestion}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <h2 className="text-xl font-bold mb-4 text-orange-500">Find Your Language</h2>
              <p className="text-gray-600 mb-3 text-base">{questions[currentQuestion].question}</p>
              <div className="grid grid-cols-2 gap-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswer(option.value)}
                    className="p-3 bg-gray-100 hover:bg-orange-100 rounded-lg text-gray-700 text-sm border border-gray-200"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    {option.text}
                  </motion.button>
                ))}
              </div>
              <div className="mt-4 text-xs text-gray-500">
                {currentQuestion + 1}/{questions.length}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LanguageQuiz;