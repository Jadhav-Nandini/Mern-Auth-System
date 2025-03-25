import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/appContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate("");

  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContext);

  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();

      //it will send the cookies with the request 
      axios.defaults.withCredentials = true;

      if (state === "Sign Up") {
        const { data } = await axios.post(backendUrl + "/api/auth/register", {
          name,
          email,
          password,
        });

        if (data.success) {
          setIsLoggedin(true);
          getUserData()
          navigate("/");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/auth/login", {
          email,
          password,
        });

        if (data.success) {
          setIsLoggedin(true);
          getUserData()
          navigate("/");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

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

      <div className="max-w-lg py-6 px-9  sm:py-9 sm:px-14 rounded-3xl shadow-2xl border border-white/20 bg-white/5 backdrop-blur-lg ring-1 ring-white/30 ">
        <h2 className="text-3xl sm:text-4xl   text-center font-extrabold bg-gradient-to-r from-blue-300 to-indigo-400 text-transparent bg-clip-text ">
          {state === "Sign Up" ? "Create an Account" : "Welcome Back !"}
        </h2>

        <p className="text-xl font-semibold mt-1 text-center bg-gradient-to-r from-blue-50 to-blue-300 text-transparent bg-clip-text ">
          {state === "Sign Up"
            ? "Sign up to get started"
            : "Sign in to continue"}
        </p>

        <form onSubmit={onSubmitHandler} className=" mt-4">
          {state === "Sign Up" && (
            <div className="relative">
              <input
                type="text"
                placeholder="Full Name"
                required
                onChange={(e) => {
                  setName(e.target.value);
                }}
                value={name}
                className="w-full px-4 py-3 bg-transparent border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <span className="absolute right-3 top-4 text-gray-200/60">
                <FiUser size={20} />
              </span>
            </div>
          )}


          <div className="relative">
            <input
              type="email"
              placeholder="Your Email"
              required
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
              className="  w-full px-4 py-3 mt-4 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <span className="absolute right-3 top-8 text-gray-200/60">
              <FiMail size={20} />
            </span>
          </div>
          <div className="relative ">
            <input
              type="password"
              placeholder="Password"
              required
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              value={password}
              className="  w-full px-4 py-3 mt-4 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500/40 outline-none text-white placeholder:text-gray-400"
            />
            <span className="absolute right-3 bottom-4 text-gray-200/60">
              <FiLock size={20} />
            </span>
          </div>
          {state !== "Sign Up" && (
            <p
              onClick={() => {
                navigate("/ResetPassword");
              }}
              className="mt-1 text-gray-50 cursor-pointer font-extralight text-sm"
            >
              Forget Password
            </p>
          )}
          <button
          
            type="submit"
            className="py-3 px-4 w-full mt-4  rounded-lg text-lg bg-white/80 text-blue-600  bg-gradient-to-r  
            hover:from-blue-700 hover:via-blue-800 hover:to-indigo-900 hover:text-white transform font-semibold hover:scale-105 transition duration-400 ring-1 ring-blue-100/40  hover:ring-blue-500/30 cursor-pointer"
          >
            {state}
          </button>
        </form>

        <div className="flex gap-2 mt-2 ">
          <p className="text-gray-400">
            {state === "Sign Up"
              ? "Already have an account"
              : "Don't have an account"}
          </p>
          <span
            className="text-blue-400 cursor-pointer hover:text-indigo-500 underline"
            onClick={() => {
              setState(state === "Sign Up" ? "Login" : "Sign Up");
            }}
          >
            {state === "Sign Up" ? "Login" : "Sign Up "}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
