import React from 'react';
import { assets } from "../assets/assets.js"

const NavBar = () => {
  return (
    <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-20 absolute top-0'>
    <img src= {assets.logo} alt="" className=' w-16 sm:w-24 md:w-28 lg:w-32 xl:w-36 2xl:w-40' />
    <button className='hidden sm:block  w-[10vw] px-4 py-2 bg-gradient-to-b from-indigo-600 via-indigo-500 to-indigo-400  text-lg text-gray-700 shadow-lg rounded-lg border border-gray-500 hover:from-indigo-700 hover:via-indigo-600 hover:to-indigo-500 transition-all duration-500'>Login </button>
    <img src= {assets.menu} alt="" className='block sm:hidden w-6 h-6 cursor-pointer '/>
    </div>
  )
}

export default NavBar