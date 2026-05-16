import React, { useState, useEffect } from 'react';
import {
  CCard, CCardBody, CCardHeader, CCol, CRow, CTable, CTableBody, CTableDataCell,
  CTableHead, CTableHeaderCell, CTableRow, CFormInput, CBadge, CSpinner, CButton,
  CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter
} from '@coreui/react';
import { cilMagnifyingGlass, cilTrash, cilInfo, cilBuilding, cilBriefcase, cilInstitution } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import axiosInstance from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext'; 

const OrganizationDirectory = () => {
  const [organizations, setOrganizations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ visible: false, orgId: null, orgName: '' });
  const [deleting, setDeleting] = useState(false);
    const { user, isAdmin, isEmployee } = useAuth();
  const canDelete = isAdmin; 

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/organizations/all`); 
      setOrganizations(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'annuaire:", error);
    } finally {
      setIsLoading(false);
    }
  };

const handleDelete = async () => {
  setDeleting(true);
  try {
      await axiosInstance.delete(`/organizations/${deleteConfirm.orgId}`, {
        params: { userId: user?.id } 
      });
    
    setOrganizations(organizations.filter(item => item.id !== deleteConfirm.orgId));
    setDeleteConfirm({ visible: false, orgId: null, orgName: '' });
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
    alert(error.response?.data?.error || "Erreur lors de la suppression.");
  } finally {
    setDeleting(false);
  }
};

  const viewDetails = (org) => {
    setSelectedOrg(org);
    setShowDetailsModal(true);
  };

  const filtered = organizations.filter(org => 
    (org.name && org.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (org.ice && org.ice.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (org.ville && org.ville.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Format organization type display
  const getTypeBadge = (type) => {
    return type === 'ASSOCIATION' 
      ? <CBadge color="success">Association</CBadge>
      : <CBadge color="info">Entreprise</CBadge>;
  };

  // Get owner name from the organization
  const getOwnerName = (org) => {
    if (org.owner?.username) return org.owner.username;
    if (org.ownerName) return org.ownerName;
    // Try to get from userRoles if available
    if (org.userRoles && org.userRoles.length > 0) {
      const owner = org.userRoles.find(role => role.role === 'OWNER');
      if (owner && owner.user) {
        return owner.user.username;
      }
    }
    return 'N/A';
  };

  return (
    <CRow>
      <CCol xs={12}>
        <h2 className="mb-4">Annuaire des Organisations</h2>
        <CCard className="mb-4 shadow-sm">
          <CCardBody>
            <div className="mb-4 position-relative">
              <CIcon icon={cilMagnifyingGlass} className="position-absolute top-50 translate-middle-y ms-3 text-muted" />
              <CFormInput 
                type="text" 
                placeholder="Rechercher par nom, ICE ou ville..." 
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
                    <CTableHeaderCell>Nom</CTableHeaderCell>
                    <CTableHeaderCell>Type</CTableHeaderCell>
                    <CTableHeaderCell>Ville</CTableHeaderCell>
                    <CTableHeaderCell>Contact</CTableHeaderCell>
                    <CTableHeaderCell>Créateur</CTableHeaderCell>
                    <CTableHeaderCell>Statut</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {filtered.length > 0 ? (
                    filtered.map((item) => (
                      <CTableRow key={item.id}>
                        <CTableDataCell className="text-muted">#{item.id}</CTableDataCell>
                        <CTableDataCell>
                          <strong>{item.name}</strong>
                          {item.type === 'ASSOCIATION' && item.officiallyCreated !== undefined && (
                            <div className="small text-muted">
                              {item.officiallyCreated ? 'Association déclarée' : 'En constitution'}
                            </div>
                          )}
                        </CTableDataCell>
                        <CTableDataCell>{getTypeBadge(item.type)}</CTableDataCell>
                        <CTableDataCell>{item.ville || 'N/A'}</CTableDataCell>
                        <CTableDataCell>
                          {item.telGsm && <div className="small">📱 {item.telGsm}</div>}
                          {item.emailContact && <div className="small">📧 {item.emailContact}</div>}
                        </CTableDataCell>
                        <CTableDataCell>{getOwnerName(item)}</CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={item.type === 'ASSOCIATION' ? (item.officiallyCreated ? 'success' : 'warning') : 'info'}>
                            {item.type === 'ASSOCIATION' 
                              ? (item.officiallyCreated ? 'Déclarée' : 'En constitution')
                              : item.taille || 'Actif'}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          <CButton 
                            color="info" 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => viewDetails(item)}
                            title="Voir les détails"
                            className="me-1"
                          >
                            <CIcon icon={cilInfo} />
                          </CButton>
                          {canDelete && (
                            <CButton 
                              color="danger" 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setDeleteConfirm({ visible: true, orgId: item.id, orgName: item.name })}
                              title="Supprimer l'organisation"
                            >
                              <CIcon icon={cilTrash} />
                            </CButton>
                          )}
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan={8} className="text-center text-muted py-4">
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

      {/* Organization Details Modal */}
      <CModal 
        visible={showDetailsModal} 
        onClose={() => setShowDetailsModal(false)}
        size="lg"
        alignment="center"
      >
        <CModalHeader>
          <CModalTitle>
            <CIcon icon={selectedOrg?.type === 'ASSOCIATION' ? cilInstitution : cilBriefcase} className="me-2" />
            {selectedOrg?.name}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedOrg && (
            <>
              {/* Basic Information */}
              <h6 className="border-bottom pb-2 mb-3">Informations générales</h6>
              <CRow className="mb-3">
                <CCol md={6}>
                  <strong>Type:</strong> {selectedOrg.type === 'ASSOCIATION' ? 'Association' : 'Entreprise'}
                </CCol>
                <CCol md={6}>
                  <strong>Ville:</strong> {selectedOrg.ville || 'Non spécifiée'}
                </CCol>
              </CRow>
              
              {/* Entreprise specific fields */}
              {selectedOrg.type === 'ENTREPRISE' && (
                <>
                  <h6 className="border-bottom pb-2 mb-3 mt-3">Informations Entreprise</h6>
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <strong>ICE:</strong> {selectedOrg.ice || 'Non spécifié'}
                    </CCol>
                    <CCol md={6}>
                      <strong>Forme Juridique:</strong> {selectedOrg.formeJuridique || 'Non spécifiée'}
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <strong>Secteur d'activité:</strong> {selectedOrg.secteurActivite || 'Non spécifié'}
                    </CCol>
                    <CCol md={6}>
                      <strong>Taille:</strong> {selectedOrg.taille || 'Non spécifiée'}
                    </CCol>
                  </CRow>
                  {selectedOrg.activite && (
                    <CRow className="mb-3">
                      <CCol md={12}>
                        <strong>Activité détaillée:</strong> {selectedOrg.activite}
                      </CCol>
                    </CRow>
                  )}
                </>
              )}
              
              {/* Association specific fields */}
              {selectedOrg.type === 'ASSOCIATION' && (
                <>
                  <h6 className="border-bottom pb-2 mb-3 mt-3">Informations Association</h6>
                  <CRow className="mb-3">
                    <CCol md={12}>
                      <strong>Statut:</strong>{' '}
                      <CBadge color={selectedOrg.officiallyCreated ? 'success' : 'warning'}>
                        {selectedOrg.officiallyCreated ? 'Association déclarée' : 'En cours de constitution'}
                      </CBadge>
                    </CCol>
                  </CRow>
                  {selectedOrg.activite && (
                    <CRow className="mb-3">
                      <CCol md={12}>
                        <strong>Activité:</strong> {selectedOrg.activite}
                      </CCol>
                    </CRow>
                  )}
                </>
              )}
              
              {/* Contact Information */}
              <h6 className="border-bottom pb-2 mb-3 mt-3">Coordonnées</h6>
              <CRow className="mb-3">
                <CCol md={6}>
                  <strong>Adresse:</strong> {selectedOrg.adresse || 'Non spécifiée'}
                </CCol>
                <CCol md={6}>
                  <strong>Téléphone Fixe:</strong> {selectedOrg.telFixe || 'Non spécifié'}
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={6}>
                  <strong>Téléphone GSM:</strong> {selectedOrg.telGsm || 'Non spécifié'}
                </CCol>
                <CCol md={6}>
                  <strong>Email:</strong> {selectedOrg.emailContact || 'Non spécifié'}
                </CCol>
              </CRow>
              {selectedOrg.siteWeb && (
                <CRow className="mb-3">
                  <CCol md={12}>
                    <strong>Site Web:</strong> <a href={selectedOrg.siteWeb} target="_blank" rel="noopener noreferrer">{selectedOrg.siteWeb}</a>
                  </CCol>
                </CRow>
              )}
              
              {/* Description */}
              {selectedOrg.description && (
                <>
                  <h6 className="border-bottom pb-2 mb-3 mt-3">Description</h6>
                  <CRow className="mb-3">
                    <CCol md={12}>
                      {selectedOrg.description}
                    </CCol>
                  </CRow>
                </>
              )}
            </>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowDetailsModal(false)}>
            Fermer
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Delete Confirmation Modal */}
      <CModal 
        visible={deleteConfirm.visible} 
        onClose={() => setDeleteConfirm({ visible: false, orgId: null, orgName: '' })}
        alignment="center"
      >
        <CModalHeader>
          <CModalTitle>Confirmer la suppression</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>Êtes-vous sûr de vouloir supprimer l'organisation <strong>{deleteConfirm.orgName}</strong> ?</p>
          <p className="text-danger">Cette action supprimera également toutes les demandes associées et ne peut pas être annulée.</p>
        </CModalBody>
        <CModalFooter>
          <CButton 
            color="secondary" 
            onClick={() => setDeleteConfirm({ visible: false, orgId: null, orgName: '' })}
          >
            Annuler
          </CButton>
          <CButton 
            color="danger" 
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? <CSpinner size="sm" /> : "Supprimer"}
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  );
};

export default OrganizationDirectory;