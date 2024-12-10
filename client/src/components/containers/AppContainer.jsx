import React, {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAppData, setGameState, setWindowDimensions } from '../../app/store/slices/AppDataSlice'
import { getWindowDimensions } from '../../hooks/getWindowDimensions'
import { getAuthData, tokenQuery } from '../../app/store/slices/AuthSlice'
import AppRouter from '../../app/router/AppRouter'
import { NavbarGlobal } from '../navigation/NavbarGlobal/NavbarGlobal'
import { MessageContainer } from './MessageContainer/MessageContainer'
import { useLocation, useNavigate } from 'react-router-dom'
import { removeGameDataHook } from '../../hooks/getDataHooks'
import { reset } from '../../app/store/slices/GamePlayedSlice'

export function AppContainer({children}) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const loggedIn = useSelector(state=>state.auth.loggedIn)
  const [tokenInterval, setTokenInterval] = useState(null)
  useEffect(()=>{
    dispatch(getAppData())
    dispatch(getAuthData())
    function handleResize() {
      dispatch(setWindowDimensions(getWindowDimensions()))
    }
    window.addEventListener('resize', handleResize);
    dispatch(tokenQuery())
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
  const gameToken = useSelector(state=>state.game.gameToken)
  const messageGame = useSelector(state=>state.game.message)
  const loadingGame = useSelector(state=>state.game.loading)
  useEffect(()=>{
    if(!route.pathname.includes('/level')){
      removeGameDataHook()
      dispatch(setGameState(false))
      dispatch(reset())
    }else{
      if(gameToken){
        dispatch(setGameState(true))
      }
      else {
        if(messageGame !== 'Success' && !loadingGame) navigate('/')
        else if(messageGame === 'Success' && !loadingGame) dispatch(setGameState(true))
      }
    }
  }, [route, gameToken])
  return (
    <div onDragStart={(e)=>e.preventDefault()}>
      <AppRouter/>
      <NavbarGlobal/>
      <MessageContainer/>
    </div>
  )
}
