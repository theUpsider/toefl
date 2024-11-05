import Keycloak from 'keycloak-js'
import { StateCreator } from 'zustand'

import { resetters, StoreState } from './Store'

// Types
export interface KeycloakSlice {
  keycloak: Keycloak | null
  isAuthenticated: boolean
  token: string | null
  setKeycloak: (keycloak: Keycloak) => void
  resetKeycloak: () => void
}

// Slice
export const createKeycloakSlice: StateCreator<StoreState, [], [], KeycloakSlice> = (
  set
) => {
  const reset = () => {
    set({ keycloak: null, isAuthenticated: false, token: null })
  }
  resetters.push(reset)

  return {
    keycloak: null,
    isAuthenticated: false,
    token: null,
    setKeycloak: (keycloak: Keycloak) =>
      set({
        keycloak,
        isAuthenticated: keycloak.authenticated ?? false,
        token: keycloak.token ?? null
      }),
    resetKeycloak: reset
  }
}
