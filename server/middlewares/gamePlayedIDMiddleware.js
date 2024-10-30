const jwt = require("jsonwebtoken")
require("dotenv").config()

module.exports = function(req, res, next){
  if(req.method === "OPTIONS"){
    next()
  }
  try{
    const gameToken = req.headers?.authgame?.split(" ")[1]
    if(!gameToken){
      return res.status(403).json({"message":"Game session hasn't take place"})
    }
    const decodedData = jwt.verify(gameToken, process.env.SECRET)
    req.gamePlayed = decodedData
    next()
  }catch(e){
    console.log(e);
    return res.status(400).json({"message":"Unhandled error", e})
  }
}