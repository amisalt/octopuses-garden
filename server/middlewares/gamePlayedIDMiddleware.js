const jwt = require("jsonwebtoken")
require("dotenv").config()
const GamePlayed = require("../models/GamePlayed")

module.exports = async function(req, res, next){
  if(req.method === "OPTIONS"){
    next()
  }
  try{
    const gameToken = req.headers?.authgame?.split(" ")[1]
    if(!gameToken){
      return res.status(403).json({message:`Nonexistance error`, errors:[{
        type:"game",
        msg:"Invalid gameToken",
        path:"authgame",
        location:"game"
      }]})
    }
    const decodedData = jwt.verify(gameToken, process.env.SECRET)
    const game = await GamePlayed.findById(decodedData.id)
    if(!game){
      return res.status(403).json({message:`Nonexistance error`, errors:[{
        type:"game",
        msg:"Game session does not exist",
        path:"authgame",
        location:"game"
      }]})
    }
    req.gamePlayed = {
      id:game._id,
      level:game.level,
      mode:game.mode
    }
    next()
  }catch(e){
    console.log(e);
    return res.status(400).json({"message":"Unhandled error", errors:e})
  }
}