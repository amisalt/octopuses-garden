import React from 'react'
import { Device } from './components/Device/Device'

export function Kitchen({levelId, cooldowns, grabItem}) {
  return (
    <div className='Kitchen'>
      <div className="SideCountertop Left">
        <div className="Inner">
          <Device food="drink" grabItem={grabItem} cooldown={cooldowns["drink"]}/>
        </div>
      </div>
      <div className="TopCountertop"></div>
      <div className="SideCountertop Right">
        <div className="Inner">

        </div>
      </div>
    </div>
  )
}
