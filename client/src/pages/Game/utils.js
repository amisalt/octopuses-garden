import { customers, customersNames } from "./constants";
import { getRandomIntegerInclusive } from "../../hooks/getRandomNumber";

export function makeNewOrderObject(){
  const customerName = customersNames[Math.floor(Math.random() * customersNames.length)]
  let overallNumber = 0
  const food = {}
  let customerFoodChoiceLength = customers[customerName].food.length
  for(let i = 0; i<customerFoodChoiceLength; i++){
    const addChoice = Math.round(Math.random())
    if(addChoice === 1 || (i === customerFoodChoiceLength-1 && overallNumber === 0)){
      const number = getRandomIntegerInclusive(1, 3)
      overallNumber += number
      food[customers[customerName].food[i]] = number
    }
  }
  const time = 2000 + overallNumber*1500
  const newOrder = {
    customerName,
    food,
    time,
    overallNumber
  }
  return newOrder
}