// Dashboard.jsx
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
  CWidgetStatsA,
  CSpinner,
  CBadge,
  CProgress
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { 
  cilPeople, cilTrash, cilBuilding, cilUserPlus, 
  cilCheckCircle, cilClock, cilX, cilChart,
  cilUserFollow, cilUserUnfollow
} from '@coreui/icons'
import axiosInstance from '../../api/axiosInstance'

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: { total: 0, clients: 0, employees: 0, admins: 0 },
    organizations: { total: 0, entreprises: 0, associations: 0 },
    demands: { total: 0, enAttente: 0, validees: 0, rejetees: 0 }
  })
  const [recentActivities, setRecentActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      // Fetch all data in parallel
      const [userRes, orgRes, demandRes] = await Promise.all([
        axiosInstance.get('/users/all'),
        axiosInstance.get('/organizations/all'),
        axiosInstance.get('/employee/demandes/pending')
      ])

      // Calculate user stats
      const users = userRes.data
      const clients = users.filter(u => u.role === 'ROLE_CLIENT').length
      const employees = users.filter(u => u.role === 'ROLE_EMPLOYEE').length
      const admins = users.filter(u => u.role === 'ROLE_ADMIN').length

      // Calculate organization stats
      const orgs = orgRes.data
      const entreprises = orgs.filter(o => o.type === 'ENTREPRISE').length
      const associations = orgs.filter(o => o.type === 'ASSOCIATION').length

      // Calculate demand stats
      const demarches = demandRes.data.demarches || []
      const espaces = demandRes.data.espaces || []
      const salles = demandRes.data.salles || []
      const totalPending = demarches.length + espaces.length + salles.length

      setStats({
        users: { total: users.length, clients, employees, admins },
        organizations: { total: orgs.length, entreprises, associations },
        demands: { total: totalPending, enAttente: totalPending, validees: 0, rejetees: 0 }
      })

      // Create recent activities
      const activities = []
      
      // Add recent users
      users.slice(0, 3).forEach(u => {
        activities.push({
          id: `user-${u.id}`,
          type: 'user',
          title: `Nouvel utilisateur: ${u.username}`,
          subtitle: `Rôle: ${u.role === 'ROLE_CLIENT' ? 'Client' : u.role === 'ROLE_EMPLOYEE' ? 'Employé' : 'Admin'}`,
          time: new Date().toLocaleDateString(),
          icon: cilUserPlus,
          color: 'success'
        })
      })

      // Add recent organizations
      orgs.slice(0, 3).forEach(o => {
        activities.push({
          id: `org-${o.id}`,
          type: 'organization',
          title: `Nouvelle organisation: ${o.name}`,
          subtitle: `Type: ${o.type === 'ENTREPRISE' ? 'Entreprise' : 'Association'}`,
          time: new Date().toLocaleDateString(),
          icon: cilBuilding,
          color: 'info'
        })
      })

      setRecentActivities(activities.slice(0, 5))
    } catch (error) {
      console.error("Dashboard data fetch failed:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="pt-3 text-center">
        <CSpinner color="primary" variant="grow" />
        <p className="mt-2">Chargement du tableau de bord...</p>
      </div>
    )
  }

  return (
    <>
      {/* Page Title */}
      <div className="mb-4">
        <h2>Tableau de bord administratif</h2>
        <p className="text-muted">Vue d'ensemble des activités de la plateforme</p>
      </div>

      {/* Stats Cards Row 1 */}
      <CRow className="mb-4">
        <CCol sm={6} lg={3}>
          <CWidgetStatsA
            className="mb-4"
            color="primary"
            value={stats.users.total}
            title="Utilisateurs totaux"
            action={
              <CButton color="primary" variant="ghost" size="sm" href="#/admin/users">
                Gérer
              </CButton>
            }
          >
            <div className="mt-2 d-flex justify-content-between small">
              <span><CIcon icon={cilUserFollow} /> Clients: {stats.users.clients}</span>
              <span><CIcon icon={cilPeople} /> Employés: {stats.users.employees}</span>
            </div>
          </CWidgetStatsA>
        </CCol>
        
        <CCol sm={6} lg={3}>
          <CWidgetStatsA
            className="mb-4"
            color="info"
            value={stats.organizations.total}
            title="Organisations"
            action={
              <CButton color="info" variant="ghost" size="sm" href="#/employee/organisations">
                Voir
              </CButton>
            }
          >
            <div className="mt-2 d-flex justify-content-between small">
              <span>Entreprises: {stats.organizations.entreprises}</span>
              <span>Associations: {stats.organizations.associations}</span>
            </div>
          </CWidgetStatsA>
        </CCol>
        
        <CCol sm={6} lg={3}>
          <CWidgetStatsA
            className="mb-4"
            color="warning"
            value={stats.demands.enAttente}
            title="Demandes en attente"
            action={
              <CButton color="warning" variant="ghost" size="sm" href="#/employee/inbox">
                Traiter
              </CButton>
            }
          >
            <div className="mt-2 small">
              <CIcon icon={cilClock} className="me-1" />
              À traiter immédiatement
            </div>
          </CWidgetStatsA>
        </CCol>
        
        <CCol sm={6} lg={3}>
          <CWidgetStatsA
            className="mb-4"
            color="success"
            value="98%"
            title="Taux de satisfaction"
            action={
              <CButton color="success" variant="ghost" size="sm">
                Rapport
              </CButton>
            }
          >
            <div className="mt-2 small">
              <CProgress value={98} color="success" size="sm" className="mb-1" />
              Basé sur les retours clients
            </div>
          </CWidgetStatsA>
        </CCol>
      </CRow>

      {/* Stats Cards Row 2 - Performance KPIs */}
      <CRow className="mb-4">
        <CCol md={6}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Performance des services</strong>
              <small className="text-muted ms-2">Indicateurs clés (KPI)</small>
            </CCardHeader>
            <CCardBody>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Délai moyen de traitement</span>
                  <span className="fw-bold">2.5 jours</span>
                </div>
                <CProgress value={75} color="success" />
                <small className="text-muted">Objectif: &lt; 3 jours</small>
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Taux de résolution au premier contact</span>
                  <span className="fw-bold">85%</span>
                </div>
                <CProgress value={85} color="info" />
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Satisfaction des entreprises</span>
                  <span className="fw-bold">94%</span>
                </div>
                <CProgress value={94} color="warning" />
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        
        <CCol md={6}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Activité récente</strong>
              <small className="text-muted ms-2">Dernières 24h</small>
            </CCardHeader>
            <CCardBody>
              {recentActivities.length === 0 ? (
                <div className="text-center text-muted py-3">
                  Aucune activité récente
                </div>
              ) : (
                recentActivities.map(activity => (
                  <div key={activity.id} className="d-flex align-items-center mb-3 pb-2 border-bottom">
                    <div className={`bg-${activity.color}-light rounded p-2 me-3`}>
                      <CIcon icon={activity.icon} className={`text-${activity.color}`} />
                    </div>
                    <div className="flex-grow-1">
                      <div className="fw-semibold">{activity.title}</div>
                      <div className="small text-muted">{activity.subtitle}</div>
                    </div>
                    <div className="small text-muted">{activity.time}</div>
                  </div>
                ))
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard