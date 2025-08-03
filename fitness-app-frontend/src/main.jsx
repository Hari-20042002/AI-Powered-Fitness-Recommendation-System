import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import { Provider } from 'react-redux'
import { store } from './store/store'
import { AuthProvider } from 'react-oauth2-code-pkce'
import { authConfig } from './authConfig'
import AuthHandler from './components/auth/AuthHandler'

import App from './App'

// As of React 18
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <AuthProvider authConfig={authConfig}
                loadingComponent={<div>loading...</div>}>
    <Provider store={store}>
      <AuthHandler>
        <App />
      </AuthHandler>
    </Provider>
  </AuthProvider>
)