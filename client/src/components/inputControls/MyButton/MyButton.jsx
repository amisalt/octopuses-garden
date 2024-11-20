import React from 'react'
import "./MyButton.css"

export function MyButton({onClick, width, children}) {
  return (
    <button style={{width}} className='MyButton' onClick={onClick}>{children}</button>
  )
}
