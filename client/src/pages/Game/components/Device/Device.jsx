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
  const [deciSecondSignal, setDeciSecondsSignal] = useState(0)
  const [startCookingSignal, setStartCookingSignal] = useState(false)
  
  const [holdItemNow, setHoldItem] = useState(null)

  function handleOnClick(){
    console.log(cooldown, ready, cookingTime, holdItemNow);
    if(!action){
      if(ready || cooldown === 0){
        if(food === 'bun' && holdItemNow === 'meatC'){
          dispatch(grabItem({item:'burger', evoker:evokerID}))
          setReady(false)
          setCookingProgress(0)
        }
        else if(!holdItemNow){
          dispatch(grabItem({item:food, evoker:evokerID}))
          setReady(false)
          setCookingProgress(0)
        }
      }else if(!startCookingSignal && cooldown != 0){
        if(food === 'meatC'){
          if(holdItemNow === 'meat'){
            dispatch(giveItem({evoker:evokerID, item:'meat'}))
            setStartCookingSignal(true)
          }
        }else{
          setStartCookingSignal(true)
        }
        // setTimeout(()=>{
        //   clearInterval(deciSeconds)
        //   setReady(true)
        // }, cookingTime)
      }
    }
  }
  // ! - -  - -- - - - - - - - - - - TIMER -- - - - - - - - -- - - - 
  useEffect(()=>{
    const deciSeconds = setInterval(timer, 100)
    function timer(){
      if(startCookingSignal){
        setDeciSecondsSignal(Date.now())
      }else{
        clearInterval(deciSeconds)
      }
    }
  }, [startCookingSignal])
  useEffect(()=>{
    if(!pause){
      setTime(time + 100)
      setCookingProgress(Math.round(time/cookingTime*100))
      if(time === cookingTime){
        setReady(true)
        setStartCookingSignal(false)
      }
    }
  }, [deciSecondSignal])

  return (
    <div className='Device' onClick={handleOnClick}>
      <img src={`/api/image/devices/${food}.png`} alt={`${food} device`} className='Main'/>
      { cookingProgress>0 && <div className='Status'>
        { ready ? 
        (<img src={`/api/image/food/${food}.png`} alt={`cooked ${food}`} className='Cooked'/>) : 
        (<MyProgressCircularDeterminate progress={cookingProgress}/>)
        }
      </div>}
      <Tentacle evoker={evokerID} communicateDevice={setHoldItem}/>
    </div>
  )
}
