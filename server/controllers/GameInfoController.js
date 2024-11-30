const User = require("../models/User")
const GameInfo = require("../models/GameInfo")
const Upgrade = require("../models/Upgrade")
const GamePlayed = require("../models/GamePlayed")
const Level = require("../models/Level")
const {validationResult} = require("express-validator")

class GameInfoController{
  async create(req, res){
    try{
      const errors = validationResult(req)
      if(!errors.isEmpty()){
        return res.status(400).json({message:"Validation error", errors:errors.errors})
      }
      const user = await User.findById(req.user.id)
      const gameInfo = await GameInfo.findById(user.gameInfo)
      if (!gameInfo){
        const gameInfo = new GameInfo()
        await gameInfo.save()
        user.gameInfo = gameInfo._id
        await user.save()
      }
      return res.status(200).json({message:`Success`, errors:[{
        type:"server",
        msg:`Game instance created successfully! Let the adventure begin!`,
        path:"create",
        location:"server"
      }]})
    }catch(e){
      console.error(e);
      return res.status(400).json({message:"Unhandled error", errors:e})
    }
  }
  async stats(req,res){
    try{
      const errors = validationResult(req)
      if(!errors.isEmpty()){
        return res.status(400).json({message:"Validation error", errors:errors.errors})
      }
      const gameInfo = await GameInfo.findById(req.user.gameInfo)
      if(!gameInfo){
        return res.status(400).json({message:`Nonexistance error`, errors:[{
          type:"server",
          msg:"User doesn't have any gameInstance",
          path:"gameInfo",
          location:"server"
        }]})
      }
      const upgrades = []
      for(let upgradeId of gameInfo.upgrades){
        const upgrade = await Upgrade.findById(upgradeId)
        if(!upgrade){
          return res.status(400).json({message:`Nonexistance error`, errors:[{
            type:"server",
            msg:"Upgrade doesn't exist",
            path:"uprgrade",
            location:"server"
          }]})
        }
        upgrades.push(upgrade.toObject())
      }
      const gameInfoObject = {
        xp:gameInfo.xp,
        money:gameInfo.money,
        upgrades
      }
      return res.status(200).json({message:"Success", stats:gameInfoObject, errors:[{
        type:"server",
        msg:`${req.user.username}'s stats gained`,
        path:"stats",
        location:"server"
      }]})
    }catch(e){
      console.error(e);
      return res.status(400).json({message:"Unhandled error", errors:e})
    }
  }
  async buyUpgrade(req,res){
    try{
      const errors = validationResult(req)
      if(!errors.isEmpty()){
        return res.status(400).json({message:"Validation error", errors:errors.errors})
      }
      const gameInfo = await GameInfo.findById(req.user.gameInfo)
      const upgradeId = req.params.id
      const upgrade = await Upgrade.findById(upgradeId)
      if(!upgrade){
        return res.status(400).json({message:`Nonexistance error`, errors:[{
          type:"server",
          msg:"Upgrade doesn't exist",
          path:"uprgrade",
          location:"server"
        }]})
      }
      if(upgrade.cost > gameInfo.money){
        return res.status(400).json({message:`Nonexistance error`, errors:[{
          type:"gameInfo",
          msg:"Not enough money",
          path:"money",
          location:"gameInfo"
        }]})
      }
      // Check if user have the previous version of upgrade or if this is his first upgrade of this class
      const upgradeLowerLevel = await Upgrade.findOne({class:upgrade.class, classLevel:upgrade.classLevel-1})
      if((upgradeLowerLevel && gameInfo.upgrades.includes(upgradeLowerLevel._id)) || !upgradeLowerLevel){
        const newMoneyValue = gameInfo.money-upgrade.cost
        gameInfo.money = newMoneyValue
        gameInfo.upgrades.push(upgrade._id)
        if(gameInfo.upgrades.includes(upgradeLowerLevel._id.toString())){
          gameInfo.upgrades = gameInfo.upgrades.filter(id=>id!=upgradeLowerLevel._id)
        }
        await gameInfo.save()
      }else{
        return res.status(400).json({message:`Nonexistance error`, errors:[{
          type:"gameInfo",
          msg:"You need to have previous version of this upgrade",
          path:"uprgrades",
          location:"gameInfo"
        }]})
      }
      return res.status(200).json({message:"Success", errors:[{
        type:"server",
        msg:`${upgrade.name} bought`,
        path:"buyUpgrade",
        location:"server"
      }]})
    }catch(e){
      console.error(e);
      return res.status(400).json({message:"Unhandled error", errors:e})
    }
  }
  async availableUpgrades(req,res){
    try{
      const errors = validationResult(req)
      if(!errors.isEmpty()){
        return res.status(400).json({message:"Validation error", errors:errors.errors})
      }
      const gameInfo = await GameInfo.findById(req.user.gameInfo)
      const availableUpgradesList = []
      const ungainedClassesUpgrades = await Upgrade.find({class:{"$nin":gameInfo.upgradesClasses},classLevel:0})
      availableUpgradesList.push(...ungainedClassesUpgrades.map(upgrade=>upgrade.toObject()))
      gameInfo.upgrades.forEach(async (upgradeId)=>{
        const upgrade = await Upgrade.findById(upgradeId)
        const upgradeHigherLevel = await Upgrade.find({class:upgrade.class, classLevel:upgrade.classLevel+1})
        if(upgradeHigherLevel) availableUpgradesList.push(upgradeHigherLevel.toObject())
      })
      return res.status(200).json({message:"Success",availableUpgradesList, errors:[{
        type:"server",
        msg:`Availbale upgrades list gained`,
        path:"availableUpgrades",
        location:"server"
      }]})
    }catch(e){
      console.error(e);
      return res.status(400).json({message:"Unhandled error", errors:e})
    }
  }
  async availableLevels(req,res){
    try{
      const errors = validationResult(req)
      if(!errors.isEmpty()){
        return res.status(400).json({message:"Validation error", errors:errors.errors})
      }
      const gameInfo = await GameInfo.findById(req.user.gameInfo)
      const XP = gameInfo.xp
      let availableLevelsList = await Level.find({xpRequired:{"$lte":XP}})
      availableLevelsList = availableLevelsList.map(level=>level.toObject())
      let unavailableLevelsList = await Level.find({xpRequired:{"$gt":XP}})
      unavailableLevelsList = unavailableLevelsList.map(level=>level.toObject())
      return res.status(200).json({message:"Success", availableLevelsList, unavailableLevelsList, errors:[{
        type:"server",
        msg:`Availbale levels list gained`,
        path:"availableLevels",
        location:"server"
      }]})
    }catch(e){
      console.error(e);
      return res.status(400).json({message:"Unhandled error", errors:e})
    }
  }
  async createLevel(req,res){
    try{
      const errors = validationResult(req)
      if(!errors.isEmpty()){
        return res.status(400).json({message:"Validation error", errors:errors.errors})
      }
      const {name, description, priceBonus, xpBonus, xpRequired} = req.body
      const levelCandidate = await Level.findOne({name, description,  priceBonus, xpBonus, xpRequired})
      if(levelCandidate) return res.status(400).json({message:"Existance error", errors:[{
        "type": "field",
        "msg": "Level with such name already exists",
        "path": "name",
        "location": "body"
      }]})
      const level = new Level({name, description, priceBonus, xpBonus, xpRequired})
      await level.save()
      return res.status(200).json({message:"Success", level:level, errors:[{
        type:"server",
        msg:`Level ${name} created`,
        path:"createLevel",
        location:"server"
      }]})
    }catch(e){
      console.error(e);
      return res.status(400).json({message:"Unhandled error", errors:e})
    }
  }
  async deleteLevel(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Validation error", errors:errors.errors});
      }
      const {levelId} = req.body;
      const level = await Level.findById(levelId);
      if (!level) {
        return res.status(400).json({message:`Nonexistance error`, errors:[{
          type:"server",
          msg:`Level ${levelId} doesn't exist`,
          path:"level",
          location:"server"
        }]});
      }
      await Level.findByIdAndDelete(levelId);
      return res.status(200).json({message:"Success", errors:[{
        type:"server",
        msg:`Level ${levelId} deleted`,
        path:"deleteLevel",
        location:"server"
      }]});
    } catch (e) {
      console.error(e);
      return res.status(400).json({ message: "Unhandled error", errors:e});
    }
  }
  async createUpgrade(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Validation error", errors:errors.errors });
      }
      const { name, description, cost, upgrade, quality, device, class: upgradeClass, classLevel } = req.body;
      const existingUpgrade = await Upgrade.findOne({ name, description, cost, upgrade, quality, device, class: upgradeClass, classLevel });
      if (existingUpgrade) {
        return res.status(400).json({message:"Existance error", errors:[{
          "type": "field",
          "msg": "Upgrade with such name already exists",
          "path": "name",
          "location": "body"
        }]});
      }
      const newUpgrade = new Upgrade({name,description,cost,upgrade,quality,device,class: upgradeClass,classLevel});
      await newUpgrade.save();
      return res.status(200).json({message:"Success", upgrade:newUpgrade, errors:[{
        type:"server",
        msg:`Upgrade ${name} created`,
        path:"createUpgrade",
        location:"server"
      }]});
    } catch (e) {
      console.error(e);
      return res.status(400).json({ message: "Unhandled error", errors:e });
    }
  }
  async deleteUpgrade(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Validation error", errors:errors.errors });
      }
      const { upgradeId } = req.body;
      const upgrade = await Upgrade.findById(upgradeId);
      if (!upgrade) {
        return res.status(404).json({message:`Nonexistance error`, errors:[{
          type:"server",
          msg:`Upgrade ${upgradeId} doesn't exist`,
          path:"upgrade",
          location:"server"
        }]});
      }
      const usersWithUpgrade = await GameInfo.find({ 
        'upgrades': upgradeId 
      });
      if (usersWithUpgrade.length > 0) {
        await GameInfo.updateMany(
          { 'upgrades': upgradeId },
          { $pull: { 'upgrades': upgradeId } }
        );
      }
      await Upgrade.findByIdAndDelete(upgradeId);
      return res.status(200).json({ message: "Success", affectedUsers: usersWithUpgrade.length, errors:[{
        type:"server",
        msg:`Upgrade ${upgradeId} deleted`,
        path:"deleteUpgrade",
        location:"server"
      }]});
    } catch (e) {
      console.error(e);
      return res.status(400).json({ message: "Unhandled error", errors:e });
    }
  }
}

module.exports = new GameInfoController()