import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import "./GamePage.css"
import { Menu } from './Menu'
import { Clients } from './Clients'
import { Kitchen } from './Kitchen'
import { Controls } from './Controls'
import { MyProgressLinearInDeterminate } from '../../components/informationals/ProgressBar/MyProgress'

import { setGameState } from '../../app/store/slices/AppDataSlice'
import { setBonuses, setPause, setPrices } from '../../app/store/slices/GamePlayedSlice'

export function GamePage() {
  const dispatch = useDispatch()
  dispatch(setGameState(true))
  // * - - - - - - - - - - - - - - - - LOADING STATE FOR QUERYS - - - - - - - - - - - - - - - -
  const loading = useSelector(state=>state.game.loading)
  // const {width, height} = useSelector(state=>state.appData.windowDimensions)
  // * - - - - - - - - - - - - - - - - GETTING LEVEL DETAILS - - - - - - - - - - - - - - - -
  const levels = useSelector(state=>state.gameInfo.levels.availableLevels)
  const {levelId} = useParams()
  // * - - - - - - - - - - - - - - - - DEALING WITH PAGE RELOAD - - - - - - - - - - - - - - - -
  useEffect(()=>{
    dispatch(setPause(false))
    dispatch(setBonuses({levels, levelId}))
    dispatch(setPrices())
  }, [])
  // * - - - - - - - - - - - - - - - - DEALING WITH PAUSE - - - - - - - - - - - - - - - -
  const pause = useSelector(state=>state.game.pause)
  const [modal, setModal] = useState(false)
  function hideModal(e){
    if(pause && (!document.getElementById('SettingsModal').contains(e.target) || document.getElementById('SettingsModalButton') == e.target)){
      setModal(false)
      dispatch(setPause(false))
    }
  }
  function showModal(){
    if(!pause){
      dispatch(setPause(true))
      setModal(true)
    }
  }
  // * - - - - - - - - - - - - - - - - GAME CYCLE - - - - - - - - - - - - - - - -
  return (
    <main className='page' style={{padding:0}} onClick={(e)=>hideModal(e)}>
      <div className='GamePage'>
        <section className='Main'>
          <Menu hideModal={hideModal} showModal={showModal} modal={modal}/>
          <Clients levelId={levelId}/>
          <Kitchen levelId={levelId}/>
          <Controls levelId={levelId}/>
        </section>
      </div>
      {loading && <MyProgressLinearInDeterminate width='100dvw'/>}
    </main>
  )
}
