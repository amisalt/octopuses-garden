import React from 'react'
import { Device } from './components/Device/Device'
import { cooldowns } from './constants'

export function Kitchen({levelId}) {
  return (
    <div className='Kitchen'>
      <div className="TopCountertop" style={{backgroundImage:`url(/api/image/levels/${levelId}/top.png)`}}></div>
      <div className="SideCountertop Left" style={{backgroundImage:`url(/api/image/levels/${levelId}/leftAngle.png)`}}>
        <div className="Inner" style={{backgroundImage:`url(/api/image/levels/${levelId}/side.png)`}}>
          <Device food='salad' cooldown={cooldowns['salad']} evokerID='SALADS'/>
          <Device food='bun' cooldown={cooldowns['bun']} evokerID='BUNS'/>
          <Device food='meatC' cooldown={cooldowns['meatC']} evokerID='MEATCS1'/>
          <Device food='meatC' cooldown={cooldowns['meatC']} evokerID='MEATCS2'/>
        </div>
      </div>
      <div className="SideCountertop Right" style={{backgroundImage:`url(/api/image/levels/${levelId}/rightAngle.png)`}}>
        <div className="Inner" style={{backgroundImage:`url(/api/image/levels/${levelId}/side.png)`}}>
          <Device food='meat' cooldown={cooldowns['meat']} evokerID='MEATS'/>
          <Device food='fries' cooldown={cooldowns['fries']} evokerID='FRIESS1'/>
          <Device food='fries' cooldown={cooldowns['fries']} evokerID='FRIESS2'/>
          <Device food="drink" cooldown={cooldowns["drink"]} evokerID="DRINKS"/>
        </div>
      </div>
    </div>
  )
}
