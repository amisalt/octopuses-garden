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
import { setBonuses, setInitialState, setPrices } from '../../app/store/slices/GamePlayedSlice'

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
    dispatch(setInitialState())
    dispatch(setBonuses({levels, levelId}))
    dispatch(setPrices())
  }, [])
  // * - - - - - - - - - - - - - - - - GAME CYCLE - - - - - - - - - - - - - - - -
  return (
    <main className='page' style={{padding:0}}>
      <div className='GamePage'>
        <section className='Main'>
          <Menu/>
          <Clients levelId={levelId}/>
          <Kitchen levelId={levelId}/>
          <Controls levelId={levelId}/>
        </section>
      </div>
      {loading && <MyProgressLinearInDeterminate width='100dvw'/>}
    </main>
  )
}
