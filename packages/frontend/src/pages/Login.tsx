import { useEffect } from 'react'

import { useStore } from '@/store/Zustand/Store'

export const Login = () => {
  const { keycloak, isAuthenticated } = useStore()

  useEffect(() => {
    if (!isAuthenticated && keycloak) {
      keycloak.login({
        redirectUri: window.location.origin
      })
    }
  }, [keycloak, isAuthenticated])

  if (isAuthenticated) {
    return <div>You are logged in!</div>
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md">
        <h1 className="mb-4 text-2xl font-bold text-center">Welcome</h1>
        <button
          onClick={() => keycloak?.login()}
          className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Login with Keycloak
        </button>
      </div>
    </div>
  )
}
