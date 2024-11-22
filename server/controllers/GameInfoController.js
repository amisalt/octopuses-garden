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
      const {id} = req.user
      const user = await User.findById(id)
      if(!user){
        return res.status(400).json({message:`User is not existing`})
      }
      let gameInfo = await GameInfo.findById(user.gameInfo)
      if(!gameInfo){
        return res.status(400).json({message:"User doesn't have game instance yet"})
      }
      const upgrades = []
      for(let upgradeId of gameInfo.upgrades){
        const upgrade = await Upgrade.findById(upgradeId)
        if(!upgrade){
          return res.status(400).json({message:"Upgrade is not existing"})
        }
        upgrades.push(upgrade.toObject())
      }
      const gameInfoObject = {
        xp:gameInfo.xp,
        money:gameInfo.money,
        upgrades
      }
      return res.status(200).json({message:"Stats gained successfully", stats:gameInfoObject})
    }catch(e){
      console.error(e);
      return res.status(400).json({message:"Unhandled error", e})
    }
  }
  async buyUpgrade(req,res){
    try{
      const errors = validationResult(req)
      if(!errors.isEmpty()){
        return res.status(400).json({message:"Buying upgrade error", errors})
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
      const upgradeId = req.params.id
      const upgrade = await Upgrade.findById(upgradeId)
      if(!upgrade){
        return res.status(400).json({message:"Upgrade is not existing"})
      }
      if(upgrade.cost > gameInfo.money){
        return res.status(400).json({message:"Not enough money"})
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
        return res.status(400).json({message:"You must have the previous version of this upgrade"})
      }
      return res.status(200).json({message:"Upgrade bought successfully"})
    }catch(e){
      console.error(e);
      return res.status(400).json({message:"Unhandled error", e})
    }
  }
  async availableUpgrades(req,res){
    try{
      const errors = validationResult(req)
      if(!errors.isEmpty()){
        return res.status(400).json({message:"Getting available upgrades error", errors})
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
      const availableUpgradesList = []
      const ungainedClassesUpgrades = await Upgrade.find({class:{"$nin":gameInfo.upgradesClasses},classLevel:0})
      availableUpgradesList.push(...ungainedClassesUpgrades.map(upgrade=>upgrade.toObject()))
      gameInfo.upgrades.forEach(async (upgradeId)=>{
        const upgrade = await Upgrade.findById(upgradeId)
        const upgradeHigherLevel = await Upgrade.find({class:upgrade.class, classLevel:upgrade.classLevel+1})
        if(upgradeHigherLevel) availableUpgradesList.push(upgradeHigherLevel.toObject())
      })
      return res.status(200).json({message:"Available upgrades list gained",availableUpgradesList})
    }catch(e){
      console.error(e);
      return res.status(400).json({message:"Unhandled error", e})
    }
  }
  async availableLevels(req,res){
    try{
      const errors = validationResult(req)
      if(!errors.isEmpty()){
        return res.status(400).json({message:"Getting available levels error", errors})
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
      const XP = gameInfo.xp
      let availableLevelsList = await Level.find({xpRequired:{"$lte":XP}})
      availableLevelsList = availableLevelsList.map(level=>level.toObject())
      let unavailableLevelsList = await Level.find({xpRequired:{"$gt":XP}})
      unavailableLevelsList = unavailableLevelsList.map(level=>level.toObject())
      return res.status(200).json({message:"Levels lists gained", availableLevelsList, unavailableLevelsList})
    }catch(e){
      console.error(e);
      return res.status(400).json({message:"Unhandled error", e})
    }
  }
  async createLevel(req,res){
    try{
      const errors = validationResult(req)
      if(!errors.isEmpty()){
        return res.status(400).json({message:"Getting available levels error", errors})
      }
      const {id} = req.user
      const user = await User.findById(id)
      if(!user){
        return res.status(400).json({message:`User is not existing`})
      }
      const {name, description, priceBonus, xpBonus, xpRequired} = req.body
      const levelCandidate = await Level.findOne({name, description,  priceBonus, xpBonus, xpRequired})
      if(levelCandidate) return res.status(400).json({message:"Level already exists"})
      const level = new Level({name, description, priceBonus, xpBonus, xpRequired})
      await level.save()
      return res.status(200).json({message:"Level created"})
    }catch(e){
      console.error(e);
      return res.status(400).json({message:"Unhandled error", e})
    }
  }
  async deleteLevel(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Deleting level error", errors });
      }
      const { id } = req.user;
      const user = await User.findById(id);
      if (!user) {
        return res.status(400).json({ message: `User  is not existing` });
      }
      const {levelId} = req.body;
      const level = await Level.findById(levelId);
      if (!level) {
        return res.status(400).json({ message: "Level is not existing" });
      }
      await Level.findByIdAndDelete(levelId);
      return res.status(200).json({ message: "Level deleted successfully" });
    } catch (e) {
      console.error(e);
      return res.status(400).json({ message: "Unhandled error", e });
    }
  }
  async createUpgrade(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Creating upgrade error", errors });
      }
      const { id } = req.user;
      const user = await User.findById(id);
      if (!user) {
        return res.status(400).json({ message: `User is not existing` });
      }
      const { name, description, cost, upgrade, quality, device, class: upgradeClass, classLevel } = req.body;
      const existingUpgrade = await Upgrade.findOne({ name, description, cost, upgrade, quality, device, class: upgradeClass, classLevel });
      if (existingUpgrade) {
        return res.status(400).json({ message: "Upgrade already exists" });
      }
      const newUpgrade = new Upgrade({name,description,cost,upgrade,quality,device,class: upgradeClass,classLevel});
      await newUpgrade.save();
      return res.status(200).json({ message: "Upgrade created successfully", upgrade: newUpgrade });
    } catch (e) {
      console.error(e);
      return res.status(400).json({ message: "Unhandled error", e });
    }
  }
  async deleteUpgrade(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Deleting upgrade error", errors });
      }
      const { id } = req.user;
      const user = await User.findById(id);
      if (!user) {
        return res.status(400).json({ message: "User is not existing" });
      }
      const { upgradeId } = req.body;
      const upgrade = await Upgrade.findById(upgradeId);
      if (!upgrade) {
        return res.status(404).json({ message: "Upgrade not found" });
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
      return res.status(200).json({ message: "Upgrade deleted successfully", affectedUsers: usersWithUpgrade.length});
    } catch (e) {
      console.error(e);
      return res.status(400).json({ message: "Unhandled error", e });
    }
  }
}

module.exports = new GameInfoController()