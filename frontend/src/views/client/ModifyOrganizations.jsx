import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CCard, CCardBody, CCardHeader, CCol, CRow,
  CButton, CSpinner, CFormInput, CFormSelect, CFormLabel,
  CAlert, CFormTextarea
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSave, cilArrowLeft } from '@coreui/icons';
import axiosInstance from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';

const ModifyOrganizations = () => {
  const { id } = useParams(); // Get organization ID from URL
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'ENTREPRISE',
    ice: '',
    formeJuridique: '',
    secteurActivite: '',
    adresse: '',
    ville: '',
    telFixe: '',
    telGsm: '',
    emailContact: '',
    siteWeb: '',
    description: ''
  });

  useEffect(() => {
    if (id) {
      fetchOrganization();
    } else {
      setError("Aucun ID d'organisation fourni");
      setLoading(false);
    }
  }, [id]);

  const fetchOrganization = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/organizations/${id}`);
      const org = response.data;
      
      setFormData({
        name: org.name || '',
        type: org.type || 'ENTREPRISE',
        ice: org.ice || '',
        formeJuridique: org.formeJuridique || '',
        secteurActivite: org.secteurActivite || '',
        adresse: org.adresse || '',
        ville: org.ville || '',
        telFixe: org.telFixe || '',
        telGsm: org.telGsm || '',
        emailContact: org.emailContact || '',
        siteWeb: org.siteWeb || '',
        description: org.description || ''
      });
    } catch (error) {
      console.error("Error fetching organization:", error);
      setError("Impossible de charger les informations de l'organisation");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError("Le nom de l'organisation est requis");
      return;
    }
    
    setSaving(true);
    setError(null);
    
    try {
      await axiosInstance.put(`/organizations/${id}`, formData);
      setSuccess("Organisation mise à jour avec succès");
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/client/workspaces');
      }, 2000);
    } catch (err) {
      console.error("Error updating organization:", err);
      setError("Erreur lors de la mise à jour. Veuillez réessayer.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <CSpinner color="primary" />
        <p className="mt-2">Chargement de l'organisation...</p>
      </div>
    );
  }

  return (
    <CRow className="justify-content-center">
      <CCol md={10}>
        <div className="d-flex align-items-center mb-4">
          <CButton 
            color="secondary" 
            variant="ghost" 
            onClick={() => navigate('/client/workspaces')} 
            className="me-3"
          >
            <CIcon icon={cilArrowLeft} /> Retour
          </CButton>
          <h3 className="mb-0">Modifier l'organisation</h3>
        </div>

        <CCard className="shadow-sm">
          <CCardHeader className="bg-primary text-white">
            <strong>Informations de l'organisation</strong>
          </CCardHeader>
          <CCardBody>
            {error && <CAlert color="danger" dismissible onClose={() => setError(null)}>{error}</CAlert>}
            {success && <CAlert color="success" dismissible onClose={() => setSuccess(null)}>{success}</CAlert>}
            
            <form onSubmit={handleSubmit}>
              <CRow>
                <CCol md={6} className="mb-3">
                  <CFormLabel className="fw-semibold">Nom *</CFormLabel>
                  <CFormInput 
                    name="name"
                    value={formData.name} 
                    onChange={handleInputChange} 
                    placeholder="Nom de l'organisation"
                    required
                  />
                </CCol>
                <CCol md={6} className="mb-3">
                  <CFormLabel className="fw-semibold">Type</CFormLabel>
                  <CFormSelect 
                    name="type"
                    value={formData.type} 
                    onChange={handleInputChange}
                  >
                    <option value="ENTREPRISE">Entreprise</option>
                    <option value="ASSOCIATION">Association</option>
                  </CFormSelect>
                </CCol>
                <CCol md={6} className="mb-3">
                  <CFormLabel className="fw-semibold">ICE</CFormLabel>
                  <CFormInput 
                    name="ice"
                    value={formData.ice} 
                    onChange={handleInputChange} 
                    placeholder="Identifiant Commun de l'Entreprise"
                  />
                </CCol>
                <CCol md={6} className="mb-3">
                  <CFormLabel className="fw-semibold">Forme Juridique</CFormLabel>
                  <CFormInput 
                    name="formeJuridique"
                    value={formData.formeJuridique} 
                    onChange={handleInputChange} 
                    placeholder="SARL, SA, Association..."
                  />
                </CCol>
                <CCol md={6} className="mb-3">
                  <CFormLabel className="fw-semibold">Secteur d'Activité</CFormLabel>
                  <CFormInput 
                    name="secteurActivite"
                    value={formData.secteurActivite} 
                    onChange={handleInputChange} 
                    placeholder="Tech, Commerce, Éducation..."
                  />
                </CCol>
                <CCol md={6} className="mb-3">
                  <CFormLabel className="fw-semibold">Ville</CFormLabel>
                  <CFormInput 
                    name="ville"
                    value={formData.ville} 
                    onChange={handleInputChange} 
                    placeholder="Casablanca, Rabat, Marrakech..."
                  />
                </CCol>
                <CCol md={12} className="mb-3">
                  <CFormLabel className="fw-semibold">Adresse</CFormLabel>
                  <CFormInput 
                    name="adresse"
                    value={formData.adresse} 
                    onChange={handleInputChange} 
                    placeholder="Adresse complète du siège"
                  />
                </CCol>
                <CCol md={6} className="mb-3">
                  <CFormLabel className="fw-semibold">Téléphone Fixe</CFormLabel>
                  <CFormInput 
                    name="telFixe"
                    value={formData.telFixe} 
                    onChange={handleInputChange} 
                    placeholder="Numéro de téléphone fixe"
                  />
                </CCol>
                <CCol md={6} className="mb-3">
                  <CFormLabel className="fw-semibold">Téléphone GSM</CFormLabel>
                  <CFormInput 
                    name="telGsm"
                    value={formData.telGsm} 
                    onChange={handleInputChange} 
                    placeholder="Numéro de téléphone GSM"
                  />
                </CCol>
                <CCol md={6} className="mb-3">
                  <CFormLabel className="fw-semibold">Email de Contact</CFormLabel>
                  <CFormInput 
                    name="emailContact"
                    type="email"
                    value={formData.emailContact} 
                    onChange={handleInputChange} 
                    placeholder="contact@entreprise.com"
                  />
                </CCol>
                <CCol md={6} className="mb-3">
                  <CFormLabel className="fw-semibold">Site Web</CFormLabel>
                  <CFormInput 
                    name="siteWeb"
                    value={formData.siteWeb} 
                    onChange={handleInputChange} 
                    placeholder="https://www.entreprise.com"
                  />
                </CCol>
                <CCol md={12} className="mb-3">
                  <CFormLabel className="fw-semibold">Description</CFormLabel>
                  <CFormTextarea 
                    name="description"
                    value={formData.description} 
                    onChange={handleInputChange} 
                    rows="3"
                    placeholder="Description de l'organisation..."
                  />
                </CCol>
              </CRow>

              <div className="d-grid gap-2 mt-4">
                <CButton color="primary" type="submit" disabled={saving} size="lg">
                  {saving ? <><CSpinner size="sm" className="me-2" /> Enregistrement...</> : <><CIcon icon={cilSave} className="me-2" /> Enregistrer les modifications</>}
                </CButton>
              </div>
            </form>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default ModifyOrganizations;