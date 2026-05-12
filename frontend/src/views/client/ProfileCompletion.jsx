// src/views/auth/ProfileCompletion.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CForm,
    CFormInput,
    CFormSelect,
    CButton,
    CSpinner,
    CAlert,
    CFormLabel
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSave, cilUser } from '@coreui/icons';
import axiosInstance from '../../api/axiosInstance';

const ProfileCompletion = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        numTelFixe: '',
        numTelGsm: '',
        adresse: '',
        ville: '',
        statut: 'PORTEUR_PROJET' // PORTEUR_PROJET or AUTO_ENTREPRENEUR
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        // Basic validation
        if (!formData.nom.trim() || !formData.prenom.trim()) {
            setError("Veuillez saisir votre nom et prénom");
            setLoading(false);
            return;
        }
        
        if (!formData.numTelGsm.trim()) {
            setError("Veuillez saisir votre numéro de téléphone GSM");
            setLoading(false);
            return;
        }
        
        try {
            await axiosInstance.post(`/auth/complete-profile/${userId}`, formData);
            setSuccess(true);
            
            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            console.error("Profile completion error:", err);
            setError(err.response?.data?.error || "Erreur lors de la complétion du profil");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <CRow className="justify-content-center min-vh-100 align-items-center">
                <CCol md={8}>
                    <CAlert color="success" className="text-center p-5">
                        <h4>Profil complété avec succès !</h4>
                        <p>Votre compte est maintenant en attente d'activation par un employé.</p>
                        <p>Vous serez notifié par email une fois votre compte activé.</p>
                        <p>Redirection vers la page de connexion...</p>
                    </CAlert>
                </CCol>
            </CRow>
        );
    }

    return (
        <CRow className="justify-content-center min-vh-100 align-items-center py-5">
            <CCol md={8} lg={6}>
                <CCard className="shadow-lg">
                    <CCardHeader className="bg-primary text-white text-center py-4">
                        <CIcon icon={cilUser} size="xl" className="mb-2" />
                        <h3 className="mb-0">Compléter votre profil</h3>
                        <p className="mb-0 text-white-50">Une dernière étape pour activer votre compte</p>
                    </CCardHeader>
                    <CCardBody className="p-4">
                        {error && (
                            <CAlert color="danger" dismissible onClose={() => setError(null)}>
                                {error}
                            </CAlert>
                        )}
                        
                        <p className="text-muted mb-4">
                            Veuillez compléter vos informations personnelles. Votre compte sera ensuite 
                            activé par un de nos employés.
                        </p>
                        
                        <CForm onSubmit={handleSubmit}>
                            <CRow>
                                <CCol md={6} className="mb-3">
                                    <CFormLabel className="fw-semibold">Nom *</CFormLabel>
                                    <CFormInput
                                        name="nom"
                                        value={formData.nom}
                                        onChange={handleChange}
                                        placeholder="Votre nom"
                                        required
                                    />
                                </CCol>
                                <CCol md={6} className="mb-3">
                                    <CFormLabel className="fw-semibold">Prénom *</CFormLabel>
                                    <CFormInput
                                        name="prenom"
                                        value={formData.prenom}
                                        onChange={handleChange}
                                        placeholder="Votre prénom"
                                        required
                                    />
                                </CCol>
                            </CRow>
                            
                            <CRow>
                                <CCol md={6} className="mb-3">
                                    <CFormLabel className="fw-semibold">Téléphone Fixe</CFormLabel>
                                    <CFormInput
                                        name="numTelFixe"
                                        value={formData.numTelFixe}
                                        onChange={handleChange}
                                        placeholder="05 XX XX XX XX"
                                    />
                                </CCol>
                                <CCol md={6} className="mb-3">
                                    <CFormLabel className="fw-semibold">Téléphone GSM *</CFormLabel>
                                    <CFormInput
                                        name="numTelGsm"
                                        value={formData.numTelGsm}
                                        onChange={handleChange}
                                        placeholder="06 XX XX XX XX"
                                        required
                                    />
                                </CCol>
                            </CRow>
                            
                            <CRow>
                                <CCol md={8} className="mb-3">
                                    <CFormLabel className="fw-semibold">Adresse</CFormLabel>
                                    <CFormInput
                                        name="adresse"
                                        value={formData.adresse}
                                        onChange={handleChange}
                                        placeholder="Votre adresse complète"
                                    />
                                </CCol>
                                <CCol md={4} className="mb-3">
                                    <CFormLabel className="fw-semibold">Ville</CFormLabel>
                                    <CFormInput
                                        name="ville"
                                        value={formData.ville}
                                        onChange={handleChange}
                                        placeholder="Casablanca, Rabat..."
                                    />
                                </CCol>
                            </CRow>
                            
                            <div className="mb-4">
                                <CFormLabel className="fw-semibold">Statut</CFormLabel>
                                <CFormSelect
                                    name="statut"
                                    value={formData.statut}
                                    onChange={handleChange}
                                >
                                    <option value="PORTEUR_PROJET">Porteur de projet</option>
                                    <option value="AUTO_ENTREPRENEUR">Auto-entrepreneur</option>
                                </CFormSelect>
                            </div>
                            
                            <div className="d-grid gap-2 mt-4">
                                <CButton 
                                    color="primary" 
                                    type="submit" 
                                    disabled={loading}
                                    size="lg"
                                >
                                    {loading ? <><CSpinner size="sm" className="me-2" /> Envoi...</> : <><CIcon icon={cilSave} className="me-2" /> Compléter mon profil</>}
                                </CButton>
                            </div>
                        </CForm>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};

export default ProfileCompletion;