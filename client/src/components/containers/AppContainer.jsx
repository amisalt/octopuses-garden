import React, {useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAppData, setGameState, setWindowDimensions } from '../../app/store/slices/AppDataSlice'
import { getWindowDimensions } from '../../hooks/getWindowDimensions'
import { getAuthData, tokenQuery } from '../../app/store/slices/AuthSlice'
import AppRouter from '../../app/router/AppRouter'
import { NavbarGlobal } from '../navigation/NavbarGlobal/NavbarGlobal'
import { MessageContainer } from './MessageContainer/MessageContainer'
import { useLocation } from 'react-router-dom'
import { removeGameDataHook } from '../../hooks/getDataHooks'

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
    if(loggedIn){
      setInterval(()=>{
        dispatch(tokenQuery())
      }, 60*1000)
    }
  }, [loggedIn])
  const route = useLocation()
  useEffect(()=>{
    if(!route.pathname.includes('/level')){
      console.log("REMOVE GAME DATA")
      removeGameDataHook()
      dispatch(setGameState(false))
    }else{
      dispatch(setGameState(true))
    }
  }, [route])
  return (
    <div>
      <AppRouter/>
      <NavbarGlobal/>
      <MessageContainer/>
    </div>
  )
}
