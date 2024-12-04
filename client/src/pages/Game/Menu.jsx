import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { MyButtonGame } from '../../components/inputControls/MyButton/MyButton'
import { SettingsModal } from './components/SettingsModal/SettingsModal'
import menu from "../../static/images/menu.svg"
import coin from "../../static/images/coinYellow.svg"
import star from "../../static/images/starYellow.svg"

export function Menu({modal, showModal, hideModal}) {
  const money = useSelector(state=>state.game.money)
  const xp = useSelector(state=>state.game.xp)
  const moneyDisplay = useMemo(()=>{
    if(money < 1000) return money
    return Math.floor(money/1000) + "k"
  }, [money])
  const xpDisplay = useMemo(()=>{
    if(xp < 1000) return xp
    return Math.floor(xp/1000) + "k"
  })
  return (
    <div className='Menu'>
      <MyButtonGame width='5dvh' onClick={showModal}><img src={menu} alt='menu img'/></MyButtonGame>
      <section className='Stats'>
        <section className='StatsDisplay'>
          <p>{xpDisplay}</p>
          <img src={star} alt='coin img' className='StatsImg'/>
        </section>
        <section className='StatsDisplay'>
          <p>{moneyDisplay}</p>
          <img src={coin} alt='coin img' className='StatsImg'/>
        </section>
      </section>
      
      <SettingsModal show={modal} hideModal={hideModal}/>
    </div>
  )
}
