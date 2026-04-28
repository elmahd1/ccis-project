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
  CAlert
} from '@coreui/react'
import axiosInstance from '../../api/axiosInstance'
const ManageUsersPage = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch users when the page loads
  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      // Calls the backend to get all users
      const response = await axiosInstance.get('/users')
      setUsers(response.data)
      setError('')
    } catch (err) {
      setError('Failed to fetch users. Ensure you have Admin privileges.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return

    try {
      await axiosInstance.delete(`/users/${userId}`)
      // Remove the deleted user from the state so the table updates instantly
      setUsers(users.filter(user => user.id !== userId))
    } catch (err) {
      alert('Failed to delete user.')
      console.error(err)
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Manage Users</strong> <small>Admin Dashboard</small>
          </CCardHeader>
          <CCardBody>
            {error && <CAlert color="danger">{error}</CAlert>}
            
            {loading ? (
              <div className="text-center"><CSpinner color="primary" /></div>
            ) : (
              <CTable hover responsive>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell>ID</CTableHeaderCell>
                    <CTableHeaderCell>Username</CTableHeaderCell>
                    <CTableHeaderCell>Email</CTableHeaderCell>
                    <CTableHeaderCell>Role</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {users.map((user) => (
                    <CTableRow key={user.id}>
                      <CTableDataCell>{user.id}</CTableDataCell>
                      <CTableDataCell>{user.username}</CTableDataCell>
                      <CTableDataCell>{user.email}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={user.role === 'ROLE_ADMIN' ? 'danger' : 'info'}>
                          {user.role === 'ROLE_ADMIN' ? 'Admin' : 'User'}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CButton 
                          color="danger" 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={user.role === 'ROLE_ADMIN'} // Prevent admins from deleting other admins
                        >
                          Delete
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                  {users.length === 0 && (
                    <CTableRow>
                      <CTableDataCell colSpan="5" className="text-center">
                        No users found.
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default ManageUsersPage