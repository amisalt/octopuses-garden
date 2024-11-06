import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { MyLoader } from '../../components/informationals/Loader/MyLoader'
import { useParams } from 'react-router-dom'
import "./GamePage.css"
import { Clients } from './Clients'
import { Kitchen } from './Kitchen'
import { Controls } from './Controls'

export function GamePage() {
  const loading = useSelector(state=>state.game.loading)
  // const {width, height} = useSelector(state=>state.appData.windowDimensions)
  const {levelId} = useParams()
  const {priceBonus, xpBonus} = useSelector(state=>state.gameInfo.levels.availableLevels.filter(level=>level._id==levelId))

  const [orders, setOrders] = useState([])
  const [tentacles, setTentacles] = useState({
    pink:{
      unlocked:true,
      price:0,
      holdItem:null,
      active:true
    },
    blue:{
      unlocked:false,
      price:150*priceBonus,
      holdItem:null,
      active:false
    },
    green:{
      unlocked:false,
      price:300*priceBonus,
      holdItem:null,
      active:false
    },
    yellow:{
      unlocked:false,
      price:500*priceBonus,
      holdItem:null,
      active:false
    }
  })

  return (
    <main className='page' style={{padding:0}}>
    {
    loading ? (
      <MyLoader/>
    ) : (
      <div className='GamePage'>
        <section className='MainSection'>
          <Clients levelId={levelId} orders={orders} setOrders={setOrders}/>
          <Kitchen levelId={levelId} tentacles={tentacles} setTentacles={setTentacles}/>
          <Controls levelId={levelId} tentacles={tentacles} setTentacles={setTentacles}/>
        </section>
      </div>
    )
    }
    {/* <p style={{position:"fixed", bottom:0, left:0, wordBreak:"break-all"}}>{JSON.stringify(AuthSliceState)}</p> */}
  </main>
  )
}
