import React, {useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAppData, setWindowDimensions } from '../../app/store/slices/AppDataSlice'
import { getWindowDimensions } from '../../hooks/getWindowDimensions'
import { getAuthData, tokenQuery } from '../../app/store/slices/AuthSlice'
import AppRouter from '../../app/router/AppRouter'
import { NavbarGlobal } from '../navigation/NavbarGlobal/NavbarGlobal'
import { MessageContainer } from './MessageContainer/MessageContainer'

export function AppContainer({children}) {
  const dispatch = useDispatch()
  const loggedIn = useSelector(state=>state.auth.loggedIn)
  useEffect(()=>{
    dispatch(getAppData())
    dispatch(getAuthData())
    function handleResize() {
      dispatch(setWindowDimensions(getWindowDimensions()))
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [])
  useEffect(()=>{
    // if(loggedIn) dispatch(tokenQuery())
  }, [loggedIn])
  return (
    <div>
      <AppRouter/>
      <NavbarGlobal/>
      <MessageContainer/>
    </div>
  )
}
