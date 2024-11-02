import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import axios from "axios"

export const createGameQuery = createAsyncThunk(
  "gameInfo/createGameQuery",
  async()=>{
    const response = await axios.get("/gameInfo/createGame").then(res=>res.data).catch(error=>error.response.data)
    if(response.message === "Unauthorized user" || response.message === "User is not existing"){
      const tokenRefreshResponse = await axios.get("/auth/token").then(res=>res.data)
      if(tokenRefreshResponse === "Tokens gained"){
        const response = await axios.get("/gameInfo/createGame").then(res=>res.data).catch(error=>error.response.data)
        return response.message
      }
    }else return response.message
  }
)

export const statsQuery = createAsyncThunk(
  "gameInfo/statsQuery",
  async()=>{
    const response = await axios.get("/gameInfo/stats").then(res=>res.data).catch(error=>error.response.data)
    if(response.message === "Unauthorized user" || response.message === "User is not existing"){
      const tokenRefreshResponse = await axios.get("/auth/token").then(res=>res.data)
      if(tokenRefreshResponse === "Tokens gained"){
        const response = await axios.get("/gameInfo/stats").then(res=>res.data).catch(error=>error.response.data)
        return response
      }
    }else return response
  }
)

export const buyUpgradeQuery = createAsyncThunk(
  "gameInfo/buyUpgrade",
  async(upgradeId)=>{
    const response = await axios.get(`/gameInfo/buyUpgrade/${upgradeId}`).then(res=>res.data).catch(error=>error.response.data)
    if(response.message === "Unauthorized user" || response.message === "User is not existing"){
      const tokenRefreshResponse = await axios.get("/auth/token").then(res=>res.data)
      if(tokenRefreshResponse === "Tokens gained"){
        const response = await axios.get(`/gameInfo/buyUpgrade/${upgradeId}`).then(res=>res.data).catch(error=>error.response.data)
        return response.message
      }
    }else return response.message
  }
)

export const availableUpgradesQuery = createAsyncThunk(
  "gameInfo/availableUpgrades",
  async()=>{
    const response = await axios.get(`/gameInfo/availableUpgrades`).then(res=>res.data).catch(error=>error.response.data)
    if(response.message === "Unauthorized user" || response.message === "User is not existing"){
      const tokenRefreshResponse = await axios.get("/auth/token").then(res=>res.data)
      if(tokenRefreshResponse === "Tokens gained"){
        const response = await axios.get(`/gameInfo/availableUpgrades`).then(res=>res.data).catch(error=>error.response.data)
        return response
      }
    }else return response
  }
)

export const availableLevelsQuery = createAsyncThunk(
  "gameInfo/availableLevels",
  async()=>{
    const response = await axios.get(`/gameInfo/availableLevels`).then(res=>res.data).catch(error=>error.response.data)
    if(response.message === "Unauthorized user" || response.message === "User is not existing"){
      const tokenRefreshResponse = await axios.get("/auth/token").then(res=>res.data)
      if(tokenRefreshResponse === "Tokens gained"){
        const response = await axios.get(`/gameInfo/availableLevels`).then(res=>res.data).catch(error=>error.response.data)
        return response
      }
    }else return response
  }
)

const GameInfoSlice = createSlice({
  name:"gameInfo",
  initialState:{
    loading:false,
    error:null,
    message:null,
    stats:{
      xp:null,
      money:null,
      upgrades:[]
    },
    availableUpgrades:[],
    levels:{
      availableLevels:[],
      unavailableLevels:[]
    }
  },
  extraReducers:(builder)=>{
    builder
    // CREATE GAME
    .addCase(createGameQuery.pending, (state, action) => {
      state.loading = true
      state.error = null
      state.message = null
    })
    .addCase(createGameQuery.fulfilled, (state,action)=>{
      state.loading = false
      state.error = null
      if(["Game instance already exists", "Game instance successfully created"].includes(action.payload)){
        state.message = action.payload
        state.error = null
      }else{
        state.error = action.payload
        state.message = null
      }
    })
    // STATS
    .addCase(statsQuery.pending, (state, action) => {
      state.loading = true
      state.error = null
      state.message = null
    })
    .addCase(statsQuery.fulfilled, (state,action)=>{
      state.loading = false
      if(action.payload.message === "Stats gained successfully"){
        state.message = action.payload.message
        state.error = null
        state.stats = action.payload.stats
      }else{
        state.error = action.payload.message
        state.message = null
        state.stats = {
          xp:null,
          money:null,
          upgrades:[]
        }
      }
    })
    // BUY UPGRADE
    .addCase(buyUpgradeQuery.pending, (state, action) => {
      state.loading = true
      state.error = null
      state.message = null
    })
    .addCase(buyUpgradeQuery.fulfilled, (state,action)=>{
      state.loading = false
      if(action.payload === "Upgrade bought successfully"){
        state.message = action.payload
        state.error = null
      }else{
        state.error = action.payload
        state.message = null
      }
    })
    // AVAILABLE UPGRADES
    .addCase(availableUpgradesQuery.pending, (state, action) => {
      state.loading = true
      state.error = null
      state.message = null
    })
    .addCase(availableUpgradesQuery.fulfilled, (state,action)=>{
      state.loading = false
      if(action.payload.message === "Available upgrades list gained"){
        state.message = action.payload.message
        state.error = null
        state.availableUpgrades = action.payload.availableUpgradesList
      }else{
        state.error = action.payload.message
        state.message = null
        state.availableUpgrades = []
      }
    })
    // AVAILABLE LEVELS
    .addCase(availableLevelsQuery.pending, (state, action) => {
      state.loading = true
      state.error = null
      state.message = null
    })
    .addCase(availableLevelsQuery.fulfilled, (state,action)=>{
      state.loading = false
      if(action.payload.message === "Levels lists gained"){
        state.message = action.payload.message
        state.error = null
        state.levels.availableLevels = action.payload.availableLevelsList
        state.levels.unavailableLevels = action.payload.unavailableLevelsList
      }else{
        state.error = action.payload.message
        state.message = null
        state.levels.availableLevels = []
        state.levels.unavailableLevels = []
      }
    })
  }
})

export default GameInfoSlice.reducer