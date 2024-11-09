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
    loggedIn:false
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