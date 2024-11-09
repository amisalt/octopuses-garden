import React, { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MyLoader } from '../../components/informationals/Loader/MyLoader'
import { useParams } from 'react-router-dom'
import "./GamePage.css"
import { Clients } from './Clients'
import { Kitchen } from './Kitchen'
import { Controls } from './Controls'
import { setGameState } from '../../app/store/slices/AppDataSlice'

export function GamePage() {
  const dispatch = useDispatch()
  dispatch(setGameState(true))
  const loading = useSelector(state=>state.game.loading)
  // const {width, height} = useSelector(state=>state.appData.windowDimensions)
  const levels = useSelector(state=>state.gameInfo.levels.availableLevels)
  const {levelId} = useParams()
  const {priceBonus, xpBonus} = useMemo(()=>{
    const level = levels.find(level=>level.id === levelId)
    return level
  }, [levelId]) 
  const [orders, setOrders] = useState([])
  const [customers, setCustomers] = useState({
    anglerfish:{
      name: 'anglerfish',
      food:["burger","fries","drink"]
    },
    conger:{
      name: 'conger',
      food:["meat","fries","drink"]
    },
    shark:{
      name: 'shark',
      food:["burger","drink"]
    },
    pufferfish:{
      name: 'pufferfish',
      food:["fries","salad","drink"]
    },
    seabunny:{
      name: 'seabunny',
      food:["salad","drink"]
    }
  })
  const [tentacles, setTentacles] = useState({
    pink:{
      unlocked:true,
      color:"pink",
      price:0,
      holdItem:null,
      active:true,
      grab:false,
      give:false,
      actionPos:null
    },
    blue:{
      unlocked:false,
      color:"blue",
      price:150*priceBonus,
      holdItem:null,
      active:false,
      grab:false,
      give:false,
      actionPos:null
    },
    green:{
      unlocked:false,
      color:"green",
      price:300*priceBonus,
      holdItem:null,
      active:false,
      grab:false,
      give:false,
      actionPos:null
    },
    yellow:{
      unlocked:false,
      color:"yellow",
      price:500*priceBonus,
      holdItem:null,
      active:false,
      grab:false,
      give:false,
      actionPos:null
    }
  })
  const [cooldowns, setCooldwon] = useState({
    "salad":0,
    "meat":0,
    "bun":0,
    "fries":3000,
    "burger":5000,
    "drink":7000
  })
  function grabItem(food, position){
    const filtered = Object.entries(tentacles).filter(([color,tentObj])=>tentObj.active && !tentObj.holdItem)
    if(filtered.length === 1){
      const newTentacles = tentacles
      newTentacles[filtered[0][0]].holdItem = food
      newTentacles[filtered[0][0]].grab = true
      newTentacles[filtered[0][0]].actionPos = position
      setTentacles(newTentacles)
    }
  }
  function giveItem(food, position, target){
    const filtered = Object.entries(tentacles).filter(([color,tentObj])=>tentObj.active && !tentObj.holdItem)
    if(filtered.length === 1){
      const newTentacles = tentacles
      newTentacles[filtered[0][0]].holdItem = null
      newTentacles[filtered[0][0]].give = true
      newTentacles[filtered[0][0]].actionPos = position
      setTentacles(newTentacles)
    }
  }
  function grabItemTentacle(color){
    const newTentacles = tentacles
    newTentacles[color].grab = false
    setTentacles(newTentacles)
  }
  function  giveItemTentacle(color){
    const newTentacles = tentacles
    newTentacles[color].give = false
    setTentacles(newTentacles)
  }
  return (
    <main className='page' style={{padding:0}}>
    {
    loading ? (
      <MyLoader/>
    ) : (
      <div className='GamePage'>
        <section className='Main'>
          <Clients levelId={levelId} orders={orders} setOrders={setOrders}/>
          <Kitchen levelId={levelId} tentacles={tentacles} setTentacles={setTentacles} cooldowns={cooldowns} grabItem={grabItem} />
          <Controls levelId={levelId} tentacles={tentacles} setTentacles={setTentacles}/>
        </section>
      </div>
    )
    }
    {/* <p style={{position:"fixed", bottom:0, left:0, wordBreak:"break-all"}}>{JSON.stringify(AuthSliceState)}</p> */}
  </main>
  )
}
