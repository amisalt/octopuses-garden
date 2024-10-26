const User = require("../models/User.js")
const Role = require("../models/Role.js")
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
      const user = new User({username, password:hashPassword, roles:[userRole.value]})
      await user.save();
      res.status(200).json({message:"Successfull registration", errors})
    }catch(e){
      console.error(e);
      res.status(400).json({message:"Unhandled error", e})
    }
  }
  async login(req,res){
    try{
      const {username,password} = req.body
      const user = await User.findOne({username})
      if(!user){
        return res.status(400).json({message:`User ${username} is not existing`})
      }
      const validPassword = bcrypt.compareSync(password,user.password)
      if(!validPassword){
        return res.status(400).json({message:`Invalid password`})
      }
      const token = generateAccessToken(user._id, user.roles)
      const refreshToken = generateRefreshToken()
      user.refreshToken = refreshToken
      await user.save()
      // res.writeHead(200, [
      //   ["Set-Cookie", `refreshToken=${refreshToken}; Max-Age=120000; HttpOnly; Secure; SameSite`]
      //   ["Set-Cookie", `token=${token}; Max-Age=120000; HttpOnly; Secure`]
      // ])
      res.cookie("token", token, { secure:true, expire:Date.now()+1000*60, httpOnly: true })
      .cookie("refreshToken", refreshToken, { secure:true, expire:Date.now()+1000*60*10, httpOnly: true, sameSite:true })
      return res.status(200).json({message:"Tokens gained"})
    }catch(e){
      console.error(e);
      res.status(400).json({message:"Unhandled error", e})
    }
  }
  async token(req,res){
    try{
      const {refreshToken} = req.cookies
      const user = await User.findOne({refreshToken})
      if(!user){
        return res.status(400).json({message:`User is not existing or refresh token is invalid`})
      }
      const token = generateAccessToken(user._id, user.roles)
      const newRefreshToken = generateRefreshToken()
      user.refreshToken = newRefreshToken
      await user.save()
      res.cookie("token", token, { secure:true, expire:Date.now()+1000*60, httpOnly: true })
      .cookie("refreshToken", newRefreshToken, { secure:true, expire:Date.now()+1000*60*10, httpOnly: true, sameSite:true })
      return res.status(200).json({message:"Tokens gained"})
    }catch(e){
      console.error(e);
      res.status(400).json({message:"Unhandled error", e})
    }
  }
  async logout(req,res){
    try{
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
      res.status(400).json({message:"Unhandled error", e})
    }
    
  }
  async getUsers(req,res){
    try{
      // ! Он не может превратить model в json
      // const users = await User.find()
      // res.json(users);
      // const userRole = new Role()
      // const adminRole = new Role({value:"ADMIN"})
      // await userRole.save()
      // await adminRole.save()
      res.json({message:200})
    }catch(e){
      console.error(e);
      res.status(400).json({message:"Unhandled error", e})
    }
  }
}
module.exports = new AuthController()