import React from 'react'
import { privateRoutes, publicRoutes } from '../../../app/router'
import { useSelector } from 'react-redux'
import { MyNavLink } from '../MyNavLink/MyNavLink'
import "./NavbarGlobal.css"

export function NavbarGlobal() {
  const loggedIn = useSelector(state=>state.auth.loggedIn)
  const gameState = useSelector(state=>state.appData.gameState)
  return (
    <div className='NavbarGlobal' style={{display:gameState ? "none" : "flex"}}>
      {loggedIn ? privateRoutes.map(route=>{
        if(!route.path.includes("/level")) return (<MyNavLink key={route.path} route={route}/>)}
      ) : publicRoutes.map(route=>{
        if(!route.path.includes("/level")) return (<MyNavLink key={route.path} route={route}/>)}
      )}
    </div>
  )
}
