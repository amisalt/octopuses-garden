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
      <img src="https://i.pinimg.com/236x/6b/f9/29/6bf929e0f930e149802a88cebfd58f29.jpg" alt={`${route.desc} icon`}/>
      <span>{route.desc}</span>
    </NavLink>
  )
}
