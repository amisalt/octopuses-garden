const User = require("../models/User")
const jwt = require("jsonwebtoken")
require("dotenv").config()

module.exports = async function(req,res,next){
  if(req.method === "OPTIONS"){
    next()
  }
  try{
    const {token} = req.cookies
    const decodedData = jwt.verify(token, process.env.SECRET)
    const {id} = decodedData
    const user = await User.findById(id)
    if(!user){
      return res.status(400).json({message:`Nonexistance error`, errors:[{
        type:"user",
        msg:"User does not exist",
        path:"token",
        location:"user"
      }]})
    }
    req.user = {
      id: user._id,
      username: user.username,
      roles:user.roles,
      gameInfo:user.gameInfo
    }
    next()
  }catch(e){
    console.error(e);
    return res.status(400).json({"message":"Unhandled error", errors:e})
  }
}