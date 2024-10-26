import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'

export const registrationQuery = createAsyncThunk(
  'registration/registrationQuery',
  async(data)=>{
    const response = await axios.post("/auth/registration", data).then(res=>res.data)
    return response.message
  }
)

export const logInQuery =  createAsyncThunk(
  'auth/logInQuery',
  async (data) => {
    const response = await axios.post("/auth/login", data).then(res=>res.data)
    return response.message
  }
)

export const tokenQuery = createAsyncThunk(
  'auth/tokenQuery',
  async () => {
    const response = await axios.get("/auth/token").then(res=>res.data)
    return response.message
  }
)

export const logoutQuery = createAsyncThunk(
  "auth/logoutQuery",
  async()=>{
    const response = await axios.get("/auth/logout").then(res=>res.data)
    if(response.message === "Unauthorized user" || response.message === "User is not existing"){
      const tokenRefreshResponse = await axios.get("/auth/token").then(res=>res.data)
      if(tokenRefreshResponse === "Tokens gained"){
        const response = await axios.get("/auth/logout").then(res=>res.data)
        return response.message
      }
    }
  }
)

const AuthSlice = createSlice({
  name:"auth",
  initialState:{
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
    })
    .addCase(registrationQuery.fulfilled, (state,action)=>{
      state.loading = false
      state.error = null
      if(action.payload === "Successfull registration"){
        state.message = action.payload
      }
    })
    .addCase(registrationQuery.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message
    })
    // LOGIN
    .addCase(logInQuery.pending, (state, action) => {
      state.loading = true
      state.error = null
    })
    .addCase(logInQuery.fulfilled, (state,action)=>{
      state.loading = false
      state.error = null
      if(action.payload === "Tokens gained"){
        state.message = action.payload
        state.loggedIn = true
      }
    })
    .addCase(logInQuery.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message
    })
    // TOKEN
    .addCase(tokenQuery.pending, (state, action) => {
      state.loading = true
      state.error = null
    })
    .addCase(tokenQuery.fulfilled, (state,action)=>{
      state.loading = false
      state.error = null
      if(action.payload === "Tokens cleared"){
        state.message = action.payload
        state.loggedIn = false
      }
    })
    .addCase(tokenQuery.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message
    })
    // LOGOUT
    .addCase(logoutQuery.pending, (state, action) => {
      state.loading = true
      state.error = null
    })
    .addCase(logoutQuery.fulfilled, (state,action)=>{
      state.loading = false
      state.error = null
      if(action.payload === "Tokens gained"){
        state.message = action.payload
        state.loggedIn = true
      }
    })
    .addCase(logoutQuery.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message
    })
  }
})

export default AuthSlice.reducer