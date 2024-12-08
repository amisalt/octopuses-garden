import React from 'react'
import "./OrderItem.css"

export function OrderItem({food, number}) {
  return (
    <div className='OrderItem' style={{display:number > 0 ? 'block' : 'none'}}>
      <div style={{backgroundImage:`url(/api/image/food/${food}.png)`}} className='Image'></div>
      <div className="Number"><p>{number}</p></div>
    </div>
  )
}
