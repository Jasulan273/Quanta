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
        console.log(data)
        setStats([
          { id: 1, title: 'Active Students', value: data.total_students },
          { id: 2, title: 'Courses', value: 899 },
          { id: 3, title: 'Instructors', value: data.total_authors },
          { id: 4, title: 'Rate', value: 9 },
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
    <div ref={statsRef} className="w-container mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
        {stats.map((stat, index) => (
          <div
            key={stat.id}
            className="flex justify-center flex-col items-center w-[300px] h-[180px] bg-gray-100 rounded-[24px]"
          >
            <h2 className="text-primary font-bold">{countedValues[index]}</h2>
            <p className="font-semibold">{stat.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Statistics;