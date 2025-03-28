import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";

//created user Registeration controller function
const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ Success: false, message: "missing Details" });
  }

  try {
    // if any user is available with this email id (above email id) then that user will added in this existingUser if its true it will add
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.json({ Success: false, message: "User already exists" });
    }

    // Encrypted the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10); // medium encryption 10

    //user for database
    const user = new userModel({ name, email, password: hashedPassword });
    // new user will be save in userModel
    await user.save(); //store user in db
    // So now user has been created and stored in monogodb

    // generate one token for authentication and send this token using cookies
    // create the token using one id - so whenever a new user will be created in the mongodb database then in mongodb it generates one ID automatically
    // when new user will be created in mongodb in that user collection it will add one _id property

    //GENERATE THE TOKEN
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    }); // this token  will expire in 7days

    //added this token in cookie
    //PASS THIS COOKIE IN THE TOKEN
    res.cookie("token", token, {
      httpOnly: true, //only http req can acess this cookie
      // if this environment is production it will give true if not equal then it will give false
      secure: process.env.NODE_ENV === "production" ? true : false, //whenever we will run this project in live server then it will run on https -true and ifwe run in local development then it will run on http it means no secure - false
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", //if we work in local environment then we can write a strict so backend and frontend on local host but if we deploy on live server writing strict will show nothing
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days 24hr 60min 60 sec 1000millisec ( 7days expiry time for cookie)
    });

    //SENDING WELCOME EMAIL
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email, // this email is going to the user which user gave in req.body
      subject: "Welcome to Auth System", //email subject
      text: `Welcome to Authentication System Website. Your accouunt has been created with email id: ${email}`, //this message will be sent in the email
    };

    await transporter.sendMail(mailOptions); // so this will send email after sending email the below response will get

    //BEFORE GENERATING THIS RESPONSE WE WILL SEND THE EMAIL
    return res.json({ success: true }); //successfully registered
  } catch (error) {
    res.json({ Success: false, message: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body; // take email and password for user login

  //validate email and password
  if (!email || !password) {
    // either email or password is missing it will return this response message
    return res.json({
      success: false,
      message: `Email and Password are required`,
    }); // success false bcz user is not loggedIn
  }

  try {
    const user = await userModel.findOne({ email }); // if the user is available then we will get here (in user variable)
    if (!user) {
      // if this user is not available means if the user by this email is not available then it will return this message in json format
      return res.json({ success: false, message: `Invalid email` });
    }

    //compare both password - password that user has provided and the password which is stored in mongodb databse
    const isMatch = await bcrypt.compare(password, user.password); // (from database , user entered )

    if (!isMatch) {
      // if password is not matched then it will show this message
      return res.json({ success: false, message: `Invalid Password ` });
    }

    // if every thing is proper - email and password is correct so user already exist
    // create one token and using this token user will be authenticated and logged in the website

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    }); // this token  will expire in 7days

    //added this token in cookie
    res.cookie("token", token, {
      httpOnly: true, //only http req can acess this cookie
      // if this environment is production it will give true if not equal then it will give false
      secure: process.env.NODE_ENV === "production" ? true : false, //whenever we will run this project in live server then it will run on https -true and ifwe run in local development then it will run on http it means no secure - false
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", //if we work in local environment then we can write a strict so backend and frontend on local host but if we deploy on live server writing strict will show nothing
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days 24hr 60min 60 sec 1000millisec ( 7days expiry time for cookie)
    });

    return res.json({ success: true }); // success true user loggedIn
  } catch (error) {
    //it will return one res whenever any error occurs in the try block
    return res.json({ success: false, message: error.message });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true, //only http req can acess this cookie
      // if this environment is production it will give true if not equal then it will give false
      secure: process.env.NODE_ENV === "production" ? true : false, //whenever we will run this project in live server then it will run on https -true and ifwe run in local development then it will run on http it means no secure - false
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", //if we work in local environment then we can write a strict so backend and frontend on local host but if we deploy on live server writing strict will show nothing
    });

    return res.json({ success: true, message: "logout Out" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const sendVerifyOtp = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await userModel.findById(userId);

    if (user.isAccountVerified) {
      return res.json({ success: false, message: "Account Already Verified" });
    }

    //a random number will be stored and to get it round figure used floor method and converted into string and stored in otp - GENERATE 6 DIGIT RANDOM NUMBER
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      text: `Your OTP is ${otp}. Verify your account using this OTP.`,
    };

    await transporter.sendMail(mailOption);

    return res.json({
      success: true,
      message: "Verification OTP Sent on Email ",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;

  //if either one of them is missing if statement will execute
  if (!userId || !otp) {
    return res.json({
      success: false,
      message: "Missing Details",
    });
  }

  // if both are id and otp is correct the try catch
  try {
    const user = await userModel.findById(userId); // it will find the user from database
    if (!user) {
      return res.json({
        success: false,
        message: "User Not found",
      });
    }

    // user.verifyotp which is stored in database
    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    // means the date is expired or less then current date
    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP Expired" });
    }

    //if otp is not expired we will verify the user account
    user.isAccountVerified = true;
    //reset the otp
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;

    await user.save();
    return res.json({ success: true, message: "Email Verified Successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// check if user is authenticated
const isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//Send Password Reset OTP

const sendResetOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.json({ success: false, message: "Email is Required" });
  }

  try {
    //find the user by given userid
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not Found" });
    }

    //generate one otp and save it in DB and sent in email

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;
    await user.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your OTP for resetting your password is ${otp}. Use this OTP to proceed with resetting your password.`,
    };
    await transporter.sendMail(mailOption);
    return res.json({ success: true, message: "OTP send to your Email " });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//Reset user Password
const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.json({
      success: false,
      message: "Email , OTP and New Password are required",
    });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: `${user} User not found` });
    }

    // if user haven't entered any otp or the otp is matching with database it will execute
    if (user.resetOtp === "" || user.resetOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }
    // if the otp matches then check for the expiry
    // if the otp is already expired
    if (user.resetOtpExpireAt < Date.now) {
      return res.json({ success: false, message: "OTP Expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;

    await user.save();

    return res.json({success: true , message: "Password has been reset Successfully"})
    
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export {
  register,
  login,
  logout,
  sendVerifyOtp,
  verifyEmail,
  isAuthenticated,
  sendResetOtp,
  resetPassword,
};
