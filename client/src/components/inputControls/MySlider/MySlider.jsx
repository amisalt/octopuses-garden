import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { MyInputTransparent } from '../MyInput/MyInput';
import "./MySlider.css"

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#E16F7C',
    },
    secondary: {
      main: '#34113F',
    },
    info: {
      main: '#6665DD',
    },
    warning: {
      main: '#FDCA40',
    },
    success: {
      main: '#272838',
    },
  },
});

export function MySliderWithInput({value, setValue, width, placeholder, label, inputProps, sliderProps, colorTheme}){
  function handleSliderChange(event, newValue){
    setValue(newValue)
  }
  function handleInputChange(NValue){
    let newValue = NValue === '' ? 0 : Number(NValue)
    if(newValue > 100) newValue = 100
    if(newValue < 0) newValue = 0
    setValue(newValue)
  }
  return (
    <div className='MySliderContainer' style={{width}}>
      <p className='MySliderLabel' style={{color:colorTheme==='game'?'var(--bg-color-violet)':'var(--font-color)'}}>{label}</p>
      <section>
        <MyInputTransparent value={value} onChange={(e)=>handleInputChange(e.target.value)} placeholder={placeholder} type='number' width='28%' {...inputProps} colorTheme={colorTheme}/>
        <Box sx={{width:'68%'}}>
          <ThemeProvider theme={theme}>
            <Slider value={typeof value === 'number' ? value : 0} onChange={handleSliderChange} color={colorTheme==='game'?'secondary':'main'} {...sliderProps}/>
          </ThemeProvider>
        </Box>
      </section>
    </div>
  )
}