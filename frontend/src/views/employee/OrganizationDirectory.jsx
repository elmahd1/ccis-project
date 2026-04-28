import React, { useState, useEffect } from 'react';
import {
  CCard, CCardBody, CCardHeader, CCol, CRow, CTable, CTableBody, CTableDataCell,
  CTableHead, CTableHeaderCell, CTableRow, CFormInput, CBadge, CSpinner, CButton
} from '@coreui/react';
import { cilMagnifyingGlass, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import axiosInstance from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext'; 

const OrganizationDirectory = () => {
  const [organizations, setOrganizations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const { isAdmin } = useAuth(); 

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      setIsLoading(true);
      // Backend should fetch a master list of all organizations
      const response = await axiosInstance.get('/api/organizations/all'); 
      setOrganizations(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'annuaire:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Supprimer cette organisation retirera également tous ses historiques. Continuer ?")) {
      try {
        await axiosInstance.delete(`/api/organizations/${id}`);
        setOrganizations(organizations.filter(item => item.id !== id));
      } catch (error) {
        alert("Erreur lors de la suppression.");
      }
    }
  };

  const filtered = organizations.filter(org => 
    (org.name && org.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <CRow>
      <CCol xs={12}>
        <h2 className="mb-4">Annuaire des Clients</h2>
        <CCard className="mb-4 shadow-sm">
          <CCardBody>
            <div className="mb-4 position-relative">
              <CIcon icon={cilMagnifyingGlass} className="position-absolute top-50 translate-middle-y ms-3 text-muted" />
              <CFormInput 
                type="text" 
                placeholder="Rechercher une entreprise ou association..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="ps-5"
              />
            </div>
            
            {isLoading ? (
               <div className="text-center my-5"><CSpinner color="primary" /></div>
            ) : (
              <CTable hover responsive align="middle">
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell>#ID</CTableHeaderCell>
                    <CTableHeaderCell>Nom de l'Organisation</CTableHeaderCell>
                    <CTableHeaderCell>Type</CTableHeaderCell>
                    <CTableHeaderCell>Créateur / Propriétaire</CTableHeaderCell>
                    <CTableHeaderCell>Statut Légal</CTableHeaderCell>
                    {isAdmin && <CTableHeaderCell className="text-end">Actions</CTableHeaderCell>}
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {filtered.length > 0 ? (
                    filtered.map((item) => (
                      <CTableRow key={item.id}>
                        <CTableDataCell className="text-muted">#{item.id}</CTableDataCell>
                        <CTableDataCell><strong>{item.name}</strong></CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={item.type === 'ASSOCIATION' ? 'success' : 'info'}>{item.type}</CBadge>
                        </CTableDataCell>
                        <CTableDataCell>{item.ownerName || 'N/A'}</CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={item.officiallyCreated ? 'success' : 'secondary'} variant="outline">
                            {item.officiallyCreated ? 'Créée' : 'En constitution'}
                          </CBadge>
                        </CTableDataCell>
                        {isAdmin && (
                          <CTableDataCell className="text-end">
                            <CButton color="danger" variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                              <CIcon icon={cilTrash} />
                            </CButton>
                          </CTableDataCell>
                        )}
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan={isAdmin ? 6 : 5} className="text-center text-muted py-4">
                        Aucune organisation trouvée.
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default OrganizationDirectory;