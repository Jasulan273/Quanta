import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LanguageQuiz from "./LanguageQuiz";
import AiNotes from "./AiNotes";
import ProjectToR from "./ProjectToR";
import StandaloneCompiler from "./StandaloneCompiler";

const AI = ({ user }) => {
  const [selectedFeature, setSelectedFeature] = useState(null);

  const features = [
    {
      id: 'language',
      title: 'Programming Language Selector',
      description: 'Take a quiz to discover which programming language suits you best',
      icon: '🧠',
      color: 'from-orange-400 to-amber-500'
    },
    {
      id: 'summary',
      title: 'AI Notes Generator',
      description: 'Transform complex topics into simple, understandable notes',
      icon: '📓',
      color: 'from-orange-400 to-amber-500'
    },
    {
      id: 'project-tor',
      title: 'Project ToR Generator',
      description: 'Create a detailed Terms of Reference for your pet project',
      icon: '📝',
      color: 'from-orange-400 to-amber-500'
    },
    {
      id: 'compiler',
      title: 'Code Compiler',
      description: 'Write and test your code with instant feedback',
      icon: '💻',
      color: 'from-orange-400 to-amber-500'
    }
  ];

  const handleBack = () => {
    setSelectedFeature(null);
  };

  const renderFeature = () => {
    if (!selectedFeature) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-4xl p-6"
        >
          <h1 className="text-4xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-600">
            Developer AI Assistant
          </h1>
          <p className="text-lg text-gray-600 text-center mb-10">
            Choose the tool you need for your tasks
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <motion.div
                key={feature.id}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 cursor-pointer"
                onClick={() => setSelectedFeature(feature.id)}
              >
                <div className={`h-2 bg-gradient-to-r ${feature.color}`}></div>
                <div className="p-6">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h2 className="text-2xl font-bold mb-2 text-gray-800">{feature.title}</h2>
                  <p className="text-gray-600">{feature.description}</p>
                  <div className="mt-4 flex justify-end">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${feature.color} text-white`}>
                      Select →
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 text-center text-gray-500">
            <p>Select a feature to get started</p>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-5xl p-6"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBack}
          className="mb-6 flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all duration-200"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </motion.button>
        {selectedFeature === 'language' && <LanguageQuiz onBack={handleBack} />}
        {selectedFeature === 'summary' && <AiNotes onBack={handleBack} user={user} />}
        {selectedFeature === 'project-tor' && <ProjectToR onBack={handleBack} />}
        {selectedFeature === 'compiler' && <StandaloneCompiler onBack={handleBack} />}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-orange-50 to-amber-50 p-4">
      <AnimatePresence mode="wait">
        {renderFeature()}
      </AnimatePresence>
    </div>
  );
};

export default AI;