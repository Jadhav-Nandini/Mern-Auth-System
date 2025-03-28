import react, { useContext, useRef, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { AppContext } from "../context/appContext";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {


const {backendUrl} = useContext(AppContext);
axios.defaults.withCredentials =true;


  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
const [isEmailSent, setIsEmailSent] = useState("")
const [otp,setOtp] =useState(0)
const [isOtpSubmitted, setIsOtpSubmitted] = useState(false)


  const inputRefs = useRef([]);

  
  const handleInput = (e, index) => {
     if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1].focus();
      }
   };
   
   const handleKeyDown = (e, index) => {
      if (e.key === "Backspace" && e.target.value === "" && index > 0) {
         inputRefs.current[index - 1].focus();
      }
   };
   
   const handlePaste = (e) => {
      const paste = e.clipboardData.getData("text");
      const PasteArray = paste.split("");
      PasteArray.forEach((char, index) => {
         if (inputRefs.current[index]) {
            inputRefs.current[index].value = char;
         }
      });
   };
   
   const handleEmailSubmit = async (e) => {
     e.preventDefault();
     try{
      const {data} = await axios.post(backendUrl + "/api/auth/send-reset-otp",{email})
      data.success ? toast.success(data.success) : toast.error(data.message)
      data.success && setIsEmailSent(true)
     }catch(error){
      toast.error(error.message)
     }
   
   };

   const handleOTPSubmit = async(e) => {
      e.preventDefault();
      
        const otpArray = inputRefs.current.map(e => e.value) 
        setOtp(otpArray.join(""))
         setIsOtpSubmitted(true)
      
   };

   const onSubmitNewPassword = async (e) => {
      e.preventDefault();
      try {
         const {data} = await axios.post(backendUrl + "/api/auth/resetpassword", {email, otp,newPassword})
         data.success ? toast.success : toast.error(data.message)
         data.success && navigate('/login')
      } catch (error) {
         toast.error(error.message)
      }
   }
   
   
   
  return (
    <>
      <div className="flex flex-col sm:flex-row items-center justify-center min-h-screen gap-8 ">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-800 to-blue-700 opacity-30 blur-3xl"></div>
        <img
          src={assets.logo}
          alt="logo"
          onClick={() => {
            navigate("/");
          }}
          className=" absolute left-5 sm:left-20  top-5 w-14 sm:w-20 md:w-22 lg:w-24 cursor-pointer "
        />
{/* Email form */}
        {!isEmailSent && (
          <form
            onSubmit={handleEmailSubmit}
            className=" py-6 px-6  sm:py-9 sm:px-14 rounded-3xl shadow-2xl border border-white/20 bg-white/5 backdrop-blur-lg ring-1 ring-white/30"
          >
            <h1 className="text-2xl sm:text-4xl  text-center font-bold bg-gradient-to-r from-blue-300 to-indigo-400 text-transparent bg-clip-text ">
              Reset Password
            </h1>
            <p className="font-light text-gray-400 sm:px-2 mt-2 text-center ">
              Enter your registered Email
            </p>
            <div className="relative mt-4">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 pr-4 py-2 w-full rounded-md   bg-white/10 backdrop-blur-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 "
              />
            </div>

            <button className="mt-4 w-full py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-md cursor-pointer hover:scale-105 ">
              Submit
            </button>
          </form>
        )}
{/* otp form */}
        {!isOtpSubmitted && isEmailSent && (
          <form
            onSubmit={handleOTPSubmit}
            className="max-w-full py-6 px-6  sm:py-9 sm:px-14 rounded-3xl shadow-2xl border border-white/20 bg-white/5 backdrop-blur-lg ring-1 ring-white/30"
          >
            <h1 className="text-2xl sm:text-4xl  text-center font-bold bg-gradient-to-r from-blue-300 to-indigo-400 text-transparent bg-clip-text ">
              Enter OTP
            </h1>
            <p className="font-light text-gray-400 sm:px-2 mt-2 text-center ">
              Enter the 6-digit code sent to your email to verify your account.
            </p>

            <div
              onPaste={handlePaste}
              className="mt-5 flex justify-center gap-2 "
            >
              {/* underscore is given just as a variable */}
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <input
                    type="text"
                    maxLength="1"
                    key={index}
                    required
                    ref={(el) => (inputRefs.current[index] = el)}
                    onInput={(e) => handleInput(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className=" w-full h-10 sm:w-10 sm:h-10 bg-transparent text-xl font-semibold border border-gray-400 rounded-xl text-center text-white focus:ring-1 focus:ring-blue-200 focus:outline-none "
                  />
                ))}
            </div>
            <button className="  mt-5 w-full py-3 sm:text-2xl bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300">
              Submit
            </button>
          </form>
        )}

        {/* password form */}
        {isOtpSubmitted && isEmailSent && (
          <form
            onSubmit={onSubmitNewPassword}
            className=" py-6 px-6  sm:py-9 sm:px-14 rounded-3xl shadow-2xl border border-white/20 bg-white/5 backdrop-blur-lg ring-1 ring-white/30"
          >
            <h1 className="text-2xl sm:text-4xl  text-center font-bold bg-gradient-to-r from-blue-300 to-indigo-400 text-transparent bg-clip-text ">
              New Password
            </h1>
            <p className="font-light text-gray-300 sm:px-2 mt-2 text-center ">
              Enter a new Password
            </p>
            <div className="relative mt-4">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-md" />
              <input
                type="password"
                placeholder="Enter Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="pl-10 pr-4 py-2 w-full rounded-md   bg-white/10 backdrop-blur-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 "
              />
            </div>

            <button className="mt-4 w-full py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-md cursor-pointer hover:scale-105 ">
              Submit
            </button>
          </form>
        )}
      </div>
    </>
  );
};
export default ResetPassword;

