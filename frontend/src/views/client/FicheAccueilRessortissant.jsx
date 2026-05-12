// src/views/client/FicheAccueilRessortissant.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    CForm, CCol, CFormInput, CButton, CCard, CCardBody, CCardHeader,
    CRow, CSpinner, CAlert, CFormSelect, CFormTextarea, CFormLabel
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilArrowLeft, cilSave, cilDocument } from '@coreui/icons';
import axiosInstance from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';

const FicheAccueilRessortissant = () => {
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

    // Options for "Objet de la visite" - adapted for ressortissant welcome form
    const objetsVisiteList = [
        "Visa des factures",
        "Certificat d'origine",
        "Attestation professionnelle",
        "Légalisation de signature",
        "Copie conforme",
        "Carte de séjour",
        "Renouvellement de titre de séjour",
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
            const dateTimeDelivrance = new Date(`${formData.dateDelivrance}T${formData.heureDelivrance}:00`);
            
            const payload = {
                objetVisite: formData.objetVisite,
                montant: parseFloat(formData.montant),
                suiteDemande: formData.suiteDemande,
                observation: formData.observation,
                dateHeureDelivrance: dateTimeDelivrance.toISOString()
            };
            
            await axiosInstance.post(
                `/client/demandes/administrative?userId=${user?.id}&orgId=${orgId}`, 
                payload
            );
            
            setSuccess(true);
            setTimeout(() => navigate(`/client/workspace/${orgId}`), 3000);
        } catch (error) {
            console.error("Erreur:", error);
            alert(error.response?.data?.error || "Une erreur s'est produite.");
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <CAlert color="success" className="text-center p-5">
                <h4>Demande enregistrée !</h4>
                <p>Votre fiche d'accueil ressortissant a été soumise avec succès et est en attente de traitement.</p>
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
                    <h3 className="mb-0">Fiche d'Accueil Ressortissant</h3>
                </div>

                <CCard className="shadow-sm border-info border-top-3">
                    <CCardHeader className="bg-light">
                        <CIcon icon={cilDocument} className="me-2" />
                        <strong>Formulaire d'accueil pour ressortissants</strong>
                    </CCardHeader>
                    <CCardBody>
                        <CForm onSubmit={handleSubmit}>
                            <CRow className="mb-4">
                                <CCol md={8} className="mb-3">
                                    <CFormLabel className="fw-semibold">Objet de la demande</CFormLabel>
                                    <CFormSelect 
                                        name="objetVisite" 
                                        value={formData.objetVisite} 
                                        onChange={handleInputChange} 
                                        required
                                    >
                                        <option value="">Sélectionnez l'objet...</option>
                                        {objetsVisiteList.map(obj => <option key={obj} value={obj}>{obj}</option>)}
                                    </CFormSelect>
                                </CCol>
                                <CCol md={4} className="mb-3">
                                    <CFormLabel className="fw-semibold">Montant (MAD)</CFormLabel>
                                    <CFormInput 
                                        type="number" 
                                        step="0.01" 
                                        name="montant" 
                                        value={formData.montant} 
                                        onChange={handleInputChange} 
                                    />
                                </CCol>
                            </CRow>

                            <CRow className="mb-4">
                                <CCol md={6} className="mb-3">
                                    <CFormLabel className="fw-semibold">Date de délivrance souhaitée</CFormLabel>
                                    <CFormInput 
                                        type="date" 
                                        name="dateDelivrance" 
                                        value={formData.dateDelivrance} 
                                        onChange={handleInputChange} 
                                    />
                                </CCol>
                                <CCol md={6} className="mb-3">
                                    <CFormLabel className="fw-semibold">Heure de délivrance souhaitée</CFormLabel>
                                    <CFormInput 
                                        type="time" 
                                        name="heureDelivrance" 
                                        value={formData.heureDelivrance} 
                                        onChange={handleInputChange} 
                                    />
                                </CCol>
                            </CRow>

                            <CRow className="mb-4">
                                <CCol md={12} className="mb-3">
                                    <CFormLabel className="fw-semibold">Suite de la demande</CFormLabel>
                                    <CFormInput 
                                        name="suiteDemande" 
                                        value={formData.suiteDemande} 
                                        onChange={handleInputChange} 
                                        placeholder="Informations complémentaires..."
                                    />
                                </CCol>
                                <CCol md={12} className="mb-3">
                                    <CFormLabel className="fw-semibold">Observations</CFormLabel>
                                    <CFormTextarea 
                                        name="observation" 
                                        rows="3" 
                                        value={formData.observation} 
                                        onChange={handleInputChange} 
                                        placeholder="Toute information supplémentaire..."
                                    />
                                </CCol>
                            </CRow>

                            <div className="d-grid gap-2 mt-4">
                                <CButton color="info" className="text-white" type="submit" disabled={isLoading} size="lg">
                                    {isLoading ? <><CSpinner size="sm" className="me-2" /> Traitement...</> : <><CIcon icon={cilSave} className="me-2" /> Envoyer la demande</>}
                                </CButton>
                            </div>
                        </CForm>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};

export default FicheAccueilRessortissant;