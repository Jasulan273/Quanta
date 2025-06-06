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
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.5, 
        ease: [0.2, 0.8, 0.2, 1],
        staggerChildren: 0.1
      } 
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  const optionVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.03, 
      boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.1)',
      transition: {
        duration: 0.2
      }
    },
    tap: { scale: 0.98 },
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-8">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-64"
            >
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"
              ></motion.div>
              <motion.p 
                className="mt-6 text-gray-600 text-lg font-medium"
                animate={{
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity
                }}
              >
                Finding your perfect languages...
              </motion.p>
            </motion.div>
          ) : result ? (
            <motion.div
              key="result"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
                Your Top Languages
              </h2>
              
              <div className="mb-8 text-gray-700 text-lg leading-relaxed space-y-3">
                {textAnswer.split('\n').map((line, index) => (
                  <motion.p 
                    key={index} 
                    className="mb-2"
                    variants={optionVariants}
                  >
                    {line}
                  </motion.p>
                ))}
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-8">
                {languages.map((lang, index) => (
                  <motion.div
                    key={index}
                    className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl text-center text-orange-800 font-semibold text-lg border border-orange-100"
                    whileHover={{ 
                      scale: 1.05, 
                      boxShadow: '0px 10px 25px rgba(245, 158, 11, 0.2)',
                      y: -5
                    }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
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
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-3 rounded-xl text-lg font-medium transition-all duration-200 shadow-md"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Start Over
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
              <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
                Find Your Perfect Language
              </h2>
              
              <p className="text-gray-700 mb-6 text-xl font-medium">
                {questions[currentQuestion].question}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                {questions[currentQuestion].options.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswer(option.value)}
                    className="p-4 bg-white hover:bg-orange-50 rounded-xl text-gray-800 text-lg font-medium border-2 border-gray-100 hover:border-orange-200 transition-all duration-200"
                    variants={optionVariants}
                    whileHover="hover"
                    whileTap="tap"
                    initial="hidden"
                    animate="visible"
                    custom={index}
                  >
                    {option.text}
                  </motion.button>
                ))}
              </div>
              
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <motion.div 
                  className="bg-gradient-to-r from-orange-500 to-amber-500 h-2.5 rounded-full" 
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                    transition: { duration: 0.6 }
                  }}
                />
              </div>
              <p className="mt-2 text-right text-gray-500 text-sm font-medium">
                Question {currentQuestion + 1} of {questions.length}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LanguageQuiz;