// import { useState, useRef } from "react";
// import { assets } from "../assets/assets";
// import { useNavigate } from "react-router-dom";
// import { FaEnvelope } from "react-icons/fa";

// const ResetPassword = () => {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [showOTP, setShowOTP] = useState(false); // OTP Form Visibility

//   const inputRefs = useRef([]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (email.trim() !== "") {
//       setShowOTP(true); //  Show OTP form on submit
//     }
//   };

//   const handleInput = (e, index) => {
//     if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
//       inputRefs.current[index + 1].focus();
//     }
//   };

//   const handleKeyDown = (e, index) => {
//     if (e.key === "Backspace" && e.target.value === "" && index > 0) {
//       inputRefs.current[index - 1].focus();
//     }
//   };

//   const handlePaste = (e) => {
//     const paste = e.clipboardData.getData("text");
//     const PasteArray = paste.split("");
//     PasteArray.forEach((char, index) => {
//       if (inputRefs.current[index]) {
//         inputRefs.current[index].value = char;
//       }
//     });
//   };

//   return (
//     <>
//       <div className="flex flex-col items-center justify-center h-screen gap-8">
//         <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-800 to-blue-700 opacity-40 blur-md"></div>

//         <img
//           src={assets.logo}
//           alt="logo"
//           onClick={() => navigate("/")}
//           className="absolute left-5 sm:left-20 top-5 w-14 sm:w-20 md:w-22 lg:w-24 cursor-pointer"
//         />

//         {/*  Reset Password Form */}
//         {!showOTP && (
//           <form onSubmit={handleSubmit} className="py-6 px-6 sm:py-9 sm:px-14 rounded-3xl shadow-2xl border border-white/20 bg-white/10 backdrop-blur-lg ring-1 ring-white/30">
//             <h1 className="text-2xl sm:text-4xl text-center font-bold bg-gradient-to-r from-blue-300 to-indigo-400 text-transparent bg-clip-text">
//               Reset Password
//             </h1>
//             <p className="font-light text-gray-300 sm:px-2 mt-2 text-center">
//               Enter your registered Email
//             </p>
//             <div className="relative mt-4">
//               <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
//               <input
//                 type="email"
//                 placeholder="Enter your email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 className="pl-10 pr-4 py-2 w-full rounded-md bg-white/10 backdrop-blur-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>
//             <button type="submit" className="mt-4 w-full py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-md cursor-pointer hover:scale-105">
//               Submit
//             </button>
//           </form>
//         )}

//         {/* OTP Form - Visible only after email submission */}
//         {showOTP && (
//           <form className="py-6 px-6 sm:py-9 sm:px-14 rounded-3xl shadow-2xl border border-white/20 bg-white/10 backdrop-blur-lg ring-1 ring-white/30">
//             <h1 className="text-2xl sm:text-4xl text-center font-bold bg-gradient-to-r from-blue-300 to-indigo-400 text-transparent bg-clip-text">
//               Enter OTP
//             </h1>
//             <p className="font-light text-gray-400 sm:px-2 mt-2 text-center">
//               Enter the 6-digit code sent to your email to verify your account.
//             </p>

//             <div onPaste={handlePaste} className="mt-5 flex justify-center gap-2">
//               {Array(6)
//                 .fill(0)
//                 .map((_, index) => (
//                   <input
//                     type="text"
//                     maxLength="1"
//                     key={index}
//                     required
//                     ref={(el) => (inputRefs.current[index] = el)}
//                     onInput={(e) => handleInput(e, index)}
//                     onKeyDown={(e) => handleKeyDown(e, index)}
//                     className="w-10 h-10 sm:w-10 sm:h-10 bg-transparent text-xl font-semibold border border-gray-400 rounded-xl text-center text-white focus:ring-1 focus:ring-blue-200 focus:outline-none"
//                   />
//                 ))}
//             </div>

//             <button className="mt-5 w-full py-3 bg-blue-600 text-white font-semibold sm:text-2xl rounded-lg hover:bg-blue-700 transition duration-300">
//               Submit
//             </button>
//           </form>
//         )}
//       </div>
//     </>
//   );
// };

// export default ResetPassword;
