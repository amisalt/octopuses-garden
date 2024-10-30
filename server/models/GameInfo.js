const { Schema, model } = require("mongoose")

const GameInfo = new Schema({
  xp:{type:Number, default:0},
  money:{type:Number, default:0},
  upgrades:[{type:String, ref:"Upgrade"}]
})

module.exports = model("GameInfo", GameInfo)