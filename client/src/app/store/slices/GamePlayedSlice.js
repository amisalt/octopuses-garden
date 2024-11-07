import {createSlice, createAsyncThunk} from  "@reduxjs/toolkit"
import axios from "axios"

export const startQuery = createAsyncThunk(
  "game/startQuery",
  async({levelId, mode})=>{
    const response = await axios.get(`/api/game/start/${levelId}/${mode}`).then(res=>res.data).catch(error=>error.response.data)
    return response
  }
)

export const connectQuery = createAsyncThunk(
  "game/connectQuery",
  async()=>{
    const gameToken = localStorage.getItem("gameToken")
    const response = await axios.get(`/api/game/connect`, {headers:{"AuthGame":`Bearer ${gameToken}`}}).then(res=>res.data).catch(error=>error.response.data)
    return response.message
  }
)

export const endQuery = createAsyncThunk(
  "game/endQuery",
  async({xp, money, overallTime, xpOverall, moneyOverall})=>{
    const responseBody = {
      xp,
      money,
      overallTime: overallTime ?? 0,
      xpOverall: xpOverall ?? 0,
      moneyOverall: moneyOverall ?? 0
    } 
    const gameToken = localStorage.getItem("gameToken")
    const response = await axios.post(`/api/game/end`, responseBody, {headers:{"AuthGame":`Bearer ${gameToken}`}}).then(res=>res.data).catch(error=>error.response.data)
    return response.message
  }
)

export const leaderboardByLevelQuery = createAsyncThunk(
  "game/leaderboardByLevelQuery",
  async({levelId, mode})=>{
    const response = await axios.get(`/api/game/leaderboard/${levelId}/${mode}`).then(res=>res.data).catch(error=>error.response.data)
    return response
  }
)

export const createModeQuery = createAsyncThunk(
  'gamePlayed/createMode',
  async (modeName) => {
    const response = await axios.post('/api/game/createMode', { value: modeName }).then(res => res.data).catch(error => error.response.data);
    return response.message;
  }
);

export const deleteModeQuery = createAsyncThunk(
  'gamePlayed/deleteMode',
  async (modeName) => {
    const response = await axios.post('/api/game/deleteMode', { value: modeName }).then(res => res.data).catch(error => error.response.data);
    return response.message;
  }
);

const GamePlayedSlice = createSlice({
  name:"game",
  initialState:{
    leaderboard:[],
    loading:false,
    error:null,
    message:null
  },
  extraReducers:(builder)=>{
    builder
    // START
    .addCase(startQuery.pending, (state, action) => {
      state.loading = true
      state.error = null
      state.message = null
    })
    .addCase(startQuery.fulfilled, (state,action)=>{
      state.loading = false
      if(action.payload.message === "Game started and game token gained"){
        state.message = action.payload.message
        state.error = null
        localStorage.setItem("gameToken", action.payload.gameToken)
      }else{
        state.error = action.payload.message
        state.message = null
        localStorage.removeItem("gameToken")
      }
    })
    // CONNECT
    .addCase(connectQuery.pending, (state, action) => {
      state.loading = true
      state.error = null
      state.message = null
    })
    .addCase(connectQuery.fulfilled, (state,action)=>{
      state.loading = false
      if(action.payload === "Successfully connected to game"){
        state.message = action.payload
        state.error = null
      }else{
        state.error = action.payload
        state.message = null
      }
    })
    // END
    .addCase(endQuery.pending, (state, action) => {
      state.loading = true
      state.error = null
      state.message = null
    })
    .addCase(endQuery.fulfilled, (state,action)=>{
      state.loading = false
      if(action.payload === "Progress saved successfully"){
        state.message = action.payload
        state.error = null
      }else{
        state.error = action.payload
        state.message = null
      }
    })
    // LEADERBOARD
    .addCase(leaderboardByLevelQuery.pending, (state, action) => {
      state.loading = true
      state.error = null
      state.message = null
    })
    .addCase(leaderboardByLevelQuery.fulfilled, (state,action)=>{
      state.loading = false
      if(action.payload.message === "Leaderboard gained successfully"){
        state.message = action.payload.message
        state.error = null
        state.leaderboard = action.payload.leaderboard
      }else{
        state.error = action.payload.message
        state.message = null
        state.leaderboard = []
      }
    })
    // CREATE MODE
    .addCase(createModeQuery.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    })
    .addCase(createModeQuery.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload === "Game mode created successfully") {
        state.message = action.payload;
        state.error = null;
      } else {
        state.error = action.payload;
        state.message = null;
      }
    })
    // DELETE MODE
    .addCase(deleteModeQuery.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    })
    .addCase(deleteModeQuery.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload === "Game mode deleted successfully") {
        state.message = action.payload;
        state.error = null;
      } else {
        state.error = action.payload;
        state.message = null;
      }
    })
  }
})

export default GamePlayedSlice.reducer