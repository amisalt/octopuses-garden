import React, { useMemo, useState, useRef } from 'react'
import "./AuthPage.css"
import { useDispatch, useSelector } from 'react-redux'
import { logInQuery, registrationQuery } from '../../app/store/slices/AuthSlice'
import { MyProgressLinearInDeterminate } from '../../components/informationals/ProgressBar/MyProgress'
import logo from "../../static/images/logo.png"
import { MyButton } from '../../components/inputControls/MyButton/MyButton'
import { MyInput } from '../../components/inputControls/MyInput/MyInput'
import { MyCheckBoxLabelOnly } from '../../components/inputControls/MyCheckBox/MyCheckBox'
import { createGameQuery } from '../../app/store/slices/GameInfoSlice'

export function AuthPage() {
  const loading = useSelector(state=>state.auth.loading)
  const errors = useSelector(state=>state.auth.errors)
  const message = useSelector(state=>state.auth.message)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [formTypeLogin, setFormTypeLogin] = useState(true)
  const dispatch = useDispatch()
  async function handleLogInQuery(){
    dispatch(logInQuery({username, password}))
  }
  async function handleRegistrationQuery(){
    dispatch(registrationQuery({username, password}))
  }
  function handleOnChangeUsername(value){
    let newValue = ""
    for(let i = 0; i<value.length; i++){
      if(value[i].match(/[0-9a-zA-Z!@#$%^_&*]/gm)) newValue += value[i]
    }
    setUsername(newValue)
  }
  function handleOnChangePassword(value){
    setPassword(value)
  }
  function handleFormTypeChange(){
    setFormTypeLogin(!formTypeLogin)
  }

  const passwordInput = document.getElementById('MyInputPasswordAuthPage')

  function changeFocusUsernamePassword(key){
    if(key === 'Enter' && username){
      passwordInput.focus()
    }
  }

  // TODO make error types in all controllers the same
  // TODO make input error show
  const errorType = useMemo(()=>{
    if(errors){
      if(message !== 'Success' && errors[0].location !== 'server'){
        let path = errors[0].path
        let error = errors[0].msg
        return {path, error}
      }
    }
  }, [errors, message])
  const usernameError = useMemo(()=>{
    if(errorType && (errorType.path === 'username' || errorType.path==='role')){
      return errors[0].msg
    }else{
      return null
    }
  }, [errorType])
  const passwordError = useMemo(()=>{
    if(errorType && errorType.path === 'password'){
      return errors[0].msg
    }else{
      return null
    }
  }, [errorType])

  return (
  <main className='page'>
    <div className='AuthPage'>
      <section>
        <img src={logo} alt="logo" className='AuthPage-Logo'/>
        <h1>Octopuses garden</h1>
      </section> 
      <section>
        <MyInput value={username} onChange={(e)=>handleOnChangeUsername(e.target.value)} id='MyInputUsernameAuthPage' type="text" placeholder="^_^" width="100%" label='Username' name='form' onKeyDown={(e)=>{changeFocusUsernamePassword(e.key)}} error={usernameError}/>
        <MyInput value={password} onChange={(e)=>handleOnChangePassword(e.target.value)} type="password" placeholder="(´･ω･`)?" width="100%" label='Password' id='MyInputPasswordAuthPage' name='form' onKeyDown={(e)=>{
          if(e.key === 'Enter'){
            if(formTypeLogin) handleLogInQuery()
            else handleRegistrationQuery()
          }
        }} error={passwordError}/>
        <MyButton onClick={()=>formTypeLogin ? handleLogInQuery() : handleRegistrationQuery()} width="100%" name='form'>{formTypeLogin ? "Log In" : "Create account"}</MyButton>
        <MyCheckBoxLabelOnly value={formTypeLogin} onChange={handleFormTypeChange} label={{active:"Don't have an account? Create one", inactive:"Already have an account? Log In"}} name='form'/>
      </section>
    </div>
    {loading && <MyProgressLinearInDeterminate width="100dvw"/>}
    {/* <p style={{position:"fixed", bottom:0, left:0, wordBreak:"break-all"}}>{JSON.stringify(AuthSliceState)}</p> */}
  </main>
  )
}
