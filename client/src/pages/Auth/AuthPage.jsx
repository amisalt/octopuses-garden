import React, { useState } from 'react'
import "./AuthPage.css"
import { useDispatch, useSelector } from 'react-redux'
import { logInQuery, logoutQuery, makeAdminQuery, saveAuthData } from '../../app/store/slices/AuthSlice'
import { MyLoader } from '../../components/informationals/Loader/MyLoader'

export function AuthPage() {
  let AuthSliceState = useSelector(state=>state.auth)
  const loading = useSelector(state=>state.auth.loading)
  const [username,  setUsername] = useState('')
  const [password,  setPassword] = useState('')
  const dispatch = useDispatch()
  async function handleLogInQuery(){
    dispatch(logInQuery({username, password}))
    dispatch(saveAuthData())
  }
  return (
  <main className='page'>
    {
    loading ? (
      <MyLoader/>
    ) : (
      <div className='AuthPage'>
        <img src="" alt="logo" className='AuthPage-Logo'/>
        <input value={username}  onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Username"/>
        <input value={password}  onChange={(e) => setPassword(e.target.value)} type="password" placeholder='Password'/>
        <button onClick={handleLogInQuery}>AUUUU</button>
        <button onClick={()=>dispatch(logoutQuery())}>logout</button>
      </div>
    )
    }
    {/* <p style={{position:"fixed", bottom:0, left:0, wordBreak:"break-all"}}>{JSON.stringify(AuthSliceState)}</p> */}
  </main>
  )
}
