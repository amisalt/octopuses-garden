import React, { useMemo, useRef, useState } from 'react'
import "./Device.css"
import { MyProgressCircularDeterminate } from '../../../../components/informationals/ProgressBar/MyProgress'

export function Device({food, grabItem, cooldown}) {
  const [ready, setReady] = useState(false)
  const [cookingProgress, setCookingProgress] = useState(0)
  const deviceBox = useRef(null)
  const position = useMemo(()=>{
    if(deviceBox.current){
      const rect = deviceBox.current.getBoundingClientRect()
      return [rect.x, rect.y]
    }
    return [0,0]
  }, [deviceBox])
  function handleOnClick(){
    console.log(cooldown, ready);
    if(ready || cooldown === 0){
      grabItem(food, position)
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
    <div className='Device' ref={deviceBox} onClick={handleOnClick}>
      <img src={`/api/image/devices/${food}.png`} alt={`${food} device`} className='Main'/>
      { cookingProgress>0 && <div className='Status'>
        { ready ? (<img src={`/api/image/food/${food}.png`} alt={`cooked ${food}`} className='Cooked'/>) : (<MyProgressCircularDeterminate progress={cookingProgress}/>)}
      </div>}
    </div>
  )
}
