import React from 'react';

const Reviews = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Reviews</h2>

    <div className="flex items-center space-x-4 mb-8">
      <div className="text-5xl font-bold">4.0</div>
      <div className="flex items-center">
        <div className="flex space-x-1 text-yellow-400">
          <span className="text-yellow-400 text-xl">⭐</span>
        </div>
        <p className="text-gray-500">(148,953 ratings)</p>
      </div>
    </div>
    {/* Add the review breakdown */}
    <div className="bg-gray-100 my-8 py-8 px-8 rounded-[20px]">
      {/* Repeatable star-based breakdown */}
      {[5, 4, 3, 2, 1].map((rating, index) => (
        <div key={index} className="flex flex-row items-center ml-4 my-8">
          {[...Array(rating)].map((_, i) => (
            <span key={i} className="text-yellow-400 text-xl">⭐</span>
          ))}
          {[...Array(5 - rating)].map((_, i) => (
            <span key={i} className="text-gray-400 text-xl">⭐</span>
          ))}
          <h3 className="ml-2">{`${rating * 20}%`}</h3>
          <div className="bg-gray-200 w-[800px] h-[15px] ml-4 rounded-md">
            <hr className="bg-yellow-400 w-[500px] h-[15px] border-none rounded-md" />
          </div>
        </div>
      ))}
    </div>

    {/* Example individual review */}
    <div className="space-y-4">
      <div className="border rounded-lg p-4">
        <h4 className="font-bold">Laura Hipster</h4>
        <div className="flex flex-row items-center my-2">
          <h2>Rating:</h2>
          <span className="text-yellow-400 text-xl">⭐</span>
        </div>
        <p className="text-sm text-gray-500 my-2">October 03, 2022</p>
        <p>
          Great course! Learned a lot from it. Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Perferendis impedit nesciunt ut, nisi quia quis culpa fugiat libero...
        </p>
        <button className="text-orange-500 text-sm mt-4">Reply</button>
      </div>
    </div>
  </div>
);

export default Reviews;
