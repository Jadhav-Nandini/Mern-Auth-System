

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
