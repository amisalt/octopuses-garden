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
    id,level,start,
    iat:start
  }
  return jwt.sign(payload, process.env.SECRET, {algorithm:"HS512"})
}

async function checkInLeaderboard(gameId, levelId, mode){
  const leaderboard = (await GamePlayed.find({level:levelId, mode:mode}).sort({xp:-1}).limit(10)).map(game=>game._id)
  return leaderboard.includes(gameId)
}

class GamePlayedController{
  async start(req,res){
    try{
      const errors = validationResult(req)
      if(!errors.isEmpty()){
        return res.status(400).json({message:"Validation error", errors:errors.errors})
      }
      const level = await Level.findById(req.params.levelId)
      if(!level){
        return res.status(400).json({message:`Nonexistance error`, errors:[{
          type:"server",
          msg:`Level ${req.params.levelId} doesn't exist`,
          path:"level",
          location:"server"
        }]})
      }
      const mode = await Mode.findOne({value:req.params.mode.toUpperCase()})
      if(!mode){
        return res.status(400).json({message:`Nonexistance error`, errors:[{
          type:"server",
          msg:`Mode ${req.params.mode.toUpperCase()} doesn't exist`,
          path:"mode",
          location:"server"
        }]})
      }
      const game = new GamePlayed({start:Date.now(), players:[req.user.id], gainQueue:[req.user.id], level:level._id, mode:mode.value})
      await game.save()
      const gameToken = game._id
      return res.status(200).json({message:"Success", gameToken, errors:[{
        type:"server",
        msg:`Game started and game token gained`,
        path:"start",
        location:"server"
      }]})
    }catch(e){
      console.log(e)
      return res.status(400).json({message:"Unhandled error", errors:e})
    }
  }
  async connect(req,res){
    try{
      const errors = validationResult(req)
      if(!errors.isEmpty()){
        return res.status(400).json({message:"Validation error", errors:errors.errors})
      }
      const game = await GamePlayed.findById(req.gamePlayed.id)
      const singleMode = await Mode.findOne({value:"SINGLE"})
      if(!singleMode){
        return res.status(400).json({message:`Nonexistance error`, errors:[{
          type:"server",
          msg:`Mode SINGLE doesn't exist`,
          path:"mode",
          location:"server"
        }]})
      }
      if(game.mode === singleMode.value){
        return res.status(400).json({"message":"Access error", errors:[{
          type:"game",
          msg:`SINGLE mode does not support connect function`,
          path:"mode",
          location:"game"
        }]})
      }
      game.players.push(req.user.id)
      await game.save()
      return res.status(200).json({message:"Success", errors:[{
        type:"server",
        msg:`Connected to game`,
        path:"connect",
        location:"server"
      }]})
    }catch(e){
      console.log(e)
      return res.status(400).json({message:"Unhandled error", errors:e})
    }
  }
  async end(req,res){
    try{
      const errors = validationResult(req)
      if(!errors.isEmpty()){
        return res.status(400).json({message:"Validation error", errors:errors.errors})
      }
      const gameInfo = await GameInfo.findById(req.user.gameInfo)
      const game = await GamePlayed.findById(req.gamePlayed.id)
      if(game.players[0] == req.user.id && req.body.overallTime > 0){
        game.overallTime = req.body.overallTime
        game.xp = req.body.xpOverall
        game.money = req.body.moneyOverall
      }
      if(!game.gainQueue.includes(req.user.id)){
        return res.status(400).json({"message":"Access error", errors:[{
          type:"game",
          msg:`Game id is not valid for gaining XP and money`,
          path:"gainQueue",
          location:"game"
        }]})
      }
      game.gainQueue = game.gainQueue.filter(userId=>userId != req.user.id)
      gameInfo.xp = gameInfo.xp + req.body.xp
      console.log(gameInfo.money, req.body.money, 'STATS MONEEEEEY')
      gameInfo.money = gameInfo.money + req.body.money
      await game.save()
      if(!checkInLeaderboard(req.gamePlayed.id, req.gamePlayed.level, req.gamePlayed.mode)){
        await 
        game.deleteOne()
      }
      await gameInfo.save()
      return res.status(200).json({message:"Success", errors:[{
        type:"server",
        msg:`Progress saved`,
        path:"end",
        location:"server"
      }]})
    }catch(e){
      console.log(e)
      return res.status(400).json({message:"Unhandled error", errors:e})
    }
  }
  async exit(req,res){
    try{
      const errors = validationResult(req)
      if(!errors.isEmpty()){
        return res.status(400).json({message:"Validation error", errors:errors.errors})
      }
      const game = await GamePlayed.findById(req.gamePlayed.id)
      await game.deleteOne()
      return res.status(200).json({message:"Success", errors:[{
        type:"server",
        msg:`Game exited without saving progress`,
        path:"exit",
        location:"server"
      }]})
    }catch(e){
      console.log(e)
      return res.status(400).json({message:"Unhandled error", errors:e})
    }
  }
  async leaderboardByLevel(req,res){
    try{
      const errors = validationResult(req)
      if(!errors.isEmpty()){
        return res.status(400).json({message:"Validation error", errors:errors.errors})
      }
      const level = await Level.findById(req.params.levelId)
      if(!level){
        return res.status(400).json({message:`Nonexistance error`, errors:[{
          type:"server",
          msg:`Level ${req.params.levelId} doesn't exist`,
          path:"level",
          location:"server"
        }]})
      }
      const mode = await Mode.findOne({value:req.params.mode})
      if(!mode){
        return res.status(400).json({message:`Nonexistance error`, errors:[{
          type:"server",
          msg:`Mode ${req.params.mode} doesn't exist`,
          path:"mode",
          location:"server"
        }]})
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
      return res.status(200).json({message:"Success", leaderboard:games, errors:[{
        type:"server",
        msg:`Leaderboard of ${req.params.levelId} ${req.params.mode} mode gained`,
        path:"leaderboardByLevel",
        location:"server"
      }]})
    }catch(e){
      console.log(e)
      return res.status(400).json({message:"Unhandled error", errors:e})
    }
  }
  async createMode(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Validation error", errors:errors.errors });
      }
      const { value } = req.body;
      const modeValue = value.toUpperCase();
      const existingMode = await Mode.findOne({ value: modeValue });
      if (existingMode) {
        return res.status(400).json({message:"Existance error", errors:[{
          "type": "field",
          "msg": "Mode with such name already exists",
          "path": "value",
          "location": "body"
        }]});
      }
      const newMode = new Mode({
        value: modeValue
      });
      await newMode.save();
      return res.status(200).json({ message: "Success", mode: newMode, errors:[{
        type:"server",
        msg:`Mode ${modeValue} created`,
        path:"createMode",
        location:"server"
      }] });
    } catch (e) {
      console.error(e);
      return res.status(400).json({ message: "Unhandled error", errors:e });
    }
  }
  async deleteMode(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Validation error", errors:errors.errors });
      }
      const { value } = req.body;
      const modeValue = value.toUpperCase();
      const mode = await Mode.findOne({ value: modeValue });
      if (!mode) {
        return res.status(404).json({message:`Nonexistance error`, errors:[{
          type:"server",
          msg:`Mode ${modeValue} doesn't exist`,
          path:"mode",
          location:"server"
        }]});
      }
      await GamePlayed.deleteMany({ mode: modeValue });
      await Mode.findByIdAndDelete(mode._id);
      return res.status(200).json({ message: "Success",deletedMode: modeValue, errors:[{
        type:"server",
        msg:`Mode ${modeValue} deleted`,
        path:"createMode",
        location:"server"
      }]});
    } catch (e) {
      console.error(e);
      return res.status(400).json({ message: "Unhandled error", errors:e });
    }
  }
}

module.exports = new GamePlayedController()