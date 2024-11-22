const User = require("../models/User")
const jwt = require("jsonwebtoken")
require("dotenv").config()

module.exports = async function(req,res,next){
  if(req.method === "OPTIONS"){
    next()
  }
  try{
    const {token} = req.cookies
    if(!token){
      return res.status(403).json({"message":"Access error", errors:[{
        type:"user",
        msg:"Unauthorized user",
        path:"token",
        location:"user"
      }]})
    }
    const decodedData = jwt.verify(token, process.env.SECRET)
    req.user = decodedData
    const {id} = req.user
    const user = await User.findById(id)
    if(!user){
      return res.status(400).json({message:`Nonexistance error`, errors:[{
        type:"user",
        msg:"User does not exist",
        path:"token",
        location:"user"
      }]})
    }
    next()
  }catch(e){
    console.error(e);
    return res.status(400).json({"message":"Unhandled error", errors:e})
  }
}