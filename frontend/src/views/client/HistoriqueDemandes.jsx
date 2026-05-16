import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  CCard, CCardBody, CCardHeader, CCol, CRow, CTable, CTableBody, 
  CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, 
  CBadge, CFormInput, CFormSelect, CSpinner
} from '@coreui/react';
import axiosInstance from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';

const HistoriqueDemandes = () => {
  const { user } = useAuth(); // We only care about the user here
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

const [organizations, setOrganizations] = useState([]);

useEffect(() => {
  if (user && user.id) {
    fetchUserOrganizations();
  }
}, [user]);

const fetchHistory = async () => {
  setLoading(true);
  try {
    let allDemandes = [];
    
    if (organizations.length === 0) {
      // Try to fetch directly by user ID if no orgs
      const response = await axiosInstance.get(`/client/demandes/history/user/${user.id}`);
      const { demarches, espaces, salles } = response.data;
      allDemandes = [
        ...(demarches || []).map(d => ({ ...d, category: 'Accueil Ressortissant' })),
        ...(espaces || []).map(e => ({ ...e, category: 'Renseignements' })),
        ...(salles || []).map(s => ({ ...s, category: 'Réservation Salle' }))
      ];
    } else {
      // Fetch history for each organization
      for (const org of organizations) {
        const response = await axiosInstance.get(`/client/demandes/history/${org.id}`);
        const { demarches, espaces, salles } = response.data;
        allDemandes.push(
          ...(demarches || []).map(d => ({ ...d, category: 'Accueil Ressortissant', orgName: org.name })),
          ...(espaces || []).map(e => ({ ...e, category: 'Renseignements', orgName: org.name })),
          ...(salles || []).map(s => ({ ...s, category: 'Réservation Salle', orgName: org.name }))
        );
      }
    }
    
    allDemandes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setData(allDemandes);
  } catch (error) {
    console.error("Error fetching history:", error);
  } finally {
    setLoading(false);
  }
};

const fetchUserOrganizations = async () => {
  try {
    const response = await axiosInstance.get(`/organizations/user/${user.id}`);
    setOrganizations(response.data);
    await fetchHistory(); // Fetch history after organizations are loaded
  } catch (error) {
    console.error("Error fetching organizations:", error);
    await fetchHistory(); // Still try to fetch history
  }
};

  const getStatusBadge = (status) => {
    switch (status) {
      case 'VALIDE': return <CBadge color="success">Validée</CBadge>;
      case 'REJETE': return <CBadge color="danger">Rejetée</CBadge>;
      case 'EN_ATTENTE': return <CBadge color="warning">En attente</CBadge>;
      default: return <CBadge color="secondary">{status}</CBadge>;
    }
  };

  const filteredData = data.filter(item => {
    const ref = item.reference || '';
    const matchesSearch = ref.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className="text-center p-5"><CSpinner color="primary" /></div>;

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>Historique des Demandes</strong>
          </CCardHeader>
          <CCardBody>
            <CRow className="mb-3">
              <CCol md={4}>
                <CFormInput 
                  placeholder="Rechercher par référence..." 
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </CCol>
              <CCol md={3}>
                <CFormSelect onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="ALL">Tous les statuts</option>
                  <option value="EN_ATTENTE">En attente</option>
                  <option value="VALIDE">Validées</option>
                  <option value="REJETE">Rejetées</option>
                </CFormSelect>
              </CCol>
            </CRow>

            <CTable align="middle" className="mb-0 border" hover responsive>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell>Référence</CTableHeaderCell>
                  <CTableHeaderCell>Catégorie</CTableHeaderCell>
                  <CTableHeaderCell>Date</CTableHeaderCell>
                  <CTableHeaderCell>Statut</CTableHeaderCell>
                  <CTableHeaderCell>Observation</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
<CTableBody>
  {filteredData.map((item, index) => (
    <CTableRow key={index}>
      <CTableDataCell>
        <div className="fw-bold">{item.reference || 'N/A'}</div>
        <div className="small text-muted" style={{ fontSize: '0.75rem' }}>ID: #{item.id}</div>
      </CTableDataCell>
      <CTableDataCell>
        <span className="fw-semibold">{item.category}</span>
        <div className="small text-truncate" style={{ maxWidth: '200px' }}>{item.details}</div>
      </CTableDataCell>
      <CTableDataCell>
        {new Date(item.createdAt || item.dateDepot).toLocaleDateString()}
        {/* If it's a room reservation, show the meeting date from DemandeSalle.java */}
        {item.dateHeureReunion && (
          <div className="small text-info">RDV: {new Date(item.dateHeureReunion).toLocaleString()}</div>
        )}
      </CTableDataCell>
      <CTableDataCell>{getStatusBadge(item.status)}</CTableDataCell>
      <CTableDataCell>
        <div className="small">
          {item.observation || item.motifRejet || "Aucun commentaire"}
        </div>
        {/* Show price if it's an administrative process */}
        {item.montant > 0 && <CBadge color="secondary" className="mt-1">{item.montant} MAD</CBadge>}
      </CTableDataCell>
    </CTableRow>
  ))}
</CTableBody>
            </CTable>
            {filteredData.length === 0 && (
              <div className="text-center p-4">Aucune demande trouvée.</div>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default HistoriqueDemandes;