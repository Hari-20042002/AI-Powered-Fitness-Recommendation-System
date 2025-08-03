import { createSlice } from '@reduxjs/toolkit'

export const authSlice = createSlice({
  name: 'auth',
  initialState : {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    userId: localStorage.getItem('userId') || null,
    loading: false,
    error: null,
    isAuthenticated: !!(localStorage.getItem('token') && localStorage.getItem('user'))
  },
  reducers: {
    setCredentials: (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.userId = action.payload.user.sub;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;

        localStorage.setItem('token', action.payload.token)
        localStorage.setItem('user', JSON.stringify(action.payload.user))
        localStorage.setItem('userId', action.payload.user.sub)
    },
    login: (state, action) => {
        state.loading = true;
        state.error = null;
    },
    loginSuccess: (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.userId = action.payload.user.sub;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;

        localStorage.setItem('token', action.payload.token)
        localStorage.setItem('user', JSON.stringify(action.payload.user))
        localStorage.setItem('userId', action.payload.user.sub)
    },
    loginFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
    },
    logout: (state) => {
        state.user = null;
        state.token = null;
        state.userId = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;

        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userId');
    },
    
  },
});

// Action creators are generated for each case reducer function
export const { setCredentials, login, loginSuccess, loginFailure, logout } = authSlice.actions;

export default authSlice.reducer;