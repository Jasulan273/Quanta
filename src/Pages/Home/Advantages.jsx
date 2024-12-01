import React from "react";
import AdvantagesImage from "../../Materials/Images/Advantages.png";
import Check from '../../Materials/Icons/Check.png'

const Advantages = () => {
  return (
    <div className="w-container mx-auto my-40">
      <div className="flex justify-between items-center">
        <img src={AdvantagesImage} alt="Advantages" />
        <div className="w-[520px]">
          <h2 className="font-bold leading-9">Grow Us Your Skill <br /> With Quanta</h2>
          <p className="mt-6">
            We denounce with righteous indignation and dislike men who are so
            beguiled and demoralized that cannot trouble.
          </p>
         <div className="mt-8">
          <p className="flex flex-row mt-2"><img src={Check} alt="" />Best LMS 2024</p>
          <p className="flex flex-row mt-2"><img src={Check} alt="" />Most powerfull platform</p>
          <p className="flex flex-row mt-2"><img src={Check} alt="" />All courses is free</p>
          <p className="flex flex-row mt-2"><img src={Check} alt="" />For all levels</p>
         </div>
          <button className="bg-primary text-white font-semibold mt-8 py-4 px-8 rounded-[24px] transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-lightgrey focus:ring-opacity-50">
            Explore Course
          </button>
        </div>
      </div>
    </div>
  );
};

export default Advantages;
