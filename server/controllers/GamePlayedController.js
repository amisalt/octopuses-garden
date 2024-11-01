const GamePlayed = require("../models/GamePlayed")
const Mode = require("../models/Mode")
const GameInfo = require("../models/GameInfo")
const User = require("../models/User")
const Level = require("../models/Level")
require("dotenv").config()
const jwt = require("jsonwebtoken")
const {validationResult} = require("express-validator")

function generateGameToken(id, start, level){
  const payload = {
    id,level,
    iat:start
  }
  return jwt.sign(payload, process.env.SECRET, {algorithm:"HS512"})
}

class GamePlayedController{
  async start(req,res){
    try{
      const errors = validationResult(req)
      if(!errors.isEmpty()){
        return res.status(400).json({message:"Starting game error", errors})
      }
      const {id} = req.user
      const user = await User.findById(id)
      if(!user){
        return res.status(400).json({message:`User is not existing`})
      }
      const level = await Level.findById(req.params.levelId)
      if(!level){
        return res.status(400).json({message:"Level is not existing"})
      }
      const mode = await Mode.findOne({value:req.params.mode})
      if(!mode){
        return res.status(400).json({message:"Mode is not existing"})
      }
      const game = new GamePlayed({start:Date.now(), players:[user._id], level:level._id, mode:mode.value})
      await game.save()
      const gameToken = generateGameToken(game._id, game.start, game.level)
      return res.status(200).json({message:"Game started and game token gained", gameToken})
    }catch(e){
      console.log(e)
      return res.status(400).json({message:"Unhandled error", e})
    }
  }
  async connect(req,res){
    try{
      const errors = validationResult(req)
      if(!errors.isEmpty()){
        return res.status(400).json({message:"Connecting to game error", errors})
      }
      const {id} = req.user
      const user = await User.findById(id)
      if(!user){
        return res.status(400).json({message:`User is not existing`})
      }
      const game = await GamePlayed.findById(req.gamePlayed.id)
      if(!game){
        return res.status(400).json({message:"Game id is not valid"})
      }
      const singleMode = await Mode.findOne({value:"SINGLE"})
      if(game.mode === singleMode.value){
        return res.status(400).json({message:"Game is single mode, cannot connect to game"})
      }
      game.players.push(user._id)
      await game.save()
      return res.status(200).json({message:"Successfully connected to game"})
    }catch(e){
      console.log(e)
      return res.status(400).json({message:"Unhandled error", e})
    }
  }
  async end(req,res){
    try{
      const errors = validationResult(req)
      if(!errors.isEmpty()){
        return res.status(400).json({message:"Ending game error", errors})
      }
      const {id} = req.user
      const user = await User.findById(id)
      if(!user){
        return res.status(400).json({message:`User is not existing`})
      }
      const gameInfo = await GameInfo.findById(user.gameInfo)
      if(!gameInfo){
        return res.status(400).json({message:"User doesn't have game instance yet"})
      }
      const game = await GamePlayed.findById(req.gamePlayed.id)
      if(!game){
        return res.status(400).json({message:"Game id is not valid"})
      }
      if(game.players[0] == user._id && req.body.overallTime > 0){
        game.overallTime = req.body.overallTime
        game.xp = req.body.xpOverall
        game.money = req.body.moneyOverall
      }
      if(!game.gainQueue.includes(user._id)){
        return res.status(400).json({message:"Game id is not valid for gaining XP and money"})
      }
      game.gainQueue = game.gainQueue.filter(userId=>userId != user._id)
      gameInfo.xp = gameInfo.xp + req.body.xp
      gameInfo.money = gameInfo.money + req.body.money
      await game.save()
      await gameInfo.save()
      return res.status(200).json({message:"Progress saved successfully"})
    }catch(e){
      console.log(e)
      return res.status(400).json({message:"Unhandled error", e})
    }
  }
  async leaderboardByLevel(req,res){
    try{
      const errors = validationResult(req)
      if(!errors.isEmpty()){
        return res.status(400).json({message:"Getting leaderboard error", errors})
      }
      const {id} = req.user
      const user = await User.findById(id)
      if(!user){
        return res.status(400).json({message:`User is not existing`})
      }
      const level = await Level.findById(req.params.levelId)
      if(!level){
        return res.status(400).json({message:"Level is not existing"})
      }
      const mode = await Mode.findOne({value:req.params.mode})
      if(!mode){
        return res.status(400).json({message:"Mode is not existing"})
      }
      const gamesSearchQuery = await GamePlayed.find({level:level._id, mode:mode.value}).sort({xp:-1}).limit(10)
      const games = gamesSearchQuery.map(async(game)=>{
        const newPlayersList = []
        for(player of game.players){
          const playerUser = await User.findById(player)
          newPlayersList.push(playerUser.username)
        }
        const newGameObject ={
          overallTime:game.overallTime,
          xp:game.xp,
          money:game.money,
          players:newPlayersList,
        }
        return newGameObject
      })
      return res.status(200).json({message:"Leaderboard gained successfully", games})
    }catch(e){
      console.log(e)
      return res.status(400).json({message:"Unhandled error", e})
    }
  }
}

module.exports = new GamePlayedController()