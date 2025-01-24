import React from 'react';
import phone from '../../Materials/Icons/Phone.png'
import email from '../../Materials/Icons/Email.png'


const About = () => {
  return (
    <div className="w-container min-h-[100vh] mx-auto py-10">
      <h1 className="text-4xl font-bold text-center mb-8">About Us</h1>
      <div className="flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-1/2">
      <h2 className='font-bold'>About platform</h2>
          <p className="text-lg text-gray-700 mb-6">
            Welcome to Quanta! Our platform is dedicated to providing cutting-edge programming courses and learning resources. With a focus on practical applications and AI-driven tools, we help you excel in your programming journey.
          </p>
        <h2 className='font-bold'>Need a direct line?</h2>
        <div className='flex flex-col mt-4'>
          <div className='flex flex-row items-center'><div className='flex items-center justify-center w-[56px] h-[56px] mr-4 bg-gray-100'><img src={phone} className='w-[32px] h-[32px]' alt="phone" /></div><div><p>Phone</p><p>+7(747) 777 7777</p></div></div>
          <div className='flex flex-row mt-4'><div className='flex items-center justify-center w-[56px] h-[56px] mr-4 bg-gray-100'><img src={email} className='w-[32px] h-[32px]' alt="phone" /></div><div><p>Email</p><p>support@quanta.com</p></div></div>
        </div>
        </div>
        <div className="w-[850px] rounded-[24px]">
        <iframe className='rounded-[24px]' title='Map' src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2505.9634228526643!2d71.41559597548381!3d51.09068254106179!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x424585a605525605%3A0x4dff4a1973f7567e!2sAstana%20IT%20University!5e0!3m2!1sru!2skz!4v1733228936752!5m2!1sru!2skz" width="850" height="450" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </div>
      <div className='w-inherit h-[410px] mt-12'>
        <form action="POST">
          <h2 className='font-bold'>Contact Us</h2>
          <p className='text-grey'>Your email address will not be published. Required fields are marked *</p>
          <div className="grid grid-cols-2 gap-4">
          <input className='h-[48px] border-2 border-grey rounded-lg pl-2' placeholder='Name*' type="text" />
          <input className='h-[48px] border-2 border-grey rounded-lg pl-2' placeholder='Email*' type="text" />
          <input className='col-span-2 border-2 border-grey h-[110px] rounded-lg pl-2 pb-[70px]' type="text" placeholder='Comment' />
          </div>
          <div className='flex flex-row mt-4'><input type="checkbox" className='mr-2 accent-primary w-4' /><p className='text-grey'>I read and accept the terms and conditions</p></div>
       
          <input className='bg-primary text-white font-semibold mt-8 py-4 px-12 rounded-[24px] transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-lightgrey focus:ring-opacity-50' type="submit" value="Submit" />
        </form>
      </div>
    </div>
  );
}

export default About;
