import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import axios from "axios"
import { getGameInfoDataHook } from "../../../hooks/getDataHooks";
axios.defaults.withCredentials = true;

export const createGameQuery = createAsyncThunk(
  "gameInfo/createGameQuery",
  async()=>{
    const response = await axios.get("/api/gameInfo/createGame").then(res=>res.data).catch(error=>error.response.data)
    return response
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
    return response
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
    return response;
  }
);

export const deleteLevelQuery = createAsyncThunk(
  'gameInfo/deleteLevel',
  async (levelId) => {
    const response = await axios.post('/api/gameInfo/deleteLevel', {levelId}).then(res => res.data).catch(error => error.response.data);
    return response;
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
    return response;
  }
);

export const deleteUpgradeQuery = createAsyncThunk(
  'gameInfo/deleteUpgrade',
  async (upgradeId) => {
    const response = await axios.post('/api/gameInfo/deleteUpgrade', {upgradeId}).then(res => res.data).catch(error => error.response.data);
    return response;
  }
)

const gameInfoData = getGameInfoDataHook()
// {
//   stats:{
//     xp:null,
//     money:null,
//     upgrades:[]
//   },
//   availableUpgrades:[],
//   levels:{
//     availableLevels:[{_id:'8', priceBonus:1, xpBonus:1}],
//     unavailableLevels:[]
//   }
// }

const GameInfoSlice = createSlice({
  name:"gameInfo",
  initialState:{
    loading:false,
    errors:null,
    message:null,
    ...gameInfoData
  },
  extraReducers:(builder)=>{
    builder
    // CREATE GAME
    .addCase(createGameQuery.pending, (state, action) => {
      state.loading = true
      state.errors = null
      state.message = null
    })
    .addCase(createGameQuery.fulfilled, (state,action)=>{
      state.loading = false
      state.message = action.payload.message
      state.errors = action.payload.errors
    })
    // STATS
    .addCase(statsQuery.pending, (state, action) => {
      state.loading = true
      state.errors = null
      state.message = null
    })
    .addCase(statsQuery.fulfilled, (state,action)=>{
      state.loading = false
      state.message = action.payload.message
      state.errors = action.payload.errors
      if(action.payload.message === "Success"){
        state.stats = action.payload.stats
      }else{
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
      state.errors = null
      state.message = null
    })
    .addCase(buyUpgradeQuery.fulfilled, (state,action)=>{
      state.loading = false
      state.message = action.payload.message
      state.errors = action.payload.errors
    })
    // AVAILABLE UPGRADES
    .addCase(availableUpgradesQuery.pending, (state, action) => {
      state.loading = true
      state.errors = null
      state.message = null
    })
    .addCase(availableUpgradesQuery.fulfilled, (state,action)=>{
      state.loading = false
      state.message = action.payload.message
      state.errors = action.payload.errors
      if(action.payload.message === "Success"){
        state.availableUpgrades = action.payload.availableUpgradesList
      }else{
        state.availableUpgrades = []
      }
    })
    // AVAILABLE LEVELS
    .addCase(availableLevelsQuery.pending, (state, action) => {
      state.loading = true
      state.errors = null
      state.message = null
    })
    .addCase(availableLevelsQuery.fulfilled, (state,action)=>{
      state.loading = false
      state.message = action.payload.message
      state.errors = action.payload.errors
      if(action.payload.message === "Success"){
        state.levels.availableLevels = action.payload.availableLevelsList
        state.levels.unavailableLevels = action.payload.unavailableLevelsList
      }else{
        state.levels.availableLevels = []
        state.levels.unavailableLevels = []
      }
    })
    // CREATE LEVEL
    .addCase(createLevelQuery.pending, (state, action) => {
      state.loading = true
      state.errors = null
      state.message = null
    })
    .addCase(createLevelQuery.fulfilled, (state, action) => {
      state.loading = false
      state.message = action.payload.message
      state.errors = action.payload.errors
    })
    // DELETE LEVEL 
    .addCase(deleteLevelQuery.pending, (state, action) => {
      state.loading = true
      state.errors = null
      state.message = null
    })
    .addCase(deleteLevelQuery.fulfilled, (state, action) => {
      state.loading = false
      state.message = action.payload.message
      state.errors = action.payload.errors
    })
    // CREATE UPGRADE
    .addCase(createUpgradeQuery.pending, (state, action) => {
      state.loading = true
      state.errors = null
      state.message = null
    })
    .addCase(createUpgradeQuery.fulfilled, (state, action) => {
      state.loading = false
      state.message = action.payload.message
      state.errors = action.payload.errors
    })
    // DELETE UPGRADE
    .addCase(deleteUpgradeQuery.pending, (state, action) => {
      state.loading = true
      state.errors = null
      state.message = null
    })
    .addCase(deleteUpgradeQuery.fulfilled, (state, action) => {
      state.loading = false
      state.message = action.payload.message
      state.errors = action.payload.errors
    })
  }
})

export default GameInfoSlice.reducer