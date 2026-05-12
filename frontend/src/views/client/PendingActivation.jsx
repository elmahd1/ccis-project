// src/views/auth/PendingActivation.jsx
import React from 'react';
import { CCard, CCardBody, CCardHeader, CCol, CRow, CButton, CAlert } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilClock, cilEnvelopeOpen, cilArrowLeft } from '@coreui/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PendingActivation = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    return (
        <CRow className="justify-content-center min-vh-100 align-items-center">
            <CCol md={8} lg={6}>
                <CCard className="shadow-lg text-center">
                    <CCardHeader className="bg-warning text-dark py-4">
                        <CIcon icon={cilClock} size="3xl" />
                        <h3 className="mt-2 mb-0">Compte en attente d'activation</h3>
                    </CCardHeader>
                    <CCardBody className="p-4">
                        <p className="lead">
                            Votre compte a été créé avec succès et est en attente d'activation par un employé.
                        </p>
                        
                        <CAlert color="info" className="mt-3">
                            <CIcon icon={cilEnvelopeOpen} className="me-2" />
                            Vous recevrez un email de confirmation dès que votre compte sera activé.
                        </CAlert>
                        
                        <p className="text-muted mt-4">
                            En attendant, vous pouvez consulter votre messagerie pour suivre l'évolution de votre demande.
                        </p>
                        
                        <hr className="my-4" />
                        
                        <CButton 
                            color="secondary" 
                            variant="outline"
                            onClick={() => {
                                logout();
                                navigate('/login');
                            }}
                        >
                            <CIcon icon={cilArrowLeft} className="me-2" />
                            Retour à la connexion
                        </CButton>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};

export default PendingActivation;