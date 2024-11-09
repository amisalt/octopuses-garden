import React, {useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAppData, setWindowDimensions } from '../../app/store/slices/AppDataSlice'
import { getWindowDimensions } from '../../hooks/getWindowDimensions'
import { getAuthData, tokenQuery } from '../../app/store/slices/AuthSlice'

export function AppContainer({children}) {
  const dispatch = useDispatch()
  const loggedIn = useSelector(state=>state.auth.loggedIn)
  useEffect(()=>{
    console.log(loggedIn);
    dispatch(getAppData())
    dispatch(getAuthData())
    console.log(loggedIn);
    function handleResize() {
      dispatch(setWindowDimensions(getWindowDimensions()))
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [])
  useEffect(()=>{
    if(loggedIn) dispatch(tokenQuery())
  }, [loggedIn])
  return (
    <div className='appContainer'>{children}</div>
  )
}
