import React from 'react';
import {
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
  CButton,
  CRow,
  CCol,
  CBadge,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilVideo, cilCloudDownload, cilMediaPlay, cilCheckCircle } from '@coreui/icons';

const ParcoursHybrides: React.FC = () => {
  const modules = [
    {
      id: 1,
      title: 'Module 1: Introduction au Management',
      content: 'Découvrez les bases de la gestion d\'équipe et du leadership moderne.',
      status: 'Terminé',
      supports: [
        { type: 'video', label: 'Voir la vidéo', icon: cilVideo, color: 'primary' },
        { type: 'pdf', label: 'Télécharger le cours', icon: cilCloudDownload, color: 'info' },
        { type: 'replay', label: 'Replay Webinaire', icon: cilMediaPlay, color: 'secondary' },
      ],
    },
    {
      id: 2,
      title: 'Module 2: Outils Digitaux',
      content: 'Maitrisez les nouveaux outils pour digitaliser votre structure.',
      status: 'En cours',
      supports: [
        { type: 'video', label: 'Voir la vidéo', icon: cilVideo, color: 'primary' },
        { type: 'pdf', label: 'Fiche Pratique', icon: cilCloudDownload, color: 'info' },
      ],
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Parcours Hybrides (Blended Learning)</h2>
        <CButton color="primary" size="lg">Continuer mon parcours</CButton>
      </div>
      
      <CAccordion alwaysOpen activeItemKey={2}>
        {modules.map((module) => (
          <CAccordionItem itemKey={module.id} key={module.id} className="mb-3 border rounded shadow-sm">
            <CAccordionHeader>
              <div className="d-flex align-items-center w-100 me-3">
                <span className="fw-bold fs-6">{module.title}</span>
                <CBadge 
                  color={module.status === 'Terminé' ? 'success' : 'warning'} 
                  className="ms-auto"
                >
                  {module.status}
                </CBadge>
              </div>
            </CAccordionHeader>
            <CAccordionBody>
              <p className="text-muted mb-4">{module.content}</p>
              <CRow className="g-2">
                {module.supports.map((support, index) => (
                  <CCol key={index} sm={4} md={3}>
                    <CButton color={support.color} variant="outline" className="w-100 d-flex align-items-center justify-content-center">
                      <CIcon icon={support.icon} className="me-2" />
                      {support.label}
                    </CButton>
                  </CCol>
                ))}
              </CRow>
            </CAccordionBody>
          </CAccordionItem>
        ))}
      </CAccordion>
    </div>
  );
};

export default ParcoursHybrides;