import React from 'react'
import BlogImage from '../../Materials/Images/banner.png';
import Date from '../../Materials/Icons/Watchlater.png'
import Calendar from '../../Materials/Icons/Calendartoday.png'
import { NavLink } from 'react-router-dom';

const posts = [
    {
      id: 1,
      title: 'How AI is Changing the World',
      description: 'A brief overview of how AI is influencing various industries.',
      date: 'October 1, 2024',
      author: 'John Doe',
      reads: 150,
      comments: 10,
      likes: 25,
      image: BlogImage
    },
    {
      id: 2,
      title: 'Top 10 Programming Languages',
      description: 'A rundown of the most popular programming languages in 2024.',
      date: 'October 2, 2024',
      author: 'Jane Smith',
      reads: 200,
      comments: 20,
      likes: 30,
      image: BlogImage
    },
    {
      id: 3,
      title: 'The Future of Work with AI',
      description: 'How AI will change the job market.',
      date: 'October 3, 2024',
      author: 'Alice Johnson',
      reads: 175,
      comments: 15,
      likes: 18,
      image: BlogImage
    },
  ];

const LastArticles = () => {
  return (
    <div className="w-container mx-auto mt-40 mb-20">
    <div className="flex justify-between mb-16">
     <div>
       <h2 className="text-2xl font-exo font-bold">Latest Articles</h2>
       <p className="text-grey">Explore our Free Articles</p>
     </div>
     <NavLink to="/Blog">
     <button className="w-[161px] h-[48px] bg-white text-black border-2 border-grey rounded-[24px] hover:bg-gray-200 transition"> All Articles </button>
     </NavLink>
   </div>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
 {posts.map((post) => (
   <div key={post.id} className="max-w-sm h-[474px] bg-white rounded-[24px] shadow-md overflow-hidden hover:scale-105 hover:shadow-xl transition duration-300">

     <div className="h-[250px] bg-cover bg-center" style={{ backgroundImage: `url(${post.image})` }}></div>
     <div className="p-5 flex flex-col h-[224px]">
   
       <div className="text-left">
         <h5 className="text-sm font-medium text-gray-600">{post.author}</h5>
         <h4 className="mt-2 text-xl font-bold text-gray-800 hover:cursor-pointer hover:text-primary transition">{post.title}</h4>
       </div>


       <div className="text-left mt-2">
         <p className="flex flex-row items-center text-[16px] text-gray-600"><img src={Calendar} className='mr-1 w-[18px]' alt="" />{post.date} | <img src={Date} className='mx-1 w-[18px]' alt="" />{post.reads} Views</p>
       </div>

       <div className='text-left mt-6 text-grey'>
        <p>{post.description}...</p>
       </div>


     </div>
   </div>
 ))}
</div>
 </div>
  )
}

export default LastArticles