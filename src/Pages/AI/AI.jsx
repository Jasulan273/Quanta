import { useState } from "react";
import LanguageQuiz from "./LanguageQuiz";
import AiNotes from "./AiNotes";

const AI = () => {
  const [selectedFeature, setSelectedFeature] = useState(null);

  const renderFeature = () => {
    switch (selectedFeature) {
      case 'language':
        return <LanguageQuiz />;
      case 'summary':
        return <AiNotes />;
      default:
        return (
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-2xl font-bold text-orange-500">Выберите функцию</h1>
            <button
              onClick={() => setSelectedFeature('language')}
              className="bg-orange-400 hover:bg-orange-500 text-white py-2 px-4 rounded-lg"
            >
              🧠 Выбор ЯП
            </button>
            <button
              onClick={() => setSelectedFeature('summary')}
              className="bg-orange-400 hover:bg-orange-500 text-white py-2 px-4 rounded-lg"
            >
              📓 Конспект
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-orange-100 to-gray-200">
      {renderFeature()}
    </div>
  );
};

export default AI;
