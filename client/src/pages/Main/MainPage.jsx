import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MyButton } from '../../components/inputControls/MyButton/MyButton'
import { createModeQuery, startQuery } from '../../app/store/slices/GamePlayedSlice'
import "./MainPage.css"
import { Link, useNavigate } from 'react-router-dom'
import { availableLevelsQuery } from '../../app/store/slices/GameInfoSlice'

export function MainPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const availableLevels = useSelector(state=>state.gameInfo.levels.availableLevels)
  const message = useSelector(state=>state.game.message)
  console.log(availableLevels)

  function handleStartQuery(levelId, mode){
    dispatch(startQuery({levelId, mode}))
    if(message === 'Success'){
      navigate(`/level/${levelId}`)
    }
  }

  useEffect(()=>{
    dispatch(availableLevelsQuery())
  }, [])

  return (
    <main className='page'>
      <div className="Mainpage">
        <h1>Levels</h1>
        {availableLevels.map(level=><div className='Level'>
          <h2>{level.name}</h2>
          <p>{level.description}</p>
          <MyButton onClick={()=>handleStartQuery(level._id, 'single')}><Link to={`/level/${level._id}`}>Start</Link></MyButton>
        </div>)}
      </div>
    </main>
  )
}
