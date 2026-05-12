import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    CForm, CCol, CFormInput, CButton, CCard, CCardBody, CCardHeader,
    CRow, CSpinner, CAlert, CFormSelect, CFormTextarea, CFormCheck, CFormSwitch, CFormLabel
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilArrowLeft, cilSave, cilInfo } from '@coreui/icons';
import axiosInstance from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';

const FicheRenseignements = () => {
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

    // Multiple checkboxes for Objet Visite
    const [selectedObjets, setSelectedObjets] = useState([]);
    
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const checkboxesList = [
        "Création d'entreprise",
        "Financement",
        "Formation",
        "Mise en relation",
        "Assistance juridique",
        "Accompagnement à l'export",
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

        try {
            const dateTimeDepart = new Date(`${formData.dateDepart}T${formData.heureDepart}:00`);
            
            const payload = {
                tailleEntreprise: formData.tailleEntreprise,
                accepteEnvoi: formData.accepteEnvoi,
                objetVisite: selectedObjets.join(', '),
                qualiteConseillerCCIS: formData.qualiteConseillerCCIS,
                dateHeureDepart: dateTimeDepart.toISOString(),
                recommandation: formData.recommandation
            };
            
            await axiosInstance.post(
                `/client/demandes/espace?userId=${user?.id}&orgId=${orgId}`, 
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
                <h4>Fiche de renseignements enregistrée !</h4>
                <p>Votre demande de renseignements a été soumise avec succès.</p>
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
                    <h3 className="mb-0">Fiche de Renseignements</h3>
                </div>

                <CCard className="shadow-sm border-success border-top-3">
                    <CCardHeader className="bg-light">
                        <CIcon icon={cilInfo} className="me-2" />
                        <strong>Formulaire de renseignements pour entreprises</strong>
                    </CCardHeader>
                    <CCardBody>
                        <CForm onSubmit={handleSubmit}>
                            
                            <CRow className="mb-4">
                                <CCol md={6} className="mb-3">
                                    <CFormLabel className="fw-semibold">Taille de l'entreprise</CFormLabel>
                                    <CFormSelect 
                                        name="tailleEntreprise" 
                                        value={formData.tailleEntreprise} 
                                        onChange={handleInputChange}
                                    >
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
                                        label="J'accepte de recevoir les newsletters et offres CCIS" 
                                        checked={formData.accepteEnvoi} 
                                        onChange={handleInputChange} 
                                    />
                                </CCol>
                            </CRow>

                            <h5 className="border-bottom pb-2 mb-3">Objet(s) de la demande de renseignements</h5>
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
                                    <CFormLabel className="fw-semibold">Qualité / Fonction du demandeur</CFormLabel>
                                    <CFormInput 
                                        name="qualiteConseillerCCIS" 
                                        value={formData.qualiteConseillerCCIS} 
                                        onChange={handleInputChange}
                                        placeholder="PDG, Directeur, etc."
                                    />
                                </CCol>
                                <CCol md={4} className="mb-3">
                                    <CFormLabel className="fw-semibold">Date de l'entretien</CFormLabel>
                                    <CFormInput 
                                        type="date" 
                                        name="dateDepart" 
                                        value={formData.dateDepart} 
                                        onChange={handleInputChange} 
                                    />
                                </CCol>
                                <CCol md={4} className="mb-3">
                                    <CFormLabel className="fw-semibold">Heure de l'entretien</CFormLabel>
                                    <CFormInput 
                                        type="time" 
                                        name="heureDepart" 
                                        value={formData.heureDepart} 
                                        onChange={handleInputChange} 
                                    />
                                </CCol>
                            </CRow>

                            <CRow className="mb-4">
                                <CCol md={12}>
                                    <CFormLabel className="fw-semibold">Recommandations / Conclusions</CFormLabel>
                                    <CFormTextarea 
                                        name="recommandation" 
                                        rows="3" 
                                        value={formData.recommandation} 
                                        onChange={handleInputChange}
                                        placeholder="Toute recommandation ou conclusion..."
                                    />
                                </CCol>
                            </CRow>

                            <div className="d-grid gap-2 mt-4">
                                <CButton color="success" className="text-white" type="submit" disabled={isLoading} size="lg">
                                    {isLoading ? <><CSpinner size="sm" className="me-2" /> Enregistrement...</> : <><CIcon icon={cilSave} className="me-2" /> Envoyer la fiche</>}
                                </CButton>
                            </div>
                        </CForm>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};

export default FicheRenseignements;