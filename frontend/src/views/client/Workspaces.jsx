import React, { useState, useEffect } from 'react';
import {
    CRow, CCol, CCard, CCardBody, CCardTitle, CCardText, CButton,
    CSpinner, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter,
    CFormInput, CFormSelect, CBadge, CFormTextarea, CFormLabel, CFormCheck
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilBuilding, cilArrowRight, cilBriefcase, cilInstitution, cilPencil, cilUserPlus, cilTrash } from '@coreui/icons';
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
    const [currentStep, setCurrentStep] = useState(1); // 1: Type selection, 2: Form

    // Check if user can create organization
    const canCreateOrganization = isActive;

    const [newOrg, setNewOrg] = useState({ 
        // Step 1
        type: 'ENTREPRISE',
        // Step 2 - Common fields
        name: '',
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
        description: '',
        // Association specific
        isOfficiallyCreated: false,
        // Members for association (not yet created)
        membre1: '',
        membre2: '',
        membre3: ''
    });

    useEffect(() => {
        if (user?.id) {
            fetchWorkspaces();
        }
    }, [user]);

const [deleteConfirm, setDeleteConfirm] = useState({ visible: false, orgId: null, orgName: '' });
const [deleting, setDeleting] = useState(false);


const fetchWorkspaces = async () => {
    try {
        setLoading(true);
        //  this:
        // const response = await axiosInstance.get(`/organizations/user/${user?.id}`);
        // To this:
const response = await axiosInstance.get(`/organizations/user/${user?.id}`);
        console.log("Workspaces fetched:", response.data);
        setWorkspaces(response.data);
    } catch (error) {
        console.error("Erreur lors de la récupération des espaces", error);
        if (error.response?.status === 403) {
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
            // Prepare payload based on organization type
            const payload = { ...newOrg };
            
            // For ASSOCIATION: remove fields that are not relevant
            if (newOrg.type === 'ASSOCIATION') {
                // Delete business-specific fields
                delete payload.ice;
                delete payload.formeJuridique;
                delete payload.secteurActivite;
                delete payload.taille;
                
                // For associations that are NOT officially created, add members
                if (!newOrg.isOfficiallyCreated) {
                    const members = [newOrg.membre1, newOrg.membre2, newOrg.membre3]
                        .filter(m => m && m.trim());
                    if (members.length > 0) {
                        payload.membres = members;
                    }
                }
            }
            
            // Remove member fields that are not needed for backend
            delete payload.membre1;
            delete payload.membre2;
            delete payload.membre3;
            
            console.log("Sending payload:", payload);
            
            await axiosInstance.post(`/organizations/create?userId=${user?.id}`, payload);
            setVisible(false);
            resetForm();
            fetchWorkspaces();
        } catch (error) {
            console.error("Erreur lors de la création", error);
            setError(error.response?.data?.error || error.response?.data || "Erreur lors de la création de l'organisation");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteOrganization = async (orgId) => {
    setDeleting(true);
    try {
        await axiosInstance.delete(`/organizations/${orgId}`, {
            params: { userId: user?.id }
        });
        // Refresh workspaces list
        await fetchWorkspaces();
        setDeleteConfirm({ visible: false, orgId: null, orgName: '' });
    } catch (error) {
        console.error("Error deleting organization:", error);
        alert(error.response?.data?.error || "Erreur lors de la suppression de l'organisation");
    } finally {
        setDeleting(false);
    }
};

    const resetForm = () => {
        setNewOrg({ 
            type: 'ENTREPRISE',
            name: '',
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
            description: '',
            isOfficiallyCreated: false,
            membre1: '',
            membre2: '',
            membre3: ''
        });
        setCurrentStep(1);
    };

    const handleTypeSelect = (type) => {
        setNewOrg(prev => ({ ...prev, type }));
        setCurrentStep(2);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewOrg(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value 
        }));
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

    // Render type selection step
    const renderTypeSelection = () => (
        <CRow className="g-4">
            <CCol md={6}>
                <CCard 
                    className="text-center h-100 cursor-pointer border-primary border-2"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleTypeSelect('ENTREPRISE')}
                >
                    <CCardBody className="py-5">
                        <CIcon icon={cilBriefcase} size="3xl" className="text-info mb-3" />
                        <h4>Entreprise</h4>
                        <p className="text-muted">
                            Société commerciale, SARL, SA, Auto-entrepreneur...
                        </p>
                        <CBadge color="info">Sélectionner</CBadge>
                    </CCardBody>
                </CCard>
            </CCol>
            <CCol md={6}>
                <CCard 
                    className="text-center h-100 cursor-pointer"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleTypeSelect('ASSOCIATION')}
                >
                    <CCardBody className="py-5">
                        <CIcon icon={cilInstitution} size="3xl" className="text-success mb-3" />
                        <h4>Association</h4>
                        <p className="text-muted">
                            Association à but non lucratif, ONG, Fondation...
                        </p>
                        <CBadge color="success">Sélectionner</CBadge>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );

    // Render association status selection (for ASSOCIATION type)
    const renderAssociationStatus = () => (
        <div className="mb-4">
            <CFormLabel className="fw-semibold">Statut de l'association</CFormLabel>
            <div className="d-flex gap-4 mt-2">
                <CFormCheck
                    id="officiallyCreated"
                    label="Association déjà créée"
                    checked={newOrg.isOfficiallyCreated === true}
                    onChange={() => setNewOrg(prev => ({ ...prev, isOfficiallyCreated: true }))}
                />
                <CFormCheck
                    id="notOfficiallyCreated"
                    label="Association en cours de création"
                    checked={newOrg.isOfficiallyCreated === false}
                    onChange={() => setNewOrg(prev => ({ ...prev, isOfficiallyCreated: false }))}
                />
            </div>
            <small className="text-muted">
                {newOrg.isOfficiallyCreated 
                    ? "Vous êtes le président/fondateur de l'association déjà déclarée."
                    : "Vous êtes le promoteur de l'association en cours de constitution. Vous pouvez ajouter d'autres membres fondateurs."}
            </small>
        </div>
    );

    // Render members section (only for associations NOT officially created)
    const renderMembersSection = () => {
        if (newOrg.type !== 'ASSOCIATION' || newOrg.isOfficiallyCreated) return null;
        
        return (
            <>
                <hr className="my-4" />
                <h5 className="mb-3">
                    <CIcon icon={cilUserPlus} className="me-2" />
                    Membres fondateurs
                </h5>
                <p className="small text-muted mb-3">
                    Vous êtes considéré comme le président/fondateur. Vous pouvez ajouter jusqu'à 2 autres membres fondateurs.
                </p>
                <CRow>
                    <CCol md={12} className="mb-3">
                        <CFormInput
                            label="Membre fondateur 1 (Vous - Président) *"
                            value={user?.prenom && user?.nom ? `${user.prenom} ${user.nom}` : user?.username}
                            disabled
                            readOnly
                        />
                        <small className="text-muted">Votre compte est automatiquement ajouté comme président</small>
                    </CCol>
                    <CCol md={6} className="mb-3">
                        <CFormInput
                            name="membre1"
                            label="Membre fondateur 2"
                            value={newOrg.membre1}
                            onChange={handleInputChange}
                            placeholder="Nom et prénom du deuxième membre"
                        />
                    </CCol>
                    <CCol md={6} className="mb-3">
                        <CFormInput
                            name="membre2"
                            label="Membre fondateur 3"
                            value={newOrg.membre2}
                            onChange={handleInputChange}
                            placeholder="Nom et prénom du troisième membre"
                        />
                    </CCol>
                </CRow>
            </>
        );
    };

    // Render form fields (common for both types)
    const renderFormFields = () => (
        <>
            <CRow>
                <CCol md={12} className="mb-3">
                    <CFormLabel className="fw-semibold">Nom *</CFormLabel>
                    <CFormInput 
                        name="name"
                        value={newOrg.name} 
                        onChange={handleInputChange} 
                        placeholder="Nom de l'organisation"
                        required 
                    />
                </CCol>
                
                {/* Fields for ENTREPRISE only */}
                {newOrg.type === 'ENTREPRISE' && (
                    <>
                        <CCol md={6} className="mb-3">
                            <CFormLabel className="fw-semibold">ICE</CFormLabel>
                            <CFormInput 
                                name="ice"
                                value={newOrg.ice} 
                                onChange={handleInputChange} 
                                placeholder="Identifiant Commun de l'Entreprise"
                            />
                        </CCol>
                        <CCol md={6} className="mb-3">
                            <CFormLabel className="fw-semibold">Forme Juridique</CFormLabel>
                            <CFormInput 
                                name="formeJuridique"
                                value={newOrg.formeJuridique} 
                                onChange={handleInputChange} 
                                placeholder="SARL, SA, Auto-entrepreneur..."
                            />
                        </CCol>
                        <CCol md={6} className="mb-3">
                            <CFormLabel className="fw-semibold">Secteur d'Activité</CFormLabel>
                            <CFormInput 
                                name="secteurActivite"
                                value={newOrg.secteurActivite} 
                                onChange={handleInputChange} 
                                placeholder="Tech, Commerce, Agriculture..."
                            />
                        </CCol>
                        <CCol md={6} className="mb-3">
                            <CFormLabel className="fw-semibold">Taille</CFormLabel>
                            <CFormSelect 
                                name="taille"
                                value={newOrg.taille} 
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
                        value={newOrg.activite} 
                        onChange={handleInputChange} 
                        placeholder="Description détaillée de l'activité"
                    />
                </CCol>
                <CCol md={6} className="mb-3">
                    <CFormLabel className="fw-semibold">Ville</CFormLabel>
                    <CFormInput 
                        name="ville"
                        value={newOrg.ville} 
                        onChange={handleInputChange} 
                        placeholder="Casablanca, Rabat, Marrakech..."
                    />
                </CCol>
                <CCol md={12} className="mb-3">
                    <CFormLabel className="fw-semibold">Adresse Siège</CFormLabel>
                    <CFormInput 
                        name="adresse"
                        value={newOrg.adresse} 
                        onChange={handleInputChange} 
                        placeholder="Adresse complète"
                    />
                </CCol>
                <CCol md={6} className="mb-3">
                    <CFormLabel className="fw-semibold">Téléphone Fixe</CFormLabel>
                    <CFormInput 
                        name="telFixe"
                        value={newOrg.telFixe} 
                        onChange={handleInputChange} 
                        placeholder="05 XX XX XX XX"
                    />
                </CCol>
                <CCol md={6} className="mb-3">
                    <CFormLabel className="fw-semibold">Téléphone GSM</CFormLabel>
                    <CFormInput 
                        name="telGsm"
                        value={newOrg.telGsm} 
                        onChange={handleInputChange} 
                        placeholder="06 XX XX XX XX"
                    />
                </CCol>
                <CCol md={6} className="mb-3">
                    <CFormLabel className="fw-semibold">Email Contact</CFormLabel>
                    <CFormInput 
                        type="email"
                        name="emailContact"
                        value={newOrg.emailContact} 
                        onChange={handleInputChange} 
                        placeholder="contact@entreprise.com"
                    />
                </CCol>
                <CCol md={6} className="mb-3">
                    <CFormLabel className="fw-semibold">Site Web</CFormLabel>
                    <CFormInput 
                        name="siteWeb"
                        value={newOrg.siteWeb} 
                        onChange={handleInputChange} 
                        placeholder="https://www.entreprise.com"
                    />
                </CCol>
                <CCol md={12} className="mb-3">
                    <CFormLabel className="fw-semibold">Description</CFormLabel>
                    <CFormTextarea 
                        name="description"
                        value={newOrg.description} 
                        onChange={handleInputChange} 
                        rows="2"
                        placeholder="Brève description de l'organisation..."
                    />
                </CCol>
            </CRow>
        </>
    );

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
                                            <CButton 
                                                color="danger" 
                                                size="sm" 
                                                variant="ghost" 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setDeleteConfirm({ visible: true, orgId: org.id, orgName: org.name });
                                                }}
                                                title="Supprimer l'organisation"
                                            >
                                                <CIcon icon={cilTrash} />
                                            </CButton>
                                        </div>
                                    </div>
                                    <CCardTitle className="mb-2 fs-5 fw-bold">{org.name}</CCardTitle>
