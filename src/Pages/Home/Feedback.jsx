import React from "react";
import Quote from '../../Materials/Images/“.png'

const FeedbackData = [
  {
    id: 1,
    name: "Roe Smith",
    profession: "Designer",
    feedback:
      "I must explain to you how all this mistaken . Tdea of denouncing pleasure and praising pain was born and I will give you a complete account of the system and expound",
  },
  {
    id: 2,
    name: "Roe Smith",
    profession: "Designer",
    feedback:
      "I must explain to you how all this mistaken . Tdea of denouncing pleasure and praising pain was born and I will give you a complete account of the system and expound",
  },
  {
    id: 3,
    name: "Roe Smith",
    profession: "Designer",
    feedback:
      "I must explain to you how all this mistaken . Tdea of denouncing pleasure and praising pain was born and I will give you a complete account of the system and expound",
  },
  {
    id: 4,
    name: "Roe Smith",
    profession: "Designer",
    feedback:
      "I must explain to you how all this mistaken . Tdea of denouncing pleasure and praising pain was born and I will give you a complete account of the system and expound",
  },
];

const Feedback = () => {
  return (
    <div className="w-container mx-auto my-10">
      <div className="w-container">
        <h2>Student feedbacks</h2>
        <p>What Students Say About Academy LMS</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {FeedbackData.map((feedback) => (
            <div className="flex justify-center flex-col w-[300px] h-[400px] pl-8 bg-gray-100 rounded-[24px] hover:scale-105 hover:cursor-pointer transition">
              <img src={Quote} className="mr-auto" alt="" />
              <p className="w-[240px] mt-8">{feedback.feedback}</p>
              <h4 className="ml-0 font-bold mt-7">{feedback.name}</h4>
              <p className="text-left mt-2">{feedback.profession}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Feedback;
