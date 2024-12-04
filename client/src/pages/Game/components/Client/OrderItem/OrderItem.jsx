import React from 'react'
import "./OrderItem.css"

export function OrderItem({food, number}) {
  return (
    <div className='OrderItem' style={{display:number > 0 ? 'block' : 'none'}}>
      <img src={`/api/image/food/${food}.png`} alt={food.png}/>
      <div className="Number"><p>{number}</p></div>
    </div>
  )
}
