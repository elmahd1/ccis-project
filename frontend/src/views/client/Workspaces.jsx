// src/views/client/Workspaces.jsx - Updated with all Organization fields
import React, { useState, useEffect } from 'react';
import {
    CRow, CCol, CCard, CCardBody, CCardTitle, CCardText, CButton,
    CSpinner, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter,
    CFormInput, CFormSelect, CBadge, CFormTextarea, CFormLabel
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilBuilding, cilArrowRight, cilBriefcase, cilInstitution, cilPencil } from '@coreui/icons';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';

const Workspaces = () => {
    const { user, needsProfileCompletion, needsActivation, isActive } = useAuth();
    const navigate = useNavigate();
    const [workspaces, setWorkspaces] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [visible, setVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Check if user can create organization
    const canCreateOrganization = isActive;

    const [newOrg, setNewOrg] = useState({ 
        name: '', 
        type: 'ENTREPRISE',
        ice: '',
        formeJuridique: '',
        secteurActivite: '',
        activite: '',
        taille: '',
        adresse: '',
        ville: '',
        telFixe: '',
        telGsm: '',
        emailContact: '',
        siteWeb: '',
        description: ''
    });

    useEffect(() => {
        if (user?.id) {
            fetchWorkspaces();
        }
    }, [user]);

    const fetchWorkspaces = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/organizations/user/${user?.id}`);
            console.log("Workspaces fetched:", response.data);
            setWorkspaces(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des espaces", error);
            if (error.response?.status === 403) {
                // Handle account status issues
                if (error.response?.data?.error?.includes('activé')) {
                    navigate('/pending-activation');
                }
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCreateWorkspace = async () => {
        setIsSubmitting(true);
        setError(null);
        
        if (!newOrg.name.trim()) {
            setError("Le nom de l'organisation est requis");
            setIsSubmitting(false);
            return;
        }
        
        try {
            await axiosInstance.post(`/organizations/create?userId=${user?.id}`, newOrg);
            setVisible(false);
            setNewOrg({ 
                name: '', type: 'ENTREPRISE', ice: '', formeJuridique: '', 
                secteurActivite: '', activite: '', taille: '', adresse: '', 
                ville: '', telFixe: '', telGsm: '', emailContact: '', 
                siteWeb: '', description: '' 
            });
            fetchWorkspaces();
        } catch (error) {
            console.error("Erreur lors de la création", error);
            setError(error.response?.data?.error || error.response?.data || "Erreur lors de la création de l'organisation");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle account status messages
    if (needsProfileCompletion) {
        return (
            <div className="text-center mt-5 p-5">
                <div className="alert alert-warning">
                    <h4>Profil incomplet</h4>
                    <p>Veuillez compléter votre profil pour accéder à vos espaces de travail.</p>
                    <CButton color="primary" onClick={() => navigate(`/complete-profile/${user?.id}`)}>
                        Compléter mon profil
                    </CButton>
                </div>
            </div>
        );
    }
    
    if (needsActivation) {
        return (
            <div className="text-center mt-5 p-5">
                <div className="alert alert-info">
                    <h4>Compte en attente d'activation</h4>
                    <p>Votre compte est en attente d'activation par un employé.</p>
                    <p>Vous recevrez une notification une fois votre compte activé.</p>
                </div>
            </div>
        );
    }

    if (loading) return <div className="text-center mt-5"><CSpinner color="primary" /></div>;

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <h2>Mes Espaces de Travail</h2>
                <CButton 
                    color="primary" 
                    onClick={() => setVisible(true)} 
                    disabled={!canCreateOrganization}
                    title={!canCreateOrganization ? "Veuillez attendre l'activation de votre compte" : ""}
                >
                    <CIcon icon={cilPlus} className="me-2" /> Ajouter une organisation
                </CButton>
            </div>

            {!canCreateOrganization && (
                <div className="alert alert-warning mb-4">
                    <strong>Compte en attente d'activation :</strong> Vous ne pouvez pas créer d'organisation tant que votre compte n'est pas activé.
                </div>
            )}

            <CRow>
                {workspaces.length === 0 ? (
                    <CCol>
                        <div className="text-center text-muted mt-5 bg-light p-5 rounded">
                            <CIcon icon={cilBuilding} size="3xl" className="mb-3" />
                            <h4>Aucun espace trouvé</h4>
                            <p>Cliquez sur le bouton pour ajouter votre première entreprise ou association.</p>
                        </div>
                    </CCol>
                ) : (
                    workspaces.map((org) => (
                        <CCol xs={12} sm={6} md={4} key={org.id} className="mb-4">
                            <CCard className="h-100 shadow-sm">
                                <CCardBody className="d-flex flex-column">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <CIcon icon={org.type === 'ASSOCIATION' ? cilInstitution : cilBriefcase} size="2xl" className={org.type === 'ASSOCIATION' ? "text-success" : "text-info"} />
                                        <div className="d-flex gap-2">
                                            <CBadge color={org.type === 'ASSOCIATION' ? "success" : "info"} shape="rounded-pill">
                                                {org.type === 'ASSOCIATION' ? 'Association' : 'Entreprise'}
                                            </CBadge>
                                            <CButton 
                                                color="warning" 
                                                size="sm" 
                                                variant="ghost" 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/client/modifier-espace/${org.id}`);
                                                }}
                                                title="Modifier l'organisation"
                                            >
                                                <CIcon icon={cilPencil} />
                                            </CButton>
                                        </div>
                                    </div>
                                    <CCardTitle className="mb-2 fs-5 fw-bold">{org.name}</CCardTitle>
                                    <div className="small text-muted mb-3">
                                        {org.ville && <div>📍 {org.ville}</div>}
                                        {org.ice && <div>🆔 ICE: {org.ice}</div>}
                                        {org.secteurActivite && <div>📊 {org.secteurActivite}</div>}
                                    </div>
                                    <CButton 
                                        color="dark" 
                                        variant="ghost" 
                                        className="mt-auto align-self-start p-0 d-flex align-items-center"
                                        onClick={() => navigate(`/client/workspace/${org.id}`)}
                                    >
                                        Accéder au tableau de bord <CIcon icon={cilArrowRight} className="ms-2" />
                                    </CButton>
                                </CCardBody>
                            </CCard>
                        </CCol>
                    ))
                )}
            </CRow>

            <CModal visible={visible} onClose={() => setVisible(false)} alignment="center" size="lg">
                <CModalHeader onClose={() => setVisible(false)}>
                    <CModalTitle>Nouvelle Organisation</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <CRow>
                        <CCol md={6} className="mb-3">
                            <CFormLabel className="fw-semibold">Nom *</CFormLabel>
                            <CFormInput 
                                value={newOrg.name} 
                                onChange={(e) => setNewOrg({...newOrg, name: e.target.value})} 
                                required 
                            />
                        </CCol>
                        <CCol md={6} className="mb-3">
                            <CFormLabel className="fw-semibold">Type</CFormLabel>
                            <CFormSelect 
                                value={newOrg.type} 
                                onChange={(e) => setNewOrg({...newOrg, type: e.target.value})}
                            >
                                <option value="ENTREPRISE">Entreprise</option>
                                <option value="ASSOCIATION">Association</option>
                            </CFormSelect>
                        </CCol>
                        <CCol md={6} className="mb-3">
                            <CFormLabel className="fw-semibold">ICE</CFormLabel>
                            <CFormInput 
                                value={newOrg.ice} 
                                onChange={(e) => setNewOrg({...newOrg, ice: e.target.value})} 
                                placeholder="Identifiant Commun de l'Entreprise"
                            />
                        </CCol>
                        <CCol md={6} className="mb-3">
                            <CFormLabel className="fw-semibold">Forme Juridique</CFormLabel>
                            <CFormInput 
                                value={newOrg.formeJuridique} 
                                onChange={(e) => setNewOrg({...newOrg, formeJuridique: e.target.value})} 
                                placeholder="SARL, SA, Association..."
                            />
                        </CCol>
                        <CCol md={6} className="mb-3">
                            <CFormLabel className="fw-semibold">Secteur d'Activité</CFormLabel>
                            <CFormInput 
                                value={newOrg.secteurActivite} 
                                onChange={(e) => setNewOrg({...newOrg, secteurActivite: e.target.value})} 
                                placeholder="Tech, Commerce, Agriculture..."
                            />
                        </CCol>
                        <CCol md={6} className="mb-3">
                            <CFormLabel className="fw-semibold">Taille</CFormLabel>
                            <CFormSelect 
                                value={newOrg.taille} 
                                onChange={(e) => setNewOrg({...newOrg, taille: e.target.value})}
                            >
                                <option value="">Sélectionner la taille</option>
                                <option value="MICRO">Micro (0-9 employés)</option>
                                <option value="PETITE">Petite (10-49 employés)</option>
                                <option value="MOYENNE">Moyenne (50-249 employés)</option>
                                <option value="GRANDE">Grande (250+ employés)</option>
                            </CFormSelect>
                        </CCol>
                        <CCol md={12} className="mb-3">
                            <CFormLabel className="fw-semibold">Activité détaillée</CFormLabel>
                            <CFormInput 
                                value={newOrg.activite} 
                                onChange={(e) => setNewOrg({...newOrg, activite: e.target.value})} 
                                placeholder="Description détaillée de l'activité"
                            />
                        </CCol>
                        <CCol md={6} className="mb-3">
                            <CFormLabel className="fw-semibold">Ville</CFormLabel>
                            <CFormInput 
                                value={newOrg.ville} 
                                onChange={(e) => setNewOrg({...newOrg, ville: e.target.value})} 
                                placeholder="Casablanca, Rabat, Marrakech..."
                            />
                        </CCol>
                        <CCol md={12} className="mb-3">
                            <CFormLabel className="fw-semibold">Adresse Siège</CFormLabel>
                            <CFormInput 
                                value={newOrg.adresse} 
                                onChange={(e) => setNewOrg({...newOrg, adresse: e.target.value})} 
                                placeholder="Adresse complète"
                            />
                        </CCol>
                        <CCol md={6} className="mb-3">
                            <CFormLabel className="fw-semibold">Téléphone Fixe</CFormLabel>
                            <CFormInput 
                                value={newOrg.telFixe} 
                                onChange={(e) => setNewOrg({...newOrg, telFixe: e.target.value})} 
                                placeholder="05 XX XX XX XX"
                            />
                        </CCol>
                        <CCol md={6} className="mb-3">
                            <CFormLabel className="fw-semibold">Téléphone GSM</CFormLabel>
                            <CFormInput 
                                value={newOrg.telGsm} 
                                onChange={(e) => setNewOrg({...newOrg, telGsm: e.target.value})} 
                                placeholder="06 XX XX XX XX"
                            />
                        </CCol>
                        <CCol md={6} className="mb-3">
                            <CFormLabel className="fw-semibold">Email Contact</CFormLabel>
                            <CFormInput 
                                type="email" 
                                value={newOrg.emailContact} 
                                onChange={(e) => setNewOrg({...newOrg, emailContact: e.target.value})} 
                                placeholder="contact@entreprise.com"
                            />
                        </CCol>
                        <CCol md={6} className="mb-3">
                            <CFormLabel className="fw-semibold">Site Web</CFormLabel>
                            <CFormInput 
                                value={newOrg.siteWeb} 
                                onChange={(e) => setNewOrg({...newOrg, siteWeb: e.target.value})} 
                                placeholder="https://www.entreprise.com"
                            />
                        </CCol>
                        <CCol md={12} className="mb-3">
                            <CFormLabel className="fw-semibold">Description</CFormLabel>
                            <CFormTextarea 
                                value={newOrg.description} 
                                onChange={(e) => setNewOrg({...newOrg, description: e.target.value})} 
                                rows="2"
                                placeholder="Brève description de l'organisation..."
                            />
                        </CCol>
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" variant="ghost" onClick={() => setVisible(false)}>Annuler</CButton>
                    <CButton color="primary" onClick={handleCreateWorkspace} disabled={isSubmitting || !newOrg.name}>
                        {isSubmitting ? <CSpinner size="sm" /> : "Créer l'espace"}
                    </CButton>
                </CModalFooter>
            </CModal>
        </>
    );
};

export default Workspaces;