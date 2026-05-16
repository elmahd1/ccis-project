// EmployeeClientManagement.jsx - Version simplifiée utilisant les endpoints existants
import React, { useState, useEffect } from 'react';
import {
  CCard, CCardBody, CCardHeader, CCol, CRow, CTable, CTableBody, CTableDataCell,
  CTableHead, CTableHeaderCell, CTableRow, CButton, CBadge, CSpinner, CModal,
  CModalHeader, CModalTitle, CModalBody, CModalFooter, CFormInput, CFormSelect,
  CAlert, CInputGroup, CInputGroupText, CPagination, CPaginationItem, CFormLabel,
  CFormTextarea
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilUser, cilEnvelopeClosed, cilSearch, cilReload, cilCheckCircle,
  cilBan, cilWarning, cilPhone, cilLocationPin, cilInfo
} from '@coreui/icons';
import axiosInstance from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';

const EmployeeClientManagement = () => {
  const { user: currentUser } = useAuth();
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [visibleActivate, setVisibleActivate] = useState(false);
  const [qualite, setQualite] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [activating, setActivating] = useState(false);
  
  const clientsPerPage = 10;

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    let filtered = [...clients];
    
    if (searchTerm) {
      filtered = filtered.filter(client =>
        client.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.prenom?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(client => client.accountStatus === statusFilter);
    }
    
    setFilteredClients(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, clients]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/users/all');
      // Filtrer seulement les clients (role CLIENT)
      const onlyClients = response.data.filter(user => user.role === 'ROLE_CLIENT');
      setClients(onlyClients);
      setFilteredClients(onlyClients);
    } catch (err) {
      setError('Erreur lors du chargement des clients');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Utiliser le même endpoint que l'admin : /users/admin/users/{id}/activate
  const handleActivateClient = async () => {
    if (!qualite.trim()) {
      setError("Veuillez indiquer votre qualité");
      return;
    }
    
    setActivating(true);
    try {
      await axiosInstance.put(`/users/admin/users/${selectedClient.id}/activate`, null, {
        params: { qualite: qualite }
      });
      setSuccess(`Compte "${selectedClient.username}" activé avec succès`);
      setVisibleActivate(false);
      setSelectedClient(null);
      setQualite('');
      fetchClients();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de l'activation");
    } finally {
      setActivating(false);
    }
  };

  // Utiliser le même endpoint que l'admin : /users/admin/users/{id}/reject
  const handleRejectClient = async () => {
    if (!rejectionReason.trim()) {
      setError("Veuillez indiquer un motif de rejet");
      return;
    }
    
    setActivating(true);
    try {
      await axiosInstance.put(`/users/admin/users/${selectedClient.id}/reject`, null, {
        params: { reason: rejectionReason }
      });
      setSuccess(`Compte "${selectedClient.username}" rejeté`);
      setVisibleActivate(false);
      setSelectedClient(null);
      setRejectionReason('');
      fetchClients();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors du rejet");
    } finally {
      setActivating(false);
    }
  };

  const openActivationModal = (client) => {
    setSelectedClient(client);
    setQualite('');
    setRejectionReason('');
    setVisibleActivate(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <CBadge color="success">✓ Actif</CBadge>;
      case 'PENDING_PROFILE_COMPLETION':
        return <CBadge color="warning">⏳ Profil incomplet</CBadge>;
      case 'PENDING_ACTIVATION':
        return <CBadge color="info">🕐 En attente d'activation</CBadge>;
      case 'SUSPENDED':
        return <CBadge color="danger">⚠️ Suspendu</CBadge>;
      case 'REJECTED':
        return <CBadge color="dark">❌ Rejeté</CBadge>;
      default:
        return <CBadge color="secondary">{status || 'Inconnu'}</CBadge>;
    }
  };

  // Pagination
  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);
  const totalPages = Math.ceil(filteredClients.length / clientsPerPage);

  const pendingActivations = clients.filter(c => c.accountStatus === 'PENDING_ACTIVATION').length;

  return (
    <CRow>
      <CCol xs={12}>
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div>
            <h2>Gestion des utilisateurs</h2>
            <p className="text-muted mb-0">Consultez et activez les comptes utilisateurs</p>
          </div>
          {pendingActivations > 0 && (
            <CBadge color="warning" className="p-2">
              <CIcon icon={cilWarning} className="me-1" />
              {pendingActivations} activation(s) en attente
            </CBadge>
          )}
        </div>

        <CCard className="mb-4">
          <CCardHeader>
            <strong>Liste des utilisateurs</strong>
            <small className="text-muted ms-2">Activer ou rejeter les comptes en attente</small>
          </CCardHeader>
          <CCardBody>
            {error && <CAlert color="danger" dismissible onClose={() => setError('')}>{error}</CAlert>}
            {success && <CAlert color="success" dismissible onClose={() => setSuccess('')}>{success}</CAlert>}

            <CRow className="mb-4">
              <CCol md={8}>
                <CInputGroup>
                  <CInputGroupText>
                    <CIcon icon={cilSearch} />
                  </CInputGroupText>
                  <CFormInput
                    placeholder="Rechercher par nom, email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <CButton color="secondary" variant="outline" onClick={() => setSearchTerm('')}>
                      Effacer
                    </CButton>
                  )}
                </CInputGroup>
              </CCol>
              <CCol md={3}>
                <CFormSelect
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="ALL">Tous les statuts</option>
                  <option value="ACTIVE">Actifs</option>
                  <option value="PENDING_ACTIVATION">En attente d'activation</option>
                  <option value="PENDING_PROFILE_COMPLETION">Profil incomplet</option>
                  <option value="REJECTED">Rejetés</option>
                </CFormSelect>
              </CCol>
              <CCol md={1}>
                <CButton color="light" onClick={fetchClients} title="Actualiser">
                  <CIcon icon={cilReload} />
                </CButton>
              </CCol>
            </CRow>

            {loading ? (
              <div className="text-center py-5">
                <CSpinner color="primary" />
                <p className="mt-2 text-muted">Chargement des clients...</p>
              </div>
            ) : (
              <>
                <CTable hover responsive align="middle">
                  <CTableHead color="light">
                    <CTableRow>
                      <CTableHeaderCell style={{ width: '60px' }}>ID</CTableHeaderCell>
                      <CTableHeaderCell>Client</CTableHeaderCell>
                      <CTableHeaderCell>Contact</CTableHeaderCell>
                      <CTableHeaderCell>Ville</CTableHeaderCell>
                      <CTableHeaderCell>Statut</CTableHeaderCell>
                      <CTableHeaderCell className="text-end">Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {currentClients.length === 0 ? (
                      <CTableRow>
                        <CTableDataCell colSpan="6" className="text-center py-5 text-muted">
                          Aucun client trouvé
                        </CTableDataCell>
                      </CTableRow>
                    ) : (
                      currentClients.map((client) => (
                        <CTableRow key={client.id}>
                          <CTableDataCell className="fw-semibold">#{client.id}</CTableDataCell>
                          <CTableDataCell>
                            <div className="d-flex align-items-center">
                              <div className="bg-light rounded-circle p-2 me-2">
                                <CIcon icon={cilUser} size="sm" />
                              </div>
                              <div>
                                <div className="fw-semibold">
                                  {client.prenom} {client.nom}
                                </div>
                                <small className="text-muted">@{client.username}</small>
                              </div>
                            </div>
                          </CTableDataCell>
                          <CTableDataCell>
                            <div><CIcon icon={cilEnvelopeClosed} className="me-1 text-muted" /> {client.email}</div>
                            {client.numTelGsm && <small className="text-muted"><CIcon icon={cilPhone} className="me-1" /> {client.numTelGsm}</small>}
                          </CTableDataCell>
                          <CTableDataCell>
                            {client.ville || <span className="text-muted">Non spécifiée</span>}
                          </CTableDataCell>
                          <CTableDataCell>{getStatusBadge(client.accountStatus)}</CTableDataCell>
                          <CTableDataCell className="text-end">
                            <CButton
                              color="info"
                              size="sm"
                              variant="ghost"
                              className="me-2"
                              onClick={() => {
                                setSelectedClient(client);
                                setShowDetailsModal(true);
                              }}
                              title="Voir les détails"
                            >
                              <CIcon icon={cilInfo} />
                            </CButton>
                            {client.accountStatus === 'PENDING_ACTIVATION' && (
                              <>
                                <CButton
                                  color="success"
                                  size="sm"
                                  className="me-2"
                                  onClick={() => openActivationModal(client)}
                                  title="Activer le compte"
                                >
                                  <CIcon icon={cilCheckCircle} className="me-1" />
                                  Activer
                                </CButton>
                                <CButton
                                  color="danger"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedClient(client);
                                    setVisibleActivate(true);
                                  }}
                                  title="Rejeter le compte"
                                >
                                  <CIcon icon={cilBan} className="me-1" />
                                  Rejeter
                                </CButton>
                              </>
                            )}
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    )}
                  </CTableBody>
                </CTable>

                {totalPages > 1 && (
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <small className="text-muted">
                      Affichage de {indexOfFirstClient + 1} à {Math.min(indexOfLastClient, filteredClients.length)} sur {filteredClients.length} clients
                    </small>
                    <CPagination>
                      <CPaginationItem disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                        Précédent
                      </CPaginationItem>
                      {[...Array(totalPages)].map((_, i) => (
                        <CPaginationItem
                          key={i + 1}
                          active={currentPage === i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </CPaginationItem>
                      ))}
                      <CPaginationItem disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
                        Suivant
                      </CPaginationItem>
                    </CPagination>
                  </div>
                )}
              </>
            )}
          </CCardBody>
        </CCard>

        {/* Client Details Modal - Même que ManageUsersPage */}
        <CModal visible={showDetailsModal} onClose={() => setShowDetailsModal(false)} size="lg">
          <CModalHeader>
            <CModalTitle>
              <CIcon icon={cilUser} className="me-2" />
              Détails du client
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            {selectedClient && (
              <>
                <h6 className="border-bottom pb-2 mb-3">Informations personnelles</h6>
                <CRow className="mb-3">
                  <CCol md={6}>
                    <strong>Nom complet:</strong> {selectedClient.prenom} {selectedClient.nom}
                  </CCol>
                  <CCol md={6}>
                    <strong>Nom d'utilisateur:</strong> {selectedClient.username}
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={6}>
                    <strong>Email:</strong> {selectedClient.email}
                  </CCol>
                  <CCol md={6}>
                    <strong>Téléphone GSM:</strong> {selectedClient.numTelGsm || 'Non spécifié'}
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={6}>
                    <strong>Téléphone Fixe:</strong> {selectedClient.numTelFixe || 'Non spécifié'}
                  </CCol>
                  <CCol md={6}>
                    <strong>Statut:</strong> {selectedClient.statut === 'AUTO_ENTREPRENEUR' ? 'Auto-entrepreneur' : 'Porteur de projet'}
                  </CCol>
                </CRow>

                <h6 className="border-bottom pb-2 mb-3 mt-3">Adresse</h6>
                <CRow className="mb-3">
                  <CCol md={8}>
                    <strong>Adresse:</strong> {selectedClient.adresse || 'Non spécifiée'}
                  </CCol>
                  <CCol md={4}>
                    <strong>Ville:</strong> {selectedClient.ville || 'Non spécifiée'}
                  </CCol>
                </CRow>

                <h6 className="border-bottom pb-2 mb-3 mt-3">Informations compte</h6>
                <CRow className="mb-3">
                  <CCol md={4}>
                    <strong>Rôle:</strong> {selectedClient.role}
                  </CCol>
                  <CCol md={4}>
                    <strong>Statut compte:</strong> {getStatusBadge(selectedClient.accountStatus)}
                  </CCol>
                  <CCol md={4}>
                    <strong>Date d'inscription:</strong> {new Date(selectedClient.createdAt).toLocaleDateString()}
                  </CCol>
                </CRow>
                {selectedClient.profileCompletedAt && (
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <strong>Profil complété le:</strong> {new Date(selectedClient.profileCompletedAt).toLocaleDateString()}
                    </CCol>
                    {selectedClient.activatedAt && (
                      <CCol md={6}>
                        <strong>Compte activé le:</strong> {new Date(selectedClient.activatedAt).toLocaleDateString()}
                      </CCol>
                    )}
                  </CRow>
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

        {/* Activation/Rejection Modal - Même que ManageUsersPage */}
        <CModal visible={visibleActivate} onClose={() => setVisibleActivate(false)} size="md">
          <CModalHeader onClose={() => setVisibleActivate(false)}>
            <CModalTitle>
              {rejectionReason === '' && qualite === '' && selectedClient?.accountStatus === 'PENDING_ACTIVATION'
                ? <><CIcon icon={cilCheckCircle} className="me-2 text-success" /> Activer / Rejeter le compte</>
                : qualite !== '' ? <><CIcon icon={cilCheckCircle} className="me-2 text-success" /> Activer le compte</>
                : <><CIcon icon={cilBan} className="me-2 text-danger" /> Rejeter le compte</>}
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            {selectedClient && (
              <>
                <div className="mb-3 p-3 bg-light rounded">
                  <div className="fw-semibold">Client: {selectedClient.prenom} {selectedClient.nom}</div>
                  <div>Email: {selectedClient.email}</div>
                  <div>Téléphone: {selectedClient.numTelGsm}</div>
                  <div>Ville: {selectedClient.ville || 'Non spécifiée'}</div>
                  <div>Statut: {selectedClient.statut === 'AUTO_ENTREPRENEUR' ? 'Auto-entrepreneur' : 'Porteur de projet'}</div>
                </div>

                {/* Two-step: choose action first */}
                {selectedClient.accountStatus === 'PENDING_ACTIVATION' && !qualite && !rejectionReason && (
                  <div className="mb-3">
                    <CFormLabel className="fw-semibold">Action à effectuer</CFormLabel>
                    <div className="d-grid gap-2">
                      <CButton color="success" onClick={() => setQualite('')}>
                        <CIcon icon={cilCheckCircle} className="me-2" />
                        Activer le compte
                      </CButton>
                      <CButton color="danger" variant="outline" onClick={() => setRejectionReason('')}>
                        <CIcon icon={cilBan} className="me-2" />
                        Rejeter le compte
                      </CButton>
                    </div>
                  </div>
                )}

                {qualite !== '' && (
                  <div className="mb-3">
                    <CFormLabel className="fw-semibold">Qualité / Fonction *</CFormLabel>
                    <CFormSelect
                      value={qualite}
                      onChange={(e) => setQualite(e.target.value)}
                    >
                      <option value="">Sélectionnez votre qualité...</option>
                      <option value="Chef de service">Chef de service</option>
                      <option value="Responsable accueil">Responsable accueil</option>
                      <option value="Conseiller CCIS">Conseiller CCIS</option>
                      <option value="Directeur">Directeur</option>
                      <option value="Autre">Autre</option>
                    </CFormSelect>
                    <small className="text-muted">Cette information sera enregistrée dans les logs</small>
                  </div>
                )}

                {rejectionReason !== '' && (
                  <div className="mb-3">
                    <CFormLabel className="fw-semibold">Motif du rejet *</CFormLabel>
                    <CFormTextarea
                      rows="3"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Expliquez la raison du rejet..."
                    />
                    <small className="text-muted">Ce motif sera communiqué au client</small>
                  </div>
                )}
              </>
            )}
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" variant="ghost" onClick={() => {
              setVisibleActivate(false);
              setQualite('');
              setRejectionReason('');
            }}>
              Annuler
            </CButton>
            {qualite !== '' && (
              <CButton color="success" onClick={handleActivateClient} disabled={activating}>
                {activating ? <CSpinner size="sm" /> : "Activer"}
              </CButton>
            )}
            {rejectionReason !== '' && (
              <CButton color="danger" onClick={handleRejectClient} disabled={activating}>
                {activating ? <CSpinner size="sm" /> : "Rejeter"}
              </CButton>
            )}
          </CModalFooter>
        </CModal>
      </CCol>
    </CRow>
  );
};

export default EmployeeClientManagement;