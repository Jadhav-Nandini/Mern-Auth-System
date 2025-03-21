// import React from 'react'
// import { assets } from '../assets/assets.js'

// const Header = () => {
//   return (
//     <div>
//         <img src = { assets.encrypted } alt="" className='w-20 h-56' />
//         <h1>Hey Developer <img src={assets.hand_wave} alt=""  className='w-20 h-[10vh] '/></h1>
//         <h2>Welcome to our app</h2>
//         <p>lets start with a quick product tour and we will have you up and running in no time</p>
//         <button>Get Started</button>

//     </div>
//   )
// }

// export default Header

// import React from 'react';
// import { assets } from '../assets/assets.js';

// const Header = () => {
//   return (
//     <div className="flex flex-col items-center text-center p-6  rounded-lg shadow-md">
//       <img src={assets.encrypted} alt="Secure Access" className="w-24 h-24 mb-4" />

//       <h1 className="text-3xl font-bold flex items-center font-black">
//         Secure Your Access
//         <img src={assets.hand_wave} alt="Wave" className="w-20 h-[10vh] " />
//       </h1>

//       <h2 className="text-xl text-gray-700 mt-2">Welcome to AuthSecure</h2>

//       <p className="text-gray-500 mt-2 max-w-md">
//         Effortless authentication, top-notch security, and seamless user experience.
//         Let's set up your account in just a few clicks!
//       </p>

//       <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-all ">
//         Get Started
//       </button>
//     </div>
//   );
// };

// export default Header;

import React from "react";
import { assets } from "../assets/assets.js";

const Header = () => {
  return (
    <div className="w-full flex flex-col items-center  justify-center min-h-screen text-center px-6 py-20 sm:py-28  text-gray-300 rounded-lg ">
      <img
        src={assets.encrypted}
        alt="Secure Access"
        className="w-30 h-30 mb-2 mt-2"
      />

      <h1 className="text-5xl sm:text-7xl font-bold  text-blue-400 flex items-center gap-2 ">
        Secure Your Access
      </h1>

      <h2 className="text-2xl sm:text-3xl mt-2.5 font-medium text-gray-50">
        Welcome to AuthSecure
      </h2>

      <p className="mt-3 max-w-md text-lg font-extralight ">
        Simplified authentication with top-notch security. Get started in just a
        few clicks!
      </p>

      <button
        className="mt-6 px-6 py-3 text-lg font-semibold rounded-lg shadow-md
            hover:bg-transparent bg-white text-blue-700 hover:text-white transition duration-300 transform hover:scale-110 hover:shadow-lg border border-indigo-500"
      >
        Get Started
      </button>
    </div>
  );
};

export default Header;
