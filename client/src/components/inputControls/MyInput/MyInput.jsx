import React from 'react'
import "./MyInput.css"

export function MyInput({...props}) {
  return (
    <input className='MyInput' {...props}/>
  )
}
