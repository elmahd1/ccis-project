import React, { useState } from 'react';
import {
  CForm,
  CFormSelect,
  CFormLabel,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCardTitle,
  CCardFooter,
  CBadge,
  CRow,
  CCol,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CProgress,
  CProgressBar,
  CFormCheck,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilWallet, cilIndustry, cilMoney, cilPeople, cilCheckCircle, cilBalance } from '@coreui/icons';

interface Programme {
  id: number;
  nom: string;
  type: 'Subvention' | 'Prêt' | 'Accompagnement';
  status: 'Ouvert' | 'Bientôt disponible';
  secteur: string;
  description: string;
  matchScore: number;
}

const Financement: React.FC = () => {
  const [profil, setProfil] = useState({ secteur: '', ca: '', effectif: '' });
  const [compareIds, setCompareIds] = useState<number[]>([]);

  // Mock data avec un score de compatibilité ajouté
  const programmes: Programme[] = [
    { id: 1, nom: 'Programme PME Export', type: 'Subvention', status: 'Ouvert', secteur: 'Export', description: 'Appui financier pour la prospection à l\'international.', matchScore: 90 },
    { id: 2, nom: 'Crédit Relance', type: 'Prêt', status: 'Ouvert', secteur: 'Tous secteurs', description: 'Prêt garanti par l\'état pour soutenir la trésorerie.', matchScore: 65 },
    { id: 3, nom: 'Tatweer Croissance', type: 'Accompagnement', status: 'Bientôt disponible', secteur: 'Industrie', description: 'Accompagnement technique et aide à l\'investissement.', matchScore: 40 },
  ];

  const handleCompareToggle = (id: number) => {
    if (compareIds.includes(id)) {
      setCompareIds(compareIds.filter((compareId) => compareId !== id));
    } else if (compareIds.length < 2) {
      setCompareIds([...compareIds, id]);
    } else {
      alert('Vous ne pouvez comparer que 2 programmes à la fois.');
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2 className="mb-4 d-flex align-items-center">
        <CIcon icon={cilWallet} size="xl" className="me-3 text-primary" />
        Matchmaking de Financement
      </h2>

      <CRow>
        {/* Colonne de gauche : Formulaire de Profil */}
        <CCol md={4}>
          <CCard className="shadow-sm border-0 mb-4 sticky-top" style={{ top: '20px' }}>
            <CCardHeader className="bg-light">
              <strong>Profil de l'entreprise</strong>
            </CCardHeader>
            <CCardBody>
              <CForm>
                <div className="mb-3">
                  <CFormLabel>Secteur d'activité</CFormLabel>
                  <CInputGroup>
                    <CInputGroupText><CIcon icon={cilIndustry} /></CInputGroupText>
                    <CFormSelect value={profil.secteur} onChange={(e) => setProfil({ ...profil, secteur: e.target.value })}>
                      <option value="">Tous les secteurs</option>
                      <option value="Industrie">Industrie</option>
                      <option value="Export">Export</option>
                      <option value="Services">Services</option>
                    </CFormSelect>
                  </CInputGroup>
                </div>
                <div className="mb-3">
                  <CFormLabel>Chiffre d'Affaires (en DH)</CFormLabel>
                  <CInputGroup>
                    <CInputGroupText><CIcon icon={cilMoney} /></CInputGroupText>
                    <CFormInput type="number" placeholder="Ex: 5000000" value={profil.ca} onChange={(e) => setProfil({ ...profil, ca: e.target.value })} />
                  </CInputGroup>
                </div>
                <div className="mb-4">
                  <CFormLabel>Effectif actuel</CFormLabel>
                  <CInputGroup>
                    <CInputGroupText><CIcon icon={cilPeople} /></CInputGroupText>
                    <CFormInput type="number" placeholder="Ex: 15" value={profil.effectif} onChange={(e) => setProfil({ ...profil, effectif: e.target.value })} />
                  </CInputGroup>
                </div>
                <CButton color="primary" className="w-100">Actualiser les résultats</CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Colonne de droite : Résultats des Programmes */}
        <CCol md={8}>
          <div className="mb-3 d-flex justify-content-between align-items-center">
            <h5 className="mb-0 text-muted">{programmes.length} programmes trouvés</h5>
          </div>

          {programmes.map((prog) => (
            <CCard key={prog.id} className="shadow-sm border-0 mb-4">
              <CCardBody>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <CCardTitle className="fs-5">{prog.nom}</CCardTitle>
                  <CBadge color={prog.status === 'Ouvert' ? 'success' : 'warning'} shape="rounded-pill">
                    {prog.status}
                  </CBadge>
                </div>
                
                <CBadge color={prog.type === 'Subvention' ? 'info' : prog.type === 'Prêt' ? 'primary' : 'secondary'} className="mb-3 me-2">
                  {prog.type}
                </CBadge>
                <CBadge color="light" textColor="dark" className="mb-3">Secteur : {prog.secteur}</CBadge>

                <p className="text-muted">{prog.description}</p>

                <div className="mt-3">
                  <div className="d-flex justify-content-between mb-1 small">
                    <strong>Score de compatibilité</strong>
                    <span className="text-success fw-bold">{prog.matchScore}%</span>
                  </div>
                  <CProgress thin>
                    <CProgressBar color={prog.matchScore >= 80 ? 'success' : prog.matchScore >= 50 ? 'warning' : 'danger'} value={prog.matchScore} />
                  </CProgress>
                </div>
              </CCardBody>
              <CCardFooter className="bg-white border-top-0 d-flex justify-content-between align-items-center pb-3">
                <CFormCheck 
                  id={`compare-${prog.id}`} 
                  label="Comparer" 
                  checked={compareIds.includes(prog.id)}
                  onChange={() => handleCompareToggle(prog.id)}
                />
                <CButton color="primary" variant="outline" size="sm">
                  Voir les détails <CIcon icon={cilCheckCircle} className="ms-2" />
                </CButton>
              </CCardFooter>
            </CCard>
          ))}

          {/* Zone de Comparaison (S'affiche uniquement si au moins 1 programme est sélectionné) */}
          {compareIds.length > 0 && (
            <CCard className="shadow border-primary mt-5">
              <CCardHeader className="bg-primary text-white d-flex align-items-center">
                <CIcon icon={cilScale} className="me-2" />
                <strong>Comparateur de Programmes</strong>
              </CCardHeader>
              <CCardBody>
                <CTable hover responsive align="middle">
                  <CTableHead color="light">
                    <CTableRow>
                      <CTableHeaderCell>Critère</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">{programmes.find(p => p.id === compareIds[0])?.nom}</CTableHeaderCell>
                      {compareIds.length === 2 && (
                        <CTableHeaderCell className="text-center">{programmes.find(p => p.id === compareIds[1])?.nom}</CTableHeaderCell>
                      )}
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    <CTableRow>
                      <CTableDataCell className="fw-semibold">Type d'aide</CTableDataCell>
                      <CTableDataCell className="text-center"><CBadge color="info">{programmes.find(p => p.id === compareIds[0])?.type}</CBadge></CTableDataCell>
                      {compareIds.length === 2 && <CTableDataCell className="text-center"><CBadge color="info">{programmes.find(p => p.id === compareIds[1])?.type}</CBadge></CTableDataCell>}
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell className="fw-semibold">Statut</CTableDataCell>
                      <CTableDataCell className="text-center">{programmes.find(p => p.id === compareIds[0])?.status}</CTableDataCell>
                      {compareIds.length === 2 && <CTableDataCell className="text-center">{programmes.find(p => p.id === compareIds[1])?.status}</CTableDataCell>}
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell className="fw-semibold">Secteur Cible</CTableDataCell>
                      <CTableDataCell className="text-center">{programmes.find(p => p.id === compareIds[0])?.secteur}</CTableDataCell>
                      {compareIds.length === 2 && <CTableDataCell className="text-center">{programmes.find(p => p.id === compareIds[1])?.secteur}</CTableDataCell>}
                    </CTableRow>
                  </CTableBody>
                </CTable>
              </CCardBody>
            </CCard>
          )}
        </CCol>
      </CRow>
    </div>
  );
};

export default Financement;