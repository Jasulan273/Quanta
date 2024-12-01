import React from 'react'
import courseBanner from '../../Materials/Images/course_banner.png'
import duration from '../../Materials/Icons/Watchlater.png'
import student from '../../Materials/Icons/Student.png'
import { NavLink } from 'react-router-dom'

const cardData = [
    {
      id: 1,
      image: courseBanner, 
      author: "Determined-Poitras",
      title: "Create an LMS Website with LearnPress",
      duration: "2 Weeks",
      students: "156 Students",
    },
    {
      id: 2,
      image: courseBanner, 
      author: "Creative-Thinker",
      title: "Master Web Development with React",
      duration: "3 Weeks",
      students: "200 Students",
    },
    {
      id: 3,
      image: courseBanner,
      author: "Innovative-Writer",
      title: "Build a Blogging Platform in Django",
      duration: "4 Weeks",
      students: "120 Students",
    }
    ,{
        id: 4,
        image: courseBanner,
        author: "Innovative-Writer",
        title: "Build a Blogging Platform in Django",
        duration: "4 Weeks",
        students: "120 Students",
      },
      {
        id: 5,
        image: courseBanner,
        author: "Innovative-Writer",
        title: "Build a Blogging Platform in Django",
        duration: "4 Weeks",
        students: "120 Students",
      },
      {
        id: 6,
        image: courseBanner,
        author: "Innovative-Writer",
        title: "Build a Blogging Platform in Django",
        duration: "4 Weeks",
        students: "120 Students",
      }
  ];

const Featured = () => {
  return (
      <div className="w-container mx-auto mt-40">
         <div className="flex justify-between mb-16">
          <div>
            <h2 className="text-2xl font-exo font-bold">Featured courses</h2>
            <p className="text-grey">Explore our Popular Courses</p>
          </div>
          <NavLink to="/Courses">
     <button className="w-[161px] h-[48px] bg-white text-black border-2 border-grey rounded-[24px] hover:bg-gray-200 transition"> All Courses </button>
     </NavLink>
        </div>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
      {cardData.map((card) => (
        <div key={card.id} className="max-w-sm h-[474px] bg-white rounded-[24px] shadow-md overflow-hidden hover:scale-105 hover:shadow-xl transition duration-300">
       
          <div className="h-[250px] bg-cover bg-center" style={{ backgroundImage: `url(${card.image})` }}></div>

   
          <div className="p-5 flex flex-col justify-between h-[224px]">
        
            <div className="text-left">
              <h5 className="text-sm font-medium text-gray-600">{card.author}</h5>
              <h4 className="mt-2 text-xl font-bold text-gray-800">{card.title}</h4>
            </div>

     
            <div className="mt-4 text-left">
              <p className="flex flex-row items-center text-[16px] text-gray-600"><img src={duration} className='mr-1 w-[18px]' alt="" />{card.duration} | <img src={student} className='mx-1 w-[18px]' alt="" />{card.students}</p>
            </div>

        
            <h2 className="mt-4 text-sm text-primary font-bold text-right cursor-pointer hover:underline transition">
              View More
            </h2>
          </div>
        </div>
      ))}
    </div>
      </div>
  )
}

export default Featured