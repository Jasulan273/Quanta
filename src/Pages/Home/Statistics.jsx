import React from "react";

const stats = [
    { id: 1, title: "Active Students", value: '25K+' },
    { id: 2, title: "Courses", value: 899 },
    { id: 3, title: "Instructors", value: 150 },
    { id: 4, title: "Rate", value: '9' },
]

const Statistics = () => {
  return (
    <div className="w-container mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
       {stats.map((stat) => (
        <div key={stat.id} className="flex justify-center flex-col items-center w-[300px] h-[180px] bg-gray-100 rounded-[24px]">
              <h2 className="text-primary font-bold">{stat.value}</h2>
              <p className="font-semibold">{stat.title}</p>
        </div>
       ))}
      </div>
    </div>
  );
};

export default Statistics;
