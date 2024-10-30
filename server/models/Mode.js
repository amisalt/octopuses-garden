const {model, Schema} = require("mongoose")

const Mode = new Schema({
  value:{type:String, unique:true, default:"SINGLE"}
})

module.exports = model("Mode", Mode)