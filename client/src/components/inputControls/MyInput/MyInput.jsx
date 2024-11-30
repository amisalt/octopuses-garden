import React, { useState } from 'react'
import "./MyInput.css"
import eyeClosedYellow from "../../../static/images/eyeClosedYellow.svg"
import eyeOpenYellow from "../../../static/images/eyeOpenYellow.svg"

export function MyInput({value, onChange, placeholder, type, width, label, ...props}) {
  const [shownType, setShownType] = useState(type)
  function handleInputTypeChange(){
    if(shownType === 'password') setShownType('text')
    if(shownType === 'text') setShownType('password')
  }
  return (
    <div className='MyInputContainer' style={{width}}>
      <p className='MyInputLabel'>{label}</p>
      <section>
        <input value={value} onChange={onChange} placeholder={placeholder} type={shownType} {...props} className='MyInput' changing={type == 'password' ? 'true' : 'false'}/>
        {type=='password' && 
          (<div onClick={handleInputTypeChange} className='RevealHideButton' style={{backgroundImage:`url(${shownType === 'password' ? "":""})`}}>
            <img src={shownType === 'password' ? eyeClosedYellow : eyeOpenYellow} alt="Peek password"/>
          </div>)}
      </section>
      
    </div>
  )
}

export function MyInputTransparent({value, onChange, placeholder, type, width, label, ...props}){
  return (
    <div className='MyInputContainer Transparent' style={{width}}>
      <p className='MyInputLabel'>{label}</p>
      <section>
        <input value={value} onChange={onChange} placeholder={placeholder} type={type} {...props} className='MyInput' changing={type == 'password' ? 'true' : 'false'}/>
      </section>
    </div>
  )
}
