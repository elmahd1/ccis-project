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

  CAlert
} from '@coreui/react'
import axiosInstance from '../../api/axiosInstance'
const ManageUsersPage = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

// Employee accounts creation
const [visible, setVisible] = useState(false);
const [submitting, setSubmitting] = useState(false);
const [newEmployee, setNewEmployee] = useState({
  username: '',
  email: '',
  password: '',
  fullName: '' // Assuming your User entity has this
});

const handleCreateEmployee = async () => {
  try {
    setSubmitting(true);
    await axiosInstance.post('/users/create-employee', newEmployee);
    setVisible(false); // Close modal
    setNewEmployee({ username: '', email: '', password: '', fullName: '' }); // Reset
    fetchUsers(); // Refresh the table
  } catch (err) {
    alert(err.response?.data || "Failed to create employee");
  } finally {
    setSubmitting(false);
  }
};
  // Fetch users when the page loads
  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      // Calls the backend to get all users
const response = await axiosInstance.get('/users/all')
      setUsers(response.data)
      console.log("Fetched users:", response.data) // Debug log
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
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>Manage Users</strong> <small>Admin Dashboard</small>
              <CButton color="primary" onClick={() => setVisible(true)}>
              + Add Employee
              </CButton>
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
  <CBadge color={
    user.role === 'ROLE_ADMIN' ? 'danger' : 
    user.role === 'ROLE_EMPLOYEE' ? 'success' : 'info'
  }>
    {user.role === 'ROLE_ADMIN' ? 'Admin' : 
     user.role === 'ROLE_EMPLOYEE' ? 'Employé' : 'Client'}
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
        <CModal visible={visible} onClose={() => setVisible(false)}>
  <CModalHeader>
    <CModalTitle>Create Employee Account</CModalTitle>
  </CModalHeader>
  <CModalBody>
    <div className="mb-3">
      <CFormInput 
        label="Username"
        value={newEmployee.username}
        onChange={(e) => setNewEmployee({...newEmployee, username: e.target.value})}
      />
    </div>
    <div className="mb-3">
      <CFormInput 
        type="email"
        label="Email"
        value={newEmployee.email}
        onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
      />
    </div>
    <div className="mb-3">
      <CFormInput 
        type="password"
        label="Temporary Password"
        value={newEmployee.password}
        onChange={(e) => setNewEmployee({...newEmployee, password: e.target.value})}
      />
    </div>
  </CModalBody>
  <CModalFooter>
    <CButton color="secondary" onClick={() => setVisible(false)}>Cancel</CButton>
    <CButton color="primary" onClick={handleCreateEmployee} disabled={submitting}>
      {submitting ? <CSpinner size="sm"/> : "Create Account"}
    </CButton>
  </CModalFooter>
</CModal>
      </CCol>
    </CRow>
  )
}

export default ManageUsersPage