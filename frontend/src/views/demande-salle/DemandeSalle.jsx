import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CForm,
  CCol,
  CFormInput,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CSpinner,
  CAlert
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilArrowLeft, cilSave } from '@coreui/icons';
import axiosInstance from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';

const DemandeSalle = () => {
  const { orgId } = useParams(); // Get the company/association ID from the URL
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    activiteOuSujet: '',
    adresse: '',
    dateDemande: new Date().toISOString().split('T')[0],
    dateReunion: new Date().toISOString().split('T')[0],
    heureReunion: '',
    membre1: '', 
    membre2: '',
    membre3: ''
  });

  const [files, setFiles] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, key) => {
    if (e.target.files.length > 0) {
      setFiles(prev => ({ ...prev, [key]: e.target.files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Submit the JSON data first
      // Note: Make sure you have this endpoint in your ClientDemandeController!
      const response = await axiosInstance.post(
        `/api/client/demandes/salle?userId=${user?.id || 1}&orgId=${orgId}`, 
        formData
      );

      const newDemandeId = response.data.id;

      // 2. Upload Files (If you have a file upload endpoint configured)
      // const formDataFiles = new FormData();
      // Object.keys(files).forEach(key => formDataFiles.append('files', files[key]));
      // await axiosInstance.post(`/api/client/demandes/salle/${newDemandeId}/upload`, formDataFiles);

      setSuccess(true);
      setTimeout(() => navigate(`/client/workspace/${orgId}`), 3000); // Go back to dashboard after 3s

    } catch (error) {
      console.error("Erreur lors de la soumission :", error);
      alert("Une erreur s'est produite lors de la soumission.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <CAlert color="success" className="text-center p-5">
        <h4>Demande soumise avec succès !</h4>
        <p>Votre demande a été envoyée et est en attente de validation par l'administration.</p>
        <p>Redirection vers votre tableau de bord...</p>
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
          <h3 className="mb-0">Formulaire : Demande de Salle</h3>
        </div>

        <CCard className="shadow-sm">
          <CCardHeader className="bg-primary text-white">
            <strong>Détails de la réunion</strong>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              <CRow className="mb-4">
                <CCol md={12} className="mb-3">
                  <CFormInput 
                    name="activiteOuSujet" 
                    label="Activité ou Sujet / النشاط أو الموضوع" 
                    value={formData.activiteOuSujet} 
                    onChange={handleInputChange} 
                    required 
                  />
                </CCol>
                <CCol md={12} className="mb-3">
                  <CFormInput 
                    name="adresse" 
                    label="Adresse / العنوان" 
                    value={formData.adresse} 
                    onChange={handleInputChange} 
                    required 
                  />
                </CCol>
                <CCol md={4} className="mb-3">
                  <CFormInput 
                    type="date" 
                    name="dateDemande" 
                    label="Date de la demande" 
                    value={formData.dateDemande} 
                    onChange={handleInputChange} 
                  />
                </CCol>
                <CCol md={4} className="mb-3">
                  <CFormInput 
                    type="date" 
                    name="dateReunion" 
                    label="Date de la réunion" 
                    value={formData.dateReunion} 
                    onChange={handleInputChange} 
                    required 
                  />
                </CCol>
                <CCol md={4} className="mb-3">
                  <CFormInput 
                    type="time" 
                    name="heureReunion" 
                    label="Heure de la réunion" 
                    value={formData.heureReunion} 
                    onChange={handleInputChange} 
                    required 
                  />
                </CCol>
              </CRow>

              <h5 className="border-bottom pb-2 mb-3">Membres / Bureau</h5>
              <CRow className="mb-4">
                <CCol md={4}>
                  <CFormInput name="membre1" label="Nom du Membre 1 (ou Président)" value={formData.membre1} onChange={handleInputChange} />
                </CCol>
                <CCol md={4}>
                  <CFormInput name="membre2" label="Nom du Membre 2" value={formData.membre2} onChange={handleInputChange} />
                </CCol>
                <CCol md={4}>
                  <CFormInput name="membre3" label="Nom du Membre 3" value={formData.membre3} onChange={handleInputChange} />
                </CCol>
              </CRow>

              <h5 className="border-bottom pb-2 mb-3">Pièces Jointes (Optionnel)</h5>
              <CRow className="mb-4 bg-light p-3 rounded">
                <CCol md={6} className="mb-3">
                  <CFormInput type="file" label="Statut de l'association / القانون الأساسي" onChange={(e) => handleFileChange(e, 'statut')} />
                </CCol>
                <CCol md={6} className="mb-3">
                  <CFormInput type="file" label="Récépissé / وصل الإيداع" onChange={(e) => handleFileChange(e, 'recepisse')} />
                </CCol>
              </CRow>

              <div className="d-grid gap-2 mt-4">
                <CButton color="primary" type="submit" disabled={isLoading} size="lg">
                  {isLoading ? <><CSpinner size="sm" className="me-2" /> Enregistrement...</> : <><CIcon icon={cilSave} className="me-2" /> Soumettre la demande</>}
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default DemandeSalle;