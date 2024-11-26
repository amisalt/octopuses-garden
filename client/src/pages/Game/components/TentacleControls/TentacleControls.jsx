import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { buyTentacle, changeActiveTentacle, removeHoldItem } from '../../../../app/store/slices/GamePlayedSlice'
import "./TentacleControls.css"
import coinImg from "../../../../static/images/coin.svg"

export function TentacleControls({index}) {
  const dispatch = useDispatch()
  const tentacle = useSelector(state=>state.game.tentacles[index])

  function handleRemoveHoldItem(){
    if(tentacle.holdItem){
      dispatch(removeHoldItem({index:index}))
    }
    console.log(tentacle)
  }

  function handleChangeActiveTentacle(){
    if(!tentacle.active){
      dispatch(changeActiveTentacle({index:index}))
    }
    console.log(tentacle)
  }

  function handleBuyTentacle(){
    if(!tentacle.unlocked){
      dispatch(buyTentacle({index:index}))
    }
    console.log(tentacle)
  }

  return (
    <div className='TentacleControls' is-active={`${tentacle.active}`} onClick={!tentacle.active ? handleChangeActiveTentacle : null}>
      <section>
        {tentacle.holdItem && (<img src={`/api/image/food/${tentacle.holdItem}.png`} alt={tentacle.holdItem} className='HoldItem'/>)}
        <img src={`/api/image/icons/tentacles/${tentacle.color}.png`} alt={`controls ${tentacle.color}`} className='TentacleImg'/>
        {tentacle.active && tentacle.holdItem && <button onClick={handleRemoveHoldItem} className='TentacleActionButton'>X</button>}
      </section>
      {!tentacle.unlocked && 
      <button className='TentacleActionButton' onClick={handleBuyTentacle}>
        {tentacle.price}
        <img src={coinImg} className='CoinImg'/>
      </button>}
    </div>
  )
}
