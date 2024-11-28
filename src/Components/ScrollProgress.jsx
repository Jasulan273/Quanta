import React, { useState, useEffect } from 'react';

export default function ScrollProgress() {
  const [scrollPercentage, setScrollPercentage] = useState(0);

  const handleScroll = () => {
    const scrollTop = window.pageYOffset;
    const winHeight = window.innerHeight;
    const docHeight = document.body.offsetHeight;

    const totalDocScrollLength = docHeight - winHeight;
    const scrollPosition = Math.floor((scrollTop / totalDocScrollLength) * 100);

    setScrollPercentage(scrollPosition);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-2 bg-gray-200 z-999">
      <div
        style={{ width: `${scrollPercentage}%` }}
        className="h-full bg-orange-500 transition-width duration-200 ease-in-out"
      ></div>
    </div>
  );
}
