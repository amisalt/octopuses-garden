import {createSlice, createAsyncThunk} from  "@reduxjs/toolkit"
import axios from "axios"
import { makeNewOrderObject } from "../../../pages/Game/utils";
import { getGameDataHook, saveGameDataHook } from "../../../hooks/getDataHooks";
import { prices } from "../../../pages/Game/constants";
axios.defaults.withCredentials = true;

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
    message:null,
    priceBonus:1,
    xpBonus:1,
    orders:[],
    tentacles:[
      {
        unlocked:true,
        color:"pink",
        price:0,
        holdItem:null,
        active:true
      },
      {
        unlocked:false,
        color:"blue",
        price:150,
        holdItem:null,
        active:false
      },
      {
        unlocked:false,
        color:"green",
        price:300,
        holdItem:null,
        active:false
      },
      {
        unlocked:false,
        color:"yellow",
        price:500,
        holdItem:null,
        active:false
      }
    ],
    activeIndex:0,
    action:{
      type:null,
      evoker:null,
      item:null
    },
    xpOverall:0,
    moneyOverall:0,
    xp:0,
    money:0
  },
  reducers:{
    setInitialState(state){
      const data = getGameDataHook()
      console.log(data)
      state.action = data.action
      state.activeIndex = data.activeIndex
      state.error = data.error
      state.leaderboard = data.leaderboard
      state.loading = data.loading
      state.message = data.message
      state.money = data.money
      state.moneyOverall = data.moneyOverall
      state.orders = data.orders
      state.priceBonus = data.priceBonus
      state.tentacles = data.tentacles
      state.xp = data.xp
      state.xpBonus = data.xpBonus
      state.xpOverall = data.xpOverall
      saveGameDataHook(state)
    },
    // * {levels, levelId}
    setBonuses(state, action){
      const level = action.payload.levels.find(level=>level.id === action.payload.levelId)
      state.priceBonus = level.priceBonus
      state.xpBonus = level.xpBonus
      saveGameDataHook(state)
    },
    setPrices(state){
      for(let tentacle of state.tentacles){
        tentacle.price *= state.priceBonus;
      }
      saveGameDataHook(state)
    },
    // * {action}
    setAction(state,action){
      state.action = action.payload.action
      saveGameDataHook(state)
    },
    makeNewOrder(state){
      state.orders.push(makeNewOrderObject())
      saveGameDataHook(state)
    },
    // * {evoker, index(customer), item}
    updateOrder(state,action){
      if(!state.action.type){
        state.tentacles[state.activeIndex].holdItem = null
        state.action = {
          type: 'give',
          evoker: action.payload.evoker,
          item: action.payload.item
        }
        state.orders[action.payload.index].food[action.payload.food] -= 1
        state.orders[action.payload.index].overallNumber -= 1
        // ? IF THE ORDER IS DONE CALCULATING REVENUE
        if (state.orders[action.payload.index].overallNumber <= 0){
          state.orders.splice(action.payload.index,1)
          const xp = 100*state.xpBonus*(action.payload.time/state.orders[action.payload.index].time)
          state.xp += xp
          state.xpOverall += xp
          let money = 0
          const order = state.orders[action.payload.index].foodBackup
          for(let food in order){
            money += order[food]*prices[food]*state.priceBonus
          }
          state.money += money
          state.moneyOverall += money
        }
        saveGameDataHook(state)
      }
    },
    // * {item, evoker}
    grabItem(state, action){
      if(!state.tentacles[state.activeIndex].holdItem && !state.action.type){
        state.tentacles[state.activeIndex].holdItem = action.payload.item
        state.action = {
          type: 'give',
          evoker: action.payload.evoker,
          item: action.payload.item
        }
        saveGameDataHook(state)
      }
      else{
        // ? WHAT'S THE POINT OF THIS FUNCTION IF IT DOESN'T DO ANYTHING
        localStorage.setItem('available', 0)
      }
    },
    // * {evoker, item}
    giveItem(state,action){
      if(state.tentacles[state.activeIndex].holdItem && !state.action.type){
        state.tentacles[state.activeIndex].holdItem = null
        state.action = {
          type: 'give',
          evoker: action.payload.evoker,
          item: action.payload.item
        }
        saveGameDataHook(state)
      }
    },
    // * {index}
    changeActiveTentacle(state,action){
      if(state.tentacles[action.payload.index].unlocked && !state.action.type){
        state.tentacles[state.activeIndex].active = false
        state.activeIndex = action.payload.index
        state.tentacles[state.activeIndex].active = true
        saveGameDataHook(state)
      }
    },
    // * {index}
    removeHoldItem(state, action){
      if(state.tentacles[action.payload.index].holdItem){
        state.tentacles[action.payload.index].holdItem = null
        saveGameDataHook(state)
      }
    },
    // * {index}
    buyTentacle(state,action){
      if (state.money >= state.tentacles[action.payload.index].price && !state.tentacles[action.payload.index].unlocked){
        state.money -= state.tentacles[action.payload.index].price
        state.moneyOverall -= state.tentacles[action.payload.index].price
        state.tentacles[action.payload.index].unlocked = true
        saveGameDataHook(state)
      }
    },
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

export const {setInitialState, setBonuses, setPrices, setAction, makeNewOrder, updateOrder, grabItem, giveItem, changeActiveTentacle, removeHoldItem, buyTentacle} = GamePlayedSlice.actions
export default GamePlayedSlice.reducer