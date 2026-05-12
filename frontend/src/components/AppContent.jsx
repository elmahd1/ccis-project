import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import { ProtectedRoute } from './ProtectedRoute'
import { routes } from '../routes'

const AppContent = () => {
  return (
    <CContainer className="px-4" lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route, idx) => {
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  element={
                    <ProtectedRoute allowedRoles={route.roles}>
                      <route.element />
                    </ProtectedRoute>
                  }
                />
              )
            )
          })}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)