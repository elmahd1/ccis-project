import React, { useState } from 'react';
import {
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CCard,
  CCardBody,
  CCardTitle,
  CCardImage,
  CRow,
  CCol,
  CButton,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilInstitution } from '@coreui/icons';

const Partenaires: React.FC = () => {
  const [activeTab, setActiveTab] = useState('maroc-pme');

  const partenaires = {
    'maroc-pme': {
      name: 'Maroc PME',
      programs: [
        { id: 1, title: 'Tatweer Croissance', logo: 'https://picsum.photos/400/150?random=10', description: 'Accompagnement à la croissance industrielle.' },
        { id: 2, title: 'Nawat', logo: 'https://picsum.photos/400/150?random=11', description: 'Appui conseil pour les TPE.' },
      ],
    },
    'dar-al-moukawil': {
      name: 'Dar Al Moukawil',
      programs: [
        { id: 3, title: 'Certification Entrepreneur', logo: 'https://picsum.photos/400/150?random=12', description: 'Formation validante sur 6 mois.' },
      ],
    },
  };

  return (
    <div style={{ padding: 24 }}>
      <h2 className="mb-4">Programmes Partenaires</h2>
      
      {/* Navigation en mode "Pills" (plus moderne que "tabs") */}
      <CNav variant="pills" className="mb-4 bg-white p-2 rounded shadow-sm d-inline-flex">
        <CNavItem>
          <CNavLink 
            active={activeTab === 'maroc-pme'} 
            onClick={() => setActiveTab('maroc-pme')}
            style={{ cursor: 'pointer' }}
          >
            <CIcon icon={cilInstitution} className="me-2" />
            Maroc PME
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink 
            active={activeTab === 'dar-al-moukawil'} 
            onClick={() => setActiveTab('dar-al-moukawil')}
            style={{ cursor: 'pointer' }}
          >
            <CIcon icon={cilInstitution} className="me-2" />
            Dar Al Moukawil
          </CNavLink>
        </CNavItem>
      </CNav>

      <CTabContent>
        {Object.entries(partenaires).map(([key, partenaire]) => (
          <CTabPane key={key} visible={activeTab === key}>
            <h4 className="mb-3 text-primary">{partenaire.name}</h4>
            <CRow>
              {partenaire.programs.map((program) => (
                <CCol md={4} key={program.id} className="mb-4">
                  <CCard className="h-100 shadow-sm border-0">
                    <CCardImage orientation="top" src={program.logo} />
                    <CCardBody className="d-flex flex-column">
                      <CCardTitle>{program.title}</CCardTitle>
                      <p className="text-muted flex-grow-1">{program.description}</p>
                      <CButton color="primary" className="mt-3">Postuler au programme</CButton>
                    </CCardBody>
                  </CCard>
                </CCol>
              ))}
            </CRow>
          </CTabPane>
        ))}
      </CTabContent>
    </div>
  );
};

export default Partenaires;