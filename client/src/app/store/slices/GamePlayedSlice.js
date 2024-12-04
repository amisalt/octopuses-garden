import {createSlice, createAsyncThunk} from  "@reduxjs/toolkit"
import axios from "axios"
import { makeNewOrderObject } from "../../../pages/Game/utils";
import { getGameDataHook, getLeaderboardDataHook, saveGameDataHook } from "../../../hooks/getDataHooks";
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
    return response
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
    return response
  }
)

export const exitQuery = createAsyncThunk(
  "game/exitQuery",
  async()=>{
    const gameToken = localStorage.getItem("gameToken")
    const response = await axios.get(`/api/game/exit`, {headers:{"AuthGame":`Bearer ${gameToken}`}}).then(res=>res.data).catch(error=>error.response.data)
    return response
  }
)

export const leaderboardByLevelQuery = createAsyncThunk(
  "game/leaderboardByLevelQuery",
  async({levelId, mode})=>{
    const response = await axios.get(`/api/game/leaderboard/${levelId}/${mode}`).then(res=>res.data).catch(error=>error.response.data)
    return {...response, levelId, mode}
  }
)

export const createModeQuery = createAsyncThunk(
  'gamePlayed/createMode',
  async (modeName) => {
    const response = await axios.post('/api/game/createMode', { value: modeName }).then(res => res.data).catch(error => error.response.data);
    return response;
  }
);

export const deleteModeQuery = createAsyncThunk(
  'gamePlayed/deleteMode',
  async (modeName) => {
    const response = await axios.post('/api/game/deleteMode', { value: modeName }).then(res => res.data).catch(error => error.response.data);
    return response;
  }
);

// TODO: REPLACE INITIAL STORAGE WITH THIS THING

const gameData = getGameDataHook()
// {
//   pause:true,
//   priceBonus:1,
//   xpBonus:1,
//   orders:[],
//   tentacles:[
//     {
//       unlocked:true,
//       color:"pink",
//       price:0,
//       holdItem:null,
//       active:true
//     },
//     {
//       unlocked:false,
//       color:"blue",
//       price:150,
//       holdItem:null,
//       active:false
//     },
//     {
//       unlocked:false,
//       color:"green",
//       price:300,
//       holdItem:null,
//       active:false
//     },
//     {
//       unlocked:false,
//       color:"yellow",
//       price:500,
//       holdItem:null,
//       active:false
//     }
//   ],
//   activeIndex:0,
//   action:{
//     type:null,
//     evoker:null,
//     item:null
//   },
//   xpOverall:0,
//   moneyOverall:500000,
//   xp:0,
//   money:500000,
//   overallTime:0
// }

const leaderboardData = getLeaderboardDataHook()

// {
//   `levelId-mode`:[...leaderboard]
// }

const GamePlayedSlice = createSlice({
  name:"game",
  initialState:{
    ...leaderboardData,
    loading:false,
    error:null,
    message:null,
    ...gameData
  },
  reducers:{
    // * pause
    setPause(state,action){
      state.pause = action.payload
      saveGameDataHook(state)
    },
    addSecond(state){
      state.overallTime += 1000
      saveGameDataHook(state)
    },
    // * {levels, levelId}
    setBonuses(state, action){
      const level = action.payload.levels.find(level=>level._id === action.payload.levelId)
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
      if(state.orders.length < 8) state.orders.push(makeNewOrderObject(state.priceBonus))
      saveGameDataHook(state)
    },
    // * {id}
    removeOrder(state, action){
      console.log("AYOOOOO")
      state.orders = state.orders.filter((order)=>order.id!==action.payload.id)
      localStorage.removeItem('currentWaitingTime')
      saveGameDataHook(state)
    },
    // * {item, time, evoker}
    updateOrder(state,action){
      if(!state.action.type){
        if(action.payload.item){
          state.tentacles[state.activeIndex].holdItem = null
          state.action = {
            type: 'give',
            evoker: action.payload.evoker,
            item: action.payload.item
          }
          state.orders[0].food[action.payload.item] -= 1
          state.orders[0].overallNumber -= 1
        }
        // ? IF THE ORDER IS DONE CALCULATING REVENUE
        if (state.orders[0].overallNumber <= 0 && action.payload.time > 0){
          const xp = Math.round(100*state.xpBonus*(action.payload.time/state.orders[0].time))
          state.xp += xp
          state.xpOverall += xp
          state.money += state.orders[0].money
          state.moneyOverall += state.orders[0].money
        }
        saveGameDataHook(state)
      }
    },
    // * {item, evoker}
    grabItem(state, action){
      if((!state.tentacles[state.activeIndex].holdItem  || action.payload.item === 'burger')&& !state.action.type){
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
      state.message = action.payload.message
      state.errors = action.payload.errors
      if(action.payload.message === "Success"){
        localStorage.setItem("gameToken", action.payload.gameToken)
      }else{
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
      state.message = action.payload.message
      state.errors = action.payload.errors
    })
    // END
    .addCase(endQuery.pending, (state, action) => {
      state.loading = true
      state.error = null
      state.message = null
    })
    .addCase(endQuery.fulfilled, (state,action)=>{
      state.loading = false
      state.message = action.payload.message
      state.errors = action.payload.errors
    })
    // EXIT
    .addCase(exitQuery.pending, (state, action) => {
      state.loading = true
      state.error = null
      state.message = null
    })
    .addCase(exitQuery.fulfilled, (state,action)=>{
      state.loading = false
      state.message = action.payload.message
      state.errors = action.payload.errors
    })
    // LEADERBOARD
    .addCase(leaderboardByLevelQuery.pending, (state, action) => {
      state.loading = true
      state.error = null
      state.message = null
    })
    .addCase(leaderboardByLevelQuery.fulfilled, (state,action)=>{
      state.loading = false
      state.message = action.payload.message
      state.errors = action.payload.errors
      if(action.payload.message === "Success"){
        state.leaderboard[`${action.payload.levelId}-${action.payload.mode}`] = action.payload.leaderboard
      }else{
        state.leaderboard = {}
      }
    })
    // CREATE MODE
    .addCase(createModeQuery.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    })
    .addCase(createModeQuery.fulfilled, (state, action) => {
      state.loading = false
      state.message = action.payload.message
      state.errors = action.payload.errors
    })
    // DELETE MODE
    .addCase(deleteModeQuery.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    })
    .addCase(deleteModeQuery.fulfilled, (state, action) => {
      state.loading = false
      state.message = action.payload.message
      state.errors = action.payload.errors
    })
  }
})

export const {setPause, addSecond, setBonuses, setPrices, setAction, makeNewOrder, removeOrder, updateOrder, grabItem, giveItem, changeActiveTentacle, removeHoldItem, buyTentacle} = GamePlayedSlice.actions
export default GamePlayedSlice.reducer