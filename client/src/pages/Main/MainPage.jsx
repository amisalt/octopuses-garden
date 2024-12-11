import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MyButton, MyButtonTransparent } from '../../components/inputControls/MyButton/MyButton'
import { createModeQuery, startQuery } from '../../app/store/slices/GamePlayedSlice'
import "./MainPage.css"
import tutorial from "../../static/images/tutorialYellow.svg"
import { Link, useNavigate } from 'react-router-dom'
import { availableLevelsQuery } from '../../app/store/slices/GameInfoSlice'

export function MainPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const availableLevels = useSelector(state=>state.gameInfo.levels.availableLevels)
  const message = useSelector(state=>state.game.message)

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
      <div className="MainPage">
        <section>
          <h1>Levels</h1>
          <MyButtonTransparent><img src={tutorial} alt="tuttorial button"/></MyButtonTransparent>
        </section>
        
        {availableLevels.map(level=><div className='Level'>
          <h2>{level.name}</h2>
          <p>{level.description}</p>
          <MyButton onClick={()=>handleStartQuery(level._id, 'single')}><Link to={`/level/${level._id}`}>Start</Link></MyButton>
        </div>)}
        <Link to='/tutorial' className='TutorialLink'>Ready to Play? Learn the Essentials First!</Link>
      </div>
    </main>
  )
}
