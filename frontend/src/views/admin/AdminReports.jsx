// AdminReports.jsx
import React, { useState, useEffect } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CButton, CSpinner, CAlert } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload, cilChart } from '@coreui/icons'
import axiosInstance from '../../api/axiosInstance'

const AdminReports = () => {
  const [loading, setLoading] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    setLoading(true)
    try {
      const [users, orgs, demands] = await Promise.all([
        axiosInstance.get('/users/all'),
        axiosInstance.get('/organizations/all'),
        axiosInstance.get('/employee/demandes/pending')
      ])
      
      setStats({
        users: users.data.length,
        clients: users.data.filter(u => u.role === 'ROLE_CLIENT').length,
        employees: users.data.filter(u => u.role === 'ROLE_EMPLOYEE').length,
        organizations: orgs.data.length,
        entreprises: orgs.data.filter(o => o.type === 'ENTREPRISE').length,
        associations: orgs.data.filter(o => o.type === 'ASSOCIATION').length,
        pendingDemands: (demands.data.demarches?.length || 0) + 
                        (demands.data.espaces?.length || 0) + 
                        (demands.data.salles?.length || 0)
      })
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const exportReport = async () => {
    setExportLoading(true)
    try {
      // Call your export endpoint
      const response = await axiosInstance.get('/admin/export/report', {
        responseType: 'blob'
      })
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `rapport_activite_${new Date().toISOString().split('T')[0]}.xlsx`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setExportLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <CSpinner color="primary" />
      </div>
    )
  }

  return (
    <>
      <div className="mb-4">
        <h2>Rapports et analyses</h2>
        <p className="text-muted">Générez des rapports d'activité et suivez les KPIs</p>
      </div>
      
      <CRow>
        <CCol md={8}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Génération de rapport</strong>
            </CCardHeader>
            <CCardBody>
              <div className="mb-4">
                <h5>Rapport d'activité mensuel</h5>
                <p>Exportez les statistiques complètes de la plateforme au format Excel</p>
                <CButton color="primary" onClick={exportReport} disabled={exportLoading}>
                  {exportLoading ? <CSpinner size="sm" className="me-2" /> : <CIcon icon={cilCloudDownload} className="me-2" />}
                  Exporter le rapport
                </CButton>
              </div>
              <hr />
              <div>
                <h5>Rapport personnalisé</h5>
                <p>Sélectionnez les données à inclure dans votre rapport</p>
                <CButton color="secondary" variant="outline" disabled>
                  En développement
                </CButton>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        
        <CCol md={4}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Statistiques rapides</strong>
            </CCardHeader>
            <CCardBody>
              {stats && (
                <>
                  <div className="mb-3">
                    <small className="text-muted">Total utilisateurs</small>
                    <h3 className="mb-0">{stats.users}</h3>
                  </div>
                  <div className="mb-3">
                    <small className="text-muted">Organisations</small>
                    <h5>{stats.organizations}</h5>
                    <div className="small text-muted">{stats.entreprises} entreprises, {stats.associations} associations</div>
                  </div>
                  <div>
                    <small className="text-muted">Demandes en attente</small>
                    <h5 className="text-warning">{stats.pendingDemands}</h5>
                  </div>
                </>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default AdminReports