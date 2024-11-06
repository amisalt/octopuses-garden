import React, { useEffect }  from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { publicRoutes, privateRoutes } from './index'
import { useDispatch, useSelector } from 'react-redux'
import { placeholderQuey, tokenQuery } from '../store/slices/AuthSlice'
import { getAppData, setWindowDimensions } from '../store/slices/AppDataSlice'
import { getWindowDimensions } from '../../hooks/getWindowDimensions'

export default function AppRouter() {
  const loggedIn = useSelector(state=>state.auth.loggedIn)
  const dispatch = useDispatch()
  useEffect(()=>{
    function handleResize() {
      dispatch(setWindowDimensions(getWindowDimensions()))
    }
    window.addEventListener('resize', handleResize);
    dispatch(tokenQuery())
    dispatch(getAppData())
    return () => window.removeEventListener('resize', handleResize);
  }, [])
  if(loggedIn){
    return (
      <Routes>
        {privateRoutes.map(route=>(<Route key={route.path} {...route} element={<route.element/>}/>))}
        <Route path='*' element={<Navigate to='/'/>}/>
      </Routes>
    )
  }else{
    return (
      <Routes>
        {publicRoutes.map(route=>(<Route key={route.path} {...route} element={<route.element/>}/>))}
        <Route path='*' element={<Navigate to='/auth'/>}/>
      </Routes>
    )
  }
}
