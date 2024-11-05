import { KeycloakProfile } from 'keycloak-js'
import { createContext, useEffect, useMemo, useState } from 'react'
import { Route, Routes } from 'react-router-dom'

import { useStore } from '@/store'

const ColorModeContext = createContext({ toggleColorMode: () => {} })

const AuthStatus = () => {
  const { keycloak, isAuthenticated } = useStore()
  const [userProfile, setUserProfile] = useState<KeycloakProfile | undefined>()
  const [tokenExpiry, setTokenExpiry] = useState<Date | null>(null)

  useEffect(() => {
    if (keycloak && isAuthenticated) {
      keycloak
        .loadUserProfile()
        .then((profile) => setUserProfile(profile))
        .catch((err) => console.error('Failed to load profile:', err))

      // Update token expiry info
      const updateTokenInfo = () => {
        if (keycloak.tokenParsed) {
          if (keycloak.tokenParsed?.exp) {
            setTokenExpiry(new Date(keycloak.tokenParsed.exp * 1000))
          }
        }
      }
      updateTokenInfo()

      // Refresh token periodically
      const interval = setInterval(() => {
        keycloak
          .updateToken(70)
          .then((refreshed) => {
            if (refreshed) {
              updateTokenInfo()
            }
          })
          .catch(() => keycloak.login())
      }, 60000)

      return () => clearInterval(interval)
    }
  }, [keycloak, isAuthenticated])

  if (!isAuthenticated) {
    return <div className="p-4 bg-red-100">Not authenticated</div>
  }

  return (
    <div className="p-4 bg-green-100 space-y-2">
      <div>✅ Authenticated</div>
      {userProfile && (
        <div>
          <div>User: {userProfile.username}</div>
          <div>Email: {userProfile.email}</div>
          <div>Roles: {keycloak?.realmAccess?.roles?.join(', ')}</div>
        </div>
      )}
      {tokenExpiry && <div>Token expires: {tokenExpiry.toLocaleString()}</div>}
      <button
        onClick={() => keycloak?.logout()}
        className="px-4 py-2 bg-red-500 text-white rounded"
      >
        Logout
      </button>
    </div>
  )
}

export const App = () => {
  const [, setMode] = useState<'light' | 'dark' | null>(null)
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
      }
    }),
    []
  )

  return (
    <ColorModeContext.Provider value={colorMode}>
      <AuthStatus />
      <Routes>
        <Route path="*" element={<div>Home</div>} />
      </Routes>
    </ColorModeContext.Provider>
  )
}
