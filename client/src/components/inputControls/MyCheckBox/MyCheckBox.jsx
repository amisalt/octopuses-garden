import React from 'react'
import "./MyCheckBox.css"

export function MyCheckBox() {
  return (
    <div>
      
    </div>
  )
}

export function MyCheckBoxLabelOnly({label, value, onChange}) {
  const labelShown = value ? label.active : label.inactive
  return (
    <button onClick={onChange} className='MyCheckBoxLO'>{labelShown}</button>
  )
}

