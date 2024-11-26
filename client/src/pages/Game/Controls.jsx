import React from 'react'
import { TentacleControls } from './components/TentacleControls/TentacleControls'

export function Controls({leveId}) {
  return (
    <div className='Controls'>
      <TentacleControls index={0}/>
      <TentacleControls index={1}/>
      <TentacleControls index={2}/>
      <TentacleControls index={3}/>
    </div>
  )
}
