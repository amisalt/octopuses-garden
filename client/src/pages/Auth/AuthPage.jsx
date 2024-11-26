import React, { useMemo, useState } from 'react'
import "./AuthPage.css"
import { useDispatch, useSelector } from 'react-redux'
import { logInQuery, registrationQuery } from '../../app/store/slices/AuthSlice'
import { MyProgressLinearInDeterminate } from '../../components/informationals/ProgressBar/MyProgress'
import logo from "../../static/images/logo.png"
import { MyButton } from '../../components/inputControls/MyButton/MyButton'
import { MyInput } from '../../components/inputControls/MyInput/MyInput'
import { MyCheckBoxLabelOnly } from '../../components/inputControls/MyCheckBox/MyCheckBox'

export function AuthPage() {
  const loading = useSelector(state=>state.auth.loading)
  const error = useSelector(state=>state.auth.error)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [formTypeLogin, setFormTypeLogin] = useState(true)
  const dispatch = useDispatch()
  async function handleLogInQuery(){
    dispatch(logInQuery({username, password}))
  }
  async function handleRegistrationQuery(){
    dispatch(registrationQuery({username, password}))
    dispatch(logInQuery({username, password}))
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
  // TODO make error types in all controllers the same
  const errorType = useMemo(()=>{
    // return [error.message]
  }, [error])
  return (
  <main className='page'>
    <div className='AuthPage'>
      <section>
        <img src={logo} alt="logo" className='AuthPage-Logo'/>
        <h1>Octopuses garden</h1>
      </section> 
      <section>
        <MyInput value={username} onChange={(e)=>handleOnChangeUsername(e.target.value)} type="text" placeholder="Username" width="100%"/>
        <MyInput value={password} onChange={(e)=>handleOnChangePassword(e.target.value)} type="password" placeholder="Password" width="100%"/>
        <MyButton onClick={()=>formTypeLogin ? handleLogInQuery() : handleRegistrationQuery()} width="100%">{formTypeLogin ? "Log In" : "Create account"}</MyButton>
        <MyCheckBoxLabelOnly value={formTypeLogin} onChange={handleFormTypeChange} label={{active:"Don't have an account? Create one", inactive:"Already have an account? Log In"}}/>
      </section>
    </div>
    {loading && <MyProgressLinearInDeterminate width="100dvw"/>}
    {/* <p style={{position:"fixed", bottom:0, left:0, wordBreak:"break-all"}}>{JSON.stringify(AuthSliceState)}</p> */}
  </main>
  )
}
