import React, { useEffect, useState, useRef } from 'react';
import { API_URL } from '../../Api/api';

const Statistics = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [countedValues, setCountedValues] = useState([0, 0, 0, 0]);
  const [stats, setStats] = useState([
    { id: 1, title: 'Active Students', value: 0 },
    { id: 2, title: 'Courses', value: 899 },
    { id: 3, title: 'Instructors', value: 0 },
    { id: 4, title: 'Rate', value: 9 },
  ]);
  const statsRef = useRef(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_URL}/site-stats/`);
        const data = await response.json();
        setStats([
          { id: 1, title: 'Active Students', value: data.total_students },
          { id: 2, title: 'Courses', value: data.total_courses },
          { id: 3, title: 'Instructors', value: data.total_authors },
          { id: 4, title: 'Rate', value: data.average_site_rating },
        ]);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (statsRef.current) {
        const rect = statsRef.current.getBoundingClientRect();
        if (rect.top <= window.innerHeight && rect.bottom >= 0) {
          setIsVisible(true);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isVisible) {
      stats.forEach((stat, index) => {
        let current = 0;
        const step = Math.ceil(stat.value / 100);
        const interval = setInterval(() => {
          current += step;
          if (current >= stat.value) {
            clearInterval(interval);
            current = stat.value;
          }
          setCountedValues((prev) => {
            const updatedValues = [...prev];
            updatedValues[index] = current;
            return updatedValues;
          });
        }, 20);
      });
    }
  }, [isVisible, stats]);

  return (
    <div ref={statsRef} className="w-full max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-8 sm:mt-10">
        {stats.map((stat, index) => (
          <div
            key={stat.id}
            className="flex justify-center flex-col items-center w-full max-w-[250px] h-36 sm:h-40 bg-gray-100 rounded-3xl mx-auto"
          >
            <h2 className="text-primary font-bold text-lg sm:text-xl">{countedValues[index]}</h2>
            <p className="font-semibold text-sm sm:text-base">{stat.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Statistics;