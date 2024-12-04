import React from 'react'
import "./Icon.css"

export function Icon({customerName, index}) {
  return (
    <div className="Icon">
      <img style={{display:`${index > 0 ? 'block' : 'none'}`}} src={`/api/image/customers/${customerName}.png`}/>
      <div className="Highlight"></div>
    </div>
  )
}
