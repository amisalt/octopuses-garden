import React, {useState} from 'react'
import "./AuthPage.css"
import { useDispatch, useSelector } from 'react-redux'
import { logInQuery, logoutQuery } from '../../app/store/slices/AuthSlice'

export function AuthPage() {
  let loggedIn = useSelector(state=>state.auth.loggedIn)
  const [username,  setUsername] = useState('')
  const [password,  setPassword] = useState('')
  const dispatch = useDispatch()
  async function reg(){
    dispatch(logInQuery({username, password}))
  }
  return (
    <div className='page AuthPage'>
      <input value={username}  onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Username"/>
      <input value={password}  onChange={(e) => setPassword(e.target.value)} type="password" placeholder='Password'/>
      <button onClick={reg}>AUUUU</button>
      <h1>{loggedIn}</h1>
      <button onClick={()=>dispatch(logoutQuery())}>logout</button>
    </div>
  )
}
