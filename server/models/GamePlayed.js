const {model, Schema} = require("mongoose")

const GamePlayed = new Schema({
  // ? Date is stored in the number of milliseconds elapsed since the epoch
  start:{type:Number, required:true},
  // ? Time is stored in ms
  overallTime:{type:Number},
  players:[{type:String, ref:"User"}],
  gainQueue:[{type:String, ref:"User"}],
  level:{type:String, ref:"Level", required:true},
  xp:{type:Number, default:0},
  money:{type:Number, default:0},
  mode:{type:String,  required:true, ref:"Mode"},

})

module.exports = model("GamePlayed", GamePlayed)