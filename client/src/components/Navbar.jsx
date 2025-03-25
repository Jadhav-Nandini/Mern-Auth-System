import React, { useContext } from "react";
import { useState } from "react";
import { assets } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/appContext.jsx";
import { toast } from "react-toastify";
import axios from "axios"

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { userData, backendUrl, setUserData, setIsLoggedin } =
    useContext(AppContext);

    const sendVerificationOtp = async() => {
      try {
        axios.defaults.withCredentials = true
        const {data} = await axios.post(backendUrl + "/api/auth/send-verify-otp")

        if(data.success){
          navigate("/EmailVerify")
          toast.success(data.message)
        }else{
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.message)
      }
    }
    
    
    
  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/api/auth/logout");
      data.success && setIsLoggedin(false);
      data.success && setUserData(false);
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-20 absolute top-0 ">
      <img
        src={assets.logo}
        alt="logo"
        className=" w-14 sm:w-20 md:w-22 lg:w-24"
      />

      {userData ? (
        <>
          <div
            onClick={() => setIsOpen(true)} //  Added onClick to open sidebar
            className="w-10 h-10 bg-white text-blue-600 font-bold rounded-xl flex items-center justify-center ring-1 ring-blue-800 hover:scale-105 duration-300 hover:bg-blue-500 hover:text-white cursor-pointer"
          >
            {userData.name
              .split(" ")
              .map((word) => word[0].toUpperCase())
              .join("")}
          </div>

          {/*  Sidebar Menu  */}
          <div
            className={`fixed top-0 right-0 h-full w-2/3 sm:w-1/3 bg-transparent backdrop-blur-lg text-white p-6 ${
              isOpen ? "translate-x-0" : "translate-x-full"
            } transform transition-transform duration-500 ease-in-out z-50 border-l border-white/10`}
          >
            {/*  Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-xl font-bold cursor-pointer hover:scale-110 duration-300"
            >
              ✖
            </button>

            {/* Side bar email button */}

            {!userData.isAccountVerified && (
              <div className="mt-15 flex flex-col">

                <button
                  onClick={sendVerificationOtp}
                  className="px-4 py-2 bg-white text-blue-950 hover:text-white hover:bg-blue-950 border border-white/20 rounded-md text-lg cursor-pointer transform transition duration-300 hover:scale-100"
                >
                  Verify Email
                </button>
              </div>
            )}

            {/* side bar  Logout Button */}

            <div className="mt-7 flex flex-col">
              <button
                onClick={logout}
          
                className="px-4 py-2 bg-white text-blue-950 hover:text-white hover:bg-blue-950 border border-white/20 rounded-md text-lg cursor-pointer transform transition duration-300 hover:scale-100"
              >
                Logout
              </button>
            </div>
          </div>
        </>
      ) : (
        <> </>
      )}
    </div>
  );
};

export default Navbar;
