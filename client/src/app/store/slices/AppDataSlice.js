import { createSlice } from "@reduxjs/toolkit";

const AppDataSlice = createSlice({
  name:"appData",
  initialState:{
    BGMvolume:1,
    SEvolume:1,
    gameState:true,
    windowDimensions:{
      width:0,
      height:0
    }
  },
  reducers:{
    changeBGMvolume:(state,action)=>{
      state.BGMvolume = action.payload
    },
    changeSEvolume:(state,action)=>{
      state.SEvolume = action.payload
    },
    setGameState:(state,action)=>{
      state.gameState = action.payload
    },
    setWindowDimensions:(state,action)=>{
      state.windowDimensions = action.payload
    },   
    saveAppData:(state)=>{
      localStorage.setItem('appData',JSON.stringify(state))
    },
    getAppData:(state)=>{
      const appData = localStorage.getItem('appData')
      state = appData ? JSON.parse(appData) : state
    }
  }
})

export const {changeBGMvolume, changeSEvolume, setGameState, setWindowDimensions, saveAppData, getAppData} = AppDataSlice.actions
export default AppDataSlice.reducer
