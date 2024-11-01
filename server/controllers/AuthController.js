const User = require("../models/User.js")
const Role = require("../models/Role.js")
const GameInfo = require("../models/GameInfo.js")
const GamePlayed = require("../models/GamePlayed.js")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const {validationResult} = require("express-validator")
const randtoken = require("rand-token")
require("dotenv").config()

const generateAccessToken = (id, roles)=>{
  const payload = {
    id,roles,
    iat:Date.now()
  }
  return jwt.sign(payload, process.env.SECRET, {expiresIn:60, algorithm:"HS512"})
}
const generateRefreshToken = ()=>{
  return randtoken.uid(256)
}

class AuthController{
  async registration(req,res){
    try{
      const errors = validationResult(req)
      if(!errors.isEmpty()){
        return res.status(400).json({message:"Registration error", errors})
      }
      const {username,password} = req.body
      const candidate = await User.findOne({username})
      if(candidate){
        return res.status(400).json({message:"User is already existing"})
      }
      const hashPassword = bcrypt.hashSync(password, 7)
      const userRole = await Role.findOne({value:"USER"})
      if(!userRole){
        return res.status(400).json({message:"Roles distribution process went wrong"})
      }
      const user = new User({username, password:hashPassword, roles:[userRole.value]})
      await user.save();
      res.status(200).json({message:"Successfull registration", errors})
    }catch(e){
      console.error(e);
      return res.status(400).json({message:"Unhandled error", e})
    }
  }
  async login(req,res){
    try{
      const errors = validationResult(req)
      if(!errors.isEmpty()){
        return res.status(400).json({message:"Login error", errors})
      }
      const {username,password} = req.body
      const user = await User.findOne({username})
      if(!user){
        return res.status(400).json({message:`User ${username} is not existing`})
      }
      const bannedRole = await Role.findOne({value:"BANNED"})
      const adminRole = await Role.findOne({value:"ADMIN"})
      if(!bannedRole || !adminRole){
        return res.status(400).json({message:"Roles distribution process went wrong"})
      }
      if(user.roles.includes(bannedRole)){
        return res.status(400).json({message:`User ${username} is banned`})
      }
      const validPassword = bcrypt.compareSync(password,user.password)
      if(!validPassword){
        return res.status(400).json({message:`Invalid password`})
      }
      const token = generateAccessToken(user._id, user.roles)
      const refreshToken = generateRefreshToken()
      user.refreshToken = refreshToken
      await user.save()
      const asAdmin = user.roles.includes(adminRole.value)
      const userObject = {
        username:user.username,
        asAdmin
      }
      res.cookie("token", token, { secure:true, expire:Date.now()+1000*60, httpOnly: true })
      .cookie("refreshToken", refreshToken, { secure:true, expire:Date.now()+1000*60*10, httpOnly: true, sameSite:true })
      return res.status(200).json({message:"Tokens gained", asAdmin, user:userObject})
    }catch(e){
      console.error(e);
      return res.status(400).json({message:"Unhandled error", e})
    }
  }
  async token(req,res){
    try{
      const errors = validationResult(req)
      if(!errors.isEmpty()){
        return res.status(400).json({message:"Token gaining error", errors})
      }
      const {refreshToken} = req.cookies
      const user = await User.findOne({refreshToken})
      if(!user){
        return res.status(400).json({message:`User is not existing or refresh token is invalid`})
      }
      const bannedRole = await Role.findOne({value:"BANNED"})
      const adminRole = await Role.findOne({value:"ADMIN"})
      if(!bannedRole || !adminRole){
        return res.status(400).json({message:"Roles distribution process went wrong"})
      }
      if(user.roles.includes(bannedRole)){
        return res.status(400).json({message:`User ${username} is banned`})
      }
      const token = generateAccessToken(user._id, user.roles)
      const newRefreshToken = generateRefreshToken()
      user.refreshToken = newRefreshToken
      await user.save()
      const asAdmin = user.roles.includes(adminRole.value)
      const userObject = {
        username:user.username,
        asAdmin
      }
      res.cookie("token", token, { secure:true, expire:Date.now()+1000*60, httpOnly: true })
      .cookie("refreshToken", newRefreshToken, { secure:true, expire:Date.now()+1000*60*10, httpOnly: true, sameSite:true })
      return res.status(200).json({message:"Tokens gained", user:userObject})
    }catch(e){
      console.error(e);
      return res.status(400).json({message:"Unhandled error", e})
    }
  }
  async logout(req,res){
    try{
      const errors = validationResult(req)
      if(!errors.isEmpty()){
        return res.status(400).json({message:"Logout error", errors})
      }
      const {id} = req.user
      const user = await User.findById(id)
      if(!user){
        return res.status(400).json({message:`User is not existing`})
      }
      user.refreshToken = null
      await user.save()
      res.clearCookie("token")
      res.clearCookie("refreshToken")
      return res.status(200).json({message:"Tokens cleared"})
    }catch(e){
      console.error(e);
      return res.status(400).json({message:"Unhandled error", e})
    }
    
  }
  async makeAdmin(req,res){
    try{
      const errors = validationResult(req)
      if(!errors.isEmpty()){
        return res.status(400).json({message:"Making admin error", errors})
      }
      const {id} = req.user
      const user = await User.findById(id)
      if(!user){
        return res.status(400).json({message:`User is not existing`})
      }
      const {username} = req.body
      const targetUser = await User.findOne({username})
      if(!targetUser){
        return res.status(400).json({message:`Target user is not existing`})
      }
      const adminRole = await Role.findOne({value:"ADMIN"})
      if(!adminRole){
        return res.status(400).json({message:"Roles distribution process went wrong"})
      }
      if(!targetUser.roles.includes(adminRole.value)){
        targetUser.roles.push(adminRole.value)
        await targetUser.save()
      }
      return res.status(200).json({message:`User is now admin`})
    }catch(e){
      console.error(e);
      return res.status(400).json({message:"Unhandled error", e})
    }
  }
  async removeAdmin(req,res){
    try{
      const errors = validationResult(req)
      if(!errors.isEmpty()){
        return res.status(400).json({message:"Removing admin error", errors})
      }
      const {id} = req.user
      const user = await User.findById(id)
      if(!user){
        return res.status(400).json({message:`User is not existing`})
      }
      const {username} = req.body
      const targetUser = await User.findOne({username})
      if(!targetUser){
        return res.status(400).json({message:`Target user is not existing`})
      }
      const adminRole = await Role.findOne({value:"ADMIN"})
      if(!adminRole){
        return res.status(400).json({message:"Roles distribution process went wrong"})
      }
      if(targetUser.roles.includes(adminRole.value)){
        const newTargetUserRoles = targetUser.roles.filter(role => role !== adminRole.value)
        targetUser.roles = newTargetUserRoles
        await targetUser.save()
      }
      return res.status(200).json({message:`User is now deprived of the admin rights`})
    }catch(e){
      console.error(e);
      return res.status(400).json({message:"Unhandled error", e})
    }
  }
  async ban(req,res){
    try{
      const errors = validationResult(req)
      if(!errors.isEmpty()){
        return res.status(400).json({message:"Banning error", errors})
      }
      const {id} = req.user
      const user = await User.findById(id)
      if(!user){
        return res.status(400).json({message:`User is not existing`})
      }
      const {username} = req.body
      const targetUser = await User.findOne({username})
      if(!targetUser){
        return res.status(400).json({message:`Target user is not existing`})
      }
      targetUser.refreshToken = ""
      const bannedRole = await Role.findOne({value:"BANNED"})
      if(!bannedRole){
        return res.status(400).json({message:"Roles distribution process went wrong"})
      }
      if(!targetUser.roles.includes(bannedRole.value)){
        targetUser.roles = [bannedRole.value]
        await targetUser.save()
      }
      await GameInfo.findByIdAndDelete(targetUser.gameInfo)
      await GamePlayed.deleteMany({players:{"$in":[targetUser._id]}})
      return res.status(200).json({message:`User is now banned`})
    }catch(e){
      console.error(e);
      return res.status(400).json({message:"Unhandled error", e})
    }
  }
  async placeholder(req,res){
    try{
      return res.status(200).json({message:{headers:req.headers}})
    }catch(e){
      console.error(e);
      return res.status(400).json({message:"Unhandled error", e})
    }
  }
}
module.exports = new AuthController()