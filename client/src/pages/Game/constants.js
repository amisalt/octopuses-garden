import { height } from "@mui/system"

export const cooldowns = {
  "salad":0,
  "meat":0,
  'meatC':5000,
  "bun":0,
  "fries":3000,
  "drink":7000,
  'burger':7000
}
export const prices = {
  "salad": 5,
  "meat": 4,
  'meatC': 6,
  "bun": 3,
  "fries": 7,
  "burger": 10,
  "drink":8
}
export const customers = {
  anglerfish:{
    food:["burger","fries","drink",'meatC']
  },
  conger:{
    food:["meat","fries","drink", 'meatC']
  },
  shark:{
    food:["burger","drink"]
  },
  pufferfish:{
    food:["fries","salad","bun","drink"]
  },
  seabunny:{
    food:["salad","bun","drink"]
  }
}
export const customersNames = ['anglerfish','conger','shark','pufferfish','seabunny']
export const sizes = {
  anglerfish:{
    height:'15dvh',
    left:'-8%',
  },
  conger:{
    height:'11dvh',
    left:'-45%'
  },
  shark:{
    height:'16dvh',
    left:'-45%'
  },
  pufferfish:{
    height:'15dvh',
    left:'0'
  },
  seabunny:{
    height:'10dvh',
    left:0
  }
}