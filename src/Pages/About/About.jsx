import React from 'react';


const About = () => {
  return (
    <div className="w-container mx-auto py-10">
      <h1 className="text-4xl font-bold text-center mb-8">About Us</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2">
          <img src={require('../../Materials/Images/banner.png')} alt="About Us" className="w-full h-auto rounded-lg shadow-lg" />
        </div>
        <div className="w-full md:w-1/2">
          <p className="text-lg text-gray-700 mb-6">
            Welcome to Quanta! Our platform is dedicated to providing cutting-edge programming courses and learning resources. With a focus on practical applications and AI-driven tools, we help you excel in your programming journey.
          </p>
          <p className="text-lg text-gray-700 mb-6">
            Our team consists of experienced professionals in the field of software development, AI, and education. We are passionate about delivering high-quality content and making programming accessible to everyone.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
