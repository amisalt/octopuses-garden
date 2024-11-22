import React from 'react'
import "./MessageContainer.css"
import { useSelector } from 'react-redux'

export function MessageContainer() {
  const authMessage = useSelector(state=>state.auth.message)
  const authErrors = useSelector(state=>state.auth.errors)
  const gameInfoMessage = useSelector(state=>state.gameInfo.message)
  const gameInfoErrors = useSelector(state=>state.gameInfo.errors)
  const gameMessage = useSelector(state=>state.game.message)
  const gameErrors = useSelector(state=>state.game.errors)
  return (
    <div className='MessageContainer'>
      
    </div>
  )
}
