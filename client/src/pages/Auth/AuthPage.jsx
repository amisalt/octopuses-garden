import React, {useState} from 'react'
import "./AuthPage.css"
import { useDispatch, useSelector } from 'react-redux'
import { logInQuery, logoutQuery, makeAdminQuery } from '../../app/store/slices/AuthSlice'
import { MyLoader } from '../../components/informationals/Loader/MyLoader'

export function AuthPage() {
  let AuthSliceState = useSelector(state=>state.auth)
  const loading = useSelector(state=>state.auth.loading)
  const [username,  setUsername] = useState('')
  const [password,  setPassword] = useState('')
  const dispatch = useDispatch()
  async function reg(){
    dispatch(logInQuery({username, password}))
  }
  return (
  <div className='page AuthPage'>
    {
    loading ? (
      <MyLoader/>
    ) : (
      <div className='AuthPageContent'>
        <input value={username}  onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Username"/>
        <input value={password}  onChange={(e) => setPassword(e.target.value)} type="password" placeholder='Password'/>
        <button onClick={reg}>AUUUU</button>
        <button onClick={()=>dispatch(logoutQuery())}>logout</button>
      </div>
    )
    }
    <p style={{position:"fixed", bottom:0, left:0, wordBreak:"break-all"}}>{JSON.stringify(AuthSliceState)}</p>
  </div>
  )
}
