import { createSlice } from "@reduxjs/toolkit";
import { getAppDataHook } from "../../../hooks/getDataHooks";

const initialState = getAppDataHook()

const AppDataSlice = createSlice({
  name:"appData",
  initialState,
  reducers:{
    changeBGMvolume:(state,action)=>{
      if(Number(n) === +n && n%1 !== 0) state.BGMvolume = action.payload
    },
    changeSEvolume:(state,action)=>{
      if(Number(n) === +n && n%1 !== 0) state.SEvolume = action.payload
    },
    setGameState:(state,action)=>{
      if(typeof action.payload === "boolean") state.gameState = action.payload
    },
    setWindowDimensions:(state,action)=>{
      if(Number.isInteger(action.payload.width) && Number.isInteger(action.payload.height))state.windowDimensions = action.payload
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
