const jwt = require("jsonwebtoken")
const User = require("../models/User")
const GameInfo = require("../models/GameInfo")
require("dotenv").config()

module.exports = async function(req, res, next){
  if(req.method === "OPTIONS"){
    next()
  }
  try{
    const gameInfo = await GameInfo.findById(req.user.gameInfo)
    if(!gameInfo){
      return res.status(403).json({message:`Nonexistance error`, errors:[{
        type:"server",
        msg:"User doesn't have any gameInstance",
        path:"gameInfo",
        location:"server"
      }]})
    }
    next()
  }catch(e){
    console.log(e);
    return res.status(400).json({"message":"Unhandled error", errors:e, gameInfo:req.user.gameInfo})
  }
}