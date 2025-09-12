require('dotenv').config();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.authenticate = async (req, res, next) => {
 try{
   const token= req.headers.authorization.split(" ")[1];
   if (!token) { return res.status(401).json({ success: false, message: "No token provided" }); }
   console.log(process.env.JWT_SECRET)
   console.log(token)
   const isVerified= jwt.verify(token,process.env.JWT_SECRET)
   console.log(isVerified)
    if(isVerified)
    {
    req.user=isVerified;
    next()
    }

}
   catch(err){
        return res.json({message:"unauthorized",error:err.message})

   }
};

exports.authorizeAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Forbidden: Admin access required" });
  }
  next();
};
