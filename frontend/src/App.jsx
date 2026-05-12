/**
 * App Component
 *
 * Root application component that sets up routing, theme management,
 * and lazy-loaded page components with suspense boundaries.
 */

import React, { Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'

import { useAuth } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import './scss/examples.scss'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

// Auth Pages (NEW)
const ProfileCompletion = React.lazy(() => import('./views/client/ProfileCompletion'))
const PendingActivation = React.lazy(() => import('./views/client/PendingActivation'))

/**
 * Client Account Guard Component
 * Redirects based on account status for client users
 */
const ClientAccountGuard = ({ children }) => {
  const { user, accountStatus, loading } = useAuth()
  
  if (loading) {
    return <div className="pt-3 text-center"><CSpinner color="primary" variant="grow" /></div>
  }
  
  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  // Only for client users
  if (user.role === 'ROLE_CLIENT') {
    if (accountStatus === 'PENDING_PROFILE_COMPLETION') {
      return <Navigate to={`/complete-profile/${user.id}`} replace />
    }
    if (accountStatus === 'PENDING_ACTIVATION') {
      return <Navigate to="/pending-activation" replace />
    }
  }
  
  return children
}

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <HashRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          {/* Public auth routes */}
          <Route exact path="/login" name="Login Page" element={<Login />} />
          <Route exact path="/register" name="Register Page" element={<Register />} />
          <Route exact path="/404" name="Page 404" element={<Page404 />} />
          <Route exact path="/500" name="Page 500" element={<Page500 />} />
          
          {/* NEW: Account management routes (public) */}
          <Route exact path="/complete-profile/:userId" name="Complete Profile" element={<ProfileCompletion />} />
          <Route exact path="/pending-activation" name="Pending Activation" element={<PendingActivation />} />
          
          {/* Protected routes with account status guard for clients */}
          <Route
            path="*"
            name="Home"
            element={
              <ProtectedRoute>
                <ClientAccountGuard>
                  <DefaultLayout />
                </ClientAccountGuard>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </HashRouter>
  )
}

export default App