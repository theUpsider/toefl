import { createContext, useMemo, useState } from 'react'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom'

const ColorModeContext = createContext({ toggleColorMode: () => {} })

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="*" element={<div>Not found</div>} />
    </Route>
  )
)

export const BasicApp = () => {
  return <RouterProvider router={router} />
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
      <BasicApp />
    </ColorModeContext.Provider>
  )
}

export default App
