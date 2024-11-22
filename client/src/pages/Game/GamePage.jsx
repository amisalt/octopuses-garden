import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import "./GamePage.css"
import { Clients } from './Clients'
import { Kitchen } from './Kitchen'
import { Controls } from './Controls'
import { MyProgressLinearInDeterminate } from '../../components/informationals/ProgressBar/MyProgress'
import { MyLoader } from '../../components/informationals/Loader/MyLoader'

import { setGameState } from '../../app/store/slices/AppDataSlice'
import { customers, cooldowns } from './constants'
import { makeNewOrderObject } from './utils'

export function GamePage() {
  const dispatch = useDispatch()
  dispatch(setGameState(true))
  // * - - - - - - - - - - - - - - - - LOADING STATE FOR QUERYS - - - - - - - - - - - - - - - -
  const loading = useSelector(state=>state.game.loading)
  // const {width, height} = useSelector(state=>state.appData.windowDimensions)
  // * - - - - - - - - - - - - - - - - GETTING LEVEL DETAILS - - - - - - - - - - - - - - - -
  const levels = useSelector(state=>state.gameInfo.levels.availableLevels)
  const {levelId} = useParams()
  const {priceBonus, xpBonus} = useMemo(()=>{
    if(localStorage.getItem('bonus')) return JSON.parse(localStorage.getItem('bonus'))
    const level = levels.find(level=>level.id === levelId)
    localStorage.setItem('bonus', JSON.stringify({priceBonus: level.priceBonus, xpBonus: level.xpBonus}))
    return level
  }, []) 
  // * - - - - - - - - - - - - - - - - ORDERS - - - - - - - - - - - - - - - -
  const [orders, setOrders] = useState([])
  function makeNewOrder(){
    const newOrder = makeNewOrderObject()
    setOrders([...orders, newOrder])
  }
  function updateOrder(orderIndex, food){
    const newOrders = [...orders]
    newOrders[orderIndex].food[food] -= 1
    newOrders[orderIndex].overallNumber -= 1
    if(newOrders[orderIndex].overallNumber === 0) newOrders.splice(orderIndex, 1)
    setOrders(newOrders)
  }
  // * - - - - - - - - - - - - - - - - TENTACLES - - - - - - - - - - - - - - - -
  const [tentacles, setTentacles] = useState({
    pink:{
      unlocked:true,
      color:"pink",
      price:0,
      holdItem:null,
      active:true
    },
    blue:{
      unlocked:false,
      color:"blue",
      price:150*priceBonus,
      holdItem:null,
      active:false
    },
    green:{
      unlocked:false,
      color:"green",
      price:300*priceBonus,
      holdItem:null,
      active:false
    },
    yellow:{
      unlocked:false,
      color:"yellow",
      price:500*priceBonus,
      holdItem:null,
      active:false
    }
  })
  // * - - - - - - - - - - - - - - - - XP MONEY - - - - - - - - - - - - - - - -
  const [xpOverall, setXpOverall] = useState(0)
  const [moneyOverall, setMoneyOverall] = useState(0)
  const [xp, setXp] = useState(0)
  const [money, setMoney] = useState(0)
  // * - - - - - - - - - - - - - - - - DEALING WITH PAGE RELOAD - - - - - - - - - - - - - - - -
  useEffect(()=>{
    if(localStorage.getItem('gameData')) {
      const data = JSON.parse(localStorage.getItem('gameData'))
      setXp(data.xp)
      setMoney(data.money)
      setXpOverall(data.xpOverall)
      setMoneyOverall(data.moneyOverall)
      setTentacles(data.tentacles)
      setOrders(data.orders)
    }
  }, [])
  useEffect(()=>{
    localStorage.setItem('gameData', {xp:xp, money:money, xpOverall:xpOverall, moneyOverall:moneyOverall, tentacles:tentacles, orders:orders})
  }, [xp, money, xpOverall, moneyOverall, tentacles, orders])
  // * - - - - - - - - - - - - - - - - GAME CYCLE - - - - - - - - - - - - - - - -
  return (
    <main className='page' style={{padding:0}}>
      <div className='GamePage'>
        <section className='Main'>
          <Clients levelId={levelId} orders={orders} setOrders={setOrders}/>
          <Kitchen levelId={levelId} tentacles={tentacles} setTentacles={setTentacles} cooldowns={cooldowns} grabItem={grabItem} />
          <Controls levelId={levelId} tentacles={tentacles} setTentacles={setTentacles}/>
        </section>
      </div>
      {loading && <MyProgressLinearInDeterminate width='100dvw'/>}
    {/* <p style={{position:"fixed", bottom:0, left:0, wordBreak:"break-all"}}>{JSON.stringify(AuthSliceState)}</p> */}
    </main>
  )
}
