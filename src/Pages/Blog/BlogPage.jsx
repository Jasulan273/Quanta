import React from 'react';
import ScrollProgress from '../../Components/ScrollProgress';
import BlogImage from '../../Materials/Images/BlogImage.png'

const BlogPage = () => {
  return (
    <div>
    <ScrollProgress />
    <div className="container mx-auto my-16 px-4">
      <div className="mb-8">
        <h1 className="text-5xl font-bold mb-4">Best LearnPress WordPress Theme Collection for 2023</h1>
        <div className="text-gray-600 text-lg">
          <p><strong>Author:</strong> Determined-poitras</p>
          <p><strong>Date:</strong> Jan 24, 22023</p>
          <p><strong>Comments:</strong> 20 Comments</p>
        </div>
      </div>

      <div className="relative mb-12">
        <img src={BlogImage} alt="Visual representation of the programming lesson" className="w-full h-[600px] object-cover rounded-lg shadow-lg" />
      </div>
      
      <div>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras facilisis faucibus odio arcu duis dui, adipiscing facilisis. Urna, donec turpis egestas volutpat. Quisque nec non amet quis. Varius tellus justo odio parturient mauris curabitur lorem in. Pulvinar sit ultrices mi ut eleifend luctus ut. Id sed faucibus bibendum augue id cras purus. At eget euismod cursus non. Molestie dignissim sed volutpat feugiat vel enim eu turpis imperdiet. 

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras facilisis faucibus odio arcu duis dui, adipiscing facilisis. Urna, donec turpis egestas volutpat. Quisque nec non amet quis. Varius tellus justo odio parturient mauris curabitur lorem in. Pulvinar sit ultrices mi ut eleifend luctus ut. Id sed faucibus bibendum augue id cras purus.</p>
      </div>
    
     
      
      </div>

   
   
  </div>
  )
}

export default BlogPage