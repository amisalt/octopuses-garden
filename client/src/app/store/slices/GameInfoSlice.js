import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import axios from "axios"

export const createGameQuery = createAsyncThunk(
  "gameInfo/createGameQuery",
  async()=>{
    const response = await axios.get("/api/gameInfo/createGame").then(res=>res.data).catch(error=>error.response.data)
    return response.message
  }
)

export const statsQuery = createAsyncThunk(
  "gameInfo/statsQuery",
  async()=>{
    const response = await axios.get("/api/gameInfo/stats").then(res=>res.data).catch(error=>error.response.data)
    return response
  }
)

export const buyUpgradeQuery = createAsyncThunk(
  "gameInfo/buyUpgrade",
  async(upgradeId)=>{
    const response = await axios.get(`/api/gameInfo/buyUpgrade/${upgradeId}`).then(res=>res.data).catch(error=>error.response.data)
    return response.message
  }
)

export const availableUpgradesQuery = createAsyncThunk(
  "gameInfo/availableUpgrades",
  async()=>{
    const response = await axios.get(`/api/gameInfo/availableUpgrades`).then(res=>res.data).catch(error=>error.response.data)
    return response
  }
)

export const availableLevelsQuery = createAsyncThunk(
  "gameInfo/availableLevels",
  async()=>{
    const response = await axios.get(`/api/gameInfo/availableLevels`).then(res=>res.data).catch(error=>error.response.data)
    return response
  }
)

export const createLevelQuery = createAsyncThunk(
  'gameInfo/createLevel',
  async (levelData) => {
    const { name, description, priceBonus, xpBonus, xpRequired } = levelData;
    const response = await axios.post('/api/gameInfo/createLevel', {
      name,
      description,
      priceBonus,
      xpBonus,
      xpRequired
    }).then(res => res.data).catch(error => error.response.data);
    return response.message;
  }
);

export const deleteLevelQuery = createAsyncThunk(
  'gameInfo/deleteLevel',
  async (levelId) => {
    const response = await axios.post('/api/gameInfo/deleteLevel', {levelId}).then(res => res.data).catch(error => error.response.data);
    return response.message;
  }
)

export const createUpgradeQuery = createAsyncThunk(
  'gameInfo/createUpgrade',
  async (upgradeData) => {
    const { name, description, cost, upgrade, quality, device, class: upgradeClass, classLevel } = upgradeData;
    const response = await axios.post('/api/gameInfo/createUpgrade', {
      name,
      description,
      cost,
      upgrade,
      quality,
      device,
      class: upgradeClass,
      classLevel
    }).then(res => res.data).catch(error => error.response.data);
    return response.message;
  }
);

export const deleteUpgradeQuery = createAsyncThunk(
  'gameInfo/deleteUpgrade',
  async (upgradeId) => {
    const response = await axios.post('/api/gameInfo/deleteUpgrade', {upgradeId}).then(res => res.data).catch(error => error.response.data);
    return response.message;
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
    // CREATE LEVEL
    .addCase(createLevelQuery.pending, (state, action) => {
      state.loading = true
      state.error = null
      state.message = null
    })
    .addCase(createLevelQuery.fulfilled, (state, action) => {
      state.loading = false
      if(action.payload === "Level created") {
        state.message = action.payload
        state.error = null
      } else {
        state.error = action.payload
        state.message = null
      }
    })
    // DELETE LEVEL 
    .addCase(deleteLevelQuery.pending, (state, action) => {
      state.loading = true
      state.error = null
      state.message = null
    })
    .addCase(deleteLevelQuery.fulfilled, (state, action) => {
      state.loading = false
      if(action.payload === "Level deleted successfully") {
        state.message = action.payload
        state.error = null
      } else {
        state.error = action.payload
        state.message = null
      }
    })
    // CREATE UPGRADE
    .addCase(createUpgradeQuery.pending, (state, action) => {
      state.loading = true
      state.error = null
      state.message = null
    })
    .addCase(createUpgradeQuery.fulfilled, (state, action) => {
      state.loading = false
      if(action.payload === "Upgrade created successfully") {
        state.message = action.payload
        state.error = null
      } else {
        state.error = action.payload
        state.message = null
      }
    })
    // DELETE UPGRADE
    .addCase(deleteUpgradeQuery.pending, (state, action) => {
      state.loading = true
      state.error = null
      state.message = null
    })
    .addCase(deleteUpgradeQuery.fulfilled, (state, action) => {
      state.loading = false
      if(action.payload === "Upgrade deleted successfully") {
        state.message = action.payload
        state.error = null
      } else {
        state.error = action.payload
        state.message = null
      }
    })
  }
})

export default GameInfoSlice.reducer