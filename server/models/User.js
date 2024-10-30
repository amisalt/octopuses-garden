const { Schema, model } = require("mongoose")

const User = new Schema({
  username:{type:String, unique:true, required:true},
  password:{type:String, required:true},
  roles:[{type:String, ref:"Role"}],
  refreshToken:{type:String, default:""},
  gameInfo:{type:String, ref:"GameInfo", default:""}
})

module.exports = model("User", User)