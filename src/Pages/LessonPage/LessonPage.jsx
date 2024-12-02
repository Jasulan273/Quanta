import React from 'react';
import { Link, useParams } from 'react-router-dom';
import lessonImage1 from '../../Materials/Images/banner.png';
import lessonImage2 from '../../Materials/Images/banner.png';
import ScrollProgress from '../../Components/ScrollProgress';

const LessonPage = () => {
  const { lessonId } = useParams();

  const lessonData = {
    title: "Advanced Concepts in Programming",
    content: [
      "In this comprehensive lesson, you will explore advanced concepts in programming. We'll cover key principles that every developer should understand, including Object-Oriented Programming (OOP), functional programming, and algorithms. Each of these topics will deepen your understanding and help you write cleaner, more efficient code.",
      "Object-Oriented Programming (OOP) allows you to structure your programs using objects and classes. This approach improves code reusability and maintainability. Understanding inheritance, encapsulation, and polymorphism is essential for mastering OOP.",
      "Functional programming is another paradigm that treats computation as the evaluation of mathematical functions. We'll look at pure functions, immutability, and higher-order functions.",
      "Lastly, we'll dive into algorithms, exploring sorting algorithms, searching techniques, and understanding their time complexities. Knowing the basics of algorithms can significantly optimize the performance of your programs.",
      "We will also provide multiple visual aids like charts and diagrams to help explain the key ideas and ensure clarity in these advanced topics."
    ],
    extraContent: [
      "Section 1: Understanding Object-Oriented Programming (OOP)",
      "Section 2: Deep Dive into Functional Programming",
      "Section 3: Introduction to Algorithms and Data Structures",
      "Section 4: Best Practices in Software Development"
    ],
    images: [lessonImage1, lessonImage2],
    lessonInfo: {
      duration: "1 hour 30 minutes",
      difficulty: "Intermediate",
      topic: "Advanced Programming Techniques"
    }
  };

  return (
    <div>
      <ScrollProgress />
      <div className="container mx-auto my-16 px-4">
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-4">{lessonData.title} - {lessonId}</h1>
          <div className="text-gray-600 text-lg">
            <p><strong>Duration:</strong> {lessonData.lessonInfo.duration}</p>
            <p><strong>Difficulty Level:</strong> {lessonData.lessonInfo.difficulty}</p>
            <p><strong>Topic:</strong> {lessonData.lessonInfo.topic}</p>
          </div>
        </div>

        <div className="relative mb-12">
          <img src={lessonImage1} alt="Visual representation of the programming lesson" className="w-full h-[600px] object-cover rounded-lg shadow-lg" />
        </div>

        <div className="bg-white p-10 rounded-lg shadow-xl">
          {lessonData.content.map((paragraph, index) => (
            <p key={index} className="mb-6 text-xl text-gray-800 leading-relaxed">
              {paragraph}
            </p>
          ))}

          <div className="flex flex-wrap gap-8 my-8">
            {lessonData.images.map((image, index) => (
              <img key={index} src={image} alt={`Visual representation ${index + 1}`} className="w-full max-w-[700px] h-auto rounded-lg shadow-lg" />
            ))}
          </div>

          <div className="mt-12">
            <h2 className="text-4xl font-semibold mb-6">Lesson Sections</h2>
            <ul className="list-disc pl-6 text-xl text-gray-700">
              {lessonData.extraContent.map((section, index) => (
                <li key={index} className="mb-4">
                  {section}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex justify-between my-8 text-xl">
          {parseInt(lessonId) > 1 && (
            <Link to={`/lesson/${parseInt(lessonId) - 1}`} className="text-orange-500 font-bold">
              &larr; Previous Lesson
            </Link>
          )}
          <Link to={`/lesson/${parseInt(lessonId) + 1}`} className="text-orange-500 font-bold">
            Next Lesson &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LessonPage;
