import React from 'react'
import { NavLink } from 'react-router-dom'
import "./MyNavLink.css"

export function MyNavLink({route}) {
  return (
    <NavLink to={route.path} className={({ isActive }) =>
      [
        isActive ? "MyNavLinkActive" : "",
        "MyNavLink"
      ].join(" ")
    }>
      {/* <img src={route.icon} alt={`${route.desc} icon`}/> */}
      <img src={route.icon} alt={`${route.desc} icon`}/>
      <span>{route.desc}</span>
    </NavLink>
  )
}
