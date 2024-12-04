import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MyButton } from '../../components/inputControls/MyButton/MyButton'
import { startQuery } from '../../app/store/slices/GamePlayedSlice'
import "./MainPage.css"
import { Link } from 'react-router-dom'
import { availableLevelsQuery } from '../../app/store/slices/GameInfoSlice'

export function MainPage() {
  const dispatch = useDispatch()
  const availableLevels = useSelector(state=>state.gameInfo.levels.availableLevels)
  console.log(availableLevels)

  function handleStartQuery(levelId, mode){
    dispatch(startQuery({levelId, mode}))
  }

  useEffect(()=>{
    // dispatch(availableLevelsQuery())
  })

  return (
    <main className='page'>
      <div className="Mainpage">
        <h1>Levels</h1>
        {availableLevels.map(level=><div className='Level'>
          <h2>{level.name}</h2>
          <MyButton onClick={()=>handleStartQuery(level._id, level.mode)}><Link to={`/level/${level._id}`}>Start</Link></MyButton>
        </div>)}
      </div>
    </main>
  )
}
