import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  //from req it will find the token which is stored in cookie
  const { token } = req.cookies;

  if (!token) {
    return res.json({ success: false, message: "Not Authorized. Login Again" });
  }

  try {
    //decode the token we get from this above cookie
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    if(tokenDecode.id){
        req.body.userId = tokenDecode.id
    }else{
        return res.json({success: false, message: "Not Authorized, Login Again"})
    }

    next();

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export default userAuth;