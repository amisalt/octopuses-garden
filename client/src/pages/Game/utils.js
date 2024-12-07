import { cooldowns, customers, customersNames } from "./constants";
import { getRandomIntegerInclusive } from "../../hooks/getRandomNumber";
import { prices } from "./constants";

export function makeNewOrderObject(priceBonus){
  const customerName = customersNames[Math.floor(Math.random() * customersNames.length)]
  let overallNumber = 0
  let time = 5000
  const food = {}
  const foodNames = []
  let customerFoodChoiceLength = customers[customerName].food.length
  for(let i = 0; i<customerFoodChoiceLength; i++){
    const addChoice = Math.round(Math.random())
    const foodName = customers[customerName].food[i]
    if(addChoice === 1 || (i === customerFoodChoiceLength-1 && overallNumber === 0)){
      const number = getRandomIntegerInclusive(1, 3)
      overallNumber += number
      food[foodName] = number
      foodNames.push(foodName)
      time += (cooldowns[customers[customerName].food[i]]+2000)*number*1.3
    }
  }

  let money = 0
  for(let foodItem in food){
    money += food[foodItem]*prices[foodItem]*priceBonus
  }

  const newOrder = {
    id:Date.now(),
    customerName:customerName,
    food:food,
    foodNames:foodNames,
    time:time,
    overallNumber:overallNumber,
    money:money
  }
  return newOrder
}