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

 // HistoriqueDemandes.jsx

useEffect(() => {
  // Use a more explicit check
  console.log("AuthContext user:", user);
  if (user && user.id) {
    console.log("Fetching history for user ID:", user.id);
    fetchHistory();
  }
}, [user]); // This will trigger as soon as 'user' is set in AuthContext

const fetchHistory = async () => {
  setLoading(true);
  try {
    const response = await axiosInstance.get(`/client/demandes/history/user/${user.id}`);
    
    // Extract the three lists from the object
    const { demarches, espaces, salles } = response.data;

    // Combine them and add a 'category' label so you know which is which
    const combined = [
      ...(demarches || []).map(d => ({ ...d, category: 'Administrative' })),
      ...(espaces || []).map(e => ({ ...e, category: 'Espace Entreprise' })),
      ...(salles || []).map(s => ({ ...s, category: 'Réservation Salle' }))
    ];

    // Sort by date (most recent first)
    combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setData(combined); 
  } catch (error) {
    console.error("Error fetching history:", error);
  } finally {
    setLoading(false);
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