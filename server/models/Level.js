const {Schema, model} = require('mongoose')

const Level= Schema({
  name: {type: String, required: true},
  description: {type: String, required: true},
  titleImg:{type:String, required:true},
  food:[{type:String}],
})