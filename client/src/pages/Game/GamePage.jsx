import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import "./GamePage.css"
import { Menu } from './Menu'
import { Clients } from './Clients'
import { Kitchen } from './Kitchen'
import { Controls } from './Controls'
import { MyProgressLinearInDeterminate } from '../../components/informationals/ProgressBar/MyProgress'

import { addSecond, setBonuses, setPause, setPrices, changeActiveTentacle } from '../../app/store/slices/GamePlayedSlice'

export function GamePage() {
  const dispatch = useDispatch()
  // * - - - - - - - - - - - - - - - - LOADING STATE FOR QUERYS - - - - - - - - - - - - - - - -
  const loading = useSelector(state=>state.game.loading)
  // const {width, height} = useSelector(state=>state.appData.windowDimensions)
  // * - - - - - - - - - - - - - - - - GETTING LEVEL DETAILS - - - - - - - - - - - - - - - -
  const levels = useSelector(state=>state.gameInfo.levels.availableLevels)
  const {levelId} = useParams()
  // * - - - - - - - - - - - - - - - - DEALING WITH PAGE RELOAD - - - - - - - - - - - - - - - -
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
  useEffect(()=>{
    if(!pause) dispatch(setPause(false))
    else{
      setModal(true)
    }
    dispatch(setBonuses({levels, levelId}))
    dispatch(setPrices())
    // ----------time----------
    const timeInterval = setInterval(()=>{
      if(!pause){
        dispatch(addSecond())
      }
    }, 1000)
    function clearTimeInterval(){
      clearInterval(timeInterval)
    }
    return clearTimeInterval
  }, [])
  // * - - - - - - - - - -- Changing controlled tentacle - - - - - - - - - - - - - 
  const activeIndex = useSelector(state=>state.game.activeIndex)
  
  useEffect(()=>{
    function handleChangeActiveTentacleOnKey({key}){
      let newIndex = -1
      if(['1','2','3','4'].includes(key)) newIndex = Number(key)-1
      if(newIndex > -1 && newIndex !== activeIndex){
        dispatch(changeActiveTentacle({index:newIndex}))
      }
    }
    const page = document.getElementById('GAMEPAGE')
    page.addEventListener('keydown', handleChangeActiveTentacleOnKey)
    return function cleanup(){
      page.removeEventListener('keydown', handleChangeActiveTentacleOnKey)
    }
  }, [activeIndex])
  // * - - - - - - - - - - - - - - - - GAME CYCLE - - - - - - - - - - - - - - - -
  return (
    <main className='page' style={{padding:0}} onClick={(e)=>hideModal(e)}>
      <div tabIndex='1' className='GamePage' id='GAMEPAGE'>
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
