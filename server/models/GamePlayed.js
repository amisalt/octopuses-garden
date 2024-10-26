const {model, Schema} = require("mongoose")

const GamePlayed = new Schema({
  start:{type:Date, required:true},
  end:{type:Date, reuqired:true},
  player:{type:String, ref:"User"}
})

module.exports = model("GamePlayed", GamePlayed)