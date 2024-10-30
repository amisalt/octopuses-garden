const {Schema, model} = require('mongoose')

const Level= new Schema({
  name: {type: String, required: true},
  description: {type: String, required: true},
  titleImg:{type:String, required:true},
  food:[{type:String}],
  customers:[{type:String}],
  prices:{

  },
  xpBonus:{type:Number, required:true},
  xpRequired:{type:Number, required:true}
})

module.exports = model("Level", Level)