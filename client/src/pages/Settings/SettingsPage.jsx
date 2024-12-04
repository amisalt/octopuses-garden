import React, {useState} from 'react'
import './SettingsPage.css'
import { MySliderWithInput } from '../../components/inputControls/MySlider/MySlider'
import { useDispatch, useSelector } from 'react-redux'
import { changeBGMvolume, changeSEvolume } from '../../app/store/slices/AppDataSlice'

export function SettingsPage() {
  const dispatch = useDispatch()
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
  return (
    <main className='page'>
      <div className="SettingsPage">
        <MySliderWithInput value={BGMvolumeReactive} setValue={handleChangeBGMvolume} width='90%' label='BGM volume' colorTheme='app'/>
        <MySliderWithInput value={SEvolumeReactive} setValue={handleChangeSEvolume} width='90%' label='SE volume' colorTheme='app'/>
      </div>
    </main>
  )
}
