import React, { useEffect }  from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { publicRoutes, privateRoutes } from './index'
import { useDispatch, useSelector } from 'react-redux'
import { tokenQuery } from '../store/slices/AuthSlice'
import { getAppData } from '../store/slices/AppDataSlice'

export default function AppRouter() {
  const loggedIn = useSelector(state=>state.auth.loggedIn)
  const dispatch = useDispatch()
  useEffect(()=>{
    dispatch(tokenQuery())
    dispatch(getAppData())
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
