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
  const isThereFreeIndex = useSelector(state=>{
    return 1 in state.game.freeIndexes
  })
  const cookingTime = cooldown*(upgrades?.cooldown?.upgrade ?? 1)
  
  const [time, setTime] = useState(0)
  const [startCookingSignal, setStartCookingSignal] = useState(false)
  const [cookingInterval, setCookingInterval] = useState(null)
  const [fireInterval, setFireInterval] = useState(null)
  const [fireTime, setFireTime] = useState(0)
  const [startFireSignal, setStartFireSignal] = useState(false)
  const [fireTimeout, setFireTimoeout] = useState(null)
  
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
        console.log(isThereFreeIndex)
        if((food === 'bun' || food === 'meatC') && isThereFreeIndex){
          dispatch(grabItem({item:'burger', evoker:evokerID}))
          setReady(false)
          setCookingProgress(0)
          setTime(0)
          setFireTime(0)
          setStartFireSignal(false)
          clearInterval(fireInterval)
          clearTimeout(fireTimeout)
        }
        else if(isThereFreeIndex){ 
          dispatch(grabItem({item:food, evoker:evokerID}))
          setReady(false)
          setCookingProgress(0)
          setTime(0)
          setFireTime(0)
          setStartFireSignal(false)
          clearInterval(fireInterval)
          clearTimeout(fireTimeout)
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
        setReady(true)
        setStartCookingSignal(false)
        clearInterval(cookingInterval)
      }
    }
  }, [time, pause])
  // ! - - - -- - - - - - - - - -- - - FireTimer- - - - - - -- 
  useEffect(()=>{
    if(['meatC', 'fries'].includes(food)){
      if(ready) setFireTimoeout(setTimeout(()=>setStartFireSignal(true), 2000))
      else clearInterval(fireInterval)
    }else{
      setStartFireSignal(false)
    }
  }, [ready])
  useEffect(()=>{
    if(startFireSignal && !pause){
      setFireInterval(setInterval(() => {
        setFireTime((prev)=>prev+100)
      }, 100))
    }else{
      clearInterval(fireInterval)
    }
  }, [startFireSignal, pause])
  useEffect(()=>{
    if(!pause  && startFireSignal){
      if(fireTime > 5000){
        setReady(false)
        setFireTime(0)
        setCookingProgress(0)
        setTime(0)
        setStartFireSignal(false)
        clearInterval(fireInterval)
      }
    }
  }, [fireTime, pause])

  return (
    <div className='Device' onClick={handleOnClick} food={food}>
      <img src={`/api/image/devices/${food}.png`} alt={`${food} device`} className='Main'/>
      { cookingProgress>0 && <div className='Status'>
        { ready ? 
        (<div style={{backgroundImage:`url(/api/image/food/${food}.png)`}} className='Cooked'></div>) : 
        (<MyProgressCircularDeterminate progress={cookingProgress}/>)
        }
        <div className="FireHazard" style={{opacity:fireTime/5000}}></div>
      </div>}
      <Tentacle evoker={evokerID} communicateDevice={setHoldItem}/>
    </div>
  )
}
