import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'
import { getAuthDataHook, saveAuthDataHook } from '../../../hooks/getDataHooks';
axios.defaults.withCredentials = true;

export const registrationQuery = createAsyncThunk(
  'registration/registrationQuery',
  async({username,password})=>{
    const response = await axios.post("/api/auth/registration", {username,password}).then(res=>res.data).catch(error=>error.response.data)
    return response.message
  }
)

export const logInQuery =  createAsyncThunk(
  'auth/logInQuery',
  async ({username,password}) => {
    const response = await axios.post("/api/auth/login", {username,password}).then(res=>res.data).catch(error=>error.response.data.message)
    return response
  }
)

export const tokenQuery = createAsyncThunk(
  'auth/tokenQuery',
  async () => {
    const response = await axios.get("/api/auth/token").then(res=>res.data).catch(error=>error.response.data.message)
    return response
  }
)

export const logoutQuery = createAsyncThunk(
  "auth/logoutQuery",
  async()=>{
    const response = await axios.get("/api/auth/logout").then(res=>res.data).catch(error=>error.response.data)
    return response.message
  }
)

export const makeAdminQuery = createAsyncThunk(
  "auth/makeAdminQuery",
  async(username) => {
    const response = await axios.post("/api/auth/makeAdmin", {username}).then(res=>res.data).catch(error=>error.response.data)
    return response.message
  }
)

export const removeAdminQuery = createAsyncThunk(
  "auth/removeAdminQuery",
  async(username)=>{
    const response = await axios.post("/api/auth/removeAdmin", {username}).then(res=>res.data).catch(error=>error.response.data)
    return response.message
  }
)

export const banQuery = createAsyncThunk(
  "auth/banQuery",
  async(username)=>{
    const response = await axios.post("/api/auth/ban", {username}).then(res=>res.data).catch(error=>error.response.data)
    return response.message
  }
)

export const createRoleQuery = createAsyncThunk(
  'auth/createRole',
  async (roleName) => {
    const response = await axios.post('/api/auth/createRole', { value: roleName }).then(res => res.data).catch(error => error.response.data);
    return response.message;
  }
);

export const deleteRoleQuery = createAsyncThunk(
  'auth/deleteRole',
  async (roleName) => {
    const response = await axios.post('/api/auth/deleteRole', { value: roleName }).then(res => res.data).catch(error => error.response.data);
    return response.message;
  }
);

export const placeholderQuey = createAsyncThunk(
  "auth/placeholderQuery",
  async()=>{
    let response
    response = await axios.get("/api/backend").then(res=>res.data.express)
    return response
  }
)

const authData = getAuthDataHook()
const initialState = {
  ...authData,
  loading:true,
  error:null,
  message:null
}

const AuthSlice = createSlice({
  name:"auth",
  initialState,
  reducers:{
    saveAuthData:(state)=>{
      const authData = {
        user:state.user,
        loggedIn:state.loggedIn
      }
      localStorage.setItem("authData", JSON.stringify(authData))
    },
    getAuthData:(state)=>{
      const authData = JSON.parse(localStorage.getItem("authData"))
      if(authData){
        state.user = authData.user
        state.loggedIn = authData.loggedIn
      }
    }
  },
  extraReducers:(builder)=>{ 
    builder
    // PLACEHOLDER
    .addCase(placeholderQuey.pending, (state, action) => {
      state.loading = true
      state.error = null
      state.message = null
    })
    .addCase(placeholderQuey.fulfilled, (state,action)=>{
      state.loading = false
      if(action.payload === "backend is connected ><"){
        state.message = action.payload
        state.error = null
      }else{
        state.error = action.payload
        state.message = null
      }
    })
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
        saveAuthDataHook(state)
      }else{
        state.error = action.payload
        state.message = null
        state.loggedIn = false
        state.user = {
          username:null,
          asAdmin:false
        }
        saveAuthDataHook(state)
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
        saveAuthDataHook(state)
      }else{
        state.error = action.payload
        state.message = null
        state.loggedIn = false
        state.user = {
          username:null,
          asAdmin:false
        }
        saveAuthDataHook(state)
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
        state.loggedIn = false
        saveAuthDataHook()
      }else{
        state.error = action.payload
        state.message = null
        state.loggedIn = true
        saveAuthDataHook()
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
    // CREATE ROLE
    .addCase(createRoleQuery.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    })
    .addCase(createRoleQuery.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload.message === "Role created successfully") {
        state.message = action.payload.message;
        state.error = null;
      } else {
        state.error = action.payload.message;
        state.message = null;
      }
    })
    // DELETE ROLE
    .addCase(deleteRoleQuery.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    })
    .addCase(deleteRoleQuery.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload.message === "Role deleted successfully") {
        state.message = action.payload.message;
        state.error = null;
      } else {
        state.error = action.payload.message;
        state.message = null;
      }
    })
  }
})

export const {saveAuthData, getAuthData} = AuthSlice.actions
export default AuthSlice.reducer