import React, {useEffect} from 'react'
import { useDispatch } from 'react-redux'
import { getAppData, setWindowDimensions } from '../../app/store/slices/AppDataSlice'
import { getWindowDimensions } from '../../hooks/getWindowDimensions'
import { tokenQuery } from '../../app/store/slices/AuthSlice'

export function AppContainer({children}) {
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
  return (
    <div>{children}</div>
  )
}
