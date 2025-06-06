import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ProjectToR = ({ onBack }) => {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState('');
  const [techStack, setTechStack] = useState('');
  const [torGenerated, setTorGenerated] = useState(false);
  const [correctionRequest, setCorrectionRequest] = useState('');

  const generateToR = () => {
    if (!projectName.trim() || !description.trim()) {
      return;
    }
    setTorGenerated(true);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-5xl border border-gray-200 p-6 rounded-lg shadow-xl bg-white"
      >
        <h2 className="text-2xl font-bold mb-4 text-orange-500">Project ToR Generator</h2>
        
        {!torGenerated ? (
          <div className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Project Name
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full p-2 bg-gray-100 border border-gray-300 text-gray-800 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="Enter project name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Project Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 bg-gray-100 border border-gray-300 text-gray-800 rounded-lg focus:ring-2 focus:ring-orange-500"
                rows="4"
                placeholder="Describe your project"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Key Features (Optional)
              </label>
              <textarea
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                className="w-full p-2 bg-gray-100 border border-gray-300 text-gray-800 rounded-lg focus:ring-2 focus:ring-orange-500"
                rows="4"
                placeholder="List key features"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Technical Stack (Optional)
              </label>
              <textarea
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
                className="w-full p-2 bg-gray-100 border border-gray-300 text-gray-800 rounded-lg focus:ring-2 focus:ring-orange-500"
                rows="4"
                placeholder="Specify technical stack"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={generateToR}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-lg font-medium transition-all duration-200"
              >
                Generate ToR
              </button>
              <button
                onClick={onBack}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 p-3 rounded-lg font-medium transition-all duration-200"
              >
                Back
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="space-y-6">
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-orange-500">1. Project Overview</h3>
                <p className="text-gray-700">{projectName}: {description}</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-orange-500">2. Key Features</h3>
                <p className="text-gray-700">{features || 'To be defined.'}</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-orange-500">3. Technical Stack</h3>
                <p className="text-gray-700">{techStack || 'To be defined.'}</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-orange-500">4. Next Steps</h3>
                <ul className="list-disc pl-5 text-gray-700">
                  <li>Define project timeline and milestones</li>
                  <li>Assign team roles and responsibilities</li>
                  <li>Set up development environment</li>
                </ul>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Request Corrections
              </label>
              <textarea
                value={correctionRequest}
                onChange={(e) => setCorrectionRequest(e.target.value)}
                className="w-full p-2 bg-gray-100 border border-gray-300 text-gray-800 rounded-lg focus:ring-2 focus:ring-orange-500"
                rows="4"
                placeholder="Describe any corrections needed for the ToR"
              />
              <div className="flex gap-4 mt-4">
                <button
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-lg font-medium transition-all duration-200"
                >
                  Submit Correction
                </button>
                <button
                  onClick={() => setTorGenerated(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 p-3 rounded-lg font-medium transition-all duration-200"
                >
                  Edit ToR
                </button>
                <button
                  onClick={onBack}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 p-3 rounded-lg font-medium transition-all duration-200"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProjectToR;