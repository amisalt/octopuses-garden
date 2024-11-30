import React from 'react'
import "./MyButton.css"

export function MyButton({onClick, width, children, ...props}) {
  return (
    <button style={{width}} {...props} className='MyButton' onClick={onClick}>{children}</button>
  )
}

export function MyButtonViolet({onClick, width, children, ...props}) {
  return (
    <button style={{width}} {...props} className='MyButton Violet' onClick={onClick}>{children}</button>
  )
}

export function MyButtonGame({onClick, width, children, ...props}) {
  return (
    <button style={{width}} {...props} className='MyButton Game' onClick={onClick}>{children}</button>
  )
}