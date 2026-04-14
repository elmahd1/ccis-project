import React, { useState } from 'react';
import {
  CAlert,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormSwitch,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CBadge,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilWarning, cilCalendarCheck, cilBell, cilEnvelopeOpen, cilScreenSmartphone } from '@coreui/icons';

interface Echeance {
  id: number;
  type: string;
  description: string;
  date: string;
  joursRestants: number;
}

const Agenda: React.FC = () => {
  const [preferences, setPreferences] = useState({
    email: true,
    push: false,
  });

  const echeances: Echeance[] = [
    { id: 1, type: 'TVA', description: 'Déclaration TVA mensuelle (Mars)', date: '15 Avril 2026', joursRestants: 3 },
    { id: 2, type: 'IS', description: '1er Acompte Impôt sur les Sociétés', date: '01 Mai 2026', joursRestants: 15 },
    { id: 3, type: 'IR', description: 'Déclaration annuelle Impôt sur le Revenu', date: '01 Juin 2026', joursRestants: 45 },
  ];

  const handlePreferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPreferences({
      ...preferences,
      [e.target.name]: e.target.checked,
    });
  };

  return (
    <div style={{ padding: 24 }}>
      <h2 className="mb-4 d-flex align-items-center">
        <CIcon icon={cilCalendarCheck} size="xl" className="me-3 text-primary" />
        Agenda Fiscal & Échéancier
      </h2>

      <CRow>
        {/* Colonne de gauche : Les alertes et le tableau */}
        <CCol md={8}>
          {/* Alerte pour les échéances urgentes (moins de 7 jours) */}
          {echeances.some(e => e.joursRestants <= 7) && (
            <CAlert color="danger" className="d-flex align-items-center shadow-sm border-0 mb-4">
              <CIcon icon={cilWarning} className="flex-shrink-0 me-3" width={24} height={24} />
              <div>
                <strong>Action requise !</strong> Vous avez des échéances fiscales qui arrivent à terme dans moins de 7 jours.
              </div>
            </CAlert>
          )}

          <CCard className="shadow-sm border-0 mb-4">
            <CCardHeader className="bg-gray pt-3 pb-3">
              <strong className="fs-5">Prochaines Échéances</strong>
            </CCardHeader>
            <CCardBody className="p-0">
              <CTable hover responsive className="mb-0 align-middle">
                <CTableHead color="gray-100">
                  <CTableRow>
                    <CTableHeaderCell className="ps-4">Taxe</CTableHeaderCell>
                    <CTableHeaderCell>Description</CTableHeaderCell>
                    <CTableHeaderCell>Date limite</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Délai</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {echeances.map(e => (
                    <CTableRow key={e.id}>
                      <CTableDataCell className="ps-4">
                        <CBadge 
                          color={e.type === 'TVA' ? 'primary' : e.type === 'IS' ? 'success' : 'info'} 
                          shape="rounded-pill" 
                          className="px-3"
                        >
                          {e.type}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell className="fw-semibold text-muted">{e.description}</CTableDataCell>
                      <CTableDataCell>{e.date}</CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CBadge color={e.joursRestants <= 7 ? 'danger' : e.joursRestants <= 30 ? 'warning' : 'success'}>
                          Dans {e.joursRestants} jours
                        </CBadge>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Colonne de droite : Paramètres de notifications */}
        <CCol md={4}>
          <CCard className="shadow-sm border-0">
            <CCardHeader className="bg-gray pt-3 pb-3 d-flex align-items-center">
              <CIcon icon={cilBell} className="me-2 text-primary" />
              <strong className="fs-5">Mes Alertes</strong>
            </CCardHeader>
            <CCardBody>
              <p className="text-muted small mb-4">
                Ne ratez aucune échéance importante. Configurez la façon dont vous souhaitez être notifié.
              </p>
              
              <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-gray-100 rounded">
                <div className="d-flex align-items-center">
                  <CIcon icon={cilEnvelopeOpen} size="lg" className="me-3 text-secondary" />
                  <div>
                    <h6 className="mb-0">Emails de rappel</h6>
                    <small className="text-muted">7 jours avant l'échéance</small>
                  </div>
                </div>
                <CFormSwitch
                  name="email"
                  size="xl"
                  checked={preferences.email}
                  onChange={handlePreferenceChange}
                />
              </div>

              <div className="d-flex justify-content-between align-items-center p-3 bg-gray-100 rounded">
                <div className="d-flex align-items-center">
                  <CIcon icon={cilScreenSmartphone} size="lg" className="me-3 text-secondary" />
                  <div>
                    <h6 className="mb-0">Notifications Push</h6>
                    <small className="text-muted">Directement sur ce navigateur</small>
                  </div>
                </div>
                <CFormSwitch
                  name="push"
                  size="xl"
                  checked={preferences.push}
                  onChange={handlePreferenceChange}
                />
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};

export default Agenda;