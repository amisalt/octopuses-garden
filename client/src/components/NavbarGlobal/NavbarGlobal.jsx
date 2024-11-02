import React from 'react'
import { useSelector } from 'react-redux'

export function NavbarGlobal() {
  const loggedIn = useSelector(state=>state.auth.loggedIn)
  return (
    <div>
      {JSON.stringify(loggedIn)}
    </div>
  )
}
