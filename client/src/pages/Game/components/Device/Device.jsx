import React, { useMemo, useRef, useState } from 'react'
import "./Device.css"
import { MyProgressCircularDeterminate } from '../../../../components/informationals/ProgressBar/MyProgress'
import { Tentacle } from "../Tentacle/Tentacle"
import { useDispatch } from 'react-redux'
import { grabItem } from '../../../../app/store/slices/GamePlayedSlice'

export function Device({food, cooldown, evokerID}) {
  const dispatch = useDispatch()
  const [ready, setReady] = useState(false)
  const [cookingProgress, setCookingProgress] = useState(0)

  function handleOnClick(){
    console.log(cooldown, ready);
    if(ready || cooldown === 0){
      dispatch(grabItem({item:food, evoker:evokerID, item:food}))
      setReady(false)
      setCookingProgress(0)
    }else{
      setCookingProgress(0.1)
      let time = 0
      const deciSeconds = setInterval(timer, 100)
      function timer(){
        time += 100
        setCookingProgress(Math.round(time/cooldown*100))
      }
      setTimeout(()=>{
        clearInterval(deciSeconds)
        setReady(true)
      }, cooldown)
    }
  }

  return (
    <div className='Device' onClick={handleOnClick}>
      <img src={`/api/image/devices/${food}.png`} alt={`${food} device`} className='Main'/>
      { cookingProgress>0 && <div className='Status'>
        { ready ? 
        (<img src={`/api/image/food/${food}.png`} alt={`cooked ${food}`} className='Cooked'/>) : 
        (<MyProgressCircularDeterminate progress={cookingProgress}/>)
        }
      </div>}
      <Tentacle evoker={evokerID}/>
    </div>
  )
}
