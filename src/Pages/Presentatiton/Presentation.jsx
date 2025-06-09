import React, { useState, useEffect } from 'react';

const Presentation = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animationClass, setAnimationClass] = useState('');

  const slides = [
    {
      title: 'Welcome to Quanta',
      content: 'Discover Quanta, your ultimate platform for mastering programming through cutting-edge courses, AI-driven tools, and a vibrant community.',
      video: true,
      layout: 'center',
      infographic: 'users',
    },
    {
      title: 'Seamless Authentication',
      content: 'Join effortlessly with robust registration and login. Verify via email or connect instantly with Google and GitHub accounts.',
      video: true,
      layout: 'left',
      infographic: 'lock',
    },
    {
      title: 'Empowering Courses',
      content: 'Create, edit, and explore a wide range of programming courses tailored to your learning goals.',
      video: true,
      layout: 'right',
      infographic: 'book',
    },
    {
      title: 'Interactive Lessons',
      content: 'Engage with MCQ quizzes or coding assignments, enhanced by our AI assistant for real-time support.',
      video: true,
      layout: 'left',
      infographic: 'code',
    },
    {
      title: 'Vibrant Blogs',
      content: 'Share your insights by creating and managing blogs to inspire and educate the Quanta community.',
      video: true,
      layout: 'center',
      infographic: 'pen',
    },
    {
      title: 'Connect & Grow',
      content: 'Comment, subscribe to courses, and engage with peers to build a thriving learning network.',
      video: true,
      layout: 'right',
      infographic: 'network',
    },
    {
      title: 'AI-Powered Learning',
      content: 'Let AI guide your journey with personalized language selection through interactive polls.',
      video: true,
      layout: 'left',
      infographic: 'brain',
    },
    {
      title: 'Advanced AI Tools',
      content: 'Boost productivity with AI-generated notes, project briefs, and a compiler featuring code analysis and refactoring.',
      video: true,
      layout: 'center',
      infographic: 'tools',
    },
  ];

  const nextSlide = () => {
    setAnimationClass('animate-slide-out-left');
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setAnimationClass('animate-slide-in-right');
    }, 500);
  };

  const prevSlide = () => {
    setAnimationClass('animate-slide-out-right');
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      setAnimationClass('animate-slide-in-left');
    }, 500);
  };

  useEffect(() => {
    setAnimationClass('animate-slide-in-right');
  }, []);

  const renderInfographic = (type) => {
    switch (type) {
      case 'users':
        return (
          <svg className="w-16 h-16 text-orange-500 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      case 'lock':
        return (
          <svg className="w-16 h-16 text-orange-500 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0-1.104-.896-2-2-2s-2 .896-2 2v3h4v-3zm7 1c0-4.418-3.582-8-8-8s-8 3.582-8 8v6h16v-6z" />
          </svg>
        );
      case 'book':
        return (
          <svg className="w-16 h-16 text-orange-500 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'code':
        return (
          <svg className="w-16 h-16 text-orange-500 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4m-8-8l-4 4 4 4" />
          </svg>
        );
      case 'pen':
        return (
          <svg className="w-16 h-16 text-orange-500 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        );
      case 'network':
        return (
          <svg className="w-16 h-16 text-orange-500 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'brain':
        return (
          <svg className="w-16 h-16 text-orange-500 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'tools':
        return (
          <svg className="w-16 h-16 text-orange-500 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen w-full relative overflow-hidden flex items-center justify-center py-4 px-6 bg-gradient-to-br from-gray-100 to-orange-100">
      <svg className="absolute inset-0 w-full h-full opacity-20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 167, 38, 0.2)" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)"/>
        <path
          d="M0 0 Q 300 200 600 100 T 1200 300 Q 1500 400 1800 200"
          fill="none"
          stroke="rgba(255, 167, 38, 0.3)"
          strokeWidth="2"
          className="animate-draw-line"
        />
        <path
          d="M1800 0 Q 1500 300 1200 200 T 600 400 Q 300 500 0 300"
          fill="none"
          stroke="rgba(255, 167, 38, 0.3)"
          strokeWidth="2"
          className="animate-draw-line-reverse"
        />
      </svg>
      <div className="w-full max-w-[1800px] relative z-10">
        <div className="h-[calc(100vh-2rem)] flex flex-col items-center justify-center">
          <div className="w-full flex-1 flex items-center justify-center">
            <div className={`w-full ${animationClass}`}>
              {slides[currentSlide].layout === 'center' ? (
                <div className="flex flex-col items-center text-center p-4">
                  <div className="mb-4 flex items-center space-x-4">
                    {renderInfographic(slides[currentSlide].infographic)}
                    <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
                      {slides[currentSlide].title}
                    </h1>
                  </div>
                  <p className="text-xl text-gray-700 max-w-2xl mb-6 leading-relaxed">
                    {slides[currentSlide].content}
                  </p>
                  {slides[currentSlide].video && (
                    <div className="w-full max-w-[960px]">
                      <div className="bg-gray-800 rounded-[16px] shadow-lg border-2 border-gray-200 overflow-hidden">
                        <div className="bg-gray-700 h-6 flex items-center px-2 space-x-1">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse delay-75"></div>
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-150"></div>
                        </div>
                        <div className="aspect-video bg-gray-300 flex items-center justify-center">
                          <p className="text-gray-600 text-base">16:9 Video Placeholder</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className={`flex ${slides[currentSlide].layout === 'left' ? 'flex-row' : 'flex-row-reverse'} gap-8 p-4`}>
                  <div className="w-1/2 flex flex-col justify-center">
                    <div className="flex items-center space-x-4 mb-4">
                      {renderInfographic(slides[currentSlide].infographic)}
                      <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                        {slides[currentSlide].title}
                      </h1>
                    </div>
                    <p className="text-lg text-gray-700 leading-relaxed">
                      {slides[currentSlide].content}
                    </p>
                  </div>
                  {slides[currentSlide].video && (
                    <div className="w-1/2">
                      <div className="bg-gray-800 rounded-[16px] shadow-lg border-2 border-gray-200 overflow-hidden">
                        <div className="bg-gray-700 h-6 flex items-center px-2 space-x-1">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse delay-75"></div>
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-150"></div>
                        </div>
                        <div className="aspect-video bg-gray-300 flex items-center justify-center">
                          <p className="text-gray-600 text-base">16:9 Video Placeholder</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-between mt-4 w-full">
            <button
              onClick={prevSlide}
              className="bg-orange-600 text-white font-bold text-base py-2 px-6 rounded-[20px] hover:bg-orange-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              disabled={currentSlide === 0}
            >
              Previous
            </button>
            <button
              onClick={nextSlide}
              className="bg-orange-600 text-white font-bold text-base py-2 px-6 rounded-[20px] hover:bg-orange-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              disabled={currentSlide === slides.length - 1}
            >
              Next
            </button>
          </div>
          <div className="flex justify-center mt-4 space-x-2">
            {slides.map((_, index) => (
              <div
                key={index}
                onClick={() => {
                  setAnimationClass(index > currentSlide ? 'animate-slide-out-left' : 'animate-slide-out-right');
                  setTimeout(() => {
                    setCurrentSlide(index);
                    setAnimationClass(index > currentSlide ? 'animate-slide-in-right' : 'animate-slide-in-left');
                  }, 500);
                }}
                className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
                  index === currentSlide ? 'bg-orange-600 scale-125' : 'bg-gray-400 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes slide-in-right {
          0% { opacity: 0; transform: translateX(100px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-in-left {
          0% { opacity: 0; transform: translateX(-100px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-out-left {
          0% { opacity: 1; transform: translateX(0); }
          100% { opacity: 0; transform: translateX(-100px); }
        }
        @keyframes slide-out-right {
          0% { opacity: 1; transform: translateX(0); }
          100% { opacity: 0; transform: translateX(100px); }
        }
        @keyframes draw-line {
          0% { stroke-dashoffset: 2000; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes draw-line-reverse {
          0% { stroke-dashoffset: 2000; }
          100% { stroke-dashoffset: 0; }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.5s ease-out forwards;
        }
        .animate-slide-in-left {
          animation: slide-in-left 0.5s ease-out forwards;
        }
        .animate-slide-out-left {
          animation: slide-out-left 0.5s ease-out forwards;
        }
        .animate-slide-out-right {
          animation: slide-out-right 0.5s ease-out forwards;
        }
        .animate-draw-line {
          stroke-dasharray: 2000;
          stroke-dashoffset: 2000;
          animation: draw-line 10s linear infinite;
        }
        .animate-draw-line-reverse {
          stroke-dasharray: 2000;
          stroke-dashoffset: 2000;
          animation: draw-line-reverse 10s linear infinite reverse;
        }
      `}</style>
    </div>
  );
};

export default Presentation;