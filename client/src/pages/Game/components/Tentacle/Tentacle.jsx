import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import "./Tentacle.css"
import { setAction } from '../../../../app/store/slices/GamePlayedSlice'

export function Tentacle({evoker}) {
  const dispatch = useDispatch()
  const activeIndex= useSelector(state=>state.game.activeIndex)
  const activeTentacle = useSelector(state=>state.game.tentacles[activeIndex])
  const action = useSelector(state=>state.game.action)
  const [animationsTentacle, setAnimationsTentacle] = useState("")
  const [animationsFood, setAnimationsFood] = useState("")
  const [sprite, setSprite] = useState("")
  useEffect(()=>{
    if(evoker == action.evoker && action.type){
      console.log("11111111")
      setSprite(action.type==='grab' ? 'give' : action.type=='give' ? 'grab' : null)
      setAnimationsTentacle("tentacle 1s ease-in 0s infinite forwards")
      setAnimationsFood(`${action.type == 'grab' ? 'foodGrab' : action.type=='give' ? 'foodGive' : null} .55s ease-in .45s infinite forwards`)
      setTimeout(()=>{
        setAnimationsTentacle("none")
        setAnimationsFood('none')
        dispatch(setAction({
          action:{
            type:null,
            evoker:null,
            item:null
          }
        }))
      }, 1000)
      setTimeout(()=>{
        setSprite(action.type==='give' ? 'grab' : action.type=='grab' ? 'give' : null)
      }, 550)
    }
  }, [action])
  return (
    <div className='Tentacle'>
      <div className='Body' style={{animation:animationsTentacle}}>
        <div className='TentacleStem' style={{backgroundImage:`url("/api/image/sprites/stem/${activeTentacle.color}.png")`}}/>
        {sprite === 'grab' ? (
          <img src={`/api/image/sprites/grab/${activeTentacle.color}.png`} alt='grab' className='TentacleGrab'/>
        ) : sprite === 'give' ? (
          <img src={`/api/image/sprites/end/${activeTentacle.color}.png`} alt='end' className='TentacleEnd'/>
        ) : null}
      </div>
      <div className="Food" style={{animation:animationsFood}}>
        <img src={`/api/image/food/${activeTentacle.holdItem}.png`} alt={activeTentacle.holdItem} className='TentacleGrabItem'/>
      </div>
    </div>
  )
}
