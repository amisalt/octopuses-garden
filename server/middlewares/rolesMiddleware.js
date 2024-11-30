const jwt = require("jsonwebtoken")

require("dotenv").config()

module.exports = function(roles){
  return function(req,res,next){
    if(req.method === "OPTIONS"){
      next()
    }
    try{
      const userRoles = req.user.roles
      let hasRole = false
      userRoles.forEach(role => {
        if(roles.includes(role)){
          hasRole = true
        }
      });
      if(!hasRole){
        return res.status(403).json({"message":"Access error", errors:[{
          type:"user",
          msg:`User doesn't have ${roles.join(', ')} role(s)`,
          path:"role",
          location:"user"
        }]})
      }
      next()
    }catch(e){
      console.error(e);
      return res.status(400).json({"message":"Unhandled error", errors:e})
    }
  }
}