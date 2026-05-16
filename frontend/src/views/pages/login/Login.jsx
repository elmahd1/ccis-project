// src/views/pages/login/Login.jsx - CORRECTED VERSION
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import axiosInstance from '../../../api/axiosInstance'
import { useAuth } from '../../../context/AuthContext'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  
  const { login } = useAuth()

  // Helper function to redirect based on role
  const redirectBasedOnRole = (role, accountStatus) => {
    switch (role) {
      case 'ROLE_ADMIN':
        navigate('/admin/dashboard')
        break
      case 'ROLE_EMPLOYEE':
        navigate('/employee/inbox')
        break
      case 'ROLE_CLIENT':
        // Check account status for redirection
        if (accountStatus === 'PENDING_PROFILE_COMPLETION') {
          // Will be handled by ClientAccountGuard in App.jsx
          navigate('/client/workspaces')
        } else if (accountStatus === 'PENDING_ACTIVATION') {
          navigate('/client/workspaces')
        } else {
          navigate('/client/workspaces')
        }
        break
      default:
        navigate('/login')
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault() 
    setError('')
    setIsLoading(true)

    try {
      const response = await axiosInstance.post('/auth/login', { username, password })
      
      // Pass the token and user data to your context's login function
      login(response.data.token, response.data)
      
      // Redirect based on role
      redirectBasedOnRole(response.data.role, response.data.accountStatus)
      
    } catch (err) {
      console.error("Login error:", err)
      
      // Handle different error response formats
      if (err.response && err.response.status === 400) {
        // Extract error message from response - could be a string or an object
        const errorData = err.response.data
        if (typeof errorData === 'string') {
          setError(errorData)
        } else if (errorData && errorData.error) {
          setError(errorData.error)
        } else {
          setError("Nom d'utilisateur ou mot de passe incorrect")
        }
      } else if (err.response && err.response.status === 403) {
        // Account status issues
        const errorData = err.response.data
        if (typeof errorData === 'string') {
          setError(errorData)
        } else if (errorData && errorData.error) {
          setError(errorData.error)
        } else {
          setError("Compte non activé. Veuillez contacter l'administrateur.")
        }
      } else if (err.response && err.response.data) {
        // Generic error response
        const errorData = err.response.data
        if (typeof errorData === 'string') {
          setError(errorData)
        } else if (errorData && errorData.error) {
          setError(errorData.error)
        } else if (errorData && errorData.message) {
          setError(errorData.message)
        } else {
          setError("Une erreur s'est produite. Veuillez réessayer.")
        }
      } else if (err.request) {
        setError("Impossible de contacter le serveur. Vérifiez que le backend est démarré.")
      } else {
        setError("Erreur de connexion. Veuillez réessayer.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleLogin}>
                    <h1>Login</h1>
                    <p className="text-medium-emphasis">Connectez-vous à votre compte</p>
                    
                    {error && (
                      <CAlert color="danger" dismissible onClose={() => setError('')}>
                        {error}
                      </CAlert>
                    )}
                    
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput 
                        placeholder="Nom d'utilisateur" 
                        autoComplete="username" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Mot de passe"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton type="submit" color="primary" className="px-4" disabled={isLoading}>
                          {isLoading ? "Connexion..." : "Se connecter"}
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-end">
                        <CButton color="link" className="px-0">
                          Mot de passe oublié?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Inscription</h2>
                    <p>
                      Vous n'avez pas encore de compte ? Inscrivez-vous maintenant pour accéder à notre plateforme.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        S'inscrire
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login