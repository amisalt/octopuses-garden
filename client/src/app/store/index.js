import {configureStore} from '@reduxjs/toolkit'
import AuthReducer from "./slices/AuthSlice"
import GameInfoReducer from "./slices/GameInfoSlice"
import GamePlayedReducer from "./slices/GamePlayedSlice"
import AppDataReducer from "./slices/AppDataSlice"
export const store = configureStore({
  reducer:{
    auth:AuthReducer,
    gameInfo:GameInfoReducer,
    game:GamePlayedReducer,
    appData:AppDataReducer
  }
})