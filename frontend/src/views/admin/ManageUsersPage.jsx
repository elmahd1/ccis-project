// ManageUsersPage.jsx - Version sans activation/rejet de comptes
import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CBadge,
  CSpinner,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
  CFormSelect,
  CAlert,
  CInputGroup,
  CInputGroupText,
  CPagination,
  CPaginationItem
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { 
  cilUser, cilEnvelopeClosed, cilUserPlus, 
  cilTrash, cilReload, cilSearch,
  cilPeople, cilWarning 
} from '@coreui/icons'
import axiosInstance from '../../api/axiosInstance'
import { useAuth } from '../../context/AuthContext'

const ManageUsersPage = () => {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const usersPerPage = 10
  
  // Create Employee Modal
  const [visibleCreate, setVisibleCreate] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [newEmployee, setNewEmployee] = useState({
    username: '',
    email: '',
    password: '',
    fullName: ''
  })

  // Filter users based on search, role, and status
  useEffect(() => {
    let filtered = [...users]
    
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.prenom?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    if (roleFilter !== 'ALL') {
      filtered = filtered.filter(user => user.role === roleFilter)
    }
    
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(user => user.accountStatus === statusFilter)
    }
    
    setFilteredUsers(filtered)
    setCurrentPage(1)
  }, [searchTerm, roleFilter, statusFilter, users])

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get('/users/all')
      setUsers(response.data)
      setFilteredUsers(response.data)
      setError('')
    } catch (err) {
      setError('Erreur lors du chargement des utilisateurs.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateEmployee = async () => {
    if (!newEmployee.username || !newEmployee.email || !newEmployee.password) {
      setError('Veuillez remplir tous les champs obligatoires')
      return
    }
    
    if (!newEmployee.email.includes('@')) {
      setError('Email invalide')
      return
    }
    
    if (newEmployee.password.length < 4) {
      setError('Le mot de passe doit contenir au moins 4 caractères')
      return
    }
    
    try {
      setSubmitting(true)
      setError('')
      await axiosInstance.post('/users/create-employee', newEmployee)
      setSuccess('Compte employé créé avec succès')
      setVisibleCreate(false)
      setNewEmployee({ username: '', email: '', password: '', fullName: '' })
      fetchUsers()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data || "Erreur lors de la création")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteUser = async (userId, userRole, username) => {
    if (userRole === 'ROLE_ADMIN') {
      setError("Impossible de supprimer un compte administrateur")
      return
    }
    
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${username}" ? Cette action est irréversible.`)) return

    try {
      await axiosInstance.delete(`/users/${userId}`)
      setSuccess(`Utilisateur "${username}" supprimé avec succès`)
      fetchUsers()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Échec de la suppression')
      console.error(err)
    }
  }

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ROLE_ADMIN':
        return <CBadge color="danger">Administrateur</CBadge>
      case 'ROLE_EMPLOYEE':
        return <CBadge color="success">Employé</CBadge>
      case 'ROLE_CLIENT':
        return <CBadge color="info">Client</CBadge>
      default:
        return <CBadge color="secondary">{role}</CBadge>
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <CBadge color="success">✓ Actif</CBadge>
      case 'PENDING_PROFILE_COMPLETION':
        return <CBadge color="warning">⏳ Profil incomplet</CBadge>
      case 'PENDING_ACTIVATION':
        return <CBadge color="info">🕐 En attente d'activation</CBadge>
      case 'SUSPENDED':
        return <CBadge color="danger">⚠️ Suspendu</CBadge>
      case 'REJECTED':
        return <CBadge color="dark">❌ Rejeté</CBadge>
      default:
        return <CBadge color="secondary">{status || 'Inconnu'}</CBadge>
    }
  }

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

  const pendingClients = users.filter(u => u.role === 'ROLE_CLIENT' && u.accountStatus === 'PENDING_ACTIVATION').length

  return (
    <CRow>
      <CCol xs={12}>
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div>
            <h2>Gestion des utilisateurs</h2>
            <p className="text-muted mb-0">Administration des comptes et accès</p>
          </div>
          <div className="d-flex gap-2">
            {pendingClients > 0 && (
              <CBadge color="warning" className="p-2">
                <CIcon icon={cilWarning} className="me-1" />
                {pendingClients} activation(s) en attente
              </CBadge>
            )}
            <CButton color="primary" onClick={() => setVisibleCreate(true)}>
              <CIcon icon={cilUserPlus} className="me-2" />
              Ajouter un employé
            </CButton>
          </div>
        </div>
        
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Liste des utilisateurs</strong>
            <small className="text-muted ms-2">Gérer les comptes (création employés, suppression)</small>
          </CCardHeader>
          <CCardBody>
            {/* Alerts */}
            {error && <CAlert color="danger" dismissible onClose={() => setError('')}>{error}</CAlert>}
            {success && <CAlert color="success" dismissible onClose={() => setSuccess('')}>{success}</CAlert>}
            
            {/* Filters */}
            <CRow className="mb-4">
              <CCol md={5}>
                <CInputGroup>
                  <CInputGroupText>
                    <CIcon icon={cilSearch} />
                  </CInputGroupText>
                  <CFormInput 
                    placeholder="Rechercher par nom, email..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <CButton color="secondary" variant="outline" onClick={() => setSearchTerm('')}>
                      Effacer
                    </CButton>
                  )}
                </CInputGroup>
              </CCol>
              <CCol md={3}>
                <CFormSelect 
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="ALL">Tous les rôles</option>
                  <option value="ROLE_ADMIN">Administrateurs</option>
                  <option value="ROLE_EMPLOYEE">Employés</option>
                  <option value="ROLE_CLIENT">Clients</option>
                </CFormSelect>
              </CCol>
              <CCol md={3}>
                <CFormSelect 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="ALL">Tous les statuts</option>
                  <option value="ACTIVE">Actifs</option>
                  <option value="PENDING_ACTIVATION">En attente d'activation</option>
                  <option value="PENDING_PROFILE_COMPLETION">Profil incomplet</option>
                  <option value="SUSPENDED">Suspendus</option>
                  <option value="REJECTED">Rejetés</option>
                </CFormSelect>
              </CCol>
              <CCol md={1}>
                <CButton color="light" onClick={fetchUsers} title="Actualiser">
                  <CIcon icon={cilReload} />
                </CButton>
              </CCol>
            </CRow>
            
            {/* Users Table */}
            {loading ? (
              <div className="text-center py-5">
                <CSpinner color="primary" />
                <p className="mt-2 text-muted">Chargement des utilisateurs...</p>
              </div>
            ) : (
              <>
                <CTable hover responsive align="middle">
                  <CTableHead color="light">
                    <CTableRow>
                      <CTableHeaderCell style={{ width: '60px' }}>ID</CTableHeaderCell>
                      <CTableHeaderCell>Utilisateur</CTableHeaderCell>
                      <CTableHeaderCell>Contact</CTableHeaderCell>
                      <CTableHeaderCell>Rôle</CTableHeaderCell>
                      <CTableHeaderCell>Statut</CTableHeaderCell>
                      <CTableHeaderCell style={{ width: '100px' }} className="text-end">Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {currentUsers.length === 0 ? (
                      <CTableRow>
                        <CTableDataCell colSpan="6" className="text-center py-5 text-muted">
                          Aucun utilisateur trouvé
                        </CTableDataCell>
                      </CTableRow>
                    ) : (
                      currentUsers.map((user) => (
                        <CTableRow key={user.id}>
                          <CTableDataCell className="fw-semibold">#{user.id}</CTableDataCell>
                          <CTableDataCell>
                            <div className="d-flex align-items-center">
                              <div className="bg-light rounded-circle p-2 me-2">
                                <CIcon icon={cilUser} size="sm" />
                              </div>
                              <div>
                                <div className="fw-semibold">{user.username}</div>
                                {user.prenom && user.nom && (
                                  <small className="text-muted">{user.prenom} {user.nom}</small>
                                )}
                              </div>
                            </div>
                          </CTableDataCell>
                          <CTableDataCell>
                            <div><CIcon icon={cilEnvelopeClosed} className="me-1 text-muted" /> {user.email}</div>
                            {user.numTelGsm && <small className="text-muted">📱 {user.numTelGsm}</small>}
                          </CTableDataCell>
                          <CTableDataCell>{getRoleBadge(user.role)}</CTableDataCell>
                          <CTableDataCell>{getStatusBadge(user.accountStatus)}</CTableDataCell>
                          <CTableDataCell className="text-end">
                            {/* Delete button - only for non-admin users */}
                            {user.role !== 'ROLE_ADMIN' && (
                              <CButton 
                                color="danger" 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteUser(user.id, user.role, user.username)}
                                title="Supprimer l'utilisateur"
                              >
                                <CIcon icon={cilTrash} />
                              </CButton>
                            )}
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    )}
                  </CTableBody>
                </CTable>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <small className="text-muted">
                      Affichage de {indexOfFirstUser + 1} à {Math.min(indexOfLastUser, filteredUsers.length)} sur {filteredUsers.length} utilisateurs
                    </small>
                    <CPagination>
                      <CPaginationItem disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                        Précédent
                      </CPaginationItem>
                      {[...Array(totalPages)].map((_, i) => (
                        <CPaginationItem 
                          key={i + 1}
                          active={currentPage === i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </CPaginationItem>
                      ))}
                      <CPaginationItem disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
                        Suivant
                      </CPaginationItem>
                    </CPagination>
                  </div>
                )}
              </>
            )}
          </CCardBody>
        </CCard>
        
        {/* Create Employee Modal - Conservé */}
        <CModal visible={visibleCreate} onClose={() => setVisibleCreate(false)} size="md">
          <CModalHeader onClose={() => setVisibleCreate(false)}>
            <CModalTitle>
              <CIcon icon={cilUserPlus} className="me-2" />
              Créer un compte employé
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            <div className="mb-3">
              <CFormInput 
                label="Nom d'utilisateur *"
                placeholder="ex: johndoe"
                value={newEmployee.username}
                onChange={(e) => setNewEmployee({...newEmployee, username: e.target.value})}
                required
              />
            </div>
            <div className="mb-3">
              <CFormInput 
                type="email"
                label="Email *"
                placeholder="ex: john@ccis.ma"
                value={newEmployee.email}
                onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                required
              />
            </div>
            <div className="mb-3">
              <CFormInput 
                type="password"
                label="Mot de passe temporaire *"
                placeholder="Minimum 4 caractères"
                value={newEmployee.password}
                onChange={(e) => setNewEmployee({...newEmployee, password: e.target.value})}
                required
              />
              <small className="text-muted">L'utilisateur pourra modifier son mot de passe à la première connexion</small>
            </div>
            <div className="mb-3">
              <CFormInput 
                label="Nom complet (optionnel)"
                placeholder="ex: John Doe"
                value={newEmployee.fullName}
                onChange={(e) => setNewEmployee({...newEmployee, fullName: e.target.value})}
              />
            </div>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" variant="ghost" onClick={() => setVisibleCreate(false)}>
              Annuler
            </CButton>
            <CButton color="primary" onClick={handleCreateEmployee} disabled={submitting}>
              {submitting ? <CSpinner size="sm" className="me-2" /> : <CIcon icon={cilUserPlus} className="me-2" />}
              Créer le compte
            </CButton>
          </CModalFooter>
        </CModal>
      </CCol>
    </CRow>
  )
}

export default ManageUsersPage