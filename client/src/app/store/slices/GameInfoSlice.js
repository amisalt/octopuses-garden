import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import axios from "axios"

export const createGameQuery = createAsyncThunk(
  "gameInfo/createGameQuery",
  async()=>{
    const response = await axios.get("/gameInfo/createGame").then(res=>res.data)
    if(response.message === "Unauthorized user" || response.message === "User is not existing"){
      const tokenRefreshResponse = await axios.get("/auth/token").then(res=>res.data)
      if(tokenRefreshResponse === "Tokens gained"){
        const response = await axios.get("/gameInfo/createGame").then(res=>res.data)
        return response.message
      }
    }else return response.message
  }
)

export const statsQuery = createAsyncThunk(
  "gameInfo/statsQuery",
  async()=>{
    const response = await axios.get("/gameInfo/stats").then(res=>res.data)
    if(response.message === "Unauthorized user" || response.message === "User is not existing"){
      const tokenRefreshResponse = await axios.get("/auth/token").then(res=>res.data)
      if(tokenRefreshResponse === "Tokens gained"){
        const response = await axios.get("/gameInfo/stats").then(res=>res.data)
        return response
      }
    }else return response
  }
)

export const buyUpgradeQuery = createAsyncThunk(
  "gameInfo/buyUpgrade",
  async(upgradeId)=>{
    const response = await axios.get(`/gameInfo/buyUpgrade/${upgradeId}`).then(res=>res.data)
    if(response.message === "Unauthorized user" || response.message === "User is not existing"){
      const tokenRefreshResponse = await axios.get("/auth/token").then(res=>res.data)
      if(tokenRefreshResponse === "Tokens gained"){
        const response = await axios.get(`/gameInfo/buyUpgrade/${upgradeId}`).then(res=>res.data)
        return response.message
      }
    }else return response.message
  }
)

export const availableUpgradesQuery = createAsyncThunk(
  "gameInfo/availableUpgrades",
  async()=>{
    const response = await axios.get(`/gameInfo/availableUpgrades`).then(res=>res.data)
    if(response.message === "Unauthorized user" || response.message === "User is not existing"){
      const tokenRefreshResponse = await axios.get("/auth/token").then(res=>res.data)
      if(tokenRefreshResponse === "Tokens gained"){
        const response = await axios.get(`/gameInfo/availableUpgrades`).then(res=>res.data)
        return response
      }
    }else return response
  }
)

export const availableLevelsQuery = createAsyncThunk(
  "gameInfo/availableLevels",
  async()=>{
    const response = await axios.get(`/gameInfo/availableLevels`).then(res=>res.data)
    if(response.message === "Unauthorized user" || response.message === "User is not existing"){
      const tokenRefreshResponse = await axios.get("/auth/token").then(res=>res.data)
      if(tokenRefreshResponse === "Tokens gained"){
        const response = await axios.get(`/gameInfo/availableLevels`).then(res=>res.data)
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
      state.message = ["Game instance already exists", "Game instance successfully created"].includes(action.payload) ? action.payload : null
    })
    .addCase(createGameQuery.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message
      state.message = null
    })
    // STATS
    .addCase(statsQuery.pending, (state, action) => {
      state.loading = true
      state.error = null
      state.message = null
    })
    .addCase(statsQuery.fulfilled, (state,action)=>{
      state.loading = false
      state.error = null
      if(action.payload.message === "Stats gained successfully"){
        state.message = action.payload.message
        state.stats = action.payload.stats
      }
    })
    .addCase(statsQuery.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message
      state.message = null
    })
    // BUY UPGRADE
    .addCase(buyUpgradeQuery.pending, (state, action) => {
      state.loading = true
      state.error = null
      state.message = null
    })
    .addCase(buyUpgradeQuery.fulfilled, (state,action)=>{
      state.loading = false
      state.error = null
      state.message = action.payload === "Upgrade bought successfully" ? action.payload : null
    })
    .addCase(buyUpgradeQuery.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message
      state.message = null
    })
    // AVAILABLE UPGRADES
    .addCase(availableUpgradesQuery.pending, (state, action) => {
      state.loading = true
      state.error = null
      state.message = null
    })
    .addCase(availableUpgradesQuery.fulfilled, (state,action)=>{
      state.loading = false
      state.error = null
      if(action.payload.message === "Available upgrades list gained"){
        state.message = action.payload.message
        state.availableUpgrades = action.payload.availableUpgradesList
      }
    })
    .addCase(availableUpgradesQuery.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message
      state.message = null
    })
    // AVAILABLE LEVELS
    .addCase(availableUpgradesQuery.pending, (state, action) => {
      state.loading = true
      state.error = null
      state.message = null
    })
    .addCase(availableUpgradesQuery.fulfilled, (state,action)=>{
      state.loading = false
      state.error = null
      if(action.payload.message === "Levels lists gained"){
        state.message = action.payload.message
        state.levels.availableLevels = action.payload.availableLevelsList
        state.levels.unavailableLevels = action.payload.unavailableLevelsList
      }
    })
    .addCase(availableUpgradesQuery.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message
      state.message = null
    })
  }
})

export default GameInfoSlice.reducer