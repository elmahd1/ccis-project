import React, { useState } from 'react';
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CButton,
  CAvatar,
  CBadge,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilVideo, cilLocationPin, cilCalendarCheck, cilUserFollow } from '@coreui/icons';

const Consulting: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState('');
  const [modeRDV, setModeRDV] = useState<'visio' | 'presentiel' | null>(null);

  const experts = [
    { id: 1, name: 'Siham Alami', specialite: 'Export & International', dispo: "Aujourd'hui", color: 'info' },
    { id: 2, name: 'Karim Tazi', specialite: 'Stratégie Digitale', dispo: 'Demain', color: 'primary' },
    { id: 3, name: 'Nadia Bennani', specialite: 'Ressources Humaines', dispo: 'Le 15 Nov', color: 'warning' },
    { id: 4, name: 'Youssef Filali', specialite: 'Financement & Aides', dispo: "Aujourd'hui", color: 'success' },
  ];

  const openBooking = (name: string) => {
    setSelectedExpert(name);
    setModeRDV(null); // Reset choice
    setVisible(true);
  };

  return (
    <div style={{ padding: 24 }}>
      <h2 className="mb-4 d-flex align-items-center">
        <CIcon icon={cilUserFollow} size="xl" className="me-3 text-primary" />
        Prendre rendez-vous avec un conseiller
      </h2>
      <p className="text-muted mb-4">
        Sélectionnez l'expert de la CCISMS le plus adapté à votre besoin pour un accompagnement sur-mesure.
      </p>

      <CRow>
        {experts.map((expert) => (
          <CCol md={6} xl={4} key={expert.id} className="mb-4">
            <CCard className={`h-100 shadow-sm border-0 border-top border-top-4 border-top-${expert.color}`}>
              <CCardBody className="d-flex flex-column align-items-center text-center p-4">
                <CAvatar size="xl" color={expert.color} textColor="white" className="mb-3 fs-3 shadow-sm">
                  {expert.name.charAt(0)}
                </CAvatar>
                <h5 className="mb-1">{expert.name}</h5>
                <p className="text-muted small mb-3">{expert.specialite}</p>
                <CBadge color={expert.dispo === "Aujourd'hui" ? 'success' : 'secondary'} className="mb-4 p-2">
                  <CIcon icon={cilCalendarCheck} className="me-1" /> Dispo : {expert.dispo}
                </CBadge>
                <CButton 
                  color="primary" 
                  variant="outline"
                  className="w-100 mt-auto"
                  onClick={() => openBooking(expert.name)}
                >
                  Réserver un créneau
                </CButton>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>

      {/* Modal de confirmation améliorée */}
      <CModal visible={visible} onClose={() => setVisible(false)} alignment="center">
        <CModalHeader className="bg-light border-0">
          <CModalTitle className="d-flex align-items-center">
            <CIcon icon={cilCalendarCheck} className="me-2 text-primary" />
            Rendez-vous avec {selectedExpert}
          </CModalTitle>
        </CModalHeader>
        <CModalBody className="p-4">
          <p className="text-center mb-4">Comment souhaitez-vous effectuer cette consultation ?</p>
          <CRow className="g-3">
            <CCol sm={6}>
              <div 
                className={`p-3 border rounded text-center cursor-pointer transition-all ${modeRDV === 'visio' ? 'border-primary bg-light' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => setModeRDV('visio')}
              >
                <CIcon icon={cilVideo} size="xxl" className={`mb-2 ${modeRDV === 'visio' ? 'text-primary' : 'text-muted'}`} />
                <h6 className="mb-0">Visioconférence</h6>
                <small className="text-muted">Google Meet / Zoom</small>
              </div>
            </CCol>
            <CCol sm={6}>
              <div 
                className={`p-3 border rounded text-center cursor-pointer transition-all ${modeRDV === 'presentiel' ? 'border-primary bg-light' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => setModeRDV('presentiel')}
              >
                <CIcon icon={cilLocationPin} size="xxl" className={`mb-2 ${modeRDV === 'presentiel' ? 'text-primary' : 'text-muted'}`} />
                <h6 className="mb-0">En présentiel</h6>
                <small className="text-muted">Dans les locaux de la CCIS</small>
              </div>
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter className="border-0 bg-light">
          <CButton color="secondary" variant="ghost" onClick={() => setVisible(false)}>Annuler</CButton>
          <CButton color="primary" disabled={!modeRDV}>Confirmer la réservation</CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default Consulting;