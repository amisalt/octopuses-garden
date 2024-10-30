const User = require("../models/User")
const GameInfo = require("../models/GameInfo")
const Upgrade = require("../models/Upgrade")
const GamePlayed = require("")

class GameInfoController{
  async create(req, res){
    try{
      const {id} = req.user
      const user = User.findById(id)
      if(!user){
        return res.status(400).json({message:`User is not existing`})
      }
      const gameInfo = new GameInfo()
      await gameInfo.save()
      user.gameInfo = gameInfo._id
      await user.save()
      res.status(200).json({message:"Game instance successfully created"})
    }catch(e){
      console.error(e);
      res.status(400).json({message:"Unhandled error", e})
    }
  }
  async gainXP(req,res){
    try{
      const {id} = req.user
      const user = User.findById(id)
      if(!user){
        return res.status(400).json({message:`User is not existing`})
      }
      const gameInfo = await GameInfo.findById(user.gameInfo)
      if(!gameInfo){
        return res.status(400).json({message:"User doesn't have game instance yet"})
      }
      let newXPvalue = gameInfo.xp + req.body.xp
      gameInfo.xp = newXPvalue
      await gameInfo.save()
      res.status(200).json({message:"XP gained successfully"})
    }catch(e){
      console.error(e);
      res.status(400).json({message:"Unhandled error", e})
    }
  }
  async gainMoney(req,res){
    try{
      const {id} = req.user
      const user = User.findById(id)
      if(!user){
        return res.status(400).json({message:`User is not existing`})
      }
      const gameInfo = await GameInfo.findById(user.gameInfo)
      if(!gameInfo){
        return res.status(400).json({message:"User doesn't have game instance yet"})
      }
      let newMoneyValue = gameInfo.money + req.body.money
      gameInfo.money = newMoneyValue
      await gameInfo.save()
      res.status(200).json({message:"Money gained successfully"})
    }catch(e){
      console.error(e);
      res.status(400).json({message:"Unhandled error", e})
    }
  }
  async buyUpgrade(req,res){
    try{
      const {id} = req.user
      const user = User.findById(id)
      if(!user){
        return res.status(400).json({message:`User is not existing`})
      }
      const gameInfo = await GameInfo.findById(user.gameInfo)
      if(!gameInfo){
        return res.status(400).json({message:"User doesn't have game instance yet"})
      }
      const {name, cost, description} = req.body
      const upgrade = await Upgrade.findOne({name,cost,description})
      if(!upgrade){
        return res.status(400).json({message:"Upgrade is not existing"})
      }
      if(upgrade.cost > gameInfo.money){
        return res.status(400).json({message:"Not enough money"})
      }
      const newMoneyValue = gameInfo.money - cost
      gameInfo.money = newMoneyValue
      gameInfo.upgrades.push(upgrade._id)
      await gameInfo.save()
      res.status(200).json({message:"Upgrade bought successfully"})
    }catch(e){
      console.error(e);
      res.status(400).json({message:"Unhandled error", e})
    }
  }
}

module.exports = new GameInfoController