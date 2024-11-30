import React, {useState} from 'react'
import "./SettingsModal.css"
import { Link } from 'react-router-dom'
import { MyButtonViolet } from '../../../../components/inputControls/MyButton/MyButton'
import { useDispatch, useSelector } from 'react-redux'
import { endQuery, exitQuery } from '../../../../app/store/slices/GamePlayedSlice'
import { statsQuery } from '../../../../app/store/slices/GameInfoSlice'
import { changeBGMvolume, changeSEvolume } from '../../../../app/store/slices/AppDataSlice'
import { MySliderWithInput } from '../../../../components/inputControls/MySlider/MySlider'
import { removeGameDataHook } from '../../../../hooks/getDataHooks'

export function SettingsModal({show, hideModal}) {
  const dispatch = useDispatch()
  const {xp, money, xpOverall, moneyOverall, overallTime} = useSelector(state=>state.game)
  const {BGMvolume, SEvolume} = useSelector(state=>state.appData)
  const [BGMvolumeReactive, setBGMvolume] = useState(BGMvolume*100)
  const [SEvolumeReactive, setSEvolume] = useState(SEvolume*100)

  function handleChangeBGMvolume(value){
    setBGMvolume(value)
    dispatch(changeBGMvolume(value/100))
  }
  function handleChangeSEvolume(value){
    setSEvolume(value)
    dispatch(changeSEvolume(value/100))
  }

  function handleEndQuery(){
    dispatch(endQuery({xp, money, overallTime, xpOverall, moneyOverall}))
    removeGameDataHook()
  }
  function handleExitQuery(){
    dispatch(exitQuery())
    removeGameDataHook()
  }

  return (
    <div className='SettingsModal' id='SettingsModal' show={`${show}`}>
      <MyButtonViolet width='100%' onClick={hideModal} id='SettingsModalButton'>Back to game</MyButtonViolet>
      <MySliderWithInput value={BGMvolumeReactive} setValue={handleChangeBGMvolume} width='90%' label='BGM volume'/>
      <MySliderWithInput value={SEvolumeReactive} setValue={handleChangeSEvolume} width='90%' label='SE volume'/>
      <MyButtonViolet width='100%' onClick={handleExitQuery}><Link to='/account' className='Link'>Exit game</Link></MyButtonViolet>
      <MyButtonViolet width='100%' onClick={handleEndQuery}><Link to='/account' className='Link'>Save & Exit</Link></MyButtonViolet>
    </div>
  )
}
