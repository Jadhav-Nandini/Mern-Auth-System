import React from "react";
import { useState } from "react";
import { assets } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-20 absolute top-0 ">
      <img
        src={assets.logo}
        alt="logo"
        className=" w-14 sm:w-20 md:w-22 lg:w-24"
      />

      {/* this login button will be visible on big screen */}
      
      <button
        onClick={() => navigate("/login")}
        className="hidden sm:block w-[10vw] px-5 py-2 text-lg font-semibold text-white rounded-lg shadow-md
             bg-transparent hover:bg-white hover:text-blue-950 transition-all duration-500 transform hover:scale-105 hover:shadow-lg border border-blue-300"
      >
        Login
      </button>

      {/* this icon will be visible on small screen */}

      <img
        src={assets.menu}
        alt="menu"
        className="block sm:hidden w-7 h-6 cursor-pointer hover:scale-105  transform duration-500 filter invert"
        onClick={() => setIsOpen(true)}
      />

      <div
        className={`fixed top-0 right-0 h-full w-2/3  sm:hidden bg-transparent  backdrop-blur-lg text-white p-6  ${ isOpen ? "translate-x-0" : "translate-x-full" } transform transition-transform duration-500 ease-in-out z-50 border-l border-white/10`}
      >
        <button
          onClick={() => {
            setIsOpen(false);
          }}
          className="absolute top-4 right-4 text-xl font-bold cursor-pointer hover:scale-110 duration-300"
        >
          ✖
        </button>

        <div className="mt-10 flex flex-col gap-4">
          <button
            onClick={() => {
              navigate("/login");
              setIsOpen(false);
            }}
            className="px-4 py-2 bg-white text-blue-950 hover:text-white  hover:bg-blue-950 border-1 border-white/20 rounded-md  text-lg cursor-pointer"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
