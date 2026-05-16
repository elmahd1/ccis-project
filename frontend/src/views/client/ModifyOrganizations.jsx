import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CCard, CCardBody, CCardHeader, CCol, CRow,
  CButton, CSpinner, CFormInput, CFormSelect, CFormLabel,
  CAlert, CFormTextarea, CFormCheck
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
    // Entreprise fields
    ice: '',
    formeJuridique: '',
    secteurActivite: '',
    taille: '',
    activite: '',
    // Common fields
    adresse: '',
    ville: '',
    telFixe: '',
    telGsm: '',
    emailContact: '',
    siteWeb: '',
    description: '',
    // Association specific
    isOfficiallyCreated: false
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
        // Entreprise fields
        ice: org.ice || '',
        formeJuridique: org.formeJuridique || '',
        secteurActivite: org.secteurActivite || '',
        taille: org.taille || '',
        activite: org.activite || '',
        // Common fields
        adresse: org.adresse || '',
        ville: org.ville || '',
        telFixe: org.telFixe || '',
        telGsm: org.telGsm || '',
        emailContact: org.emailContact || '',
        siteWeb: org.siteWeb || '',
        description: org.description || '',
        // Association specific
        isOfficiallyCreated: org.officiallyCreated || false
      });
    } catch (error) {
      console.error("Error fetching organization:", error);
      setError("Impossible de charger les informations de l'organisation");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
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
      // Prepare payload based on organization type
      const payload = { ...formData };
      
      // For ASSOCIATION: remove fields that are not relevant
      if (formData.type === 'ASSOCIATION') {
        delete payload.ice;
        delete payload.formeJuridique;
        delete payload.secteurActivite;
        delete payload.taille;
      }
      
      await axiosInstance.put(`/organizations/${id}`, payload);
      setSuccess("Organisation mise à jour avec succès");
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/client/workspaces');
      }, 2000);
    } catch (err) {
      console.error("Error updating organization:", err);
      setError(err.response?.data?.error || "Erreur lors de la mise à jour. Veuillez réessayer.");
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

  const isAssociation = formData.type === 'ASSOCIATION';

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

                {/* Association status - only for ASSOCIATION type */}
                {isAssociation && (
                  <CCol md={12} className="mb-3">
                    <CFormLabel className="fw-semibold">Statut de l'association</CFormLabel>
                    <div className="d-flex gap-4 mt-2">
                      <CFormCheck
                        id="officiallyCreated"
                        label="Association déjà créée"
                        checked={formData.isOfficiallyCreated === true}
                        onChange={() => setFormData(prev => ({ ...prev, isOfficiallyCreated: true }))}
                      />
                      <CFormCheck
                        id="notOfficiallyCreated"
                        label="Association en cours de création"
                        checked={formData.isOfficiallyCreated === false}
                        onChange={() => setFormData(prev => ({ ...prev, isOfficiallyCreated: false }))}
                      />
                    </div>
                    <small className="text-muted">
                      {formData.isOfficiallyCreated 
                        ? "L'association a déjà son récépissé et est officiellement déclarée."
                        : "L'association est en cours de constitution."}
                    </small>
                  </CCol>
                )}

                {/* ENTREPRISE specific fields - only for ENTREPRISE type */}
                {!isAssociation && (
                  <>
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
                        placeholder="SARL, SA, Auto-entrepreneur..."
                      />
                    </CCol>
                    <CCol md={6} className="mb-3">
                      <CFormLabel className="fw-semibold">Secteur d'Activité</CFormLabel>
                      <CFormInput 
                        name="secteurActivite"
                        value={formData.secteurActivite} 
                        onChange={handleInputChange} 
                        placeholder="Tech, Commerce, Agriculture..."
                      />
                    </CCol>
                    <CCol md={6} className="mb-3">
                      <CFormLabel className="fw-semibold">Taille</CFormLabel>
                      <CFormSelect 
                        name="taille"
                        value={formData.taille} 
                        onChange={handleInputChange}
                      >
                        <option value="">Sélectionner la taille</option>
                        <option value="MICRO">Micro (0-9 employés)</option>
                        <option value="PETITE">Petite (10-49 employés)</option>
                        <option value="MOYENNE">Moyenne (50-249 employés)</option>
                        <option value="GRANDE">Grande (250+ employés)</option>
                      </CFormSelect>
                    </CCol>
                  </>
                )}

                {/* Common fields for both types */}
                <CCol md={12} className="mb-3">
                  <CFormLabel className="fw-semibold">Activité détaillée</CFormLabel>
                  <CFormInput 
                    name="activite"
                    value={formData.activite} 
                    onChange={handleInputChange} 
                    placeholder="Description détaillée de l'activité"
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
                    placeholder="05 XX XX XX XX"
                  />
                </CCol>
                <CCol md={6} className="mb-3">
                  <CFormLabel className="fw-semibold">Téléphone GSM</CFormLabel>
                  <CFormInput 
                    name="telGsm"
                    value={formData.telGsm} 
                    onChange={handleInputChange} 
                    placeholder="06 XX XX XX XX"
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