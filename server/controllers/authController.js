import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

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

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    }); // this token  will expire in 7days

    //added this token in cookie
    res.cookie("token", token, {
      httpOnly: true, //only http req can acess this cookie
      // if this environment is production it will give true if not equal then it will give false
      secure: process.env.NODE_ENV === "production", //whenever we will run this project in live server then it will run on https -true and ifwe run in local development then it will run on http it means no secure - false
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", //if we work in local environment then we can write a strict so backend and frontend on local host but if we deploy on live server writing strict will show nothing
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days 24hr 60min 60 sec 1000millisec ( 7days expiry time for cookie)
    });

    return res.json({success: true}); //successfully registered

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
      secure: process.env.NODE_ENV === "production", //whenever we will run this project in live server then it will run on https -true and ifwe run in local development then it will run on http it means no secure - false
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", //if we work in local environment then we can write a strict so backend and frontend on local host but if we deploy on live server writing strict will show nothing
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days 24hr 60min 60 sec 1000millisec ( 7days expiry time for cookie)
    });

    return res.json({success: true}); // success true user loggedIn 
    
  } catch (error) {
    //it will return one res whenever any error occurs in the try block
    return res.json({ success: false, message: error.message });
  }
};

const logout = async(req,res)=>{
  try {
    res.clearCookie('token', {
      httpOnly: true, //only http req can acess this cookie
      // if this environment is production it will give true if not equal then it will give false
      secure: process.env.NODE_ENV === "production", //whenever we will run this project in live server then it will run on https -true and ifwe run in local development then it will run on http it means no secure - false
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", //if we work in local environment then we can write a strict so backend and frontend on local host but if we deploy on live server writing strict will show nothing
    })

    return res.json({success: true, message: "logout Out"})

  } catch (error) {
    return res.json({success: false, message: error.message })
  }
}

export { register, login , logout };
