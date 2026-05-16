// EmployeeDemandeDetail.jsx - Version corrigée
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CCard, CCardBody, CCardHeader, CCol, CRow, CButton, CSpinner, CBadge,
  CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CFormTextarea,
  CAlert, CListGroup, CListGroupItem, CFormLabel
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilArrowLeft, cilCheckCircle, cilBan, cilCloudDownload, cilInfo, cilUser, cilBuilding, cilCalendar, cilPhone, cilEnvelopeClosed, cilLocationPin } from '@coreui/icons';
import axiosInstance from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';

const EmployeeDemandeDetail = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [demande, setDemande] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rejectModal, setRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [qualite, setQualite] = useState('');
  const [processing, setProcessing] = useState(false);
  const [showQualiteModal, setShowQualiteModal] = useState(false);

  useEffect(() => {
    fetchDemandeDetail();
  }, [type, id]);

  const fetchDemandeDetail = async () => {
    try {
      setLoading(true);
      // Essayer d'abord avec l'endpoint existant ou utiliser l'endpoint pending avec filtre
      let demandeData;
      try {
        const response = await axiosInstance.get(`/employee/demandes/${type}/${id}/detail`);
        demandeData = response.data;
      } catch (err) {
        // Si l'endpoint detail n'existe pas, récupérer toutes les demandes en attente et filtrer
        console.log("Detail endpoint not found, fetching from pending...");
        const pendingResponse = await axiosInstance.get(`/employee/demandes/pending`);
        let allDemandes = [];
        if (type === 'administrative') allDemandes = pendingResponse.data.demarches || [];
        else if (type === 'espace') allDemandes = pendingResponse.data.espaces || [];
        else if (type === 'salle') allDemandes = pendingResponse.data.salles || [];
        
        demandeData = allDemandes.find(d => d.id === parseInt(id));
        if (!demandeData) {
          throw new Error("Demande non trouvée");
        }
      }
      setDemande(demandeData);
    } catch (err) {
      console.error("Error fetching demande details:", err);
      setError("Impossible de charger les détails de la demande");
    } finally {
      setLoading(false);
    }
  };

  const handleValidateClick = () => {
    setShowQualiteModal(true);
  };

  const handleValidate = async () => {
    if (!qualite.trim()) {
      alert("Veuillez indiquer votre qualité");
      return;
    }
    setProcessing(true);
    try {
      await axiosInstance.put(`/employee/demandes/${type}/${id}/validate`, 
        { qualite: qualite },
        { params: { employeeId: user?.id } }
      );
      alert("Demande validée avec succès !");
      navigate('/employee/inbox');
    } catch (error) {
      console.error("Validation error:", error);
      alert(error.response?.data?.error || "Erreur lors de la validation.");
      setProcessing(false);
      setShowQualiteModal(false);
    }
  };

  const handleRejectClick = () => {
    setRejectModal(true);
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert("Veuillez saisir un motif de rejet");
      return;
    }
    setProcessing(true);
    try {
      await axiosInstance.put(`/employee/demandes/${type}/${id}/reject`, 
        { observation: rejectReason, qualite: qualite || "Employé" },
        { params: { employeeId: user?.id } }
      );
      alert("Demande rejetée avec succès");
      navigate('/employee/inbox');
    } catch (error) {
      console.error("Rejection error:", error);
      alert(error.response?.data?.error || "Erreur lors du rejet.");
      setProcessing(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axiosInstance.get(`/employee/demandes/${type}/${id}/download`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const extension = type === 'salle' ? 'zip' : 'docx';
      link.setAttribute('download', `${type}_${id}.${extension}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      alert("Erreur lors du téléchargement.");
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'administrative': return "Fiche d'Accueil Ressortissant";
      case 'espace': return "Fiche de Renseignements";
      case 'salle': return "Demande de Salle";
      default: return type;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'VALIDE': return <CBadge color="success">Validée</CBadge>;
      case 'REJETE': return <CBadge color="danger">Rejetée</CBadge>;
      case 'EN_ATTENTE': return <CBadge color="warning">En attente</CBadge>;
      default: return <CBadge color="secondary">{status || 'N/A'}</CBadge>;
    }
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <CSpinner color="primary" />
        <p className="mt-2">Chargement des détails...</p>
      </div>
    );
  }

  if (error || !demande) {
    return (
      <CAlert color="danger" className="m-3">
        {error || "Demande non trouvée"}
        <div className="mt-3">
          <CButton color="primary" onClick={() => navigate('/employee/inbox')}>
            Retour à la boîte de réception
          </CButton>
        </div>
      </CAlert>
    );
  }

  return (
    <>
      <div className="d-flex align-items-center mb-4">
        <CButton color="secondary" variant="ghost" onClick={() => navigate('/employee/inbox')} className="me-3">
          <CIcon icon={cilArrowLeft} /> Retour
        </CButton>
        <div className="flex-grow-1">
          <h3 className="mb-0">{getTypeLabel()}</h3>
          <p className="text-muted mb-0">Détails complets de la demande #{demande.id}</p>
        </div>
        <div>
          <CButton color="primary" variant="outline" className="me-2" onClick={handleDownload}>
            <CIcon icon={cilCloudDownload} className="me-1" /> Télécharger
          </CButton>
        </div>
      </div>

      <CRow>
        <CCol lg={8}>
          {/* Main Content */}
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Informations de la demande</strong>
              <div className="float-end">{getStatusBadge(demande.status)}</div>
            </CCardHeader>
            <CCardBody>
              {type === 'administrative' && (
                <>
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <strong><CIcon icon={cilInfo} className="me-2" />Objet de la visite</strong>
                      <p className="mt-1 bg-light p-2 rounded">{demande.objetVisite || 'N/A'}</p>
                    </CCol>
                    <CCol md={6}>
                      <strong>Montant</strong>
                      <p className="mt-1 bg-light p-2 rounded">{demande.montant ? `${demande.montant} MAD` : 'N/A'}</p>
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <strong><CIcon icon={cilCalendar} className="me-2" />Date de délivrance souhaitée</strong>
                      <p className="mt-1 bg-light p-2 rounded">{demande.dateHeureDelivrance ? new Date(demande.dateHeureDelivrance).toLocaleString() : 'N/A'}</p>
                    </CCol>
                    <CCol md={6}>
                      <strong>Suite de la demande</strong>
                      <p className="mt-1 bg-light p-2 rounded">{demande.suiteDemande || 'N/A'}</p>
                    </CCol>
                  </CRow>
                </>
              )}

              {type === 'espace' && (
                <>
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <strong>Taille de l'entreprise</strong>
                      <p className="mt-1 bg-light p-2 rounded">{demande.tailleEntreprise || 'N/A'}</p>
                    </CCol>
                    <CCol md={6}>
                      <strong>Accepte les communications</strong>
                      <p className="mt-1 bg-light p-2 rounded">{demande.accepteEnvoi ? 'Oui' : 'Non'}</p>
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CCol md={12}>
                      <strong>Objet(s) de la demande</strong>
                      <p className="mt-1 bg-light p-2 rounded">{demande.objetVisite || 'N/A'}</p>
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <strong>Qualité du demandeur</strong>
                      <p className="mt-1 bg-light p-2 rounded">{demande.qualiteConseillerCCIS || 'N/A'}</p>
                    </CCol>
                    <CCol md={6}>
                      <strong>Date de l'entretien</strong>
                      <p className="mt-1 bg-light p-2 rounded">{demande.dateHeureDepart ? new Date(demande.dateHeureDepart).toLocaleString() : 'N/A'}</p>
                    </CCol>
                  </CRow>
                </>
              )}

              {type === 'salle' && (
                <>
                  <CRow className="mb-3">
                    <CCol md={12}>
                      <strong>Activité / Sujet</strong>
                      <p className="mt-1 bg-light p-2 rounded">{demande.activiteOuSujet || 'N/A'}</p>
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CCol md={12}>
                      <strong>Adresse</strong>
                      <p className="mt-1 bg-light p-2 rounded">{demande.adresse || 'N/A'}</p>
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <strong>Date de la réunion</strong>
                      <p className="mt-1 bg-light p-2 rounded">{demande.dateHeureReunion ? new Date(demande.dateHeureReunion).toLocaleString() : 'N/A'}</p>
                    </CCol>
                    <CCol md={6}>
                      <strong>Membres</strong>
                      <p className="mt-1 bg-light p-2 rounded">{demande.membres || 'N/A'}</p>
                    </CCol>
                  </CRow>
                </>
              )}

              <CRow className="mb-3">
                <CCol md={12}>
                  <strong>Observations</strong>
                  <p className="mt-1 bg-light p-2 rounded text-muted">{demande.observation || 'Aucune observation'}</p>
                </CCol>
              </CRow>
              
              <CRow className="mb-3">
                <CCol md={12}>
                  <strong>Date de création</strong>
                  <p className="mt-1 bg-light p-2 rounded">{new Date(demande.createdAt).toLocaleString()}</p>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>

          {/* Attachments Section */}
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Pièces jointes</strong>
            </CCardHeader>
            <CCardBody>
              {demande.attachments && demande.attachments.length > 0 ? (
                <CListGroup>
                  {demande.attachments.map((file, idx) => (
                    <CListGroupItem key={idx} className="d-flex justify-content-between align-items-center">
                      <span>📎 {file.fileName}</span>
                      <CButton size="sm" color="primary" variant="ghost">
                        Télécharger
                      </CButton>
                    </CListGroupItem>
                  ))}
                </CListGroup>
              ) : (
                <p className="text-muted text-center">Aucune pièce jointe</p>
              )}
            </CCardBody>
          </CCard>
        </CCol>

        <CCol lg={4}>
          {/* Organization Info */}
          <CCard className="mb-4">
            <CCardHeader>
              <strong><CIcon icon={cilBuilding} className="me-2" />Organisation</strong>
            </CCardHeader>
            <CCardBody>
              <p><strong>Nom:</strong> {demande.organizationName || demande.organization?.name || 'N/A'}</p>
              <p><strong>Type:</strong> {demande.organization?.type === 'ASSOCIATION' ? 'Association' : 'Entreprise'}</p>
              <p><strong>Ville:</strong> {demande.organization?.ville || demande.ville || 'N/A'}</p>
              {demande.organization?.ice && <p><strong>ICE:</strong> {demande.organization.ice}</p>}
              {demande.organization?.formeJuridique && <p><strong>Forme juridique:</strong> {demande.organization.formeJuridique}</p>}
            </CCardBody>
          </CCard>

          {/* Client Info */}
          <CCard className="mb-4">
            <CCardHeader>
              <strong><CIcon icon={cilUser} className="me-2" />Demandeur</strong>
            </CCardHeader>
            <CCardBody>
              <p><strong>Nom:</strong> {demande.submittedBy?.prenom} {demande.submittedBy?.nom}</p>
              <p><strong><CIcon icon={cilPhone} className="me-2" />Téléphone:</strong> {demande.submittedBy?.numTelGsm || 'N/A'}</p>
              <p><strong><CIcon icon={cilEnvelopeClosed} className="me-2" />Email:</strong> {demande.submittedBy?.email || 'N/A'}</p>
              {demande.submittedBy?.ville && <p><strong><CIcon icon={cilLocationPin} className="me-2" />Ville:</strong> {demande.submittedBy.ville}</p>}
              {demande.submittedBy?.statut && <p><strong>Statut:</strong> {demande.submittedBy.statut === 'AUTO_ENTREPRENEUR' ? 'Auto-entrepreneur' : 'Porteur de projet'}</p>}
            </CCardBody>
          </CCard>

          {/* Action Buttons */}
          {demande.status === 'EN_ATTENTE' && (
            <CCard className="border-danger">
              <CCardHeader className="bg-danger text-white">
                <strong>Actions</strong>
              </CCardHeader>
              <CCardBody>
                <div className="d-grid gap-2">
                  <CButton color="success" size="lg" onClick={handleValidateClick} disabled={processing}>
                    <CIcon icon={cilCheckCircle} className="me-2" />
                    Valider la demande
                  </CButton>
                  <CButton color="danger" size="lg" variant="outline" onClick={handleRejectClick} disabled={processing}>
                    <CIcon icon={cilBan} className="me-2" />
                    Rejeter la demande
                  </CButton>
                </div>
              </CCardBody>
            </CCard>
          )}
        </CCol>
      </CRow>

      {/* Qualité Modal for Validation */}
      <CModal visible={showQualiteModal} onClose={() => setShowQualiteModal(false)}>
        <CModalHeader closeButton>
          <CModalTitle>Validation de la demande</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormLabel className="fw-semibold">Qualité / Fonction *</CFormLabel>
          <select 
            className="form-select" 
            value={qualite} 
            onChange={(e) => setQualite(e.target.value)}
          >
            <option value="">Sélectionnez votre qualité...</option>
            <option value="Chef de service">Chef de service</option>
            <option value="Responsable accueil">Responsable accueil</option>
            <option value="Conseiller CCIS">Conseiller CCIS</option>
            <option value="Directeur">Directeur</option>
            <option value="Autre">Autre</option>
          </select>
          <small className="text-muted d-block mt-2">Cette information sera enregistrée dans les logs</small>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" variant="ghost" onClick={() => setShowQualiteModal(false)}>
            Annuler
          </CButton>
          <CButton color="success" onClick={handleValidate} disabled={processing}>
            {processing ? <CSpinner size="sm" /> : "Confirmer la validation"}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Reject Modal */}
      <CModal visible={rejectModal} onClose={() => setRejectModal(false)}>
        <CModalHeader closeButton>
          <CModalTitle>Motif du rejet</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormTextarea
            rows="4"
            placeholder="Expliquez la raison du rejet..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <small className="text-muted mt-2 d-block">Ce motif sera visible par le client</small>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" variant="ghost" onClick={() => setRejectModal(false)}>
            Annuler
          </CButton>
          <CButton color="danger" onClick={handleReject} disabled={processing}>
            {processing ? <CSpinner size="sm" /> : "Confirmer le rejet"}
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default EmployeeDemandeDetail;