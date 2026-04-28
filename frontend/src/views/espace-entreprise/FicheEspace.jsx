import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CForm, CCol, CFormInput, CButton, CCard, CCardBody, CCardHeader,
  CRow, CSpinner, CAlert, CFormSelect, CFormTextarea, CFormCheck, CFormSwitch
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilArrowLeft, cilSave } from '@coreui/icons';
import axiosInstance from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';

const FicheEspace = () => {
  const { orgId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    tailleEntreprise: 'TPE',
    accepteEnvoi: true,
    qualiteConseillerCCIS: '',
    recommandation: '',
    dateDepart: new Date().toISOString().split('T')[0],
    heureDepart: ''
  });

  // Handle multiple checkboxes for Objet Visite
  const [selectedObjets, setSelectedObjets] = useState([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const checkboxesList = [
    "Création d'entreprise",
    "Financement",
    "Formation",
    "Mise en relation",
    "Assistance juridique",
    "Autre"
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleCheckboxChange = (objet) => {
    if (selectedObjets.includes(objet)) {
      setSelectedObjets(selectedObjets.filter(item => item !== objet));
    } else {
      setSelectedObjets([...selectedObjets, objet]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Combine selected checkboxes into a comma-separated string like the old JavaFX app
    const payload = {
      ...formData,
      objetVisite: selectedObjets.join(', ')
    };

    try {
      await axiosInstance.post(
        `/api/client/demandes/espace?userId=${user?.id || 1}&orgId=${orgId}`, 
        payload
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
        <h4>Espace Entreprise enregistré !</h4>
        <p>Votre demande de visite/conseil a été soumise avec succès.</p>
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
          <h3 className="mb-0">Espace Entreprise</h3>
        </div>

        <CCard className="shadow-sm border-success border-top-3">
          <CCardHeader className="bg-light">
            <strong>Accompagnement et Conseil</strong>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              
              <CRow className="mb-4">
                <CCol md={6} className="mb-3">
                  <CFormSelect name="tailleEntreprise" label="Taille de l'entreprise" value={formData.tailleEntreprise} onChange={handleInputChange}>
                    <option value="Auto-Entrepreneur">Auto-Entrepreneur</option>
                    <option value="TPE">TPE (Très Petite Entreprise)</option>
                    <option value="PME">PME (Petite et Moyenne Entreprise)</option>
                    <option value="GE">GE (Grande Entreprise)</option>
                  </CFormSelect>
                </CCol>
                <CCol md={6} className="mb-3 d-flex align-items-center mt-4">
                  <CFormSwitch 
                    name="accepteEnvoi" 
                    id="accepteEnvoi"
                    label="Accepte de recevoir les newsletters et offres CCIS" 
                    checked={formData.accepteEnvoi} 
                    onChange={handleInputChange} 
                  />
                </CCol>
              </CRow>

              <h5 className="border-bottom pb-2 mb-3">Objet(s) de la visite</h5>
              <CRow className="mb-4 px-3">
                {checkboxesList.map((objet, index) => (
                  <CCol md={4} key={index} className="mb-2">
                    <CFormCheck 
                      id={`objet-${index}`}
                      label={objet}
                      checked={selectedObjets.includes(objet)}
                      onChange={() => handleCheckboxChange(objet)}
                    />
                  </CCol>
                ))}
              </CRow>

              <h5 className="border-bottom pb-2 mb-3">Détails de l'entretien</h5>
              <CRow className="mb-4">
                <CCol md={4} className="mb-3">
                  <CFormInput name="qualiteConseillerCCIS" label="Qualité / Fonction du demandeur" value={formData.qualiteConseillerCCIS} onChange={handleInputChange} />
                </CCol>
                <CCol md={4} className="mb-3">
                  <CFormInput type="date" name="dateDepart" label="Date de l'entretien" value={formData.dateDepart} onChange={handleInputChange} />
                </CCol>
                <CCol md={4} className="mb-3">
                  <CFormInput type="time" name="heureDepart" label="Heure de départ" value={formData.heureDepart} onChange={handleInputChange} />
                </CCol>
              </CRow>

              <CRow className="mb-4">
                <CCol md={12}>
                  <CFormTextarea 
                    name="recommandation" 
                    label="Recommandations / Conclusions" 
                    rows="3" 
                    value={formData.recommandation} 
                    onChange={handleInputChange} 
                  />
                </CCol>
              </CRow>

              <div className="d-grid gap-2 mt-4">
                <CButton color="success" className="text-white" type="submit" disabled={isLoading} size="lg">
                  {isLoading ? <><CSpinner size="sm" className="me-2" /> Enregistrement...</> : <><CIcon icon={cilSave} className="me-2" /> Soumettre</>}
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default FicheEspace;