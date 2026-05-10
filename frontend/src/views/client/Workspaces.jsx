import React, { useState, useEffect } from 'react';
import {
  CRow, CCol, CCard, CCardBody, CCardTitle, CCardText, CButton,
  CSpinner, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter,
  CFormInput, CFormSelect, CBadge, CTable, CTableHead, CTableRow, CTableHeaderCell, 
  CTableBody, CTableDataCell
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilBuilding, cilArrowRight, cilBriefcase, cilInstitution } from '@coreui/icons';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';

const Workspaces = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [visible, setVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

const [newOrg, setNewOrg] = useState({ 
  name: '', 
  type: 'ENTREPRISE',
  ice: '',
  formeJuridique: '',
  secteurActivite: '',
  adresse: '',
  ville: '',
  telGsm: '',
  emailContact: ''
});
  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/organizations/${user?.id}`);
      console.log("id", user?.id);
      setWorkspaces(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des espaces", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkspace = async () => {
    setIsSubmitting(true);
    try {
      await axiosInstance.post(`/organizations/create?userId=${user?.id}`, newOrg);
      setVisible(false);
      setNewOrg({ name: '', type: 'ENTREPRISE' });
      fetchWorkspaces();
    } catch (error) {
      console.error("Erreur lors de la création", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="text-center mt-5"><CSpinner color="primary" /></div>;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Mes Espaces de Travail</h2>
        <CButton color="primary" onClick={() => setVisible(true)}>
          <CIcon icon={cilPlus} className="me-2" /> Ajouter une organisation
        </CButton>
      </div>

      <CRow>
        {workspaces.length === 0 ? (
          <CCol>
            <div className="text-center text-muted mt-5 bg-light p-5 rounded">
              <CIcon icon={cilBuilding} size="3xl" className="mb-3" />
              <h4>Aucun espace trouvé</h4>
              <p>Cliquez sur le bouton pour ajouter votre première entreprise ou association.</p>
            </div>
          </CCol>
        ) : (
          workspaces.map((org) => (
            <CCol xs={12} sm={6} md={4} key={org.id} className="mb-4">
              <CCard className="h-100 shadow-sm hover-shadow cursor-pointer" onClick={() => navigate(`/client/workspace/${org.id}`)}>
                <CCardBody className="d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <CIcon icon={org.type === 'ASSOCIATION' ? cilInstitution : cilBriefcase} size="2xl" className={org.type === 'ASSOCIATION' ? "text-success" : "text-info"} />
                    <CBadge color={org.type === 'ASSOCIATION' ? "success" : "info"} shape="rounded-pill">
                      {org.type}
                    </CBadge>
                  </div>
                  <CCardTitle className="mb-2 fs-5 fw-bold">{org.name}</CCardTitle>
                  <CButton color="dark" variant="ghost" className="mt-auto align-self-start p-0 d-flex align-items-center">
                    Accéder au tableau de bord <CIcon icon={cilArrowRight} className="ms-2" />
                  </CButton>
                </CCardBody>
              </CCard>
            </CCol>
          ))
        )}
      </CRow>

      <CModal visible={visible} onClose={() => setVisible(false)} alignment="center">
        <CModalHeader onClose={() => setVisible(false)}>
          <CModalTitle>Nouvelle Organisation</CModalTitle>
        </CModalHeader>
       <CModalBody>
  <CRow>
    <CCol md={6} className="mb-3">
      <CFormInput label="Nom" value={newOrg.name} onChange={(e) => setNewOrg({...newOrg, name: e.target.value})} required />
    </CCol>
    <CCol md={6} className="mb-3">
      <CFormSelect label="Type" value={newOrg.type} onChange={(e) => setNewOrg({...newOrg, type: e.target.value})}>
        <option value="ENTREPRISE">Entreprise</option>
        <option value="ASSOCIATION">Association</option>
      </CFormSelect>
    </CCol>
    <CCol md={6} className="mb-3">
      <CFormInput label="ICE (Identifiant Commun)" value={newOrg.ice} onChange={(e) => setNewOrg({...newOrg, ice: e.target.value})} />
    </CCol>
    <CCol md={6} className="mb-3">
      <CFormInput label="Forme Juridique (SARL, etc.)" value={newOrg.formeJuridique} onChange={(e) => setNewOrg({...newOrg, formeJuridique: e.target.value})} />
    </CCol>
    <CCol md={12} className="mb-3">
      <CFormInput label="Adresse Siège" value={newOrg.adresse} onChange={(e) => setNewOrg({...newOrg, adresse: e.target.value})} />
    </CCol>
    <CCol md={6} className="mb-3">
      <CFormInput label="Téléphone GSM" value={newOrg.telGsm} onChange={(e) => setNewOrg({...newOrg, telGsm: e.target.value})} />
    </CCol>
    <CCol md={6} className="mb-3">
      <CFormInput label="Email Contact" type="email" value={newOrg.emailContact} onChange={(e) => setNewOrg({...newOrg, emailContact: e.target.value})} />
    </CCol>
  </CRow>
</CModalBody>
        <CModalFooter>
          <CButton color="secondary" variant="ghost" onClick={() => setVisible(false)}>Annuler</CButton>
          <CButton color="primary" onClick={handleCreateWorkspace} disabled={isSubmitting || !newOrg.name}>
            {isSubmitting ? <CSpinner size="sm" /> : "Créer l'espace"}
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};
export default Workspaces;