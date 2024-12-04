import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { statsQuery } from '../../app/store/slices/GameInfoSlice'
import logo from "../../static/images/logo.png"
import coin from "../../static/images/coinYellow.svg"
import star from "../../static/images/starYellow.svg"
import "./AccountPage.css"

export function AccountPage() {
  const dispatch = useDispatch()
  const user = useSelector(state=>state.auth.user)
  const stats = useSelector(state=>state.gameInfo.stats)
  const moneyDisplay = useMemo(()=>{
    if(stats.money < 1000) return stats.money
    return Math.floor(stats.money/1000) + "k"
  }, [stats.money])
  const xpDisplay = useMemo(()=>{
    if(stats.xp < 1000) return stats.xp
    return Math.floor(stats.xp/1000) + "k"
  }, [stats.xp])
  useEffect(()=>{
    dispatch(statsQuery())
  }, [])
  return (
    <main className='page'>
      <div className="AccountPage">
        <section className="Name">
          <img src={logo} alt='pfp' className='PFP'/>
          <h1 className='Username'>{user.username}</h1>
        </section>
        <section className="Stats">
          <section className='StatsDisplay'>
            <p>{xpDisplay}</p>
            <img src={star} alt='star img' className='StatsImg'/>
          </section>
          <section className='StatsDisplay'>
            <p>{moneyDisplay}</p>
            <img src={coin} alt='coin img' className='StatsImg'/>
          </section>
        </section>
        <section className="Friends">
          <h2>Friends</h2>
          <p>Coming soon...</p>
        </section>
      </div>
    </main>
  )
}
