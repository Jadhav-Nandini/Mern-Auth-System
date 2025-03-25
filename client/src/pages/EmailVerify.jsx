import React, { useContext, useEffect, useRef } from "react";
import { assets } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/appContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";


const EmailVerify = () => {
  const navigate = useNavigate("");

  axios.defaults.withCredentials = true
  const {backendUrl, isloggedin, userData, getUserData} = useContext(AppContext)
  
  const inputRefs = useRef(Array(6).fill(null));


  const handleInput = (e, index) => {
    const { value } = e.target;
  
    // Move forward if a number is entered
    if (value.length === 1 && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  
    // Move backward if Backspace is pressed
    if (value.length === 0 && e.nativeEvent.inputType === "deleteContentBackward" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text")
    const PasteArray = paste.split("");
    PasteArray.forEach((char, index)=> {
      if(inputRefs.current[index]){
        inputRefs.current[index].value = char;

      }
    })
  }


  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const otpArray = inputRefs.current.map(e => e.value)
      const otp = otpArray.join("")
      const {data} = await axios.post(backendUrl + "/api/auth/verify-account", {otp})
      if(data.success){
        toast.success(data.message)
        getUserData()
        navigate("/")
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    isloggedin && userData && userData.isAccountVerified && navigate("/")
  }, [isloggedin, userData])
  
  
  return (
    <div className="flex items-center justify-center min-h-screen relative ">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-800 to-blue-700 opacity-30 blur-3xl"></div>
    <img
      src={assets.logo}
      alt="logo"
      onClick={() => {
        navigate("/");
      }}
      className=" absolute left-5 sm:left-20  top-5 w-14 sm:w-20 md:w-22 lg:w-24 cursor-pointer "
    />

    <form  onSubmit={onSubmitHandler}
    className="max-w-full py-6 px-6  sm:py-9 sm:px-14 rounded-3xl shadow-2xl border border-white/20 bg-white/5 backdrop-blur-lg ring-1 ring-white/30">

    <h1 className="text-2xl sm:text-4xl  text-center font-bold bg-gradient-to-r from-blue-300 to-indigo-400 text-transparent bg-clip-text ">
      Verify Your Email
    </h1>
    <p className="font-light text-gray-400 sm:px-2 mt-2 text-center " > 
    Enter the 6-digit code sent to your email to verify your account.
    </p>
    <div onPaste={handlePaste} className="mt-5 flex justify-center gap-2 ">
      {/* underscore is given just as a variable */}
      {Array(6).fill(0).map((_, index)=>(
        <input type="text"
        maxLength="1"
        key={index}
        required
        ref={(el) => (inputRefs.current[index] = el)}
        onChange={(e) => handleInput(e, index)}


        className=" w-full h-10 sm:w-10 sm:h-10 bg-transparent text-xl font-semibold border border-gray-400 rounded-xl text-center text-white focus:ring-1 focus:ring-blue-200 focus:outline-none "
        />
    ))}
    </div>
    <button 
   
    className="  mt-5 w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300">VERIFY</button>
    </form>
    </div>
  );      
};

export default EmailVerify;



