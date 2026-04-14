import React, { useState } from 'react';
import {
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CFormTextarea,
  CFormLabel,
  CButton,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CCardFooter,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPrint, cilPen, cilChartPie, cilWallet, cilSave } from '@coreui/icons';

const BusinessPlan: React.FC = () => {
  const [activeTab, setActiveTab] = useState('resume');
  const [sections, setSections] = useState({
    resume: '',
    marche: '',
    finance: '',
  });

  const handleTextareaChange = (section: keyof typeof sections, value: string) => {
    setSections({ ...sections, [section]: value });
  };

  const handleExport = () => {
    alert('Génération du PDF en cours...');
  };

  const handleSave = () => {
    alert('Brouillon sauvegardé avec succès !');
  };

  return (
    <div style={{ padding: 24 }}>
      <h2 className="mb-4">Générateur de Business Plan</h2>

      <CCard className="shadow-sm border-0">
        <CCardHeader className="bg-gray-100 p-0 border-bottom">
          <CNav variant="tabs" className="border-0 px-3 pt-3">
            <CNavItem>
              <CNavLink 
                active={activeTab === 'resume'} 
                onClick={() => setActiveTab('resume')}
                style={{ cursor: 'pointer' }}
              >
                <CIcon icon={cilPen} className="me-2" /> Résumé Exécutif
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink 
                active={activeTab === 'marche'} 
                onClick={() => setActiveTab('marche')}
                style={{ cursor: 'pointer' }}
              >
                <CIcon icon={cilChartPie} className="me-2" /> Analyse du Marché
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink 
                active={activeTab === 'finance'} 
                onClick={() => setActiveTab('finance')}
                style={{ cursor: 'pointer' }}
              >
                <CIcon icon={cilWallet} className="me-2" /> Prévisions Financières
              </CNavLink>
            </CNavItem>
          </CNav>
        </CCardHeader>

        <CCardBody className="p-4">
          <CTabContent>
            <CTabPane visible={activeTab === 'resume'}>
              <CFormLabel className="fw-semibold fs-5 text-primary mb-3">1. Le Résumé exécutif (Executive Summary)</CFormLabel>
              <p className="text-muted small mb-3">Décrivez brièvement votre projet, votre équipe, et votre proposition de valeur. Cela doit donner envie d'en savoir plus.</p>
              <CFormTextarea
                rows={12}
                value={sections.resume}
                onChange={(e) => handleTextareaChange('resume', e.target.value)}
                placeholder="Ex: Notre entreprise propose une solution innovante de..."
                className="bg-gray-50"
              />
            </CTabPane>

            <CTabPane visible={activeTab === 'marche'}>
              <CFormLabel className="fw-semibold fs-5 text-primary mb-3">2. L'Étude de Marché</CFormLabel>
              <p className="text-muted small mb-3">Analysez vos clients cibles, vos concurrents directs et indirects, et les tendances de votre secteur.</p>
              <CFormTextarea
                rows={12}
                value={sections.marche}
                onChange={(e) => handleTextareaChange('marche', e.target.value)}
                placeholder="Ex: Le marché cible se compose principalement de..."
                className="bg-gray-50"
              />
            </CTabPane>

            <CTabPane visible={activeTab === 'finance'}>
              <CFormLabel className="fw-semibold fs-5 text-primary mb-3">3. Modèle Économique & Finances</CFormLabel>
              <p className="text-muted small mb-3">Détaillez comment vous allez générer des revenus, vos coûts fixes/variables, et votre besoin de financement initial.</p>
              <CFormTextarea
                rows={12}
                value={sections.finance}
                onChange={(e) => handleTextareaChange('finance', e.target.value)}
                placeholder="Ex: Nos sources de revenus proviendront de..."
                className="bg-gray-50"
              />
            </CTabPane>
          </CTabContent>
        </CCardBody>

        <CCardFooter className="bg-gray-100 border-top d-flex justify-content-end p-3">
          <CButton color="secondary" variant="outline" className="me-2 d-flex align-items-center" onClick={handleSave}>
            <CIcon icon={cilSave} className="me-2" /> Sauvegarder le brouillon
          </CButton>
          <CButton color="primary" className="d-flex align-items-center" onClick={handleExport}>
            <CIcon icon={cilPrint} className="me-2" /> Exporter en PDF
          </CButton>
        </CCardFooter>
      </CCard>
    </div>
  );
};

export default BusinessPlan;