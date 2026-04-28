import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CRow, CCol, CCard, CCardBody, CCardTitle, CCardText, CButton,
  CSpinner, CBadge, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilBriefcase, cilInstitution, cilFile, cilArrowLeft, cilDescription } from '@coreui/icons';
import axiosInstance from '../../api/axiosInstance';

const OrganizationDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [organization, setOrganization] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [id]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const orgResponse = await axiosInstance.get(`/api/organizations/${id}`);
      setOrganization(orgResponse.data);

      // Fetch combined history for this organization
      const historyResponse = await axiosInstance.get(`/api/client/demandes/history/${id}`);
      setHistory(historyResponse.data);
    } catch (error) {
      console.error("Erreur lors du chargement du dashboard", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'VALIDE': return <CBadge color="success">Validé</CBadge>;
      case 'EN_ATTENTE': return <CBadge color="warning">En attente</CBadge>;
      case 'REJETE': return <CBadge color="danger">Rejeté</CBadge>;
      default: return <CBadge color="secondary">Brouillon</CBadge>;
    }
  };

  if (loading) return <div className="text-center mt-5"><CSpinner color="primary" /></div>;

  return (
    <>
      <div className="d-flex align-items-center mb-4">
        <CButton color="secondary" variant="ghost" onClick={() => navigate('/client/workspaces')} className="me-3">
          <CIcon icon={cilArrowLeft} /> Retour
        </CButton>
        <div>
          <h2 className="mb-0">{organization?.name}</h2>
          <span className="text-muted">{organization?.type}</span>
        </div>
      </div>

      <h4 className="mb-3">Nouvelle Demande</h4>
      <CRow className="mb-5">
        <CCol md={4} className="mb-3">
          <CCard className="h-100 text-center border-primary border-top-3 shadow-sm hover-shadow">
            <CCardBody className="d-flex flex-column align-items-center p-4">
              <CIcon icon={cilInstitution} size="3xl" className="text-primary mb-3" />
              <CCardTitle>Demander une Salle</CCardTitle>
              <CCardText className="text-muted small">Réservez une salle pour vos réunions ou assemblées générales.</CCardText>
              <CButton color="primary" className="mt-auto w-100" onClick={() => navigate(`/client/nouvelle-demande/salle/${id}`)}>Demander</CButton>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={4} className="mb-3">
          <CCard className="h-100 text-center border-info border-top-3 shadow-sm hover-shadow">
            <CCardBody className="d-flex flex-column align-items-center p-4">
              <CIcon icon={cilFile} size="3xl" className="text-info mb-3" />
              <CCardTitle>Démarche Administrative</CCardTitle>
              <CCardText className="text-muted small">Demandez des attestations, visas de factures, et certificats.</CCardText>
              <CButton color="info" className="mt-auto w-100 text-white" onClick={() => navigate(`/client/nouvelle-demande/administrative/${id}`)}>Démarrer</CButton>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={4} className="mb-3">
          <CCard className="h-100 text-center border-success border-top-3 shadow-sm hover-shadow">
            <CCardBody className="d-flex flex-column align-items-center p-4">
              <CIcon icon={cilBriefcase} size="3xl" className="text-success mb-3" />
              <CCardTitle>Espace Entreprise</CCardTitle>
              <CCardText className="text-muted small">Sollicitez un accompagnement et des conseils personnalisés.</CCardText>
              <CButton color="success" className="mt-auto w-100 text-white" onClick={() => navigate(`/client/nouvelle-demande/espace/${id}`)}>Accéder</CButton>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CCard className="shadow-sm">
        <CCardHeader className="bg-light d-flex align-items-center">
          <CIcon icon={cilDescription} className="me-2" /> <strong>Historique des demandes</strong>
        </CCardHeader>
        <CCardBody>
          {history.length === 0 ? (
            <p className="text-center text-muted py-4">Aucune demande soumise pour le moment.</p>
          ) : (
            <CTable hover responsive align="middle">
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell>Référence</CTableHeaderCell>
                  <CTableHeaderCell>Catégorie</CTableHeaderCell>
                  <CTableHeaderCell>Date de dépôt</CTableHeaderCell>
                  <CTableHeaderCell>Statut</CTableHeaderCell>
                  <CTableHeaderCell className="text-end">Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {history.map((item) => (
                  <CTableRow key={item.id}>
                    <CTableDataCell><strong>#{item.reference}</strong></CTableDataCell>
                    <CTableDataCell>{item.typeDemande}</CTableDataCell>
                    <CTableDataCell>{new Date(item.dateDepot).toLocaleDateString()}</CTableDataCell>
                    <CTableDataCell>{getStatusBadge(item.status)}</CTableDataCell>
                    <CTableDataCell className="text-end">
                      {item.status === 'VALIDE' ? (
                        <CButton color="success" size="sm" variant="outline">Télécharger Document</CButton>
                      ) : item.status === 'REJETE' ? (
                        <span className="text-danger small">{item.motifRejet || 'Aucun motif fourni'}</span>
                      ) : (
                         <span className="text-muted small">Traitement en cours...</span>
                      )}
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          )}
        </CCardBody>
      </CCard>
    </>
  );
};
export default OrganizationDashboard;