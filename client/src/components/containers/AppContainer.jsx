import React, {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAppData, setGameState, setWindowDimensions } from '../../app/store/slices/AppDataSlice'
import { getWindowDimensions } from '../../hooks/getWindowDimensions'
import { getAuthData, tokenQuery } from '../../app/store/slices/AuthSlice'
import AppRouter from '../../app/router/AppRouter'
import { NavbarGlobal } from '../navigation/NavbarGlobal/NavbarGlobal'
import { MessageContainer } from './MessageContainer/MessageContainer'
import { useLocation } from 'react-router-dom'
import { removeGameDataHook } from '../../hooks/getDataHooks'
import { reset } from '../../app/store/slices/GamePlayedSlice'

export function AppContainer({children}) {
  const dispatch = useDispatch()
  const loggedIn = useSelector(state=>state.auth.loggedIn)
  const [tokenInterval, setTokenInterval] = useState(null)
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
      setTokenInterval(setInterval(()=>{
        dispatch(tokenQuery())
      }, 60*1000))
    }else{
      clearInterval(tokenInterval)
    }
  }, [loggedIn])
  const route = useLocation()
  useEffect(()=>{
    if(!route.pathname.includes('/level')){
      console.log("REMOVE GAME DATA")
      removeGameDataHook()
      dispatch(setGameState(false))
      dispatch(reset())
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
