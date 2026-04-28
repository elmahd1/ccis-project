import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CForm, CCol, CFormInput, CButton, CCard, CCardBody, CCardHeader,
  CRow, CSpinner, CAlert, CFormSelect, CFormTextarea
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilArrowLeft, cilSave } from '@coreui/icons';
import axiosInstance from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';

const FicheDemarche = () => {
  const { orgId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    objetVisite: '',
    montant: 0,
    suiteDemande: '',
    observation: '',
    dateDelivrance: new Date().toISOString().split('T')[0],
    heureDelivrance: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Common options from the old app
  const objetsVisiteList = [
    "Visa des factures",
    "Certificat d'origine",
    "Attestation professionnelle",
    "Légalisation de signature",
    "Copie conforme",
    "Autre"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axiosInstance.post(
        `/api/client/demandes/administrative?userId=${user?.id || 1}&orgId=${orgId}`, 
        formData
      );
      setSuccess(true);
      setTimeout(() => navigate(`/client/workspace/${orgId}`), 3000);
    } catch (error) {
      console.error("Erreur :", error);
      alert("Une erreur s'est produite lors de la soumission.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <CAlert color="success" className="text-center p-5">
        <h4>Demande enregistrée !</h4>
        <p>La démarche a été soumise avec succès et est en attente de traitement.</p>
        <p>Redirection vers le tableau de bord...</p>
      </CAlert>
    );
  }

  return (
    <CRow className="justify-content-center">
      <CCol md={10}>
        <div className="d-flex align-items-center mb-3">
          <CButton color="secondary" variant="ghost" onClick={() => navigate(`/client/workspace/${orgId}`)} className="me-3">
            <CIcon icon={cilArrowLeft} /> Retour
          </CButton>
          <h3 className="mb-0">Démarche Administrative</h3>
        </div>

        <CCard className="shadow-sm border-info border-top-3">
          <CCardHeader className="bg-light">
            <strong>Détails de la démarche</strong>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              <CRow className="mb-4">
                <CCol md={8} className="mb-3">
                  <CFormSelect 
                    name="objetVisite" 
                    label="Objet de la visite / موضوع الزيارة" 
                    value={formData.objetVisite} 
                    onChange={handleInputChange} 
                    required
                  >
                    <option value="">Sélectionnez l'objet...</option>
                    {objetsVisiteList.map(obj => <option key={obj} value={obj}>{obj}</option>)}
                  </CFormSelect>
                </CCol>
                <CCol md={4} className="mb-3">
                  <CFormInput 
                    type="number" 
                    step="0.01" 
                    name="montant" 
                    label="Montant (MAD)" 
                    value={formData.montant} 
                    onChange={handleInputChange} 
                  />
                </CCol>
              </CRow>

              <CRow className="mb-4">
                <CCol md={6} className="mb-3">
                  <CFormInput 
                    type="date" 
                    name="dateDelivrance" 
                    label="Date de délivrance souhaitée" 
                    value={formData.dateDelivrance} 
                    onChange={handleInputChange} 
                  />
                </CCol>
                <CCol md={6} className="mb-3">
                  <CFormInput 
                    type="time" 
                    name="heureDelivrance" 
                    label="Heure de délivrance souhaitée" 
                    value={formData.heureDelivrance} 
                    onChange={handleInputChange} 
                  />
                </CCol>
              </CRow>

              <CRow className="mb-4">
                <CCol md={12} className="mb-3">
                  <CFormInput 
                    name="suiteDemande" 
                    label="Suite de la demande" 
                    value={formData.suiteDemande} 
                    onChange={handleInputChange} 
                  />
                </CCol>
                <CCol md={12} className="mb-3">
                  <CFormTextarea 
                    name="observation" 
                    label="Observation / ملاحظations" 
                    rows="3" 
                    value={formData.observation} 
                    onChange={handleInputChange} 
                  />
                </CCol>
              </CRow>

              <div className="d-grid gap-2 mt-4">
                <CButton color="info" className="text-white" type="submit" disabled={isLoading} size="lg">
                  {isLoading ? <><CSpinner size="sm" className="me-2" /> Traitement...</> : <><CIcon icon={cilSave} className="me-2" /> Valider la démarche</>}
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default FicheDemarche;