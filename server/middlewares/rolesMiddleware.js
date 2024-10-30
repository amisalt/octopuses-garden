const jwt = require("jsonwebtoken")
require("dotenv").config()

module.exports = function(roles){
  return function(req,res,next){
    if(req.method === "OPTIONS"){
      next()
    }
    try{
      const {token} = req.cookies
      if(!token){
        return res.status(403).json({"message":"Unauthorized user"})
      }
      const {roles: userRoles} = jwt.verify(token, process.env.SECRET)
      let hasRole = false
      userRoles.forEach(role => {
        if(roles.includes(role)){
          hasRole = true
        }
      });
      if(!hasRole){
        return res.status(403).json({"message":"Access denied"})
      }
      next()
    }catch(e){
      console.error(e);
      return res.status(400).json({"message":"Unhandled error"})
    }
  }
}