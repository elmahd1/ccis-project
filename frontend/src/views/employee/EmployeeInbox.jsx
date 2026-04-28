import React, { useState, useEffect } from 'react';
import {
  CCard, CCardBody, CCardHeader, CCol, CRow, CTable, CTableBody, CTableDataCell,
  CTableHead, CTableHeaderCell, CTableRow, CButton, CSpinner, CNav, CNavItem, CNavLink, 
  CTabContent, CTabPane, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CFormTextarea, CBadge
} from '@coreui/react';
import { cilCheckCircle, cilBan, cilSearch } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import axiosInstance from '../../api/axiosInstance';

const EmployeeInbox = () => {
  const [activeTab, setActiveTab] = useState('administrative');
  const [demarches, setDemarches] = useState({ administrative: [], espace: [], salle: [] });
  const [loading, setLoading] = useState(true);

  const [rejectModal, setRejectModal] = useState(false);
  const [rejectInfo, setRejectInfo] = useState({ type: '', id: '', observation: '' });

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    setLoading(true);
    try {
      const [adminRes, espaceRes, salleRes] = await Promise.all([
        axiosInstance.get('/api/employee/demandes/administrative/pending').catch(()=>({data:[]})),
        axiosInstance.get('/api/employee/demandes/espace/pending').catch(()=>({data:[]})),
        axiosInstance.get('/api/employee/demandes/salle/pending').catch(()=>({data:[]}))
      ]);
      setDemarches({
        administrative: adminRes.data,
        espace: espaceRes.data,
        salle: salleRes.data
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des demandes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async (type, id) => {
    if (!window.confirm("Valider cette demande et générer le document officiel ?")) return;
    try {
      // Validates and triggers document generation in the backend
      await axiosInstance.put(`/api/employee/demandes/${type}/${id}/validate`);
      fetchPendingRequests();
    } catch (error) {
      alert("Erreur lors de la validation.");
    }
  };

  const handleReject = async () => {
    if (!rejectInfo.observation.trim()) return alert("Veuillez saisir un motif de rejet.");
    try {
      await axiosInstance.put(`/api/employee/demandes/${rejectInfo.type}/${rejectInfo.id}/reject`, {
         observation: rejectInfo.observation 
      });
      setRejectModal(false);
      fetchPendingRequests();
    } catch (error) {
      alert("Erreur lors du rejet.");
    }
  };

  const renderTable = (type, data) => {
    if (loading) return <div className="text-center p-4"><CSpinner /></div>;
    if (data.length === 0) return <p className="text-center text-muted p-4">Aucune demande en attente.</p>;

    return (
      <CTable hover responsive align="middle">
        <CTableHead color="light">
          <CTableRow>
            <CTableHeaderCell>ID</CTableHeaderCell>
            <CTableHeaderCell>Organisation</CTableHeaderCell>
            <CTableHeaderCell>Détails</CTableHeaderCell>
            <CTableHeaderCell>Date de dépôt</CTableHeaderCell>
            <CTableHeaderCell className="text-end">Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {data.map((item) => (
            <CTableRow key={item.id}>
              <CTableDataCell>#{item.id}</CTableDataCell>
              <CTableDataCell><strong>{item.organizationName}</strong></CTableDataCell>
              <CTableDataCell>
                 {type === 'administrative' && item.objetVisite}
                 {type === 'espace' && item.tailleEntreprise}
                 {type === 'salle' && item.activiteOuSujet}
              </CTableDataCell>
              <CTableDataCell>{new Date(item.dateDemande || item.createdAt).toLocaleDateString()}</CTableDataCell>
              <CTableDataCell className="text-end">
                <CButton color="success" size="sm" className="me-2 text-white" onClick={() => handleValidate(type, item.id)}>
                  <CIcon icon={cilCheckCircle} className="me-1" /> Valider & Générer
                </CButton>
                <CButton color="danger" size="sm" variant="outline" onClick={() => { setRejectInfo({ type, id: item.id, observation: '' }); setRejectModal(true); }}>
                  <CIcon icon={cilBan} className="me-1" /> Rejeter
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    );
  };

  return (
    <>
      <h2 className="mb-4">Boîte de Réception</h2>
      <CCard className="mb-4 shadow-sm">
        <CCardHeader className="p-0">
          <CNav variant="tabs" className="card-header-tabs m-0 border-bottom-0 p-2">
            <CNavItem>
              <CNavLink active={activeTab === 'administrative'} onClick={() => setActiveTab('administrative')} className="cursor-pointer">
                Administratives <CBadge color="info" className="ms-2">{demarches.administrative.length}</CBadge>
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink active={activeTab === 'espace'} onClick={() => setActiveTab('espace')} className="cursor-pointer">
                Espace Entreprise <CBadge color="info" className="ms-2">{demarches.espace.length}</CBadge>
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink active={activeTab === 'salle'} onClick={() => setActiveTab('salle')} className="cursor-pointer">
                Demandes Salle <CBadge color="info" className="ms-2">{demarches.salle.length}</CBadge>
              </CNavLink>
            </CNavItem>
          </CNav>
        </CCardHeader>
        <CCardBody>
          <CTabContent>
            <CTabPane visible={activeTab === 'administrative'}>{renderTable('administrative', demarches.administrative)}</CTabPane>
            <CTabPane visible={activeTab === 'espace'}>{renderTable('espace', demarches.espace)}</CTabPane>
            <CTabPane visible={activeTab === 'salle'}>{renderTable('salle', demarches.salle)}</CTabPane>
          </CTabContent>
        </CCardBody>
      </CCard>

      <CModal visible={rejectModal} onClose={() => setRejectModal(false)}>
        <CModalHeader closeButton><CModalTitle>Motif du rejet</CModalTitle></CModalHeader>
        <CModalBody>
          <CFormTextarea 
            rows="3" 
            placeholder="Ce motif sera communiqué au client..."
            value={rejectInfo.observation}
            onChange={(e) => setRejectInfo({...rejectInfo, observation: e.target.value})}
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" variant="ghost" onClick={() => setRejectModal(false)}>Annuler</CButton>
          <CButton color="danger" onClick={handleReject}>Confirmer le rejet</CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};
export default EmployeeInbox;