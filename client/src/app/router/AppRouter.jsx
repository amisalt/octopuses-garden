import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { privateRoutes, publicRoutes } from './index'
import { useSelector } from 'react-redux'

export default function AppRouter() {
  const loggedIn = useSelector(state=>state.auth.loggedIn)
  return (
    <Routes>
      {loggedIn ? privateRoutes.map(route=>(<Route key={route.path} {...route} element={<route.element/>}/>)) : publicRoutes.map(route=>(<Route key={route.path} {...route} element={<route.element/>}/>))}
      <Route path='*' element={<Navigate to='/'/>}/>
    </Routes>
  )
}
