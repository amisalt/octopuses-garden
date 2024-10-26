const {Schema, model} = require("mongoose")

const Upgrade = new Schema({
  name:{type:String, required:true, unique:true},
  cost:{type:Number, required:true}, 
  description:{type:String, required:true},
  upgrade:{type:Number, required:true}, //like it is description of an upgrade but in numbers
  quality:{type:String, required:true}, //quality to which this upgrade is applied
  device:{type:String, required:true}
})

module.exports = model("Upgrade", Upgrade)