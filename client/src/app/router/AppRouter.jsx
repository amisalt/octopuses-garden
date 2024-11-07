import React, { useEffect }  from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { publicRoutes, privateRoutes } from './index'
import { useSelector } from 'react-redux'

export default function AppRouter() {
  const loggedIn = useSelector(state=>state.auth.loggedIn)
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
