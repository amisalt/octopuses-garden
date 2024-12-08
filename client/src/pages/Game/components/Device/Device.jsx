import React, { useEffect, useMemo, useRef, useState } from 'react'
import "./Device.css"
import { MyProgressCircularDeterminate } from '../../../../components/informationals/ProgressBar/MyProgress'
import { Tentacle } from "../Tentacle/Tentacle"
import { useDispatch, useSelector } from 'react-redux'
import { giveItem, grabItem } from '../../../../app/store/slices/GamePlayedSlice'

export function Device({food, cooldown, evokerID}) {
  const dispatch = useDispatch()
  const [ready, setReady] = useState(false)
  const [cookingProgress, setCookingProgress] = useState(0)
  const upgrades = useSelector(state=>state.gameInfo.stats.upgrades[food])
  const action = useSelector(state=>state.game.action.type)
  const pause = useSelector(state=>state.game.pause)

  const cookingTime = cooldown*(upgrades?.cooldown?.upgrade ?? 1)
  
  const [time, setTime] = useState(0)
  const [startCookingSignal, setStartCookingSignal] = useState(false)
  const [cookingInterval, setCookingInterval] = useState(null)
  const [fireInterval, setFireInterval] = useState(null)
  const [fireTime, setFireTime] = useState(5000)
  
  const [holdItemNow, setHoldItem] = useState(null)

  function handleOnClick(){
    if(!action){
      if(!startCookingSignal && cooldown != 0 && !ready){
        if(food === 'meatC'){
          if(holdItemNow === 'meat'){
            dispatch(giveItem({evoker:evokerID, item:'meat'}))
            setStartCookingSignal(true)
          }
        }else{
          setStartCookingSignal(true)
        }
      }else if(ready || cooldown === 0){
        if(food === 'bun' && holdItemNow === 'meatC'){
          dispatch(grabItem({item:'burger', evoker:evokerID}))
          setReady(false)
          setCookingProgress(0)
          setTime(0)
        }
        else if(!holdItemNow){
          dispatch(grabItem({item:food, evoker:evokerID}))
          setReady(false)
          setCookingProgress(0)
          setTime(0)
        }
      }
    }
  }
  // ! - -  - -- - - - - - - - - - - TIMER -- - - - - - - - -- - - - 
  useEffect(()=>{
    if(startCookingSignal && !pause){
      setCookingInterval(setInterval(() => {
        setTime((prev)=>prev+100)
      }, 100))
    }else{
      clearInterval(cookingInterval)
    }
  }, [startCookingSignal, pause])
  useEffect(()=>{
    if(!pause  && startCookingSignal){
      setCookingProgress(Math.round(time/cookingTime*100))
      if(time > cookingTime){
        console.log('Time excession')
        setReady(true)
        setStartCookingSignal(false)
        clearInterval(cookingInterval)
      }
    }
  }, [time, pause])

  return (
    <div className='Device' onClick={handleOnClick} food={food}>
      <img src={`/api/image/devices/${food}.png`} alt={`${food} device`} className='Main'/>
      { cookingProgress>0 && <div className='Status'>
        { ready ? 
        (<div style={{backgroundImage:`url(/api/image/food/${food}.png)`}} className='Cooked'></div>) : 
        (<MyProgressCircularDeterminate progress={cookingProgress}/>)
        }
      </div>}
      <Tentacle evoker={evokerID} communicateDevice={setHoldItem}/>
    </div>
  )
}
