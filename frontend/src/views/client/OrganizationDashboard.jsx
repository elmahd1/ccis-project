import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    CRow, CCol, CCard, CCardBody, CCardTitle, CCardText, CButton,
    CSpinner, CBadge, CTable, CTableHead, CTableRow, CTableHeaderCell, 
    CTableBody, CTableDataCell, CCardHeader
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { 
    cilBriefcase, cilInstitution, cilFile, 
    cilArrowLeft, cilDescription, cilHistory, cilBuilding,
    cilInfo, cilPeople
} from '@coreui/icons';
import axiosInstance from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';

const OrganizationDashboard = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [organization, setOrganization] = useState(null);
    const [recentHistory, setRecentHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, [id]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            console.log("Fetching org with ID:", id);
            
            const orgResponse = await axiosInstance.get(`/organizations/${id}`);
            console.log("Org response:", orgResponse.data);
            setOrganization(orgResponse.data);

            const historyResponse = await axiosInstance.get(`/client/demandes/history/org/${id}`);
            const data = historyResponse.data;

            const combined = [
                ...(data.demarches || []).map(d => ({ ...d, typeLabel: "Fiche d'Accueil Ressortissant" })),
                ...(data.espaces || []).map(e => ({ ...e, typeLabel: 'Fiche de Renseignements' })),
                ...(data.salles || []).map(s => ({ ...s, typeLabel: 'Demande de Salle' }))
            ].sort((a, b) => new Date(b.createdAt || b.dateDepot) - new Date(a.createdAt || a.dateDepot));

            setRecentHistory(combined.slice(0, 5));
        } catch (error) {
            console.error("Erreur lors du chargement:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'VALIDE': return <CBadge color="success">Validée</CBadge>;
            case 'REJETE': return <CBadge color="danger">Rejetée</CBadge>;
            case 'EN_ATTENTE': return <CBadge color="warning">En attente</CBadge>;
            default: return <CBadge color="secondary">{status}</CBadge>;
        }
    };

    if (loading) {
        return (
            <div className="text-center p-5">
                <CSpinner color="primary" variant="grow" />
                <p className="mt-2">Chargement de votre espace...</p>
            </div>
        );
    }

    return (
        <>
            <div className="d-flex align-items-center mb-4">
                <CButton color="light" onClick={() => navigate('/client/workspaces')} className="me-3">
                    <CIcon icon={cilArrowLeft} />
                </CButton>
                <div className="flex-grow-1">
                    <h3 className="mb-0">{organization?.name}</h3>
                    <div className="d-flex gap-3 mt-1 flex-wrap">
                        <CBadge color="dark">ICE: {organization?.ice || 'N/A'}</CBadge>
                        <small className="text-muted">
                            <CIcon icon={cilBuilding} size="sm" /> 
                            {organization?.formeJuridique || 'Forme juridique non spécifiée'} — {organization?.ville || 'Ville non spécifiée'}
                        </small>
                        {organization?.secteurActivite && (
                            <small className="text-muted">
                                <CIcon icon={cilBriefcase} size="sm" /> {organization?.secteurActivite}
                            </small>
                        )}
                    </div>
                </div>
            </div>

            <CRow className="mb-4">
                {/* Fiche d'Accueil Ressortissant - formerly Demarches Administratives */}
                <CCol sm={6} lg={4}>
                    <CCard className="mb-4 border-top-info border-top-3 shadow-sm h-100">
                        <CCardBody className="text-center">
                            <div className="avatar avatar-lg bg-info-light mb-3">
                                <CIcon icon={cilDescription} size="xl" className="text-info" />
                            </div>
                            <CCardTitle>Fiche d'Accueil Ressortissant</CCardTitle>
                            <CCardText className="small text-muted">
                                Visas, certificats d'origine, attestations, cartes de séjour...
                            </CCardText>
                            <CButton 
                                color="info" 
                                className="text-white w-100" 
                                onClick={() => navigate(`/client/nouvelle-demande/ressortissant/${id}`)}
                            >
                                Nouvelle Fiche
                            </CButton>
                        </CCardBody>
                    </CCard>
                </CCol>

                {/* Fiche de Renseignements - formerly Espace Entreprise */}
                <CCol sm={6} lg={4}>
                    <CCard className="mb-4 border-top-success border-top-3 shadow-sm h-100">
                        <CCardBody className="text-center">
                            <div className="avatar avatar-lg bg-success-light mb-3">
                                <CIcon icon={cilInfo} size="xl" className="text-success" />
                            </div>
                            <CCardTitle>Fiche de Renseignements</CCardTitle>
                            <CCardText className="small text-muted">
                                Informations entreprise, accompagnement, conseils...
                            </CCardText>
                            <CButton 
                                color="success" 
                                className="text-white w-100" 
                                onClick={() => navigate(`/client/nouvelle-demande/renseignements/${id}`)}
                            >
                                Nouvelle Fiche
                            </CButton>
                        </CCardBody>
                    </CCard>
                </CCol>

                {/* Demande de Salle - unchanged */}
                <CCol sm={6} lg={4}>
                    <CCard className="mb-4 border-top-warning border-top-3 shadow-sm h-100">
                        <CCardBody className="text-center">
                            <div className="avatar avatar-lg bg-warning-light mb-3">
                                <CIcon icon={cilInstitution} size="xl" className="text-warning" />
                            </div>
                            <CCardTitle>Location de Salle</CCardTitle>
                            <CCardText className="small text-muted">
                                Salles de réunion, conférences, événements...
                            </CCardText>
                            <CButton 
                                color="warning" 
                                className="text-white w-100" 
                                onClick={() => navigate(`/client/nouvelle-demande/salle/${id}`)}
                            >
                                Demander une Salle
                            </CButton>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            <CCard className="shadow-sm">
                <CCardHeader className="bg-white d-flex justify-content-between align-items-center py-3">
                    <div className="fw-bold">
                        <CIcon icon={cilHistory} className="me-2" />
                        Demandes Récentes
                    </div>
                    <CButton 
                        color="link" 
                        size="sm" 
                        onClick={() => navigate(`/client/historique/${id}`)}
                    >
                        Voir tout l'historique
                    </CButton>
                </CCardHeader>
                <CCardBody>
                    {recentHistory.length === 0 ? (
                        <div className="text-center py-4 text-muted">
                            Aucune demande récente pour cette organisation.
                        </div>
                    ) : (
                        <CTable align="middle" responsive hover>
                            <CTableHead color="light">
                                <CTableRow>
                                    <CTableHeaderCell>Réf</CTableHeaderCell>
                                    <CTableHeaderCell>Type</CTableHeaderCell>
                                    <CTableHeaderCell>Date</CTableHeaderCell>
                                    <CTableHeaderCell>Statut</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {recentHistory.map((item) => (
                                    <CTableRow key={item.id}>
                                        <CTableDataCell className="fw-semibold">#{item.reference || item.id}</CTableDataCell>
                                        <CTableDataCell>{item.typeLabel}</CTableDataCell>
                                        <CTableDataCell>{new Date(item.createdAt || item.dateDepot).toLocaleDateString()}</CTableDataCell>
                                        <CTableDataCell>{getStatusBadge(item.status)}</CTableDataCell>
                                    </CTableRow>
                                ))}
                            </CTableBody>
                        </CTable>
                    )}
                </CCardBody>
            </CCard>
        </>
    );
};

export default OrganizationDashboard;