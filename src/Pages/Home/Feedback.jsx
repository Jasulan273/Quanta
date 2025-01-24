import React, { useState, useEffect } from "react";
import Quote from '../../Materials/Images/“.png';

const FeedbackData = [
  {
    id: 1,
    name: "Roe Smith",
    profession: "Designer",
    feedback:
      "I must explain to you how all this mistaken . Tdea of denouncing pleasure and praising pain was born and I will give you a complete account of the system and expound",
    status: "good"
  },
  {
    id: 2,
    name: "Alice Johnson",
    profession: "Developer",
    feedback:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    status: "bad"
  },
  {
    id: 3,
    name: "John Doe",
    profession: "Project Manager",
    feedback:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
    status: "good"
  },
  {
    id: 4,
    name: "Jane Davis",
    profession: "Marketing Specialist",
    feedback:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    status: "bad"
  }
];

const Feedback = () => {
  const [hoverStatus, setHoverStatus] = useState({});
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    const element = document.getElementById("feedback-section");
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom >= 0) {
      setIsVisible(true);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleMouseEnter = (id) => {
    setHoverStatus((prevStatus) => ({
      ...prevStatus,
      [id]: true,
    }));
  };

  const handleMouseLeave = (id) => {
    setHoverStatus((prevStatus) => ({
      ...prevStatus,
      [id]: false,
    }));
  };

  return (
    <div className="w-container mx-auto my-10">
      <div
        id="feedback-section"
        className={`transition-opacity duration-1000 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <h2>Student feedbacks</h2>
        <p>What Students Say About Academy LMS</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {FeedbackData.map((feedback) => (
            <div
              key={feedback.id}
              className="relative w-[300px] h-[400px] rounded-[26px] overflow-hidden hover:cursor-pointer"
              onMouseEnter={() => handleMouseEnter(feedback.id)}
              onMouseLeave={() => handleMouseLeave(feedback.id)}
            >
              <div
                className={`absolute top-0 left-0 w-[300px] h-[50px] flex justify-center items-center text-xl text-white transition-all duration-300 ease-in-out ${
                  hoverStatus[feedback.id]
                    ? "translate-y-0"
                    : "-translate-y-[50px]"
                } ${feedback.status === "good" ? "bg-green-500" : "bg-red-500"}`}
              >
                <h3>
                  {feedback.status === "good"
                    ? "Great Experience!"
                    : "Needs Improvement"}
                </h3>
              </div>

              <div
                className={`flex justify-center flex-col w-[300px] h-[400px] pl-8 bg-gray-100 transition-all duration-300 ease-in-out ${
                  hoverStatus[feedback.id]
                    ? "translate-y-[50px] rounded-t-none"
                    : "rounded-t-[26px]"
                }`}
              >
                <img src={Quote} className="mr-auto" alt="Quote" />
                <p className="w-[240px] h-[200px] mt-8">{feedback.feedback}</p>
                <h4 className="ml-0 font-bold mt-7">{feedback.name}</h4>
                <p className="text-left mt-2">{feedback.profession}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Feedback;
