import React, { useState } from 'react';
import {
  CCard,
  CCardBody,
  CCardImage,
  CCardTitle,
  CCardText,
  CCardFooter,
  CBadge,
  CFormSelect,
  CFormInput,
  CButton,
  CPagination,
  CPaginationItem,
  CRow,
  CCol,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSearch, cilLocationPin, cilTags, cilArrowRight } from '@coreui/icons';

interface Formation {
  id: number;
  title: string;
  image: string;
  status: 'En ligne' | 'Présentiel';
  lieu: string;
  thematique: string;
  niveau: string;
}

const Catalogue: React.FC = () => {
  const [search, setSearch] = useState('');
  const [lieu, setLieu] = useState('');
  const [thematique, setThematique] = useState('');
  const [niveau, setNiveau] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Mock data avec des images par défaut via picsum pour le test
  const formations: Formation[] = [
    { id: 1, title: 'Développement React Avancé', image: 'https://picsum.photos/400/200?random=1', status: 'En ligne', lieu: 'Rabat', thematique: 'IT', niveau: 'Intermédiaire' },
    { id: 2, title: 'Leadership & Management', image: 'https://picsum.photos/400/200?random=2', status: 'Présentiel', lieu: 'Casablanca', thematique: 'Management', niveau: 'Débutant' },
  ];

  const filteredFormations = formations.filter(f =>
    f.title.toLowerCase().includes(search.toLowerCase()) &&
    (lieu === '' || f.lieu === lieu) &&
    (thematique === '' || f.thematique === thematique) &&
    (niveau === '' || f.niveau === niveau)
  );

  const totalPages = Math.ceil(filteredFormations.length / itemsPerPage);
  const paginatedFormations = filteredFormations.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div style={{ padding: 24 }}>
      <h2 className="mb-4">Catalogue interactif des formations</h2>

      {/* Barre de Filtres Améliorée */}
      <CCard className="mb-5 shadow-sm">
        <CCardBody>
          <CRow className="g-3">
            <CCol md={3}>
              <CInputGroup>
                <CInputGroupText><CIcon icon={cilSearch} /></CInputGroupText>
                <CFormInput placeholder="Rechercher une formation..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </CInputGroup>
            </CCol>
            <CCol md={3}>
              <CInputGroup>
                <CInputGroupText><CIcon icon={cilLocationPin} /></CInputGroupText>
                <CFormSelect value={lieu} onChange={(e) => setLieu(e.target.value)}>
                  <option value="">Tous les lieux</option>
                  <option value="Rabat">Rabat</option>
                  <option value="Casablanca">Casablanca</option>
                </CFormSelect>
              </CInputGroup>
            </CCol>
            <CCol md={3}>
              <CInputGroup>
                <CInputGroupText><CIcon icon={cilTags} /></CInputGroupText>
                <CFormSelect value={thematique} onChange={(e) => setThematique(e.target.value)}>
                  <option value="">Toutes les thématiques</option>
                  <option value="IT">IT</option>
                  <option value="Management">Management</option>
                </CFormSelect>
              </CInputGroup>
            </CCol>
            <CCol md={3}>
              <CFormSelect value={niveau} onChange={(e) => setNiveau(e.target.value)}>
                <option value="">Tous les niveaux</option>
                <option value="Débutant">Débutant</option>
                <option value="Intermédiaire">Intermédiaire</option>
              </CFormSelect>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* Grille des Formations */}
      <CRow>
        {paginatedFormations.map((formation) => (
          <CCol md={4} key={formation.id} className="mb-4">
            <CCard className="h-100 shadow-sm border-0">
              <CCardImage orientation="top" src={formation.image} />
              <CCardBody>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <CCardTitle className="fs-5">{formation.title}</CCardTitle>
                  <CBadge color={formation.status === 'En ligne' ? 'success' : 'info'} shape="rounded-pill">
                    {formation.status}
                  </CBadge>
                </div>
                <CCardText className="text-muted small">
                  <strong>Thématique:</strong> {formation.thematique} <br/>
                  <strong>Niveau:</strong> {formation.niveau}
                </CCardText>
              </CCardBody>
              <CCardFooter className="bg-white border-top-0">
                <CButton color="primary" variant="outline" className="w-100">
                  Voir les détails <CIcon icon={cilArrowRight} className="ms-2" />
                </CButton>
              </CCardFooter>
            </CCard>
          </CCol>
        ))}
      </CRow>

      {/* Pagination */}
      {totalPages > 1 && (
        <CPagination align="center" className="mt-4">
          <CPaginationItem disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Précédent</CPaginationItem>
          {Array.from({ length: totalPages }, (_, i) => (
            <CPaginationItem key={i + 1} active={i + 1 === currentPage} onClick={() => setCurrentPage(i + 1)}>{i + 1}</CPaginationItem>
          ))}
          <CPaginationItem disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Suivant</CPaginationItem>
        </CPagination>
      )}
    </div>
  );
};

export default Catalogue;