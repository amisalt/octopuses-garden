import React from 'react'
import { useSelector } from 'react-redux'
import { MyButtonGame } from '../../components/inputControls/MyButton/MyButton'
import { SettingsModal } from './components/SettingsModal/SettingsModal'
import menu from "../../static/images/menu.svg"
import coin from "../../static/images/coinYellow.svg"

export function Menu({modal, showModal, hideModal}) {
  const money = useSelector(state=>state.game.money)

  return (
    <div className='Menu'>
      <MyButtonGame width='5dvh' onClick={showModal}><img src={menu} alt='menu img'/></MyButtonGame>
      <section className='MoneyDisplay'>
        <p>{money}</p>
        <img src={coin} alt='coin img' className='CoinImg'/>
      </section>
      <SettingsModal show={modal} hideModal={hideModal}/>
    </div>
  )
}