<div className="small text-muted mb-3">
    {org.ville && <div>📍 {org.ville}</div>}
    
    {/* Entreprise specific fields */}
    {org.type === 'ENTREPRISE' && (
        <>
            {org.ice && <div>🆔 ICE: {org.ice}</div>}
            {org.formeJuridique && <div>⚖️ {org.formeJuridique}</div>}
            {org.secteurActivite && <div>📊 {org.secteurActivite}</div>}
            {org.taille && <div>📏 Taille: {org.taille}</div>}
            {org.activite && <div>📋 Activité: {org.activite}</div>}
        </>
    )}
    
    {/* Association specific fields */}
    {org.type === 'ASSOCIATION' && (
        <>
            <div>{org.officiallyCreated ? '✅ Association déclarée' : '📝 En constitution'}</div>
            {org.activite && <div>📋 {org.activite}</div>}
        </>
    )}
    
    {/* Contact info */}
    {org.telGsm && <div>📱 {org.telGsm}</div>}
    {org.emailContact && <div>📧 {org.emailContact}</div>}
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

            {/* Create Organization Modal */}
            <CModal visible={visible} onClose={() => { setVisible(false); resetForm(); }} alignment="center" size="lg">
                <CModalHeader onClose={() => { setVisible(false); resetForm(); }}>
                    <CModalTitle>
                        {currentStep === 1 ? "Type d'organisation" : `Nouvelle ${newOrg.type === 'ASSOCIATION' ? 'Association' : 'Entreprise'}`}
                    </CModalTitle>
                </CModalHeader>
                <CModalBody>
                    {error && <div className="alert alert-danger">{error}</div>}
                    
                    {currentStep === 1 ? (
                        renderTypeSelection()
                    ) : (
                        <>
                            {/* Back button */}
                            <CButton 
                                color="link" 
                                className="mb-3 p-0"
                                onClick={() => setCurrentStep(1)}
                            >
                                ← Changer le type
                            </CButton>
                            
                            {/* Association specific: ask if already created */}
                            {newOrg.type === 'ASSOCIATION' && renderAssociationStatus()}
                            
                            {/* Form fields (with conditional fields for ENTREPRISE) */}
                            {renderFormFields()}
                            
                            {/* Members section (only for association not yet created) */}
                            {renderMembersSection()}
                        </>
                    )}
                </CModalBody>
                <CModalFooter>
                    {currentStep === 1 ? (
                        <>
                            <CButton color="secondary" variant="ghost" onClick={() => { setVisible(false); resetForm(); }}>
                                Annuler
                            </CButton>
                        </>
                    ) : (
                        <>
                            <CButton color="secondary" variant="ghost" onClick={() => setCurrentStep(1)}>
                                Retour
                            </CButton>
                            <CButton color="primary" onClick={handleCreateWorkspace} disabled={isSubmitting || !newOrg.name}>
                                {isSubmitting ? <CSpinner size="sm" /> : "Créer l'espace"}
                            </CButton>
                        </>
                    )}
                </CModalFooter>
            </CModal>
            <CModal 
    visible={deleteConfirm.visible} 
    onClose={() => setDeleteConfirm({ visible: false, orgId: null, orgName: '' })}
    alignment="center"
>
    <CModalHeader>
        <CModalTitle>Confirmer la suppression</CModalTitle>
    </CModalHeader>
    <CModalBody>
        <p>Êtes-vous sûr de vouloir supprimer l'organisation <strong>{deleteConfirm.orgName}</strong> ?</p>
        <p className="text-danger">Cette action supprimera également toutes les demandes associées et ne peut pas être annulée.</p>
    </CModalBody>
    <CModalFooter>
        <CButton 
            color="secondary" 
            onClick={() => setDeleteConfirm({ visible: false, orgId: null, orgName: '' })}
        >
            Annuler
        </CButton>
        <CButton 
            color="danger" 
            onClick={() => handleDeleteOrganization(deleteConfirm.orgId)}
            disabled={deleting}
        >
            {deleting ? <CSpinner size="sm" /> : "Supprimer"}
        </CButton>
    </CModalFooter>
</CModal>
        </>
    );
};

export default Workspaces;