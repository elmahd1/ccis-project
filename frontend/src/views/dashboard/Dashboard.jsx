import React, { useState, useEffect } from 'react'
import {
  CButton,
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
  CAvatar,
  CWidgetStatsA,
  CSpinner,
  CBadge
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPeople, cilTrash, cilPlus, cilBank } from '@coreui/icons'

// Import the same axios instance used in your other pages
import axiosInstance from '../../api/axiosInstance'
import avatarDefault from 'src/assets/images/avatars/image.png'

const Dashboard = () => {
  const [users, setUsers] = useState([])
  const [organizations, setOrganizations] = useState([])
  const [pendingCount, setPendingCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    setLoading(true)
    try {
      // Use Promise.all to fetch everything in parallel using your axiosInstance
      const [userRes, orgRes, demandRes] = await Promise.all([
        axiosInstance.get('/users/all'),
        axiosInstance.get('/organizations/all'),
        axiosInstance.get('/employee/demandes/pending')
      ])

      setUsers(userRes.data)
      setOrganizations(orgRes.data)
      
      // Calculate pending total from the combined endpoint
      const totalPending = (demandRes.data.demarches?.length || 0) + 
                           (demandRes.data.espaces?.length || 0) + 
                           (demandRes.data.salles?.length || 0)
      setPendingCount(totalPending)

    } catch (error) {
      console.error("Dashboard data fetch failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (id) => {
    if (window.confirm("Delete this user?")) {
      try {
        await axiosInstance.delete(`/users/${id}`)
        fetchAllData()
      } catch (err) {
        alert("Action failed: " + (err.response?.data || "Server error"))
      }
    }
  }

  if (loading) {
    return (
      <div className="pt-3 text-center">
        <CSpinner color="primary" variant="grow" />
      </div>
    )
  }

  return (
    <>
      {/* Top Stats Cards */}
      <CRow className="mb-4">
        <CCol sm={6} lg={4}>
          <CWidgetStatsA
            color="primary"
            value={users.length}
            title="Total Users"
          />
        </CCol>
        <CCol sm={6} lg={4}>
          <CWidgetStatsA
            color="info"
            value={organizations.length}
            title="Organizations"
          />
        </CCol>
        <CCol sm={6} lg={4}>
          <CWidgetStatsA
            color="warning"
            value={pendingCount}
            title="Pending Demands"
          />
        </CCol>
      </CRow>

      <CRow>
        {/* User Management Snippet */}
        <CCol lg={7}>
          <CCard className="mb-4">
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <strong>Recent Users</strong>
              <CButton color="primary" size="sm" href="#/users">View All</CButton>
            </CCardHeader>
            <CCardBody>
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="bg-body-tertiary text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="text-center"><CIcon icon={cilPeople} /></CTableHeaderCell>
                    <CTableHeaderCell>User</CTableHeaderCell>
                    <CTableHeaderCell>Role</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {users.slice(0, 5).map((user) => (
                    <CTableRow key={user.id}>
                      <CTableDataCell className="text-center">
                        <CAvatar src={avatarDefault} />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{user.username}</div>
                        <div className="small text-body-secondary">{user.email}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={user.role === 'ROLE_ADMIN' ? 'danger' : 'info'}>
                          {user.role}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CButton color="link" onClick={() => handleDeleteUser(user.id)}>
                          <CIcon icon={cilTrash} className="text-danger" />
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Organization Snippet */}
        <CCol lg={5}>
          <CCard className="mb-4">
            <CCardHeader><strong>Recent Organizations</strong></CCardHeader>
            <CCardBody>
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="bg-body-tertiary">
                  <CTableRow>
                    <CTableHeaderCell><CIcon icon={cilBank} /></CTableHeaderCell>
                    <CTableHeaderCell>Name</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {organizations.slice(0, 5).map((org) => (
                    <CTableRow key={org.id}>
                      <CTableDataCell className="text-center">{org.id}</CTableDataCell>
                      <CTableDataCell>
                        <div>{org.name}</div>
                        <div className="small text-body-secondary">{org.type}</div>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard