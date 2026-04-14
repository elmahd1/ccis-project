import React from 'react';
import {
  CRow,
  CCol,
  CProgress,
  CProgressBar,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CCard,
  CCardBody,
  CCardHeader,
  CBadge,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilClock, cilBadge, cilEducation } from '@coreui/icons';

const TableDeBord: React.FC = () => {
  const stats = [
    { label: 'Heures de formation', value: '120h', icon: cilClock, color: 'info' },
    { label: 'Certificats obtenus', value: '5', icon: cilBadge, color: 'success' },
    { label: 'Formations suivies', value: '12', icon: cilEducation, color: 'primary' },
  ];

  const progressions = [
    { skill: 'Gestion RH', percentage: 80, color: 'success' },
    { skill: 'IT Avancé', percentage: 60, color: 'warning' },
    { skill: 'Management', percentage: 90, color: 'info' },
  ];

  const historique = [
    { formation: 'Management d\'Équipe', date: '2023-11-15', status: 'Terminée' },
    { formation: 'Introduction à l\'IA', date: '2023-12-01', status: 'En cours' },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2 className="mb-4">Tableau de bord "Compétences"</h2>

      {/* Statistiques rapides en mode "Cartes premium" */}
      <CRow className="mb-4">
        {stats.map((stat, index) => (
          <CCol md={4} key={index} className="mb-3">
            <CCard className={`border-start border-start-4 border-start-${stat.color}`}>
              <CCardBody className="d-flex align-items-center">
                <div className={`bg-${stat.color} text-white p-3 rounded me-3`}>
                  <CIcon icon={stat.icon} size="xl" />
                </div>
                <div>
                  <div className="fs-4 fw-semibold">{stat.value}</div>
                  <div className="text-medium-emphasis text-uppercase fw-semibold small">
                    {stat.label}
                  </div>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>

      <CRow>
        {/* Progression des compétences */}
        <CCol md={6}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Progression par compétence</strong>
            </CCardHeader>
            <CCardBody>
              {progressions.map((prog, index) => (
                <div key={index} className="mb-4">
                  <div className="d-flex justify-content-between mb-1">
                    <span>{prog.skill}</span>
                    <span className="fw-semibold">{prog.percentage}%</span>
                  </div>
                  <CProgress thin>
                    <CProgressBar color={prog.color} value={prog.percentage} />
                  </CProgress>
                </div>
              ))}
            </CCardBody>
          </CCard>
        </CCol>

        {/* Historique des formations */}
        <CCol md={6}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Historique récent</strong>
            </CCardHeader>
            <CCardBody>
              <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Formation</CTableHeaderCell>
                    <CTableHeaderCell>Date</CTableHeaderCell>
                    <CTableHeaderCell>Statut</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {historique.map((item, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell className="fw-semibold">{item.formation}</CTableDataCell>
                      <CTableDataCell>{item.date}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={item.status === 'Terminée' ? 'success' : 'warning'}>
                          {item.status}
                        </CBadge>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};

export default TableDeBord;