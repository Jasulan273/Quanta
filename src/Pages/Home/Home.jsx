import React from "react";
import styles from "./Home.module.css";

export default function Home() {
  return (
    <div className={`flex items-center justify-between w-full min-h-[500px]`}>
      <div className={`w-full h-[700px] ${styles.banner}`}>
        <div className="w-container mx-auto mt-[220px] h-full">
          <h1 className="font-bold text-[48px]">Build Skills With <br/> Online Course</h1>
          <p className="text-[18px]">
            We denounce with righteous indignation and dislike men who are <br /> so
            beguiled and demoralized that cannot trouble.
          </p>
          <button className="bg-primary text-white font-semibold mt-8 py-4 px-8 rounded-[24px] transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-lightgrey focus:ring-opacity-50">
            Posts comment
          </button>
        </div>
      </div>
    </div>
  );
}
