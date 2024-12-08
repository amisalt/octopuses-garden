import React from 'react'
import { TentacleControls } from './components/TentacleControls/TentacleControls'

export function Controls({levelId}) {
  return (
    <div className='Controls' style={{backgroundImage:`url(/api/image/levels/${levelId}/top.png)`}}>
      <TentacleControls index={0}/>
      <TentacleControls index={1}/>
      <TentacleControls index={2}/>
      <TentacleControls index={3}/>
    </div>
  )
}
