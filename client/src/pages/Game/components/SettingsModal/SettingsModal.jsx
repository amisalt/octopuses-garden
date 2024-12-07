import React, {useEffect, useState} from 'react'
import "./SettingsModal.css"
import { useNavigate } from 'react-router-dom'
import { MyButtonViolet } from '../../../../components/inputControls/MyButton/MyButton'
import { useDispatch, useSelector } from 'react-redux'
import { endQuery, exitQuery, setPause } from '../../../../app/store/slices/GamePlayedSlice'
import { statsQuery } from '../../../../app/store/slices/GameInfoSlice'
import { changeBGMvolume, changeSEvolume, setGameState } from '../../../../app/store/slices/AppDataSlice'
import { MySliderWithInput } from '../../../../components/inputControls/MySlider/MySlider'
import { removeGameDataHook } from '../../../../hooks/getDataHooks'

export function SettingsModal({show, hideModal}) {
  const dispatch = useDispatch()
  const {xp, money, xpOverall, moneyOverall, overallTime, errors, message, gameToken} = useSelector(state=>state.game)
  const {BGMvolume, SEvolume} = useSelector(state=>state.appData)
  const [BGMvolumeReactive, setBGMvolume] = useState(BGMvolume*100)
  const [SEvolumeReactive, setSEvolume] = useState(SEvolume*100)
  const navigate = useNavigate()

  function handleChangeBGMvolume(value){
    setBGMvolume(value)
    dispatch(changeBGMvolume(value/100))
  }
  function handleChangeSEvolume(value){
    setSEvolume(value)
    dispatch(changeSEvolume(value/100))
  }

  function handleEndQuery(){
    dispatch(endQuery({xp, money, overallTime, xpOverall, moneyOverall, gameToken}))
  }
  function handleExitQuery(){
    dispatch(exitQuery(gameToken))
  }

  useEffect(()=>{
    if(message === 'Success'){
      if(['Progress saved','Game exited without saving progress'].includes(errors[0].msg)){
        dispatch(setGameState(false))
        navigate('/account')
      }
    }
  }, [errors, message])

  useEffect(()=>{
    if(show) dispatch(setPause(true))
  }, [])

  return (
    <div className='SettingsModal' id='SettingsModal' show={`${show}`}>
      <MyButtonViolet width='100%' onClick={hideModal} id='SettingsModalButton'>Back to game</MyButtonViolet>
      <MySliderWithInput value={BGMvolumeReactive} setValue={handleChangeBGMvolume} width='90%' label='BGM volume' colorTheme='game'/>
      <MySliderWithInput value={SEvolumeReactive} setValue={handleChangeSEvolume} width='90%' label='SE volume' colorTheme='game'/>
      <MyButtonViolet width='100%' onClick={handleExitQuery}>Exit game</MyButtonViolet>
      <MyButtonViolet width='100%' onClick={handleEndQuery}>Save & Exit</MyButtonViolet>
    </div>
  )
}
