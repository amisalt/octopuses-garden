import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Client } from './components/Client/Client'
import { makeNewOrder } from '../../app/store/slices/GamePlayedSlice'
import { Icon } from './components/Client/Icon/Icon'

export function Clients({levelId}) {
  const dispatch = useDispatch()
  const orders = useSelector(state=>state.game.orders)
  const [newOrdersSignal, setNewOrdersSignal] = useState(0)
  
  useEffect(()=>{
    let newOrdersSignalCopy = 0
    const clientsInterval = setInterval(()=>{
      newOrdersSignalCopy+=1
      setNewOrdersSignal(newOrdersSignalCopy)
    }, 5000)
    function clearClientsInterval(){
      clearInterval(clientsInterval)
    }
    return clearClientsInterval
  }, [])

  useEffect(()=>{
    if(orders.length < 8) dispatch(makeNewOrder())
  }, [newOrdersSignal])

  return (
    <div className='Clients'>
      <div className="Icons">
        {orders.map((order,index)=><Icon {...order} index={index} key={order.id}/>)}
      </div>
      <div className="Queue">
        {orders.map((order, index)=><Client key={order.id} index={index} order={order}/>)}
      </div>
    </div>
  )
}
