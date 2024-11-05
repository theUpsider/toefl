// top level import
import '@/utils/css'

import Keycloak from 'keycloak-js'
import React from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider
} from 'react-router-dom'
import { registerSW } from 'virtual:pwa-register'

import { Config, setConfig } from '@/utils/config'

const container = document.getElementById('root')
const root = createRoot(container!)

import { App } from './pages/App'
import { Login } from './pages/Login'
import { useStore } from './store'
import { setHttpClient } from './utils/HttpClient'

// Separate Keycloak initialization
const initializeKeycloak = async (keycloak: Keycloak, config: Config) => {
  try {
    const auth = await keycloak.init({
      onLoad: 'check-sso',
      checkLoginIframe: true,
      pkceMethod: 'S256',
      silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
    })

    useStore.getState().setKeycloak(keycloak)

    if (auth && keycloak.token) {
      setHttpClient({
        baseURL: config.API_URL,
        timeout: Number(config.API_TIMEOUT) || 5000,
        headers: {
          Authorization: 'Bearer ' + keycloak.token
        }
      })
    }

    return auth
  } catch (error) {
    console.error('Failed to initialize Keycloak:', error)
    throw error
  }
}

const createAuthRouter = (authenticated: boolean) =>
  createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route
          path="/login"
          element={authenticated ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/*"
          element={authenticated ? <App /> : <Navigate to="/login" replace />}
        />
      </Route>
    )
  )

// Main application setup
fetch('/config/env.' + (process.env.NODE_ENV ?? 'development') + '.json')
  .then((response) => response.json())
  .then(async (config) => {
    setConfig(config)

    const initOptions = {
      url: config.KEYCLOAK_URL,
      realm: config.KEYCLOAK_REALM,
      clientId: config.KEYCLOAK_CLIENT_ID
    }
    const keycloak = new Keycloak(initOptions)

    try {
      const authenticated = await initializeKeycloak(keycloak, config)
      const router = createAuthRouter(authenticated)

      root.render(
        <React.StrictMode>
          <RouterProvider router={router} />
        </React.StrictMode>
      )
    } catch (error) {
      root.render(
        <div className="p-4">
          <h1 className="text-xl text-red-600">Failed to initialize application</h1>
          <p>{String(error)}</p>
        </div>
      )
    }
  })

const updateSW = registerSW({
  onNeedRefresh() {
    alert('New version available! Refresh to update.')
  },
  onOfflineReady() {
    alert('App is ready for offline use.')
    console.log('App is ready for offline use.')
  },
  onRegisterError() {
    alert('Failed to register service worker :(')
  }
})
updateSW()
