import React from 'react'
import { Device } from './components/Device/Device'
import { cooldowns } from './constants'

export function Kitchen({levelId}) {
  return (
    <div className='Kitchen'>
      <div className="TopCountertop"></div>
      <div className="SideCountertop Left">
        <div className="Inner">
          <Device food="drink" cooldown={cooldowns["drink"]} evokerID="DRINKS"/>
        </div>
      </div>
      <div className="SideCountertop Right">
        <div className="Inner">

        </div>
      </div>
    </div>
  )
}
