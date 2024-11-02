import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'

export const registrationQuery = createAsyncThunk(
  'registration/registrationQuery',
  async({username,password})=>{
    const response = await axios.post("/auth/registration", {username,password}).then(res=>res.data).catch(error=>error.response.data)
    return response.message
  }
)

export const logInQuery =  createAsyncThunk(
  'auth/logInQuery',
  async ({username,password}) => {
    const response = await axios.post("/auth/login", {username,password}).then(res=>res.data).catch(error=>error.response.data.message)
    return response
  }
)

export const tokenQuery = createAsyncThunk(
  'auth/tokenQuery',
  async () => {
    const response = await axios.get("/auth/token").then(res=>res.data).catch(error=>error.response.data.message)
    return response
  }
)

export const logoutQuery = createAsyncThunk(
  "auth/logoutQuery",
  async()=>{
    const response = await axios.get("/auth/logout").then(res=>res.data).catch(error=>error.response.data)
    if(response.message === "Unauthorized user" || response.message === "User is not existing"){
      const tokenRefreshResponse = await axios.get("/auth/token").then(res=>res.data)
      if(tokenRefreshResponse === "Tokens gained"){
        const response = await axios.get("/auth/logout").then(res=>res.data).catch(error=>error.response.data)
        return response.message
      }
    }else return response.message
  }
)

export const makeAdminQuery = createAsyncThunk(
  "auth/makeAdminQuery",
  async(username) => {
    const response = await axios.post("/auth/makeAdmin", {username}).then(res=>res.data).catch(error=>error.response.data)
    if(response.message === "Unauthorized user" || response.message === "User is not existing"){
      const tokenRefreshResponse = await axios.get("/auth/token").then(res=>res.data)
      if(tokenRefreshResponse === "Tokens gained"){
        const response = await axios.get("/auth/makeAdmin").then(res=>res.data).catch(error=>error.response.data)
        return response.message
      }
    }else return response.message
  }
)

export const removeAdminQuery = createAsyncThunk(
  "auth/removeAdminQuery",
  async(username)=>{
    const response = await axios.post("/auth/removeAdmin", {username}).then(res=>res.data).catch(error=>error.response.data)
    if(response.message === "Unauthorized user" || response.message === "User is not existing"){
      const tokenRefreshResponse = await axios.get("/auth/token").then(res=>res.data)
      if(tokenRefreshResponse === "Tokens gained"){
        const response = await axios.get("/auth/removeAdmin").then(res=>res.data).catch(error=>error.response.data)
        return response.message
      }
    }else return response.message
  }
)

export const banQuery = createAsyncThunk(
  "auth/banQuery",
  async(username)=>{
    const response = await axios.post("/auth/ban", {username}).then(res=>res.data).catch(error=>error.response.data)
    if(response.message === "Unauthorized user" || response.message === "User is not existing"){
      const tokenRefreshResponse = await axios.get("/auth/token").then(res=>res.data)
      if(tokenRefreshResponse === "Tokens gained"){
        const response = await axios.get("/auth/ban").then(res=>res.data).catch(error=>error.response.data)
        return response.message
      }
    }else return response.message
  }
)

const AuthSlice = createSlice({
  name:"auth",
  initialState:{
    user:{
      username:null,
      asAdmin:false
    },
    loggedIn:false,
    loading:false,
    error:null,
    message:null
  },
  extraReducers:(builder)=>{ 
    builder
    // REGISTRATION
    .addCase(registrationQuery.pending, (state, action) => {
      state.loading = true
      state.error = null
      state.message = null
    })
    .addCase(registrationQuery.fulfilled, (state,action)=>{
      state.loading = false
      if(action.payload === "Successfull registration"){
        state.message = action.payload
        state.error = null
      }else{
        state.error = action.payload
        state.message = null
      }
    })
    // LOGIN
    .addCase(logInQuery.pending, (state, action) => {
      state.loading = true
      state.error = null
      state.message = null
    })
    .addCase(logInQuery.fulfilled, (state,action)=>{
      state.loading = false
      if(action.payload.message === "Tokens gained"){
        state.message = action.payload.message
        state.error = null
        state.loggedIn = true
        state.user = action.payload.user
      }else{
        state.error = action.payload
        state.message = null
        state.loggedIn = false
        state.user = {
          username:null,
          asAdmin:false
        }
      }
    })
    // TOKEN
    .addCase(tokenQuery.pending, (state, action) => {
      state.loading = true
      state.error = null
      state.message = null
    })
    .addCase(tokenQuery.fulfilled, (state,action)=>{
      state.loading = false
      if(action.payload.message === "Tokens gained"){
        state.message = action.payload.message
        state.error = null
        state.loggedIn = true
        state.user = action.payload.user
      }else{
        state.error = action.payload
        state.message = null
        state.loggedIn = false
        state.user = {
          username:null,
          asAdmin:false
        }
      }
    })
    // LOGOUT
    .addCase(logoutQuery.pending, (state, action) => {
      state.loading = true
      state.error = null
      state.message = null
    })
    .addCase(logoutQuery.fulfilled, (state,action)=>{
      state.loading = false
      if(action.payload === "Tokens cleared"){
        state.message = action.payload
        state.error = null
        state.loggedIn = true
      }else{
        state.error = action.payload
        state.message = null
        state.loggedIn = false
      }
    })
    // !ADMIN RIGHTS QUERY
    // MAKE ADMIN
    .addCase(makeAdminQuery.pending, (state, action) => {
      state.loading = true
      state.error = null
      state.message = null
    })
    .addCase(makeAdminQuery.fulfilled, (state,action)=>{
      state.loading = false
      if(action.payload === `User is now admin`){
        state.message = action.payload
        state.error = null
      }else{
        state.error = action.payload
        state.message = null
      }
    })
    // REMOVE ADMIN
    .addCase(removeAdminQuery.pending, (state, action) => {
      state.loading = true
      state.error = null
      state.message = null
    })
    .addCase(removeAdminQuery.fulfilled, (state,action)=>{
      state.loading = false
      if(action.payload === `User is now admin`){
        state.message = action.payload
        state.error = null
      }else{
        state.error = action.payload
        state.message = null
      }
    })
    // BAN 
    .addCase(banQuery.pending, (state, action) => {
      state.loading = true
      state.error = null
      state.message = null
    })
    .addCase(banQuery.fulfilled, (state,action)=>{
      state.loading = false
      if(action.payload === `User is now admin`){
        state.message = action.payload
        state.error = null
      }else{
        state.error = action.payload
        state.message = null
      }
    })
  }
})

export default AuthSlice.reducer