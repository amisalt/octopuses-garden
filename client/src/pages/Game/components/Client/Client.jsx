import React, { useEffect, useState } from 'react'
import "./Client.css"
import { sizes } from '../../constants'
import { OrderItem } from './OrderItem/OrderItem'
import { useDispatch, useSelector } from 'react-redux'
import { removeOrder, updateOrder } from '../../../../app/store/slices/GamePlayedSlice'
import { Tentacle } from '../Tentacle/Tentacle'
import { MyProgressCircularDeterminate } from '../../../../components/informationals/ProgressBar/MyProgress'

export function Client({order, index}) {
  const dispatch = useDispatch()
  const ordersDisplay = Array.from(Object.entries(order.food))
  const height = sizes[order.customerName].height
  const upgrades = useSelector(state=>state.gameInfo.stats.upgrades['client'])

  const [holdItemNow, setHoldItem] = useState(null)
  const pause = useSelector(state=>state.game.pause)
  const [waitingProcess, setWaitingProcess] = useState(0)
  const waitingTime = order.time*(upgrades?.cooldown?.upgrade ?? 1)
  const action = useSelector(state=>state.game.action.type)
  const [time, setTime] = useState(
    localStorage.getItem('currentWaitingTime') ?
      JSON.parse(localStorage.getItem('currentWaitingTime')).id === order.id ? 
      JSON.parse(localStorage.getItem('currentWaitingTime')).time :
      waitingTime : waitingTime
  )
  const [deciSecondSignal, setDeciSecondsSignal] = useState(0)
  const [waitingInterval, setWaitingInterval] = useState(null)

  const [animation ,setAnimation] = useState('')
  const [removeDoneFlag, setRemoveDoneFlag] = useState(false)

  useEffect(()=>{
    if(index === 0 && !pause){
      if(time === waitingTime){
        setAnimation('1s ease-in 0s 1 forwards clientCome')
      }
      setWaitingInterval(setInterval(()=>{
        setTime((prev)=>prev-100)
      },100))
    }else{
      clearInterval(waitingInterval)
    }
    function clearIntervals(){
      clearInterval(waitingInterval)
    }
    return clearIntervals
  }, [index, pause])
  // ! - -  - -- - - - - - - - - - - TIMER -- - - - - - - - -- - - - 
  useEffect(()=>{
    if(index === 0 && !pause){
      setWaitingProcess(Math.round(time/waitingTime*100))
      localStorage.setItem('currentWaitingTime', JSON.stringify({time, id: order.id}))
      if(time < 0 && !removeDoneFlag){
        setAnimation('1s ease-out 1s 1 forwards clientLeave')
        setTimeout(()=>{
          dispatch(removeOrder({id:order.id}))
        }, 2000)
        setRemoveDoneFlag(true)
        clearInterval(waitingInterval)
      }
    }
  }, [time, pause, index])

  function handleOnClick(){
    if(!action){
      if(order.foodNames.includes(holdItemNow)){
        if(order.overallNumber == 1){
          setAnimation('1s ease-out 1s 1 forwards clientLeave')
          setTimeout(()=>{
            dispatch(removeOrder({id:order.id}))
          }, 2000)
        }
        dispatch(updateOrder({time:JSON.parse(localStorage.getItem('currentWaitingTime')), item:holdItemNow, evoker:order.id}))
      }else{
        setTime(time - 500)
        localStorage.setItem('currentWaitingTime', JSON.stringify({time, id: order.id}))
      }
    }
  }

  return (
    <div className='Client' style={{left:sizes[order.customerName].left, animation:animation}} onClick={handleOnClick} id='Client'>
      <img src={`/api/image/customers/${order.customerName}.png`} alt={order.customerName} style={{height:sizes[order.customerName].height}}/>
      <div className="OrderTime">
        <MyProgressCircularDeterminate progress={waitingProcess}/>
      </div>
      <div className="OrderInfo">
        {ordersDisplay.map(([food, number], index)=><OrderItem key={index} food={food} number={number} />)}
      </div>
      <Tentacle evoker={order.id} communicateDevice={setHoldItem}/>
    </div>
  )
}
