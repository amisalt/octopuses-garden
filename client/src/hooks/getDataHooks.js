export function getAppDataHook(){
  const appData = localStorage.getItem('appData')
  if(appData) return JSON.parse(appData)
  return {
    BGMvolume:1,
    SEvolume:1,
    gameState:false,
    windowDimensions:{
      width:0,
      height:0
    }
  }
}

export function getAuthDataHook(){
  const authData = localStorage.getItem("authData")
  if(authData) return JSON.parse(authData)
  return {
    user:{
      username:null,
      asAdmin:false
    },
    loggedIn:false,
    // loggedIn:true
  }
}

export function getGameInfoDataHook(){
  const gameInfoData = localStorage.getItem("gameInfoData")
  if(gameInfoData) return JSON.parse(gameInfoData)
  return {
    stats:{
      xp:null,
      money:null,
      upgrades:[]
    },
    availableUpgrades:[],
    levels:{
      availableLevels:[{_id:'8', priceBonus:1, xpBonus:1, name:'tutorial', mode:'single'}],
      unavailableLevels:[]
    }
  }
}

export function getGameDataHook(){
  const gameData = localStorage.getItem("gameData")
  if(gameData) return JSON.parse(gameData)
  return {
    pause:false,
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
    money:0,
    overallTime:0,
    gameToken:''
  }
}

export function getLeaderboardDataHook(){
  const leaderboardData = localStorage.getItem('leaderboardData')
  if(leaderboardData) return JSON.parse(leaderboardData)
  return {
    leaderboard:{}
  }
}

export function saveAppDataHook(state){
  localStorage.setItem("appData",JSON.stringify(state))
}

export function saveAuthDataHook(state){
  const authData = {
    user:state.user,
    loggedIn:state.loggedIn
  }
  localStorage.setItem("authData", JSON.stringify(authData))
}

export function saveGameInfoDataHook(state){
  const gameInfoData = {
    stats:state.stats,
    availableUpgrades:state.availableUpgrades,
    levels:state.levels
  }
  localStorage.setItem("gameInfoData", JSON.stringify(gameInfoData))
}

export function saveGameDataHook(state){
  const gameData = {
    pause:state.pause,
    priceBonus:state.priceBonus,
    xpBonus: state.xpBonus,
    orders:state.orders,
    tentacles:state.tentacles,
    activeIndex:state.activeIndex,
    action:state.action,
    xpOverall:state.xpOverall,
    moneyOverall:state.moneyOverall,
    xp:state.xp,
    money:state.money,
    overallTime:state.overallTime,
    gameToken:state.gameToken
  }
  localStorage.setItem('gameData', JSON.stringify(gameData))
}

export function removeGameDataHook(){
  localStorage.removeItem('gameData')
  localStorage.removeItem('currentWaitingTime')
}

export function saveLeaderboardDataHook(state){
  localStorage.setItem('leaderboardData', JSON.stringify(state.leaderboard))
}