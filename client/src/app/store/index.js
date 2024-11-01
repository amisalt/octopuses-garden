import {configureStore} from '@reduxjs/toolkit'
import AuthReducer from "./slices/AuthSlice"
import GameInfoReducer from "./slices/GameInfoSlice"
import GamePlayedReducer from "./slices/GamePlayedSlice"
export const store = configureStore({
  reducer:{
    auth:AuthReducer,
    gameInfo:GameInfoReducer,
    game:GamePlayedReducer
  }
})