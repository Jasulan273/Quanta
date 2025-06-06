import { useState } from "react";
import { motion } from "framer-motion";
import LanguageQuiz from "./LanguageQuiz";
import AiNotes from "./AiNotes";

const AI = () => {
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
      color: 'from-purple-500 to-indigo-600'
    }
  ];

  const renderFeature = () => {
    switch (selectedFeature) {
      case 'language':
        return <LanguageQuiz onBack={() => setSelectedFeature(null)} />;
      case 'summary':
        return <AiNotes onBack={() => setSelectedFeature(null)} />;
      default:
        return (
          <div className="w-full max-w-4xl p-6">
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
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-orange-50 to-amber-50 p-4">
      {renderFeature()}
    </div>
  );
};

export default AI;