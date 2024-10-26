const jwt = require("jsonwebtoken")
require("dotenv").config()

module.exports = function(req,res,next){
  if(req.method === "OPTIONS"){
    next()
  }
  try{
    const {token} = req.cookies
    if(!token){
      return res.status(403).json({"message":"Unauthorized user"})
    }
    const decodedData = jwt.verify(token, process.env.SECRET)
    req.user = decodedData
    next()
  }catch(e){
    console.error(e);
    return res.status(400).json({"message":"Unhandled error"})
  }
}