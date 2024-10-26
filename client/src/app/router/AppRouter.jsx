import React, { useEffect }  from 'react'
import {Route, Routes, Navigate} from 'react-router-dom'
import {publicRoutes } from './index'
import { useDispatch } from 'react-redux'
import { tokenQuery } from '../store/slices/AuthSlice'

export default function AppRouter() {
  const dispatch = useDispatch()
  useEffect(()=>{
    dispatch(tokenQuery())
  }, [])
  return (
    <Routes>
      {publicRoutes.map(route=>(<Route key={route.path} {...route} element={<route.element/>}/>))}
      <Route path='*' element={<Navigate to='/auth'/>}/>
    </Routes>
  )
}
