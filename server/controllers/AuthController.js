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
        return res.status(400).json({message:"Validation error", errors:errors.errors})
      }
      const {username,password} = req.body
      const candidate = await User.findOne({username})
      if(candidate){
        return res.status(400).json({message:"Existance error", errors:[{
          "type": "field",
          "msg": "User with such username already exists",
          "path": "username",
          "location": "body"
        }]})
      }
      const hashPassword = bcrypt.hashSync(password, 7)
      const userRole = await Role.findOne({value:"USER"})
      if(!userRole){
        return res.status(400).json({message:"Roles distribution error", errors:[{
          type:"server",
          msg:"User role not found",
          path:"role",
          location:"server"
        }]})
      }
      const user = new User({username, password:hashPassword, roles:[userRole.value]})
      await user.save();
      res.status(200).json({message:"Success", errors:[{
        type:"server",
        msg:"Registration successful! Welcome aboard!",
        path:"registration",
        location:"server"
      }]})
    }catch(e){
      console.error(e);
      return res.status(400).json({message:"Unhandled error", errors:e})
    }
  }
  async login(req,res){
    try{
      const errors = validationResult(req)
      if(!errors.isEmpty()){
        return res.status(400).json({message:"Validation error", errors:errors.errors})
      }
      const {username,password} = req.body
      const user = await User.findOne({username})
      if(!user){
        return res.status(400).json({message:`Nonexistance error`, errors:[{
          type:"field",
          msg:"User with such username doesn't exist",
          path:"username",
          location:"body"
        }]})
      }
      const bannedRole = await Role.findOne({value:"BANNED"})
      const adminRole = await Role.findOne({value:"ADMIN"})
      if(!bannedRole || !adminRole){
        return res.status(400).json({message:"Roles distribution error", errors:[{
          type:"server",
          msg:`${!adminRole?"Admin":''} ${!bannedRole?"Banned":''} role not found`,
          path:"role",
          location:"server"
        }]})
      }
      if(user.roles.includes(bannedRole)){
        return res.status(400).json({message:`Access error`, errors:[{
          type:"user",
          msg:"User is banned",
          path:"role",
          location:"user"
        }]})
      }
      const validPassword = bcrypt.compareSync(password,user.password)
      if(!validPassword){
        return res.status(400).json({message:`Validation error`, errors:[{
          type:"field",
          msg:"Invalid password",
          path:"password",
          location:"body"
        }]})
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
      res.cookie("token", token, { expire:Date.now()+1000*60, httpOnly: true })
      .cookie("refreshToken", refreshToken, { expire:Date.now()+1000*60*10, httpOnly: true, sameSite:true })
      return res.status(200).json({message:"Success", asAdmin, user:userObject, errors:[{
        type:"server",
        msg:"Login successful! Welcome back!",
        path:"login",
        location:"server"
      }]})
    }catch(e){
      console.error(e);
      return res.status(400).json({message:"Unhandled error", errors:e})
    }
  }
  async token(req,res){
    try{
      const errors = validationResult(req)
      if(!errors.isEmpty()){
        return res.status(400).json({message:"Validation error", errors:errors.errors})
      }
      const {refreshToken} = req.cookies
      const user = await User.findOne({refreshToken})
      if(!user){
        return res.status(400).json({message:`Nonexistance error`, errors:[{
          type:"user",
          msg:"User does not exist or refresh token is invalid",
          path:"refreshToken",
          location:"user"
        }]})
      }
      const bannedRole = await Role.findOne({value:"BANNED"})
      const adminRole = await Role.findOne({value:"ADMIN"})
      if(!bannedRole || !adminRole){
        return res.status(400).json({message:"Roles distribution error", errors:[{
          type:"server",
          msg:`${!adminRole?"Admin":''} ${!bannedRole?"Banned":''} role not found`,
          path:"role",
          location:"server"
        }]})
      }
      if(user.roles.includes(bannedRole)){
        return res.status(400).json({message:`Access error`, errors:[{
          type:"user",
          msg:"User is banned",
          path:"role",
          location:"user"
        }]})
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
      res.cookie("token", token, { expire:Date.now()+1000*60, httpOnly: true })
      .cookie("refreshToken", newRefreshToken, { expire:Date.now()+1000*60*10, httpOnly: true, sameSite:true })
      return res.status(200).json({message:"Success", user:userObject, errors:[{
        type:"server",
        msg:"Access token generated successfully!",
        path:"token",
        location:"server"
      }]})
    }catch(e){
      console.error(e);
      return res.status(400).json({message:"Unhandled error", errors:e})
    }
  }
  async logout(req,res){
    try{
      const errors = validationResult(req)
      if(!errors.isEmpty()){
        return res.status(400).json({message:"Validation error", errors:errors.errors})
      }
      const user = await User.findById(req.user.id)
      user.refreshToken = null
      await user.save()
      res.clearCookie("token")
      res.clearCookie("refreshToken")
      return res.status(200).json({message:"Success", errors:[{
        type:"server",
        msg:"Logout successful! See you next time!",
        path:"logout",
        location:"server"
      }]})
    }catch(e){
      console.error(e);
      return res.status(400).json({message:"Unhandled error", errors:e})
    }
    
  }
  async makeAdmin(req,res){
    try{
      const errors = validationResult(req)
      if(!errors.isEmpty()){
        return res.status(400).json({message:"Validation error", errors:errors.errors})
      }
      const {username} = req.body
      const targetUser = await User.findOne({username})
      if(!targetUser){
        return res.status(400).json({message:`Nonexistance error`, errors:[{
          type:"field",
          msg:"User does not exist",
          path:"username",
          location:"body"
        }]})
      }
      const adminRole = await Role.findOne({value:"ADMIN"})
      if(!adminRole){
        return res.status(400).json({message:"Roles distribution error", errors:[{
          type:"server",
          msg:`${!adminRole?"Admin":''} ${!bannedRole?"Banned":''} role not found`,
          path:"role",
          location:"server"
        }]})
      }
      if(!targetUser.roles.includes(adminRole.value)){
        targetUser.roles.push(adminRole.value)
        await targetUser.save()
      }
      return res.status(200).json({message:`Success`, errors:[{
        type:"server",
        msg:`The user ${username} has been granted admin privileges.`,
        path:"makeAdmin",
        location:"server"
      }]})
    }catch(e){
      console.error(e);
      return res.status(400).json({message:"Unhandled error", errors:e})
    }
  }
  async removeAdmin(req,res){
    try{
      const errors = validationResult(req)
      if(!errors.isEmpty()){
        return res.status(400).json({message:"Validation error", errors:errors.errors})
      }
      const {username} = req.body
      const targetUser = await User.findOne({username})
      if(!targetUser){
        return res.status(400).json({message:`Nonexistance error`, errors:[{
          type:"field",
          msg:"User does not exist",
          path:"username",
          location:"body"
        }]})
      }
      const adminRole = await Role.findOne({value:"ADMIN"})
      if(!adminRole){
        return res.status(400).json({message:"Roles distribution error", errors:[{
          type:"server",
          msg:`${!adminRole?"Admin":''} ${!bannedRole?"Banned":''} role not found`,
          path:"role",
          location:"server"
        }]})
      }
      if(targetUser.roles.includes(adminRole.value)){
        const newTargetUserRoles = targetUser.roles.filter(role => role !== adminRole.value)
        targetUser.roles = newTargetUserRoles
        await targetUser.save()
      }
      return res.status(200).json({message:`Success`, errors:[{
        type:"server",
        msg:`The user ${username} has been revoked of admin privileges.`,
        path:"makeAdmin",
        location:"server"
      }]})
    }catch(e){
      console.error(e);
      return res.status(400).json({message:"Unhandled error", errors:e})
    }
  }
  async ban(req,res){
    try{
      const errors = validationResult(req)
      if(!errors.isEmpty()){
        return res.status(400).json({message:"Validation error", errors:errors.errors})
      }
      const {username} = req.body
      const targetUser = await User.findOne({username})
      if(!targetUser){
        return res.status(400).json({message:`Nonexistance error`, errors:[{
          type:"field",
          msg:"User does not exist",
          path:"username",
          location:"body"
        }]})
      }
      targetUser.refreshToken = ""
      const bannedRole = await Role.findOne({value:"BANNED"})
      if(!bannedRole){
        return res.status(400).json({message:"Roles distribution error", errors:[{
          type:"server",
          msg:`${!adminRole?"Admin":''} ${!bannedRole?"Banned":''} role not found`,
          path:"role",
          location:"server"
        }]})
      }
      if(!targetUser.roles.includes(bannedRole.value)){
        targetUser.roles = [bannedRole.value]
        await targetUser.save()
        await GameInfo.findByIdAndDelete(targetUser.gameInfo)
        await GamePlayed.deleteMany({players:{"$in":[targetUser._id]}})
      }
      return res.status(200).json({message:`Success`, errors:[{
        type:"server",
        msg:`The user ${username} has been banned.`,
        path:"ban",
        location:"server"
      }]})
    }catch(e){
      console.error(e);
      return res.status(400).json({message:"Unhandled error", errors:e})
    }
  }
  async createRole(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Validation error", errors:errors.errors });
      }
      const { value } = req.body;
      const roleValue = value.toUpperCase()
      const existingRole = await Role.findOne({ value:roleValue });
      if (existingRole) {
        return res.status(400).json({message:"Existance error", errors:[{
          "type": "field",
          "msg": "Role with such value already exists",
          "path": "value",
          "location": "body"
        }]})
      }
      const newRole = new Role({ value });
      await newRole.save();
      return res.status(201).json({ message: `Success`, errors:[{
        type:"server",
        msg:`The role ${value} has been created.`,
        path:"createRole",
        location:"server"
      }] });
    } catch (e) {
      console.error(e);
      return res.status(400).json({ message: "Unhandled error", errors:e });
    }
  }
  async deleteRole(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Validation error", errors:errors.errors });
      }
      const { value } = req.body;
      const roleValue = value.toUpperCase()
      const existingRole = await Role.findOne({ value:roleValue });
      if (!existingRole) {
        return res.status(404).json({message:`Nonexistance error`, errors:[{
          type:"field",
          msg:"Role does not exist",
          path:"value",
          location:"body"
        }]});
      }
      await Role.deleteOne({ value });
      return res.status(200).json({ message: `Success`, errors:[{
        type:"server",
        msg:`The role ${value} has been deleted.`,
        path:"deleteRole",
        location:"server"
      }] });
    } catch (e) {
      console.error(e);
      return res.status(400).json({ message: "Unhandled error", errors:e });
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